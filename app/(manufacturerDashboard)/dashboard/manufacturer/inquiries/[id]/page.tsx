"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Building2,
  Package,
  Calendar,
  MapPin,
  Mail,
  MessageSquare,
  FileText,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Swal from "sweetalert2"
import {
  getManufacturerRfq,
  sendManufacturerRfqReply,
  sendManufacturerRfqQuote,
  type ManufacturerRfqItem,
} from "@/lib/api/manufacturer-rfqs"

const statusConfig: Record<string, { color: string; label: string; icon: typeof CheckCircle }> = {
  pending:   { color: "bg-amber-100 text-amber-700",    label: "Pending",   icon: Clock },
  in_review: { color: "bg-blue-100 text-blue-700",      label: "In Review", icon: AlertCircle },
  quoted:    { color: "bg-emerald-100 text-emerald-700", label: "Quoted",    icon: CheckCircle },
  accepted:  { color: "bg-green-100 text-green-700",    label: "Accepted",  icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-700",        label: "Cancelled", icon: XCircle },
  expired:   { color: "bg-gray-100 text-gray-600",      label: "Expired",   icon: Clock },
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default function InquiryDetailPage() {
  const params = useParams()
  const id = Number(params.id)

  const [rfq, setRfq] = useState<ManufacturerRfqItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Reply state
  const [reply, setReply] = useState("")
  const [replySubmitting, setReplySubmitting] = useState(false)

  // Quote dialog state
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)
  const [quoteForm, setQuoteForm] = useState({
    quoted_price: "",
    quote_currency_code: "USD",
    minimum_order_quantity: "",
    lead_time_days: "",
    quote_valid_until: "",
    manufacturer_reply: "",
  })
  const [quoteSubmitting, setQuoteSubmitting] = useState(false)

  const fetchRfq = async () => {
    setIsLoading(true)
    const { data, error } = await getManufacturerRfq(id)
    if (data) {
      setRfq(data)
      setReply(data.manufacturer_reply ?? "")
      setQuoteForm({
        quoted_price: data.quoted_price ?? "",
        quote_currency_code: data.quote_currency_code ?? "USD",
        minimum_order_quantity: data.minimum_order_quantity?.toString() ?? "",
        lead_time_days: data.lead_time_days?.toString() ?? "",
        quote_valid_until: data.quote_valid_until ? data.quote_valid_until.split("T")[0] : "",
        manufacturer_reply: data.manufacturer_reply ?? "",
      })
    } else {
      setNotFound(true)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!isNaN(id)) fetchRfq()
    else setNotFound(true)
  }, [id])

  const handleReplySubmit = async () => {
    if (!rfq || !reply.trim()) return
    setReplySubmitting(true)
    const { success, error } = await sendManufacturerRfqReply(rfq.id, { manufacturer_reply: reply.trim() })
    setReplySubmitting(false)
    if (success) {
      await Swal.fire({ icon: "success", title: "Reply Sent", text: "Your reply has been sent to the buyer.", confirmButtonColor: "#6366f1" })
      fetchRfq()
    } else {
      await Swal.fire({ icon: "error", title: "Error", text: error ?? "Failed to send reply.", confirmButtonColor: "#6366f1" })
    }
  }

  const handleQuoteSubmit = async () => {
    if (!rfq) return
    if (!quoteForm.quoted_price || !quoteForm.minimum_order_quantity || !quoteForm.lead_time_days || !quoteForm.quote_valid_until || !quoteForm.manufacturer_reply.trim()) {
      await Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill in all required fields.", confirmButtonColor: "#6366f1" })
      return
    }
    setQuoteSubmitting(true)
    const { success, error } = await sendManufacturerRfqQuote(rfq.id, {
      quoted_price: parseFloat(quoteForm.quoted_price),
      quote_currency_code: quoteForm.quote_currency_code,
      minimum_order_quantity: parseInt(quoteForm.minimum_order_quantity),
      lead_time_days: parseInt(quoteForm.lead_time_days),
      quote_valid_until: quoteForm.quote_valid_until,
      manufacturer_reply: quoteForm.manufacturer_reply.trim(),
    })
    setQuoteSubmitting(false)
    setShowQuoteDialog(false)
    if (success) {
      await Swal.fire({ icon: "success", title: "Quote Sent", text: "Your quote has been submitted to the buyer.", confirmButtonColor: "#6366f1" })
      fetchRfq()
    } else {
      await Swal.fire({ icon: "error", title: "Error", text: error ?? "Failed to send quote.", confirmButtonColor: "#6366f1" })
    }
  }

  const canSendQuote = (status: string) => status === "pending" || status === "in_review"
  const canReply = (status: string) => status !== "cancelled" && status !== "expired"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (notFound || !rfq) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/manufacturer/inquiries" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Inquiries
          </Link>
        </Button>
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold text-foreground">Inquiry not found</h3>
          <p className="mt-2 text-muted-foreground">This inquiry does not exist or you don't have access to it.</p>
        </div>
      </div>
    )
  }

  const config = statusConfig[rfq.status] ?? { color: "bg-gray-100 text-gray-600", label: rfq.status, icon: Clock }
  const StatusIcon = config.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/manufacturer/inquiries">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-medium text-foreground">{rfq.rfq_number}</h1>
              <Badge className={config.color}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">Received {formatDate(rfq.created_at)}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {canSendQuote(rfq.status) && (
            <Button className="gap-2" onClick={() => setShowQuoteDialog(true)}>
              <FileText className="h-4 w-4" />
              Send Quote
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Request */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{rfq.product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{rfq.quantity.toLocaleString()} {rfq.quantity_unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Price</p>
                  <p className="font-medium">{rfq.target_currency_code} {rfq.target_price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Required Delivery</p>
                  <p className="font-medium">{formatDate(rfq.required_delivery_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shipping Terms</p>
                  <p className="font-medium">{rfq.shipping_terms}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{rfq.destination_port_city}, {rfq.destination_country}</p>
                </div>
                {rfq.packaging_details && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Packaging</p>
                    <p className="font-medium">{rfq.packaging_details}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Buyer Message */}
          {rfq.additional_requirements && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Additional Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{rfq.additional_requirements}</p>
              </CardContent>
            </Card>
          )}

          {/* Quote Details (if quoted) */}
          {rfq.quoted_price && (
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="h-5 w-5" />
                  Quote Submitted
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quoted Price</p>
                    <p className="font-medium">{rfq.quote_currency_code} {rfq.quoted_price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Min. Order Qty</p>
                    <p className="font-medium">{rfq.minimum_order_quantity?.toLocaleString()} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lead Time</p>
                    <p className="font-medium">{rfq.lead_time_days} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quote Valid Until</p>
                    <p className="font-medium">{formatDate(rfq.quote_valid_until)}</p>
                  </div>
                </div>
                {rfq.manufacturer_reply && (
                  <div>
                    <p className="text-sm text-muted-foreground">Your Message</p>
                    <p className="mt-1 text-foreground leading-relaxed">{rfq.manufacturer_reply}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reply Section */}
          {canReply(rfq.status) && (
            <Card>
              <CardHeader>
                <CardTitle>Reply to Buyer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your reply to the buyer..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button className="gap-2" onClick={handleReplySubmit} disabled={replySubmitting || !reply.trim()}>
                    {replySubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Buyer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Buyer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{rfq.buyer.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm break-all">{rfq.buyer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{rfq.destination_port_city}, {rfq.destination_country}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">RFQ received</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(rfq.created_at)}</p>
                  </div>
                </div>
                {rfq.quoted_at && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Send className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Quote sent</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(rfq.quoted_at)}</p>
                    </div>
                  </div>
                )}
                {rfq.buyer_action_at && (
                  <div className="flex gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${rfq.status === "cancelled" ? "bg-red-100" : "bg-green-100"}`}>
                      {rfq.status === "cancelled"
                        ? <XCircle className="h-4 w-4 text-red-700" />
                        : <CheckCircle className="h-4 w-4 text-green-700" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {rfq.status === "cancelled" ? "Cancelled by buyer" : "Accepted by buyer"}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(rfq.buyer_action_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Send Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Quotation</DialogTitle>
            <DialogDescription>
              Provide pricing details for {rfq.product.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="q_price">Quoted Price *</Label>
                <Input
                  id="q_price"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 16.50"
                  value={quoteForm.quoted_price}
                  onChange={(e) => setQuoteForm((f) => ({ ...f, quoted_price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q_currency">Currency *</Label>
                <Select
                  value={quoteForm.quote_currency_code}
                  onValueChange={(v) => setQuoteForm((f) => ({ ...f, quote_currency_code: v }))}
                >
                  <SelectTrigger id="q_currency">
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
                <Label htmlFor="q_moq">Min. Order Qty *</Label>
                <Input
                  id="q_moq"
                  type="number"
                  placeholder="e.g. 1000"
                  value={quoteForm.minimum_order_quantity}
                  onChange={(e) => setQuoteForm((f) => ({ ...f, minimum_order_quantity: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q_lead">Lead Time (days) *</Label>
                <Input
                  id="q_lead"
                  type="number"
                  placeholder="e.g. 30"
                  value={quoteForm.lead_time_days}
                  onChange={(e) => setQuoteForm((f) => ({ ...f, lead_time_days: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="q_valid">Quote Valid Until *</Label>
              <Input
                id="q_valid"
                type="date"
                value={quoteForm.quote_valid_until}
                onChange={(e) => setQuoteForm((f) => ({ ...f, quote_valid_until: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q_reply">Message to Buyer *</Label>
              <Textarea
                id="q_reply"
                placeholder="e.g. FOB Shenzhen, includes standard export packing."
                value={quoteForm.manufacturer_reply}
                onChange={(e) => setQuoteForm((f) => ({ ...f, manufacturer_reply: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuoteDialog(false)} disabled={quoteSubmitting}>
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
