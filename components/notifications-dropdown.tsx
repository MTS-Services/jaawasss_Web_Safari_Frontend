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
  const rawDate = notification.createdAt
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
    markAllAsRead
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
          "group relative flex items-start gap-4 px-4 py-4 transition-all duration-300 rounded-2xl mx-1",
          isClickable && "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          isUnread ? "bg-primary/5" : "bg-transparent hover:bg-muted/30"
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
              "relative h-9 w-9 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 hover:bg-transparent hover:text-current",
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
        side="bottom"
        sideOffset={12}
        collisionPadding={16}
        avoidCollisions
        sticky="always"
        className="z-80 w-[calc(100vw-2rem)] max-w-[24rem] overflow-hidden rounded-3xl border border-primary/10 bg-background/98 p-0 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:w-[24rem] animate-in fade-in zoom-in-95 duration-200"
        forceMount
      >
        {/* Header */}
        <div className="relative border-b px-5 pt-5 pb-4 bg-linear-to-b from-primary/5 via-transparent to-transparent">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold ring-2 ring-background">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-foreground">Activity</h2>
                <p className="text-xs font-medium text-muted-foreground">
                  You have {unreadCount} new notifications
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-lg px-3 text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
                onClick={markAllAsRead}
              >
                <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                <span>Clear all</span>
              </Button>
            )}
          </div>

          <div className="flex items-center p-1 rounded-xl bg-muted/40 border border-muted/20">
            <button
              aria-pressed={activeFilter === "all"}
              className={cn(
                "flex-1 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200",
                activeFilter === "all" 
                  ? "bg-background text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
              onClick={() => setActiveFilter("all")}
            >
              All Notifications
              <span className={cn(
                "ml-2 px-1.5 py-0.5 rounded-md text-[10px]",
                activeFilter === "all" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {safeNotifications.length}
              </span>
            </button>
            <button
              aria-pressed={activeFilter === "unread"}
              className={cn(
                "flex-1 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200",
                activeFilter === "unread" 
                  ? "bg-background text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
              onClick={() => setActiveFilter("unread")}
            >
              Unread Only
              <span className={cn(
                "ml-2 px-1.5 py-0.5 rounded-md text-[10px]",
                activeFilter === "unread" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {unreadCount}
              </span>
            </button>
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
          <div className="flex h-88 flex-col items-center justify-center px-6 text-center">
            <div className="relative mb-6">
              {/* Background Glow */}
              <div className="absolute inset-0 blur-3xl opacity-20 bg-primary/40 rounded-full animate-pulse" />
              
              {/* Icon Container */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/10 shadow-inner">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/80 border border-muted/20 shadow-xs backdrop-blur-md">
                  <Inbox className="h-8 w-8 text-primary/70" />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-background animate-bounce" />
                <Sparkles className="absolute -bottom-2 -left-2 h-5 w-5 text-amber-400 opacity-60" />
              </div>
            </div>

            <div className="max-w-60 space-y-2.5">
              <h3 className="text-base font-bold tracking-tight text-foreground">
                {activeFilter === "unread" ? "No unread alerts" : "You're all caught up"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeFilter === "unread"
                  ? "No unread updates — nice work. Try checking All to see older items."
                  : "We'll notify you here when there are updates, messages, or important alerts."}
              </p>
            </div>

            <div className="mt-8">
              <Badge 
                variant="secondary" 
                className="px-4 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 text-primary border-primary/10 transition-colors duration-300 gap-2 font-semibold"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Stay tuned for updates
              </Badge>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[min(65vh,24rem)]">
            <div className="p-3 space-y-2">
              {filteredNotifications.map(renderNotificationItem)}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        <div className="border-t p-4 bg-muted/20">
          <Link href={messageCenterHref} className="block w-full" onClick={() => setIsOpen(false)}>
            <Button 
              variant="outline" 
              className="h-10 w-full justify-center text-xs font-bold bg-background hover:bg-primary hover:text-primary-foreground border-primary/10 shadow-xs transition-all duration-300 group/footer rounded-xl" 
              asChild
            >
              <span>
                View all activity
                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover/footer:translate-x-1" />
              </span>
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
