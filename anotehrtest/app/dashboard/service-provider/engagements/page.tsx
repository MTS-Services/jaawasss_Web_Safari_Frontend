"use client"

import { useAuth } from "@/lib/auth-context"
import { SellerOrdersList } from "@/components/orders/seller-orders"

const DEMO_PROVIDER_ID = "sp-1"

export default function ProviderEngagementsPage() {
  const { user } = useAuth()
  const sellerId = user?.id ?? DEMO_PROVIDER_ID
  return (
    <SellerOrdersList
      config={{
        kind: "service",
        basePath: "/dashboard/service-provider/engagements",
        sellerId,
        listTitle: "Engagements",
        listSubtitle: "Track active client engagements, share progress and deliverables, and keep agreements in one place.",
        noun: "engagement",
        nounPlural: "engagements",
        createLabel: "New engagement",
      }}
    />
  )
}
