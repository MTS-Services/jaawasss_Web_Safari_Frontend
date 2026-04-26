"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  Eye,
  Send,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Swal from "sweetalert2"
import {
  getManufacturerRfqCounts,
  getManufacturerRfqs,
  sendManufacturerRfqReply,
  sendManufacturerRfqQuote,
  type ManufacturerRfqItem,
  type ManufacturerRfqCounts,
} from "@/lib/api/manufacturer-rfqs"

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle; label: string }> = {
  pending:   { color: "bg-amber-100 text-amber-700",    icon: Clock,       label: "Pending" },
  in_review: { color: "bg-blue-100 text-blue-700",      icon: AlertCircle, label: "In Review" },
  quoted:    { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle, label: "Quoted" },
  accepted:  { color: "bg-green-100 text-green-700",    icon: CheckCircle, label: "Accepted" },
  cancelled: { color: "bg-red-100 text-red-700",        icon: XCircle,     label: "Cancelled" },
  expired:   { color: "bg-gray-100 text-gray-600",      icon: Clock,       label: "Expired" },
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export default function ManufacturerInquiriesPage() {
  const [rfqs, setRfqs] = useState<ManufacturerRfqItem[]>([])
  const [counts, setCounts] = useState<ManufacturerRfqCounts | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)

  // Reply modal state
  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const [selectedRfq, setSelectedRfq] = useState<ManufacturerRfqItem | null>(null)
  const [replyText, setReplyText] = useState("")
  const [replySubmitting, setReplySubmitting] = useState(false)

  // Quote modal state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [quoteRfq, setQuoteRfq] = useState<ManufacturerRfqItem | null>(null)
  const [quoteForm, setQuoteForm] = useState({
    quoted_price: "",
    quote_currency_code: "USD",
    minimum_order_quantity: "",
    lead_time_days: "",
    quote_valid_until: "",
    manufacturer_reply: "",
  })
  const [quoteSubmitting, setQuoteSubmitting] = useState(false)

  const fetchData = useCallback(async (page = 1) => {
    setIsLoading(true)
    const [countsRes, rfqsRes] = await Promise.all([
      getManufacturerRfqCounts(),
      getManufacturerRfqs({
        page,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
      }),
    ])
    if (countsRes.data) setCounts(countsRes.data)
    if (rfqsRes.data) {
      setRfqs(rfqsRes.data.data)
      setLastPage(rfqsRes.data.meta.last_page)
      setTotal(rfqsRes.data.meta.total)
    }
    setIsLoading(false)
  }, [statusFilter, searchQuery])

  useEffect(() => {
    setCurrentPage(1)
    fetchData(1)
  }, [statusFilter, searchQuery])

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage])

  // Reply modal handlers
  const openReplyModal = (rfq: ManufacturerRfqItem) => {
    setSelectedRfq(rfq)
    setReplyText(rfq.manufacturer_reply ?? "")
    setReplyModalOpen(true)
  }

  const handleReplySubmit = async () => {
    if (!selectedRfq || !replyText.trim()) return
    setReplySubmitting(true)
    const { success, error } = await sendManufacturerRfqReply(selectedRfq.id, {
      manufacturer_reply: replyText.trim(),
    })
    setReplySubmitting(false)
    setReplyModalOpen(false)
    if (success) {
      await Swal.fire({ icon: "success", title: "Reply Sent", text: "Your reply has been sent to the buyer.", confirmButtonColor: "#6366f1" })
      fetchData(currentPage)
    } else {
      await Swal.fire({ icon: "error", title: "Error", text: error ?? "Failed to send reply.", confirmButtonColor: "#6366f1" })
    }
  }

  // Quote modal handlers
  const openQuoteModal = (rfq: ManufacturerRfqItem) => {
    setQuoteRfq(rfq)
    setQuoteForm({
      quoted_price: rfq.quoted_price ?? "",
      quote_currency_code: rfq.quote_currency_code ?? "USD",
      minimum_order_quantity: rfq.minimum_order_quantity?.toString() ?? "",
      lead_time_days: rfq.lead_time_days?.toString() ?? "",
      quote_valid_until: rfq.quote_valid_until ? rfq.quote_valid_until.split("T")[0] : "",
      manufacturer_reply: rfq.manufacturer_reply ?? "",
    })
    setQuoteModalOpen(true)
  }

  const handleQuoteSubmit = async () => {
    if (!quoteRfq) return
    if (!quoteForm.quoted_price || !quoteForm.minimum_order_quantity || !quoteForm.lead_time_days || !quoteForm.quote_valid_until || !quoteForm.manufacturer_reply.trim()) {
      await Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill in all required fields.", confirmButtonColor: "#6366f1" })
      return
    }
    setQuoteSubmitting(true)
    const { success, error } = await sendManufacturerRfqQuote(quoteRfq.id, {
      quoted_price: parseFloat(quoteForm.quoted_price),
      quote_currency_code: quoteForm.quote_currency_code,
      minimum_order_quantity: parseInt(quoteForm.minimum_order_quantity),
      lead_time_days: parseInt(quoteForm.lead_time_days),
      quote_valid_until: quoteForm.quote_valid_until,
      manufacturer_reply: quoteForm.manufacturer_reply.trim(),
    })
    setQuoteSubmitting(false)
    setQuoteModalOpen(false)
    if (success) {
      await Swal.fire({ icon: "success", title: "Quote Sent", text: "Your quote has been submitted to the buyer.", confirmButtonColor: "#6366f1" })
      fetchData(currentPage)
    } else {
      await Swal.fire({ icon: "error", title: "Error", text: error ?? "Failed to send quote.", confirmButtonColor: "#6366f1" })
    }
  }

  const canSendQuote = (status: string) => status === "pending" || status === "in_review"
  const canReply = (status: string) => status !== "cancelled" && status !== "expired"

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Buyer Inquiries</h1>
        <p className="mt-1 text-muted-foreground">Manage and respond to buyer requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-foreground">{counts?.total_rfqs ?? "—"}</div>
          <p className="text-sm text-muted-foreground">Total RFQs</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-amber-600">{counts?.in_review ?? "—"}</div>
          <p className="text-sm text-muted-foreground">In Review</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-emerald-600">{counts?.quoted ?? "—"}</div>
          <p className="text-sm text-muted-foreground">Quoted</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-green-600">{counts?.accepted ?? "—"}</div>
          <p className="text-sm text-muted-foreground">Accepted</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-red-600">{counts?.cancelled ?? "—"}</div>
          <p className="text-sm text-muted-foreground">Cancelled</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-gray-500">{counts?.expired ?? "—"}</div>
          <p className="text-sm text-muted-foreground">Expired</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by buyer, product, or RFQ number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Inquiries List */}
      {!isLoading && (
        <div className="space-y-4">
          {rfqs.map((rfq) => {
            const config = statusConfig[rfq.status] ?? { color: "bg-gray-100 text-gray-600", icon: Clock, label: rfq.status }
            const StatusIcon = config.icon
            return (
              <div
                key={rfq.id}
                className="rounded-xl border border-border bg-card p-4 sm:p-5 transition-all hover:shadow-md overflow-hidden"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">{rfq.rfq_number}</span>
                      <Badge className={config.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>
                    <h3 className="mt-2 font-semibold text-foreground">{rfq.buyer.name}</h3>
                    <p className="text-sm text-muted-foreground">{rfq.buyer.email}</p>

                    <div className="mt-3 rounded-lg bg-muted p-3">
                      <p className="text-sm font-medium text-foreground">{rfq.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {rfq.quantity.toLocaleString()} {rfq.quantity_unit}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Target Price: {rfq.target_currency_code} {rfq.target_price}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Destination: {rfq.destination_port_city}, {rfq.destination_country}
                      </p>
                      {rfq.additional_requirements && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{rfq.additional_requirements}</p>
                      )}
                    </div>

                    {rfq.quoted_price && (
                      <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                        <p className="text-xs font-medium text-emerald-700 mb-1">Quote Submitted</p>
                        <p className="text-sm text-emerald-800">
                          Price: {rfq.quote_currency_code} {rfq.quoted_price} · MOQ: {rfq.minimum_order_quantity?.toLocaleString()} units · Lead time: {rfq.lead_time_days} days
                        </p>
                        {rfq.manufacturer_reply && (
                          <p className="mt-1 text-sm text-emerald-700 line-clamp-1">{rfq.manufacturer_reply}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end min-w-0">
                    <span className="text-xs text-muted-foreground">{formatDate(rfq.created_at)}</span>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="h-8 px-2 sm:h-9 sm:px-4 gap-1" asChild>
                        <Link href={`/dashboard/manufacturer/inquiries/${rfq.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">View</span>
                        </Link>
                      </Button>
                      {canReply(rfq.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 sm:h-9 sm:px-4 gap-1"
                          onClick={() => openReplyModal(rfq)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">Reply</span>
                        </Button>
                      )}
                      {canSendQuote(rfq.status) && (
                        <Button
                          size="sm"
                          className="h-8 px-2 sm:h-9 sm:px-4 gap-1"
                          onClick={() => openQuoteModal(rfq)}
                        >
                          <Send className="h-4 w-4" />
                          <span className="hidden sm:inline">Send Quote</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {rfqs.length === 0 && (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold text-foreground">No inquiries found</h3>
              <p className="mt-2 text-muted-foreground">
                {searchQuery || statusFilter !== "all" ? "Try adjusting your filters" : "New buyer inquiries will appear here"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && lastPage > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {rfqs.length} of {total} inquiries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-2 text-sm">
              Page {currentPage} of {lastPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= lastPage}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {selectedRfq?.rfq_number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Buyer: <span className="font-medium text-foreground">{selectedRfq?.buyer.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Product: <span className="font-medium text-foreground">{selectedRfq?.product.name}</span>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply-text">Your Reply</Label>
              <Textarea
                id="reply-text"
                placeholder="Type your reply to the buyer..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyModalOpen(false)} disabled={replySubmitting}>
              Cancel
            </Button>
            <Button onClick={handleReplySubmit} disabled={replySubmitting || !replyText.trim()} className="gap-2">
              {replySubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Quote Modal */}
      <Dialog open={quoteModalOpen} onOpenChange={setQuoteModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Quote for {quoteRfq?.rfq_number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Buyer: <span className="font-medium text-foreground">{quoteRfq?.buyer.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Product: <span className="font-medium text-foreground">{quoteRfq?.product.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Target: {quoteRfq?.target_currency_code} {quoteRfq?.target_price} · {quoteRfq?.quantity.toLocaleString()} {quoteRfq?.quantity_unit}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quoted_price">Quoted Price *</Label>
                <Input
                  id="quoted_price"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 16.50"
                  value={quoteForm.quoted_price}
                  onChange={(e) => setQuoteForm((f) => ({ ...f, quoted_price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote_currency_code">Currency *</Label>
                <Select
                  value={quoteForm.quote_currency_code}
                  onValueChange={(v) => setQuoteForm((f) => ({ ...f, quote_currency_code: v }))}
                >
                  <SelectTrigger id="quote_currency_code">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CNY">CNY</SelectItem>
                    <SelectItem value="BDT">BDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimum_order_quantity">Min. Order Qty *</Label>
                <Input
                  id="minimum_order_quantity"
                  type="number"
                  placeholder="e.g. 1000"
                  value={quoteForm.minimum_order_quantity}
                  onChange={(e) => setQuoteForm((f) => ({ ...f, minimum_order_quantity: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead_time_days">Lead Time (days) *</Label>
                <Input
                  id="lead_time_days"
                  type="number"
                  placeholder="e.g. 30"
                  value={quoteForm.lead_time_days}
                  onChange={(e) => setQuoteForm((f) => ({ ...f, lead_time_days: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote_valid_until">Quote Valid Until *</Label>
              <Input
                id="quote_valid_until"
                type="date"
                value={quoteForm.quote_valid_until}
                onChange={(e) => setQuoteForm((f) => ({ ...f, quote_valid_until: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer_reply_quote">Message to Buyer *</Label>
              <Textarea
                id="manufacturer_reply_quote"
                placeholder="e.g. FOB Shenzhen, includes standard export packing."
                value={quoteForm.manufacturer_reply}
                onChange={(e) => setQuoteForm((f) => ({ ...f, manufacturer_reply: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuoteModalOpen(false)} disabled={quoteSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleQuoteSubmit} disabled={quoteSubmitting} className="gap-2">
              {quoteSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
