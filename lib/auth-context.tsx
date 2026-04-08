"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { LoginInput, User as ApiUser } from "@/lib/types"
import {
  completeSocialProfile,
  extractTwoFactorToken,
  googleTokenLogin,
  isTwoFactorRequiredResponse,
  login as loginRequest,
  register as registerRequest,
  type SocialCompleteProfileInput,
} from "@/lib/api/auth"
import { getApiErrorMessage } from "@/lib/api/errors"
import {
  getDashboardPathByRole,
  normalizeUserRole,
  type UserRole,
} from "@/lib/roles/dashboard-route"

export type { UserRole }

export type SignupResult =
  | { success: true; pendingReview: true; message: string; manufactureStatus?: string | null }
  | { success: true; pendingReview: false; redirectTo: string; message?: string }
  | { success: false; message?: string }

export type LoginResult =
  | { success: true; redirectTo: string; message?: string }
  | {
      success: false
      redirectTo: ""
      message?: string
      requiresTwoFactor: true
      twoFactorToken: string
      role: UserRole
    }
  | { success: false; redirectTo: ""; message?: string; requiresTwoFactor?: false }

type SocialSetupRole = "buyer" | "manufacturer"

export type GoogleLoginResult =
  | { success: true; redirectTo: string; message?: string }
  | {
      success: false
      redirectTo: ""
      message?: string
      requiresTwoFactor: true
      twoFactorToken: string
      role: UserRole
    }
  | {
      success: false
      redirectTo: ""
      message?: string
      needsProfileCompletion: true
      setupToken: string
      role: SocialSetupRole
    }
  | { success: false; redirectTo: ""; message?: string; needsProfileCompletion?: false }

export type CompleteGoogleProfileInput = SocialCompleteProfileInput & { role: SocialSetupRole }

export type CompleteGoogleProfileResult =
  | { success: true; redirectTo: string; message?: string; pendingReview?: false }
  | { success: false; redirectTo: ""; message?: string; pendingReview?: false }
  | { success: false; redirectTo: ""; pendingReview: true; message: string }

export type ManufacturerStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "suspended"
  | "needs_more_info"

export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  name: string
  company: string
  avatar?: string
  manufacturerStatus?: ManufacturerStatus
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, role?: UserRole) => Promise<LoginResult>
  loginWithGoogle: (googleIdToken: string, role?: UserRole) => Promise<GoogleLoginResult>
  completeGoogleProfile: (input: CompleteGoogleProfileInput) => Promise<CompleteGoogleProfileResult>
  signup: (data: SignupData) => Promise<SignupResult>
  logout: () => void
  setToken: (token: string | null) => void
  setUser: (user: User | ApiUser | null) => void
  getDashboardPath: () => string
}

interface SignupData {
  email: string
  password: string
  firstName: string
  lastName: string
  company: string
  role: UserRole
  country?: string
  city?: string
  businessLicense?: File | null
  website?: string
  factoryPhotos?: File[]
  additionalNotes?: string
  deviceName?: string
  agreeTerms?: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function toAuthUser(user: User | ApiUser): User {
  if ("first_name" in user) {
    const normalizedRole = normalizeUserRole(user.role)
    const firstName = user.first_name || ""
    const lastName = user.last_name || ""

    return {
      id: String(user.id),
      email: user.email,
      role: normalizedRole,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      company: normalizedRole === "admin" ? "SourceNest" : "",
      createdAt: user.created_at,
    }
  }

  return user
}

function extractSetupToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null
  }

  const tokenValue =
    (payload as Record<string, unknown>).setup_token ??
    (payload as Record<string, unknown>).setupToken

  if (typeof tokenValue !== "string") {
    return null
  }

  const trimmed = tokenValue.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setToken = (nextToken: string | null) => {
    setTokenState(nextToken)
    if (nextToken) {
      localStorage.setItem("sourcenest_token", nextToken)
      return
    }
    localStorage.removeItem("sourcenest_token")
  }

  const setUser = (nextUser: User | ApiUser | null) => {
    if (!nextUser) {
      setUserState(null)
      localStorage.removeItem("sourcenest_user")
      return
    }

    const normalizedUser = toAuthUser(nextUser)
    setUserState(normalizedUser)
    localStorage.setItem("sourcenest_user", JSON.stringify(normalizedUser))
  }

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("sourcenest_user")
      const storedToken = localStorage.getItem("sourcenest_token")

      if (storedUser) {
        setUserState(JSON.parse(storedUser))
      }

      if (storedToken) {
        setTokenState(storedToken)
      }
    } catch {
      localStorage.removeItem("sourcenest_user")
      localStorage.removeItem("sourcenest_token")
      setUserState(null)
      setTokenState(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Listen for forced logout triggered by the 401 response interceptor
  // in lib/api/client.ts. When the backend rejects a token, the
  // interceptor clears localStorage and dispatches this event so the
  // React state stays in sync and guarded routes redirect to login.
  useEffect(() => {
    const handleForceLogout = () => {
      setUserState(null)
      setTokenState(null)
    }

    window.addEventListener("auth:logout", handleForceLogout)
    return () => window.removeEventListener("auth:logout", handleForceLogout)
  }, [])

  const login = async (
    email: string,
    password: string,
    role: UserRole = "buyer"
  ): Promise<LoginResult> => {
    setIsLoading(true)

    try {
      const loginPayload: LoginInput = { email, password, role }
      const response = await loginRequest(loginPayload)

      if (response.success && response.data?.access_token && response.data?.user) {
        setToken(response.data.access_token)
        setUser(response.data.user)

        return {
          success: true,
          redirectTo: getDashboardPathByRole(response.data.user.role),
          message: response.message || undefined,
        }
      }

      const twoFactorToken = extractTwoFactorToken(response)
      if (twoFactorToken) {
        return {
          success: false,
          redirectTo: "",
          requiresTwoFactor: true,
          twoFactorToken,
          role,
          message: response.message || "Enter your authentication code to continue.",
        }
      }

      if (isTwoFactorRequiredResponse(response)) {
        return {
          success: false,
          redirectTo: "",
          message:
            response.message ||
            "Two-factor authentication is required, but a challenge token was not returned.",
        }
      }

      return {
        success: false,
        redirectTo: "",
        message: response.message || "Login failed. Please check your credentials.",
      }
    } catch (err) {
      return {
        success: false,
        redirectTo: "",
        message: getApiErrorMessage(err),
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData): Promise<SignupResult> => {
    setIsLoading(true)

    try {
      const form = new FormData()
      form.append("role", data.role)
      form.append("first_name", data.firstName)
      form.append("last_name", data.lastName)
      form.append("email", data.email)
      form.append("company_name", data.company)

      if (data.country) form.append("country", data.country)
      form.append("password", data.password)
      form.append("terms_condition", data.agreeTerms ? "1" : "0")

      if (data.city) form.append("city", data.city)
      if (data.businessLicense) form.append("bussiness_licence", data.businessLicense)
      
      // Send fields even if empty, preventing undefined issues on the backend
      form.append("company_website", data.website || "")
      form.append("notes", data.additionalNotes || "")

      if (data.factoryPhotos && data.factoryPhotos.length > 0) {
        data.factoryPhotos.forEach((file) => {
          // Send array properly with empty brackets
          form.append("factory_images[]", file)
        })
      }

      if (data.deviceName) form.append("device_name", data.deviceName)

      const response = await registerRequest(form)

      if (!response.success) {
        return { success: false, message: response.message || undefined }
      }

      const session = response.data
      if (session?.access_token && session.user) {
        setToken(session.access_token)
        setUser(session.user)
        return {
          success: true,
          pendingReview: false,
          redirectTo: getDashboardPathByRole(session.user.role),
          message: response.message || undefined,
        }
      }

      return {
        success: true,
        pendingReview: true,
        message:
          response.message ||
          "Thank you for registering. We will notify you when your account is ready.",
        manufactureStatus: response.manufacture_status ?? null,
      }
    } catch (err: unknown) {
      console.error("Registration Failed! Backend Response:", err)
      return { success: false, message: getApiErrorMessage(err) }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (
    googleIdToken: string,
    role: UserRole = "buyer"
  ): Promise<GoogleLoginResult> => {
    setIsLoading(true)

    try {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("[google-token payload to backend]", {
          token: googleIdToken,
          role,
        })
      }

      const response = await googleTokenLogin({ token: googleIdToken, role })

      if (response.success && response.data?.access_token && response.data.user) {
        setToken(response.data.access_token)
        setUser(response.data.user)
        return {
          success: true,
          redirectTo: getDashboardPathByRole(response.data.user.role),
        }
      }

      const twoFactorToken = extractTwoFactorToken(response)
      if (twoFactorToken) {
        return {
          success: false,
          redirectTo: "",
          requiresTwoFactor: true,
          twoFactorToken,
          role,
          message: response.message || "Enter your authentication code to continue.",
        }
      }

      const setupToken = extractSetupToken(response) || extractSetupToken(response.data)

      if (setupToken) {
        if (role === "admin") {
          return {
            success: false,
            redirectTo: "",
            message: "Google sign-in is not available for admin accounts.",
          }
        }

        const completionRole: SocialSetupRole = role === "manufacturer" ? "manufacturer" : "buyer"
        return {
          success: false,
          redirectTo: "",
          needsProfileCompletion: true,
          setupToken,
          role: completionRole,
          message: response.message || "Please complete your profile to continue.",
        }
      }

      return {
        success: false,
        redirectTo: "",
        message: response.message || "Google login failed.",
      }
    } catch (err: unknown) {
      return { success: false, redirectTo: "", message: getApiErrorMessage(err) }
    } finally {
      setIsLoading(false)
    }
  }

  const completeGoogleProfile = async (
    input: CompleteGoogleProfileInput
  ): Promise<CompleteGoogleProfileResult> => {
    setIsLoading(true)

    try {
      const response = await completeSocialProfile(input)

      if (response.success && response.data?.access_token && response.data.user) {
        setToken(response.data.access_token)
        setUser(response.data.user)
        return {
          success: true,
          redirectTo: getDashboardPathByRole(response.data.user.role),
        }
      }

      if (response.success) {
        return {
          success: false,
          redirectTo: "",
          pendingReview: true,
          message:
            response.message ||
            "Thank you for registering. Your account is currently pending review.",
        }
      }

      return {
        success: false,
        redirectTo: "",
        message: response.message || "Profile completion failed.",
      }
    } catch (err: unknown) {
      return { success: false, redirectTo: "", message: getApiErrorMessage(err) }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const getDashboardPath = () => {
    if (!user) {
      return "/auth/signin"
    }
    return getDashboardPathByRole(user.role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        completeGoogleProfile,
        signup,
        logout,
        setToken,
        setUser,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}