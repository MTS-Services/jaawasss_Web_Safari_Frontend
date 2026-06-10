export interface PlanFeature {
  name: string
  included: boolean
  limit?: string
}

export interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number | null
  yearlyPrice: number | null
  features: PlanFeature[]
  productLimit: number | string
  teamMembers: number | string
  searchVisibility: "standard" | "priority" | "premium"
  analyticsLevel: "basic" | "advanced" | "enterprise"
  supportLevel: "email" | "priority" | "dedicated"
  popular: boolean
  active: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small manufacturers starting their export journey",
    monthlyPrice: 149,
    yearlyPrice: 1490,
    productLimit: 25,
    teamMembers: 1,
    searchVisibility: "standard",
    analyticsLevel: "basic",
    supportLevel: "email",
    popular: false,
    active: true,
    features: [
      { name: "Company profile", included: true },
      { name: "Up to 25 products", included: true },
      { name: "Internal messaging", included: true },
      { name: "Inquiry inbox", included: true },
      { name: "RFQ reception", included: true },
      { name: "Catalog upload", included: true },
      { name: "Certifications section", included: true },
      { name: "Export markets section", included: true },
      { name: "Basic analytics", included: true },
      { name: "Priority search visibility", included: false },
      { name: "Featured supplier badge", included: false },
      { name: "Multiple team users", included: false },
      { name: "Advanced analytics", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "For established manufacturers seeking more exposure",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    productLimit: 100,
    teamMembers: 3,
    searchVisibility: "priority",
    analyticsLevel: "advanced",
    supportLevel: "priority",
    popular: true,
    active: true,
    features: [
      { name: "Company profile", included: true },
      { name: "Up to 100 products", included: true },
      { name: "Internal messaging", included: true },
      { name: "Inquiry inbox", included: true },
      { name: "RFQ reception", included: true },
      { name: "Catalog upload", included: true },
      { name: "Certifications section", included: true },
      { name: "Export markets section", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority search visibility", included: true },
      { name: "Featured supplier badge", included: true },
      { name: "Multiple team users (3)", included: true },
      { name: "Premium support", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large manufacturers with custom requirements",
    monthlyPrice: null,
    yearlyPrice: null,
    productLimit: "Unlimited",
    teamMembers: "Unlimited",
    searchVisibility: "premium",
    analyticsLevel: "enterprise",
    supportLevel: "dedicated",
    popular: false,
    active: true,
    features: [
      { name: "Company profile", included: true },
      { name: "Unlimited products", included: true },
      { name: "Internal messaging", included: true },
      { name: "Inquiry inbox", included: true },
      { name: "RFQ reception", included: true },
      { name: "Catalog upload", included: true },
      { name: "Certifications section", included: true },
      { name: "Export markets section", included: true },
      { name: "Enterprise analytics", included: true },
      { name: "Premium search placement", included: true },
      { name: "Featured supplier badge", included: true },
      { name: "Unlimited team users", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Priority support", included: true },
      { name: "Custom onboarding", included: true },
    ],
  },
]

export function getPlanById(id: string): PricingPlan | undefined {
  return pricingPlans.find(p => p.id === id)
}

export function getActivePlans(): PricingPlan[] {
  return pricingPlans.filter(p => p.active)
}
