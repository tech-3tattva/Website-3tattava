"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          cancel?: () => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: string | number;
            }
          ) => void;
        };
      };
    };
  }
}

type GoogleSignInButtonProps = {
  onError?: (message: string) => void;
  /** Called after Google credential is accepted and session is established. */
  onSuccess?: () => void;
  showDivider?: boolean;
  buttonWidth?: number;
};

export default function GoogleSignInButton({
  onError,
  onSuccess,
  showDivider = true,
  buttonWidth = 340,
}: GoogleSignInButtonProps) {
  const { googleLogin } = useAuth();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!scriptLoaded || !clientId || !buttonRef.current || !window.google) {
      return;
    }

    buttonRef.current.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        try {
          await googleLogin(credential);
          onError?.("");
          onSuccess?.();
        } catch (error) {
          onError?.(error instanceof Error ? error.message : "Google login failed");
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: buttonWidth,
    });

    return () => {
      try {
        window.google?.accounts?.id?.cancel?.();
      } catch {
        /* gsi cleanup */
      }
    };
  }, [buttonWidth, googleLogin, onError, onSuccess, scriptLoaded]);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return (
      <p className="text-sm text-text-light">
        Google sign-in is not configured yet.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="space-y-3">
        {showDivider ? (
          <div className="relative text-center text-sm text-text-light">
            <span className="bg-white px-3 relative z-10">or</span>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-border" />
          </div>
        ) : null}
        <div className="flex justify-center">
          <div ref={buttonRef} />
        </div>
      </div>
    </>
  );
}

