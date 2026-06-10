"use client"

import { useState } from "react"
import Link from "next/link"
import {
  useRfqs,
  RFQ_STATUS_LABELS,
  type Rfq,
  type RfqStatus,
} from "@/lib/rfqs-context"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Search,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  PackageCheck,
  Building2,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/orders-context"

const statusStyles: Record<RfqStatus, { color: string; icon: typeof Clock }> = {
  pending: { color: "bg-amber-100 text-amber-700", icon: Clock },
  in_review: { color: "bg-blue-100 text-blue-700", icon: Eye },
  quoted: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  accepted: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
  expired: { color: "bg-gray-100 text-gray-600", icon: AlertCircle },
}

export interface RfqListConfig {
  basePath: string
  role: "buyer" | "manufacturer" | "admin"
  roleId?: string // buyer email, or manufacturer id
  listTitle: string
  listSubtitle: string
  createLabel?: string
}

function Progress({ status }: { status: RfqStatus }) {
  if (status === "cancelled" || status === "expired") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <XCircle className="h-3.5 w-3.5" />
        {RFQ_STATUS_LABELS[status]}
      </div>
    )
  }
  const flow: RfqStatus[] = ["pending", "in_review", "quoted", "accepted"]
  const currentIndex = flow.indexOf(status)
  return (
    <div className="flex items-center gap-1.5">
      {flow.map((s, i) => (
        <div
          key={s}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i <= currentIndex ? "bg-secondary" : "bg-muted",
          )}
          title={RFQ_STATUS_LABELS[s]}
        />
      ))}
    </div>
  )
}

function RfqCard({ rfq, config }: { rfq: Rfq; config: RfqListConfig }) {
  const StatusIcon = statusStyles[rfq.status].icon
  return (
    <Link
      href={`${config.basePath}/${rfq.id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-secondary/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{rfq.id}</span>
            <Badge className={cn("gap-1 text-xs", statusStyles[rfq.status].color)}>
              <StatusIcon className="h-3 w-3" />
              {RFQ_STATUS_LABELS[rfq.status]}
            </Badge>
          </div>
          <h3 className="mt-1.5 truncate font-medium text-foreground">{rfq.productName}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {config.role === "buyer" ? (rfq.supplierCompanyName || "Any Supplier") : rfq.buyerCompany}
            </span>
            <span className="flex items-center gap-1.5">
              <PackageCheck className="h-3.5 w-3.5" />
              {rfq.quantity.toLocaleString()} {rfq.quantityUnit}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="font-serif text-lg font-medium text-foreground">
            {formatCurrency(rfq.targetPrice, rfq.targetCurrencyCode)}
          </span>
          <span className="text-xs text-muted-foreground">Needed by {new Date(rfq.requiredDeliveryDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-4">
        <Progress status={rfq.status} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          {rfq.updates.length > 0 ? `${rfq.updates.length} updates` : "No updates"}
        </span>
        <span className="flex items-center gap-1 font-medium text-secondary opacity-0 transition-opacity group-hover:opacity-100">
          View details
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

export function RfqList({ config }: { config: RfqListConfig }) {
  const { getRfqsForBuyer, getRfqsForManufacturer, getRfqsForAdmin } = useRfqs()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  let myRfqs: Rfq[] = []
  if (config.role === "buyer" && config.roleId) {
    myRfqs = getRfqsForBuyer(config.roleId)
  } else if (config.role === "manufacturer" && config.roleId) {
    myRfqs = getRfqsForManufacturer(config.roleId)
  } else if (config.role === "admin") {
    myRfqs = getRfqsForAdmin()
  }

  const filtered = myRfqs.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        r.productName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.buyerCompany && r.buyerCompany.toLowerCase().includes(q)) ||
        (r.supplierCompanyName && r.supplierCompanyName.toLowerCase().includes(q))
      )
    }
    return true
  })

  const activeCount = myRfqs.filter(
    (r) => r.status === "pending" || r.status === "in_review" || r.status === "quoted",
  ).length

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">{config.listTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.listSubtitle}</p>
        </div>
        {config.role === "buyer" && config.createLabel && (
          <Button asChild className="gap-2">
            <Link href={`/rfq/new`}>
              <Plus className="h-4 w-4" />
              {config.createLabel}
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total RFQs</p>
          <p className="mt-1 font-serif text-2xl font-medium text-foreground">{myRfqs.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="mt-1 font-serif text-2xl font-medium text-foreground">{activeCount}</p>
        </div>
        <div className="col-span-2 rounded-xl border border-border bg-card p-4 sm:col-span-1">
          <p className="text-xs text-muted-foreground">Total Target Value</p>
          <p className="mt-1 font-serif text-2xl font-medium text-foreground">
            {formatCurrency(
              myRfqs.reduce((sum, r) => sum + (r.targetPrice * r.quantity), 0),
              myRfqs[0]?.targetCurrencyCode ?? "USD",
            )}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search by product, ID, or company...`}
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
            {Object.entries(RFQ_STATUS_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((rfq) => (
            <RfqCard key={rfq.id} rfq={rfq} config={config} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-medium text-foreground">
            {myRfqs.length === 0 ? `No RFQs yet` : `No RFQs match your filters`}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {myRfqs.length === 0
              ? (config.role === "buyer" ? "Submit your first RFQ to get started." : "You have no RFQs at this time.")
              : "Try adjusting your search or status filter."}
          </p>
          {myRfqs.length === 0 && config.role === "buyer" && (
            <Button asChild className="mt-4 gap-2">
              <Link href={`/rfq/new`}>
                <Plus className="h-4 w-4" />
                {config.createLabel || "Submit RFQ"}
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
