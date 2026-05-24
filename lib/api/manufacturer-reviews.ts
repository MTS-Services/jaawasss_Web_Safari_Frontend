import type {
  ReviewRequest,
  ReviewRequestStatus,
  ReviewSubmission,
  ReviewCapture,
} from "./admin-reviews"
import { _getStore, REVIEW_STATUS_LABELS } from "./admin-reviews"

// ─── Manufacturer-side response types ────────────────────────────────────────

export interface ManufacturerReviewListResponse {
  success: boolean
  message: string
  data: ReviewRequest[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ManufacturerReviewDetailResponse {
  success: boolean
  message: string
  data: ReviewRequest
}

export interface SubmitReviewResponse {
  success: boolean
  message: string
  data: ReviewSubmission
}

// ─── Fake delay ──────────────────────────────────────────────────────────────

function delay(ms: number = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms + Math.random() * 300))
}

// ─── API Functions (MOCK — reads/writes to the shared store) ─────────────────

/**
 * Fetch all review requests for the current manufacturer.
 * In mock mode, returns ALL reviews (pretending the logged-in manufacturer owns them all).
 */
export async function fetchMyReviewRequests(
  status?: ReviewRequestStatus
): Promise<ManufacturerReviewListResponse> {
  await delay()

  let items = _getStore()
  if (status) {
    items = items.filter((r) => r.status === status)
  }

  return {
    success: true,
    message: "OK",
    data: items,
    meta: { current_page: 1, last_page: 1, per_page: 50, total: items.length },
  }
}

/**
 * Fetch single review request detail for manufacturer
 */
export async function fetchMyReviewDetail(
  reviewId: number | string
): Promise<ManufacturerReviewDetailResponse> {
  await delay()
  const found = _getStore().find((r) => String(r.id) === String(reviewId))
  if (!found) throw new Error("Review request not found")
  return { success: true, message: "OK", data: found }
}

/**
 * Submit captures for a review request.
 * In mock mode, converts blobs to object URLs and updates the shared store.
 */
export async function submitReviewCaptures(
  reviewId: number | string,
  captures: Array<{
    area_name: string
    photo: Blob
  }>,
  notes?: string
): Promise<SubmitReviewResponse> {
  await delay(800)

  const store = _getStore()
  const idx = store.findIndex((r) => String(r.id) === String(reviewId))
  if (idx === -1) throw new Error("Review request not found")

  // Build mock captures from blobs
  const mockCaptures: ReviewCapture[] = captures.map((cap, i) => ({
    id: Date.now() + i,
    area_name: cap.area_name,
    photo_url: URL.createObjectURL(cap.photo),
    captured_at: new Date().toISOString(),
    has_review_code: true,
    mime_type: "image/jpeg",
    file_size: cap.photo.size,
  }))

  const submission: ReviewSubmission = {
    id: Date.now(),
    review_request_id: reviewId,
    captures: mockCaptures,
    notes: notes || undefined,
    submitted_at: new Date().toISOString(),
    status: "submitted",
    device_info: navigator.userAgent.includes("Mobile") ? "Mobile Device" : "Desktop Browser",
  }

  // Update the store
  store[idx] = {
    ...store[idx],
    status: "submitted",
    updated_at: new Date().toISOString(),
    submissions: [submission],
  }

  return { success: true, message: "Review submitted successfully", data: submission }
}
