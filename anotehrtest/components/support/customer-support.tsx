"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import {
  useSupport,
  toCustomerRole,
  STATUS_CONFIG,
  relativeTime,
  clockTime,
  dayLabel,
  initials,
  type SupportConversation,
} from "@/lib/support-context"
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
} from "lucide-react"

const TOPICS = [
  "Orders & delivery",
  "Payments & payouts",
  "Account & profile",
  "Technical issue",
  "Something else",
]

function StatusPill({ status, className }: { status: SupportConversation["status"]; className?: string }) {
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

export function CustomerSupport() {
  const { user } = useAuth()
  const {
    getConversationsForCustomer,
    createConversation,
    sendCustomerMessage,
    markReadByCustomer,
  } = useSupport()

  const email = user?.email ?? ""
  const fullName = user ? `${user.firstName} ${user.lastName}` : "You"
  const role = toCustomerRole(user?.role ?? "buyer")

  const conversations = getConversationsForCustomer(email)

  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null)
  const [composing, setComposing] = useState(conversations.length === 0)
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)
  const [reply, setReply] = useState("")

  // New conversation form
  const [topic, setTopic] = useState(TOPICS[0])
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  )

  const openConversation = (id: string) => {
    setActiveId(id)
    setComposing(false)
    setMobileThreadOpen(true)
    markReadByCustomer(id)
  }

  const startNew = () => {
    setComposing(true)
    setMobileThreadOpen(true)
    setActiveId(null)
  }

  const submitNew = () => {
    if (!body.trim()) return
    const conv = createConversation({
      customerName: fullName,
      company: user?.company ?? "",
      role,
      email,
      subject: subject.trim() || topic,
      message: body.trim(),
    })
    setSubject("")
    setBody("")
    setTopic(TOPICS[0])
    setComposing(false)
    setActiveId(conv.id)
  }

  const sendReply = () => {
    if (!active || !reply.trim()) return
    sendCustomerMessage(active.id, fullName, reply.trim())
    setReply("")
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
              {conversations.length}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
                <MessageSquare className="h-8 w-8 opacity-40" />
                No conversations yet.
                <Button variant="outline" size="sm" className="mt-1 gap-1.5 bg-transparent" onClick={startNew}>
                  <Plus className="h-4 w-4" />
                  Start one
                </Button>
              </div>
            ) : (
              conversations.map((conv) => {
                const last = conv.messages[conv.messages.length - 1]
                const isActive = conv.id === active?.id && !composing
                const preview = last ? `${last.from === "agent" ? "Support: " : "You: "}${last.text}` : ""
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
                          "truncate text-sm text-foreground",
                          conv.unreadForCustomer ? "font-semibold" : "font-medium",
                        )}
                      >
                        {conv.subject}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        {conv.unreadForCustomer && <span className="h-2 w-2 rounded-full bg-primary" />}
                        <span className="text-[11px] text-muted-foreground">{last ? relativeTime(last.at) : ""}</span>
                      </span>
                    </div>
                    <p
                      className={cn(
                        "truncate text-xs",
                        conv.unreadForCustomer ? "font-medium text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {preview}
                    </p>
                    <div className="flex items-center gap-2">
                      <StatusPill status={conv.status} />
                      <span className="text-[11px] text-muted-foreground">{conv.id}</span>
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
                if (conversations.length) setComposing(false)
              }}
              canSubmit={!!body.trim()}
            />
          ) : !active ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground">
              <LifeBuoy className="h-10 w-10 opacity-40" />
              Select a conversation, or start a new one.
              <Button onClick={startNew} className="gap-1.5">
                <Plus className="h-4 w-4" />
                New conversation
              </Button>
            </div>
          ) : (
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
                  <p className="truncate font-semibold text-foreground">{active.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    SourceNest Support · {active.id}
                  </p>
                </div>
                <StatusPill status={active.status} className="hidden sm:inline-flex" />
              </div>

              {/* Messages */}
              <div className="min-h-0 flex-1 space-y-1 overflow-y-auto bg-muted/20 px-4 py-5">
                {active.status === "resolved" && (
                  <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Support marked this resolved — reply to reopen
                  </div>
                )}
                {active.messages.map((m, i) => {
                  const isCustomer = m.from === "customer"
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
                            {m.text}
                          </div>
                          <div
                            className={cn(
                              "mt-1 flex items-center gap-1 px-1 text-[11px] text-muted-foreground",
                              isCustomer && "justify-end",
                            )}
                          >
                            <span>{isCustomer ? "You" : "SourceNest Support"}</span>
                            <span>·</span>
                            <span>{clockTime(m.at)}</span>
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
                    <Button onClick={sendReply} disabled={!reply.trim()} size="sm" className="ml-auto gap-1.5">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
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
        <Button onClick={onSubmit} disabled={!canSubmit} className="gap-1.5">
          <Send className="h-4 w-4" />
          Send to support
        </Button>
      </div>
    </>
  )
}
