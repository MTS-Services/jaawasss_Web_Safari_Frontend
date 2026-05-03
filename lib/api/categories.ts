import { apiClient, publicApiClient } from "@/lib/api/client"
import { getApiErrorMessage } from "@/lib/api/errors"

export interface BackendCategory {
  id: number | string
  name: string
  slug?: string
  description?: string
  color?: string
  title_color?: string
  desc_color?: string
  description_color?: string
  btn_color?: string
  supplier_color?: string
  supplier_count_color?: string
  featured?: boolean | number
  icon?: string
  icon_url?: string
  icon_color?: string
  supplier_count?: number
  product_count?: number
  subcategories?: BackendSubcategory[]
  sub_categories?: BackendSubcategory[]
}

export interface BackendSubcategory {
  id: number | string
  name: string
  slug?: string
  category_id?: number | string
  industry_id?: number | string
}

interface ApiResult<T> {
  success: boolean
  message?: string
  data: T
}

function readArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== "object") return []

  const source = payload as Record<string, unknown>
  const candidates = [
    source.data,
    source.categories,
    source.subcategories,
    source.items,
    source.results,
    source.response,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate
    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>
      if (Array.isArray(nested.data)) return nested.data
      if (Array.isArray(nested.items)) return nested.items
    }
  }

  return []
}

function normalizeSubcategory(raw: unknown): BackendSubcategory | null {
  if (!raw || typeof raw !== "object") return null
  const value = raw as Record<string, unknown>

  const id = value.id
  const name = value.name
  if ((typeof id !== "number" && typeof id !== "string") || typeof name !== "string") {
    return null
  }

  return {
    id,
    name,
    slug: typeof value.slug === "string" ? value.slug : undefined,
    category_id:
      typeof value.category_id === "number" || typeof value.category_id === "string"
        ? value.category_id
        : undefined,
    industry_id:
      typeof value.industry_id === "number" || typeof value.industry_id === "string"
        ? value.industry_id
        : undefined,
  }
}

function normalizeCategory(raw: unknown): BackendCategory | null {
  if (!raw || typeof raw !== "object") return null
  const value = raw as Record<string, unknown>

  const id = value.id
  const name = value.name
  if ((typeof id !== "number" && typeof id !== "string") || typeof name !== "string") {
    return null
  }

  const rawSubs = Array.isArray(value.subcategories)
    ? value.subcategories
    : Array.isArray(value.sub_categories)
      ? value.sub_categories
      : []

  const subcategories = rawSubs
    .map(normalizeSubcategory)
    .filter((item): item is BackendSubcategory => item !== null)

  return {
    id,
    name,
    slug: typeof value.slug === "string" ? value.slug : undefined,
    description: typeof value.description === "string" ? value.description : undefined,
    color: typeof value.color === "string" ? value.color : undefined,
    title_color: typeof value.title_color === "string" ? value.title_color : undefined,
    desc_color: typeof value.desc_color === "string" ? value.desc_color : undefined,
    description_color:
      typeof value.description_color === "string"
        ? value.description_color
        : typeof value.desc_color === "string"
          ? value.desc_color
          : undefined,
    btn_color: typeof value.btn_color === "string" ? value.btn_color : undefined,
    supplier_color: typeof value.supplier_color === "string" ? value.supplier_color : undefined,
    supplier_count_color:
      typeof value.supplier_count_color === "string"
        ? value.supplier_count_color
        : typeof value.supplier_color === "string"
          ? value.supplier_color
          : undefined,
    icon: typeof value.icon === "string" ? value.icon : undefined,
    icon_url: typeof value.icon_url === "string" ? value.icon_url : undefined,
    icon_color: typeof value.icon_color === "string" ? value.icon_color : undefined,
    featured:
      value.featured === true || value.featured === 1 || value.featured === "1"
        ? 1
        : 0,
    supplier_count: typeof value.supplier_count === "number" ? value.supplier_count : undefined,
    product_count: typeof value.product_count === "number" ? value.product_count : undefined,
    subcategories,
    sub_categories: subcategories,
  }
}

function normalizeCategories(payload: unknown): BackendCategory[] {
  return readArray(payload)
    .map(normalizeCategory)
    .filter((item): item is BackendCategory => item !== null)
}

function normalizeSubcategories(payload: unknown): BackendSubcategory[] {
  return readArray(payload)
    .map(normalizeSubcategory)
    .filter((item): item is BackendSubcategory => item !== null)
}

export async function getAdminCategories(params?: { perPage?: number; page?: number }): Promise<ApiResult<BackendCategory[]>> {
  try {
    const response = await apiClient.get("/admin/categories", {
      params: {
        ...(typeof params?.perPage === "number" ? { per_page: params.perPage } : {}),
        ...(typeof params?.page === "number" ? { page: params.page } : {}),
      },
    })
    return { success: true, data: normalizeCategories(response.data) }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch categories."),
      data: [],
    }
  }
}

export async function getPublicCategories(params?: { perPage?: number; page?: number }): Promise<ApiResult<BackendCategory[]>> {
  try {
    const response = await publicApiClient.get("/categories", {
      params: {
        ...(typeof params?.perPage === "number" ? { per_page: params.perPage } : {}),
        ...(typeof params?.page === "number" ? { page: params.page } : {}),
      },
    })
    return { success: true, data: normalizeCategories(response.data) }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch categories."),
      data: [],
    }
  }
}

export async function createAdminCategory(input: {
  name: string
  slug: string
  description?: string
  color?: string
  title_color?: string
  desc_color?: string
  description_color?: string
  btn_color?: string
  supplier_color?: string
  supplier_count_color?: string
  featured?: boolean
  icon?: string
  icon_color?: string
  icon_url?: string
}): Promise<ApiResult<null>> {
  try {
    const form = new FormData()
    form.append("name", input.name)
    form.append("slug", input.slug)
    if (input.description !== undefined) form.append("description", input.description)
    if (input.color) form.append("color", input.color)
    if (input.title_color) form.append("title_color", input.title_color)
    const descColor = input.desc_color || input.description_color
    const supplierColor = input.supplier_color || input.supplier_count_color
    if (descColor) form.append("desc_color", descColor)
    if (input.btn_color) form.append("btn_color", input.btn_color)
    if (supplierColor) form.append("supplier_color", supplierColor)
    form.append("featured", input.featured ? "1" : "0")
    if (input.icon) form.append("icon", input.icon)
    if (input.icon_color !== undefined) form.append("icon_color", input.icon_color || "")
    if (input.icon_url) form.append("icon_url", input.icon_url)

    await apiClient.post("/admin/categories/create", form)
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create category."),
      data: null,
    }
  }
}

export async function updateAdminCategory(
  categoryId: string,
  input: { 
    name: string; 
    slug: string; 
    description?: string; 
    color?: string; 
    title_color?: string;
    desc_color?: string;
    description_color?: string;
    btn_color?: string;
    supplier_color?: string;
    supplier_count_color?: string;
    featured?: boolean;
    icon?: string;
    icon_color?: string;
    icon_url?: string;
  }
): Promise<ApiResult<null>> {
  try {
    const form = new FormData()
    form.append("name", input.name)
    form.append("slug", input.slug)
    if (input.description !== undefined) form.append("description", input.description)
    if (input.color) form.append("color", input.color)
    if (input.title_color) form.append("title_color", input.title_color)
    const descColor = input.desc_color || input.description_color
    const supplierColor = input.supplier_color || input.supplier_count_color
    if (descColor) form.append("desc_color", descColor)
    if (input.btn_color) form.append("btn_color", input.btn_color)
    if (supplierColor) form.append("supplier_color", supplierColor)
    if (input.featured !== undefined) form.append("featured", input.featured ? "1" : "0")
    if (input.icon) form.append("icon", input.icon)
    if (input.icon_color !== undefined) form.append("icon_color", input.icon_color || "")
    if (input.icon_url) form.append("icon_url", input.icon_url)

    await apiClient.put(`/admin/categories/${categoryId}`, form)
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update category",
      data: null,
    }
  }
}

export async function moveAdminCategoryPosition(
  categoryId: string,
  currentPosition: number,
  newPosition: number
): Promise<ApiResult<null>> {
  try {
    await apiClient.put(`/admin/categories/${categoryId}/position`, {
      current_position: currentPosition,
      new_position: newPosition
    })
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update category position",
      data: null,
    }
  }
}

export async function toggleAdminCategoryFeatured(
  categoryId: string
): Promise<ApiResult<null>> {
  try {
    await apiClient.patch(`/admin/categories/${categoryId}/featured`)
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to toggle featured status"),
      data: null,
    }
  }
}

// ------------------------------------------------------------------
// Subcategories
// ------------------------------------------------------------------

export async function createAdminSubcategory(
  input: { 
    name: string; 
    slug: string; 
    industry_id: string | number;
    description?: string;
    tags?: string;
    icon?: File
  }
): Promise<ApiResult<null>> {
  try {
    const form = new FormData()
    form.append("name", input.name)
    form.append("slug", input.slug)
    form.append("industry_id", String(input.industry_id))
    if (input.description) form.append("description", input.description)
    if (input.tags) form.append("tags", input.tags)
    if (input.icon) form.append("icon", input.icon)

    await apiClient.post("/admin/subcategories/create", form)
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create subcategory",
      data: null,
    }
  }
}

export async function updateAdminSubcategory(
  subcategoryId: string,
  input: { 
    name: string; 
    slug: string; 
    industry_id: string | number;
    description?: string;
    tags?: string;
    icon?: File
  }
): Promise<ApiResult<null>> {
  try {
    const form = new FormData()
    form.append("name", input.name)
    form.append("slug", input.slug)
    form.append("industry_id", String(input.industry_id))
    if (input.description) form.append("description", input.description)
    if (input.tags) form.append("tags", input.tags)
    if (input.icon) form.append("icon", input.icon)

    await apiClient.put(`/admin/subcategories/${subcategoryId}`, form)
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update subcategory",
      data: null,
    }
  }
}

export async function deleteAdminSubcategory(id: string): Promise<ApiResult<null>> {
  try {
    await apiClient.delete(`/admin/subcategories/${id}`)
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete subcategory",
      data: null,
    }
  }
}

export async function moveAdminSubcategoryPosition(
  subcategoryId: string,
  currentPosition: number,
  newPosition: number
): Promise<ApiResult<null>> {
  try {
    await apiClient.put(`/admin/subcategories/${subcategoryId}/position`, {
      current_position: currentPosition,
      new_position: newPosition
    })
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update subcategory position",
      data: null,
    }
  }
}


export async function deleteAdminCategory(categoryId: string): Promise<ApiResult<null>> {
  try {
    await apiClient.delete(`/admin/categories/${categoryId}`)
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to delete category."),
      data: null,
    }
  }
}

export async function getAdminSubcategories(): Promise<ApiResult<BackendSubcategory[]>> {
  try {
    const response = await apiClient.get("/admin/subcategories")
    return { success: true, data: normalizeSubcategories(response.data) }
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch subcategories."),
      data: [],
    }
  }
}

