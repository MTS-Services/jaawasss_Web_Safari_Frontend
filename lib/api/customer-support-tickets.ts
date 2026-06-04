import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export type CustomerTicketStatus =
  | "open"
  | "in_progress"
  | "waiting_on_customer"
  | "resolved"
  | "closed"
  | "unknown"

export type CustomerTicketPriority = "low" | "medium" | "high" | "urgent" | "unknown"

export interface CustomerTicketAssignee {
  id: number
  fullName: string
  email: string
}

export interface CustomerTicket {
  id: number
  subject: string
  status: CustomerTicketStatus
  priority: CustomerTicketPriority
  departmentType: string
  assignedTo: number | null
  createdAt: string | null
  updatedAt: string | null
  assignee: CustomerTicketAssignee | null
}

export interface CustomerTicketAttachment {
  id: number
  originalName: string
  fileMime: string
  sizeBytes: number
  disk: string
  filePath: string
  url: string
}

export interface CustomerTicketMessageUser {
  id: number
  fullName: string
  email: string
}

export interface CustomerTicketMessage {
  id: number
  ticketId: number
  message: string
  userId: number
  createdAt: string | null
  updatedAt: string | null
  user: CustomerTicketMessageUser | null
  attachments: CustomerTicketAttachment[]
}

export interface CustomerTicketDetail extends CustomerTicket {
  messages: CustomerTicketMessage[]
}

export interface CustomerTicketMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number | null
  to: number | null
}

export interface CustomerTicketsListResponse {
  success: boolean
  message?: string
  data: CustomerTicket[]
  meta: CustomerTicketMeta | null
}

export interface CustomerTicketDetailResponse {
  success: boolean
  message?: string
  data: CustomerTicketDetail | null
}

export interface CreateCustomerTicketInput {
  subject: string
  departmentType: string
  message: string
  priority: CustomerTicketPriority
  attachments?: File[]
}

export interface ReplyCustomerTicketInput {
  message: string
  attachments?: File[]
}

type RecordLike = Record<string, unknown>

function toRecord(value: unknown): RecordLike {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as RecordLike
  }
  return {}
}

function toString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return fallback
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeStatus(value: unknown): CustomerTicketStatus {
  const status = toString(value, "unknown").trim().toLowerCase()
  if (
    status === "open" ||
    status === "in_progress" ||
    status === "waiting_on_customer" ||
    status === "resolved" ||
    status === "closed"
  ) {
    return status
  }
  return "unknown"
}

function normalizePriority(value: unknown): CustomerTicketPriority {
  const priority = toString(value, "unknown").trim().toLowerCase()
  if (priority === "low" || priority === "medium" || priority === "high" || priority === "urgent") {
    return priority
  }
  return "unknown"
}

function fullNameFromNames(raw: RecordLike): string {
  const firstName = toString(raw.first_name).trim()
  const lastName = toString(raw.last_name).trim()
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName.length > 0 ? fullName : "N/A"
}

function normalizeAssignee(value: unknown): CustomerTicketAssignee | null {
  const assignee = toRecord(value)
  if (Object.keys(assignee).length === 0) return null

  return {
    id: toNumber(assignee.id),
    fullName: fullNameFromNames(assignee),
    email: toString(assignee.email, "N/A"),
  }
}

function normalizeTicket(value: unknown): CustomerTicket {
  const ticket = toRecord(value)

  return {
    id: toNumber(ticket.id),
    subject: toString(ticket.subject, "Untitled ticket"),
    status: normalizeStatus(ticket.status),
    priority: normalizePriority(ticket.priority),
    departmentType: toString(ticket.department_type, "general"),
    assignedTo: ticket.assigned_to == null ? null : toNumber(ticket.assigned_to),
    createdAt: toNullableString(ticket.created_at),
    updatedAt: toNullableString(ticket.updated_at),
    assignee: normalizeAssignee(ticket.assignee),
  }
}

function normalizeAttachment(value: unknown): CustomerTicketAttachment {
  const item = toRecord(value)

  return {
    id: toNumber(item.id),
    originalName: toString(item.original_name, "Attachment"),
    fileMime: toString(item.file_mime, "application/octet-stream"),
    sizeBytes: toNumber(item.size_bytes),
    disk: toString(item.disk, "public"),
    filePath: toString(item.file_path),
    url: toString(item.url),
  }
}

function normalizeMessageUser(value: unknown): CustomerTicketMessageUser | null {
  const user = toRecord(value)
  if (Object.keys(user).length === 0) return null

  return {
    id: toNumber(user.id),
    fullName: fullNameFromNames(user),
    email: toString(user.email, "N/A"),
  }
}

function normalizeMessages(value: unknown): CustomerTicketMessage[] {
  if (!Array.isArray(value)) return []

  return value.map((raw) => {
    const item = toRecord(raw)
    const attachments = Array.isArray(item.attachments) ? item.attachments : []

    return {
      id: toNumber(item.id),
      ticketId: toNumber(item.ticket_id),
      message: toString(item.message),
      userId: toNumber(item.user_id),
      createdAt: toNullableString(item.created_at),
      updatedAt: toNullableString(item.updated_at),
      user: normalizeMessageUser(item.user),
      attachments: attachments.map(normalizeAttachment),
    }
  })
}

function normalizeDetail(value: unknown): CustomerTicketDetail {
  const base = normalizeTicket(value)
  const item = toRecord(value)

  return {
    ...base,
    messages: normalizeMessages(item.messages),
  }
}

function normalizeMeta(value: unknown): CustomerTicketMeta | null {
  const meta = toRecord(value)
  if (Object.keys(meta).length === 0) return null

  return {
    currentPage: toNumber(meta.current_page, 1),
    lastPage: toNumber(meta.last_page, 1),
    perPage: toNumber(meta.per_page, 15),
    total: toNumber(meta.total, 0),
    from: meta.from == null ? null : toNumber(meta.from),
    to: meta.to == null ? null : toNumber(meta.to),
  }
}

export async function getMyCustomerSupportTickets(
  page = 1,
  perPage = 15
): Promise<CustomerTicketsListResponse> {
  try {
    const response = await apiClient.get("/customer-supports/tickets", {
      params: {
        page,
        per_page: perPage,
      },
    })
    const payload = toRecord(response.data)
    const rows = Array.isArray(payload.data) ? payload.data : []

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: rows.map(normalizeTicket),
      meta: normalizeMeta(payload.meta),
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch support tickets."),
      data: [],
      meta: null,
    }
  }
}

export async function getMyCustomerSupportTicketById(
  ticketId: number
): Promise<CustomerTicketDetailResponse> {
  try {
    const response = await apiClient.get(`/customer-supports/tickets/${ticketId}`)
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: payload.data ? normalizeDetail(payload.data) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch ticket details."),
      data: null,
    }
  }
}

export async function createCustomerSupportTicket(
  input: CreateCustomerTicketInput
): Promise<CustomerTicketDetailResponse> {
  try {
    const formData = new FormData()
    formData.append("subject", input.subject)
    formData.append("department_type", input.departmentType)
    formData.append("message", input.message)
    formData.append("priority", input.priority)

    if (input.attachments?.length) {
      input.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
    }

    const response = await apiClient.post("/customer-supports/tickets", formData)
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: payload.data ? normalizeDetail(payload.data) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to create support ticket."),
      data: null,
    }
  }
}

export async function replyCustomerSupportTicket(
  ticketId: number,
  input: ReplyCustomerTicketInput
): Promise<CustomerTicketDetailResponse> {
  try {
    const formData = new FormData()
    formData.append("message", input.message)

    if (input.attachments?.length) {
      input.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
    }

    const response = await apiClient.post(
      `/customer-supports/tickets/${ticketId}/messages`,
      formData
    )
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: payload.data ? normalizeDetail(payload.data) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to send ticket reply."),
      data: null,
    }
  }
}
