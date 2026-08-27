/**
 * POST /api/chat
 *
 * Streams a Claude response for the 3TATTAVA Ayurveda assistant.
 * - Uses Claude Haiku 4.5 (fast, cheap) with prompt caching on the system prompt.
 * - Streams via Server-Sent Events. Client consumes with EventSource / fetch+ReadableStream.
 * - Rate-limited (30 requests / 5 min per IP) to stop abuse.
 */

const express = require("express");
const rateLimit = require("express-rate-limit");
const Anthropic = require("@anthropic-ai/sdk");
const { CHAT_SYSTEM_PROMPT } = require("../chat/knowledge-base");
const mailer = require("../lib/mailer");

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many chat requests. Slow down a bit." },
});

const MAX_USER_MSG_LEN = 2000;
const MAX_HISTORY_TURNS = 12;

// ─── Failure handling (issue D5) ─────────────────────────────────────────────
// When Anthropic credits run out or the key is rejected, the assistant fails
// for every customer until someone tops up. Previously this only logged to the
// server and showed a misleading "try again". Now we classify the failure, show
// a graceful fallback with a real contact, and email the owner (throttled) so a
// dead assistant can't go unnoticed for days.
const CHAT_ALERT_EMAIL = process.env.CHAT_ALERT_EMAIL || "support@3tattava.com";
const CHAT_ALERT_THROTTLE_MS = 60 * 60 * 1000;
let _lastChatAlertAt = 0;

function classifyChatError(err) {
  const status = err?.status;
  const msg = String(err?.error?.error?.message || err?.error?.message || err?.message || "");
  const isBilling = status === 400 && /credit balance|billing|quota|insufficient/i.test(msg);
  const isAuth = status === 401 || status === 403;
  if (isBilling || isAuth) {
    return {
      persistent: true,
      reason: isBilling ? "credit/billing" : "auth",
      msg,
      customer:
        "Our assistant is briefly unavailable. Please reach us on WhatsApp (+91 95601 49956) " +
        "or email support@3tattava.com and we'll help right away.",
    };
  }
  return {
    persistent: false,
    reason: `transient (status ${status ?? "n/a"})`,
    msg,
    customer:
      "Our assistant is having a brief hiccup. Please try again in a moment, or email support@3tattava.com.",
  };
}

async function alertOwnerChatDown(info) {
  const now = Date.now();
  if (now - _lastChatAlertAt < CHAT_ALERT_THROTTLE_MS) return;
  _lastChatAlertAt = now;
  const body =
    `The website chat assistant failed with a ${info.reason} error and is not answering customers.\n\n` +
    `Error: ${info.msg || "(no message)"}\n\n` +
    (info.reason === "credit/billing"
      ? "Likely cause: Anthropic credits exhausted. Top up at https://console.anthropic.com/settings/billing to restore chat.\n"
      : "Check ANTHROPIC_API_KEY and the Anthropic account status.\n") +
    "\nCustomers currently see a fallback pointing to WhatsApp/email. This alert is throttled to once per hour.";
  try {
    await mailer.send({ to: CHAT_ALERT_EMAIL, subject: "[ALERT] 3TATTAVA chat assistant is down", text: body });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[chat] owner alert email failed:", e.message);
  }
}

/**
 * Validate + normalize the incoming messages array.
 * Expected shape: [{ role: "user" | "assistant", content: string }, ...]
 */
function sanitizeMessages(body) {
  if (!body || !Array.isArray(body.messages)) {
    throw new Error("Missing messages[] in request body.");
  }
  const messages = body.messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({
      role: m.role,
      content: String(m.content).slice(0, MAX_USER_MSG_LEN),
    }));

  if (messages.length === 0) {
    throw new Error("messages[] is empty after filtering.");
  }
  if (messages[messages.length - 1].role !== "user") {
    throw new Error("Last message must be from the user.");
  }
  return messages;
}

router.post("/", chatLimiter, async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res
      .status(503)
      .json({ error: "Chat is not configured on the server yet." });
  }

  let messages;
  try {
    messages = sanitizeMessages(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  const send = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let aborted = false;
  req.on("close", () => {
    aborted = true;
  });

  try {
    const stream = await client.messages.stream({
      model: process.env.ANTHROPIC_CHAT_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: [
        {
          type: "text",
          text: CHAT_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    for await (const event of stream) {
      if (aborted) break;
      if (
        event.type === "content_block_delta" &&
        event.delta?.type === "text_delta" &&
        typeof event.delta.text === "string"
      ) {
        send("delta", { text: event.delta.text });
      }
    }

    if (!aborted) {
      const final = await stream.finalMessage();
      send("done", {
        usage: final.usage
          ? {
              input: final.usage.input_tokens,
              output: final.usage.output_tokens,
              cacheCreation: final.usage.cache_creation_input_tokens,
              cacheRead: final.usage.cache_read_input_tokens,
            }
          : null,
      });
    }
  } catch (err) {
    const info = classifyChatError(err);
    // eslint-disable-next-line no-console
    console.error(`[chat] stream error (${info.reason}):`, info.msg || err);
    if (info.persistent) {
      // Fire-and-forget: a broken assistant must page the owner, not just log.
      alertOwnerChatDown(info);
    }
    if (!aborted) {
      send("error", { error: info.customer });
    }
  } finally {
    res.end();
  }
});

module.exports = router;
module.exports.classifyChatError = classifyChatError;
