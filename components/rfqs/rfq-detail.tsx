"use client"

import { useState } from "react"
import Link from "next/link"
import {
  useRfqs,
  RFQ_STATUS_LABELS,
  type RfqStatus,
} from "@/lib/rfqs-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  ImageIcon,
  Send,
  Download,
  AlertCircle,
  Eye,
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

export interface RfqDetailConfig {
  basePath: string
  role: "buyer" | "manufacturer" | "admin"
}

export function RfqDetail({ rfqId, config }: { rfqId: string; config: RfqDetailConfig }) {
  const { getRfqById, addMessage, submitQuote, updateStatus } = useRfqs()
  const rfq = getRfqById(rfqId)

  const [showMessageForm, setShowMessageForm] = useState(false)
  const [showQuoteForm, setShowQuoteForm] = useState(false)

  // Message state
  const [note, setNote] = useState("")

  // Quote state
  const [quoteForm, setQuoteForm] = useState({
    quotedPrice: "",
    quoteCurrencyCode: "USD",
    minimumOrderQuantity: "",
    leadTimeDays: "",
    quoteValidUntil: "",
    manufacturerReply: "",
  })

  if (!rfq) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="font-serif text-xl font-medium text-foreground">RFQ not found</h1>
        <Button asChild variant="outline" className="mt-4">
          <Link href={config.basePath}>Back to list</Link>
        </Button>
      </div>
    )
  }

  const StatusIcon = statusStyles[rfq.status].icon
  const flow: RfqStatus[] = ["pending", "in_review", "quoted", "accepted"]
  const currentIndex = flow.indexOf(rfq.status)

  const handleSendMessage = () => {
    if (!note.trim()) return
    addMessage(rfq.id, note.trim(), config.role as "buyer" | "manufacturer")
    setNote("")
    setShowMessageForm(false)
  }

  const handleSendQuote = () => {
    if (!quoteForm.quotedPrice || !quoteForm.minimumOrderQuantity || !quoteForm.leadTimeDays) return
    submitQuote(rfq.id, {
      quotedPrice: parseFloat(quoteForm.quotedPrice),
      quoteCurrencyCode: quoteForm.quoteCurrencyCode,
      minimumOrderQuantity: parseInt(quoteForm.minimumOrderQuantity),
      leadTimeDays: parseInt(quoteForm.leadTimeDays),
      quoteValidUntil: quoteForm.quoteValidUntil,
      manufacturerReply: quoteForm.manufacturerReply.trim(),
    })
    setShowQuoteForm(false)
  }

  const handleAcceptQuote = () => {
    updateStatus(rfq.id, "accepted", "Buyer accepted the quote.")
  }

  const handleCancelRfq = () => {
    updateStatus(rfq.id, "cancelled", "Buyer cancelled the RFQ.")
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5 text-muted-foreground">
        <Link href={config.basePath}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{rfq.id}</span>
              <Badge className={cn("gap-1 text-xs", statusStyles[rfq.status].color)}>
                <StatusIcon className="h-3 w-3" />
                {RFQ_STATUS_LABELS[rfq.status]}
              </Badge>
            </div>
            <h1 className="mt-1.5 font-serif text-2xl font-medium text-foreground">{rfq.productName}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {config.role === "buyer" ? (rfq.supplierCompanyName || "Any Supplier") : rfq.buyerCompany}
            </p>
          </div>
          <div className="text-right">
            <p className="font-serif text-2xl font-medium text-foreground">
              {formatCurrency(rfq.targetPrice, rfq.targetCurrencyCode)} target
            </p>
            <p className="text-xs text-muted-foreground">{rfq.quantity.toLocaleString()} {rfq.quantityUnit}</p>
          </div>
        </div>

        {/* Stepper */}
        {rfq.status !== "cancelled" && rfq.status !== "expired" && (
          <div className="mt-6 flex items-center">
            {flow.map((s, i) => {
              const reached = i <= currentIndex
              return (
                <div key={s} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors",
                        reached
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {reached ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className="mt-1.5 hidden text-center text-[10px] leading-tight text-muted-foreground sm:block">
                      {RFQ_STATUS_LABELS[s]}
                    </span>
                  </div>
                  {i < flow.length - 1 && (
                    <div className={cn("mx-1 h-0.5 flex-1", i < currentIndex ? "bg-secondary" : "bg-border")} />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          {/* Action Area */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-medium text-foreground">Activity & Updates</h2>
              <div className="flex flex-wrap gap-2">
                {config.role === "manufacturer" && (rfq.status === "pending" || rfq.status === "in_review") && (
                  <Button size="sm" className="gap-1.5" onClick={() => setShowQuoteForm(!showQuoteForm)}>
                    <Plus className="h-4 w-4" />
                    {showQuoteForm ? "Cancel Quote" : "Submit Quote"}
                  </Button>
                )}
                {config.role === "buyer" && rfq.status === "quoted" && (
                  <Button size="sm" className="gap-1.5" onClick={handleAcceptQuote}>
                    <CheckCircle2 className="h-4 w-4" />
                    Accept Quote
                  </Button>
                )}
                {config.role === "buyer" && rfq.status !== "cancelled" && rfq.status !== "accepted" && (
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCancelRfq}>
                    <XCircle className="h-4 w-4" />
                    Cancel RFQ
                  </Button>
                )}
                {rfq.status !== "cancelled" && rfq.status !== "expired" && config.role !== "admin" && !showQuoteForm && (
                  <Button size="sm" variant={showMessageForm ? "outline" : "secondary"} className="gap-1.5" onClick={() => setShowMessageForm(!showMessageForm)}>
                    <Plus className="h-4 w-4" />
                    {showMessageForm ? "Cancel Note" : "Add Note"}
                  </Button>
                )}
              </div>
            </div>

            {/* Forms */}
            {showMessageForm && !showQuoteForm && (
              <div className="mt-4 space-y-4 rounded-lg border border-border bg-muted/20 p-4">
                <div className="space-y-2">
                  <Label className="text-sm">Update note</Label>
                  <Textarea
                    placeholder="Share a message or update..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSendMessage} disabled={!note.trim()} className="gap-1.5">
                  <Send className="h-4 w-4" />
                  Post note
                </Button>
              </div>
            )}

            {showQuoteForm && (
              <div className="mt-4 space-y-4 rounded-lg border border-border bg-muted/20 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quoted Price</Label>
                    <Input type="number" placeholder="0.00" value={quoteForm.quotedPrice} onChange={e => setQuoteForm({...quoteForm, quotedPrice: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={quoteForm.quoteCurrencyCode} onValueChange={v => setQuoteForm({...quoteForm, quoteCurrencyCode: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min. Order Qty</Label>
                    <Input type="number" placeholder="100" value={quoteForm.minimumOrderQuantity} onChange={e => setQuoteForm({...quoteForm, minimumOrderQuantity: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Lead Time (days)</Label>
                    <Input type="number" placeholder="30" value={quoteForm.leadTimeDays} onChange={e => setQuoteForm({...quoteForm, leadTimeDays: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input type="date" value={quoteForm.quoteValidUntil} onChange={e => setQuoteForm({...quoteForm, quoteValidUntil: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Message / Terms</Label>
                  <Textarea placeholder="Any specific terms..." value={quoteForm.manufacturerReply} onChange={e => setQuoteForm({...quoteForm, manufacturerReply: e.target.value})} />
                </div>
                <Button onClick={handleSendQuote} className="gap-1.5">
                  <Send className="h-4 w-4" />
                  Submit Quote
                </Button>
              </div>
            )}

            {/* Timeline */}
            <div className="mt-5 space-y-5">
              {[...rfq.updates].reverse().map((u) => {
                const UIcon = statusStyles[u.status].icon
                return (
                  <div key={u.id} className="relative flex gap-3 pb-1">
                    <div className="flex flex-col items-center">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", statusStyles[u.status].color)}>
                        <UIcon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{RFQ_STATUS_LABELS[u.status]}</span>
                        <span className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-[10px] capitalize">{u.author}</Badge>
                      </div>
                      {u.note && <p className="mt-1 text-sm text-muted-foreground">{u.note}</p>}
                      {u.files.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {u.files.map((f) => (
                            <Badge key={f.id} variant="secondary" className="gap-1 text-xs">
                              <FileText className="h-3 w-3" />
                              {f.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-medium text-foreground">Details</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <Row label="Quantity" value={`${rfq.quantity.toLocaleString()} ${rfq.quantityUnit}`} />
              <Row label="Target Price" value={formatCurrency(rfq.targetPrice, rfq.targetCurrencyCode)} />
              <Row label="Est. delivery" value={new Date(rfq.requiredDeliveryDate).toLocaleDateString()} icon={Calendar} />
              <Row label="Destination" value={`${rfq.destinationPortCity}, ${rfq.destinationCountry}`} />
              <Row label="Shipping terms" value={rfq.shippingTerms} />
            </dl>
            {rfq.additionalRequirements && (
              <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
                <span className="block font-medium text-foreground mb-1">Requirements</span>
                {rfq.additionalRequirements}
              </p>
            )}
            {rfq.packagingDetails && (
              <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
                <span className="block font-medium text-foreground mb-1">Packaging</span>
                {rfq.packagingDetails}
              </p>
            )}
          </div>

          {rfq.quotedPrice && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-medium text-foreground text-emerald-600">Quote Submitted</h2>
              <dl className="mt-3 space-y-3 text-sm">
                <Row label="Quoted Price" value={formatCurrency(rfq.quotedPrice, rfq.quoteCurrencyCode || "USD")} />
                <Row label="Min. Order" value={`${rfq.minimumOrderQuantity?.toLocaleString()}`} />
                <Row label="Lead Time" value={`${rfq.leadTimeDays} days`} />
                {rfq.quoteValidUntil && <Row label="Valid until" value={new Date(rfq.quoteValidUntil).toLocaleDateString()} icon={Calendar} />}
              </dl>
              {rfq.manufacturerReply && (
                <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">{rfq.manufacturerReply}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Calendar }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1.5 text-right font-medium text-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {value}
      </dd>
    </div>
  )
}
