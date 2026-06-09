"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  createCustomerSupportTicket,
  getMyCustomerSupportTickets,
  getMyCustomerSupportTicketById,
  replyCustomerSupportTicket,
  type CustomerTicket,
  type CustomerTicketDetail,
  type CustomerTicketStatus,
} from "@/lib/api/customer-support-tickets"
import {
  LifeBuoy,
  Send,
  Plus,
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  CornerDownLeft,
  Headset,
  ShieldCheck,
  Clock,
  Sparkles,
  Loader2
} from "lucide-react"

const TOPICS = [
  "Orders & delivery",
  "Payments & payouts",
  "Account & profile",
  "Technical issue",
  "Something else",
]

function getDepartmentForTopic(topic: string) {
  if (topic === "Orders & delivery") return "sales"
  if (topic === "Payments & payouts") return "billing"
  if (topic === "Technical issue") return "technical"
  return "general"
}

/* ----------------------------- Shared UI config ----------------------------- */

export const STATUS_CONFIG: Record<
  CustomerTicketStatus | "unknown",
  { label: string; short: string; pill: string; dot: string; solid: string }
> = {
  open: {
    label: "Open",
    short: "Open",
    pill: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    dot: "bg-amber-500",
    solid: "bg-amber-500",
  },
  "in_progress": {
    label: "In Progress",
    short: "Active",
    pill: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
    dot: "bg-sky-500",
    solid: "bg-sky-500",
  },
  "waiting_on_customer": {
    label: "Waiting on customer",
    short: "Waiting",
    pill: "bg-muted text-muted-foreground border-border",
    dot: "bg-foreground/40",
    solid: "bg-foreground/40",
  },
  resolved: {
    label: "Resolved",
    short: "Resolved",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
    dot: "bg-emerald-500",
    solid: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    short: "Closed",
    pill: "bg-muted/60 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
    solid: "bg-muted-foreground",
  },
  unknown: {
    label: "Unknown",
    short: "Unknown",
    pill: "bg-muted text-muted-foreground border-border",
    dot: "bg-foreground/40",
    solid: "bg-foreground/40",
  },
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

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
}

function StatusPill({ status, className }: { status: CustomerTicketStatus | "unknown"; className?: string }) {
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

interface CustomerSupportChatViewProps {
  title: string
  basePath: string
}

export function CustomerSupportChatView({ title, basePath }: CustomerSupportChatViewProps) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [tickets, setTickets] = useState<CustomerTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [activeId, setActiveId] = useState<number | null>(null)
  const [activeDetail, setActiveDetail] = useState<CustomerTicketDetail | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const [composing, setComposing] = useState(false)
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)

  const [reply, setReply] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  // New conversation form
  const [topic, setTopic] = useState(TOPICS[0])
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const fullName = user ? `${user.firstName} ${user.lastName}` : "You"

  const loadTickets = async () => {
    setIsLoading(true)
    const response = await getMyCustomerSupportTickets(1, 50)
    if (response.success) {
      setTickets(response.data)
      if (response.data.length === 0 && !activeId) {
        setComposing(true)
      }
    } else {
      toast({
        title: "Failed to load support tickets",
        description: response.message || "Please refresh and try again.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openConversation = async (id: number) => {
    setActiveId(id)
    setComposing(false)
    setMobileThreadOpen(true)
    setIsLoadingDetail(true)
    const response = await getMyCustomerSupportTicketById(id)
    if (response.success && response.data) {
      setActiveDetail(response.data)
    } else {
      toast({ title: "Failed to load ticket details", variant: "destructive" })
    }
    setIsLoadingDetail(false)
  }

  const startNew = () => {
    setComposing(true)
    setMobileThreadOpen(true)
    setActiveId(null)
    setActiveDetail(null)
  }

  const submitNew = async () => {
    if (!body.trim()) return
    setIsCreating(true)
    const response = await createCustomerSupportTicket({
      subject: subject.trim() || topic,
      departmentType: getDepartmentForTopic(topic),
      message: body.trim(),
      priority: "medium", // default priority, backend will handle
    })
    setIsCreating(false)

    if (response.success && response.data) {
      toast({ title: "Ticket created successfully" })
      setSubject("")
      setBody("")
      setTopic(TOPICS[0])
      setComposing(false)
      loadTickets()
      openConversation(response.data.id)
    } else {
      toast({
        title: "Failed to create ticket",
        description: response.message || "Please try again.",
        variant: "destructive",
      })
    }
  }

  const sendReply = async () => {
    if (!activeId || !reply.trim()) return
    setIsReplying(true)
    const response = await replyCustomerSupportTicket(activeId, {
      message: reply.trim(),
    })
    setIsReplying(false)

    if (response.success && response.data) {
      setActiveDetail(response.data)
      setReply("")
    } else {
      toast({ title: "Failed to send reply", variant: "destructive" })
    }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Headset className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium text-foreground">Support</h1>
            <p className="text-sm text-muted-foreground">Get help from the SourceNest team.</p>
          </div>
        </div>
        <Button onClick={startNew} className="gap-1.5 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          New conversation
        </Button>
      </div>

      {/* Panes */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        {/* ---- Conversation list ---- */}
        <div
          className={cn(
            "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card",
            mobileThreadOpen && "hidden lg:flex",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold text-foreground">Your conversations</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground tabular-nums">
              {tickets.length}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex h-full items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
                <MessageSquare className="h-8 w-8 opacity-40" />
                No conversations yet.
                <Button variant="outline" size="sm" className="mt-1 gap-1.5 bg-transparent" onClick={startNew}>
                  <Plus className="h-4 w-4" />
                  Start one
                </Button>
              </div>
            ) : (
              tickets.map((conv) => {
                const isActive = conv.id === activeId && !composing
                
                // We don't have the last message in the generic list API, but we can display the updated time
                const preview = ""

                return (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv.id)}
                    className={cn(
                      "relative flex w-full flex-col gap-1.5 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/40",
                      isActive && "bg-muted/60",
                    )}
                  >
                    {isActive && <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-sm text-foreground font-medium",
                        )}
                      >
                        {conv.subject}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">
                          {conv.updatedAt ? relativeTime(conv.updatedAt) : ""}
                        </span>
                      </span>
                    </div>
                    <p
                      className={cn(
                        "truncate text-xs text-muted-foreground",
                      )}
                    >
                      {preview}
                    </p>
                    <div className="flex items-center gap-2">
                      <StatusPill status={conv.status} />
                      <span className="text-[11px] text-muted-foreground">#{conv.id}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Reassurance footer */}
          <div className="flex items-center gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            Avg. first reply under an hour
          </div>
        </div>

        {/* ---- Thread / Composer ---- */}
        <div
          className={cn(
            "flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card",
            !mobileThreadOpen && "hidden lg:flex",
          )}
        >
          {composing ? (
            <NewConversationForm
              topic={topic}
              setTopic={setTopic}
              subject={subject}
              setSubject={setSubject}
              body={body}
              setBody={setBody}
              onSubmit={submitNew}
              onBack={() => {
                setMobileThreadOpen(false)
                if (tickets.length) setComposing(false)
              }}
              canSubmit={!!body.trim()}
              isCreating={isCreating}
            />
          ) : !activeId ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground">
              <LifeBuoy className="h-10 w-10 opacity-40" />
              Select a conversation, or start a new one.
              <Button onClick={startNew} className="gap-1.5">
                <Plus className="h-4 w-4" />
                New conversation
              </Button>
            </div>
          ) : isLoadingDetail ? (
            <div className="flex h-full flex-col items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground opacity-50" />
            </div>
          ) : activeDetail ? (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMobileThreadOpen(false)}
                  aria-label="Back to list"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Headset className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{activeDetail.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    SourceNest Support · #{activeDetail.id}
                  </p>
                </div>
                <StatusPill status={activeDetail.status} className="hidden sm:inline-flex" />
              </div>

              {/* Messages */}
              <div className="min-h-0 flex-1 space-y-1 overflow-y-auto bg-muted/20 px-4 py-5">
                {activeDetail.status === "resolved" && (
                  <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Support marked this resolved — reply to reopen
                  </div>
                )}
                {activeDetail.messages.map((m, i) => {
                  const isCustomer = user?.id ? m.userId?.toString() === user.id.toString() : true
                  const prev = activeDetail.messages[i - 1]
                  const showDay =
                    !prev ||
                    (m.createdAt && prev.createdAt && dayLabel(prev.createdAt) !== dayLabel(m.createdAt))
                  return (
                    <div key={m.id}>
                      {showDay && m.createdAt && (
                        <div className="my-4 flex items-center gap-3">
                          <span className="h-px flex-1 bg-border" />
                          <span className="text-[11px] font-medium text-muted-foreground">{dayLabel(m.createdAt)}</span>
                          <span className="h-px flex-1 bg-border" />
                        </div>
                      )}
                      <div className={cn("flex items-end gap-2", isCustomer ? "justify-end" : "justify-start")}>
                        {!isCustomer && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Headset className="h-4 w-4" />
                          </div>
                        )}
                        <div className={cn("max-w-[80%]", isCustomer && "text-right")}>
                          <div
                            className={cn(
                              "inline-block rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed shadow-sm",
                              isCustomer
                                ? "rounded-br-md bg-primary text-primary-foreground"
                                : "rounded-bl-md border border-border bg-card text-foreground",
                            )}
                          >
                            <div className="whitespace-pre-wrap">{m.message}</div>
                          </div>
                          <div
                            className={cn(
                              "mt-1 flex items-center gap-1 px-1 text-[11px] text-muted-foreground",
                              isCustomer && "justify-end",
                            )}
                          >
                            <span>{isCustomer ? "You" : "SourceNest Support"}</span>
                            <span>·</span>
                            <span>{m.createdAt ? clockTime(m.createdAt) : ""}</span>
                          </div>
                        </div>
                        {isCustomer && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-semibold text-secondary">
                            {initials(fullName)}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Composer */}
              <div className="border-t border-border p-3">
                <div className="rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-ring">
                  <Textarea
                    placeholder="Write a message to support…"
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
                    <span className="hidden items-center gap-1 px-1 text-[11px] text-muted-foreground sm:flex">
                      <CornerDownLeft className="h-3 w-3" />
                      ⌘ + Enter to send
                    </span>
                    <Button onClick={sendReply} disabled={!reply.trim() || isReplying} size="sm" className="ml-auto gap-1.5">
                      {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function NewConversationForm({
  topic,
  setTopic,
  subject,
  setSubject,
  body,
  setBody,
  onSubmit,
  onBack,
  canSubmit,
  isCreating,
}: {
  topic: string
  setTopic: (v: string) => void
  subject: string
  setSubject: (v: string) => void
  body: string
  setBody: (v: string) => void
  onSubmit: () => void
  onBack: () => void
  canSubmit: boolean
  isCreating: boolean
}) {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack} aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-foreground">New conversation</p>
          <p className="text-xs text-muted-foreground">Tell us what you need help with.</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto max-w-xl space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Topic</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    topic === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="support-subject" className="text-sm font-medium text-foreground">
              Subject <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="support-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="support-body" className="text-sm font-medium text-foreground">
              How can we help?
            </label>
            <Textarea
              id="support-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe your question or issue in detail…"
              className="min-h-[160px] resize-none"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 text-secondary" />
            Our support team typically replies within an hour during business hours.
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border p-3">
        <Button onClick={onSubmit} disabled={!canSubmit || isCreating} className="gap-1.5">
          {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send to support
        </Button>
      </div>
    </>
  )
}
