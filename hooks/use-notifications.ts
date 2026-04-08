import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  Notification,
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

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

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
