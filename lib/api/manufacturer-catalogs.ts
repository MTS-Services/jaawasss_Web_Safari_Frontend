import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface ManufacturerCatalog {
  id: number
  name: string
  file_size: string
  file_path: string
  total_downloads: string | number
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface ManufacturerCatalogMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number | null
  to: number | null
}

export interface ManufacturerCatalogsResponse {
  success: boolean
  message?: string
  data: ManufacturerCatalog[]
  meta: ManufacturerCatalogMeta | null
}

export interface ManufacturerCatalogDetailResponse {
  success: boolean
  message?: string
  data: ManufacturerCatalog | null
}

export interface ManufacturerCatalogActionResponse {
  success: boolean
  message?: string
}

export interface ManufacturerCatalogStats {
  total_catalogs: number
  active_catalogs: number
  inactive_catalogs: number
  draft_catalogs: number
}

export interface ManufacturerCatalogStatsResponse {
  success: boolean
  message?: string
  data: ManufacturerCatalogStats
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

function normalizeCatalog(payload: unknown): ManufacturerCatalog {
  const catalog = toRecord(payload)

  return {
    id: toNumber(catalog.id),
    name: toString(catalog.name, "N/A"),
    file_size: toString(catalog.file_size, "0 MB"),
    file_path: toString(catalog.file_path, ""),
    total_downloads: toNumber(catalog.total_downloads, 0),
    status: (
      ["active", "inactive"].includes(toString(catalog.status).toLowerCase())
        ? toString(catalog.status).toLowerCase()
        : "active"
    ) as "active" | "inactive",
    created_at: toString(catalog.created_at, ""),
    updated_at: toString(catalog.updated_at, ""),
  }
}

function normalizeMeta(payload: unknown): ManufacturerCatalogMeta | null {
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

export async function getManufacturerCatalogs(
  page = 1,
  filters?: Record<string, unknown>
): Promise<ManufacturerCatalogsResponse> {
  try {
    const params: Record<string, unknown> = { page, ...filters }
    const response = await apiClient.get("/manufacturer/catalogs", { params })
    const payload = toRecord(response.data)
    const rows = Array.isArray(payload.data) ? payload.data : []

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: rows.map(normalizeCatalog),
      meta: normalizeMeta(payload.meta),
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch catalogs."),
      data: [],
      meta: null,
    }
  }
}

export async function getManufacturerCatalogById(
  id: number
): Promise<ManufacturerCatalogDetailResponse> {
  try {
    const response = await apiClient.get(`/manufacturer/catalogs/${id}`)
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: payload.data ? normalizeCatalog(payload.data) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch catalog details."),
      data: null,
    }
  }
}

export async function updateManufacturerCatalog(
  id: number,
  data: FormData | Record<string, unknown>
): Promise<ManufacturerCatalogActionResponse> {
  try {
    const config = data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    const response = await apiClient.put(`/manufacturer/catalogs/${id}`, data, config)
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update catalog."),
    }
  }
}

export async function deleteManufacturerCatalog(
  id: number
): Promise<ManufacturerCatalogActionResponse> {
  try {
    const response = await apiClient.delete(`/manufacturer/catalogs/${id}`)
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to delete catalog."),
    }
  }
}

export async function changeManufacturerCatalogStatus(
  id: number,
  status: "active" | "inactive"
): Promise<ManufacturerCatalogActionResponse> {
  try {
    const response = await apiClient.patch(
      `/manufacturer/catalogs/${id}/change-status`,
      { status }
    )
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to change catalog status."),
    }
  }
}

export async function getManufacturerCatalogStats(): Promise<ManufacturerCatalogStatsResponse> {
  try {
    const response = await apiClient.get("/manufacturer/catalogs/stats")
    const payload = toRecord(response.data)
    const statsData = toRecord(payload.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: {
        total_catalogs: toNumber(statsData.total_catalogs, 0),
        active_catalogs: toNumber(statsData.active_catalogs, 0),
        inactive_catalogs: toNumber(statsData.inactive_catalogs, 0),
        draft_catalogs: toNumber(statsData.draft_catalogs, 0),
      },
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch catalog stats."),
      data: {
        total_catalogs: 0,
        active_catalogs: 0,
        inactive_catalogs: 0,
        draft_catalogs: 0,
      },
    }
  }
}

export async function downloadManufacturerCatalog(
  id: number
): Promise<{ success: boolean; message: string; blob?: Blob }> {
  try {
    const response = await apiClient.get(
      `/manufacturer/catalogs/${id}/download`,
      { responseType: "blob" }
    )
    return {
      success: true,
      message: "Catalog downloaded successfully",
      blob: response.data as Blob,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to download catalog."),
    }
  }
}

export async function previewManufacturerCatalog(
  id: number
): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    const response = await apiClient.get(`/manufacturer/catalogs/${id}`)
    const payload = toRecord(response.data)
    const catalogData = toRecord(payload.data)
    const filePath = toString(catalogData.file_path, "")

    if (!filePath) {
      return {
        success: false,
        message: "Catalog file path not found.",
      }
    }

    // Use the file path directly from the backend (it's a full URL)
    return {
      success: true,
      message: "Preview URL retrieved",
      url: filePath,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to get catalog preview."),
    }
  }
}

export async function uploadManufacturerCatalog(
  data: FormData
): Promise<ManufacturerCatalogActionResponse> {
  try {
    const response = await apiClient.post("/manufacturer/catalogs", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to upload catalog."),
    }
  }
}
