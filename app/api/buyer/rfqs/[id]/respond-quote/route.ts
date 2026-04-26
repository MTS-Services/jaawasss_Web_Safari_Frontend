import { NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"
import { getApiErrorMessage } from "@/lib/api/errors"

interface RespondQuoteRequest {
  action: "accept" | "cancel"
}

interface RespondQuoteResponse {
  success: boolean
  message?: string
  data?: Record<string, unknown>
}

/**
 * Validates the request body
 */
function validateRequestBody(body: unknown): { valid: boolean; error?: string; data?: RespondQuoteRequest } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body is required" }
  }

  const payload = body as Record<string, unknown>
  const action = payload.action

  if (!action || typeof action !== "string") {
    return { valid: false, error: "Action field is required and must be a string" }
  }

  if (action !== "accept" && action !== "cancel") {
    return { valid: false, error: 'Action must be either "accept" or "cancel"' }
  }

  return { valid: true, data: { action: action as "accept" | "cancel" } }
}

/**
 * Validates the RFQ ID parameter
 */
function validateRfqId(id: unknown): { valid: boolean; error?: string; id?: number } {
  if (!id || typeof id !== "string") {
    return { valid: false, error: "RFQ ID is required" }
  }

  const parsed = parseInt(id, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return { valid: false, error: "RFQ ID must be a positive integer" }
  }

  return { valid: true, id: parsed }
}

/**
 * POST /api/buyer/rfqs/[id]/respond-quote
 *
 * Handles RFQ quote response (accept or cancel/reject)
 *
 * Request body:
 * {
 *   "action": "accept" | "cancel"
 * }
 *
 * Response:
 * {
 *   "success": boolean
 *   "message": string (optional)
 *   "data": object (optional)
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<RespondQuoteResponse>> {
  try {
    // Validate RFQ ID
    const idValidation = validateRfqId(params.id)
    if (!idValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: idValidation.error,
        },
        { status: 400 }
      )
    }

    // Parse request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON in request body",
        },
        { status: 400 }
      )
    }

    // Validate request body
    const bodyValidation = validateRequestBody(body)
    if (!bodyValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: bodyValidation.error,
        },
        { status: 400 }
      )
    }

    const rfqId = idValidation.id!
    const { action } = bodyValidation.data!

    // Get authorization token from request headers
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Missing authorization header",
        },
        { status: 401 }
      )
    }

    // Forward request to backend API
    const response = await apiClient.post(
      `/buyer/rfqs/${rfqId}/respond-quote`,
      { action },
      {
        headers: {
          authorization: authHeader,
        },
      }
    )

    const result = response.data as Record<string, unknown>

    return NextResponse.json(
      {
        success: typeof result.success === "boolean" ? result.success : true,
        message: typeof result.message === "string" ? result.message : undefined,
        data: result.data as Record<string, unknown> | undefined,
      },
      {
        status: response.status,
      }
    )
  } catch (error: unknown) {
    const errorMessage = getApiErrorMessage(error, "Failed to process RFQ response")

    // Extract status code if available
    const statusCode = error && typeof error === "object" && "response" in error
      ? (error as { response?: { status?: number } }).response?.status ?? 500
      : 500

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: statusCode }
    )
  }
}
