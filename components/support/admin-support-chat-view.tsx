"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Send,
  CheckCircle2,
  RotateCcw,
  Factory,
  Briefcase,
  User as UserIcon,
  ArrowLeft,
  LifeBuoy,
  Inbox,
  Mail,
  Paperclip,
  Sparkles,
  Clock,
  Timer,
  CircleDot,
  Building2,
  ChevronDown,
  PanelRight,
  CornerDownLeft,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getAdminCustomerSupportTickets,
  getAdminCustomerSupportTicketById,
  replyAdminCustomerSupportTicket,
  updateAdminCustomerSupportTicket,
  type CustomerSupportTicket,
  type CustomerSupportTicketDetail,
  type CustomerSupportTicketStatus,
  type CustomerSupportTicketPriority,
} from "@/lib/api/admin-customer-support-tickets"

type CustomerRole = "buyer" | "supplier" | "provider" | "unknown"

const ROLE_CONFIG: Record<CustomerRole, { label: string; icon: typeof UserIcon; ring: string; bg: string }> = {
  buyer: { label: "Buyer", icon: UserIcon, ring: "ring-primary/20", bg: "bg-primary/10 text-primary" },
  supplier: { label: "Supplier", icon: Factory, ring: "ring-secondary/20", bg: "bg-secondary/15 text-secondary" },
  provider: { label: "Service Provider", icon: Briefcase, ring: "ring-accent/20", bg: "bg-accent/15 text-accent" },
  unknown: { label: "User", icon: UserIcon, ring: "ring-primary/20", bg: "bg-primary/10 text-primary" },
}

const CANNED_REPLIES = [
  "Thanks for reaching out — I'm looking into this now.",
  "Could you share a bit more detail so I can help faster?",
  "I've escalated this to the relevant team and will update you shortly.",
  "Glad that's sorted! Let me know if there's anything else.",
]

const FILTERS: { key: CustomerSupportTicketStatus | "all" | "unresolved"; label: string }[] = [
  { key: "unresolved", label: "Active" },
  { key: "open", label: "Open" },
  { key: "waiting_on_customer", label: "Waiting" },
  { key: "resolved", label: "Resolved" },
  { key: "all", label: "All" },
]

export const STATUS_CONFIG: Record<CustomerSupportTicketStatus | "unknown", { label: string; pill: string; dot: string }> = {
  open: {
    label: "Open",
    pill: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    dot: "bg-amber-500",
  },
  "in_progress": {
    label: "In Progress",
    pill: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
    dot: "bg-sky-500",
  },
  "waiting_on_customer": {
    label: "Waiting on customer",
    pill: "bg-muted text-muted-foreground border-border",
    dot: "bg-foreground/40",
  },
  resolved: {
    label: "Resolved",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
    dot: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    pill: "bg-muted/60 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  unknown: {
    label: "Unknown",
    pill: "bg-muted text-muted-foreground border-border",
    dot: "bg-foreground/40",
  },
}

const PRIORITY_CONFIG: Record<CustomerSupportTicketPriority | "unknown", { label: string; cls: string }> = {
  urgent: { label: "Urgent", cls: "text-red-600 dark:text-red-400" },
  high: { label: "High", cls: "text-orange-600 dark:text-orange-400" },
  medium: { label: "Medium", cls: "text-blue-600 dark:text-blue-400" },
  low: { label: "Low", cls: "text-muted-foreground" },
  unknown: { label: "Normal", cls: "text-muted-foreground" },
}

function StatusPill({ status, className }: { status: CustomerSupportTicketStatus | "unknown"; className?: string }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.unknown
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        c.pill,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  )
}

function Avatar({ name, role, size = "md" }: { name: string; role: CustomerRole; size?: "sm" | "md" | "lg" }) {
  const r = ROLE_CONFIG[role] || ROLE_CONFIG.unknown
  const dim = size === "lg" ? "h-12 w-12 text-base" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-full font-semibold ring-2", dim, r.bg, r.ring)}>
      {name.split(" ").map((p) => p[0]).slice(0, 2).join("") || "U"}
    </div>
  )
}

function Kpi({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Inbox
  label: string
  value: string | number
  tone?: string
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2">
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", tone ?? "bg-muted text-muted-foreground")}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <p className="text-lg font-semibold text-foreground">{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export function relativeTime(iso: string) {
  const t = new Date(iso).getTime()
  const now = Date.now()
  const diff = now - t
  if (diff < 0) return "just now"
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function clockTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

export function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
}

interface AdminSupportChatViewProps {
  basePath: string
  initialTicketId?: string | null
}

export function AdminSupportChatView({ basePath, initialTicketId }: AdminSupportChatViewProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [conversations, setConversations] = useState<CustomerSupportTicket[]>([])
  const [filter, setFilter] = useState<CustomerSupportTicketStatus | "all" | "unresolved">("unresolved")
  const [search, setSearch] = useState("")
  const [activeId, setActiveId] = useState<number | null>(initialTicketId ? Number(initialTicketId) : null)
  const [active, setActive] = useState<CustomerSupportTicketDetail | null>(null)
  
  const [reply, setReply] = useState("")
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)
  const [showContext, setShowContext] = useState(true)

  const [isLoadingList, setIsLoadingList] = useState(true)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [isReplying, setIsReplying] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchConversations = async () => {
    const res = await getAdminCustomerSupportTickets(1, 100)
    if (res.success) {
      setConversations(res.data)
      if (!activeId && res.data.length > 0 && typeof window !== 'undefined' && window.innerWidth >= 1024) {
        // setActiveId(res.data[0].id)
      }
    } else {
      toast({ title: "Failed to load conversations", variant: "destructive" })
    }
    setIsLoadingList(false)
  }

  useEffect(() => {
    fetchConversations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let mounted = true
    const fetchDetail = async () => {
      if (!activeId) {
        setActive(null)
        return
      }
      setIsLoadingDetail(true)
      const res = await getAdminCustomerSupportTicketById(activeId)
      if (!mounted) return
      
      if (res.success && res.data) {
        setActive(res.data)
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      } else {
        toast({ title: "Failed to load conversation", variant: "destructive" })
        setActive(null)
      }
      setIsLoadingDetail(false)
    }
    fetchDetail()
    return () => { mounted = false }
  }, [activeId, toast])

  const stats = useMemo(() => {
    const open = conversations.filter((c) => c.status === "open").length
    const waiting = conversations.filter((c) => c.status === "waiting_on_customer").length
    const resolved = conversations.filter((c) => c.status === "resolved").length
    // We do not have messages in the list view, so we cannot accurately compute first response ms
    return { open, waiting, resolved, avg: null }
  }, [conversations])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: conversations.length, unresolved: 0 }
    for (const conv of conversations) {
      c[conv.status] = (c[conv.status] ?? 0) + 1
      if (conv.status !== "resolved" && conv.status !== "closed") c.unresolved += 1
    }
    return c
  }, [conversations])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return conversations
      .filter((conv) => {
        if (filter === "all") return true
        if (filter === "unresolved") return conv.status !== "resolved" && conv.status !== "closed"
        return conv.status === filter
      })
      .filter((conv) => {
        if (!q) return true
        const cName = conv.user?.fullName || "Unknown"
        const cEmail = conv.user?.email || ""
        return (
          cName.toLowerCase().includes(q) ||
          cEmail.toLowerCase().includes(q) ||
          conv.subject.toLowerCase().includes(q) ||
          String(conv.id).includes(q)
        )
      })
      .sort((a, b) => {
        const la = a.updatedAt || a.createdAt || ""
        const lb = b.updatedAt || b.createdAt || ""
        return new Date(lb).getTime() - new Date(la).getTime()
      })
  }, [conversations, filter, search])

  const openConversation = (id: number) => {
    setActiveId(id)
    setMobileThreadOpen(true)
    router.push(`${basePath}/${id}`, { scroll: false })
  }

  const sendReply = async () => {
    if (!active || !reply.trim()) return
    setIsReplying(true)
    const res = await replyAdminCustomerSupportTicket(active.id, { message: reply.trim() })
    setIsReplying(false)
    if (res.success && res.data) {
      setActive(res.data)
      setReply("")
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else {
      toast({ title: "Failed to send reply", variant: "destructive" })
    }
  }

  const updateStatus = async (id: number, status: CustomerSupportTicketStatus) => {
    if (!active) return
    const res = await updateAdminCustomerSupportTicket(id, {
      status,
      priority: active.priority,
      departmentType: active.departmentType,
      assignTo: active.assignedTo
    })
    if (res.success && res.data) {
      setActive(res.data)
      setConversations(conversations.map(c => c.id === id ? { ...c, status: res.data!.status } : c))
      toast({ title: "Status updated" })
    } else {
      toast({ title: "Failed to update status", variant: "destructive" })
    }
  }

  const updatePriority = async (id: number, priority: CustomerSupportTicketPriority) => {
    if (!active) return
    const res = await updateAdminCustomerSupportTicket(id, {
      status: active.status,
      priority,
      departmentType: active.departmentType,
      assignTo: active.assignedTo
    })
    if (res.success && res.data) {
      setActive(res.data)
      setConversations(conversations.map(c => c.id === id ? { ...c, priority: res.data!.priority } : c))
      toast({ title: "Priority updated" })
    } else {
      toast({ title: "Failed to update priority", variant: "destructive" })
    }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-4">
      {/* Header + live KPIs */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium text-foreground">Support Center</h1>
            <p className="text-sm text-muted-foreground">Every customer message, handled in one calm inbox.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Kpi icon={Inbox} label="Open" value={stats.open} tone="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300" />
          <Kpi icon={Clock} label="Awaiting reply" value={stats.waiting} tone="bg-muted text-muted-foreground" />
          <Kpi icon={CheckCircle2} label="Resolved" value={stats.resolved} tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300" />
          <Kpi icon={Timer} label="Avg. first reply" value={"—"} tone="bg-secondary/15 text-secondary" />
        </div>
      </div>

      {/* Panes */}
      <div
        className={cn(
          "grid min-h-0 flex-1 gap-4 grid-cols-1 lg:grid-cols-[340px_1fr]",
          showContext ? "xl:grid-cols-[340px_1fr_300px]" : "xl:grid-cols-[340px_1fr]",
        )}
      >
        {/* ---- Conversation list ---- */}
        <div
          className={cn(
            "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card",
            mobileThreadOpen && "hidden lg:flex",
          )}
        >
          <div className="space-y-3 border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search conversations"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as any)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    filter === f.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70",
                  )}
                >
                  {f.label}
                  {counts[f.key] ? (
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[10px] tabular-nums",
                        filter === f.key ? "bg-primary-foreground/20" : "bg-background/60",
                      )}
                    >
                      {counts[f.key]}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {isLoadingList ? (
              <div className="flex h-full items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
                <Inbox className="h-8 w-8 opacity-40" />
                No conversations in this view.
              </div>
            ) : (
              filtered.map((conv) => {
                const isActive = conv.id === activeId
                const cName = conv.user?.fullName || "Unknown"
                const cRole = (conv.user?.role || "unknown") as CustomerRole
                return (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv.id)}
                    className={cn(
                      "relative flex w-full gap-3 border-b border-border px-3 py-3 text-left transition-colors hover:bg-muted/40",
                      isActive && "bg-muted/60",
                    )}
                  >
                    {isActive && <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
                    <div className="relative">
                      <Avatar name={cName} role={cRole} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-sm text-foreground",
                            "font-medium",
                          )}
                        >
                          {cName}
                        </span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {conv.updatedAt ? relativeTime(conv.updatedAt) : conv.createdAt ? relativeTime(conv.createdAt) : ""}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "truncate text-xs text-muted-foreground",
                        )}
                      >
                        {conv.subject}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <StatusPill status={conv.status} />
                        {(conv.priority === "urgent" || conv.priority === "high") && (
                          <span className={cn("flex items-center gap-0.5 text-[11px] font-medium", PRIORITY_CONFIG[conv.priority]?.cls || "")}>
                            <CircleDot className="h-3 w-3" />
                            {PRIORITY_CONFIG[conv.priority]?.label || ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ---- Conversation thread ---- */}
        <div
          className={cn(
            "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card",
            !mobileThreadOpen && "hidden lg:flex",
          )}
        >
          {isLoadingDetail ? (
            <div className="flex h-full flex-col items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground opacity-50" />
            </div>
          ) : !active ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <LifeBuoy className="h-10 w-10 opacity-40" />
              Select a conversation to get started.
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setMobileThreadOpen(false)}
                    aria-label="Back to list"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar name={active.user?.fullName || "Unknown"} role={(active.user?.role || "unknown") as CustomerRole} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-foreground">{active.user?.fullName || "Unknown"}</span>
                      <StatusPill status={active.status} className="hidden sm:inline-flex" />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {active.subject} · {active.id}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {active.status === "resolved" || active.status === "closed" ? (
                    <Button size="sm" className="gap-1.5" onClick={() => updateStatus(active.id, "open")}>
                      <RotateCcw className="h-4 w-4" />
                      Reopen
                    </Button>
                  ) : (
                    <Button size="sm" className="gap-1.5" onClick={() => updateStatus(active.id, "resolved")}>
                      <CheckCircle2 className="h-4 w-4" />
                      Resolve
                    </Button>
                  )}
                  <Select value={active.status} onValueChange={(v) => updateStatus(active.id, v as CustomerSupportTicketStatus)}>
                    <SelectTrigger className="h-8 w-[44px] px-2 [&>svg:last-child]:hidden" aria-label="Change status">
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="waiting_on_customer">Waiting on customer</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden h-8 w-8 xl:inline-flex"
                    onClick={() => setShowContext((s) => !s)}
                    aria-label="Toggle customer details"
                  >
                    <PanelRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="min-h-0 flex-1 space-y-1 overflow-y-auto bg-muted/20 px-4 py-5">
                {/* Initial ticket as a message if no messages exist or we just want to display the subject */}
                {active.messages.map((m, i) => {
                  const isAgent = m.userId !== active.user?.id
                  const prev = active.messages[i - 1]
                  const showDay = !prev || (m.createdAt && prev.createdAt && dayLabel(prev.createdAt) !== dayLabel(m.createdAt))
                  return (
                    <div key={m.id}>
                      {showDay && m.createdAt && (
                        <div className="my-4 flex items-center gap-3">
                          <span className="h-px flex-1 bg-border" />
                          <span className="text-[11px] font-medium text-muted-foreground">{dayLabel(m.createdAt)}</span>
                          <span className="h-px flex-1 bg-border" />
                        </div>
                      )}
                      <div className={cn("flex items-end gap-2", isAgent ? "justify-end" : "justify-start")}>
                        {!isAgent && <Avatar name={active.user?.fullName || "Unknown"} role={(active.user?.role || "unknown") as CustomerRole} size="sm" />}
                        <div className={cn("max-w-[78%]", isAgent && "text-right")}>
                          <div
                            className={cn(
                              "inline-block rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed shadow-sm",
                              isAgent
                                ? "rounded-br-md bg-primary text-primary-foreground"
                                : "rounded-bl-md border border-border bg-card text-foreground",
                            )}
                          >
                            <div className="whitespace-pre-wrap">{m.message}</div>
                          </div>
                          <div
                            className={cn(
                              "mt-1 flex items-center gap-1 px-1 text-[11px] text-muted-foreground",
                              isAgent && "justify-end",
                            )}
                          >
                            <span>{isAgent ? "You" : (active.user?.fullName || "Customer")}</span>
                            <span>·</span>
                            <span>{m.createdAt ? clockTime(m.createdAt) : ""}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="border-t border-border p-3">
                {active.status === "closed" ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      This conversation is closed.
                    </span>
                    <Button size="sm" variant="outline" className="gap-1.5 bg-transparent" onClick={() => updateStatus(active.id, "open")}>
                      <RotateCcw className="h-4 w-4" />
                      Reopen to reply
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-ring">
                    <div className="flex flex-wrap gap-1.5 border-b border-border px-2 py-2">
                      <span className="mr-1 inline-flex items-center gap-1 px-1 text-[11px] font-medium text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        Quick replies
                      </span>
                      {CANNED_REPLIES.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => setReply((prevReply) => (prevReply ? `${prevReply} ${r}` : r))}
                          className="max-w-[200px] truncate rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title={r}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder={`Reply to ${active.user?.fullName || "Customer"}…`}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault()
                          sendReply()
                        }
                      }}
                      className="min-h-[60px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                      rows={2}
                    />
                    <div className="flex items-center justify-between gap-2 px-2 pb-2">
                      <div className="w-8"></div>
                      <div className="flex items-center gap-2">
                        <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">
                          <CornerDownLeft className="h-3 w-3" />
                          ⌘ + Enter to send
                        </span>
                        <Button onClick={sendReply} disabled={!reply.trim() || isReplying} size="sm" className="gap-1.5">
                          {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ---- Customer context panel ---- */}
        {active && showContext && (
          <div className="hidden min-h-0 flex-col gap-4 overflow-y-auto rounded-xl border border-border bg-card p-4 xl:flex">
            <div className="flex flex-col items-center gap-2 border-b border-border pb-4 text-center">
              <Avatar name={active.user?.fullName || "Unknown"} role={(active.user?.role || "unknown") as CustomerRole} size="lg" />
              <div>
                <p className="font-semibold text-foreground">{active.user?.fullName || "Unknown"}</p>
              </div>
              {(() => {
                const roleType = (active.user?.role || "unknown") as CustomerRole
                const rConf = ROLE_CONFIG[roleType] || ROLE_CONFIG.unknown
                const RoleIcon = rConf.icon
                return (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    <RoleIcon className="h-3 w-3" />
                    {rConf.label}
                  </span>
                )
              })()}
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
              <DetailRow icon={Mail} label="Email" value={active.user?.email || "N/A"} />
              <DetailRow icon={Building2} label="Department" value={active.departmentType} />
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Conversation</p>
              <DetailRow icon={LifeBuoy} label="Ticket" value={String(active.id)} />
              <DetailRow icon={Clock} label="Opened" value={active.createdAt ? relativeTime(active.createdAt) + " ago" : "N/A"} />
              <DetailRow icon={Timer} label="First reply" value={"Pending"} />
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleDot className="h-4 w-4" />
                  Priority
                </span>
                <Select value={active.priority} onValueChange={(v) => updatePriority(active.id, v as CustomerSupportTicketPriority)}>
                  <SelectTrigger className="h-7 w-[110px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-auto space-y-2 border-t border-border pt-4">
              {active.status !== "closed" && (
                <Button
                  variant="outline"
                  className="w-full justify-center gap-1.5 bg-transparent"
                  onClick={() => updateStatus(active.id, "closed")}
                >
                  <Mail className="h-4 w-4" />
                  Close conversation
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="min-w-0 truncate text-right font-medium text-foreground">{value}</span>
    </div>
  )
}
