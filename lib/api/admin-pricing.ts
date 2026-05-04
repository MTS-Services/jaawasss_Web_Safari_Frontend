import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface PricingFeature {
  id: number
  name: string
  description?: string
  input_type: string
  sort?: number
}

export interface PricingPlan {
  id: number
  name: string
  description: string
  monthly_price: {
    amount: string
    currency: string
  }
  monthly_price_display: {
    amount: string
    currency: string
  } | null
  yearly_price: {
    amount: string
    currency: string
  }
  yearly_price_display: {
    amount: string
    currency: string
  } | null
  button_text: string
  is_popular: boolean
  status: number
  created_at: string | null
  updated_at: string | null
  features?: Array<{
    id: number
    input_type: string
    value: string
  }>
}

export interface PlansResponse {
  success: boolean
  message: string
  data: PricingPlan[]
}

export interface CreatePlanPayload {
  name: string
  description: string
  button_text: string
  monthly_price: number
  yearly_price: number
  currency_code: string
  features: Array<{
    id: number
    input_type: string
    value: string
  }>
}

export interface CreatePlanResponse {
  success: boolean
  message: string
  data?: PricingPlan
}

export async function fetchPlans(): Promise<PricingPlan[]> {
  try {
    const response = await apiClient.get<PlansResponse>("/plans")
    const plans = response.data?.data || []
    
    // Fetch details for each plan to get features (if not included in list response)
    const plansWithFeatures = await Promise.all(
      plans.map(async (plan) => {
        // If plan already has features, return it as is
        if (plan.features && plan.features.length > 0) {
          return plan
        }
        
        // Otherwise, try to fetch individual plan details
        try {
          const detailResponse = await apiClient.get<{ success: boolean; data?: PricingPlan }>(`/plans/${plan.id}`)
          return detailResponse.data?.data || plan
        } catch {
          // If detail fetch fails, return plan without additional features
          return plan
        }
      })
    )
    
    return plansWithFeatures
  } catch (error) {
    console.error("Failed to fetch plans:", getApiErrorMessage(error))
    return []
  }
}

export async function createPlan(payload: CreatePlanPayload): Promise<{ success: boolean; message: string; plan?: PricingPlan }> {
  try {
    const response = await apiClient.post<CreatePlanResponse>("/admin/plans/create", payload)
    return {
      success: response.data?.success || false,
      message: response.data?.message || "Plan created successfully",
      plan: response.data?.data
    }
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    console.error("Failed to create plan:", errorMessage)
    return {
      success: false,
      message: errorMessage || "Failed to create plan"
    }
  }
}

export interface UpdatePlanPayload {
  name: string
  description: string
  button_text: string
  monthly_price: number
  yearly_price: number
  status: boolean
  is_popular: boolean
  features: Array<{
    id: number
    input_type: string
    value: string
  }>
}

export async function updatePlan(planId: number | string, payload: UpdatePlanPayload): Promise<{ success: boolean; message: string; plan?: PricingPlan }> {
  try {
    const response = await apiClient.put<CreatePlanResponse>(`/admin/plans/${planId}`, payload)
    return {
      success: response.data?.success || false,
      message: response.data?.message || "Plan updated successfully",
      plan: response.data?.data
    }
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    console.error("Failed to update plan:", errorMessage)
    return {
      success: false,
      message: errorMessage || "Failed to update plan"
    }
  }
}

export async function deletePlan(planId: number | string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/admin/plans/${planId}`)
    return {
      success: response.data?.success || false,
      message: response.data?.message || "Plan deleted successfully"
    }
  } catch (error) {
    const errorMessage = getApiErrorMessage(error)
    console.error("Failed to delete plan:", errorMessage)
    return {
      success: false,
      message: errorMessage || "Failed to delete plan"
    }
  }
}

export async function fetchPlanFeatures(): Promise<PricingFeature[]> {
  try {
    const response = await apiClient.get<{ success: boolean; data?: PricingFeature[] }>("/admin/plan-features")
    return response.data?.data || []
  } catch (error) {
    console.error("Failed to fetch plan features:", getApiErrorMessage(error))
    return []
  }
}
