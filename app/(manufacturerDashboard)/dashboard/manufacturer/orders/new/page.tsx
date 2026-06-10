"use client"

import { useAuth } from "@/lib/auth-context"
import { SellerOrderCreate } from "@/components/orders/seller-order-create"

const DEMO_MANUFACTURER_ID = "mfr-1"

export default function ManufacturerCreateOrderPage() {
  const { user } = useAuth()
  return (
    <SellerOrderCreate
      config={{
        kind: "product",
        basePath: "/dashboard/manufacturer/orders",
        sellerId: user?.id ?? DEMO_MANUFACTURER_ID,
        sellerName: user?.company ?? "Your Company",
        title: "Create order",
        subtitle: "Set up a new order for a client and start tracking its progress.",
        submitLabel: "Create order",
      }}
    />
  )
}
