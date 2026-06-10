"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import {
  useOrders,
  formatCurrency,
  formatOrderDate,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_FLOW,
  getStatusLabel,
  type Order,
  type OrderStatus,
} from "@/lib/orders-context"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Package,
  Search,
  Factory,
  Briefcase,
  MapPin,
  ChevronRight,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  Hammer,
  PackageCheck,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const DEMO_BUYER_EMAIL = "buyer@demo.com"

const statusStyles: Record<OrderStatus, { color: string; icon: typeof Clock }> = {
  created: { color: "bg-blue-100 text-blue-700", icon: Clock },
  "in-production": { color: "bg-amber-100 text-amber-700", icon: Hammer },
  ready: { color: "bg-violet-100 text-violet-700", icon: PackageCheck },
  shipped: { color: "bg-cyan-100 text-cyan-700", icon: Truck },
  completed: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  cancelled: { color: "bg-gray-100 text-gray-600", icon: XCircle },
}

function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <XCircle className="h-3.5 w-3.5" />
        Order cancelled
      </div>
    )
  }
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status)
  return (
    <div className="flex items-center gap-1.5">
      {ORDER_STATUS_FLOW.map((s, i) => (
        <div
          key={s}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i <= currentIndex ? "bg-secondary" : "bg-muted",
          )}
          title={ORDER_STATUS_LABELS[s]}
        />
      ))}
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  const StatusIcon = statusStyles[order.status].icon
  const isService = order.kind === "service"
  const SellerIcon = isService ? Briefcase : Factory
  const sellerName = isService ? order.providerName ?? order.manufacturerName : order.manufacturerName
  return (
    <Link
      href={`/dashboard/buyer/orders/${order.id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-secondary/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{order.id}</span>
            <Badge className={cn("gap-1 text-xs", statusStyles[order.status].color)}>
              <StatusIcon className="h-3 w-3" />
              {getStatusLabel(order.status, order.kind)}
            </Badge>
          </div>
          <h3 className="mt-1.5 truncate font-medium text-foreground">{order.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <SellerIcon className="h-3.5 w-3.5" />
              {sellerName}
            </span>
            <span className="flex items-center gap-1.5">
              {isService ? <Briefcase className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
              {order.quantity}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {order.destination}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="font-serif text-lg font-medium text-foreground">
            {formatCurrency(order.totalAmount, order.currency)}
          </span>
          <span className="text-xs text-muted-foreground">Est. {formatOrderDate(order.estimatedDelivery)}</span>
        </div>
      </div>

      <div className="mt-4">
        <OrderProgress status={order.status} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          {order.documents.length} document{order.documents.length === 1 ? "" : "s"}
          {order.updates.length > 0 && ` · ${order.updates.length} update${order.updates.length === 1 ? "" : "s"}`}
        </span>
        <span className="flex items-center gap-1 font-medium text-secondary opacity-0 transition-opacity group-hover:opacity-100">
          View details
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

export default function BuyerOrdersPage() {
  const { user } = useAuth()
  const { orders } = useOrders()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const buyerEmail = user?.email ?? DEMO_BUYER_EMAIL
  const myOrders = orders.filter(
    (o) => o.buyerEmail === buyerEmail || o.buyerEmail === DEMO_BUYER_EMAIL,
  )

  const filtered = myOrders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        o.title.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.manufacturerName.toLowerCase().includes(q)
      )
    }
    return true
  })

  const activeCount = myOrders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled",
  ).length

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-medium text-foreground">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track production, shipping, documents, and progress updates for your confirmed orders.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total orders</p>
          <p className="mt-1 font-serif text-2xl font-medium text-foreground">{myOrders.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">In progress</p>
          <p className="mt-1 font-serif text-2xl font-medium text-foreground">{activeCount}</p>
        </div>
        <div className="col-span-2 rounded-xl border border-border bg-card p-4 sm:col-span-1">
          <p className="text-xs text-muted-foreground">Total value</p>
          <p className="mt-1 font-serif text-2xl font-medium text-foreground">
            {formatCurrency(
              myOrders.reduce((sum, o) => sum + o.totalAmount, 0),
              myOrders[0]?.currency ?? "USD",
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order, product, or manufacturer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-medium text-foreground">
            {myOrders.length === 0 ? "No orders yet" : "No orders match your filters"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {myOrders.length === 0
              ? "Once you and a manufacturer agree to proceed on a quotation, your order will appear here for tracking."
              : "Try adjusting your search or status filter."}
          </p>
        </div>
      )}
    </div>
  )
}
