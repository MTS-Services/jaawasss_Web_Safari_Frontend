import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_STORAGE_KEYS = ["sourcenest_token", "access_token", "token", "TOKEN"] as const;

function readPreferredLanguage(): string {
  if (typeof window === "undefined") {
    return "en";
  }

  const languageCandidates = [
    localStorage.getItem("sourcenest_lang"),
    localStorage.getItem("locale"),
    localStorage.getItem("language"),
  ];

  for (const candidate of languageCandidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return "en";
}

function normalizeStoredToken(value: string | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const stripBearerPrefix = (input: string) => input.replace(/^Bearer\s+/i, "").trim();

  if (trimmed.startsWith("{") || trimmed.startsWith("\"")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (typeof parsed === "string") {
        const normalized = stripBearerPrefix(parsed);
        return normalized || null;
      }

      if (parsed && typeof parsed === "object") {
        const source = parsed as Record<string, unknown>;
        const nested =
          source.data && typeof source.data === "object"
            ? (source.data as Record<string, unknown>)
            : null;

        const candidate =
          source.access_token ??
          source.token ??
          source.auth_token ??
          nested?.access_token ??
          nested?.token;

        if (typeof candidate === "string") {
          const normalized = stripBearerPrefix(candidate);
          return normalized || null;
        }
      }
    } catch {
      // Not valid JSON, continue with raw value.
    }
  }

  const normalized = stripBearerPrefix(trimmed);
  return normalized || null;
}

function readAuthTokenFromStorage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  for (const key of AUTH_STORAGE_KEYS) {
    const token = normalizeStoredToken(localStorage.getItem(key));
    if (token) {
      if (key !== "sourcenest_token") {
        localStorage.setItem("sourcenest_token", token);
      }
      return token;
    }
  }

  return null;
}

// Do not set a global Content-Type header so requests that send FormData
// can rely on the browser/axios to set the proper multipart boundary.
export const apiClient = axios.create({
  baseURL: API_URL,
});

/** No Authorization header — use for public flows (e.g. restore scheduled deletion). */
export const publicApiClient = axios.create({
  baseURL: API_URL,
});

// ---------------------------------------------------------------------------
// Request interceptor — attach Accept, Accept-Language, and Authorization
// headers on every authenticated request.
//
// In Axios 1.x `config.headers` is always an `AxiosHeaders` instance inside
// request interceptors. We use direct property assignment (bracket notation)
// which AxiosHeaders supports via its internal proxy, ensuring the header is
// **always** written regardless of what Axios has pre-populated.
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  // Direct assignment on AxiosHeaders — always overwrites, no guards.
  config.headers["Accept"] = "application/json";
  config.headers["Accept-Language"] = readPreferredLanguage();

  const token = readAuthTokenFromStorage();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Dev-mode sanity check so you can see in the console whether the token
  // is actually being attached.
  if (process.env.NODE_ENV !== "production") {
    const method = (config.method ?? "GET").toUpperCase();
    const url = config.url ?? "";
    if (url.includes("/admin/")) {
      // eslint-disable-next-line no-console
      console.log(
        `[apiClient] ${method} ${url} — Authorization: ${token ? "Bearer " + token.slice(0, 12) + "…" : "⚠ NO TOKEN"}`
      );
    }
  }

  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — handle 401 Unauthenticated globally.
//
// When the backend rejects a request with 401 it means the stored token is
// invalid or expired. We clear it from localStorage so the next navigation
// to a guarded page triggers a redirect to login.
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const url = error.config?.url ?? "";

        // Only clear tokens for non-login requests (don't wipe during login itself)
        if (!url.endsWith("/login") && !url.endsWith("/register")) {
          // eslint-disable-next-line no-console
          console.warn(
            `[apiClient] 401 Unauthenticated for ${error.config?.method?.toUpperCase()} ${url}. ` +
            "Token may be expired — clearing stored auth."
          );
          localStorage.removeItem("sourcenest_token");
          localStorage.removeItem("sourcenest_user");

          // Dispatch a storage event so the AuthProvider can react and
          // redirect to the login page.
          window.dispatchEvent(new Event("auth:logout"));
        }
      }
    }

    return Promise.reject(error);
  }
);

publicApiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  config.headers["Accept"] = "application/json";
  config.headers["Accept-Language"] = readPreferredLanguage();

  return config;
});
