"use client"

import { use } from "react"
import { SellerOrderDetail } from "@/components/orders/seller-order-detail"

export default function ManufacturerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <SellerOrderDetail
      orderId={id}
      config={{
        kind: "product",
        basePath: "/dashboard/manufacturer/orders",
        author: "manufacturer",
      }}
    />
  )
}
