import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface CertificateType {
  id: number | string
  name: string
  slug: string
  status: "active" | "inactive"
  created_at?: string
  updated_at?: string
  usage_count?: number
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}

export interface CertificateTypesResponse {
  success: boolean
  message?: string
  data: CertificateType[]
  pagination?: PaginationMeta
}

export interface CertificateTypeMutationResponse {
  success: boolean
  message?: string
  data?: CertificateType
}

export interface CreateCertificateTypeInput {
  name: string
  slug: string
  status: "active" | "inactive"
}

function toRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
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

function normalizeCertificateType(payload: unknown): CertificateType {
  const record = toRecord(payload)
  const status = toString(record.status, "active").toLowerCase()

  return {
    id: typeof record.id === "number" ? record.id : toString(record.id),
    name: toString(record.name),
    slug: toString(record.slug),
    status: (status === "active" || status === "inactive" ? status : "active") as "active" | "inactive",
    created_at: toString(record.created_at ?? record.createdAt),
    updated_at: toString(record.updated_at ?? record.updatedAt),
    usage_count: toNumber(record.usage_count ?? record.usageCount),
  }
}

function normalizeCertificateTypesResponse(payload: unknown): CertificateTypesResponse {
  const root = toRecord(payload)
  const rawData = Array.isArray(root.data)
    ? root.data
    : Array.isArray(payload)
      ? payload
      : []

  const response: CertificateTypesResponse = {
    success: typeof root.success === "boolean" ? root.success : true,
    message: typeof root.message === "string" ? root.message : undefined,
    data: rawData.map(normalizeCertificateType),
  }

  // Handle pagination metadata
  const paginationMeta = toRecord(root.meta ?? root.pagination)
  if (Object.keys(paginationMeta).length > 0) {
    response.pagination = {
      current_page: toNumber(paginationMeta.current_page ?? 1),
      per_page: toNumber(paginationMeta.per_page ?? 10),
      total: toNumber(paginationMeta.total ?? 0),
      last_page: toNumber(paginationMeta.last_page ?? 1),
      from: toNumber(paginationMeta.from ?? 0),
      to: toNumber(paginationMeta.to ?? 0),
    }
  }

  return response
}

function normalizeMutationResponse(
  payload: unknown,
  fallbackMessage: string
): CertificateTypeMutationResponse {
  const root = toRecord(payload)

  return {
    success: typeof root.success === "boolean" ? root.success : true,
    message: typeof root.message === "string" ? root.message : fallbackMessage,
    data: root.data ? normalizeCertificateType(root.data) : undefined,
  }
}

export async function getAdminCertificateTypes(
  search?: string,
  page: number = 1,
  perPage: number = 10
): Promise<CertificateTypesResponse> {
  try {
    const params = new URLSearchParams()
    if (search && search.trim()) {
      params.append("search", search.trim())
    }
    params.append("page", String(page))
    params.append("per_page", String(perPage))

    const response = await apiClient.get("/admin/certificate-types", { params })
    return normalizeCertificateTypesResponse(response.data)
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch certificate types."),
      data: [],
    }
  }
}

export async function createAdminCertificateType(
  input: CreateCertificateTypeInput
): Promise<CertificateTypeMutationResponse> {
  try {
    const params = new URLSearchParams()
    params.append("name", input.name)
    params.append("slug", input.slug)
    params.append("status", input.status)

    const response = await apiClient.post("/admin/certificate-types/create", params)
    return normalizeMutationResponse(response.data, "Certificate type created successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create certificate type."),
    }
  }
}

export async function updateAdminCertificateType(
  typeId: string | number,
  input: CreateCertificateTypeInput
): Promise<CertificateTypeMutationResponse> {
  try {
    const params = new URLSearchParams()
    params.append("name", input.name)
    params.append("slug", input.slug)
    params.append("status", input.status)

    const response = await apiClient.put(`/admin/certificate-types/${typeId}`, params)
    return normalizeMutationResponse(response.data, "Certificate type updated successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update certificate type."),
    }
  }
}

export async function deleteAdminCertificateType(
  typeId: string | number
): Promise<CertificateTypeMutationResponse> {
  try {
    const response = await apiClient.delete(`/admin/certificate-types/${typeId}`)
    return normalizeMutationResponse(response.data, "Certificate type deleted successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to delete certificate type."),
    }
  }
}
