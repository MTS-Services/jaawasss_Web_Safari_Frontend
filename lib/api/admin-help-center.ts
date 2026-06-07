import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export interface HelpCenterCategory {
  id: number
  name: string
  slug: string
  description: string | null
  status: boolean
  sort_order: number
  available_locales?: string[]
}

export interface HelpCenterArticleStep {
  id?: number
  content: string
  sort_order?: number
}

export interface HelpCenterArticle {
  id: number
  help_center_category_id: number
  title: string
  description: string | null
  help_full: number
  not_help_full: number
  sort_order: number
  status: boolean
  steps: HelpCenterArticleStep[]
}

export interface PaginatedResponse<T> {
  success: boolean
  message?: string
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface MutationResponse {
  success: boolean
  message?: string
}

// ============================================================================
// Categories
// ============================================================================

export async function getAdminHelpCategories(page = 1, perPage = 100): Promise<PaginatedResponse<HelpCenterCategory>> {
  try {
    const response = await apiClient.get(`/admin/help-center/categories?page=${page}&per_page=${perPage}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch categories"),
      data: []
    }
  }
}

export async function createAdminHelpCategory(data: { name: string; slug: string; description: string }): Promise<MutationResponse> {
  try {
    const response = await apiClient.post("/admin/help-center/categories/create", data)
    return response.data
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create category"),
    }
  }
}

export async function updateAdminHelpCategory(id: number, data: { name: string; slug: string; description: string }): Promise<MutationResponse> {
  try {
    const response = await apiClient.put(`/admin/help-center/categories/${id}`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update category"),
    }
  }
}

export async function deleteAdminHelpCategory(id: number): Promise<MutationResponse> {
  try {
    const response = await apiClient.delete(`/admin/help-center/categories/${id}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to delete category"),
    }
  }
}

// ============================================================================
// Articles
// ============================================================================

export async function getAdminHelpArticles(categoryId?: number, page = 1, perPage = 100): Promise<PaginatedResponse<HelpCenterArticle>> {
  try {
    let url = `/admin/help-center/articles?page=${page}&per_page=${perPage}`
    if (categoryId) {
      url += `&help_center_category_id=${categoryId}`
    }
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch articles"),
      data: []
    }
  }
}

export async function createAdminHelpArticle(data: { 
  help_center_category_id: number; 
  title: string; 
  description: string; 
  steps: { content: string }[] 
}): Promise<MutationResponse> {
  try {
    const response = await apiClient.post("/admin/help-center/articles/create", data)
    return response.data
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create article"),
    }
  }
}

export async function updateAdminHelpArticle(id: number, data: { 
  help_center_category_id: number; 
  title: string; 
  description: string; 
  steps: { content: string }[] 
}): Promise<MutationResponse> {
  try {
    const response = await apiClient.put(`/admin/help-center/articles/${id}`, data)
    return response.data
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update article"),
    }
  }
}

export async function deleteAdminHelpArticle(id: number): Promise<MutationResponse> {
  try {
    const response = await apiClient.delete(`/admin/help-center/articles/${id}`)
    return response.data
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to delete article"),
    }
  }
}
