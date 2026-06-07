import { apiClient } from "./client"
import { getApiErrorMessage } from "./errors"

export type CustomerSupportTicketStatus =
  | "open"
  | "in_progress"
  | "waiting_on_customer"
  | "resolved"
  | "closed"
  | "unknown"

export type CustomerSupportTicketPriority = "low" | "medium" | "high" | "urgent" | "unknown"

export interface CustomerSupportTicketUser {
  id: number
  fullName: string
  email: string
  role: string
}

export interface CustomerSupportTicketAssignee {
  id: number
  fullName: string
  email: string
}

export interface CustomerSupportTicket {
  id: number
  subject: string
  status: CustomerSupportTicketStatus
  priority: CustomerSupportTicketPriority
  departmentType: string
  assignedTo: number | null
  createdAt: string | null
  updatedAt: string | null
  user: CustomerSupportTicketUser | null
  assignee: CustomerSupportTicketAssignee | null
}

export interface CustomerSupportTicketAttachment {
  id: number
  originalName: string
  fileMime: string
  sizeBytes: number
  disk: string
  filePath: string
  url: string
}

export interface CustomerSupportTicketMessage {
  id: number
  ticketId: number
  message: string
  userId: number
  createdAt: string | null
  updatedAt: string | null
  user: CustomerSupportTicketUser | null
  attachments: CustomerSupportTicketAttachment[]
}

export interface CustomerSupportTicketDetail extends CustomerSupportTicket {
  messages: CustomerSupportTicketMessage[]
}

export interface CustomerSupportTicketsMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number | null
  to: number | null
}

export interface CustomerSupportTicketsResponse {
  success: boolean
  message?: string
  data: CustomerSupportTicket[]
  meta: CustomerSupportTicketsMeta | null
}

export interface CustomerSupportTicketDetailResponse {
  success: boolean
  message?: string
  data: CustomerSupportTicketDetail | null
}

export interface UpdateCustomerSupportTicketInput {
  status: CustomerSupportTicketStatus
  priority: CustomerSupportTicketPriority
  departmentType: string
  assignTo: number | null
}

export interface ReplyCustomerSupportTicketInput {
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

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value

  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }

  return fallback
}

function toString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return fallback
}

function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeStatus(value: unknown): CustomerSupportTicketStatus {
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

function normalizePriority(value: unknown): CustomerSupportTicketPriority {
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

function normalizeUser(value: unknown): CustomerSupportTicketUser | null {
  const user = toRecord(value)
  if (Object.keys(user).length === 0) return null

  return {
    id: toNumber(user.id),
    fullName: fullNameFromNames(user),
    email: toString(user.email, "N/A"),
    role: toString(user.role, "unknown").toLowerCase(),
  }
}

function normalizeAssignee(value: unknown): CustomerSupportTicketAssignee | null {
  const assignee = toRecord(value)
  if (Object.keys(assignee).length === 0) return null

  return {
    id: toNumber(assignee.id),
    fullName: fullNameFromNames(assignee),
    email: toString(assignee.email, "N/A"),
  }
}

function normalizeTicket(value: unknown): CustomerSupportTicket {
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
    user: normalizeUser(ticket.user),
    assignee: normalizeAssignee(ticket.assignee),
  }
}

function normalizeAttachment(value: unknown): CustomerSupportTicketAttachment {
  const attachment = toRecord(value)

  return {
    id: toNumber(attachment.id),
    originalName: toString(attachment.original_name, "Attachment"),
    fileMime: toString(attachment.file_mime, "application/octet-stream"),
    sizeBytes: toNumber(attachment.size_bytes),
    disk: toString(attachment.disk, "public"),
    filePath: toString(attachment.file_path, ""),
    url: toString(attachment.url, ""),
  }
}

function normalizeMessages(value: unknown): CustomerSupportTicketMessage[] {
  if (!Array.isArray(value)) return []

  return value.map((raw) => {
    const item = toRecord(raw)
    const attachmentsRaw = Array.isArray(item.attachments) ? item.attachments : []

    return {
      id: toNumber(item.id),
      ticketId: toNumber(item.ticket_id),
      message: toString(item.message, ""),
      userId: toNumber(item.user_id),
      createdAt: toNullableString(item.created_at),
      updatedAt: toNullableString(item.updated_at),
      user: normalizeUser(item.user),
      attachments: attachmentsRaw.map(normalizeAttachment),
    }
  })
}

function normalizeTicketDetail(value: unknown): CustomerSupportTicketDetail {
  const base = normalizeTicket(value)
  const item = toRecord(value)

  return {
    ...base,
    messages: normalizeMessages(item.messages),
  }
}

function normalizeMeta(value: unknown): CustomerSupportTicketsMeta | null {
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

export async function getAdminCustomerSupportTickets(
  page = 1,
  perPage = 15
): Promise<CustomerSupportTicketsResponse> {
  try {
    const response = await apiClient.get("/admin/customer-supports/tickets", {
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
      message: getApiErrorMessage(error, "Failed to fetch customer support tickets."),
      data: [],
      meta: null,
    }
  }
}

export async function getAdminCustomerSupportTicketById(
  ticketId: number
): Promise<CustomerSupportTicketDetailResponse> {
  try {
    const response = await apiClient.get(`/admin/customer-supports/tickets/${ticketId}`)
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: payload.data ? normalizeTicketDetail(payload.data) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch ticket details."),
      data: null,
    }
  }
}

export async function replyAdminCustomerSupportTicket(
  ticketId: number,
  input: ReplyCustomerSupportTicketInput
): Promise<CustomerSupportTicketDetailResponse> {
  try {
    const formData = new FormData()
    formData.append("message", input.message)

    if (input.attachments?.length) {
      input.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
    }

    const response = await apiClient.post(
      `/admin/customer-supports/tickets/${ticketId}/messages`,
      formData
    )
    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: payload.data ? normalizeTicketDetail(payload.data) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to send ticket reply."),
      data: null,
    }
  }
}

export async function updateAdminCustomerSupportTicket(
  ticketId: number,
  input: UpdateCustomerSupportTicketInput
): Promise<CustomerSupportTicketDetailResponse> {
  try {
    const response = await apiClient.patch(`/admin/customer-supports/tickets/${ticketId}`, {
      status: input.status,
      priority: input.priority,
      department_type: input.departmentType,
      assign_to: input.assignTo,
    })

    const payload = toRecord(response.data)

    return {
      success: typeof payload.success === "boolean" ? payload.success : true,
      message: typeof payload.message === "string" ? payload.message : undefined,
      data: payload.data ? normalizeTicketDetail(payload.data) : null,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update ticket."),
      data: null,
    }
  }
}