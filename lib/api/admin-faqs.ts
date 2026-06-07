import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface AdminFaq {
  id: number
  question: string
  answer: string
  clicksCount: number
  sort: number
}

export interface AdminFaqCategory {
  id: number
  name: string
  slug: string
  sort: number
  faqs: AdminFaq[]
  availableLocales: string[]
}

export interface AdminFaqCategoriesResponse {
  success: boolean
  message?: string
  data: AdminFaqCategory[]
}

export interface AdminFaqMutationResponse {
  success: boolean
  message?: string
}

export interface SaveCategoryInput {
  name: string
  slug: string
  sort?: number
}

export interface SaveFaqInput {
  question: string
  answer: string
  faqCategoryId: string | number
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

function toIdValue(value: string | number): string | number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    const parsed = Number(trimmed)
    if (trimmed.length > 0 && Number.isFinite(parsed)) {
      return parsed
    }

    return trimmed
  }

  return value
}

function normalizeFaq(payload: unknown): AdminFaq {
  const record = toRecord(payload)

  return {
    id: toNumber(record.id),
    question: toString(record.question),
    answer: toString(record.answer),
    clicksCount: toNumber(record.clicks_count ?? record.clicksCount),
    sort: toNumber(record.sort),
  }
}

function normalizeCategory(payload: unknown): AdminFaqCategory {
  const record = toRecord(payload)
  const rawFaqs = Array.isArray(record.faqs) ? record.faqs : []
  const rawLocales = Array.isArray(record.available_locales)
    ? record.available_locales
    : Array.isArray(record.availableLocales)
      ? record.availableLocales
      : []

  return {
    id: toNumber(record.id),
    name: toString(record.name),
    slug: toString(record.slug),
    sort: toNumber(record.sort),
    faqs: rawFaqs.map(normalizeFaq),
    availableLocales: rawLocales
      .map((locale) => toString(locale).trim())
      .filter((locale) => locale.length > 0),
  }
}

function normalizeCategoriesResponse(payload: unknown): AdminFaqCategoriesResponse {
  const root = toRecord(payload)
  const rawData = Array.isArray(root.data)
    ? root.data
    : Array.isArray(payload)
      ? payload
      : []

  return {
    success: typeof root.success === "boolean" ? root.success : true,
    message: typeof root.message === "string" ? root.message : undefined,
    data: rawData.map(normalizeCategory),
  }
}

function normalizeMutationResponse(payload: unknown, fallbackMessage: string): AdminFaqMutationResponse {
  const root = toRecord(payload)

  return {
    success: typeof root.success === "boolean" ? root.success : true,
    message: toString(root.message, fallbackMessage),
  }
}

export async function getAdminFaqCategories(): Promise<AdminFaqCategoriesResponse> {
  try {
    const response = await apiClient.get("/faqs/categories")
    return normalizeCategoriesResponse(response.data)
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch FAQ categories."),
      data: [],
    }
  }
}

export async function createAdminFaqCategory(input: SaveCategoryInput): Promise<AdminFaqMutationResponse> {
  try {
    const response = await apiClient.post("/admin/faqs/categories/create", {
      name: input.name,
      slug: input.slug,
    })
    return normalizeMutationResponse(response.data, "Category created successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create category."),
    }
  }
}

export async function updateAdminFaqCategory(
  categoryId: string | number,
  input: SaveCategoryInput
): Promise<AdminFaqMutationResponse> {
  try {
    const response = await apiClient.put(`/admin/faqs/categories/${categoryId}`, {
      name: input.name,
      slug: input.slug,
      ...(typeof input.sort === "number" ? { sort: input.sort } : {}),
    })
    return normalizeMutationResponse(response.data, "Category updated successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update category."),
    }
  }
}

export async function deleteAdminFaqCategory(categoryId: string | number): Promise<AdminFaqMutationResponse> {
  try {
    const response = await apiClient.delete(`/admin/faqs/categories/${categoryId}`)
    return normalizeMutationResponse(response.data, "Category deleted successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to delete category."),
    }
  }
}

export async function moveAdminFaqCategoryPosition(
  categoryId: string | number,
  currentPosition: number,
  newPosition: number
): Promise<AdminFaqMutationResponse> {
  try {
    const response = await apiClient.put(`/admin/faqs/categories/${categoryId}/position`, {
      current_position: currentPosition,
      new_position: newPosition,
    })
    return normalizeMutationResponse(response.data, "Category order updated successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to reorder category."),
    }
  }
}

export async function createAdminFaq(input: SaveFaqInput): Promise<AdminFaqMutationResponse> {
  try {
    const response = await apiClient.post("/admin/faqs/create", {
      question: input.question,
      answer: input.answer,
      faq_category_id: toIdValue(input.faqCategoryId),
    })
    return normalizeMutationResponse(response.data, "FAQ created successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create FAQ."),
    }
  }
}

export async function updateAdminFaq(
  faqId: string | number,
  input: SaveFaqInput
): Promise<AdminFaqMutationResponse> {
  try {
    const response = await apiClient.put(`/admin/faqs/${faqId}`, {
      question: input.question,
      answer: input.answer,
      faq_category_id: toIdValue(input.faqCategoryId),
    })
    return normalizeMutationResponse(response.data, "FAQ updated successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update FAQ."),
    }
  }
}

export async function deleteAdminFaq(faqId: string | number): Promise<AdminFaqMutationResponse> {
  try {
    const response = await apiClient.delete(`/admin/faqs/${faqId}`)
    return normalizeMutationResponse(response.data, "FAQ deleted successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to delete FAQ."),
    }
  }
}

export async function moveAdminFaqPosition(
  faqId: string | number,
  currentPosition: number,
  newPosition: number,
  faqCategoryId: string | number
): Promise<AdminFaqMutationResponse> {
  try {
    const response = await apiClient.put(`/admin/faqs/${faqId}/position`, {
      current_position: currentPosition,
      new_position: newPosition,
      faq_category_id: toIdValue(faqCategoryId),
    })
    return normalizeMutationResponse(response.data, "FAQ order updated successfully.")
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to reorder FAQ."),
    }
  }
}