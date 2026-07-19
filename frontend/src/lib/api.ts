// ─────────────────────────────────────────────────────────
// 3Tattva — Central API Fetch Utility
// ALL API calls in the app go through this file.
// Never call fetch() directly in components or pages.
// ─────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true";

// Error carrying the HTTP status so callers can branch on it (e.g. 503 payments-off).
export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

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

// ── Token refresh (single-flight) ────────────────────────
let _refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (_refreshPromise) return _refreshPromise;
  _refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
        credentials: "include",
      });
      if (!res.ok) {
        setAccessToken(null);
        return null;
      }
      const data = (await res.json().catch(() => null)) as { accessToken?: string } | null;
      const token = data?.accessToken ?? null;
      setAccessToken(token);
      return token;
    } catch {
      return null;
    }
  })();
  try {
    return await _refreshPromise;
  } finally {
    _refreshPromise = null;
  }
}

// ── Core fetch wrapper ───────────────────────────────────
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { auth = false, isFormData = false, ...rest } = options;

  const doFetch = (): Promise<Response> => {
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(rest.headers as Record<string, string>),
    };
    if (auth) {
      const token = getAccessToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return fetch(`${BASE_URL}${path}`, { ...rest, headers, credentials: "include" });
  };

  let response = await doFetch();

  // Access token likely expired — refresh once via the HttpOnly cookie, then retry.
  if (response.status === 401 && auth && path !== "/auth/refresh") {
    const refreshed = await refreshAccessToken();
    if (refreshed) response = await doFetch();
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    let message =
      typeof errorData.message === "string" ? errorData.message : "Request failed";
    if (response.status === 401 && auth) {
      message = "Your session has expired. Please sign in again to continue.";
    }
    throw new ApiError(message, response.status);
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ── Admin token helpers ──────────────────────────────────
// Admin uses sessionStorage Bearer token to bypass cross-origin cookie issues.
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("adminToken");
}

export function clearAdminToken(): void {
  if (typeof window !== "undefined") sessionStorage.removeItem("adminToken");
}

export async function adminFetch<T>(path: string, options: Omit<ApiFetchOptions, "auth"> = {}): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    ...(options.isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(typeof errorData.message === "string" ? errorData.message : "Request failed");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const adminApi = {
  get:    <T>(path: string) => adminFetch<T>(path, { method: "GET" }),
  post:   <T>(path: string, body: unknown) => adminFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => adminFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => adminFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => adminFetch<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) => adminFetch<T>(path, { method: "POST", body: formData, isFormData: true }),
  patchUpload: <T>(path: string, formData: FormData) => adminFetch<T>(path, { method: "PATCH", body: formData, isFormData: true }),
};

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
