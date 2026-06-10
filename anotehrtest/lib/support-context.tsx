"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

/**
 * Shared support backbone.
 *
 * This powers Admin-only customer support. Buyers, manufacturers (suppliers) and
 * service providers reach the Admin support team via a "Contact Support" entry in
 * their dashboards, which opens (or continues) a support conversation. Admin manages
 * every conversation from the Support Center: reply, change status, resolve, close,
 * or reopen.
 *
 * This is intentionally separate from the buyer <-> seller messaging system
 * (see lib/messages-context.tsx), which stays for peer-to-peer communication.
 */

export type SupportStatus = "open" | "in-progress" | "waiting-customer" | "resolved" | "closed"
export type CustomerRole = "buyer" | "supplier" | "provider"
export type Priority = "low" | "normal" | "high" | "urgent"

export interface SupportMessage {
  id: string
  from: "customer" | "agent"
  authorName: string
  text: string
  at: string
}

export interface SupportConversation {
  id: string
  customerName: string
  company: string
  role: CustomerRole
  email: string
  subject: string
  status: SupportStatus
  priority: Priority
  createdAt: string
  /** Unread by the support agent (admin) */
  unread: boolean
  /** Unread by the customer (buyer/supplier/provider) */
  unreadForCustomer: boolean
  messages: SupportMessage[]
}

/** Map an auth role to a support customer role. */
export function toCustomerRole(role: string): CustomerRole {
  if (role === "manufacturer" || role === "supplier") return "supplier"
  if (role === "service-provider" || role === "provider") return "provider"
  return "buyer"
}

const SEED: SupportConversation[] = [
  {
    id: "S-1042",
    customerName: "John Smith",
    company: "ABC Imports LLC",
    role: "buyer",
    email: "buyer@demo.com",
    subject: "Order ORD-2041 hasn't updated in a week",
    status: "open",
    priority: "high",
    createdAt: "2026-06-04T14:10:00.000Z",
    unread: true,
    unreadForCustomer: false,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "John Smith",
        text: "Hi, my order ORD-2041 has been stuck in production for over a week with no update. Can you check what's going on? I have a delivery deadline coming up.",
        at: "2026-06-04T14:10:00.000Z",
      },
    ],
  },
  {
    id: "S-1041",
    customerName: "Mei Lin",
    company: "NorthStar Packaging Studio",
    role: "provider",
    email: "mei@northstar.studio",
    subject: "Can't upload deliverables to an engagement",
    status: "in-progress",
    priority: "normal",
    createdAt: "2026-06-04T11:30:00.000Z",
    unread: true,
    unreadForCustomer: false,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Mei Lin",
        text: "When I try to attach the final design files to engagement ENG-3018, the upload keeps failing. Is there a file size limit?",
        at: "2026-06-04T11:30:00.000Z",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Support",
        text: "Hi Mei, thanks for reaching out. There's a 25MB limit per file. Could you tell me roughly how large your files are so I can confirm that's the cause?",
        at: "2026-06-04T11:48:00.000Z",
      },
    ],
  },
  {
    id: "S-1039",
    customerName: "Carlos Mendez",
    company: "JingDe Ceramics Co., Ltd.",
    role: "supplier",
    email: "manufacturer@demo.com",
    subject: "Payout for ORD-2041 not yet received",
    status: "open",
    priority: "high",
    createdAt: "2026-06-04T08:05:00.000Z",
    unread: true,
    unreadForCustomer: false,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Carlos Mendez",
        text: "We shipped order ORD-2041 three days ago but haven't received the payout yet. Could you check the status on your side?",
        at: "2026-06-04T08:05:00.000Z",
      },
    ],
  },
  {
    id: "S-1038",
    customerName: "Emma Wilson",
    company: "Euro Traders",
    role: "buyer",
    email: "emma@eurotraders.eu",
    subject: "How do I request a sample before ordering?",
    status: "waiting-customer",
    priority: "low",
    createdAt: "2026-06-03T09:15:00.000Z",
    unread: false,
    unreadForCustomer: false,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Emma Wilson",
        text: "Is it possible to request product samples from a supplier before placing a full order?",
        at: "2026-06-03T09:15:00.000Z",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Support",
        text: 'Absolutely! You can request a sample directly from the product page using the "Request Sample" button. Did that option appear for the product you\'re looking at?',
        at: "2026-06-03T09:40:00.000Z",
      },
    ],
  },
  {
    id: "S-1035",
    customerName: "Sophie Martin",
    company: "UK Retail Group",
    role: "buyer",
    email: "sophie@ukretail.co.uk",
    subject: "Update billing email address",
    status: "resolved",
    priority: "low",
    createdAt: "2026-05-28T13:00:00.000Z",
    unread: false,
    unreadForCustomer: false,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Sophie Martin",
        text: "Please update the email used for invoices to billing@ukretail.co.uk.",
        at: "2026-05-28T13:00:00.000Z",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Support",
        text: "Done — all future invoices will go to billing@ukretail.co.uk. Closing this out, but reply any time to reopen.",
        at: "2026-05-28T13:25:00.000Z",
      },
    ],
  },
]

interface NewConversationInput {
  customerName: string
  company: string
  role: CustomerRole
  email: string
  subject: string
  message: string
  priority?: Priority
}

interface SupportContextType {
  conversations: SupportConversation[]
  getConversationsForCustomer: (email: string) => SupportConversation[]
  getConversationById: (id: string) => SupportConversation | undefined
  createConversation: (input: NewConversationInput) => SupportConversation
  sendCustomerMessage: (id: string, authorName: string, text: string) => void
  sendAgentMessage: (id: string, text: string) => void
  updateStatus: (id: string, status: SupportStatus) => void
  updatePriority: (id: string, priority: Priority) => void
  markReadByAgent: (id: string) => void
  markReadByCustomer: (id: string) => void
}

const SupportContext = createContext<SupportContextType | undefined>(undefined)

let ticketCounter = 1043

export function SupportProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<SupportConversation[]>(SEED)

  const createConversation = (input: NewConversationInput) => {
    const now = new Date().toISOString()
    const conv: SupportConversation = {
      id: `S-${ticketCounter++}`,
      customerName: input.customerName,
      company: input.company,
      role: input.role,
      email: input.email,
      subject: input.subject.trim() || "Support request",
      status: "open",
      priority: input.priority ?? "normal",
      createdAt: now,
      unread: true,
      unreadForCustomer: false,
      messages: [
        {
          id: `m-${Date.now()}`,
          from: "customer",
          authorName: input.customerName,
          text: input.message.trim(),
          at: now,
        },
      ],
    }
    setConversations((prev) => [conv, ...prev])
    return conv
  }

  const sendCustomerMessage = (id: string, authorName: string, text: string) => {
    if (!text.trim()) return
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              // A customer reply reopens resolved/closed tickets and flags it for the agent.
              status: c.status === "resolved" || c.status === "closed" ? "open" : c.status,
              unread: true,
              messages: [
                ...c.messages,
                { id: `m-${Date.now()}`, from: "customer", authorName, text: text.trim(), at: new Date().toISOString() },
              ],
            }
          : c,
      ),
    )
  }

  const sendAgentMessage = (id: string, text: string) => {
    if (!text.trim()) return
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              // Replying to a brand-new ticket moves it into "In Progress" automatically.
              status: c.status === "open" ? "in-progress" : c.status,
              unreadForCustomer: true,
              messages: [
                ...c.messages,
                { id: `m-${Date.now()}`, from: "agent", authorName: "Support", text: text.trim(), at: new Date().toISOString() },
              ],
            }
          : c,
      ),
    )
  }

  const updateStatus = (id: string, status: SupportStatus) =>
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, unreadForCustomer: c.id === id ? true : c.unreadForCustomer } : c)),
    )

  const updatePriority = (id: string, priority: Priority) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, priority } : c)))

  const markReadByAgent = (id: string) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)))

  const markReadByCustomer = (id: string) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unreadForCustomer: false } : c)))

  const getConversationsForCustomer = (email: string) =>
    conversations
      .filter((c) => c.email.toLowerCase() === email.toLowerCase())
      .sort((a, b) => {
        const la = a.messages[a.messages.length - 1]?.at ?? a.createdAt
        const lb = b.messages[b.messages.length - 1]?.at ?? b.createdAt
        return new Date(lb).getTime() - new Date(la).getTime()
      })

  const getConversationById = (id: string) => conversations.find((c) => c.id === id)

  return (
    <SupportContext.Provider
      value={{
        conversations,
        getConversationsForCustomer,
        getConversationById,
        createConversation,
        sendCustomerMessage,
        sendAgentMessage,
        updateStatus,
        updatePriority,
        markReadByAgent,
        markReadByCustomer,
      }}
    >
      {children}
    </SupportContext.Provider>
  )
}

export function useSupport() {
  const ctx = useContext(SupportContext)
  if (!ctx) throw new Error("useSupport must be used within a SupportProvider")
  return ctx
}

/* ----------------------------- Shared UI config ----------------------------- */

export const STATUS_CONFIG: Record<
  SupportStatus,
  { label: string; short: string; pill: string; dot: string; solid: string }
> = {
  open: {
    label: "Open",
    short: "Open",
    pill: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    dot: "bg-amber-500",
    solid: "bg-amber-500",
  },
  "in-progress": {
    label: "In Progress",
    short: "Active",
    pill: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
    dot: "bg-sky-500",
    solid: "bg-sky-500",
  },
  "waiting-customer": {
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
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; cls: string }> = {
  low: { label: "Low", cls: "text-muted-foreground" },
  normal: { label: "Normal", cls: "text-muted-foreground" },
  high: { label: "High", cls: "text-amber-600 dark:text-amber-400" },
  urgent: { label: "Urgent", cls: "text-destructive" },
}

/* ------------------------------ Time helpers ------------------------------- */

// Deterministic reference time so relative timestamps read naturally regardless of the sandbox clock.
const SEED_REFERENCE_NOW = Math.max(
  ...SEED.flatMap((c) => c.messages.map((m) => new Date(m.at).getTime())),
)

export function relativeTime(iso: string) {
  const t = new Date(iso).getTime()
  const now = Math.max(SEED_REFERENCE_NOW, Date.now())
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

export function formatDuration(ms: number) {
  const m = Math.round(ms / 60000)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const mm = m % 60
  return mm ? `${h}h ${mm}m` : `${h}h`
}

export function firstResponseMs(conv: SupportConversation) {
  const firstCustomer = conv.messages.find((m) => m.from === "customer")
  const firstAgent = conv.messages.find((m) => m.from === "agent")
  if (!firstCustomer || !firstAgent) return null
  return new Date(firstAgent.at).getTime() - new Date(firstCustomer.at).getTime()
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
}
