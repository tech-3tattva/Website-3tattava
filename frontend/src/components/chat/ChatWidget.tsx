"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Msg = { role: "user" | "assistant"; content: string };

function renderMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;
  let lastIdx = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={key++} style={{ fontWeight: 600, color: "#F5F0EB" }}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      parts.push(<code key={key++} style={{ background: "rgba(200,150,62,0.15)", padding: "1px 5px", borderRadius: 3, fontFamily: "monospace", fontSize: 12 }}>{token.slice(1, -1)}</code>);
    } else {
      parts.push(<em key={key++} style={{ fontStyle: "italic" }}>{token.slice(1, -1)}</em>);
    }
    lastIdx = re.lastIndex;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const GREETING: Msg = {
  role: "assistant",
  content: "Namaste — I'm the 3TATTAVA assistant. Ask me anything about Shilajit, Performance Ayurveda, or our products. I draw from Dr. Kashish's medical training and our published research.",
};

const SUGGESTED = [
  { icon: "◈", text: "Which product is right for me?" },
  { icon: "◉", text: "How do I take RockResin daily?" },
  { icon: "◎", text: "Is Shilajit safe for women?" },
  { icon: "▣", text: "Why is fulvic acid important?" },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showJump, setShowJump] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stickRef = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(t);
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    stickRef.current = true;
    setShowJump(false);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickRef.current = dist < 60;
    setShowJump(dist >= 60);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (stickRef.current) scrollToBottom(false);
  }, [messages, open, streaming, scrollToBottom]);

  useEffect(() => {
    if (open) scrollToBottom(false);
  }, [open, scrollToBottom]);

  const send = useCallback(async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || streaming) return;

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setStreaming(true);
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

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const raw = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          let eventName = "message";
          let dataLine = "";
          for (const line of raw.split("\n")) {
            if (line.startsWith("event:")) eventName = line.slice(6).trim();
            else if (line.startsWith("data:")) dataLine += line.slice(5).trim();
          }
          if (!dataLine) continue;
          try {
            const payload = JSON.parse(dataLine);
            if (eventName === "delta" && payload.text) {
              setMessages((m) => {
                const copy = [...m];
                const last = copy[copy.length - 1];
                if (last?.role === "assistant") copy[copy.length - 1] = { ...last, content: last.content + payload.text };
                return copy;
              });
            } else if (eventName === "error") {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: payload.error || "Something went wrong. Please try again." };
                return copy;
              });
            }
          } catch { /* ignore malformed SSE */ }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last?.role === "assistant" && last.content === "") {
          copy[copy.length - 1] = { role: "assistant", content: "I couldn't reach the 3TATTAVA assistant just now. Please try again, or email support@3tattava.com." };
        }
        return copy;
      });
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [messages, streaming]);

  const isWelcome = messages.length === 1 && !streaming;

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes twRingPulse {
          0%,100%{transform:scale(1);opacity:.6}
          50%{transform:scale(1.1);opacity:.12}
        }
        @keyframes twLaunchEnter {
          from{opacity:0;transform:scale(.4) translateY(20px)}
          to{opacity:1;transform:scale(1) translateY(0)}
        }
        @keyframes twOrbit1{0%{transform:rotate(0deg) translateX(38px) rotate(0deg)}100%{transform:rotate(360deg) translateX(38px) rotate(-360deg)}}
        @keyframes twOrbit2{0%{transform:rotate(60deg) translateX(44px) rotate(-60deg)}100%{transform:rotate(420deg) translateX(44px) rotate(-420deg)}}
        @keyframes twOrbit3{0%{transform:rotate(120deg) translateX(36px) rotate(-120deg)}100%{transform:rotate(480deg) translateX(36px) rotate(-480deg)}}
        @keyframes twOrbit4{0%{transform:rotate(200deg) translateX(42px) rotate(-200deg)}100%{transform:rotate(560deg) translateX(42px) rotate(-560deg)}}
        @keyframes twOrbit5{0%{transform:rotate(280deg) translateX(34px) rotate(-280deg)}100%{transform:rotate(640deg) translateX(34px) rotate(-640deg)}}
        @keyframes twOrbit6{0%{transform:rotate(320deg) translateX(46px) rotate(-320deg)}100%{transform:rotate(680deg) translateX(46px) rotate(-680deg)}}
        @keyframes twPanelOpen{from{opacity:0;transform:scale(.88) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes twMsgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes twDot{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
        @keyframes twSpin{to{transform:rotate(360deg)}}

        .tw-wrap {
          position: fixed;
          bottom: 28px; right: 28px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }
        .tw-wrap.hidden { display: none; }
        @media (max-width: 480px) {
          .tw-wrap { bottom: 16px; right: 14px; }
          .tw-orb-wrap { width: 52px; height: 52px; }
        }

        /* Panel */
        .tw-panel {
          width: 340px;
          max-height: min(520px, calc(100dvh - 130px));
          background: #141414;
          border: 1px solid rgba(200,150,62,0.2);
          display: flex;
          flex-direction: column;
          transform-origin: bottom right;
          animation: twPanelOpen 0.32s cubic-bezier(0.34,1.56,0.64,1) both;
          box-shadow: 0 24px 64px rgba(0,0,0,0.7);
          border-radius: 4px;
          overflow: hidden;
        }
        .tw-panel-hdr {
          background: linear-gradient(135deg,#1e1a12,#1a1a1a);
          border-bottom: 1px solid rgba(200,150,62,0.15);
          padding: 18px 18px 14px;
          display: flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
        }
        .tw-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%,#2a2218,#1a1a1a);
          border: 1px solid rgba(200,150,62,0.4);
          display: flex; align-items: center; justify-content: center;
          font-family: Georgia,serif;
          font-size: 13px; font-weight: 700; color: #C8963E;
          flex-shrink: 0;
        }
        .tw-hdr-name {
          font-family: Georgia,serif;
          font-size: 13px; font-weight: 600;
          color: #F5F0EB; letter-spacing: .02em;
        }
        .tw-hdr-status {
          font-size: 10px; color: rgba(245,240,235,.4);
          letter-spacing: .05em;
          display: flex; align-items: center; gap: 5px;
          margin-top: 2px;
        }
        .tw-hdr-dot { width: 6px; height: 6px; border-radius: 50%; background: #81c784; }
        .tw-close-btn {
          margin-left: auto;
          background: transparent; border: none;
          color: rgba(245,240,235,.3);
          font-size: 18px; cursor: pointer; line-height: 1;
          transition: color .2s; padding: 0; font-family: sans-serif;
        }
        .tw-close-btn:hover { color: rgba(245,240,235,.75); }

        /* Messages */
        .tw-msgs-area {
          flex: 1;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 0;
          position: relative;
        }
        .tw-msgs-area::-webkit-scrollbar { width: 4px; }
        .tw-msgs-area::-webkit-scrollbar-track { background: transparent; }
        .tw-msgs-area::-webkit-scrollbar-thumb { background: rgba(200,150,62,0.2); border-radius: 2px; }

        .tw-msg-row { display: flex; animation: twMsgIn 0.22s ease both; }
        .tw-msg-row.user { justify-content: flex-end; }
        .tw-msg-row.assistant { justify-content: flex-start; }

        .tw-bubble {
          max-width: 84%;
          padding: 10px 14px;
          font-size: 13px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
          border-radius: 14px;
        }
        .tw-bubble.user {
          background: #C8963E;
          color: #1A1A1A;
          border-bottom-right-radius: 4px;
          font-weight: 400;
        }
        .tw-bubble.assistant {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(245,240,235,.85);
          border-bottom-left-radius: 4px;
        }
        .tw-typing-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(245,240,235,.5);
          display: inline-block;
          margin: 0 2px;
        }
        .tw-typing-dot:nth-child(1){animation:twDot 1.2s infinite .0s}
        .tw-typing-dot:nth-child(2){animation:twDot 1.2s infinite .2s}
        .tw-typing-dot:nth-child(3){animation:twDot 1.2s infinite .4s}

        /* Welcome quick-buttons */
        .tw-welcome {
          background: rgba(200,150,62,0.07);
          border: 1px solid rgba(200,150,62,0.12);
          border-left: 2px solid rgba(200,150,62,0.45);
          padding: 13px 15px;
          margin-bottom: 4px;
          border-radius: 3px;
        }
        .tw-welcome-text {
          font-family: Georgia,serif;
          font-size: 13px;
          color: rgba(245,240,235,.78);
          line-height: 1.6;
          margin: 0;
        }
        .tw-quick-list { display: flex; flex-direction: column; gap: 7px; margin-top: 10px; }
        .tw-quick-btn {
          background: transparent;
          border: 1px solid rgba(200,150,62,0.14);
          color: rgba(245,240,235,.6);
          font-family: Georgia,serif;
          font-size: 12px;
          letter-spacing: .03em;
          padding: 9px 13px;
          cursor: pointer; text-align: left;
          transition: all .2s ease;
          display: flex; align-items: center; gap: 9px;
          border-radius: 2px;
        }
        .tw-quick-btn:hover {
          border-color: rgba(200,150,62,0.45);
          color: #F5F0EB;
          background: rgba(200,150,62,0.05);
        }
        .tw-quick-icon { font-size: 13px; flex-shrink: 0; }

        /* Jump to latest */
        .tw-jump {
          position: sticky;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          background: #C8963E;
          color: #1A1A1A;
          border: none;
          font-family: var(--font-primary), system-ui, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          padding: 6px 14px;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          gap: 5px;
          width: fit-content;
        }

        /* Input footer */
        .tw-footer {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 10px 12px;
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          background: #141414;
        }
        .tw-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(200,150,62,0.18);
          color: #F5F0EB;
          font-family: Georgia,serif;
          font-size: 13px;
          padding: 10px 14px;
          outline: none;
          transition: border-color .2s;
          border-radius: 2px;
        }
        .tw-input:focus { border-color: rgba(200,150,62,.5); }
        .tw-input::placeholder { color: rgba(245,240,235,.2); }
        .tw-input:disabled { opacity: .5; }
        .tw-send {
          background: #C8963E;
          border: none;
          color: #1A1A1A;
          font-size: 15px;
          padding: 10px 14px;
          cursor: pointer;
          transition: background .2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .tw-send:hover { background: #b5852f; }
        .tw-send:disabled { opacity: .45; cursor: not-allowed; }
        .tw-spin { width: 14px; height: 14px; border: 2px solid rgba(26,26,26,.3); border-top-color: #1A1A1A; border-radius: 50%; animation: twSpin .65s linear infinite; }

        /* ORB BUTTON */
        .tw-orb-wrap {
          position: relative;
          width: 64px; height: 64px;
          cursor: pointer;
          animation: twLaunchEnter .6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .tw-orb-wrap::before {
          content: '';
          position: absolute; inset: -10px;
          border-radius: 50%;
          border: 1px solid rgba(200,150,62,.18);
          animation: twRingPulse 2.4s ease-in-out infinite;
          pointer-events: none;
        }
        .tw-orb-wrap::after {
          content: '';
          position: absolute; inset: -20px;
          border-radius: 50%;
          border: 1px solid rgba(200,150,62,.07);
          animation: twRingPulse 2.4s ease-in-out infinite .5s;
          pointer-events: none;
        }
        .tw-orb-core {
          position: absolute; inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #ffffff, #f7f0e2 55%, #ece0c8);
          border: 1px solid rgba(205,135,42,.6);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.7),
            0 8px 30px rgba(0,0,0,.45),
            0 0 24px rgba(205,135,42,.45);
          transition: all .32s cubic-bezier(0.34,1.56,0.64,1);
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .tw-orb-shine {
          position: absolute;
          top: 10px; left: 14px;
          width: 16px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,.55);
          transform: rotate(-20deg);
          pointer-events: none;
        }
        .tw-orb-label {
          font-family: Georgia,serif;
          font-size: 18px; font-weight: 700;
          color: #442a1b;
          letter-spacing: -1px;
          text-shadow: none;
          user-select: none;
          transition: all .3s ease;
          position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;
        }
        .tw-particles {
          position: absolute; inset: -22px;
          border-radius: 50%;
          pointer-events: none; z-index: 0;
        }
        .tw-p { position: absolute; border-radius: 50%; background: #C8963E; top: 50%; left: 50%; }
        .tw-p1{width:3px;height:3px;opacity:.55;animation:twOrbit1 3.2s linear infinite}
        .tw-p2{width:2px;height:2px;opacity:.35;animation:twOrbit2 4.1s linear infinite .8s}
        .tw-p3{width:3px;height:3px;opacity:.5; animation:twOrbit3 2.8s linear infinite 1.4s}
        .tw-p4{width:2px;height:2px;opacity:.3; animation:twOrbit4 5s   linear infinite .3s}
        .tw-p5{width:2px;height:2px;opacity:.45;animation:twOrbit5 3.6s linear infinite 2s}
        .tw-p6{width:3px;height:3px;opacity:.28;animation:twOrbit6 4.5s linear infinite 1s}
        .tw-orb-wrap:hover .tw-orb-core {
          transform: scale(1.1);
          border-color: rgba(200,150,62,.7);
          box-shadow:
            inset 0 1px 0 rgba(200,150,62,.3),
            0 0 32px rgba(200,150,62,.18),
            0 12px 40px rgba(0,0,0,.8);
        }
        .tw-orb-wrap:hover .tw-orb-label { color: #cd872a; }
        .tw-orb-wrap:active .tw-orb-core { transform: scale(.93); }
        .tw-orb-logo {
          width: 28px; height: 28px; object-fit: contain;
          display: block;
        }
        .tw-orb-wrap:hover .tw-orb-logo {
          transform: scale(1.05);
        }
        .tw-tooltip {
          position: absolute;
          right: 76px; top: 50%;
          transform: translateY(-50%) translateX(8px);
          background: rgba(20,20,20,.96);
          border: 1px solid rgba(200,150,62,.22);
          color: #F5F0EB;
          font-family: Georgia,serif;
          font-size: 12px;
          letter-spacing: .06em;
          padding: 9px 16px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity .25s, transform .25s;
          border-radius: 2px;
        }
        .tw-tooltip::after {
          content:'';
          position: absolute;
          right: -6px; top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-left-color: rgba(200,150,62,.22);
        }
        .tw-orb-wrap:hover .tw-tooltip { opacity: 1; transform: translateY(-50%) translateX(0); }
      `}</style>

      <div className={`tw-wrap${!mounted ? " hidden" : ""}`}>
        {/* Chat Panel */}
        {open && (
          <div className="tw-panel">
            {/* Header */}
            <div className="tw-panel-hdr">
              <div className="tw-avatar">3T</div>
              <div>
                <p className="tw-hdr-name">3TATTAVA Assistant</p>
                <p className="tw-hdr-status">
                  <span className="tw-hdr-dot" />
                  Doctor-reviewed knowledge
                </p>
              </div>
              <button className="tw-close-btn" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="tw-msgs-area"
              onScroll={handleScroll}
              data-lenis-prevent
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              {isWelcome ? (
                <>
                  <div className="tw-welcome">
                    <p className="tw-welcome-text">{GREETING.content}</p>
                  </div>
                  <div className="tw-quick-list">
                    {SUGGESTED.map((q) => (
                      <button key={q.text} className="tw-quick-btn" onClick={() => send(q.text)}>
                        <span className="tw-quick-icon">{q.icon}</span>
                        {q.text}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                messages.slice(1).map((m, i) => (
                  <div key={i} className={`tw-msg-row ${m.role}`}>
                    <div className={`tw-bubble ${m.role}`}>
                      {m.role === "assistant" ? (
                        m.content ? renderMarkdown(m.content) : (
                          <span style={{ display: "flex", gap: 3, alignItems: "center", padding: "2px 0" }}>
                            <span className="tw-typing-dot" />
                            <span className="tw-typing-dot" />
                            <span className="tw-typing-dot" />
                          </span>
                        )
                      ) : m.content}
                    </div>
                  </div>
                ))
              )}

              {showJump && (
                <button className="tw-jump" onClick={() => scrollToBottom(true)}>
                  ↓ Jump to latest
                </button>
              )}
            </div>

            {/* Input */}
            <form
              className="tw-footer"
              onSubmit={(e) => { e.preventDefault(); send(input); }}
            >
              <input
                className="tw-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Shilajit, Ayurveda, dosing..."
                disabled={streaming}
                aria-label="Your message"
              />
              <button
                type="submit"
                className="tw-send"
                disabled={streaming || !input.trim()}
                aria-label="Send"
              >
                {streaming ? <span className="tw-spin" /> : "→"}
              </button>
            </form>
          </div>
        )}

        {/* Orb Button */}
        <div className="tw-orb-wrap" onClick={() => setOpen((v) => !v)} role="button" aria-label={open ? "Close chat" : "Open 3T Assistant"}>
          <div className="tw-particles">
            <div className="tw-p tw-p1" /><div className="tw-p tw-p2" />
            <div className="tw-p tw-p3" /><div className="tw-p tw-p4" />
            <div className="tw-p tw-p5" /><div className="tw-p tw-p6" />
          </div>
          <div className="tw-orb-core">
            <div className="tw-orb-shine" />
            <span className="tw-orb-label">
              {open ? "×" : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src="/brand/3t-icon.png" alt="3tattava" className="tw-orb-logo" />
              )}
            </span>
          </div>
          {!open && <div className="tw-tooltip">3T Assistant · Ask anything →</div>}
        </div>
      </div>
    </>
  );
}
