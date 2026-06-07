import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface AdminQuickFilterCounts {
  filterTypes: number
  totalOptions: number
  enabled: number
  disabled: number
}

export interface AdminQuickFilterType {
  value: string
  label: string
}

export interface AdminQuickFilterOption {
  id: number
  type: string
  typeLabel: string
  displayLabel: string
  value: string
  isEnabled: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface AdminQuickFilterCountsResponse {
  success: boolean
  message?: string
  data: AdminQuickFilterCounts
}

export interface AdminQuickFilterTypesResponse {
  success: boolean
  message?: string
  data: AdminQuickFilterType[]
}

export interface AdminQuickFilterOptionsResponse {
  success: boolean
  message?: string
  data: AdminQuickFilterOption[]
}

export interface AdminQuickFilterMutationResponse {
  success: boolean
  message?: string
}

export interface AdminQuickFilterOptionMutationInput {
  displayLabel: string
  value: string
  isEnabled: boolean
}

export interface AdminQuickFilterCreateInput extends AdminQuickFilterOptionMutationInput {
  type: string
}

type RecordLike = Record<string, unknown>

function toRecord(value: unknown): RecordLike {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as RecordLike
  }

  return {}
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

function toString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim()
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  return ""
}

const emptyCounts: AdminQuickFilterCounts = {
  filterTypes: 0,
  totalOptions: 0,
  enabled: 0,
  disabled: 0,
}

export async function getAdminQuickFilterCounts(): Promise<AdminQuickFilterCountsResponse> {
  try {
    const response = await apiClient.get("/admin/quick-filters/counts")
    const root = toRecord(response.data)
    const payload = toRecord(root.data)

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: toString(root.message) || undefined,
      data: {
        filterTypes: toNumber(payload.filter_types),
        totalOptions: toNumber(payload.total_options),
        enabled: toNumber(payload.enabled),
        disabled: toNumber(payload.disabled),
      },
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch quick filter counts."),
      data: emptyCounts,
    }
  }
}

export async function getAdminQuickFilterTypes(): Promise<AdminQuickFilterTypesResponse> {
  try {
    const response = await apiClient.get("/admin/quick-filters/types")
    const root = toRecord(response.data)
    const rows = Array.isArray(root.data) ? root.data : []

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: toString(root.message) || undefined,
      data: rows
        .map((row) => {
          const item = toRecord(row)
          return {
            value: toString(item.value),
            label: toString(item.label),
          }
        })
        .filter((item) => item.value.length > 0),
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch quick filter types."),
      data: [],
    }
  }
}

export async function getAdminQuickFilterOptions(type: string): Promise<AdminQuickFilterOptionsResponse> {
  try {
    const response = await apiClient.get("/admin/quick-filters/options", {
      params: { type },
    })
    const root = toRecord(response.data)
    const rows = Array.isArray(root.data) ? root.data : []

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: toString(root.message) || undefined,
      data: rows
        .map((row) => {
          const item = toRecord(row)
          return {
            id: toNumber(item.id),
            type: toString(item.type),
            typeLabel: toString(item.type_label),
            displayLabel: toString(item.display_label),
            value: toString(item.value),
            isEnabled: Boolean(item.is_enabled),
            sortOrder: toNumber(item.sort_order, 0),
            createdAt: toString(item.created_at),
            updatedAt: toString(item.updated_at),
          }
        })
        .filter((item) => item.id > 0 && item.value.length > 0),
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch quick filter options."),
      data: [],
    }
  }
}

export async function createAdminQuickFilterOption(
  input: AdminQuickFilterCreateInput
): Promise<AdminQuickFilterMutationResponse> {
  try {
    const response = await apiClient.post("/admin/quick-filters/options", {
      type: input.type,
      display_label: input.displayLabel,
      value: input.value,
      is_enabled: input.isEnabled,
    })
    const root = toRecord(response.data)

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: toString(root.message) || undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create quick filter option."),
    }
  }
}

export async function sortAdminQuickFilterOption(
  id: string | number,
  direction: "up" | "down"
): Promise<AdminQuickFilterMutationResponse> {
  try {
    const response = await apiClient.patch(`/admin/quick-filters/options/${id}/sort`, {
      direction,
    })
    const root = toRecord(response.data)

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: toString(root.message) || undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to sort quick filter option."),
    }
  }
}

export async function toggleAdminQuickFilterOption(
  id: string | number,
  isEnabled: boolean
): Promise<AdminQuickFilterMutationResponse> {
  try {
    const response = await apiClient.patch(`/admin/quick-filters/options/${id}/toggle`, {
      is_enabled: isEnabled,
    })
    const root = toRecord(response.data)

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: toString(root.message) || undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to toggle quick filter option."),
    }
  }
}

export async function updateAdminQuickFilterOption(
  id: string | number,
  input: AdminQuickFilterOptionMutationInput
): Promise<AdminQuickFilterMutationResponse> {
  try {
    const response = await apiClient.put(`/admin/quick-filters/options/${id}`, {
      display_label: input.displayLabel,
      value: input.value,
      is_enabled: input.isEnabled,
    })
    const root = toRecord(response.data)

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: toString(root.message) || undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update quick filter option."),
    }
  }
}

export async function deleteAdminQuickFilterOption(
  id: string | number,
  input: AdminQuickFilterOptionMutationInput
): Promise<AdminQuickFilterMutationResponse> {
  try {
    const response = await apiClient.delete(`/admin/quick-filters/options/${id}`, {
      data: {
        display_label: input.displayLabel,
        value: input.value,
        is_enabled: input.isEnabled,
      },
    })
    const root = toRecord(response.data)

    return {
      success: typeof root.success === "boolean" ? root.success : true,
      message: toString(root.message) || undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to delete quick filter option."),
    }
  }
}
