"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { LoginInput, User as ApiUser } from "@/lib/types"
import { login as loginRequest, register as registerRequest } from "@/lib/api/auth"
import { getDashboardPathByRole, normalizeUserRole, type UserRole } from "@/lib/roles/dashboard-route"

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
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; redirectTo: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; redirectTo: string }>
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

  const login = async (
    email: string,
    password: string,
    role: UserRole = "buyer"
  ): Promise<{ success: boolean; redirectTo: string }> => {
    setIsLoading(true)

    try {
      const payload: LoginInput = { email, password, role }
      const response = await loginRequest(payload)

      if (!response.success) {
        return { success: false, redirectTo: "" }
      }

      setToken(response.data.access_token)
      setUser(response.data.user)

      return {
        success: true,
        redirectTo: getDashboardPathByRole(response.data.user.role),
      }
    } catch {
      return { success: false, redirectTo: "" }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData): Promise<{ success: boolean; redirectTo: string }> => {
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
        return { success: false, redirectTo: "" }
      }

      setToken(response.data.access_token)
      setUser(response.data.user)

      return {
        success: true,
        redirectTo: getDashboardPathByRole(response.data.user.role),
      }
    } catch (err: any) {
      // Log exactly what the backend rejected so we don't have to guess
      console.error("Registration Failed! Backend Response:", err.response?.data || err.message)
      return { success: false, redirectTo: "" }
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