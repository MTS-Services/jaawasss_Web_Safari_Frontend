"use client"

import { Package } from "lucide-react"

export default function BuyerOrdersPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
      <Package className="w-12 h-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">My Orders</h1>
      <p className="text-muted-foreground max-w-md">
        Your order history will appear here once orders are placed.
      </p>
    </div>
  )
}
