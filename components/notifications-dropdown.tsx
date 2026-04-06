"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  MessageSquare, 
  FileText,
  AlertCircle,
  Info,
  Zap,
  Package,
  ArrowRight,
  Inbox,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { Notification } from "@/lib/api/notifications"
import { cn } from "@/lib/utils"

interface NotificationsDropdownProps {
  className?: string
}

type NotificationFilter = "all" | "unread"

function getNotificationDate(notification: Notification): Date | null {
  const rawDate = notification.createdAt || notification.timestamp
  if (!rawDate) {
    return null
  }

  const parsedDate = new Date(rawDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate
}

export function NotificationsDropdown({ className }: NotificationsDropdownProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all")
  const { 
    notifications = [], 
    unreadCount = 0,
    isLoading, 
    error,
    fetchNotifications,
    markAsRead, 
    markAllAsRead, 
    remove 
  } = useNotifications()

  const safeNotifications = Array.isArray(notifications) ? notifications : []

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return safeNotifications.filter((notification) => !notification.read)
    }

    return safeNotifications
  }, [activeFilter, safeNotifications])

  const messageCenterHref = useMemo(() => {
    if (pathname.startsWith("/admin")) {
      return "/admin/messages"
    }
    if (pathname.startsWith("/dashboard/manufacturer")) {
      return "/dashboard/manufacturer/messages"
    }
    if (pathname.startsWith("/dashboard/buyer")) {
      return "/dashboard/buyer/messages"
    }

    return "/messages"
  }, [pathname])

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconClass = "h-4 w-4"
    switch (type) {
      case "message":
        return <MessageSquare className={iconClass} />
      case "inquiry":
        return <FileText className={iconClass} />
      case "quote":
        return <AlertCircle className={iconClass} />
      case "supplier":
        return <Package className={iconClass} />
      case "order":
        return <Package className={iconClass} />
      case "system":
        return <Zap className={iconClass} />
      default:
        return <Info className={iconClass} />
    }
  }

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return "bg-blue-500/10 text-blue-600"
      case "inquiry":
        return "bg-purple-500/10 text-purple-600"
      case "quote":
        return "bg-amber-500/10 text-amber-600"
      case "supplier":
        return "bg-green-500/10 text-green-600"
      case "order":
        return "bg-indigo-500/10 text-indigo-600"
      case "system":
        return "bg-yellow-500/10 text-yellow-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  const handleMarkAsRead = (e: React.MouseEvent, notificationId: string, isRead: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isRead) {
      markAsRead(notificationId)
    }
  }

  const handleRemove = (e: React.MouseEvent, notificationId: string) => {
    e.preventDefault()
    e.stopPropagation()
    remove(notificationId)
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      void markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
      setIsOpen(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      void fetchNotifications()
    }
  }

  const renderNotificationItem = (notification: Notification) => {
    const isUnread = !notification.read
    const notificationDate = getNotificationDate(notification)
    const timeAgo = notificationDate
      ? formatDistanceToNow(notificationDate, { addSuffix: true })
      : "Just now"
    const isClickable = Boolean(notification.actionUrl)

    return (
      <div
        key={notification.id}
        onClick={() => {
          if (isClickable) {
            handleNotificationClick(notification)
          }
        }}
        onKeyDown={(event) => {
          if (!isClickable) {
            return
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            handleNotificationClick(notification)
          }
        }}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : -1}
        className={cn(
          "group relative flex items-start gap-3 px-4 py-3.5 transition-all rounded-md",
          isClickable && "cursor-pointer hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          isUnread ? "bg-primary/5" : "bg-transparent"
        )}
      >

        {/* Icon */}
        <div className={cn(
          "mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg shrink-0 font-semibold",
          getTypeColor(notification.type)
        )}>
          {notification.avatar ? (
            <Avatar className="h-9 w-9">
              <AvatarImage src={notification.avatar} />
              <AvatarFallback className="text-xs">{notification.title[0]}</AvatarFallback>
            </Avatar>
          ) : (
            getNotificationIcon(notification.type)
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={cn(
                "text-sm leading-snug",
                isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/90"
              )}>
                {notification.title}
              </p>
              <p className="line-clamp-2 text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {notification.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {timeAgo}
                </span>
                {isUnread && (
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => handleMarkAsRead(e, notification.id, notification.read)}
            title={notification.read ? "Already read" : "Mark as read"}
          >
            {notification.read ? (
              <CheckCheck className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => handleRemove(e, notification.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`Notifications, ${unreadCount} unread`}
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-9 w-9 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            className
          )}
        >
          <Bell
            className={cn(
              "h-5 w-5 transition-colors",
              unreadCount > 0 ? "text-primary" : "text-muted-foreground"
            )}
          />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        collisionPadding={8}
        className="rounded-xl p-0 shadow-lg backdrop-blur-sm bg-background/95 border border-muted/10"
        style={{ width: "min(360px, calc(100vw - 1rem))" }}
        forceMount
      >
        {/* Header */}
        <div className="border-b px-4 py-3 bg-linear-to-b from-muted/5 to-background">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs hover:bg-muted"
                onClick={markAllAsRead}
              >
                <CheckCheck className="mr-1.5 h-3 w-3" />
                <span className="font-medium">Mark all read</span>
              </Button>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={activeFilter === "all"}
              className={cn(
                "h-7 rounded-full px-3 text-xs",
                activeFilter === "all" ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
              onClick={() => setActiveFilter("all")}
            >
              All ({safeNotifications.length})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={activeFilter === "unread"}
              className={cn(
                "h-7 rounded-full px-3 text-xs",
                activeFilter === "unread" ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
              onClick={() => setActiveFilter("unread")}
            >
              Unread ({unreadCount})
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        {isLoading && !safeNotifications.length ? (
          <div className="flex h-48 items-center justify-center">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">Loading notifications...</p>
            </div>
          </div>
        ) : error && !safeNotifications.length ? (
          <div className="flex h-48 items-center justify-center px-5">
            <div className="w-full space-y-3 rounded-lg border bg-background p-4 text-center">
              <p className="text-sm font-semibold text-foreground">Could not load notifications</p>
              <p className="text-xs text-muted-foreground">{error}</p>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => void fetchNotifications()}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Try again
              </Button>
            </div>
          </div>
        ) : !filteredNotifications.length ? (
          <div className="flex h-52 items-center justify-center px-5">
            <div className="text-center space-y-4 px-4">
              <div className="flex justify-center">
                <div className="flex h-18 w-18 items-center justify-center rounded-full bg-muted/60 p-3">
                  <Inbox className="h-8 w-8 text-muted-foreground/70" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  {activeFilter === "unread" ? "No unread notifications" : "You're all caught up"}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeFilter === "unread"
                    ? "No unread updates — nice work. Try checking All to see older items."
                    : "We will notify you here when there are updates, messages, or important alerts."}
                </p>
              </div>
              <div className="pt-2">
                <Badge variant="secondary" className="text-xs gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Stay tuned</span>
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea style={{ maxHeight: "min(60vh, 24rem)" }}>
            <div className="p-3 space-y-2">
              {filteredNotifications.map(renderNotificationItem)}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {safeNotifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="px-3 py-2.5">
              <Link href={messageCenterHref} className="block w-full" onClick={() => setIsOpen(false)}>
                <Button 
                  variant="ghost" 
                  className="h-8 w-full justify-between text-xs font-medium text-foreground/70 hover:bg-muted hover:text-foreground" 
                  asChild
                >
                  <span>
                    Open message center
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
