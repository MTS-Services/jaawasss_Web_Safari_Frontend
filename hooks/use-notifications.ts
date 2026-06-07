import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { getEcho } from "@/lib/echo"
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  Notification,
  NotificationType,
} from "@/lib/api/notifications"

export interface UseNotificationsOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  limit?: number
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { 
    autoRefresh = true, 
    refreshInterval = 30000, // 30 seconds
    limit = 20 
  } = options

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  const normalizeRealtimeNotification = useCallback((payload: unknown): Notification | null => {
    if (!payload || typeof payload !== "object") {
      return null
    }

    const data = payload as Record<string, unknown>
    const typeRaw = typeof data.type === "string" ? data.type.trim().toLowerCase() : "system"
    const type: NotificationType =
      typeRaw === "message" ||
      typeRaw === "inquiry" ||
      typeRaw === "quote" ||
      typeRaw === "supplier" ||
      typeRaw === "order"
        ? typeRaw
        : "system"

    const id = typeof data.id === "string" && data.id.trim() ? data.id : `realtime-${Date.now()}`
    const title =
      typeof data.title === "string" && data.title.trim() ? data.title : "Notification"
    const description =
      typeof data.description === "string" && data.description.trim()
        ? data.description
        : "You have a new update."
    const actionUrl =
      typeof data.actionUrl === "string" && data.actionUrl.trim() ? data.actionUrl : undefined
    const avatar = typeof data.avatar === "string" && data.avatar.trim() ? data.avatar : undefined
    const createdAt = new Date().toISOString()

    return {
      id,
      type,
      title,
      description,
      read: false,
      createdAt,
      actionUrl,
      avatar,
    }
  }, [])

  /**
   * Fetch all notifications
   */
  const fetchNotifications = useCallback(async () => {
    // Don't fetch if auth is still loading or user is not authenticated
    if (isAuthLoading || !isAuthenticated) {
      setNotifications([])
      setUnreadCount(0)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await getNotifications(limit)
      if (response.success && response.data) {
        const nextNotifications = Array.isArray(response.data.notifications)
          ? response.data.notifications
          : []
        const nextUnreadCount = Number.isFinite(response.data.unreadCount)
          ? response.data.unreadCount
          : nextNotifications.filter((notification) => !notification.read).length

        setNotifications(nextNotifications)
        setUnreadCount(nextUnreadCount)
      } else {
        setNotifications([])
        setUnreadCount(0)
        setError(response.message || "Failed to fetch notifications")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [limit, isAuthLoading, isAuthenticated])

  /**
   * Refresh notifications at intervals
   */
  useEffect(() => {
    // Only fetch when auth is done loading and user is authenticated
    if (!isAuthLoading && isAuthenticated) {
      fetchNotifications()
    }

    if (autoRefresh && !isAuthLoading && isAuthenticated) {
      refreshTimerRef.current = setInterval(fetchNotifications, refreshInterval)
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [fetchNotifications, autoRefresh, refreshInterval, isAuthLoading, isAuthenticated])

  // Real-time notifications from Laravel Echo private user channel.
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated || !user?.id) {
      return
    }

    const echo = getEcho()
    if (!echo) {
      return
    }

    const channelName = `App.Models.User.${user.id}`
    const channel = echo.private(channelName)

    channel.notification((incoming: unknown) => {
      const normalized = normalizeRealtimeNotification(incoming)
      if (!normalized) return

      setNotifications((prev) => {
        if (prev.some((item) => item.id === normalized.id)) {
          return prev
        }
        return [normalized, ...prev]
      })
      setUnreadCount((prevUnread) => prevUnread + 1)
    })

    return () => {
      echo.leave(channelName)
    }
  }, [isAuthLoading, isAuthenticated, normalizeRealtimeNotification, user?.id])

  /**
   * Mark single notification as read
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await markNotificationAsRead(notificationId)
      if (response.success) {
        setNotifications((prev) => {
          let shouldDecreaseUnread = false
          const nextNotifications = prev.map((notification) => {
            if (notification.id !== notificationId) {
              return notification
            }

            if (!notification.read) {
              shouldDecreaseUnread = true
            }

            return { ...notification, read: true }
          })

          if (shouldDecreaseUnread) {
            setUnreadCount((prevUnread) => Math.max(0, prevUnread - 1))
          }

          return nextNotifications
        })
      }
    } catch (err) {
      console.error("Failed to mark as read:", err)
    }
  }, [])

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await markAllNotificationsAsRead()
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        )
        setUnreadCount(0)
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err)
    }
  }, [])

  /**
   * Delete a notification
   */
  const remove = useCallback(async (notificationId: string) => {
    try {
      const response = await deleteNotification(notificationId)
      if (response.success) {
        setNotifications((prev) => {
          const target = prev.find((notification) => notification.id === notificationId)

          if (target && !target.read) {
            setUnreadCount((prevUnread) => Math.max(0, prevUnread - 1))
          }

          return prev.filter((notification) => notification.id !== notificationId)
        })
      }
    } catch (err) {
      console.error("Failed to delete notification:", err)
    }
  }, [])

  /**
   * Get unread notifications
   */
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read)
  }, [notifications])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    remove,
    getUnreadNotifications,
  }
}
