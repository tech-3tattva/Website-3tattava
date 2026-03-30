"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_POST_AUTH_PATH, getSafeRedirectPath } from "@/lib/auth-redirect";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const safeRedirect = getSafeRedirectPath(redirectParam);
  const afterAuth = safeRedirect ?? DEFAULT_POST_AUTH_PATH;
  const isCheckoutFlow = Boolean(safeRedirect?.startsWith("/checkout"));

  const { login, isLoading, isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const goAfterAuth = useCallback(() => {
    router.replace(afterAuth);
  }, [router, afterAuth]);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace(afterAuth);
    }
  }, [isLoading, isLoggedIn, router, afterAuth]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await login(email, password);
      goAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  const registerHref =
    safeRedirect != null
      ? `/register?redirect=${encodeURIComponent(safeRedirect)}`
      : "/register";

  return (
    <section className="relative min-h-[74vh] flex items-center justify-center px-3 sm:px-4 py-10 sm:py-14 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdbldRSZg9ltKAdZodR7Sa_yK9hqUYf4SItRkaeqKCrUdY6pETwWM4R0eWlB7JWaYm3IoH6Wi50JQd3WFTOZKByVfDsPJdjfu_Fi4rD6ENGWkhnGp6GpzG0EGxsIW_ZQc-ZO-lPGOEHkhJ9INbG0QXMcR0Ci1rB6OhI2sCKYqkIiZfvKPRbbEQ4SjNKzaj98Bx6_zbO5oUzpmYwWtahbGG4P1FKbfDS0yfA9jyS3fIpbACV72-3lPO1RZS0l0DgsctYonrvg74ypEG')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[#7b3f1f]/42" />

      <div className="relative z-10 w-full max-w-[28rem] bg-white rounded-lg shadow-[0_18px_50px_rgba(0,0,0,0.25)] p-5 sm:p-6 md:p-8 border border-[#ede6d8]">
        {isCheckoutFlow ? (
          <>
            <p className="text-center text-xs uppercase tracking-[0.2em] text-[#8a6a4a] mb-2">
              Checkout
            </p>
            <p className="text-center text-sm text-gray-600 mb-6">
              Sign in to continue to shipping and payment.
            </p>
          </>
        ) : null}
        <h1
          className="text-[36px] sm:text-[42px] md:text-[44px] leading-none font-display text-center text-gray-900 mb-6 sm:mb-7"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-[18px]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-2 border-[#c4a376] px-3 py-2.5 focus:border-[#ba5929] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-2 border-[#c4a376] px-3 py-2.5 focus:border-[#ba5929] focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-[#ba5929] py-3 text-white text-base sm:text-lg font-medium hover:bg-[#9c4c23] transition-colors disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Sign in"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <hr className="w-full border-gray-300" />
          <span className="text-sm text-gray-500">or</span>
          <hr className="w-full border-gray-300" />
        </div>

        <GoogleSignInButton
          onError={(message) => setError(message || null)}
          onSuccess={goAfterAuth}
          showDivider={false}
          buttonWidth={320}
        />

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-gray-800">
          <p className="leading-relaxed">
            New here?{" "}
            <Link href={registerHref} className="hover:underline text-[#4a4a4a] font-medium">
              Create an account
            </Link>
          </p>
          <button type="button" className="hover:underline">
            Forgot password?
          </button>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[74vh] flex items-center justify-center bg-cream text-text-medium">
          Loading…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
