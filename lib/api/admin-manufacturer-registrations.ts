import { apiClient } from "./client"

export interface ManufacturerApplication {
  id: number | string
  email: string
  company_name?: string
  first_name?: string
  last_name?: string
  country?: string
  city?: string
  company_website?: string
  status?: string
  created_at?: string
  notes?: string
  /** Extended fields for admin review */
  phone?: string
  terms_accepted?: boolean
  device_name?: string
  business_license_file?: string
  factory_images?: string[]
  primary_industry?: string
  employee_count?: string
  tax_id?: string
  business_registration_id?: string
  application_reference?: string
  role?: string
  avatar?: string | null
  avatar_url?: string | null
  status_label?: string
  statuses?: Record<string, string>
  agreed_to_terms?: boolean
  two_factor_enabled?: boolean
  deactivated_at?: string | null
  deactivated_reason?: string | null
  updated_at?: string
  preferred_language?: string
  timezone?: string
  quote_notification?: number
  message_notification?: number
  supplier_update?: number
  weekly_digest?: number
  marketing_promotion?: number
  manufacture_status?: string
  manufacture_status_label?: string
  rejection_reason?: string | null
  total_products?: number
  reviews?: Array<unknown>
  total_reviews?: number
  preferred_currency?: {
    code: string
    symbol: string
  }
  company?: {
    company_name?: string
    short_description?: string | null
    long_description?: string | null
    minimum_order_value?: string | null
    company_logo?: string | null
    company_logo_url?: string | null
    company_type?: string | null
    company_established?: string | null
    company_size?: string | null
    revenue?: string | null
    country?: string
    city?: string
    street_address?: string | null
    phone?: string | null
    zip_code?: string | null
    capabilities?: string | null
    certifications?: string | null
    export_markets?: string | null
    language_spoken?: string | null
    payments_term?: string | null
    bussiness_license?: string
    bussiness_license_url?: string
    company_website?: string
    notes?: string
    factory_production?: number
    mulitple_factories?: number
    industries?: Array<unknown>
    created_at?: string
  }
  factory_images?: Array<{
    id: number
    path: string
    url: string
    mime_type: string
    extension: string
    original_name: string
    created_at: string
    updated_at: string
  }>
}

export interface ManufacturerDetailResponse {
  success: boolean
  message: string
  data: ManufacturerApplication
}

export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  path: string
  per_page: number
  to: number
  total: number
  links?: Array<{
    url: string | null
    label: string
    page: number | null
    active: boolean
  }>
}

export interface ManufacturerRegistrationResponse {
  success: boolean
  message: string
  data: ManufacturerApplication[]
  links?: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: PaginationMeta
}

export async function fetchManufacturerRegistrations(
  page: number = 1,
  status: string = "pending",
  perPage: number = 10
): Promise<ManufacturerRegistrationResponse> {
  try {
    const response = await apiClient.get<ManufacturerRegistrationResponse>(
      "/admin/manufacturer",
      {
        params: {
          page,
          status,
          per_page: perPage,
        },
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export async function fetchManufacturerDetail(
  manufacturerId: number | string
): Promise<ManufacturerDetailResponse> {
  try {
    const response = await apiClient.get<ManufacturerDetailResponse>(
      `/admin/manufacturer/${manufacturerId}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export async function deleteManufacturer(
  manufacturerId: number | string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/admin/manufacturer/${manufacturerId}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export async function approveManufacturer(
  manufacturerId: number | string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.patch<{ success: boolean; message: string }>(
      `/admin/manufacturer/${manufacturerId}/change/status`,
      {
        manufacture_status: "approved",
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export async function rejectManufacturer(
  manufacturerId: number | string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiClient.patch<{ success: boolean; message: string }>(
      `/admin/manufacturer/${manufacturerId}/change/status`,
      {
        manufacture_status: "rejected",
        manufacture_status_reason: reason,
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export async function fetchSuppliers(
  page: number = 1,
  perPage: number = 10
): Promise<ManufacturerRegistrationResponse> {
  try {
    const response = await apiClient.get<ManufacturerRegistrationResponse>(
      "/admin/manufacturer",
      {
        params: {
          page,
          per_page: perPage,
        },
      }
    )
    return response.data
  } catch (error) {
    throw error
  }
}
