// Connected buyers represent buyer accounts a seller (manufacturer or service
// provider) has already interacted with — via RFQs, quotations, or messages.
// Orders/engagements can only be created for one of these connected buyers so
// the record is always linked to the correct buyer account in the platform.

export type ConnectionSource = "rfq" | "quotation" | "message"

export interface ConnectedBuyer {
  email: string
  name: string
  company: string
  country: string
  // How this buyer is connected to the seller (most relevant interaction).
  sources: ConnectionSource[]
  lastInteraction: string
}

// The primary demo buyer account (buyer@demo.com). Including this buyer ensures
// orders created in the demo route to the real buyer dashboard and notifications.
const demoBuyer: ConnectedBuyer = {
  email: "buyer@demo.com",
  name: "John Smith",
  company: "ABC Imports LLC",
  country: "United States",
  sources: ["rfq", "quotation", "message"],
  lastInteraction: "2026-06-20",
}

// Connected buyers keyed by seller id (manufacturerId / providerId).
const connectionsBySeller: Record<string, ConnectedBuyer[]> = {
  // TechVision Electronics (manufacturer@demo.com)
  "mfr-1": [
    demoBuyer,
    {
      email: "procurement@globalretail.com",
      name: "Emma Johnson",
      company: "Global Retail Inc.",
      country: "United States",
      sources: ["rfq", "message"],
      lastInteraction: "2026-06-15",
    },
    {
      email: "buying@techmart.com",
      name: "David Park",
      company: "TechMart USA",
      country: "United States",
      sources: ["quotation"],
      lastInteraction: "2026-06-10",
    },
    {
      email: "sourcing@eurotrade.de",
      name: "Lukas Weber",
      company: "EuroTrade GmbH",
      country: "Germany",
      sources: ["rfq"],
      lastInteraction: "2026-05-28",
    },
  ],
  // NorthStar Packaging Studio (provider@demo.com)
  "sp-1": [
    demoBuyer,
    {
      email: "hello@bloombeauty.com",
      name: "Sophia Martins",
      company: "Bloom Beauty Co.",
      country: "United States",
      sources: ["message", "quotation"],
      lastInteraction: "2026-06-12",
    },
    {
      email: "ops@freshgoods.co",
      name: "Marco Rossi",
      company: "FreshGoods Collective",
      country: "Italy",
      sources: ["rfq", "message"],
      lastInteraction: "2026-06-02",
    },
  ],
}

export function getConnectedBuyers(sellerId: string): ConnectedBuyer[] {
  return connectionsBySeller[sellerId] ?? [demoBuyer]
}

export const CONNECTION_SOURCE_LABELS: Record<ConnectionSource, string> = {
  rfq: "Sent RFQ",
  quotation: "Received quotation",
  message: "Messaged",
}
