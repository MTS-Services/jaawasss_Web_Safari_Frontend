import { publicApiClient } from "./client"

export interface FaqItem {
  id: number
  question: string
  answer: string
  clicksCount: number
  sort: number
}

export interface FaqCategory {
  id: number
  name: string
  slug: string
  sort: number
  faqs: FaqItem[]
  availableLocales: string[]
}

export interface FaqCategoriesResponse {
  success: boolean
  message?: string
  data: FaqCategory[]
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

function normalizeFaq(item: unknown): FaqItem {
  const record = toRecord(item)

  return {
    id: toNumber(record.id),
    question: toString(record.question, ""),
    answer: toString(record.answer, ""),
    clicksCount: toNumber(record.clicks_count ?? record.clicksCount),
    sort: toNumber(record.sort),
  }
}

function normalizeCategory(item: unknown): FaqCategory {
  const record = toRecord(item)
  const rawFaqs = Array.isArray(record.faqs) ? record.faqs : []
  const rawLocales = Array.isArray(record.available_locales)
    ? record.available_locales
    : Array.isArray(record.availableLocales)
      ? record.availableLocales
      : []

  return {
    id: toNumber(record.id),
    name: toString(record.name, ""),
    slug: toString(record.slug, ""),
    sort: toNumber(record.sort),
    faqs: rawFaqs.map(normalizeFaq),
    availableLocales: rawLocales
      .map((locale) => toString(locale).trim())
      .filter((locale) => locale.length > 0),
  }
}

function normalizeFaqCategoriesResponse(payload: unknown): FaqCategoriesResponse {
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

export async function getFaqCategories(): Promise<FaqCategoriesResponse> {
  try {
    const response = await publicApiClient.get("/faqs/categories")
    return normalizeFaqCategoriesResponse(response.data)
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch FAQ categories",
      data: [],
    }
  }
}