"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useOrders,
  formatCurrency,
  formatOrderDate,
  getStatusLabel,
  ORDER_STATUS_FLOW,
  type OrderStatus,
  type OrderActor,
  type OrderKind,
} from "@/lib/orders-context"
import { useMessages } from "@/lib/messages-context"
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
  Truck,
  CheckCircle2,
  Clock,
  Hammer,
  PackageCheck,
  XCircle,
  Plus,
  ImageIcon,
  Send,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusStyles: Record<OrderStatus, { color: string; icon: typeof Clock }> = {
  created: { color: "bg-blue-100 text-blue-700", icon: Clock },
  "in-production": { color: "bg-amber-100 text-amber-700", icon: Hammer },
  ready: { color: "bg-violet-100 text-violet-700", icon: PackageCheck },
  shipped: { color: "bg-cyan-100 text-cyan-700", icon: Truck },
  completed: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  cancelled: { color: "bg-gray-100 text-gray-600", icon: XCircle },
}

interface DetailConfig {
  kind: OrderKind
  basePath: string
  author: OrderActor
}

export function SellerOrderDetail({ orderId, config }: { orderId: string; config: DetailConfig }) {
  const router = useRouter()
  const { getOrderById, addOrderUpdate } = useOrders()
  const { postOrderUpdate } = useMessages()
  const order = getOrderById(orderId)

  const [showForm, setShowForm] = useState(false)
  const [newStatus, setNewStatus] = useState<OrderStatus>("in-production")
  const [note, setNote] = useState("")
  const [photoNames, setPhotoNames] = useState<string[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <h1 className="font-serif text-xl font-medium text-foreground">Not found</h1>
        <Button asChild variant="outline" className="mt-4">
          <Link href={config.basePath}>Back to list</Link>
        </Button>
      </div>
    )
  }

  const isService = order.kind === "service"
  const StatusIcon = statusStyles[order.status].icon
  const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status)

  const submitUpdate = () => {
    if (!note.trim()) return
    const trimmedNote = note.trim()
    const photos = photoNames
    const files = fileNames.map((name) => ({ name }))
    addOrderUpdate(order.id, {
      status: newStatus,
      note: trimmedNote,
      photos,
      files,
      author: config.author,
    })
    // Deliver the status change / note / attachments into the buyer↔seller message thread.
    postOrderUpdate(order, {
      id: `u-${Date.now()}`,
      status: newStatus,
      note: trimmedNote,
      photos,
      files: files.map((f, i) => ({ id: `f-${Date.now()}-${i}`, name: f.name })),
      createdAt: new Date().toISOString(),
      author: config.author,
    })
    setNote("")
    setPhotoNames([])
    setFileNames([])
    setShowForm(false)
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
              <span className="text-sm font-medium text-muted-foreground">{order.id}</span>
              <Badge className={cn("gap-1 text-xs", statusStyles[order.status].color)}>
                <StatusIcon className="h-3 w-3" />
                {getStatusLabel(order.status, order.kind)}
              </Badge>
            </div>
            <h1 className="mt-1.5 font-serif text-2xl font-medium text-foreground">{order.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {order.buyerCompany} · {order.buyerName}
            </p>
          </div>
          <div className="text-right">
            <p className="font-serif text-2xl font-medium text-foreground">
              {formatCurrency(order.totalAmount, order.currency)}
            </p>
            <p className="text-xs text-muted-foreground">{order.quantity}</p>
          </div>
        </div>

        {/* Stepper */}
        {order.status !== "cancelled" && (
          <div className="mt-6 flex items-center">
            {ORDER_STATUS_FLOW.map((s, i) => {
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
                      {getStatusLabel(s, order.kind)}
                    </span>
                  </div>
                  {i < ORDER_STATUS_FLOW.length - 1 && (
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
          {/* Add update */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-foreground">Progress updates</h2>
              {order.status !== "completed" && order.status !== "cancelled" && (
                <Button size="sm" variant={showForm ? "outline" : "default"} className="gap-1.5" onClick={() => setShowForm(!showForm)}>
                  <Plus className="h-4 w-4" />
                  {showForm ? "Cancel" : "Add update"}
                </Button>
              )}
            </div>

            {showForm && (
              <div className="mt-4 space-y-4 rounded-lg border border-border bg-muted/20 p-4">
                <div className="space-y-2">
                  <Label className="text-sm">Set status</Label>
                  <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUS_FLOW.concat("cancelled").map((s) => (
                        <SelectItem key={s} value={s}>
                          {getStatusLabel(s, order.kind)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Update note</Label>
                  <Textarea
                    placeholder={
                      isService
                        ? "Share progress, milestones, or what you completed for the client..."
                        : "Share production progress, photos, QC notes, or shipping details..."
                    }
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </div>
                {/* Lightweight attachment simulation */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => setPhotoNames((p) => [...p, `photo-${p.length + 1}.jpg`])}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Add photo
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => setFileNames((f) => [...f, `document-${f.length + 1}.pdf`])}
                  >
                    <FileText className="h-4 w-4" />
                    Attach file
                  </Button>
                </div>
                {(photoNames.length > 0 || fileNames.length > 0) && (
                  <div className="flex flex-wrap gap-1.5">
                    {photoNames.map((p, i) => (
                      <Badge key={`p-${i}`} variant="secondary" className="gap-1 text-xs">
                        <ImageIcon className="h-3 w-3" />
                        {p}
                      </Badge>
                    ))}
                    {fileNames.map((f, i) => (
                      <Badge key={`f-${i}`} variant="secondary" className="gap-1 text-xs">
                        <FileText className="h-3 w-3" />
                        {f}
                      </Badge>
                    ))}
                  </div>
                )}
                <Button onClick={submitUpdate} disabled={!note.trim()} className="gap-1.5">
                  <Send className="h-4 w-4" />
                  Post update
                </Button>
              </div>
            )}

            {/* Timeline */}
            <div className="mt-5 space-y-5">
              {[...order.updates].reverse().map((u) => {
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
                        <span className="text-sm font-medium text-foreground">{getStatusLabel(u.status, order.kind)}</span>
                        <span className="text-xs text-muted-foreground">{formatOrderDate(u.createdAt)}</span>
                        <Badge variant="outline" className="text-[10px] capitalize">{u.author}</Badge>
                      </div>
                      {u.note && <p className="mt-1 text-sm text-muted-foreground">{u.note}</p>}
                      {u.photos.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {u.photos.map((p, i) => (
                            <Badge key={i} variant="secondary" className="gap-1 text-xs">
                              <ImageIcon className="h-3 w-3" />
                              {p}
                            </Badge>
                          ))}
                        </div>
                      )}
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
              <Row label={isService ? "Scope" : "Quantity"} value={order.quantity} />
              <Row label="Total" value={formatCurrency(order.totalAmount, order.currency)} />
              <Row label={isService ? "Timeline" : "Production time"} value={order.productionTime} />
              <Row label={isService ? "Delivery date" : "Est. delivery"} value={formatOrderDate(order.estimatedDelivery)} icon={Calendar} />
              <Row label="Payment terms" value={order.paymentTerms} />
              {!isService && <Row label="Shipping terms" value={order.shippingTerms} />}
              {!isService && <Row label="Destination" value={order.destination} />}
              {order.rfqTitle && <Row label="From RFQ" value={order.rfqTitle} />}
            </dl>
            {order.notes && (
              <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">{order.notes}</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-medium text-foreground">Documents</h2>
            <div className="mt-3 space-y-2">
              {order.documents.length === 0 && (
                <p className="text-sm text-muted-foreground">No documents attached.</p>
              )}
              {order.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2">
                  <span className="flex min-w-0 items-center gap-2 text-sm text-foreground">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{doc.name}</span>
                  </span>
                  <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
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
