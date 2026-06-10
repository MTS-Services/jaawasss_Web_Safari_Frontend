"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Keep statuses simple and ordered. "cancelled" is a terminal exception.
export type OrderStatus =
  | "created"
  | "in-production"
  | "ready"
  | "shipped"
  | "completed"
  | "cancelled"

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "created",
  "in-production",
  "ready",
  "shipped",
  "completed",
]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  created: "Order Created",
  "in-production": "In Production",
  ready: "Ready for Shipment",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
}

// Service engagements reuse the same status flow with provider-oriented wording.
export const SERVICE_STATUS_LABELS: Record<OrderStatus, string> = {
  created: "Engagement Started",
  "in-production": "In Progress",
  ready: "Deliverables Ready",
  shipped: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
}

export type OrderKind = "product" | "service"

// Returns the right status label for the order/engagement kind.
export function getStatusLabel(status: OrderStatus, kind: OrderKind = "product"): string {
  return (kind === "service" ? SERVICE_STATUS_LABELS : ORDER_STATUS_LABELS)[status]
}

export type OrderDocumentType =
  | "invoice"
  | "proforma"
  | "quotation"
  | "product-doc"
  | "other"

export const ORDER_DOCUMENT_LABELS: Record<OrderDocumentType, string> = {
  invoice: "Invoice",
  proforma: "Proforma Invoice",
  quotation: "Quotation PDF",
  "product-doc": "Product Document",
  other: "Other",
}

export interface OrderDocument {
  id: string
  name: string
  type: OrderDocumentType
  uploadedAt: string
}

export type OrderActor = "manufacturer" | "provider" | "buyer"

export interface OrderUpdate {
  id: string
  status: OrderStatus
  note: string
  photos: string[]
  files: { id: string; name: string }[]
  createdAt: string
  author: OrderActor
}

export interface Order {
  id: string
  // Distinguishes product orders (manufacturers) from service engagements (providers)
  kind: OrderKind
  title: string
  // Links to existing records / accounts
  rfqId?: string
  rfqTitle?: string
  quotationId?: string
  serviceRequestId?: string
  buyerEmail: string
  buyerName: string
  buyerCompany: string
  // Seller identity — manufacturer for products, provider for services
  manufacturerId: string
  manufacturerName: string
  providerId?: string
  providerName?: string
  // Commercial details (labels adapt per kind in the UI)
  quantity: string
  unitPrice: number
  totalAmount: number
  currency: string
  packagingDetails: string
  productionTime: string
  estimatedDelivery: string
  paymentTerms: string
  shippingTerms: string
  destination: string
  notes: string
  // Files attached at creation
  documents: OrderDocument[]
  // Lifecycle
  status: OrderStatus
  createdAt: string
  updates: OrderUpdate[]
}

const STORAGE_KEY = "sourcenest_orders"

// Seed demo orders for the demo buyer so the dashboard is not empty on first load.
const seedOrders: Order[] = [
  {
    id: "ORD-2041",
    kind: "product",
    title: "Premium Ceramic Coffee Mugs — 320ml",
    rfqId: "RFQ-001",
    rfqTitle: "Ceramic coffee mugs with custom logo",
    quotationId: "QT-5512",
    buyerEmail: "buyer@demo.com",
    buyerName: "John Smith",
    buyerCompany: "ABC Imports LLC",
    manufacturerId: "mfr-1",
    manufacturerName: "JingDe Ceramics Co., Ltd.",
    quantity: "10,000 units",
    unitPrice: 1.85,
    totalAmount: 18500,
    currency: "USD",
    packagingDetails: "Individual white gift box, 24 units per master carton",
    productionTime: "30 days",
    estimatedDelivery: "2026-07-18",
    paymentTerms: "30% deposit, 70% before shipment",
    shippingTerms: "FOB Shenzhen",
    destination: "Los Angeles, USA (LAX / Port of LA)",
    notes: "Custom 1-color logo print on each mug. Pantone 2935C. Approved sample on file.",
    documents: [
      { id: "doc-1", name: "proforma-invoice-2041.pdf", type: "proforma", uploadedAt: "2026-06-01T09:00:00.000Z" },
      { id: "doc-2", name: "quotation-QT-5512.pdf", type: "quotation", uploadedAt: "2026-06-01T09:00:00.000Z" },
      { id: "doc-3", name: "mug-spec-sheet.pdf", type: "product-doc", uploadedAt: "2026-06-01T09:00:00.000Z" },
    ],
    status: "shipped",
    createdAt: "2026-06-01T09:00:00.000Z",
    updates: [
      {
        id: "u-1",
        status: "created",
        note: "Order confirmed. 30% deposit received, production scheduled.",
        photos: [],
        files: [],
        createdAt: "2026-06-01T09:05:00.000Z",
        author: "manufacturer",
      },
      {
        id: "u-2",
        status: "in-production",
        note: "Production started. First batch of mugs through glazing and logo printing.",
        photos: ["/orders/production-line.png"],
        files: [],
        createdAt: "2026-06-08T11:30:00.000Z",
        author: "manufacturer",
      },
      {
        id: "u-3",
        status: "ready",
        note: "All 10,000 units produced, QC passed, packed and palletized. Ready for pickup.",
        photos: ["/orders/packed-goods.png"],
        files: [{ id: "f-1", name: "packing-list-2041.pdf" }],
        createdAt: "2026-06-28T14:00:00.000Z",
        author: "manufacturer",
      },
      {
        id: "u-4",
        status: "shipped",
        note: "Container loaded and departed Shenzhen. Tracking documents attached.",
        photos: ["/orders/container-loading.png"],
        files: [
          { id: "f-2", name: "bill-of-lading-2041.pdf" },
          { id: "f-3", name: "commercial-invoice-2041.pdf" },
        ],
        createdAt: "2026-07-02T08:15:00.000Z",
        author: "manufacturer",
      },
    ],
  },
  {
    id: "ORD-2052",
    kind: "product",
    title: "Organic Cotton Tote Bags — Natural",
    rfqId: "RFQ-007",
    rfqTitle: "Reusable cotton tote bags",
    quotationId: "QT-5601",
    buyerEmail: "buyer@demo.com",
    buyerName: "John Smith",
    buyerCompany: "ABC Imports LLC",
    manufacturerId: "mfr-2",
    manufacturerName: "GreenWeave Textiles",
    quantity: "5,000 units",
    unitPrice: 2.4,
    totalAmount: 12000,
    currency: "USD",
    packagingDetails: "Polybag per unit, 50 units per carton",
    productionTime: "25 days",
    estimatedDelivery: "2026-07-30",
    paymentTerms: "50% deposit, 50% before shipment",
    shippingTerms: "FOB Mumbai",
    destination: "Rotterdam, Netherlands",
    notes: "GOTS certified organic cotton. Screen-printed logo, 2 colors.",
    documents: [
      { id: "doc-4", name: "proforma-invoice-2052.pdf", type: "proforma", uploadedAt: "2026-06-12T10:00:00.000Z" },
      { id: "doc-5", name: "gots-certificate.pdf", type: "product-doc", uploadedAt: "2026-06-12T10:00:00.000Z" },
    ],
    status: "in-production",
    createdAt: "2026-06-12T10:00:00.000Z",
    updates: [
      {
        id: "u-5",
        status: "created",
        note: "Order confirmed and deposit received. Materials sourced.",
        photos: [],
        files: [],
        createdAt: "2026-06-12T10:10:00.000Z",
        author: "manufacturer",
      },
      {
        id: "u-6",
        status: "in-production",
        note: "Cutting and stitching in progress. On track for the delivery window.",
        photos: [],
        files: [],
        createdAt: "2026-06-18T09:45:00.000Z",
        author: "manufacturer",
      },
    ],
  },
  {
    id: "ENG-3018",
    kind: "service",
    title: "Retail Packaging Design — Reusable Water Bottles",
    serviceRequestId: "SR-204",
    buyerEmail: "buyer@demo.com",
    buyerName: "John Smith",
    buyerCompany: "ABC Imports LLC",
    manufacturerId: "sp-1",
    manufacturerName: "NorthStar Packaging Studio",
    providerId: "sp-1",
    providerName: "NorthStar Packaging Studio",
    quantity: "Full packaging system (carton + label + dieline)",
    unitPrice: 2400,
    totalAmount: 2400,
    currency: "USD",
    packagingDetails: "Print-ready dielines for factory, 3 SKUs",
    productionTime: "3 weeks",
    estimatedDelivery: "2026-07-10",
    paymentTerms: "50% upfront, 50% on final files",
    shippingTerms: "Digital delivery",
    destination: "Remote / Online",
    notes: "Retail-ready packaging design for a new line of reusable water bottles, including dielines for the factory.",
    documents: [
      { id: "doc-6", name: "engagement-agreement-3018.pdf", type: "proforma", uploadedAt: "2026-06-15T10:00:00.000Z" },
      { id: "doc-7", name: "creative-brief.pdf", type: "product-doc", uploadedAt: "2026-06-15T10:00:00.000Z" },
    ],
    status: "in-production",
    createdAt: "2026-06-15T10:00:00.000Z",
    updates: [
      {
        id: "u-7",
        status: "created",
        note: "Engagement confirmed. Creative brief reviewed and kickoff scheduled.",
        photos: [],
        files: [],
        createdAt: "2026-06-15T10:05:00.000Z",
        author: "provider",
      },
      {
        id: "u-8",
        status: "in-production",
        note: "First round of design concepts in progress. Initial drafts shared for feedback.",
        photos: [],
        files: [{ id: "f-4", name: "concepts-round-1.pdf" }],
        createdAt: "2026-06-22T13:20:00.000Z",
        author: "provider",
      },
    ],
  },
]

interface CreateOrderInput {
  kind?: OrderKind
  title: string
  rfqId?: string
  rfqTitle?: string
  quotationId?: string
  serviceRequestId?: string
  buyerEmail: string
  buyerName: string
  buyerCompany: string
  manufacturerId: string
  manufacturerName: string
  providerId?: string
  providerName?: string
  quantity: string
  unitPrice: number
  totalAmount: number
  currency: string
  packagingDetails: string
  productionTime: string
  estimatedDelivery: string
  paymentTerms: string
  shippingTerms: string
  destination: string
  notes: string
  documents: Omit<OrderDocument, "id" | "uploadedAt">[]
}

interface AddUpdateInput {
  status: OrderStatus
  note: string
  photos: string[]
  files: { name: string }[]
  author?: OrderActor
}

interface OrdersContextType {
  orders: Order[]
  createOrder: (input: CreateOrderInput) => Order
  addOrderUpdate: (orderId: string, input: AddUpdateInput) => void
  getOrderById: (id: string) => Order | undefined
  getOrdersForBuyer: (email: string) => Order[]
  getOrdersForManufacturer: (manufacturerId: string) => Order[]
  getOrdersForProvider: (providerId: string) => Order[]
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setOrders(JSON.parse(stored))
      } catch {
        setOrders(seedOrders)
      }
    } else {
      setOrders(seedOrders)
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    }
  }, [orders, isInitialized])

  const createOrder = (input: CreateOrderInput): Order => {
    const now = new Date().toISOString()
    const kind: OrderKind = input.kind ?? "product"
    const isService = kind === "service"
    const prefix = isService ? "ENG" : "ORD"
    const author: OrderActor = isService ? "provider" : "manufacturer"
    const newOrder: Order = {
      ...input,
      kind,
      id: `${prefix}-${Date.now().toString().slice(-6)}`,
      documents: input.documents.map((d, i) => ({
        ...d,
        id: `doc-${Date.now()}-${i}`,
        uploadedAt: now,
      })),
      status: "created",
      createdAt: now,
      updates: [
        {
          id: `u-${Date.now()}`,
          status: "created",
          note: isService ? "Engagement started." : "Order created.",
          photos: [],
          files: [],
          createdAt: now,
          author,
        },
      ],
    }
    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }

  const addOrderUpdate = (orderId: string, input: AddUpdateInput) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: input.status,
              updates: [
                ...o.updates,
                {
                  id: `u-${Date.now()}`,
                  status: input.status,
                  note: input.note,
                  photos: input.photos,
                  files: input.files.map((f, i) => ({ id: `f-${Date.now()}-${i}`, name: f.name })),
                  createdAt: new Date().toISOString(),
                  author: input.author ?? "manufacturer",
                },
              ],
            }
          : o,
      ),
    )
  }

  const getOrderById = (id: string) => orders.find((o) => o.id === id)
  const getOrdersForBuyer = (email: string) => orders.filter((o) => o.buyerEmail === email)
  const getOrdersForManufacturer = (manufacturerId: string) =>
    orders.filter((o) => o.kind === "product" && o.manufacturerId === manufacturerId)
  const getOrdersForProvider = (providerId: string) =>
    orders.filter((o) => o.kind === "service" && (o.providerId === providerId || o.manufacturerId === providerId))

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        addOrderUpdate,
        getOrderById,
        getOrdersForBuyer,
        getOrdersForManufacturer,
        getOrdersForProvider,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}

// Formatting helpers
export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
