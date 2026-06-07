import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface BuyerRfqItem {
  id: number
  rfqNumber: string
  status: string
  createdAt: string | null
  quantity: number
  quantityUnit: string
  targetPrice: string
  targetCurrencyCode: string
  requiredDeliveryDate: string | null
  shippingTerms: string
  destinationCountry: string
  destinationPortCity: string
  packagingDetails: string
  additionalRequirements: string
  conversationId: number | null
  productName: string
  productSlug: string
  supplierCompanyName: string
  supplierLocation: string
  messageEndpoint: string
}

export interface BuyerRfqMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number | null
  to: number | null
}

export interface BuyerRfqsResponse {
  success: boolean
  message?: string
  data: BuyerRfqItem[]
  meta: BuyerRfqMeta | null
}

export interface BuyerRfqDetailResponse {
  success: boolean
  message?: string
  data: BuyerRfqItem | null
}

export interface RespondQuoteResponse {
  success: boolean
  message?: string
  data?: Record<string, unknown>
}

export interface GetBuyerRfqsInput {
  page?: number
  perPage?: number
  search?: string
  status?: string
}

type RecordLike = Record<string, unknown>

function toRecord(value: unknown): RecordLike {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as RecordLike
  }

  return {}
}

function toString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  return fallback
}

function toNullableString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  return null
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

function nonEmptyOrNA(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim()
  }

  return "N/A"
}

function normalizeRfqItem(payload: unknown): BuyerRfqItem {
  const item = toRecord(payload)
  const product = toRecord(item.product)
  const supplier = toRecord(item.supplier)

  return {
    id: toNumber(item.id),
    rfqNumber: nonEmptyOrNA(item.rfq_number),
    status: toString(item.status, "pending").trim().toLowerCase(),
    createdAt: toNullableString(item.created_at),
    quantity: toNumber(item.quantity),
    quantityUnit: nonEmptyOrNA(item.quantity_unit),
    targetPrice: nonEmptyOrNA(item.target_price),
    targetCurrencyCode: nonEmptyOrNA(item.target_currency_code),
    requiredDeliveryDate: toNullableString(item.required_delivery_date),
    shippingTerms: nonEmptyOrNA(item.shipping_terms),
    destinationCountry: nonEmptyOrNA(item.destination_country),
    destinationPortCity: nonEmptyOrNA(item.destination_port_city),
    packagingDetails: nonEmptyOrNA(item.packaging_details),
    additionalRequirements: nonEmptyOrNA(item.additional_requirements),
    conversationId: item.conversation_id == null ? null : toNumber(item.conversation_id),
    productName: nonEmptyOrNA(product.name),
    productSlug: toString(product.slug).trim(),
    supplierCompanyName: nonEmptyOrNA(supplier.company_name),
    supplierLocation: nonEmptyOrNA(supplier.location),
    messageEndpoint: toString(item.message_endpoint).trim(),
  }
}

function normalizeMeta(payload: unknown): BuyerRfqMeta | null {
  const meta = toRecord(payload)
  if (Object.keys(meta).length === 0) {
    return null
  }

  return {
    currentPage: toNumber(meta.current_page, 1),
    lastPage: toNumber(meta.last_page, 1),
    perPage: toNumber(meta.per_page, 10),
    total: toNumber(meta.total, 0),
    from: meta.from == null ? null : toNumber(meta.from),
    to: meta.to == null ? null : toNumber(meta.to),
  }
}

export async function getBuyerRfqs(input: GetBuyerRfqsInput = {}): Promise<BuyerRfqsResponse> {
  const { page = 1, perPage = 10, search, status } = input

  try {
    const response = await apiClient.get("/buyer/rfqs", {
      params: {
        page,
        per_page: perPage,
        ...(search ? { search } : {}),
        ...(status && status !== "all" ? { status } : {}),
      },
    })

    const root = toRecord(response.data)
    const rows = Array.isArray(root.data) ? root.data : []

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: typeof root.message === "string" ? root.message : undefined,
      data: rows.map(normalizeRfqItem),
      meta: normalizeMeta(root.meta),
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch RFQs."),
      data: [],
      meta: null,
    }
  }
}

export async function getBuyerRfqById(id: number): Promise<BuyerRfqDetailResponse> {
  try {
    const response = await apiClient.get(`/buyer/rfqs/${id}`)
    const root = toRecord(response.data)

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: typeof root.message === "string" ? root.message : undefined,
      data: root.data ? normalizeRfqItem(root.data) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch RFQ details."),
      data: null,
    }
  }
}

export async function respondToRfqQuote(
  id: number,
  action: "accept" | "cancel"
): Promise<RespondQuoteResponse> {
  try {
    const response = await apiClient.post(`/buyer/rfqs/${id}/respond-quote`, {
      action,
    })

    const root = toRecord(response.data)

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: typeof root.message === "string" ? root.message : undefined,
      data: root.data as Record<string, unknown> | undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(
        error,
        action === "accept"
          ? "Failed to accept RFQ."
          : "Failed to reject RFQ."
      ),
    }
  }
}
