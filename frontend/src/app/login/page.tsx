"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_POST_AUTH_PATH, getSafeRedirectPath } from "@/lib/auth-redirect";
import AyurvedaLoader from "@/components/ui/AyurvedaLoader";
import Logo from "@/components/layout/Logo";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

const F = "var(--font-primary), system-ui, sans-serif";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const safeRedirect = getSafeRedirectPath(redirectParam);
  const afterAuth = safeRedirect ?? DEFAULT_POST_AUTH_PATH;

  const { login, isLoading, isLoggedIn } = useAuth();
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const goAfterAuth = useCallback(() => {
    router.replace(afterAuth);
  }, [router, afterAuth]);

  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace(afterAuth);
  }, [isLoading, isLoggedIn, router, afterAuth]);



  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      goAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const registerHref = safeRedirect ? `/register?redirect=${encodeURIComponent(safeRedirect)}` : "/register";


  const glassPanel: React.CSSProperties = {
    background: "linear-gradient(155deg, rgba(255,253,248,0.66), rgba(247,240,226,0.56))",
    border: "1px solid rgba(255,255,255,0.55)",
    borderRadius: 24,
    backdropFilter: "blur(22px) saturate(1.3)",
    WebkitBackdropFilter: "blur(22px) saturate(1.3)",
    boxShadow:
      "0 24px 64px rgba(28,19,4,0.34), 0 6px 20px rgba(68,42,27,0.20), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 0 30px rgba(255,255,255,0.10)",
  };

  return (
      <section className="relative min-h-[74vh] flex items-start justify-center px-3 sm:px-4 pt-28 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdbldRSZg9ltKAdZodR7Sa_yK9hqUYf4SItRkaeqKCrUdY6pETwWM4R0eWlB7JWaYm3IoH6Wi50JQd3WFTOZKByVfDsPJdjfu_Fi4rD6ENGWkhnGp6GpzG0EGxsIW_ZQc-ZO-lPGOEHkhJ9INbG0QXMcR0Ci1rB6OhI2sCKYqkIiZfvKPRbbEQ4SjNKzaj98Bx6_zbO5oUzpmYwWtahbGG4P1FKbfDS0yfA9jyS3fIpbACV72-3lPO1RZS0l0DgsctYonrvg74ypEG')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-[#7b3f1f]/42" />

      {/* Animated liquid backdrop — slow-moving frosted gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          style={{ position: "absolute", top: "2%", left: "6%", width: "46vmin", height: "46vmin", borderRadius: "50%", filter: "blur(64px)", willChange: "transform", background: "radial-gradient(circle at 35% 30%, rgba(205,135,42,0.80), rgba(205,135,42,0) 70%)" }}
          animate={reduce ? undefined : { x: [0, 70, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ position: "absolute", bottom: "0%", right: "4%", width: "52vmin", height: "52vmin", borderRadius: "50%", filter: "blur(72px)", willChange: "transform", background: "radial-gradient(circle at 42% 42%, rgba(68,42,27,0.60), rgba(68,42,27,0) 70%)" }}
          animate={reduce ? undefined : { x: [0, -60, 40, 0], y: [0, 30, -40, 0], scale: [1, 0.9, 1.15, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ position: "absolute", top: "24%", left: "30%", width: "42vmin", height: "42vmin", borderRadius: "50%", filter: "blur(60px)", willChange: "transform", background: "radial-gradient(circle at 50% 45%, rgba(247,240,226,0.85), rgba(247,240,226,0) 72%)" }}
          animate={reduce ? undefined : { x: [0, 44, -52, 0], y: [0, 52, -22, 0], scale: [1, 1.12, 0.94, 1] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[28rem] p-5 sm:p-6 md:p-8" style={glassPanel}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <Logo variant="dark" size="lg" />
        </div>
        <h1 style={{ fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 800", fontSize: "clamp(28px,4vw,36px)", textAlign: "center", color: "#442a1b", marginBottom: 4 }}>
          Welcome Back
        </h1>
        <p style={{ fontFamily: F, fontSize: 13, color: "#6f5a48", textAlign: "center", marginBottom: 20 }}>
          Sign in to access your rituals, orders &amp; assessments.
        </p>



          <form onSubmit={handleEmail} style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontFamily: F, fontSize: 12, fontWeight: 600, color: "#442a1b", marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: "100%", fontFamily: F, fontSize: 15, padding: "10px 14px", border: "1px solid #b7a392", borderRadius: 4, outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: F, fontSize: 12, fontWeight: 600, color: "#442a1b", marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                style={{ width: "100%", fontFamily: F, fontSize: 15, padding: "10px 14px", border: "1px solid #b7a392", borderRadius: 4, outline: "none" }} />
            </div>
            {error && <p style={{ fontFamily: F, fontSize: 12, color: "#b4452a" }}>{error}</p>}
            <button type="submit" disabled={isLoading}
              style={{ width: "100%", fontFamily: F, fontVariationSettings: "'wdth' 85,'wght' 700", fontSize: 14, color: "#442a1b", background: "linear-gradient(105deg,#A67B2F,#E4C079,#cd872a,#A67B2F)", border: "none", padding: "14px", borderRadius: 4, cursor: "pointer", opacity: isLoading ? 0.6 : 1 }}>
              {isLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>

        <div style={{ marginTop: 18 }}>
          <GoogleSignInButton onSuccess={goAfterAuth} onError={(m) => setError(m || null)} showDivider />
        </div>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <p style={{ fontFamily: F, fontSize: 13, color: "#6f5a48" }}>
            New here?{" "}
            <Link href={registerHref} style={{ color: "#cd872a", fontWeight: 700, textDecoration: "none" }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[74vh] flex items-center justify-center" style={{ background: "#f7f0e2" }}><AyurvedaLoader /></div>}>
      <LoginContent />
    </Suspense>
  );
}
