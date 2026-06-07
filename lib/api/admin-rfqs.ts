import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface AdminRfqItem {
  id: number
  rfqNumber: string
  status: string
  quantity: number
  quantityUnit: string
  targetPrice: string
  targetCurrencyCode: string
  requiredDeliveryDate: string | null
  createdAt: string | null
  buyerName: string
  supplierCompanyName: string
  productName: string
  productSlug: string
  conversationId: number | null
}

export interface AdminRfqMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number | null
  to: number | null
}

export interface AdminRfqsResponse {
  success: boolean
  message?: string
  data: AdminRfqItem[]
  meta: AdminRfqMeta | null
}

export interface AdminRfqDetailResponse {
  success: boolean
  message?: string
  data: AdminRfqItem | null
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

function normalizeNullableName(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim()
  }

  return "N/A"
}

function normalizeBuyerName(rawBuyer: unknown): string {
  const buyer = toRecord(rawBuyer)
  const firstName = toString(buyer.first_name).trim()
  const lastName = toString(buyer.last_name).trim()
  const fullName = `${firstName} ${lastName}`.trim()

  if (fullName.length > 0) {
    return fullName
  }

  return "N/A"
}

function normalizeRfqItem(payload: unknown): AdminRfqItem {
  const item = toRecord(payload)
  const product = toRecord(item.product)
  const supplier = toRecord(item.supplier)

  return {
    id: toNumber(item.id),
    rfqNumber: normalizeNullableName(item.rfq_number),
    status: toString(item.status, "pending").trim().toLowerCase(),
    quantity: toNumber(item.quantity),
    quantityUnit: normalizeNullableName(item.quantity_unit),
    targetPrice: normalizeNullableName(item.target_price),
    targetCurrencyCode: normalizeNullableName(item.target_currency_code),
    requiredDeliveryDate: toNullableString(item.required_delivery_date),
    createdAt: toNullableString(item.created_at),
    buyerName: normalizeBuyerName(item.buyer),
    supplierCompanyName: normalizeNullableName(supplier.company_name),
    productName: normalizeNullableName(product.name),
    productSlug: toString(product.slug).trim(),
    conversationId: item.conversation_id == null ? null : toNumber(item.conversation_id),
  }
}

function normalizeMeta(payload: unknown): AdminRfqMeta | null {
  const meta = toRecord(payload)
  if (Object.keys(meta).length === 0) {
    return null
  }

  return {
    currentPage: toNumber(meta.current_page, 1),
    lastPage: toNumber(meta.last_page, 1),
    perPage: toNumber(meta.per_page, 15),
    total: toNumber(meta.total, 0),
    from: meta.from == null ? null : toNumber(meta.from),
    to: meta.to == null ? null : toNumber(meta.to),
  }
}

export async function getAdminRfqs(page = 1): Promise<AdminRfqsResponse> {
  try {
    const response = await apiClient.get("/admin/rfqs", { params: { page } })
    const payload = toRecord(response.data)
    const rows = Array.isArray(payload.data) ? payload.data : []

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: rows.map(normalizeRfqItem),
      meta: normalizeMeta(payload.meta),
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

export async function getAdminRfqById(id: number): Promise<AdminRfqDetailResponse> {
  try {
    const response = await apiClient.get(`/admin/rfqs/${id}`)
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: payload.data ? normalizeRfqItem(payload.data) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch RFQ details."),
      data: null,
    }
  }
}
