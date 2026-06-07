import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export type ManufacturerProductStatus = "active" | "draft" | "inactive"

export interface ManufacturerProductListItem {
  id: number
  slug: string
  name: string
  description: string
  status: ManufacturerProductStatus
  categoryLabel: string
  priceDisplay: string
  moqDisplay: string
  viewCount: number
  inquiryCount: number
  thumbnailUrl: string | null
}

export interface ManufacturerProductMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number | null
  to: number | null
}

export interface ManufacturerProductsListResponse {
  success: boolean
  message?: string
  data: ManufacturerProductListItem[]
  meta: ManufacturerProductMeta | null
}

/** Full product payload for view/edit (normalized common fields). */
export interface ManufacturerProductDetail {
  id: number
  slug: string
  name: string
  description: string
  status: ManufacturerProductStatus
  categoryId: number | null
  subCategoryId: number | null
  currencyId: number | null
  minPrice: string
  maxPrice: string
  minimumOrderQuantity: string
  unit: string
  leadTime: string
  categoryLabel: string
  priceDisplay: string
  moqDisplay: string
  viewCount: number
  inquiryCount: number
  images: Array<{ url?: string; file_path?: string; path?: string }>
  // Extended fields for full edit
  productionCapacity: string
  productionDuration: string
  productionUnit: string
  customizeOptions: string[]
  packagingType: string
  portOfLoading: string
  packagingDimensions: string
  packagingWeight: string
  packagingCostPerUnit: string
  packagingDescription: string
  shippingMethodIds: string[]
  sampleAvailable: boolean
  samplePrice: string
  customizationAvailable: boolean
  customizationDetail: string
  keywords: string[]
  keyFeatures: string[]
  specifications: Array<{ title: string; value: string }>
  brochureUrl: string | null
}

export interface ManufacturerProductDetailResponse {
  success: boolean
  message?: string
  data: ManufacturerProductDetail | null
}

export interface ManufacturerProductActionResponse {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export interface ManufacturerProductStats {
  total: number
  active: number
  draft: number
  inactive: number
  totalViews: number
  totalInquiries: number
}

export interface ManufacturerProductStatsResponse {
  success: boolean
  message?: string
  data: ManufacturerProductStats
}

type RecordLike = Record<string, unknown>

function formatLaravelValidationErrors(errors: unknown): string {
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) {
    return ""
  }
  const parts: string[] = []
  for (const [key, val] of Object.entries(errors as Record<string, unknown>)) {
    if (Array.isArray(val)) {
      for (const msg of val) {
        if (typeof msg === "string" && msg.trim()) {
          parts.push(`${key}: ${msg.trim()}`)
        }
      }
    } else if (typeof val === "string" && val.trim()) {
      parts.push(`${key}: ${val.trim()}`)
    }
  }
  return parts.length ? ` ${parts.join(" · ")}` : ""
}

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

function normalizeStatus(value: unknown): ManufacturerProductStatus {
  const s = toString(value, "draft").toLowerCase()
  if (s === "active" || s === "draft" || s === "inactive") {
    return s
  }
  return "draft"
}

function extractCategoryLabel(product: RecordLike): string {
  const sub = toRecord(product.sub_category)
  const cat = toRecord(product.category)
  const subName = toString(sub.name, "").trim()
  const catName = toString(cat.name, "").trim()
  if (subName && catName) {
    return `${catName} · ${subName}`
  }
  return subName || catName || "—"
}

function extractPriceDisplay(product: RecordLike): string {
  const pq = toRecord(product.pricing_quantities)
  const minP = toRecord(pq.min_price)
  const maxP = toRecord(pq.max_price)
  const minAmt = toRecord(minP.price)
  const maxAmt = toRecord(maxP.price)
  const minStr = toString(minAmt.amount, "")
  const maxStr = toString(maxAmt.amount, "")
  const sym = toString(toRecord(pq.currency).symbol, "$")
  if (minStr && maxStr && minStr !== maxStr) {
    return `${sym}${minStr} – ${sym}${maxStr}`
  }
  if (minStr) {
    return `${sym}${minStr}`
  }
  const minLegacy = toString(product.min_price, "")
  const maxLegacy = toString(product.max_price, "")
  if (minLegacy || maxLegacy) {
    return minLegacy && maxLegacy && minLegacy !== maxLegacy
      ? `${minLegacy} – ${maxLegacy}`
      : minLegacy || maxLegacy
  }
  return "—"
}

function extractMoqDisplay(product: RecordLike): string {
  const pq = toRecord(product.pricing_quantities)
  const moq = toNumber(pq.minimum_order_quantity, 0)
  const unit = toString(pq.unit, "").trim()
  if (moq > 0) {
    return unit ? `${moq.toLocaleString()} ${unit}` : moq.toLocaleString()
  }
  const legacy = toNumber(product.minimum_order_quantity, 0)
  const u = toString(product.unit, "")
  if (legacy > 0) {
    return u ? `${legacy.toLocaleString()} ${u}` : String(legacy)
  }
  return "—"
}

function extractThumbnail(product: RecordLike): string | null {
  const images = product.images
  if (!Array.isArray(images) || images.length === 0) {
    return null
  }
  const first = toRecord(images[0])
  const url =
    toString(first.url, "") ||
    toString(first.file_path, "") ||
    toString(first.path, "") ||
    toString(first.image_url, "")
  return url.trim() || null
}

function normalizeListItem(payload: unknown): ManufacturerProductListItem {
  const p = toRecord(payload)
  return {
    id: toNumber(p.id),
    slug: toString(p.slug, String(toNumber(p.id))),
    name: toString(p.name, "Untitled"),
    description: toString(p.description, ""),
    status: normalizeStatus(p.status),
    categoryLabel: extractCategoryLabel(p),
    priceDisplay: extractPriceDisplay(p),
    moqDisplay: extractMoqDisplay(p),
    viewCount: toNumber(p.view_count ?? p.views ?? p.total_views, 0),
    inquiryCount: toNumber(p.inquiry_count ?? p.inquiries ?? p.total_inquiries, 0),
    thumbnailUrl: extractThumbnail(p),
  }
}

function normalizeDetail(payload: unknown): ManufacturerProductDetail {
  const p = toRecord(payload)
  const pq = toRecord(p.pricing_quantities)
  const minP = toRecord(pq.min_price)
  const maxP = toRecord(pq.max_price)
  const minAmt = toRecord(minP.price)
  const maxAmt = toRecord(maxP.price)
  const currency = toRecord(pq.currency)

  const minPrice =
    toString(minAmt.amount, "") || toString(p.min_price, "") || "0"
  const maxPrice =
    toString(maxAmt.amount, "") || toString(p.max_price, "") || minPrice

  const category = toRecord(p.category)
  const sub = toRecord(p.sub_category)

  return {
    id: toNumber(p.id),
    slug: toString(p.slug, String(toNumber(p.id))),
    name: toString(p.name, ""),
    description: toString(p.description, ""),
    status: normalizeStatus(p.status),
    categoryId: category.id != null ? toNumber(category.id) : null,
    subCategoryId: sub.id != null ? toNumber(sub.id) : null,
    currencyId:
      currency.id != null
        ? toNumber(currency.id)
        : p.currency_id != null
          ? toNumber(p.currency_id)
          : null,
    minPrice,
    maxPrice,
    minimumOrderQuantity: String(
      pq.minimum_order_quantity != null
        ? toNumber(pq.minimum_order_quantity, 0)
        : toNumber(p.minimum_order_quantity, 0)
    ),
    unit: toString(pq.unit, "") || toString(p.unit, "pieces"),
    leadTime: toString(pq.lead_time, "") || toString(p.lead_time, ""),
    categoryLabel: extractCategoryLabel(p),
    priceDisplay: extractPriceDisplay(p),
    moqDisplay: extractMoqDisplay(p),
    viewCount: toNumber(p.view_count ?? p.views, 0),
    inquiryCount: toNumber(p.inquiry_count ?? p.inquiries, 0),
    images: Array.isArray(p.images)
      ? (p.images as unknown[]).map((img) => toRecord(img) as ManufacturerProductDetail["images"][0])
      : [],
    productionCapacity: toString(pq.production_capacity ?? p.production_capacity, ""),
    productionDuration: toString(pq.production_duration ?? p.production_duration, ""),
    productionUnit: toString(pq.production_unit ?? p.production_unit, ""),
    customizeOptions: Array.isArray(p.customize_options)
      ? (p.customize_options as unknown[]).map((o) => toString(o, "")).filter(Boolean)
      : [],
    packagingType: toString(p.packaging_type, ""),
    portOfLoading: toString(p.port_of_loading, ""),
    packagingDimensions: toString(p.packaging_dimensions, ""),
    packagingWeight: toString(p.packaging_weight, ""),
    packagingCostPerUnit: toString(p.packaging_cost_per_unit, ""),
    packagingDescription: toString(p.packaging_description, ""),
    shippingMethodIds: Array.isArray(p.shipping_methods)
      ? (p.shipping_methods as unknown[]).map((m) => {
          const row = toRecord(m)
          const id = row.id ?? row.shipping_method_id
          return String(toNumber(id, 0))
        }).filter((id) => id !== "0")
      : [],
    sampleAvailable:
      p.sample_available === true ||
      p.sample_available === 1 ||
      p.sample_available === "1",
    samplePrice: toString(p.sample_price, ""),
    customizationAvailable:
      p.customization_available === true ||
      p.customization_available === 1 ||
      p.customization_available === "1",
    customizationDetail: toString(p.customization_detail, ""),
    keywords: Array.isArray(p.keywords)
      ? (p.keywords as unknown[]).map((k) => toString(k, "")).filter(Boolean)
      : [],
    keyFeatures: Array.isArray(p.key_features)
      ? (p.key_features as unknown[]).map((f) => toString(f, "")).filter(Boolean)
      : [],
    specifications: Array.isArray(p.product_specifications)
      ? (p.product_specifications as unknown[])
          .map((s) => {
            const row = toRecord(s)
            return {
              title: toString(row.specification_title, ""),
              value: toString(row.specification_value, ""),
            }
          })
          .filter((s) => s.title || s.value)
      : [],
    brochureUrl:
      toString(p.brochure_url ?? p.product_brochure_url ?? p.broschure_url, "").trim() || null,
  }
}

function normalizeMeta(payload: unknown): ManufacturerProductMeta | null {
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

export interface ManufacturerProductsQuery {
  page?: number
  per_page?: number
  search?: string
  status?: ManufacturerProductStatus | "all"
}

export async function getManufacturerProducts(
  query: ManufacturerProductsQuery = {}
): Promise<ManufacturerProductsListResponse> {
  const { page = 1, per_page = 10, search, status } = query
  try {
    const params: Record<string, unknown> = { page, per_page }
    if (search?.trim()) {
      params.search = search.trim()
    }
    if (status && status !== "all") {
      params.status = status
    }

    const response = await apiClient.get("/manufacturer/products", { params })
    const payload = toRecord(response.data)
    const rows = Array.isArray(payload.data) ? payload.data : []

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: rows.map(normalizeListItem),
      meta: normalizeMeta(payload.meta),
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load products."),
      data: [],
      meta: null,
    }
  }
}

export async function getManufacturerProductStats(): Promise<ManufacturerProductStatsResponse> {
  try {
    const response = await apiClient.get("/manufacturer/products/stats")
    const payload = toRecord(response.data)
    const d = toRecord(payload.data)

    const pickNum = (...keys: string[]) => {
      for (const k of keys) {
        const v = d[k]
        if (v != null) {
          const n = toNumber(v, NaN)
          if (!Number.isNaN(n)) {
            return n
          }
        }
      }
      return 0
    }

    const stats: ManufacturerProductStats = {
      total: pickNum("total_products", "total", "count"),
      active: pickNum("active_products", "active"),
      draft: pickNum("draft_products", "draft"),
      inactive: pickNum("inactive_products", "inactive"),
      totalViews: pickNum("total_views", "views", "view_count"),
      totalInquiries: pickNum("total_inquiries", "inquiries", "inquiry_count"),
    }

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: stats,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load product stats."),
      data: {
        total: 0,
        active: 0,
        draft: 0,
        inactive: 0,
        totalViews: 0,
        totalInquiries: 0,
      },
    }
  }
}

export async function getManufacturerProductBySlug(
  slug: string
): Promise<ManufacturerProductDetailResponse> {
  try {
    const response = await apiClient.get(`/manufacturer/products/${encodeURIComponent(slug)}`)
    const payload = toRecord(response.data)
    const raw = payload.data

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: raw ? normalizeDetail(raw) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load product."),
      data: null,
    }
  }
}

/**
 * Build multipart body for POST /manufacturer/products/:id (with _method=PUT).
 * Sends all fields matching the Postman PUT contract.
 */
export function buildManufacturerProductUpdateFormData(
  p: ManufacturerProductCreatePayload
): FormData {
  const fd = buildManufacturerProductCreateFormData(p)
  fd.append("_method", "PUT")
  return fd
}

export async function updateManufacturerProduct(
  id: number,
  data: FormData
): Promise<ManufacturerProductActionResponse> {
  try {
    // Use POST + _method=PUT — Laravel does not read $_FILES on PUT requests.
    const response = await apiClient.post(`/manufacturer/products/${id}`, data, {
      validateStatus: () => true,
    })
    const raw = response.data
    if (raw == null || typeof raw !== "object") {
      return { success: false, message: `Unexpected response (HTTP ${response.status}).` }
    }
    const payload = toRecord(raw)
    const okHttp = response.status >= 200 && response.status < 300
    const explicitFail = payload.success === false
    if (!okHttp || explicitFail) {
      const base =
        typeof payload.message === "string" && payload.message.trim()
          ? payload.message.trim()
          : `Request failed (HTTP ${response.status}).`
      const detail = formatLaravelValidationErrors(payload.errors)
      return {
        success: false,
        message: (base + detail).trim(),
        errors:
          payload.errors &&
          typeof payload.errors === "object" &&
          !Array.isArray(payload.errors)
            ? (payload.errors as Record<string, string[]>)
            : undefined,
      }
    }
    return {
      success: true,
      message: typeof payload.message === "string" ? payload.message : undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update product."),
    }
  }
}

export async function deleteManufacturerProduct(
  id: number
): Promise<ManufacturerProductActionResponse> {
  try {
    const response = await apiClient.delete(`/manufacturer/products/${id}`)
    const payload = toRecord(response.data)
    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to delete product."),
    }
  }
}

export async function changeManufacturerProductStatus(
  id: number,
  status: ManufacturerProductStatus
): Promise<ManufacturerProductActionResponse> {
  try {
    const response = await apiClient.patch(`/manufacturer/products/${id}/change-status`, {
      status,
    })
    const payload = toRecord(response.data)
    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to change status."),
    }
  }
}

export async function duplicateManufacturerProductToDraft(
  id: number
): Promise<ManufacturerProductActionResponse> {
  try {
    const response = await apiClient.patch(`/manufacturer/products/${id}/duplicate-to-draft`)
    const payload = toRecord(response.data)
    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to duplicate product."),
    }
  }
}

// ---------------------------------------------------------------------------
// Create product — POST /manufacturer/products (multipart form-data)
// ---------------------------------------------------------------------------

export interface ManufacturerSelectOption {
  id: number
  name: string
  code?: string
}

/** Row from GET /currencies (may omit numeric `id` and only expose code/name/symbol). */
export interface ManufacturerCurrencyOption {
  /** Present when the API returns a numeric id (product create uses currency_id). */
  id: number | null
  code: string
  name: string
  symbol?: string
}

function readFlexibleRows(payload: unknown): unknown[] {
  const root = toRecord(payload)
  const candidates = [root.data, root.methods, root.currencies, root.items, root.results]
  for (const c of candidates) {
    if (Array.isArray(c)) {
      return c
    }
    if (c && typeof c === "object" && !Array.isArray(c)) {
      const nested = toRecord(c).data
      if (Array.isArray(nested)) {
        return nested
      }
    }
  }
  return []
}

function normalizeSelectRow(raw: unknown): ManufacturerSelectOption | null {
  const r = toRecord(raw)
  const id = r.id
  if (typeof id !== "number" && typeof id !== "string") {
    return null
  }
  const numId = toNumber(id, NaN)
  if (!Number.isFinite(numId)) {
    return null
  }
  const nameRaw = r.name
  const codeRaw = r.code
  const name =
    typeof nameRaw === "string" && nameRaw.trim()
      ? nameRaw.trim()
      : typeof codeRaw === "string" && codeRaw.trim()
        ? codeRaw.trim()
        : `Currency ${numId}`
  return {
    id: numId,
    name,
    code: typeof codeRaw === "string" ? codeRaw : undefined,
  }
}

function normalizeCurrencyRow(raw: unknown): ManufacturerCurrencyOption | null {
  const r = toRecord(raw)
  const codeRaw = r.code
  const nameRaw = r.name
  if (typeof codeRaw !== "string" || !codeRaw.trim()) {
    return null
  }
  const code = codeRaw.trim().toUpperCase()
  const name =
    typeof nameRaw === "string" && nameRaw.trim() ? nameRaw.trim() : code
  const symbol = typeof r.symbol === "string" && r.symbol.trim() ? r.symbol.trim() : undefined

  let id: number | null = null
  if (r.id !== undefined && r.id !== null) {
    const numId = toNumber(r.id, NaN)
    if (Number.isFinite(numId) && numId > 0) {
      id = numId
    }
  }

  return { id, code, name, symbol }
}

/** GET /shipping/methods — returns `{ id, name }[]` for `shipping_methods[n]` form fields. */
export async function getManufacturerShippingMethods(): Promise<{
  success: boolean
  message?: string
  data: ManufacturerSelectOption[]
}> {
  try {
    const response = await apiClient.get("/shipping/methods")
    const rows = readFlexibleRows(response.data)
      .map(normalizeSelectRow)
      .filter((r): r is ManufacturerSelectOption => r !== null && Number.isFinite(r.id))
    return { success: true, data: rows }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load shipping methods."),
      data: [],
    }
  }
}

/** GET /currencies — supports `{ code, name, symbol, ... }` without numeric `id`. */
export async function getManufacturerCurrencies(): Promise<{
  success: boolean
  message?: string
  data: ManufacturerCurrencyOption[]
}> {
  try {
    const response = await apiClient.get("/currencies")
    const parsed = readFlexibleRows(response.data)
      .map(normalizeCurrencyRow)
      .filter((r): r is ManufacturerCurrencyOption => r !== null)

    // Laravel list often omits `id`; product create still expects `currency_id`.
    // When every row lacks id, use stable 1-based row order (matches typical USD=1, EUR=2, … seed data).
    const data =
      parsed.length > 0 && parsed.every((r) => r.id == null)
        ? parsed.map((r, i) => ({ ...r, id: i + 1 }))
        : parsed

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load currencies."),
      data: [],
    }
  }
}

export interface ManufacturerProductCreatePayload {
  name: string
  description: string
  categoryId: string
  subCategoryId: string
  status: ManufacturerProductStatus
  minPrice: string
  maxPrice: string
  /** Numeric string sent as `currency_id` (required by Jaawass POST /manufacturer/products). */
  currencyId: string
  minimumOrderQuantity: string
  /** Display unit, e.g. "Pieces" (matches Postman). */
  unit: string
  leadTime: string
  productionCapacity: string
  productionDuration: string
  productionUnit: string
  customizeOptions: string[]
  packagingType: string
  portOfLoading: string
  packagingDimensions: string
  packagingWeight: string
  packagingCostPerUnit: string
  packagingDescription: string
  shippingMethodIds: string[]
  sampleAvailable: boolean
  samplePrice: string
  customizationAvailable: boolean
  customizationDetail: string
  keywords: string[]
  keyFeatures: string[]
  specifications: Array<{ title: string; value: string }>
  imageFiles: File[]
  brochureFile: File | null
}

/** Map ISO code → common DB ids when the value is not numeric (defensive). */
function resolveCurrencyIdForPost(value: string): string {
  const v = value.trim()
  if (/^\d+$/.test(v)) {
    return v
  }
  const code = v.toUpperCase()
  const byCode: Record<string, string> = {
    USD: "1",
    EUR: "2",
    SAR: "3",
    GBP: "4",
    CNY: "5",
    JPY: "6",
  }
  return byCode[code] ?? "1"
}

/**
 * Builds multipart body for POST /manufacturer/products (Jaawass Postman contract).
 * All image files use `product_images[n]` (Laravel-friendly array upload).
 */
export function buildManufacturerProductCreateFormData(
  p: ManufacturerProductCreatePayload
): FormData {
  const fd = new FormData()
  fd.append("name", p.name.trim())
  fd.append("description", p.description.trim())
  fd.append("category_id", p.categoryId)
  if (p.subCategoryId.trim()) {
    fd.append("sub_category_id", p.subCategoryId)
  }
  fd.append("status", p.status)
  fd.append("min_price", p.minPrice)
  fd.append("max_price", p.maxPrice)
  fd.append("currency_id", resolveCurrencyIdForPost(p.currencyId))
  fd.append("minimum_order_quantity", p.minimumOrderQuantity)
  fd.append("unit", p.unit)
  fd.append("lead_time", p.leadTime.trim())
  fd.append("production_capacity", p.productionCapacity.trim() || "0")
  fd.append("production_duration", p.productionDuration)
  fd.append("production_unit", p.productionUnit)

  const customizeTrimmed = p.customizeOptions.map((o) => o.trim()).filter(Boolean)
  if (customizeTrimmed.length > 0) {
    customizeTrimmed.forEach((opt, i) => {
      fd.append(`customize_options[${i}]`, opt)
    })
  } else {
    fd.append("customize_options[0]", "—")
  }

  fd.append("packaging_type", p.packagingType)
  fd.append("port_of_loading", p.portOfLoading.trim())
  fd.append("packaging_dimensions", p.packagingDimensions.trim())
  fd.append("packaging_weight", p.packagingWeight.trim())
  fd.append("packaging_cost_per_unit", p.packagingCostPerUnit.trim() || "0")
  fd.append("packaging_description", p.packagingDescription.trim())

  const shipIds = p.shippingMethodIds.filter(Boolean)
  if (shipIds.length > 0) {
    shipIds.forEach((id, i) => {
      fd.append(`shipping_methods[${i}]`, id)
    })
  } else {
    fd.append("shipping_methods[0]", "1")
  }

  fd.append("sample_available", p.sampleAvailable ? "1" : "0")
  fd.append("sample_price", p.sampleAvailable && p.samplePrice.trim() ? p.samplePrice.trim() : "0")
  fd.append("customization_available", p.customizationAvailable ? "1" : "0")
  fd.append(
    "customization_detail",
    p.customizationAvailable ? p.customizationDetail.trim() : "—"
  )

  const kw = p.keywords.map((k) => k.trim()).filter(Boolean)
  if (kw.length > 0) {
    kw.forEach((word, i) => {
      fd.append(`keywords[${i}]`, word)
    })
  } else {
    const fallbackKw = p.name.trim().split(/\s+/).filter(Boolean)[0] ?? "product"
    fd.append("keywords[0]", fallbackKw)
  }

  const feats = p.keyFeatures.map((f) => f.trim()).filter(Boolean)
  if (feats.length > 0) {
    feats.forEach((feat, i) => {
      fd.append(`key_features[${i}]`, feat)
    })
  } else {
    fd.append("key_features[0]", p.name.trim().slice(0, 120) || "Key feature")
  }

  const specs = p.specifications.filter((s) => s.title.trim() && s.value.trim())
  if (specs.length > 0) {
    specs.forEach((spec, i) => {
      fd.append(`product_specifications[${i}][specification_title]`, spec.title)
      fd.append(`product_specifications[${i}][specification_value]`, spec.value)
    })
  } else {
    fd.append("product_specifications[0][specification_title]", "Overview")
    fd.append(
      "product_specifications[0][specification_value]",
      p.description.trim().slice(0, 500) || "—"
    )
  }

  p.imageFiles.forEach((file, i) => {
    fd.append(`product_images[${i}]`, file)
  })

  if (p.brochureFile) {
    fd.append("product_broschure", p.brochureFile)
  }

  return fd
}

export async function createManufacturerProduct(
  formData: FormData
): Promise<ManufacturerProductActionResponse> {
  try {
    // Do not set Content-Type manually — Axios must add the multipart boundary.
    // validateStatus: read JSON body on 4xx/5xx (Laravel often returns validation details there).
    const response = await apiClient.post("/manufacturer/products", formData, {
      validateStatus: () => true,
    })

    const raw = response.data
    if (raw == null || typeof raw !== "object") {
      return {
        success: false,
        message: `Unexpected response (HTTP ${response.status}).`,
      }
    }

    const payload = toRecord(raw)
    const okHttp = response.status >= 200 && response.status < 300
    const explicitFail = payload.success === false
    const isSuccess = okHttp && !explicitFail

    if (!isSuccess) {
      const base =
        typeof payload.message === "string" && payload.message.trim()
          ? payload.message.trim()
          : `Request failed (HTTP ${response.status}).`
      const detail = formatLaravelValidationErrors(payload.errors)

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("[createManufacturerProduct]", response.status, raw)
        try {
          for (const [k, v] of formData.entries()) {
            // eslint-disable-next-line no-console
            console.warn(
              "  field:",
              k,
              v instanceof File ? `File(${v.name}, ${v.size}b, ${v.type})` : v
            )
          }
        } catch {
          /* ignore */
        }
      }

      return {
        success: false,
        message: (base + detail).trim(),
        errors:
          payload.errors && typeof payload.errors === "object" && !Array.isArray(payload.errors)
            ? (payload.errors as Record<string, string[]>)
            : undefined,
      }
    }

    return {
      success: true,
      message: typeof payload.message === "string" ? payload.message : undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create product."),
    }
  }
}
