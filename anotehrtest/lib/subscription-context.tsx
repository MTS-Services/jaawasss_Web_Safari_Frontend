"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "./auth-context"

export type PlanId = "free" | "starter" | "growth" | "enterprise"

export interface PlanLimits {
  products: number // -1 means unlimited
  inquiriesPerMonth: number
  messagesPerMonth: number
  teamMembers: number
  catalogUploads: number
}

export interface PlanFeatures {
  companyProfile: boolean
  productListings: boolean
  internalMessaging: boolean
  inquiryInbox: boolean
  rfqReception: boolean
  catalogUpload: boolean
  certificationsSection: boolean
  exportMarketsSection: boolean
  basicAnalytics: boolean
  advancedAnalytics: boolean
  enterpriseAnalytics: boolean
  prioritySearchVisibility: boolean
  premiumSearchPlacement: boolean
  reviewedBadge: boolean
  featuredSupplierBadge: boolean
  multipleTeamUsers: boolean
  prioritySupport: boolean
  dedicatedAccountManager: boolean
  customOnboarding: boolean
  apiAccess: boolean
}

export interface SubscriptionPlan {
  id: PlanId
  name: string
  description: string
  monthlyPrice: number | null
  yearlyPrice: number | null
  limits: PlanLimits
  features: PlanFeatures
}

export interface SubscriptionUsage {
  productsUsed: number
  inquiriesThisMonth: number
  messagesThisMonth: number
  teamMembersUsed: number
  catalogsUploaded: number
}

export interface Subscription {
  planId: PlanId
  status: "active" | "trialing" | "past_due" | "canceled" | "expired"
  billingCycle: "monthly" | "yearly"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

// Plan definitions
const plans: Record<PlanId, SubscriptionPlan> = {
  free: {
    id: "free",
    name: "Free",
    description: "For buyers - always free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    limits: {
      products: 0,
      inquiriesPerMonth: -1,
      messagesPerMonth: -1,
      teamMembers: 1,
      catalogUploads: 0
    },
    features: {
      companyProfile: false,
      productListings: false,
      internalMessaging: true,
      inquiryInbox: false,
      rfqReception: false,
      catalogUpload: false,
      certificationsSection: false,
      exportMarketsSection: false,
      basicAnalytics: false,
      advancedAnalytics: false,
      enterpriseAnalytics: false,
      prioritySearchVisibility: false,
      premiumSearchPlacement: false,
      reviewedBadge: false,
      featuredSupplierBadge: false,
      multipleTeamUsers: false,
      prioritySupport: false,
      dedicatedAccountManager: false,
      customOnboarding: false,
      apiAccess: false
    }
  },
  starter: {
    id: "starter",
    name: "Starter",
    description: "For small manufacturers starting their export journey",
    monthlyPrice: 149,
    yearlyPrice: 1490,
    limits: {
      products: 25,
      inquiriesPerMonth: 50,
      messagesPerMonth: 100,
      teamMembers: 1,
      catalogUploads: 2
    },
    features: {
      companyProfile: true,
      productListings: true,
      internalMessaging: true,
      inquiryInbox: true,
      rfqReception: true,
      catalogUpload: true,
      certificationsSection: true,
      exportMarketsSection: true,
      basicAnalytics: true,
      advancedAnalytics: false,
      enterpriseAnalytics: false,
      prioritySearchVisibility: false,
      premiumSearchPlacement: false,
      reviewedBadge: true,
      featuredSupplierBadge: false,
      multipleTeamUsers: false,
      prioritySupport: false,
      dedicatedAccountManager: false,
      customOnboarding: false,
      apiAccess: false
    }
  },
  growth: {
    id: "growth",
    name: "Growth",
    description: "For established manufacturers seeking more exposure",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    limits: {
      products: 100,
      inquiriesPerMonth: 200,
      messagesPerMonth: 500,
      teamMembers: 3,
      catalogUploads: 10
    },
    features: {
      companyProfile: true,
      productListings: true,
      internalMessaging: true,
      inquiryInbox: true,
      rfqReception: true,
      catalogUpload: true,
      certificationsSection: true,
      exportMarketsSection: true,
      basicAnalytics: true,
      advancedAnalytics: true,
      enterpriseAnalytics: false,
      prioritySearchVisibility: true,
      premiumSearchPlacement: false,
      reviewedBadge: true,
      featuredSupplierBadge: true,
      multipleTeamUsers: true,
      prioritySupport: true,
      dedicatedAccountManager: false,
      customOnboarding: false,
      apiAccess: false
    }
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "For large manufacturers with custom requirements",
    monthlyPrice: null,
    yearlyPrice: null,
    limits: {
      products: -1, // unlimited
      inquiriesPerMonth: -1,
      messagesPerMonth: -1,
      teamMembers: -1,
      catalogUploads: -1
    },
    features: {
      companyProfile: true,
      productListings: true,
      internalMessaging: true,
      inquiryInbox: true,
      rfqReception: true,
      catalogUpload: true,
      certificationsSection: true,
      exportMarketsSection: true,
      basicAnalytics: true,
      advancedAnalytics: true,
      enterpriseAnalytics: true,
      prioritySearchVisibility: true,
      premiumSearchPlacement: true,
      reviewedBadge: true,
      featuredSupplierBadge: true,
      multipleTeamUsers: true,
      prioritySupport: true,
      dedicatedAccountManager: true,
      customOnboarding: true,
      apiAccess: true
    }
  }
}

interface SubscriptionContextType {
  // Current subscription state
  subscription: Subscription | null
  plan: SubscriptionPlan | null
  usage: SubscriptionUsage
  isLoading: boolean
  
  // Subscription checks
  hasFeature: (feature: keyof PlanFeatures) => boolean
  canUseFeature: (feature: keyof PlanFeatures) => { allowed: boolean; reason?: string }
  isWithinLimit: (limitKey: keyof PlanLimits) => boolean
  getRemainingLimit: (limitKey: keyof PlanLimits) => number
  getLimitPercentage: (limitKey: keyof PlanLimits) => number
  
  // Plan information
  getPlan: (planId: PlanId) => SubscriptionPlan
  getAllPlans: () => SubscriptionPlan[]
  getCurrentPlanId: () => PlanId
  
  // Actions (for demo purposes)
  upgradePlan: (planId: PlanId) => Promise<boolean>
  downgradePlan: (planId: PlanId) => Promise<boolean>
  cancelSubscription: () => Promise<boolean>
  
  // Usage tracking
  incrementUsage: (key: keyof SubscriptionUsage) => void
  resetMonthlyUsage: () => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<SubscriptionUsage>({
    productsUsed: 0,
    inquiriesThisMonth: 0,
    messagesThisMonth: 0,
    teamMembersUsed: 1,
    catalogsUploaded: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load subscription data based on user
  useEffect(() => {
    const loadSubscription = () => {
      setIsLoading(true)
      
      if (!user) {
        setSubscription(null)
        setIsLoading(false)
        return
      }

      // For buyers, they always have "free" plan (no subscription needed)
      if (user.role === "buyer") {
        setSubscription(null)
        setIsLoading(false)
        return
      }

      // For manufacturers, load their subscription from localStorage (demo)
      const storedSub = localStorage.getItem(`sourcenest_subscription_${user.id}`)
      const storedUsage = localStorage.getItem(`sourcenest_usage_${user.id}`)
      
      if (storedSub) {
        try {
          setSubscription(JSON.parse(storedSub))
        } catch {
          // Default subscription for demo
          const defaultSub: Subscription = {
            planId: "growth",
            status: "active",
            billingCycle: "monthly",
            currentPeriodStart: "2026-03-01",
            currentPeriodEnd: "2026-04-01",
            cancelAtPeriodEnd: false
          }
          setSubscription(defaultSub)
          localStorage.setItem(`sourcenest_subscription_${user.id}`, JSON.stringify(defaultSub))
        }
      } else {
        // Default subscription for demo (Growth plan)
        const defaultSub: Subscription = {
          planId: "growth",
          status: "active",
          billingCycle: "monthly",
          currentPeriodStart: "2026-03-01",
          currentPeriodEnd: "2026-04-01",
          cancelAtPeriodEnd: false
        }
        setSubscription(defaultSub)
        localStorage.setItem(`sourcenest_subscription_${user.id}`, JSON.stringify(defaultSub))
      }

      if (storedUsage) {
        try {
          setUsage(JSON.parse(storedUsage))
        } catch {
          // Default usage
          setUsage({
            productsUsed: 47,
            inquiriesThisMonth: 128,
            messagesThisMonth: 234,
            teamMembersUsed: 2,
            catalogsUploaded: 3
          })
        }
      } else {
        // Default usage for demo
        const defaultUsage: SubscriptionUsage = {
          productsUsed: 47,
          inquiriesThisMonth: 128,
          messagesThisMonth: 234,
          teamMembersUsed: 2,
          catalogsUploaded: 3
        }
        setUsage(defaultUsage)
        if (user.id) {
          localStorage.setItem(`sourcenest_usage_${user.id}`, JSON.stringify(defaultUsage))
        }
      }

      setIsLoading(false)
    }

    loadSubscription()
  }, [user])

  // Get current plan
  const plan = subscription ? plans[subscription.planId] : (user?.role === "buyer" ? plans.free : null)

  // Check if user has a specific feature
  const hasFeature = (feature: keyof PlanFeatures): boolean => {
    if (!plan) return false
    return plan.features[feature]
  }

  // Check if user can use a feature (with reason if not)
  const canUseFeature = (feature: keyof PlanFeatures): { allowed: boolean; reason?: string } => {
    if (!plan) {
      return { allowed: false, reason: "No active subscription" }
    }
    
    if (!plan.features[feature]) {
      return { 
        allowed: false, 
        reason: `This feature is not available on the ${plan.name} plan. Please upgrade to access it.` 
      }
    }

    if (subscription?.status === "past_due") {
      return { allowed: false, reason: "Please update your payment method to continue using this feature." }
    }

    if (subscription?.status === "expired" || subscription?.status === "canceled") {
      return { allowed: false, reason: "Your subscription has ended. Please renew to access this feature." }
    }

    return { allowed: true }
  }

  // Check if within a specific limit
  const isWithinLimit = (limitKey: keyof PlanLimits): boolean => {
    if (!plan) return false
    
    const limit = plan.limits[limitKey]
    if (limit === -1) return true // unlimited
    
    const usageMap: Record<keyof PlanLimits, keyof SubscriptionUsage> = {
      products: "productsUsed",
      inquiriesPerMonth: "inquiriesThisMonth",
      messagesPerMonth: "messagesThisMonth",
      teamMembers: "teamMembersUsed",
      catalogUploads: "catalogsUploaded"
    }
    
    const currentUsage = usage[usageMap[limitKey]]
    return currentUsage < limit
  }

  // Get remaining amount for a limit
  const getRemainingLimit = (limitKey: keyof PlanLimits): number => {
    if (!plan) return 0
    
    const limit = plan.limits[limitKey]
    if (limit === -1) return -1 // unlimited
    
    const usageMap: Record<keyof PlanLimits, keyof SubscriptionUsage> = {
      products: "productsUsed",
      inquiriesPerMonth: "inquiriesThisMonth",
      messagesPerMonth: "messagesThisMonth",
      teamMembers: "teamMembersUsed",
      catalogUploads: "catalogsUploaded"
    }
    
    const currentUsage = usage[usageMap[limitKey]]
    return Math.max(0, limit - currentUsage)
  }

  // Get usage percentage for a limit
  const getLimitPercentage = (limitKey: keyof PlanLimits): number => {
    if (!plan) return 0
    
    const limit = plan.limits[limitKey]
    if (limit === -1) return 0 // unlimited shows as 0%
    
    const usageMap: Record<keyof PlanLimits, keyof SubscriptionUsage> = {
      products: "productsUsed",
      inquiriesPerMonth: "inquiriesThisMonth",
      messagesPerMonth: "messagesThisMonth",
      teamMembers: "teamMembersUsed",
      catalogUploads: "catalogsUploaded"
    }
    
    const currentUsage = usage[usageMap[limitKey]]
    return Math.min(100, (currentUsage / limit) * 100)
  }

  // Get a specific plan
  const getPlan = (planId: PlanId): SubscriptionPlan => plans[planId]

  // Get all plans
  const getAllPlans = (): SubscriptionPlan[] => Object.values(plans)

  // Get current plan ID
  const getCurrentPlanId = (): PlanId => {
    if (subscription) return subscription.planId
    if (user?.role === "buyer") return "free"
    return "starter"
  }

  // Upgrade plan
  const upgradePlan = async (planId: PlanId): Promise<boolean> => {
    if (!user) return false
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newSub: Subscription = {
      planId,
      status: "active",
      billingCycle: "monthly",
      currentPeriodStart: new Date().toISOString().split("T")[0],
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      cancelAtPeriodEnd: false
    }
    
    setSubscription(newSub)
    localStorage.setItem(`sourcenest_subscription_${user.id}`, JSON.stringify(newSub))
    
    return true
  }

  // Downgrade plan
  const downgradePlan = async (planId: PlanId): Promise<boolean> => {
    if (!user || !subscription) return false
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newSub: Subscription = {
      ...subscription,
      planId,
      cancelAtPeriodEnd: false
    }
    
    setSubscription(newSub)
    localStorage.setItem(`sourcenest_subscription_${user.id}`, JSON.stringify(newSub))
    
    return true
  }

  // Cancel subscription
  const cancelSubscription = async (): Promise<boolean> => {
    if (!user || !subscription) return false
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newSub: Subscription = {
      ...subscription,
      cancelAtPeriodEnd: true
    }
    
    setSubscription(newSub)
    localStorage.setItem(`sourcenest_subscription_${user.id}`, JSON.stringify(newSub))
    
    return true
  }

  // Increment usage
  const incrementUsage = (key: keyof SubscriptionUsage) => {
    if (!user) return
    
    setUsage(prev => {
      const newUsage = { ...prev, [key]: prev[key] + 1 }
      localStorage.setItem(`sourcenest_usage_${user.id}`, JSON.stringify(newUsage))
      return newUsage
    })
  }

  // Reset monthly usage (would be called by a cron job in production)
  const resetMonthlyUsage = () => {
    if (!user) return
    
    setUsage(prev => {
      const newUsage = {
        ...prev,
        inquiriesThisMonth: 0,
        messagesThisMonth: 0
      }
      localStorage.setItem(`sourcenest_usage_${user.id}`, JSON.stringify(newUsage))
      return newUsage
    })
  }

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      plan,
      usage,
      isLoading,
      hasFeature,
      canUseFeature,
      isWithinLimit,
      getRemainingLimit,
      getLimitPercentage,
      getPlan,
      getAllPlans,
      getCurrentPlanId,
      upgradePlan,
      downgradePlan,
      cancelSubscription,
      incrementUsage,
      resetMonthlyUsage
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}

// Helper hook for checking feature access
export function useFeatureAccess(feature: keyof PlanFeatures) {
  const { hasFeature, canUseFeature, plan } = useSubscription()
  const access = canUseFeature(feature)
  
  return {
    hasAccess: access.allowed,
    reason: access.reason,
    planName: plan?.name,
    featureEnabled: hasFeature(feature)
  }
}

// Helper hook for checking limits
export function useLimitCheck(limitKey: keyof PlanLimits) {
  const { isWithinLimit, getRemainingLimit, getLimitPercentage, plan } = useSubscription()
  
  const limit = plan?.limits[limitKey] ?? 0
  const isUnlimited = limit === -1
  
  return {
    isWithinLimit: isWithinLimit(limitKey),
    remaining: getRemainingLimit(limitKey),
    percentage: getLimitPercentage(limitKey),
    limit: isUnlimited ? "Unlimited" : limit,
    isUnlimited
  }
}
