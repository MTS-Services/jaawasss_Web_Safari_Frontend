"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useOrders, type OrderKind } from "@/lib/orders-context"
import { useMessages } from "@/lib/messages-context"
import { getConnectedBuyers, CONNECTION_SOURCE_LABELS } from "@/lib/connected-buyers"
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
import { ArrowLeft, FileText, Plus, X, Building2, Mail, MapPin } from "lucide-react"

interface CreateConfig {
  kind: OrderKind
  basePath: string
  sellerId: string
  sellerName: string
  title: string
  subtitle: string
  submitLabel: string
}

export function SellerOrderCreate({ config }: { config: CreateConfig }) {
  const router = useRouter()
  const { createOrder } = useOrders()
  const { postOrderCreated } = useMessages()
  const isService = config.kind === "service"

  // Buyers can only be selected from accounts already connected to this seller.
  const connectedBuyers = getConnectedBuyers(config.sellerId)
  const [buyerEmail, setBuyerEmail] = useState("")
  const selectedBuyer = connectedBuyers.find((b) => b.email === buyerEmail)

  const [form, setForm] = useState({
    title: "",
    quantity: "",
    totalAmount: "",
    currency: "USD",
    productionTime: "",
    estimatedDelivery: "",
    paymentTerms: "",
    shippingTerms: isService ? "Digital delivery" : "",
    destination: isService ? "Remote / Online" : "",
    packagingDetails: "",
    notes: "",
  })
  const [docs, setDocs] = useState<string[]>([])
  const [showError, setShowError] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const required = !!(selectedBuyer && form.title && form.quantity && form.totalAmount && form.estimatedDelivery)

  const handleSubmit = () => {
    if (!required || !selectedBuyer) {
      setShowError(true)
      return
    }
    const amount = Number.parseFloat(form.totalAmount) || 0
    const order = createOrder({
      kind: config.kind,
      title: form.title,
      buyerEmail: selectedBuyer.email,
      buyerName: selectedBuyer.name,
      buyerCompany: selectedBuyer.company,
      manufacturerId: config.sellerId,
      manufacturerName: config.sellerName,
      providerId: isService ? config.sellerId : undefined,
      providerName: isService ? config.sellerName : undefined,
      quantity: form.quantity,
      unitPrice: amount,
      totalAmount: amount,
      currency: form.currency,
      packagingDetails: form.packagingDetails,
      productionTime: form.productionTime,
      estimatedDelivery: form.estimatedDelivery,
      paymentTerms: form.paymentTerms,
      shippingTerms: form.shippingTerms,
      destination: form.destination,
      notes: form.notes,
      documents: docs.map((name) => ({ name, type: "product-doc" as const })),
    })
    // Announce the new order/engagement inside the buyer↔seller message thread.
    postOrderCreated(order)
    router.push(`${config.basePath}/${order.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5 text-muted-foreground">
        <Link href={config.basePath}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="font-serif text-2xl font-medium text-foreground">{config.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{config.subtitle}</p>
      </div>

      <div className="space-y-6">
        <Section title={isService ? "Engagement" : "Order"}>
          <Field label={isService ? "Engagement title" : "Order title"} required>
            <Input
              placeholder={isService ? "e.g., Brand identity & packaging design" : "e.g., Premium ceramic mugs — 320ml"}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
          <Field label={isService ? "Scope / deliverables" : "Quantity"} required>
            <Input
              placeholder={isService ? "e.g., Logo, 3 packaging SKUs, brand guide" : "e.g., 5,000 units"}
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Buyer">
          <Field label="Select connected buyer" required>
            <Select value={buyerEmail} onValueChange={setBuyerEmail}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a buyer you've worked with" />
              </SelectTrigger>
              <SelectContent>
                {connectedBuyers.map((b) => (
                  <SelectItem key={b.email} value={b.email}>
                    {b.company} — {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-muted-foreground">
              Only buyers connected through RFQs, quotations, or messages can be selected, so this{" "}
              {isService ? "engagement" : "order"} links to the correct account.
            </p>
          </Field>

          {selectedBuyer && (
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {selectedBuyer.company}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {selectedBuyer.email}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedBuyer.name} · {selectedBuyer.country}
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {selectedBuyer.sources.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {CONNECTION_SOURCE_LABELS[s]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Section>

        <Section title="Commercial terms">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Total amount" required>
              <Input type="number" placeholder="0.00" value={form.totalAmount} onChange={(e) => set("totalAmount", e.target.value)} />
            </Field>
            <Field label="Currency">
              <Input value={form.currency} onChange={(e) => set("currency", e.target.value)} />
            </Field>
            <Field label={isService ? "Delivery date" : "Est. delivery"} required>
              <Input type="date" value={form.estimatedDelivery} onChange={(e) => set("estimatedDelivery", e.target.value)} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={isService ? "Timeline" : "Production time"}>
              <Input placeholder={isService ? "e.g., 3 weeks" : "e.g., 30 days"} value={form.productionTime} onChange={(e) => set("productionTime", e.target.value)} />
            </Field>
            <Field label="Payment terms">
              <Input placeholder="e.g., 50% upfront, 50% on delivery" value={form.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value)} />
            </Field>
          </div>
          {!isService && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Shipping terms">
                <Input placeholder="e.g., FOB Shanghai" value={form.shippingTerms} onChange={(e) => set("shippingTerms", e.target.value)} />
              </Field>
              <Field label="Destination">
                <Input placeholder="e.g., Los Angeles, USA" value={form.destination} onChange={(e) => set("destination", e.target.value)} />
              </Field>
            </div>
          )}
        </Section>

        <Section title="Documents & notes">
          <Field label="Attach documents">
            <div className="flex flex-wrap items-center gap-2">
              {docs.map((d, i) => (
                <span key={i} className="flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-foreground">
                  <FileText className="h-3 w-3" />
                  {d}
                  <button type="button" onClick={() => setDocs((p) => p.filter((_, idx) => idx !== i))}>
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </span>
              ))}
              <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => setDocs((p) => [...p, `document-${p.length + 1}.pdf`])}>
                <Plus className="h-3.5 w-3.5" />
                Add document
              </Button>
            </div>
          </Field>
          <Field label="Notes">
            <Textarea
              placeholder={isService ? "Any additional context about this engagement..." : "Any additional context about this order..."}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
            />
          </Field>
        </Section>

        {showError && !required && (
          <p className="text-sm text-destructive">Please fill in all required fields marked with *.</p>
        )}

        <div className="flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href={config.basePath}>Cancel</Link>
          </Button>
          <Button onClick={handleSubmit}>{config.submitLabel}</Button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 font-medium text-foreground">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  )
}
