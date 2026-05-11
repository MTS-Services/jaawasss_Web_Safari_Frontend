import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface AdminCertification {
  id: number | string
  certificate_type_id: number | string
  certificate_type_name: string
  issuing_body: string
  certificate_number: string
  issue_date: string
  expiry_date: string
  certificate_pdf: string | null
  notes: string
  status: "pending" | "valid"
  user_id?: number | string
  manufacturer_name: string
  manufacturer_email: string
  created_at?: string
  updated_at?: string
}

export interface AdminCertificationsPagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number | null
  to: number | null
}

export interface AdminCertificationsResponse {
  success: boolean
  message?: string
  data: AdminCertification[]
  pagination?: AdminCertificationsPagination
}

export interface AdminCertificationMutationResponse {
  success: boolean
  message?: string
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

function toNullableString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }
  return null
}

function toStatus(value: unknown): "pending" | "valid" {
  const status = toString(value, "pending").toLowerCase()
  return status === "valid" ? "valid" : "pending"
}

function getNestedString(record: RecordLike, path: string[]): string {
  let current: unknown = record
  for (const key of path) {
    const currentRecord = toRecord(current)
    current = currentRecord[key]
  }
  return toString(current)
}

function normalizeCertification(payload: unknown): AdminCertification {
  const record = toRecord(payload)
  const certificateType = toRecord(record.certificateType ?? record.certificate_type)
  const user = toRecord(record.user)

  const manufacturerName = `${toString(user.first_name).trim()} ${toString(user.last_name).trim()}`.trim() ||
    toString(record.manufacturer_name) ||
    toString(record.company_name) ||
    "Unknown Manufacturer"

  const manufacturerEmail =
    toString(user.email) ||
    toString(record.manufacturer_email) ||
    toString(record.email) ||
    ""

  const certificatePdf =
    toNullableString(record.certificate_pdf_url) ||
    toNullableString(record.certificate_pdf) ||
    toNullableString(record.document_url) ||
    toNullableString(record.file_url)

  const certificateTypeName = toString(certificateType.name) || toString(record.certificate_type_name) || "Unknown Type"

  return {
    id: typeof record.id === "number" ? record.id : toString(record.id),
    certificate_type_id:
      typeof record.certificate_type_id === "number"
        ? record.certificate_type_id
        : toString(record.certificate_type_id),
    certificate_type_name: certificateTypeName,
    issuing_body: toString(record.issuing_body),
    certificate_number: toString(record.certificate_number),
    issue_date: toString(record.issue_date),
    expiry_date: toString(record.expiry_date),
    certificate_pdf: certificatePdf,
    notes: toString(record.notes),
    status: toStatus(record.status),
    user_id:
      typeof record.user_id === "number"
        ? record.user_id
        : toString(record.user_id) || undefined,
    manufacturer_name: manufacturerName,
    manufacturer_email: manufacturerEmail,
    created_at: toString(record.created_at),
    updated_at: toString(record.updated_at),
  }
}

function normalizeListResponse(payload: unknown): AdminCertificationsResponse {
  const root = toRecord(payload)
  const rawData = Array.isArray(root.data)
    ? root.data
    : Array.isArray(payload)
      ? payload
      : []

  const response: AdminCertificationsResponse = {
    success: typeof root.success === "boolean" ? root.success : true,
    message: typeof root.message === "string" ? root.message : undefined,
    data: rawData.map(normalizeCertification),
  }

  const meta = toRecord(root.meta ?? root.pagination)
  if (Object.keys(meta).length > 0) {
    response.pagination = {
      current_page: toNumber(meta.current_page, 1),
      per_page: toNumber(meta.per_page, 10),
      total: toNumber(meta.total, rawData.length),
      last_page: toNumber(meta.last_page, 1),
      from:
        meta.from === null
          ? null
          : toNumber(meta.from, 0) || null,
      to:
        meta.to === null
          ? null
          : toNumber(meta.to, 0) || null,
    }
  }

  return response
}

function normalizeMutationResponse(
  payload: unknown,
  fallbackMessage: string
): AdminCertificationMutationResponse {
  const root = toRecord(payload)
  return {
    success: typeof root.success === "boolean" ? root.success : true,
    message: typeof root.message === "string" ? root.message : fallbackMessage,
  }
}

export async function getAdminCertifications(
  search?: string,
  page = 1,
  perPage = 10
): Promise<AdminCertificationsResponse> {
  const params = new URLSearchParams()
  if (search && search.trim()) {
    params.append("search", search.trim())
  }
  params.append("page", String(page))
  params.append("per_page", String(perPage))

  try {
    const response = await apiClient.get("/admin/certifications", { params })
    return normalizeListResponse(response.data)
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch certifications."),
      data: [],
    }
  }
}

export async function deleteAdminCertification(
  certificationId: string | number
): Promise<AdminCertificationMutationResponse> {
  try {
    const response = await apiClient.delete(`/admin/certifications/${certificationId}`)
    return normalizeMutationResponse(response.data, "Certification deleted successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to delete certification."),
    }
  }
}
