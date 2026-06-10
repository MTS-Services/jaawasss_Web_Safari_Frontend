"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserRole = "buyer" | "manufacturer" | "service-provider" | "admin"

export type ManufacturerStatus = 
  | "draft" 
  | "pending_approval" 
  | "approved" 
  | "rejected" 
  | "suspended" 
  | "needs_more_info"

export type ServiceProviderStatus =
  | "under_review"
  | "approved"
  | "active"
  | "inactive"
  | "rejected"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  role: UserRole
  avatar?: string
  manufacturerStatus?: ManufacturerStatus
  serviceProviderStatus?: ServiceProviderStatus
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; redirectTo: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; redirectTo: string }>
  logout: () => void
  getDashboardPath: () => string
}

interface SignupData {
  email: string
  password: string
  firstName: string
  lastName: string
  company: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const demoUsers: Record<string, User & { password: string }> = {
  "buyer@demo.com": {
    id: "buyer-1",
    email: "buyer@demo.com",
    password: "buyer123",
    firstName: "John",
    lastName: "Smith",
    company: "ABC Imports LLC",
    role: "buyer",
    createdAt: "2026-01-15"
  },
  "manufacturer@demo.com": {
    id: "mfr-1",
    email: "manufacturer@demo.com",
    password: "manufacturer123",
    firstName: "Michael",
    lastName: "Chen",
    company: "TechVision Electronics",
    role: "manufacturer",
    manufacturerStatus: "approved",
    createdAt: "2025-12-08"
  },
  "pending@demo.com": {
    id: "mfr-2",
    email: "pending@demo.com",
    password: "pending123",
    firstName: "Sarah",
    lastName: "Lee",
    company: "NewTech Industries",
    role: "manufacturer",
    manufacturerStatus: "pending_approval",
    createdAt: "2026-03-10"
  },
  "provider@demo.com": {
    id: "sp-1",
    email: "provider@demo.com",
    password: "provider123",
    firstName: "Ana",
    lastName: "Ferreira",
    company: "NorthStar Packaging Studio",
    role: "service-provider",
    serviceProviderStatus: "active",
    createdAt: "2026-02-18"
  },
  "admin@demo.com": {
    id: "admin-1",
    email: "admin@demo.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    company: "SourceNest",
    role: "admin",
    createdAt: "2025-01-01"
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("sourcenest_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("sourcenest_user")
      }
    }
    setIsLoading(false)
  }, [])

  const getDashboardPath = () => {
    if (!user) return "/auth/signin"
    
    switch (user.role) {
      case "admin":
        return "/admin"
      case "manufacturer":
        return "/dashboard/manufacturer"
      case "service-provider":
        return "/dashboard/service-provider"
      case "buyer":
      default:
        return "/dashboard/buyer"
    }
  }

  const login = async (email: string, password: string, role?: UserRole): Promise<{ success: boolean; redirectTo: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const lowerEmail = email.toLowerCase()
    const demoUser = demoUsers[lowerEmail]
    
    if (demoUser && demoUser.password === password) {
      const { password: _, ...userWithoutPassword } = demoUser
      setUser(userWithoutPassword)
      localStorage.setItem("sourcenest_user", JSON.stringify(userWithoutPassword))
      
      let redirectTo = "/dashboard/buyer"
      if (userWithoutPassword.role === "admin") {
        redirectTo = "/admin"
      } else if (userWithoutPassword.role === "manufacturer") {
        redirectTo = "/dashboard/manufacturer"
      } else if (userWithoutPassword.role === "service-provider") {
        redirectTo = "/dashboard/service-provider"
      }
      
      return { success: true, redirectTo }
    }
    
    // For demo: auto-login with any credentials based on selected role
    if (role) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        firstName: email.split("@")[0],
        lastName: "User",
        company: "Demo Company",
        role,
        manufacturerStatus: role === "manufacturer" ? "pending_approval" : undefined,
        serviceProviderStatus: role === "service-provider" ? "under_review" : undefined,
        createdAt: new Date().toISOString()
      }
      setUser(newUser)
      localStorage.setItem("sourcenest_user", JSON.stringify(newUser))
      
      let redirectTo = "/dashboard/buyer"
      if (role === "admin") {
        redirectTo = "/admin"
      } else if (role === "manufacturer") {
        redirectTo = "/dashboard/manufacturer"
      } else if (role === "service-provider") {
        redirectTo = "/dashboard/service-provider"
      }
      
      return { success: true, redirectTo }
    }
    
    return { success: false, redirectTo: "/auth/signin" }
  }

  const signup = async (data: SignupData): Promise<{ success: boolean; redirectTo: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      role: data.role,
      manufacturerStatus: data.role === "manufacturer" ? "pending_approval" : undefined,
      serviceProviderStatus: data.role === "service-provider" ? "under_review" : undefined,
      createdAt: new Date().toISOString()
    }
    
    setUser(newUser)
    localStorage.setItem("sourcenest_user", JSON.stringify(newUser))
    
    let redirectTo = "/dashboard/buyer"
    if (data.role === "manufacturer") {
      // Manufacturers go to pricing to select a plan
      redirectTo = "/pricing"
    } else if (data.role === "service-provider") {
      // Service providers go to their in-app package selection to get listed
      redirectTo = "/dashboard/service-provider/subscription"
    }
    
    return { success: true, redirectTo }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sourcenest_user")
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, signup, logout, getDashboardPath }}>
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
