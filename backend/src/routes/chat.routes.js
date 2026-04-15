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
    // eslint-disable-next-line no-console
    console.error("[chat] stream error:", err?.message || err);
    if (!aborted) {
      send("error", {
        error: "Chat stream failed. Please try again.",
      });
    }
  } finally {
    res.end();
  }
});

module.exports = router;
