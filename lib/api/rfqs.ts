import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface CreateRFQPayload {
  product_id: number
  quantity: number
  quantity_unit: string
  target_price: number
  target_currency_code: string
  required_delivery_date: string
  shipping_terms: string
  destination_country: string
  destination_port_city: string
  packaging_details: string
  additional_requirements?: string
}

export interface RFQResponse {
  success: boolean
  message?: string
  data?: {
    id: number
    product_id: number
    quantity: number
    quantity_unit: string
    target_price: string
    target_currency_code: string
    required_delivery_date: string
    shipping_terms: string
    destination_country: string
    destination_port_city: string
    packaging_details: string
    additional_requirements: string | null
    status: string
    created_at: string
    updated_at: string
  }
}

// Create a new RFQ (Request for Quotation)
export async function createRFQ(payload: CreateRFQPayload): Promise<RFQResponse> {
  try {
    const response = await apiClient.post("/buyer/rfqs", payload)
    
    return {
      success: response.data?.success ?? true,
      message: response.data?.message,
      data: response.data?.data,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create RFQ."),
    }
  }
}
