import React, { useEffect, useRef, useState } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { API } from "../lib/api";
import { LOGO_MONOGRAM } from "../lib/assets";

const SUGGESTIONS = [
  "What is Performance Ayurveda?",
  "Which ritual should I start with?",
  "Is RockResin safe for women?",
  "How is Shahjeet different from RockResin?",
];

// Lightweight markdown: **bold**, [label](href), single newlines.
function renderRich(text) {
  if (!text) return text;
  const escape = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  let html = escape(text);
  // [label](url) — internal links use react-router-friendly anchor, external opens new tab
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const external = /^https?:\/\//i.test(href);
    return `<a href="${href}" ${external ? 'target="_blank" rel="noreferrer"' : ""} style="color:#A67B2F;text-decoration:underline;text-underline-offset:3px;">${label}</a>`;
  });
  // **bold**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700;color:#1c1304;">$1</strong>');
  // *italic*
  html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  // line breaks
  html = html.replace(/\n/g, "<br/>");
  return html;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste. I'm the 3Tattava Concierge. How can I guide your ritual today?" },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId] = useState(() => {
    const k = "3tattava_chat_sid";
    let v = localStorage.getItem(k);
    if (!v) { v = crypto.randomUUID(); localStorage.setItem(k, v); }
    return v;
  });
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || streaming) return;
    setInput("");
    const history = messages.filter((m) => m.role !== "system");
    setMessages((m) => [...m, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const res = await fetch(`${API}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ session_id: sessionId, message: msg, history }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).replace(/^\s/, ""); // drop only the single optional space per SSE spec
          if (!raw || raw === "[DONE]") continue;
          let token;
          try {
            const obj = JSON.parse(raw);
            token = typeof obj.t === "string" ? obj.t : "";
          } catch {
            token = raw;
          }
          if (!token) continue;
          setMessages((m) => {
            const next = [...m];
            next[next.length - 1] = { ...next[next.length - 1], content: next[next.length - 1].content + token };
            return next;
          });
        }
      }
    } catch (e) {
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = { role: "assistant", content: "I'm offline right now. Please reach out to care@3tattava.com." };
        return next;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="chatbot-launcher"
        aria-label="Open 3Tattava Concierge"
        className="fixed bottom-6 right-6 z-[70] w-14 h-14 md:w-16 md:h-16 rounded-full bg-ink shadow-[0_18px_40px_rgba(28,19,4,0.4)] border-2 border-gold/40 flex items-center justify-center hover:scale-110 transition-all duration-300 group"
      >
        {open ? (
          <X size={22} className="text-gold" />
        ) : (
          <>
            <img src={LOGO_MONOGRAM} alt="" className="w-7 h-7 md:w-8 md:h-8" style={{ filter: "invert(1) brightness(1.05)" }} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse" />
          </>
        )}
      </button>

      {/* Panel */}
      <div
        data-testid="chatbot-panel"
        className={`fixed bottom-24 right-6 z-[70] w-[min(94vw,400px)] h-[min(78vh,580px)] bg-cream border border-gold/30 shadow-[0_24px_80px_rgba(28,19,4,0.35)] transition-all duration-500 origin-bottom-right ${open ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"} flex flex-col`}
      >
        {/* Header */}
        <div className="bg-ink text-cream px-5 py-4 flex items-center gap-3 border-b border-gold/30">
          <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center bg-ink">
            <img src={LOGO_MONOGRAM} alt="" className="w-6 h-6" style={{ filter: "invert(1) brightness(1.05)" }} />
          </div>
          <div className="flex-1">
            <div className="font-display text-base" style={{ fontVariationSettings: "'wdth' 90, 'wght' 700" }}>3Tattava Concierge</div>
            <div className="eyebrow text-[9px] text-gold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> Online · Powered by Claude</div>
          </div>
          <Sparkles size={14} className="text-gold" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-ink text-cream rounded-l-xl rounded-tr-xl"
                    : "bg-white border border-ink/10 text-ink rounded-r-xl rounded-tl-xl"
                }`}
                data-testid={`chat-message-${m.role}`}
              >
                {m.content || (streaming && i === messages.length - 1 ? <span className="opacity-60">Thinking…</span> : "")}
              </div>
            </div>
          ))}
          {messages.length <= 1 && (
            <div className="space-y-2 mt-3">
              <div className="eyebrow text-[10px] text-ink/50 mb-2">Try asking</div>
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="w-full text-left text-xs px-3 py-2 border border-ink/10 hover:border-gold hover:bg-cream-deep/40 transition" data-testid={`chat-suggestion-${s.slice(0, 8).toLowerCase().replace(/[^a-z]+/g, "")}`}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="border-t border-ink/10 p-3 flex items-center gap-2 bg-white"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about rituals, dosha, recovery…"
            data-testid="chat-input"
            disabled={streaming}
            className="flex-1 bg-transparent outline-none text-sm px-2 py-2 placeholder:text-ink/40"
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            data-testid="chat-send"
            className="w-10 h-10 bg-gold text-ink flex items-center justify-center disabled:opacity-40 hover:bg-gold-dark transition"
            aria-label="Send"
          >
            <Send size={14} />
          </button>
        </form>
        <div className="px-4 py-2 text-[10px] text-ink/50 text-center bg-cream-deep/40 eyebrow">Educational use only · Not medical advice</div>
      </div>
    </>
  );
}
