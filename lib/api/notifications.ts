import { apiClient } from "./client"

export interface Notification {
  id: string
  type: "message" | "inquiry" | "quote" | "supplier" | "order" | "system"
  title: string
  description: string
  read: boolean
  actionUrl?: string
  avatar?: string
  timestamp: string
  createdAt: string
}

export interface NotificationsResponse {
  success: boolean
  data: {
    notifications: Notification[]
    unreadCount: number
    total: number
  }
  message?: string
}

export interface MarkAsReadResponse {
  success: boolean
  message?: string
}

type NotificationType = Notification["type"]

function toNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function toDateString(value: unknown): string {
  if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString()
    }
  }

  return new Date().toISOString()
}

function toType(value: unknown): NotificationType {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : ""
  if (raw === "message" || raw === "inquiry" || raw === "quote" || raw === "supplier" || raw === "order") {
    return raw
  }

  return "system"
}

function toNumber(value: unknown, fallback: number): number {
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

function toRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return {}
}

function pickString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const result = toNonEmptyString(record[key])
    if (result) {
      return result
    }
  }

  return undefined
}

function normalizeNotification(item: unknown, index: number): Notification {
  const record = toRecord(item)
  const createdAt = toDateString(
    record.createdAt ?? record.created_at ?? record.timestamp ?? record.date
  )
  const type = toType(record.type)
  const id = String(
    record.id ?? record.notificationId ?? record.notification_id ?? `${type}-${index}-${createdAt}`
  )
  const title =
    pickString(record, ["title", "subject", "heading", "message"]) || "Notification"
  const description =
    pickString(record, ["description", "body", "content", "message"]) || "You have a new update."
  const actionUrl = pickString(record, ["actionUrl", "action_url", "url", "link", "redirectTo", "redirect_to"])
  const avatar = pickString(record, ["avatar", "avatar_url", "image", "image_url"])
  const read = Boolean(record.read ?? record.isRead ?? record.is_read ?? record.readAt ?? record.read_at)

  return {
    id,
    type,
    title,
    description,
    read,
    actionUrl,
    avatar,
    timestamp: createdAt,
    createdAt,
  }
}

function normalizeNotificationsResponse(payload: unknown): NotificationsResponse {
  const root = toRecord(payload)
  const payloadData = toRecord(root.data)
  const data = Object.keys(payloadData).length > 0 ? payloadData : root
  const directNotifications = Array.isArray(root.data)
    ? root.data
    : Array.isArray(payload)
      ? payload
      : null

  const rawNotifications = directNotifications ?? (
    Array.isArray(data.notifications)
      ? data.notifications
      : Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.results)
          ? data.results
          : []
  )

  const notifications = rawNotifications.map((item, index) => normalizeNotification(item, index))
  const unreadFromPayload = data.unreadCount ?? data.unread_count
  const unreadCount = toNumber(
    unreadFromPayload,
    notifications.filter((notification) => !notification.read).length
  )
  const total = toNumber(data.total ?? data.count, notifications.length)

  return {
    success: typeof root.success === "boolean" ? root.success : true,
    message: toNonEmptyString(root.message),
    data: {
      notifications,
      unreadCount,
      total,
    },
  }
}

/**
 * Fetch all notifications for the current user
 * Note: Currently returns empty notifications - not connected to backend yet
 */
export async function getNotifications(limit = 20, offset = 0): Promise<NotificationsResponse> {
  // Return empty notifications response without calling backend
  return {
    success: true,
    data: {
      notifications: [],
      unreadCount: 0,
      total: 0
    }
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<MarkAsReadResponse> {
  try {
    const response = await apiClient.post(`/me/notifications/${notificationId}/read`)
    return response.data
  } catch (error: any) {
    console.error("Failed to mark notification as read:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to mark notification as read"
    }
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<MarkAsReadResponse> {
  try {
    const response = await apiClient.post("/me/notifications/read-all")
    return response.data
  } catch (error: any) {
    console.error("Failed to mark all notifications as read:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to mark all notifications as read"
    }
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<MarkAsReadResponse> {
  try {
    const response = await apiClient.delete(`/me/notifications/${notificationId}`)
    return response.data
  } catch (error: any) {
    console.error("Failed to delete notification:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete notification"
    }
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const response = await apiClient.get("/me/notifications/unread-count")
    return response.data?.data?.unreadCount || 0
  } catch (error: any) {
    console.error("Failed to get unread count:", error)
    return 0
  }
}
