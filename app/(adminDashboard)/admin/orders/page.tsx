"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  useOrders,
  formatCurrency,
  formatOrderDate,
  getStatusLabel,
  ORDER_STATUS_FLOW,
  type OrderStatus,
  type OrderKind,
} from "@/lib/orders-context"
import {
  PackageCheck,
  Package,
  Briefcase,
  Factory,
  User,
  Search,
  DollarSign,
  Layers,
  CheckCircle2,
  Clock,
} from "lucide-react"

const statusColors: Record<OrderStatus, string> = {
  created: "bg-blue-100 text-blue-700",
  "in-production": "bg-amber-100 text-amber-700",
  ready: "bg-purple-100 text-purple-700",
  shipped: "bg-cyan-100 text-cyan-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

type KindFilter = "all" | OrderKind
type StatusFilter = "all" | OrderStatus

export default function AdminOrdersPage() {
  const { orders } = useOrders()
  const [search, setSearch] = useState("")
  const [kindFilter, setKindFilter] = useState<KindFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const stats = useMemo(() => {
    const totalValue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    const active = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length
    const completed = orders.filter((o) => o.status === "completed").length
    return {
      total: orders.length,
      products: orders.filter((o) => o.kind === "product").length,
      services: orders.filter((o) => o.kind === "service").length,
      active,
      completed,
      totalValue,
    }
  }, [orders])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders
      .filter((o) => (kindFilter === "all" ? true : o.kind === kindFilter))
      .filter((o) => (statusFilter === "all" ? true : o.status === statusFilter))
      .filter((o) => {
        if (!q) return true
        const seller = o.kind === "service" ? o.providerName ?? o.manufacturerName : o.manufacturerName
        return [o.id, o.title, o.buyerCompany, o.buyerName, seller]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q))
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [orders, search, kindFilter, statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Orders &amp; Engagements</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor all product orders and service engagements across the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Layers} label="Total" value={String(stats.total)} hint={`${stats.products} products · ${stats.services} services`} />
        <StatCard icon={Clock} label="Active" value={String(stats.active)} hint="In progress" />
        <StatCard icon={CheckCircle2} label="Completed" value={String(stats.completed)} hint="Closed out" />
        <StatCard icon={DollarSign} label="Total Value" value={formatCurrency(stats.totalValue, "USD")} hint="Across all records" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, buyer, or seller..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={kindFilter === "all"} onClick={() => setKindFilter("all")}>All types</FilterChip>
          <FilterChip active={kindFilter === "product"} onClick={() => setKindFilter("product")}>Products</FilterChip>
          <FilterChip active={kindFilter === "service"} onClick={() => setKindFilter("service")}>Services</FilterChip>
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All statuses</option>
            {ORDER_STATUS_FLOW.map((s) => (
              <option key={s} value={s}>
                {getStatusLabel(s)}
              </option>
            ))}
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden md:table-cell">Buyer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden lg:table-cell">Seller</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-foreground hidden sm:table-cell">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden xl:table-cell">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const isService = o.kind === "service"
                const seller = isService ? o.providerName ?? o.manufacturerName : o.manufacturerName
                return (
                  <tr key={o.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-foreground">{o.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                            isService ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary",
                          )}
                        >
                          {isService ? <Briefcase className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{o.title}</p>
                          <p className="text-xs text-muted-foreground">{isService ? "Service engagement" : "Product order"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate">{o.buyerCompany}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {isService ? <Briefcase className="h-3 w-3" /> : <Factory className="h-3 w-3" />}
                        <span className="truncate">{seller}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-foreground hidden sm:table-cell">
                      {formatCurrency(o.totalAmount, o.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[o.status]} variant="secondary">
                        {getStatusLabel(o.status, o.kind)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden xl:table-cell">
                      {formatOrderDate(o.createdAt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PackageCheck className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 font-medium text-foreground">No matching records</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            {(search || kindFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearch("")
                  setKindFilter("all")
                  setStatusFilter("all")
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
