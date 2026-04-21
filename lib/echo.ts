import Echo from "laravel-echo"
import Pusher from "pusher-js"

/**
 * Normalizes and reads the auth token from localStorage.
 * Mirroring the logic from apiClient.ts to ensure consistency.
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  
  const keys = ["sourcenest_token", "access_token", "token", "TOKEN"]
  for (const key of keys) {
    const value = localStorage.getItem(key)
    if (value) {
      // Basic normalization - handle potential JSON or Bearer prefix
      const trimmed = value.trim().replace(/^Bearer\s+/i, "")
      if (trimmed && !trimmed.startsWith("{") && !trimmed.startsWith("\"")) {
        return trimmed
      }
      try {
        const parsed = JSON.parse(trimmed)
        if (typeof parsed === "string") return parsed.replace(/^Bearer\s+/i, "")
        if (parsed?.access_token) return parsed.access_token.replace(/^Bearer\s+/i, "")
        if (parsed?.token) return parsed.token.replace(/^Bearer\s+/i, "")
      } catch {
        // Not JSON
      }
    }
  }
  return null
}

export const initEcho = () => {
  if (typeof window === "undefined") return null

  // @ts-ignore
  window.Pusher = Pusher

  return new Echo({
    broadcaster: "pusher",
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    forceTLS: true,
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        Accept: "application/json",
      },
    },
  })
}

let echoInstance: Echo<"pusher"> | null = null
let echoToken: string | null = null

/**
 * Returns a singleton Echo instance that always matches the latest auth token.
 * Recreates the client when token changes to avoid stale private-channel auth.
 */
export const getEcho = () => {
  if (typeof window === "undefined") return null

  const currentToken = getAuthToken()
  if (!echoInstance || echoToken !== currentToken) {
    if (echoInstance) {
      try {
        echoInstance.disconnect()
      } catch {
        // Ignore disconnect errors during re-init
      }
    }
    echoToken = currentToken
    echoInstance = initEcho()
  }

  return echoInstance
}
