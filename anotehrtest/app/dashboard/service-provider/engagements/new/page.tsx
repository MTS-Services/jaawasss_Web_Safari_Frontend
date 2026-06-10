"use client"

import { useAuth } from "@/lib/auth-context"
import { SellerOrderCreate } from "@/components/orders/seller-order-create"

const DEMO_PROVIDER_ID = "sp-1"

export default function ProviderCreateEngagementPage() {
  const { user } = useAuth()
  return (
    <SellerOrderCreate
      config={{
        kind: "service",
        basePath: "/dashboard/service-provider/engagements",
        sellerId: user?.id ?? DEMO_PROVIDER_ID,
        sellerName: user?.company ?? "Your Studio",
        title: "New engagement",
        subtitle: "Set up a new client engagement and start tracking its progress and deliverables.",
        submitLabel: "Create engagement",
      }}
    />
  )
}
