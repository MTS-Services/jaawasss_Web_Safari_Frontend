"use client"

import { useAuth } from "@/lib/auth-context"
import { SellerOrdersList } from "@/components/orders/seller-orders"

const DEMO_MANUFACTURER_ID = "mfr-1"

export default function ManufacturerOrdersPage() {
  const { user } = useAuth()
  const sellerId = user?.id ?? DEMO_MANUFACTURER_ID
  return (
    <SellerOrdersList
      config={{
        kind: "product",
        basePath: "/dashboard/manufacturer/orders",
        sellerId,
        listTitle: "Orders",
        listSubtitle: "Manage confirmed orders, share production and shipping updates, and keep documents in one place.",
        noun: "order",
        nounPlural: "orders",
        createLabel: "Create order",
      }}
    />
  )
}
