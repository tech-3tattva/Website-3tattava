"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getWelcomeOffer, type WelcomeOffer } from "@/lib/api";
import { trackPixel } from "@/lib/fbpixel";

const F = "var(--font-primary), system-ui, sans-serif";
const SEEN_KEY = "three_t_welcome_offer_seen";
const INK = "#442a1b";
const CREAM = "#f7f0e2";
const GOLD = "#cd872a";

const GOLD_GRADIENT = "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)";

type Mode = "none" | "card" | "pill";
type OfferStatus = "loading" | "ready" | "error";

function formatExpiry(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function WelcomeOfferNotification() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduce = useReducedMotion();
  const { isLoggedIn, isLoading } = useAuth();

  const [mode, setMode] = useState<Mode>("none");
  const [offer, setOffer] = useState<WelcomeOffer | null>(null);
  const [offerStatus, setOfferStatus] = useState<OfferStatus>("loading");
  const [copied, setCopied] = useState(false);
  const trackedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch the signed-in user's welcome offer once auth resolves.
  useEffect(() => {
    if (!isHome) return;
    if (isLoading) return;
    if (!isLoggedIn) {
      setOffer(null);
      setOfferStatus("loading");
      return;
    }
    let cancelled = false;
    setOfferStatus("loading");
    void (async () => {
      try {
        const { offer: fetched } = await getWelcomeOffer();
        if (!cancelled) {
          setOffer(fetched);
          setOfferStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setOffer(null);
          setOfferStatus("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isHome, isLoggedIn, isLoading]);

  // Auto-appear after ~6s; if already seen this visitor, surface only the re-open pill.
  useEffect(() => {
    if (!isHome) return;
    let seen = false;
    try {
      seen = !!localStorage.getItem(SEEN_KEY);
    } catch {
      seen = false;
    }
    const timer = window.setTimeout(() => {
      setMode(seen ? "pill" : "card");
    }, seen ? 800 : 20000);
    return () => window.clearTimeout(timer);
  }, [isHome]);

  // Track mobile viewport so the notification never covers a sticky buy bar.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Fire ViewContent once when a logged-in user with a live, unused code first sees the card.
  useEffect(() => {
    if (mode !== "card" || trackedRef.current) return;
    if (!isLoggedIn || !offer || offer.used || offer.expired) return;
    trackedRef.current = true;
    trackPixel("ViewContent", { content_name: "Welcome Offer" });
  }, [mode, isLoggedIn, offer]);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private browsing — best effort */
    }
    setMode("pill");
  }, []);

  const reopen = useCallback(() => setMode("card"), []);

  const copyCode = useCallback(async () => {
    if (!offer) return;
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — leave state untouched */
    }
  }, [offer]);

  if (!isHome) return null;

  const eyebrow = (
    <p
      style={{
        fontFamily: F,
        fontVariationSettings: "'wdth' 75,'wght' 700",
        fontSize: 9,
        letterSpacing: ".18em",
        textTransform: "uppercase",
        color: GOLD,
        margin: "0 0 6px",
      }}
    >
      Founding Member Offer
    </p>
  );

  const headlineStyle: React.CSSProperties = {
    fontFamily: F,
    fontVariationSettings: "'wdth' 85,'wght' 700",
    fontSize: 15,
    lineHeight: 1.3,
    color: CREAM,
    margin: "0 0 6px",
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: F,
    fontSize: 11.5,
    lineHeight: 1.5,
    color: "rgba(247,240,226,.62)",
    margin: "0 0 12px",
  };
  const linkStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontFamily: F,
    fontVariationSettings: "'wdth' 85,'wght' 700",
    fontSize: 10.5,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: INK,
    background: GOLD_GRADIENT,
    padding: "9px 14px",
    textDecoration: "none",
  };

  function renderBody() {
    if (isLoading || (isLoggedIn && offerStatus === "loading")) {
      return (
        <>
          <p style={headlineStyle}>₹200 OFF your first order</p>
          <p style={bodyStyle}>Loading your founding code…</p>
        </>
      );
    }

    if (!isLoggedIn) {
      return (
        <>
          <p style={headlineStyle}>₹200 OFF your first order</p>
          <p style={bodyStyle}>Create your account to unlock your one-time founding code.</p>
          <Link href="/login" style={linkStyle}>
            Sign up / Log in
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: 13 }}
            >
              →
            </motion.span>
          </Link>
        </>
      );
    }

    // Logged-in, auth + fetch resolved.
    if (offerStatus === "error" || !offer) {
      return (
        <>
          <p style={headlineStyle}>₹200 OFF your first order</p>
          <p style={bodyStyle}>Your welcome code is waiting in your account.</p>
          <Link href="/account" style={linkStyle}>
            Go to account →
          </Link>
        </>
      );
    }

    if (offer.used) {
      return (
        <>
          <p style={headlineStyle}>You&apos;ve used your ₹200 welcome offer ✓</p>
          <Link href="/account/orders" style={linkStyle}>
            View your orders →
          </Link>
        </>
      );
    }

    if (offer.expired) {
      return (
        <>
          <p style={headlineStyle}>Your welcome offer has expired.</p>
          <p style={bodyStyle}>Keep an eye out — we run fresh drops for founding members.</p>
        </>
      );
    }

    // Unused + live.
    return (
      <>
        <p style={headlineStyle}>₹200 OFF your first order</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px" }}>
          <span
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".08em",
              color: CREAM,
              background: "rgba(247,240,226,.12)",
              border: "1px dashed rgba(228,192,121,.5)",
              borderRadius: 4,
              padding: "6px 10px",
            }}
          >
            {offer.code}
          </span>
          <button
            type="button"
            onClick={() => void copyCode()}
            style={{
              fontFamily: F,
              fontSize: 10.5,
              fontVariationSettings: "'wght' 700",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: INK,
              background: GOLD_GRADIENT,
              border: "none",
              borderRadius: 4,
              padding: "7px 12px",
              cursor: "pointer",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p style={bodyStyle}>
          Apply {offer.code} at checkout for ₹200 off your first order.
        </p>
        <p
          style={{
            fontFamily: F,
            fontSize: 10,
            letterSpacing: ".04em",
            color: "rgba(247,240,226,.5)",
            margin: 0,
          }}
        >
          Worth ₹{offer.value} · Expires {formatExpiry(offer.expiresAt)}
        </p>
      </>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {mode === "card" && (
        <motion.aside
          key="welcome-card"
          aria-label="Welcome offer"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, x: 6 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            right: 20,
            bottom: isMobile ? 96 : 20,
            zIndex: 1040,
            width: 320,
            maxWidth: "calc(100vw - 40px)",
            background: INK,
            boxShadow: "0 18px 44px rgba(68,42,27,.42)",
            borderRadius: 4,
            overflow: "visible",
            pointerEvents: "auto",
          }}
        >
          <div style={{ height: 3, background: "linear-gradient(90deg,#A67B2F,#E4C079,#cd872a)", borderRadius: "4px 4px 0 0" }} />
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            style={{
              position: "absolute",
              top: -12,
              right: -12,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: CREAM,
              border: `1.5px solid ${GOLD}`,
              borderRadius: "50%",
              color: INK,
              fontSize: 20,
              lineHeight: 1,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(68,42,27,.4)",
              zIndex: 3,
              padding: 0,
            }}
          >
            ×
          </button>
          <div style={{ padding: "16px 18px 18px" }}>
            {eyebrow}
            {renderBody()}
          </div>
        </motion.aside>
      )}

      {mode === "pill" && (
        <motion.button
          key="welcome-pill"
          type="button"
          onClick={reopen}
          aria-label="Open your ₹200 welcome offer"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            right: 20,
            bottom: isMobile ? 96 : 20,
            zIndex: 1040,
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "none",
            background: GOLD_GRADIENT,
            boxShadow: "0 12px 28px rgba(68,42,27,.38)",
            cursor: "pointer",
            fontSize: 24,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <span aria-hidden>🎁</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
