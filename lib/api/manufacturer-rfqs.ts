import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface ManufacturerRfqProduct {
  id: number
  name: string
  slug: string
}

export interface ManufacturerRfqBuyer {
  id: number
  name: string
  email: string
}

export interface ManufacturerRfqItem {
  id: number
  rfq_number: string
  status: string
  created_at: string
  quantity: number
  quantity_unit: string
  target_price: string
  target_currency_code: string
  required_delivery_date: string | null
  shipping_terms: string
  destination_country: string
  destination_port_city: string
  packaging_details: string
  additional_requirements: string
  manufacturer_reply: string | null
  quoted_price: string | null
  quote_currency_code: string | null
  minimum_order_quantity: number | null
  lead_time_days: number | null
  quote_valid_until: string | null
  quoted_at: string | null
  buyer_action_at: string | null
  product: ManufacturerRfqProduct
  buyer: ManufacturerRfqBuyer
  send_quote_endpoint: string
  reply_endpoint: string
}

export interface ManufacturerRfqCounts {
  total_rfqs: number
  in_review: number
  quoted: number
  accepted: number
  cancelled: number
  expired: number
}

export interface ManufacturerRfqMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ManufacturerRfqListResponse {
  data: ManufacturerRfqItem[]
  meta: ManufacturerRfqMeta
}

export interface SendQuotePayload {
  quoted_price: number
  quote_currency_code: string
  minimum_order_quantity: number
  lead_time_days: number
  quote_valid_until: string
  manufacturer_reply: string
}

export interface ReplyPayload {
  manufacturer_reply: string
}

export async function getManufacturerRfqCounts(): Promise<{ data: ManufacturerRfqCounts | null; error: string | null }> {
  try {
    const response = await apiClient.get<{ success: boolean; data: ManufacturerRfqCounts }>("/manufacturer/rfqs/counts")
    return { data: response.data.data, error: null }
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error) }
  }
}

export async function getManufacturerRfqs(params?: {
  page?: number
  status?: string
  search?: string
}): Promise<{ data: ManufacturerRfqListResponse | null; error: string | null }> {
  try {
    const response = await apiClient.get<{ success: boolean; data: ManufacturerRfqItem[]; meta: ManufacturerRfqMeta }>("/manufacturer/rfqs", { params })
    return {
      data: { data: response.data.data, meta: response.data.meta },
      error: null,
    }
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error) }
  }
}

export async function getManufacturerRfq(id: number): Promise<{ data: ManufacturerRfqItem | null; error: string | null }> {
  try {
    const response = await apiClient.get<{ success: boolean; data: ManufacturerRfqItem }>(`/manufacturer/rfqs/${id}`)
    return { data: response.data.data, error: null }
  } catch (error) {
    return { data: null, error: getApiErrorMessage(error) }
  }
}

export async function sendManufacturerRfqReply(id: number, payload: ReplyPayload): Promise<{ success: boolean; error: string | null }> {
  try {
    await apiClient.post(`/manufacturer/rfqs/${id}/reply`, payload)
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error) }
  }
}

export async function sendManufacturerRfqQuote(id: number, payload: SendQuotePayload): Promise<{ success: boolean; error: string | null }> {
  try {
    await apiClient.post(`/manufacturer/rfqs/${id}/quote`, payload)
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error) }
  }
}
