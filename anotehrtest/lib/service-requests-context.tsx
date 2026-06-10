"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type ServiceRequestStatus = "new" | "in-progress" | "completed" | "declined"

export interface ServiceRequestMessage {
  id: string
  sender: "buyer" | "provider"
  text: string
  createdAt: string
}

export interface ServiceRequest {
  id: string
  providerId: string
  providerName: string
  providerSlug: string
  categoryName: string
  // Buyer-supplied details
  serviceNeeded: string
  countryRegion: string
  description: string
  deadline: string
  budget: string
  fileNames: string[]
  notes: string
  // Buyer identity (demo)
  buyerName: string
  buyerCompany: string
  buyerEmail: string
  status: ServiceRequestStatus
  createdAt: string
  messages: ServiceRequestMessage[]
}

export interface NewServiceRequestInput {
  providerId: string
  providerName: string
  providerSlug: string
  categoryName: string
  serviceNeeded: string
  countryRegion: string
  description: string
  deadline: string
  budget: string
  fileNames: string[]
  notes: string
  buyerName: string
  buyerCompany: string
  buyerEmail: string
}

interface ServiceRequestsContextType {
  requests: ServiceRequest[]
  createRequest: (input: NewServiceRequestInput) => ServiceRequest
  updateRequestStatus: (id: string, status: ServiceRequestStatus) => void
  addMessage: (id: string, sender: "buyer" | "provider", text: string) => void
  getRequestsForProvider: (providerId: string) => ServiceRequest[]
  getRequestById: (id: string) => ServiceRequest | undefined
}

const ServiceRequestsContext = createContext<ServiceRequestsContextType | undefined>(undefined)

const STORAGE_KEY = "sourcenest_service_requests"

// Seed demo data so dashboards are not empty on first load
const seedRequests: ServiceRequest[] = [
  {
    id: "req-1001",
    providerId: "sp-4",
    providerName: "Veritas Inspection Group",
    providerSlug: "veritas-inspection-group",
    categoryName: "Quality Control & Inspection",
    serviceNeeded: "Pre-shipment inspection",
    countryRegion: "Vietnam",
    description:
      "We need a pre-shipment inspection for 5,000 units of cotton t-shirts before container loading at a factory near Ho Chi Minh City.",
    deadline: "2026-06-20",
    budget: "$300 - $500",
    fileNames: ["product-spec.pdf", "po-4821.pdf"],
    notes: "Please check stitching quality and color consistency against the approved sample.",
    buyerName: "John Smith",
    buyerCompany: "ABC Imports LLC",
    buyerEmail: "buyer@demo.com",
    status: "new",
    createdAt: "2026-05-28T10:30:00.000Z",
    messages: [],
  },
  {
    id: "req-1002",
    providerId: "sp-1",
    providerName: "NorthStar Packaging Studio",
    providerSlug: "northstar-packaging-studio",
    categoryName: "Design & Branding",
    serviceNeeded: "Packaging design & dielines",
    countryRegion: "Remote",
    description:
      "Looking for retail-ready packaging design for a new line of reusable water bottles, including dielines for our factory.",
    deadline: "2026-07-05",
    budget: "$450 - $800",
    fileNames: ["brand-guidelines.pdf"],
    notes: "We already have a logo. Need 3 SKU variants.",
    buyerName: "John Smith",
    buyerCompany: "ABC Imports LLC",
    buyerEmail: "buyer@demo.com",
    status: "in-progress",
    createdAt: "2026-05-22T14:05:00.000Z",
    messages: [
      {
        id: "m-1",
        sender: "provider",
        text: "Thanks for the request! Could you share your target retail price so we can match the packaging tier?",
        createdAt: "2026-05-22T16:20:00.000Z",
      },
    ],
  },
]

export function ServiceRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setRequests(JSON.parse(stored))
      } catch {
        setRequests(seedRequests)
      }
    } else {
      setRequests(seedRequests)
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
    }
  }, [requests, isInitialized])

  const createRequest = (input: NewServiceRequestInput): ServiceRequest => {
    const newRequest: ServiceRequest = {
      ...input,
      id: `req-${Date.now()}`,
      status: "new",
      createdAt: new Date().toISOString(),
      messages: [],
    }
    setRequests((prev) => [newRequest, ...prev])
    return newRequest
  }

  const updateRequestStatus = (id: string, status: ServiceRequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const addMessage = (id: string, sender: "buyer" | "provider", text: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              messages: [
                ...r.messages,
                { id: `m-${Date.now()}`, sender, text, createdAt: new Date().toISOString() },
              ],
            }
          : r,
      ),
    )
  }

  const getRequestsForProvider = (providerId: string) => requests.filter((r) => r.providerId === providerId)

  const getRequestById = (id: string) => requests.find((r) => r.id === id)

  return (
    <ServiceRequestsContext.Provider
      value={{ requests, createRequest, updateRequestStatus, addMessage, getRequestsForProvider, getRequestById }}
    >
      {children}
    </ServiceRequestsContext.Provider>
  )
}

export function useServiceRequests() {
  const context = useContext(ServiceRequestsContext)
  if (context === undefined) {
    throw new Error("useServiceRequests must be used within a ServiceRequestsProvider")
  }
  return context
}
