// ─────────────────────────────────────────────────────────
// 3Tattva — Central API Fetch Utility
// ALL API calls in the app go through this file.
// Never call fetch() directly in components or pages.
// ─────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true";

const ACCESS_TOKEN_KEY = "3tattva_access_token";

// In-memory token; mirrored to sessionStorage so full page reloads keep the session in this tab.
let _accessToken: string | null = null;
let _hydratedFromSession = false;

function hydrateTokenFromSession(): void {
  if (_hydratedFromSession || typeof window === "undefined") return;
  _hydratedFromSession = true;
  const stored = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (stored) _accessToken = stored;
}

export function setAccessToken(token: string | null): void {
  _accessToken = token;
  _hydratedFromSession = true;
  if (typeof window !== "undefined") {
    if (token) sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    else sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function getAccessToken(): string | null {
  hydrateTokenFromSession();
  return _accessToken;
}

// ── Request options ──────────────────────────────────────
interface ApiFetchOptions extends RequestInit {
  auth?: boolean;       // true = attach Bearer token header
  isFormData?: boolean; // true = skip Content-Type (browser sets it)
}

// ── Core fetch wrapper ───────────────────────────────────
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { auth = false, isFormData = false, ...rest } = options;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(rest.headers as Record<string, string>),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    credentials: "include", // sends HttpOnly refresh cookie
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    let message =
      typeof errorData.message === "string" ? errorData.message : "Request failed";
    if (response.status === 401 && auth) {
      message =
        "Your session is missing or expired. Sign out, sign in again, and ensure mock mode is off when using the live API (NEXT_PUBLIC_USE_MOCK=false).";
    }
    throw new Error(message);
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ── Convenience methods ──────────────────────────────────
export const api = {
  get: <T>(path: string, auth = false) =>
    apiFetch<T>(path, { method: "GET", auth }),

  post: <T>(path: string, body: unknown, auth = false) =>
    apiFetch<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      auth,
    }),

  put: <T>(path: string, body: unknown, auth = false) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      auth,
    }),

  patch: <T>(path: string, body: unknown, auth = false) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      auth,
    }),

  delete: <T>(path: string, auth = false) =>
    apiFetch<T>(path, { method: "DELETE", auth }),

  upload: <T>(path: string, formData: FormData, auth = false) =>
    apiFetch<T>(path, {
      method: "POST",
      body: formData,
      isFormData: true,
      auth,
    }),

  patchUpload: <T>(path: string, formData: FormData, auth = false) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: formData,
      isFormData: true,
      auth,
    }),
};
