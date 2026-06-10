"use client"

import { use } from "react"
import { SellerOrderDetail } from "@/components/orders/seller-order-detail"

export default function ProviderEngagementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <SellerOrderDetail
      orderId={id}
      config={{
        kind: "service",
        basePath: "/dashboard/service-provider/engagements",
        author: "provider",
      }}
    />
  )
}
