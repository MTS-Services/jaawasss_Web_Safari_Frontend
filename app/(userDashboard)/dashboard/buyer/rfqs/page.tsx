"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getBuyerRfqById, getBuyerRfqs, respondToRfqQuote, type BuyerRfqItem, type BuyerRfqMeta } from "@/lib/api/buyer-rfqs"
import { 
  Plus,
  Search,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MessageSquare,
  Check,
  X
} from "lucide-react"

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle; label: string }> = {
  quoted: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle, label: "Quoted" },
  pending: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Pending" },
  in_review: { color: "bg-blue-100 text-blue-700", icon: Eye, label: "In Review" },
  expired: { color: "bg-gray-100 text-gray-700", icon: AlertCircle, label: "Expired" },
  completed: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Completed" },
  cancelled: { color: "bg-red-100 text-red-700", icon: X, label: "Cancelled" },
}

function formatDate(value: string | null): string {
  if (!value) {
    return "N/A"
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return "N/A"
  }

  return parsed.toLocaleDateString()
}

function formatQuantity(quantity: number, unit: string): string {
  const formatted = Number.isFinite(quantity) ? new Intl.NumberFormat().format(quantity) : "0"
  return `${formatted} ${unit}`.trim()
}

function getStatusMeta(status: string) {
  const normalized = status.trim().toLowerCase()
  return statusConfig[normalized] || {
    color: "bg-slate-100 text-slate-700",
    icon: Clock,
    label: normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : "Unknown",
  }
}

/**
 * Get the display status for frontend rendering
 * Shows "Quoted" for both "quoted" and "accepted" statuses
 */
function getDisplayStatus(actualStatus: string): string {
  const normalized = actualStatus.trim().toLowerCase()
  if (normalized === "accepted" || normalized === "quoted") {
    return "quoted"
  }
  return normalized
}

/**
 * Check if RFQ can be accepted or rejected (only if status is "quoted")
 */
function canRespondToQuote(status: string): boolean {
  const normalized = status.trim().toLowerCase()
  return normalized === "quoted"
}

export default function BuyerRFQsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [rfqs, setRfqs] = useState<BuyerRfqItem[]>([])
  const [meta, setMeta] = useState<BuyerRfqMeta | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailData, setDetailData] = useState<BuyerRfqItem | null>(null)
  const [detailError, setDetailError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadRfqs() {
      setIsLoading(true)
      setErrorMessage(null)

      const response = await getBuyerRfqs({
        page: currentPage,
        perPage: 10,
        search: searchQuery.trim() || undefined,
        status: statusFilter,
      })

      if (!mounted) {
        return
      }

      if (!response.success) {
        setRfqs([])
        setMeta(null)
        setErrorMessage(response.message || "Failed to fetch RFQs.")
        setIsLoading(false)
        return
      }

      setRfqs(response.data)
      setMeta(response.meta)
      setIsLoading(false)
    }

    void loadRfqs()

    return () => {
      mounted = false
    }
  }, [currentPage, searchQuery, statusFilter])

  const openDetails = async (id: number) => {
    setIsDetailOpen(true)
    setIsDetailLoading(true)
    setDetailData(null)
    setDetailError(null)

    const response = await getBuyerRfqById(id)
    if (!response.success || !response.data) {
      setDetailError(response.message || "Failed to fetch RFQ details.")
      setIsDetailLoading(false)
      return
    }

    setDetailData(response.data)
    setIsDetailLoading(false)
  }

  const handleAccept = async (rfqId: number) => {
    try {
      const response = await respondToRfqQuote(rfqId, "accept")

      if (!response.success) {
        throw new Error(response.message || "Failed to accept RFQ")
      }

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.message || "RFQ accepted successfully",
        confirmButtonText: "OK",
      })

      // Refresh the list
      setCurrentPage(1)
      setSearchQuery("")
      setStatusFilter("all")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
        confirmButtonText: "OK",
      })
    }
  }

  const handleReject = async (rfqId: number) => {
    try {
      const response = await respondToRfqQuote(rfqId, "cancel")

      if (!response.success) {
        throw new Error(response.message || "Failed to reject RFQ")
      }

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.message || "RFQ rejected successfully",
        confirmButtonText: "OK",
      })

      // Refresh the list
      setCurrentPage(1)
      setSearchQuery("")
      setStatusFilter("all")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
        confirmButtonText: "OK",
      })
    }
  }

  const totalRfqs = meta?.total ?? rfqs.length
  const quotedCount = rfqs.filter((r) => r.status === "quoted").length
  const pendingCount = rfqs.filter((r) => r.status === "pending").length
  const cancelledCount = rfqs.filter((r) => r.status === "cancelled").length
  const from = meta?.from ?? 0
  const to = meta?.to ?? rfqs.length
  const canGoPrev = (meta?.currentPage ?? currentPage) > 1
  const canGoNext = (meta?.currentPage ?? currentPage) < (meta?.lastPage ?? currentPage)

  const onSearchChange = (value: string) => {
    setCurrentPage(1)
    setSearchQuery(value)
  }

  const onStatusChange = (value: string) => {
    setCurrentPage(1)
    setStatusFilter(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Request for Quotes</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and track your RFQ submissions
          </p>
        </div>
        {/*
        <Button className="gap-2" asChild>
          <Link href="/rfq/new">
            <Plus className="h-4 w-4" />
            New RFQ
          </Link>
        </Button>
        */}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-foreground">{totalRfqs}</div>
          <p className="text-sm text-muted-foreground">Total RFQs</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-emerald-600">{quotedCount}</div>
          <p className="text-sm text-muted-foreground">Quoted</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-red-600">{cancelledCount}</div>
          <p className="text-sm text-muted-foreground">Cancelled</p>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by product, supplier, or RFQ ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* RFQ Table (desktop) and cards (mobile) */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading RFQs...</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left text-sm">
                    <th className="px-5 py-3 font-medium text-muted-foreground">RFQ ID</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Product</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Supplier</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Quantity</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Target Price</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rfqs.map((rfq) => {
                    const statusMeta = getStatusMeta(getDisplayStatus(rfq.status))
                    const StatusIcon = statusMeta.icon
                    return (
                      <tr key={rfq.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-foreground">{rfq.rfqNumber}</td>
                        <td className="px-5 py-4 text-sm text-foreground">{rfq.productName}</td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{rfq.supplierCompanyName}</td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{formatQuantity(rfq.quantity, rfq.quantityUnit)}</td>
                        <td className="px-5 py-4">
                          <Badge className={statusMeta.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusMeta.label}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-sm text-foreground">
                          {rfq.targetCurrencyCode} {rfq.targetPrice}
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{formatDate(rfq.createdAt)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => void openDetails(rfq.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <Link href="/dashboard/buyer/messages">
                                <MessageSquare className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            {rfqs.length > 0 && (
              <div className="md:hidden p-4 space-y-3">
                {rfqs.map((rfq) => {
                  const statusMeta = getStatusMeta(getDisplayStatus(rfq.status))
                  const StatusIcon = statusMeta.icon
                  return (
                    <div key={rfq.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{rfq.productName}</p>
                          <p className="text-sm text-muted-foreground truncate">{rfq.supplierCompanyName}</p>
                          <p className="text-sm text-muted-foreground mt-1 truncate">{formatQuantity(rfq.quantity, rfq.quantityUnit)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={statusMeta.color + " text-xs"}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusMeta.label}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{formatDate(rfq.createdAt)}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button className="flex-1" variant="outline" onClick={() => void openDetails(rfq.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button className="flex-1" variant="outline" asChild>
                          <Link href="/dashboard/buyer/messages">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {rfqs.length === 0 && (
              <div className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold text-foreground">No RFQs found</h3>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery || statusFilter !== "all" ? "Try adjusting your filters" : "Submit your first RFQ to get started"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button className="mt-4 gap-2" asChild>
                    <Link href="/rfq/new">
                      <Plus className="h-4 w-4" />
                      Submit RFQ
                    </Link>
                  </Button>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {rfqs.length > 0 ? from : 0} to {rfqs.length > 0 ? to : 0} of {totalRfqs}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canGoPrev || isLoading}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {meta?.currentPage ?? currentPage} of {meta?.lastPage ?? 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canGoNext || isLoading}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>RFQ Details</DialogTitle>
            <DialogDescription>
              Review your RFQ details and requirements.
            </DialogDescription>
          </DialogHeader>

          {isDetailLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading RFQ details...</div>
          ) : detailError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {detailError}
            </div>
          ) : detailData ? (
            <div className="grid gap-4 py-2 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">RFQ Number</p>
                <p className="mt-1 text-sm font-medium text-foreground">{detailData.rfqNumber}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                <div className="mt-1">
                  <Badge className={getStatusMeta(detailData.status).color}>
                    {getStatusMeta(detailData.status).label}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Product</p>
                <p className="mt-1 text-sm text-foreground">{detailData.productName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Quantity</p>
                <p className="mt-1 text-sm text-foreground">{formatQuantity(detailData.quantity, detailData.quantityUnit)}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Supplier</p>
                <p className="mt-1 text-sm text-foreground">{detailData.supplierCompanyName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Supplier Location</p>
                <p className="mt-1 text-sm text-foreground">{detailData.supplierLocation}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Target Price</p>
                <p className="mt-1 text-sm text-foreground">{detailData.targetCurrencyCode} {detailData.targetPrice}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Required Delivery</p>
                <p className="mt-1 text-sm text-foreground">{formatDate(detailData.requiredDeliveryDate)}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Shipping Terms</p>
                <p className="mt-1 text-sm text-foreground">{detailData.shippingTerms}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Destination</p>
                <p className="mt-1 text-sm text-foreground">{detailData.destinationCountry}, {detailData.destinationPortCity}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Packaging Details</p>
                <p className="mt-1 text-sm text-foreground">{detailData.packagingDetails}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Additional Requirements</p>
                <p className="mt-1 text-sm text-foreground">{detailData.additionalRequirements}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No details found.</div>
          )}

          <DialogFooter className="flex gap-2">
            {detailData && canRespondToQuote(detailData.status) && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailOpen(false)
                    void handleReject(detailData.id)
                  }}
                  className="text-red-600 border-red-200 cursor-pointer"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailOpen(false)
                    void handleAccept(detailData.id)
                  }}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Accept
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
