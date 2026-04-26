"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getAdminRfqById, getAdminRfqs, type AdminRfqItem } from "@/lib/api/admin-rfqs"
import { 
  FileText,
  User,
  Factory,
  Eye,
  Clock,
  CalendarDays,
  Coins,
  MessageSquare,
  Boxes
} from "lucide-react"

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  quoted: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-700"
}

function formatDate(value: string | null): string {
  if (!value) {
    return "N/A"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "N/A"
  }

  return date.toLocaleDateString()
}

function formatQuantity(quantity: number, unit: string): string {
  const formattedQuantity = Number.isFinite(quantity)
    ? new Intl.NumberFormat().format(quantity)
    : "0"

  return `${formattedQuantity} ${unit}`.trim()
}

function formatStatusLabel(status: string): string {
  const normalized = status.trim()
  if (!normalized) {
    return "N/A"
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export default function AdminRFQsPage() {
  const [rfqs, setRfqs] = useState<AdminRfqItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailData, setDetailData] = useState<AdminRfqItem | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadRfqs() {
      setIsLoading(true)
      setErrorMessage(null)

      const response = await getAdminRfqs()
      if (!mounted) {
        return
      }

      if (!response.success) {
        setRfqs([])
        setErrorMessage(response.message || "Failed to fetch RFQs.")
        setIsLoading(false)
        return
      }

      setRfqs(response.data)
      setIsLoading(false)
    }

    void loadRfqs()

    return () => {
      mounted = false
    }
  }, [])

  const openDetails = async (id: number) => {
    setIsDetailOpen(true)
    setIsDetailLoading(true)
    setDetailError(null)
    setDetailData(null)

    const response = await getAdminRfqById(id)
    if (!response.success || !response.data) {
      setDetailError(response.message || "Failed to fetch RFQ details.")
      setIsDetailLoading(false)
      return
    }

    setDetailData(response.data)
    setIsDetailLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">RFQs</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor request for quotations across the platform
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {/* RFQs Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">RFQ ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden md:table-cell">Buyer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden lg:table-cell">Supplier</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden sm:table-cell">Quantity</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="border-t border-border">
                <td className="px-4 py-8 text-center text-sm text-muted-foreground" colSpan={7}>
                  Loading RFQs...
                </td>
              </tr>
            ) : rfqs.length === 0 ? (
              <tr className="border-t border-border">
                <td className="px-4 py-8 text-center text-sm text-muted-foreground" colSpan={7}>
                  No RFQs found.
                </td>
              </tr>
            ) : rfqs.map((rfq) => (
              <tr key={rfq.id} className="border-t border-border hover:bg-muted/50">
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-foreground">{rfq.rfqNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{rfq.productName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {rfq.buyerName || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Factory className="h-3 w-3" />
                    {rfq.supplierCompanyName || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                  {formatQuantity(rfq.quantity, rfq.quantityUnit)}
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusColors[rfq.status] || "bg-slate-100 text-slate-700"} variant="secondary">
                    {rfq.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
                      <Clock className="h-3 w-3" />
                      {formatDate(rfq.createdAt)}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => void openDetails(rfq.id)}>
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                <FileText className="h-4 w-4" />
              </span>
              RFQ Details
            </DialogTitle>
            <DialogDescription>
              View details of this request for quotation.
            </DialogDescription>
          </DialogHeader>

          {isDetailLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading RFQ details...</div>
          ) : detailError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {detailError}
            </div>
          ) : detailData ? (
            <div className="space-y-4 py-1">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">RFQ Number</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-foreground">{detailData.rfqNumber}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <Badge className={statusColors[detailData.status] || "bg-slate-100 text-slate-700"} variant="secondary">
                      {formatStatusLabel(detailData.status)}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Quantity</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{formatQuantity(detailData.quantity, detailData.quantityUnit)}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border">
                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">People & Product</p>

                    <div className="flex items-start gap-2">
                      <Boxes className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Product</p>
                        <p className="text-sm text-foreground">{detailData.productName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Buyer</p>
                        <p className="text-sm text-foreground">{detailData.buyerName || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Factory className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Supplier</p>
                        <p className="text-sm text-foreground">{detailData.supplierCompanyName || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pricing & Timeline</p>

                    <div className="flex items-start gap-2">
                      <Coins className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Target Price</p>
                        <p className="text-sm text-foreground">{detailData.targetCurrencyCode} {detailData.targetPrice}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Required Delivery</p>
                        <p className="text-sm text-foreground">{formatDate(detailData.requiredDeliveryDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Created At</p>
                        <p className="text-sm text-foreground">{formatDate(detailData.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Conversation ID</p>
                        <p className="text-sm text-foreground">{detailData.conversationId == null ? "N/A" : detailData.conversationId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No details found.</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
