"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  getStatusLabel,
  formatCurrency,
  type Order,
  type OrderStatus,
  type OrderUpdate,
  type OrderKind,
} from "@/lib/orders-context"

/**
 * Shared messaging backbone.
 *
 * Order and engagement events are delivered as messages inside the conversation
 * thread between the buyer and the seller (manufacturer or service provider),
 * rather than as separate notifications. Each thread is keyed by sellerId + buyerEmail.
 */

export type ChatRole = "buyer" | "seller" | "system"

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  createdAt: string
  // Present on system messages generated from order lifecycle events
  orderId?: string
  eventKind?: "order-created" | "order-update"
  status?: OrderStatus
}

export interface MessageThread {
  id: string
  buyerEmail: string
  buyerName: string
  buyerCompany: string
  sellerId: string
  sellerName: string
  sellerKind: OrderKind
  messages: ChatMessage[]
  updatedAt: string
}

const threadId = (sellerId: string, buyerEmail: string) => `${sellerId}__${buyerEmail.toLowerCase()}`

function orderCreatedText(order: Order): string {
  const total = formatCurrency(order.totalAmount, order.currency)
  if (order.kind === "service") {
    return `New engagement started: "${order.title}". Scope: ${order.quantity}. Total: ${total}. Estimated delivery ${order.estimatedDelivery}. Track progress in your dashboard.`
  }
  return `New order created: "${order.title}". Quantity: ${order.quantity}. Total: ${total}. Estimated delivery ${order.estimatedDelivery}. Track progress in your dashboard.`
}

function orderUpdateText(order: Order, update: OrderUpdate): string {
  const label = getStatusLabel(update.status, order.kind)
  const extras: string[] = []
  if (update.photos.length) extras.push(`${update.photos.length} photo${update.photos.length > 1 ? "s" : ""}`)
  if (update.files.length) extras.push(`${update.files.length} file${update.files.length > 1 ? "s" : ""}`)
  const attach = extras.length ? ` (${extras.join(", ")} attached)` : ""
  return `Status: ${label}${attach}. ${update.note}`
}

// Seed threads mirror the seeded demo orders so the chat shows order activity out of the box.
const SEED_THREADS: MessageThread[] = [
  {
    id: threadId("mfr-1", "buyer@demo.com"),
    buyerEmail: "buyer@demo.com",
    buyerName: "John Smith",
    buyerCompany: "ABC Imports LLC",
    sellerId: "mfr-1",
    sellerName: "JingDe Ceramics Co., Ltd.",
    sellerKind: "product",
    updatedAt: "2026-06-20T14:30:00.000Z",
    messages: [
      {
        id: "m-1",
        role: "seller",
        text: "Thank you for confirming the quotation. We'll create the order now and keep you posted here.",
        createdAt: "2026-06-12T09:00:00.000Z",
      },
      {
        id: "m-2",
        role: "system",
        text: 'New order created: "Premium Ceramic Coffee Mugs — 320ml". Quantity: 5,000 units. Total: $7,250.00. Estimated delivery 2026-07-25. Track progress in your dashboard.',
        createdAt: "2026-06-12T09:05:00.000Z",
        orderId: "ORD-2041",
        eventKind: "order-created",
        status: "created",
      },
      {
        id: "m-3",
        role: "system",
        text: "Status: In Production. Glazing complete on the first batch; firing underway. 2 photos attached.",
        createdAt: "2026-06-20T14:30:00.000Z",
        orderId: "ORD-2041",
        eventKind: "order-update",
        status: "in-production",
      },
      {
        id: "m-4",
        role: "buyer",
        text: "Looks great, thanks for the update! Please keep the photos coming as you progress.",
        createdAt: "2026-06-20T15:10:00.000Z",
      },
    ],
  },
  {
    id: threadId("sp-1", "buyer@demo.com"),
    buyerEmail: "buyer@demo.com",
    buyerName: "John Smith",
    buyerCompany: "ABC Imports LLC",
    sellerId: "sp-1",
    sellerName: "NorthStar Packaging Studio",
    sellerKind: "service",
    updatedAt: "2026-06-22T13:20:00.000Z",
    messages: [
      {
        id: "m-5",
        role: "system",
        text: 'New engagement started: "Retail Packaging Design — Reusable Water Bottles". Scope: Full packaging system (carton + label + dieline). Total: $2,400.00. Estimated delivery 2026-07-10. Track progress in your dashboard.',
        createdAt: "2026-06-15T10:05:00.000Z",
        orderId: "ENG-3018",
        eventKind: "order-created",
        status: "created",
      },
      {
        id: "m-6",
        role: "system",
        text: "Status: In Progress. First round of design concepts shared for your feedback. 1 file attached.",
        createdAt: "2026-06-22T13:20:00.000Z",
        orderId: "ENG-3018",
        eventKind: "order-update",
        status: "in-production",
      },
    ],
  },
]

interface MessagesContextType {
  threads: MessageThread[]
  getThreadsForBuyer: (email: string) => MessageThread[]
  getThreadsForSeller: (sellerId: string) => MessageThread[]
  getThreadById: (id: string) => MessageThread | undefined
  sendChatMessage: (threadId: string, role: ChatRole, text: string) => void
  postOrderCreated: (order: Order) => void
  postOrderUpdate: (order: Order, update: OrderUpdate) => void
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined)

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<MessageThread[]>(SEED_THREADS)

  // Find an existing thread for an order's buyer/seller pair, or build a new one.
  const upsertThreadMessage = (order: Order, message: ChatMessage) => {
    const sellerId = order.providerId ?? order.manufacturerId
    const sellerName = order.providerName ?? order.manufacturerName
    const id = threadId(sellerId, order.buyerEmail)
    setThreads((prev) => {
      const existing = prev.find((t) => t.id === id)
      if (existing) {
        const updated: MessageThread = {
          ...existing,
          messages: [...existing.messages, message],
          updatedAt: message.createdAt,
        }
        return [updated, ...prev.filter((t) => t.id !== id)]
      }
      const created: MessageThread = {
        id,
        buyerEmail: order.buyerEmail,
        buyerName: order.buyerName,
        buyerCompany: order.buyerCompany,
        sellerId,
        sellerName,
        sellerKind: order.kind,
        messages: [message],
        updatedAt: message.createdAt,
      }
      return [created, ...prev]
    })
  }

  const postOrderCreated = (order: Order) => {
    upsertThreadMessage(order, {
      id: `m-${Date.now()}`,
      role: "system",
      text: orderCreatedText(order),
      createdAt: new Date().toISOString(),
      orderId: order.id,
      eventKind: "order-created",
      status: "created",
    })
  }

  const postOrderUpdate = (order: Order, update: OrderUpdate) => {
    upsertThreadMessage(order, {
      id: `m-${Date.now()}`,
      role: "system",
      text: orderUpdateText(order, update),
      createdAt: update.createdAt,
      orderId: order.id,
      eventKind: "order-update",
      status: update.status,
    })
  }

  const sendChatMessage = (id: string, role: ChatRole, text: string) => {
    if (!text.trim()) return
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: `m-${Date.now()}`, role, text: text.trim(), createdAt: new Date().toISOString() },
              ],
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    )
  }

  const getThreadsForBuyer = (email: string) =>
    threads
      .filter((t) => t.buyerEmail.toLowerCase() === email.toLowerCase())
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const getThreadsForSeller = (sellerId: string) =>
    threads.filter((t) => t.sellerId === sellerId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const getThreadById = (id: string) => threads.find((t) => t.id === id)

  return (
    <MessagesContext.Provider
      value={{
        threads,
        getThreadsForBuyer,
        getThreadsForSeller,
        getThreadById,
        sendChatMessage,
        postOrderCreated,
        postOrderUpdate,
      }}
    >
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error("useMessages must be used within a MessagesProvider")
  return ctx
}

// Short, human-friendly timestamp for chat bubbles.
export function formatChatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  return d.toLocaleDateString([], { month: "short", day: "numeric" })
}
