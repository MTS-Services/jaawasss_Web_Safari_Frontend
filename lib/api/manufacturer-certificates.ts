import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

// Certificate Type interfaces
export interface CertificateType {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
  status: "active" | "inactive"
}

export interface CertificateTypesResponse {
  success: boolean
  message: string
  data: CertificateType[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      page: number | null
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

// Certificate Creation/Response interfaces
export interface CreateCertificatePayload {
  certificate_type_id: number
  issuing_body: string
  certificate_number: string
  issue_date: string // Format: YYYY-MM-DD
  expiry_date: string // Format: YYYY-MM-DD
  certificate_pdf?: File // Optional file upload
  notes?: string
}

export interface Certificate {
  id: number
  certificate_type_id: number
  issuing_body: string
  certificate_number: string
  issue_date: string
  expiry_date: string
  certificate_pdf?: string // URL to the PDF
  notes?: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface CreateCertificateResponse {
  success: boolean
  message: string
  data: Certificate
}

export interface CertificatesListResponse {
  success: boolean
  message: string
  data: Certificate[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}

/**
 * Fetch all available certificate types for the dropdown menu
 * GET /manufacturer/certificate/types
 */
export async function fetchCertificateTypes(): Promise<CertificateType[]> {
  try {
    const response = await apiClient.get<CertificateTypesResponse>(
      "/manufacturer/certificate/types"
    )

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch certificate types")
    }

    return response.data.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch certificate types"))
  }
}

/**
 * Create a new manufacturer certificate
 * POST /manufacturer/certificate/create
 */
export async function createCertificate(
  payload: CreateCertificatePayload
): Promise<Certificate> {
  try {
    const formData = new FormData()

    // Add all text fields
    formData.append("certificate_type_id", payload.certificate_type_id.toString())
    formData.append("issuing_body", payload.issuing_body)
    formData.append("certificate_number", payload.certificate_number)
    formData.append("issue_date", payload.issue_date)
    formData.append("expiry_date", payload.expiry_date)

    // Add optional fields
    if (payload.notes) {
      formData.append("notes", payload.notes)
    }

    // Add file if provided
    if (payload.certificate_pdf) {
      formData.append("certificate_pdf", payload.certificate_pdf)
    }

    const response = await apiClient.post<CreateCertificateResponse>(
      "/manufacturer/certificate/create",
      formData
      // Don't set Content-Type header; let axios set it with the proper boundary for FormData
    )

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create certificate")
    }

    return response.data.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to create certificate"))
  }
}

/**
 * Fetch all certifications for the current manufacturer
 * GET /manufacturer/certifications
 */
export async function fetchCertifications(): Promise<Certificate[]> {
  try {
    const response = await apiClient.get<CertificatesListResponse>(
      "/manufacturer/certifications"
    )

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch certifications")
    }

    return response.data.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch certifications"))
  }
}
