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
  user_id?: number
  issuing_body: string
  certificate_number: string
  issue_date: string
  expiry_date: string
  certificate_pdf?: string
  certificate_pdf_url?: string
  notes?: string
  status: "pending" | "valid" | "active" | "inactive"
  created_at: string
  updated_at: string
  certificateType?: {
    id: number
    name: string
    slug: string
    status: string
  }
}

export interface CertificatesMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
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
  meta: CertificatesMeta
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

export interface UpdateCertificatePayload {
  certificate_type_id?: number
  issuing_body?: string
  certificate_number?: string
  issue_date?: string
  expiry_date?: string
  certificate_pdf?: File
  notes?: string
}

/**
 * Fetch paginated certifications for the current manufacturer
 * GET /manufacturer/certificate?page=1&per_page=10
 */
export async function fetchCertifications(
  page = 1,
  perPage = 10
): Promise<CertificatesListResponse> {
  try {
    const response = await apiClient.get<CertificatesListResponse>(
      "/manufacturer/certificate",
      { params: { page, per_page: perPage } }
    )

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch certifications")
    }

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch certifications"))
  }
}

/**
 * Update an existing manufacturer certificate
 * PUT /manufacturer/certificate/{id}
 * Laravel requires method spoofing via _method=PUT when sending multipart FormData
 */
export async function updateCertificate(
  id: number,
  payload: UpdateCertificatePayload
): Promise<Certificate> {
  try {
    // If a new PDF file is included we must use multipart FormData.
    // Laravel cannot parse multipart on a native PUT, so we POST with _method=PUT (method spoofing).
    if (payload.certificate_pdf) {
      const formData = new FormData()
      formData.append("_method", "PUT")
      formData.append("certificate_type_id", payload.certificate_type_id?.toString() ?? "")
      formData.append("issuing_body", payload.issuing_body ?? "")
      formData.append("certificate_number", payload.certificate_number ?? "")
      formData.append("issue_date", payload.issue_date ?? "")
      formData.append("expiry_date", payload.expiry_date ?? "")
      if (payload.notes !== undefined) {
        formData.append("notes", payload.notes)
      }
      formData.append("certificate_pdf", payload.certificate_pdf)

      const response = await apiClient.post<CreateCertificateResponse>(
        `/manufacturer/certificate/${id}`,
        formData
      )

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update certificate")
      }

      return response.data.data
    }

    // No file — send a clean JSON PUT request
    const body: Record<string, unknown> = {}
    if (payload.certificate_type_id !== undefined) body.certificate_type_id = payload.certificate_type_id
    if (payload.issuing_body !== undefined) body.issuing_body = payload.issuing_body
    if (payload.certificate_number !== undefined) body.certificate_number = payload.certificate_number
    if (payload.issue_date !== undefined) body.issue_date = payload.issue_date
    if (payload.expiry_date !== undefined) body.expiry_date = payload.expiry_date
    if (payload.notes !== undefined) body.notes = payload.notes

    const response = await apiClient.put<CreateCertificateResponse>(
      `/manufacturer/certificate/${id}`,
      body
    )

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update certificate")
    }

    return response.data.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to update certificate"))
  }
}

/**
 * Delete a manufacturer certificate
 * DELETE /manufacturer/certificate/{id}
 */
export async function deleteCertificate(id: number): Promise<void> {
  try {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/manufacturer/certificate/${id}`
    )
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete certificate")
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to delete certificate"))
  }
}
