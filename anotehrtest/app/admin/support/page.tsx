"use client"

import { useMemo, useState } from "react"
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
} from "lucide-react"
import {
  useSupport,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  relativeTime,
  clockTime,
  dayLabel,
  formatDuration,
  firstResponseMs,
  initials,
  type SupportStatus,
  type CustomerRole,
  type Priority,
} from "@/lib/support-context"

const ROLE_CONFIG: Record<CustomerRole, { label: string; icon: typeof UserIcon; ring: string; bg: string }> = {
  buyer: { label: "Buyer", icon: UserIcon, ring: "ring-primary/20", bg: "bg-primary/10 text-primary" },
  supplier: { label: "Supplier", icon: Factory, ring: "ring-secondary/20", bg: "bg-secondary/15 text-secondary" },
  provider: { label: "Service Provider", icon: Briefcase, ring: "ring-accent/20", bg: "bg-accent/15 text-accent" },
}

const CANNED_REPLIES = [
  "Thanks for reaching out — I'm looking into this now.",
  "Could you share a bit more detail so I can help faster?",
  "I've escalated this to the relevant team and will update you shortly.",
  "Glad that's sorted! Let me know if there's anything else.",
]

const FILTERS: { key: SupportStatus | "all" | "unresolved"; label: string }[] = [
  { key: "unresolved", label: "Active" },
  { key: "open", label: "Open" },
  { key: "waiting-customer", label: "Waiting" },
  { key: "resolved", label: "Resolved" },
  { key: "all", label: "All" },
]

function StatusPill({ status, className }: { status: SupportStatus; className?: string }) {
  const c = STATUS_CONFIG[status]
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
  const r = ROLE_CONFIG[role]
  const dim = size === "lg" ? "h-12 w-12 text-base" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-full font-semibold ring-2", dim, r.bg, r.ring)}>
      {initials(name)}
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

export default function AdminSupportPage() {
  const { conversations, sendAgentMessage, updateStatus, updatePriority, markReadByAgent } = useSupport()
  const [filter, setFilter] = useState<SupportStatus | "all" | "unresolved">("unresolved")
  const [search, setSearch] = useState("")
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null)
  const [reply, setReply] = useState("")
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)
  const [showContext, setShowContext] = useState(true)

  const stats = useMemo(() => {
    const open = conversations.filter((c) => c.status === "open").length
    const waiting = conversations.filter((c) => c.status === "waiting-customer").length
    const resolved = conversations.filter((c) => c.status === "resolved").length
    const responses = conversations.map(firstResponseMs).filter((v): v is number => v !== null)
    const avg = responses.length ? responses.reduce((a, b) => a + b, 0) / responses.length : null
    return { open, waiting, resolved, avg }
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
        return (
          conv.customerName.toLowerCase().includes(q) ||
          conv.company.toLowerCase().includes(q) ||
          conv.subject.toLowerCase().includes(q) ||
          conv.id.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        const la = a.messages[a.messages.length - 1]?.at ?? a.createdAt
        const lb = b.messages[b.messages.length - 1]?.at ?? b.createdAt
        return new Date(lb).getTime() - new Date(la).getTime()
      })
  }, [conversations, filter, search])

  const active = conversations.find((c) => c.id === activeId) ?? null

  const openConversation = (id: string) => {
    setActiveId(id)
    setMobileThreadOpen(true)
    markReadByAgent(id)
  }

  const sendReply = () => {
    if (!active || !reply.trim()) return
    sendAgentMessage(active.id, reply.trim())
    setReply("")
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
          <Kpi icon={Timer} label="Avg. first reply" value={stats.avg ? formatDuration(stats.avg) : "—"} tone="bg-secondary/15 text-secondary" />
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
                  onClick={() => setFilter(f.key)}
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
            {filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
                <Inbox className="h-8 w-8 opacity-40" />
                No conversations in this view.
              </div>
            ) : (
              filtered.map((conv) => {
                const last = conv.messages[conv.messages.length - 1]
                const isActive = conv.id === active?.id
                const preview = last ? `${last.from === "agent" ? "You: " : ""}${last.text}` : ""
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
                      <Avatar name={conv.customerName} role={conv.role} />
                      {conv.unread && (
                        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "truncate text-sm text-foreground",
                            conv.unread ? "font-semibold" : "font-medium",
                          )}
                        >
                          {conv.customerName}
                        </span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {last ? relativeTime(last.at) : ""}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "truncate text-xs",
                          conv.unread ? "font-medium text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {conv.subject}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{preview}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <StatusPill status={conv.status} />
                        {(conv.priority === "urgent" || conv.priority === "high") && (
                          <span className={cn("flex items-center gap-0.5 text-[11px] font-medium", PRIORITY_CONFIG[conv.priority].cls)}>
                            <CircleDot className="h-3 w-3" />
                            {PRIORITY_CONFIG[conv.priority].label}
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
          {!active ? (
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
                  <Avatar name={active.customerName} role={active.role} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-foreground">{active.customerName}</span>
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
                  <Select value={active.status} onValueChange={(v) => updateStatus(active.id, v as SupportStatus)}>
                    <SelectTrigger className="h-8 w-[44px] px-2 [&>svg:last-child]:hidden" aria-label="Change status">
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="waiting-customer">Waiting on customer</SelectItem>
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
                {active.messages.map((m, i) => {
                  const isAgent = m.from === "agent"
                  const prev = active.messages[i - 1]
                  const showDay = !prev || dayLabel(prev.at) !== dayLabel(m.at)
                  return (
                    <div key={m.id}>
                      {showDay && (
                        <div className="my-4 flex items-center gap-3">
                          <span className="h-px flex-1 bg-border" />
                          <span className="text-[11px] font-medium text-muted-foreground">{dayLabel(m.at)}</span>
                          <span className="h-px flex-1 bg-border" />
                        </div>
                      )}
                      <div className={cn("flex items-end gap-2", isAgent ? "justify-end" : "justify-start")}>
                        {!isAgent && <Avatar name={active.customerName} role={active.role} size="sm" />}
                        <div className={cn("max-w-[78%]", isAgent && "text-right")}>
                          <div
                            className={cn(
                              "inline-block rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed shadow-sm",
                              isAgent
                                ? "rounded-br-md bg-primary text-primary-foreground"
                                : "rounded-bl-md border border-border bg-card text-foreground",
                            )}
                          >
                            {m.text}
                          </div>
                          <div
                            className={cn(
                              "mt-1 flex items-center gap-1 px-1 text-[11px] text-muted-foreground",
                              isAgent && "justify-end",
                            )}
                          >
                            <span>{isAgent ? "You" : m.authorName}</span>
                            <span>·</span>
                            <span>{clockTime(m.at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
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
                      placeholder={`Reply to ${active.customerName}…`}
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
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Attach file">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">
                          <CornerDownLeft className="h-3 w-3" />
                          ⌘ + Enter to send
                        </span>
                        <Button onClick={sendReply} disabled={!reply.trim()} size="sm" className="gap-1.5">
                          <Send className="h-4 w-4" />
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
              <Avatar name={active.customerName} role={active.role} size="lg" />
              <div>
                <p className="font-semibold text-foreground">{active.customerName}</p>
                <p className="text-sm text-muted-foreground">{active.company}</p>
              </div>
              {(() => {
                const RoleIcon = ROLE_CONFIG[active.role].icon
                return (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    <RoleIcon className="h-3 w-3" />
                    {ROLE_CONFIG[active.role].label}
                  </span>
                )
              })()}
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
              <DetailRow icon={Mail} label="Email" value={active.email} />
              <DetailRow icon={Building2} label="Company" value={active.company} />
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Conversation</p>
              <DetailRow icon={LifeBuoy} label="Ticket" value={active.id} />
              <DetailRow icon={Clock} label="Opened" value={relativeTime(active.createdAt) + " ago"} />
              {(() => {
                const fr = firstResponseMs(active)
                return <DetailRow icon={Timer} label="First reply" value={fr ? formatDuration(fr) : "Pending"} />
              })()}
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleDot className="h-4 w-4" />
                  Priority
                </span>
                <Select value={active.priority} onValueChange={(v) => updatePriority(active.id, v as Priority)}>
                  <SelectTrigger className="h-7 w-[110px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
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
