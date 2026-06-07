import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface ProductCategory {
  id: number
  name: string
  slug: string
  icon: string | null
  icon_url: string | null
  color: string | null
}

export interface ProductSubCategory {
  id: number
  name: string
  slug: string
  icon: string | null
  icon_url: string | null
}

export interface Price {
  amount: string
  currency: string
}

export interface PriceInfo {
  price: Price
  price_display: string | null
  conversion_available: boolean
}

export interface PricingQuantities {
  id: number
  min_price: PriceInfo
  max_price: PriceInfo
  currency: {
    id: number
    code: string
    name: string
    symbol: string
    decimal_places: number
  }
  minimum_order_quantity: number
  unit: string
  lead_time: string
  production_capacity: number
  production_duration: string
  production_unit: string
}

export interface Specification {
  id: number
  specification_title: string
  specification_value: string
}

export interface KeyFeature {
  id: number
  value: string
}

export interface CustomizationOption {
  id: number
  option: string
}

export interface ShippingPackaging {
  id: number
  packaging_type: string
  port_of_loading: string
  packaging_dimensions: string
  packaging_weight: string
  packaging_description: string
  packaging_cost_per_unit: PriceInfo
}

export interface ShippingMethod {
  id: number
  name: string
}

// Normalized interfaces for frontend use
export interface AdminProduct {
  id: number
  name: string
  slug: string
  description: string
  status: string
  is_approved: boolean
  view_count: number
  inquiry_count: number
  category: {
    id: number
    name: string
    slug: string
    icon: string | null
    color: string | null
    displayIcon: string // Icon name for fallback
  }
  sub_category: {
    id: number
    name: string
    slug: string
    icon: string | null
    displayIcon: string // Icon name for fallback
  }
  images: Array<{ id?: number; [key: string]: unknown }>
  pricing_quantities: PricingQuantities | null
  specifications: Specification[]
  product_key_features: KeyFeature[]
  customization_options: CustomizationOption[]
  shipping_packaging: ShippingPackaging | null
  shipping_methods: ShippingMethod[]
}

export interface AdminProductMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number | null
  to: number | null
}

export interface AdminProductsResponse {
  success: boolean
  message?: string
  data: AdminProduct[]
  meta: AdminProductMeta | null
}

export interface AdminProductDetailResponse {
  success: boolean
  message?: string
  data: AdminProduct | null
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

function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value
  }
  if (typeof value === "number") {
    return value !== 0
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1"
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

// Get fallback icon - uses a single common icon for all categories
function getCategoryFallbackIcon(): string {
  return "Package"
}

// Normalize category with fallback icon
function normalizeCategory(rawCategory: unknown): AdminProduct["category"] {
  const category = toRecord(rawCategory)
  const slug = toString(category.slug, "")
  const icon = toNullableString(category.icon)
  const displayIcon = getCategoryFallbackIcon()

  return {
    id: toNumber(category.id),
    name: toString(category.name, "N/A"),
    slug,
    icon,
    color: toNullableString(category.color),
    displayIcon,
  }
}

// Normalize sub-category with fallback icon
function normalizeSubCategory(rawSubCategory: unknown): AdminProduct["sub_category"] {
  const subCategory = toRecord(rawSubCategory)
  const slug = toString(subCategory.slug, "")
  const icon = toNullableString(subCategory.icon)
  const displayIcon = getCategoryFallbackIcon()

  return {
    id: toNumber(subCategory.id),
    name: toString(subCategory.name, "N/A"),
    slug,
    icon,
    displayIcon,
  }
}

// Normalize pricing
function normalizePricingQuantities(rawPricing: unknown): PricingQuantities | null {
  const pricing = toRecord(rawPricing)
  if (Object.keys(pricing).length === 0) {
    return null
  }

  const currency = toRecord(pricing.currency)
  const minPrice = toRecord(pricing.min_price)
  const maxPrice = toRecord(pricing.max_price)
  const minPriceInfo = toRecord(minPrice.price)
  const maxPriceInfo = toRecord(maxPrice.price)

  return {
    id: toNumber(pricing.id),
    min_price: {
      price: {
        amount: toString(minPriceInfo.amount, "0"),
        currency: toString(minPriceInfo.currency, "USD"),
      },
      price_display: toNullableString(minPrice.price_display),
      conversion_available: toBoolean(minPrice.conversion_available),
    },
    max_price: {
      price: {
        amount: toString(maxPriceInfo.amount, "0"),
        currency: toString(maxPriceInfo.currency, "USD"),
      },
      price_display: toNullableString(maxPrice.price_display),
      conversion_available: toBoolean(maxPrice.conversion_available),
    },
    currency: {
      id: toNumber(currency.id),
      code: toString(currency.code, "USD"),
      name: toString(currency.name, "US Dollar"),
      symbol: toString(currency.symbol, "$"),
      decimal_places: toNumber(currency.decimal_places, 2),
      is_base: toBoolean(currency.is_base),
      is_active: toNumber(currency.is_active),
      sort_order: toNumber(currency.sort_order),
    },
    minimum_order_quantity: toNumber(pricing.minimum_order_quantity),
    unit: toString(pricing.unit, ""),
    lead_time: toString(pricing.lead_time, ""),
    production_capacity: toNumber(pricing.production_capacity),
    production_duration: toString(pricing.production_duration, ""),
    production_unit: toString(pricing.production_unit, ""),
  }
}

// Normalize specifications
function normalizeSpecifications(rawSpecs: unknown): Specification[] {
  if (!Array.isArray(rawSpecs)) {
    return []
  }
  return rawSpecs.map((spec) => {
    const s = toRecord(spec)
    return {
      id: toNumber(s.id),
      specification_title: toString(s.specification_title, ""),
      specification_value: toString(s.specification_value, ""),
    }
  })
}

// Normalize key features
function normalizeKeyFeatures(rawFeatures: unknown): KeyFeature[] {
  if (!Array.isArray(rawFeatures)) {
    return []
  }
  return rawFeatures.map((feature) => {
    const f = toRecord(feature)
    return {
      id: toNumber(f.id),
      value: toString(f.value, ""),
    }
  })
}

// Normalize customization options
function normalizeCustomizationOptions(rawOptions: unknown): CustomizationOption[] {
  if (!Array.isArray(rawOptions)) {
    return []
  }
  return rawOptions.map((option) => {
    const o = toRecord(option)
    return {
      id: toNumber(o.id),
      option: toString(o.option, ""),
    }
  })
}

// Normalize shipping packaging
function normalizeShippingPackaging(rawPackaging: unknown): ShippingPackaging | null {
  const packaging = toRecord(rawPackaging)
  if (Object.keys(packaging).length === 0) {
    return null
  }

  const cost = toRecord(packaging.packaging_cost_per_unit)
  const costPrice = toRecord(cost.price)

  return {
    id: toNumber(packaging.id),
    packaging_type: toString(packaging.packaging_type, ""),
    port_of_loading: toString(packaging.port_of_loading, ""),
    packaging_dimensions: toString(packaging.packaging_dimensions, ""),
    packaging_weight: toString(packaging.packaging_weight, ""),
    packaging_description: toString(packaging.packaging_description, ""),
    packaging_cost_per_unit: {
      price: {
        amount: toString(costPrice.amount, "0"),
        currency: toString(costPrice.currency, "USD"),
      },
      price_display: toNullableString(cost.price_display),
      conversion_available: toBoolean(cost.conversion_available),
    },
  }
}

// Normalize shipping methods
function normalizeShippingMethods(rawMethods: unknown): ShippingMethod[] {
  if (!Array.isArray(rawMethods)) {
    return []
  }
  return rawMethods.map((method) => {
    const m = toRecord(method)
    return {
      id: toNumber(m.id),
      name: toString(m.name, ""),
    }
  })
}

// Normalize product images
function normalizeImages(rawImages: unknown): Array<{ id?: number; [key: string]: unknown }> {
  if (!Array.isArray(rawImages)) {
    return []
  }
  return rawImages.map((img) => {
    const i = toRecord(img)
    return {
      id: i.id ? toNumber(i.id) : undefined,
      ...i,
    }
  })
}

// Main product normalization function
function normalizeProduct(payload: unknown): AdminProduct {
  const product = toRecord(payload)

  return {
    id: toNumber(product.id),
    name: toString(product.name, ""),
    slug: toString(product.slug, ""),
    description: toString(product.description, ""),
    status: toString(product.status, "active").toLowerCase(),
    is_approved: toBoolean(product.is_approved),
    view_count: toNumber(product.view_count),
    inquiry_count: toNumber(product.inquiry_count),
    category: normalizeCategory(product.category),
    sub_category: normalizeSubCategory(product.sub_category),
    images: normalizeImages(product.images),
    pricing_quantities: normalizePricingQuantities(product.pricing_quantities),
    specifications: normalizeSpecifications(product.specifications),
    product_key_features: normalizeKeyFeatures(product.product_key_features),
    customization_options: normalizeCustomizationOptions(product.customization_options),
    shipping_packaging: normalizeShippingPackaging(product.shipping_packaging),
    shipping_methods: normalizeShippingMethods(product.shipping_methods),
  }
}

// Normalize meta information
function normalizeMeta(payload: unknown): AdminProductMeta | null {
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

export async function getAdminProducts(
  page = 1,
  filters?: Record<string, unknown>
): Promise<AdminProductsResponse> {
  try {
    const params: Record<string, unknown> = { page, ...filters }
    const response = await apiClient.get("/admin/products", { params })
    const payload = toRecord(response.data)
    const rows = Array.isArray(payload.data) ? payload.data : []

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: rows.map(normalizeProduct),
      meta: normalizeMeta(payload.meta),
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch products."),
      data: [],
      meta: null,
    }
  }
}

export async function getAdminProductById(id: number): Promise<AdminProductDetailResponse> {
  try {
    const response = await apiClient.get(`/admin/products/${id}`)
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: payload.data ? normalizeProduct(payload.data) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch product details."),
      data: null,
    }
  }
}

export async function updateAdminProductApprovalStatus(
  id: number,
  is_approved: boolean
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiClient.patch(
      `/admin/products/${id}/approval-status`,
      { is_approved }
    )
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update product approval status."),
    }
  }
}

export async function deleteAdminProduct(
  id: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiClient.delete(`/admin/products/${id}`)
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
