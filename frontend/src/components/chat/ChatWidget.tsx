"use client";

/**
 * 3TATTAVA floating chat widget.
 *
 * Streams responses from POST /api/chat (Server-Sent Events) on the
 * 3TATTAVA backend. Backend uses Claude Haiku 4.5 with the brand +
 * Ayurveda knowledge base as a cached system prompt.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, ChevronDown } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

/**
 * Lightweight inline-markdown renderer for assistant replies.
 * Handles **bold**, *italic*, and `code`. Newlines are preserved by the
 * surrounding `whitespace-pre-wrap` class. No HTML injection — we split
 * on regex and only emit React nodes.
 */
function renderMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Match **bold**, *italic*, or `code` (non-greedy).
  const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;
  let lastIdx = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push(text.slice(lastIdx, m.index));
    }
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-text-dark">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="rounded bg-[#efe9dd] px-1 py-0.5 text-[12px] font-mono text-text-dark"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      parts.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    lastIdx = re.lastIndex;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const GREETING: Msg = {
  role: "assistant",
  content:
    "Namaste — I'm the 3TATTAVA assistant. Ask me anything about Shilajit, Performance Ayurveda, or our products. I draw from Dr. Kashish's medical training and our published research.",
};

const SUGGESTED = [
  "What's the difference between Resin and Honey Sticks?",
  "Is Shilajit safe for women?",
  "How do I take Shilajit Resin?",
  "Why is fulvic acid important?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  // Whether the user has scrolled away from the bottom — drives the
  // "Jump to latest" pill that appears in the lower-right of the message list.
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Tracks whether the user is "stuck" near the bottom. If they've scrolled up
  // to read, we stop auto-snapping so they can read in peace.
  const stickToBottomRef = useRef(true);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    stickToBottomRef.current = true;
    setShowJumpToLatest(false);
  }, []);

  // Track scroll position to decide if we should keep auto-scrolling.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const stuck = distanceFromBottom < 60;
    stickToBottomRef.current = stuck;
    setShowJumpToLatest(!stuck);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, open, streaming]);

  // When the chat opens, snap to the bottom (don't show old messages cut off).
  useEffect(() => {
    if (open) scrollToBottom(false);
  }, [open, scrollToBottom]);

  const send = useCallback(
    async (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed || streaming) return;

      const next: Msg[] = [...messages, { role: "user", content: trimmed }];
      setMessages(next);
      setInput("");
      setStreaming(true);

      // Append empty assistant slot we'll stream into.
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // Parse Server-Sent Events.
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let idx;
          while ((idx = buffer.indexOf("\n\n")) !== -1) {
            const raw = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);

            const lines = raw.split("\n");
            let eventName = "message";
            let dataLine = "";
            for (const line of lines) {
              if (line.startsWith("event:")) {
                eventName = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                dataLine += line.slice(5).trim();
              }
            }
            if (!dataLine) continue;
            try {
              const payload = JSON.parse(dataLine);
              if (eventName === "delta" && payload.text) {
                setMessages((m) => {
                  const copy = [...m];
                  const last = copy[copy.length - 1];
                  if (last && last.role === "assistant") {
                    copy[copy.length - 1] = {
                      ...last,
                      content: last.content + payload.text,
                    };
                  }
                  return copy;
                });
              } else if (eventName === "error") {
                setMessages((m) => {
                  const copy = [...m];
                  copy[copy.length - 1] = {
                    role: "assistant",
                    content:
                      payload.error ||
                      "Something went wrong. Please try again.",
                  };
                  return copy;
                });
              }
            } catch {
              /* ignore malformed event */
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last && last.role === "assistant" && last.content === "") {
            copy[copy.length - 1] = {
              role: "assistant",
              content:
                "I couldn't reach the 3TATTAVA assistant just now. Please try again in a moment, or email care@3tattava.com.",
            };
          }
          return copy;
        });
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-primary-green text-white shadow-[0_10px_30px_rgba(92,64,51,0.4)] hover:bg-secondary-green transition-colors"
        aria-label={open ? "Close 3TATTAVA chat" : "Open 3TATTAVA chat"}
      >
        {open ? (
          <X size={22} aria-hidden />
        ) : (
          <MessageCircle size={22} aria-hidden />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-label="3TATTAVA chat"
            data-lenis-prevent
            className="fixed bottom-24 right-5 z-[60] flex w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_60px_rgba(24,24,24,0.18)]"
            style={{ height: "min(640px, calc(100dvh - 7rem))" }}
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 bg-[#241e18] px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">3TATTAVA Assistant</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/65">
                    Doctor-Reviewed Knowledge
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-white/80 hover:text-white"
                aria-label="Close chat"
              >
                <X size={16} aria-hidden />
              </button>
            </header>

            {/* Messages — the wrapper is relative so the "jump to latest" pill can pin to it. */}
            <div className="relative flex-1 min-h-0 bg-[#fdfbf7]">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="chatbox-scroll absolute inset-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-3"
                style={{ WebkitOverflowScrolling: "touch" }}
                tabIndex={0}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                // Tell Lenis (smooth-scroll provider) to leave this element alone
                // so native scrolling works inside the chat widget.
                data-lenis-prevent
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        m.role === "user"
                          ? "bg-primary-green text-white rounded-br-md"
                          : "bg-white text-text-dark border border-border rounded-bl-md"
                      }`}
                    >
                      {m.content ? (
                        m.role === "assistant" ? renderMarkdown(m.content) : m.content
                      ) : (
                        <Loader2 size={14} className="animate-spin text-text-light" aria-label="Thinking" />
                      )}
                    </div>
                  </div>
                ))}

                {messages.length === 1 && !streaming ? (
                  <div className="pt-2 space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-text-light">
                      Try asking
                    </p>
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className="block w-full text-left rounded-xl border border-border bg-white px-3 py-2 text-sm text-text-dark hover:border-gold transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Jump-to-latest pill — only shows when user has scrolled up */}
              <AnimatePresence>
                {showJumpToLatest ? (
                  <motion.button
                    type="button"
                    onClick={() => scrollToBottom(true)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-primary-green text-white px-3 py-1.5 text-xs shadow-[0_6px_20px_rgba(92,64,51,0.25)] hover:bg-secondary-green transition-colors"
                    aria-label="Jump to latest message"
                  >
                    <ChevronDown size={14} aria-hidden />
                    Jump to latest
                  </motion.button>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border bg-white px-3 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Shilajit, Ayurveda, dosing..."
                className="flex-1 rounded-full border border-border bg-[#faf7f2] px-4 py-2 text-sm text-text-dark placeholder-text-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                disabled={streaming}
                aria-label="Your message"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-green text-white disabled:opacity-50 hover:bg-secondary-green transition-colors"
                aria-label="Send message"
              >
                {streaming ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                ) : (
                  <Send size={16} aria-hidden />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
