// ─── Types ───────────────────────────────────────────────────────────────────

export type ReviewRequestStatus =
  | "pending"
  | "submitted"
  | "approved"
  | "rejected"
  | "re_requested"
  | "completed"

export type ReviewType =
  | "live_factory_capture"
  | "additional_document_review"
  | "specific_area_capture"

export interface ReviewCapture {
  id: number | string
  area_name: string
  photo_url: string
  thumbnail_url?: string
  captured_at: string
  has_review_code: boolean
  mime_type?: string
  file_size?: number
}

export interface ReviewSubmission {
  id: number | string
  review_request_id: number | string
  captures: ReviewCapture[]
  notes?: string
  submitted_at: string
  status: ReviewRequestStatus
  device_info?: string
}

export interface ReviewRequest {
  id: number | string
  manufacturer_id: number | string
  manufacturer_name?: string
  manufacturer_email?: string
  company_name?: string
  review_type: ReviewType
  requested_areas: string[]
  additional_instructions?: string
  review_code: string
  status: ReviewRequestStatus
  status_label?: string
  created_at: string
  updated_at?: string
  submissions?: ReviewSubmission[]
  rejection_reason?: string
}

export interface ReviewRequestListResponse {
  success: boolean
  message: string
  data: ReviewRequest[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

export interface ReviewRequestDetailResponse {
  success: boolean
  message: string
  data: ReviewRequest
}

export interface CreateReviewRequestPayload {
  review_type: ReviewType
  requested_areas: string[]
  additional_instructions?: string
}

// ─── Helper: Generate review code ────────────────────────────────────────────

export function generateReviewCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `SN-${num}`
}

// ─── Review type labels ──────────────────────────────────────────────────────

export const REVIEW_TYPE_LABELS: Record<ReviewType, string> = {
  live_factory_capture: "Live Factory Capture",
  additional_document_review: "Additional Document Review",
  specific_area_capture: "Specific Area Capture",
}

export const REVIEW_STATUS_LABELS: Record<ReviewRequestStatus, string> = {
  pending: "Pending",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  re_requested: "Re-requested",
  completed: "Completed",
}

// ─── Default requested areas ─────────────────────────────────────────────────

export const DEFAULT_FACTORY_AREAS = [
  "Factory Entrance",
  "Warehouse",
  "Machinery",
  "Production Line",
  "Quality Control Area",
  "Packaging Area",
  "Loading Dock",
] as const

// ─── MOCK DATA STORE (shared in-memory for the session) ─────────────────────

const FACTORY_PHOTOS = [
  "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80",
  "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800&q=80",
  "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
]

let _nextId = 100

function makeId() {
  return ++_nextId
}

const SEED_REVIEWS: ReviewRequest[] = [
  {
    id: 1,
    manufacturer_id: 10,
    manufacturer_name: "Ahmed Al-Rashid",
    manufacturer_email: "ahmed@steelworks-mena.com",
    company_name: "SteelWorks MENA Ltd.",
    review_type: "live_factory_capture",
    requested_areas: ["Factory Entrance", "Warehouse", "Machinery", "Production Line"],
    additional_instructions: "Please capture all main work areas during operational hours. Make sure the verification code is clearly visible in each photo.",
    review_code: "SN-4821",
    status: "submitted",
    created_at: "2026-05-20T10:30:00Z",
    updated_at: "2026-05-22T14:15:00Z",
    submissions: [
      {
        id: 101,
        review_request_id: 1,
        captures: [
          { id: 1001, area_name: "Factory Entrance", photo_url: FACTORY_PHOTOS[0], captured_at: "2026-05-22T14:00:00Z", has_review_code: true },
          { id: 1002, area_name: "Factory Entrance", photo_url: FACTORY_PHOTOS[1], captured_at: "2026-05-22T14:01:00Z", has_review_code: true },
          { id: 1003, area_name: "Warehouse", photo_url: FACTORY_PHOTOS[2], captured_at: "2026-05-22T14:03:00Z", has_review_code: true },
          { id: 1004, area_name: "Machinery", photo_url: FACTORY_PHOTOS[3], captured_at: "2026-05-22T14:05:00Z", has_review_code: false },
          { id: 1005, area_name: "Production Line", photo_url: FACTORY_PHOTOS[4], captured_at: "2026-05-22T14:08:00Z", has_review_code: true },
          { id: 1006, area_name: "Production Line", photo_url: FACTORY_PHOTOS[5], captured_at: "2026-05-22T14:10:00Z", has_review_code: true },
        ],
        notes: "All areas captured during peak production hours. One machinery photo was taken before the code overlay loaded.",
        submitted_at: "2026-05-22T14:15:00Z",
        status: "submitted",
        device_info: "Samsung Galaxy S24 Ultra",
      },
    ],
  },
  {
    id: 2,
    manufacturer_id: 11,
    manufacturer_name: "Yuki Tanaka",
    manufacturer_email: "yuki@precision-parts.jp",
    company_name: "Precision Parts Japan Co.",
    review_type: "specific_area_capture",
    requested_areas: ["Quality Control Area", "Packaging Area"],
    additional_instructions: "We need detailed captures of the QC lab and the packaging line. Focus on equipment calibration stickers if visible.",
    review_code: "SN-7293",
    status: "pending",
    created_at: "2026-05-23T08:00:00Z",
  },
  {
    id: 3,
    manufacturer_id: 12,
    manufacturer_name: "Carlos Mendez",
    manufacturer_email: "carlos@textilmex.mx",
    company_name: "TextilMex SA de CV",
    review_type: "live_factory_capture",
    requested_areas: ["Factory Entrance", "Production Line", "Warehouse"],
    review_code: "SN-1587",
    status: "approved",
    created_at: "2026-05-15T12:00:00Z",
    updated_at: "2026-05-19T16:30:00Z",
    submissions: [
      {
        id: 102,
        review_request_id: 3,
        captures: [
          { id: 2001, area_name: "Factory Entrance", photo_url: FACTORY_PHOTOS[0], captured_at: "2026-05-18T09:00:00Z", has_review_code: true },
          { id: 2002, area_name: "Production Line", photo_url: FACTORY_PHOTOS[4], captured_at: "2026-05-18T09:05:00Z", has_review_code: true },
          { id: 2003, area_name: "Warehouse", photo_url: FACTORY_PHOTOS[2], captured_at: "2026-05-18T09:10:00Z", has_review_code: true },
        ],
        submitted_at: "2026-05-18T09:15:00Z",
        status: "approved",
      },
    ],
  },
  {
    id: 4,
    manufacturer_id: 13,
    manufacturer_name: "Fatima Nouri",
    manufacturer_email: "fatima@casablancafoods.ma",
    company_name: "Casablanca Foods SARL",
    review_type: "additional_document_review",
    requested_areas: ["Quality Control Area"],
    additional_instructions: "Please provide updated ISO 9001 certificate and recent health inspection report.",
    review_code: "SN-3349",
    status: "rejected",
    rejection_reason: "Submitted photos were blurry and the review code was not visible in most captures. Please retake with better lighting.",
    created_at: "2026-05-10T14:00:00Z",
    updated_at: "2026-05-14T11:20:00Z",
    submissions: [
      {
        id: 103,
        review_request_id: 4,
        captures: [
          { id: 3001, area_name: "Quality Control Area", photo_url: FACTORY_PHOTOS[1], captured_at: "2026-05-13T10:00:00Z", has_review_code: false },
        ],
        submitted_at: "2026-05-13T10:05:00Z",
        status: "rejected",
      },
    ],
  },
  {
    id: 5,
    manufacturer_id: 14,
    manufacturer_name: "Hans Weber",
    manufacturer_email: "hans@weber-maschinenbau.de",
    company_name: "Weber Maschinenbau GmbH",
    review_type: "live_factory_capture",
    requested_areas: ["Factory Entrance", "Machinery", "Loading Dock"],
    review_code: "SN-6610",
    status: "completed",
    created_at: "2026-05-05T09:00:00Z",
    updated_at: "2026-05-12T15:00:00Z",
    submissions: [
      {
        id: 104,
        review_request_id: 5,
        captures: [
          { id: 4001, area_name: "Factory Entrance", photo_url: FACTORY_PHOTOS[0], captured_at: "2026-05-10T08:00:00Z", has_review_code: true },
          { id: 4002, area_name: "Machinery", photo_url: FACTORY_PHOTOS[3], captured_at: "2026-05-10T08:05:00Z", has_review_code: true },
          { id: 4003, area_name: "Loading Dock", photo_url: FACTORY_PHOTOS[5], captured_at: "2026-05-10T08:10:00Z", has_review_code: true },
        ],
        submitted_at: "2026-05-10T08:15:00Z",
        status: "completed",
      },
    ],
  },
]

// The shared store — survives hot reloads because it's module-level
let _store: ReviewRequest[] | null = null

export function _getStore(): ReviewRequest[] {
  if (!_store) {
    _store = JSON.parse(JSON.stringify(SEED_REVIEWS))
  }
  return _store!
}

// ─── Fake delay helper ───────────────────────────────────────────────────────

function delay(ms: number = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms + Math.random() * 300))
}

// API Functions (MOCK)

/**
 * Create a new review request for a manufacturer
 */
export async function createReviewRequest(
  manufacturerId: number | string,
  payload: CreateReviewRequestPayload & {
    review_code: string
    _manufacturer_name?: string
    _manufacturer_email?: string
    _company_name?: string
  }
): Promise<ReviewRequestDetailResponse> {
  await delay()

  const newReview: ReviewRequest = {
    id: makeId(),
    manufacturer_id: manufacturerId,
    manufacturer_name: payload._manufacturer_name || "Manufacturer",
    manufacturer_email: payload._manufacturer_email || "",
    company_name: payload._company_name || "",
    review_type: payload.review_type,
    requested_areas: payload.requested_areas,
    additional_instructions: payload.additional_instructions,
    review_code: payload.review_code,
    status: "pending",
    created_at: new Date().toISOString(),
  }

  _getStore().unshift(newReview)

  return { success: true, message: "Review request created", data: newReview }
}

/**
 * Fetch review requests for a specific manufacturer
 */
export async function fetchManufacturerReviewRequests(
  manufacturerId: number | string
): Promise<ReviewRequestListResponse> {
  await delay()
  const items = _getStore().filter(
    (r) => String(r.manufacturer_id) === String(manufacturerId)
  )
  return {
    success: true,
    message: "OK",
    data: items,
    meta: { current_page: 1, last_page: 1, per_page: 50, total: items.length, from: 1, to: items.length },
  }
}

/**
 * Fetch ALL review requests across all manufacturers (for Review Management page)
 */
export async function fetchAllReviewRequests(
  page: number = 1,
  perPage: number = 10,
  status?: ReviewRequestStatus
): Promise<ReviewRequestListResponse> {
  await delay()

  let items = _getStore()
  if (status) {
    items = items.filter((r) => r.status === status)
  }

  const total = items.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const start = (page - 1) * perPage
  const pageItems = items.slice(start, start + perPage)

  return {
    success: true,
    message: "OK",
    data: pageItems,
    meta: {
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total,
      from: start + 1,
      to: start + pageItems.length,
    },
  }
}

/**
 * Fetch single review request detail (with submissions)
 */
export async function fetchReviewRequestDetail(
  reviewId: number | string
): Promise<ReviewRequestDetailResponse> {
  await delay()
  const found = _getStore().find((r) => String(r.id) === String(reviewId))
  if (!found) throw new Error("Review request not found")
  return { success: true, message: "OK", data: found }
}

/**
 * Update review request status (approve / reject / re-request / complete)
 */
export async function updateReviewRequestStatus(
  reviewId: number | string,
  status: ReviewRequestStatus,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  await delay()

  const store = _getStore()
  const idx = store.findIndex((r) => String(r.id) === String(reviewId))
  if (idx === -1) throw new Error("Review request not found")

  store[idx] = {
    ...store[idx],
    status,
    updated_at: new Date().toISOString(),
    ...(reason ? { rejection_reason: reason } : {}),
  }

  // Also update submission status if exists
  if (store[idx].submissions?.[0]) {
    store[idx].submissions![0].status = status
  }

  return { success: true, message: `Review ${REVIEW_STATUS_LABELS[status].toLowerCase()} successfully` }
}
