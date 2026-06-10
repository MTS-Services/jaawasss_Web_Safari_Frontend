"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Package,
  Ship,
  Plane,
  Truck,
  Container,
  Boxes,
  Percent,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Copy,
  Check,
  Download,
  TrendingUp,
  Info,
  AlertCircle,
  RotateCcw,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ShipmentType = "single" | "multiple"
type ShippingMethod = "fcl" | "lcl" | "air" | "courier" | "other"
type AllocationMethod = "value" | "quantity" | "cbm" | "weight"
type ExpenseBasis = "fixed" | "pct_product" | "pct_shipment"

interface ProductLine {
  id: string
  name: string
  unitPrice: string
  quantity: string
  weight: string
  cbm: string
  hsCode: string
}

interface ExtraExpense {
  id: string
  label: string
  basis: ExpenseBasis
  amount: string
}

interface ComputedProduct {
  name: string
  quantity: number
  unitPrice: number
  productCost: number
  allocatedShipping: number
  allocatedDuty: number
  allocatedExpenses: number
  allocatedVat: number
  totalCost: number
  landedPerUnit: number
}

const CURRENCIES = ["USD", "EUR", "GBP", "ILS"]
const CURRENCY_SYMBOL: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", ILS: "₪" }

const SHIPPING_METHODS: { id: ShippingMethod; label: string; icon: typeof Ship }[] = [
  { id: "fcl", label: "Full container (FCL)", icon: Container },
  { id: "lcl", label: "LCL", icon: Boxes },
  { id: "air", label: "Air freight", icon: Plane },
  { id: "courier", label: "Courier", icon: Truck },
  { id: "other", label: "Other", icon: Ship },
]

const ALLOCATION_METHODS: { id: AllocationMethod; label: string; hint: string }[] = [
  { id: "value", label: "By product value", hint: "Recommended if you don't know CBM or weight" },
  { id: "quantity", label: "By quantity", hint: "Split by number of units" },
  { id: "cbm", label: "By CBM / volume", hint: "Most accurate for sea freight" },
  { id: "weight", label: "By weight", hint: "Best for heavy goods / air freight" },
]

const COMMON_EXPENSES = [
  "Customs broker",
  "Port fees",
  "Local delivery",
  "Inspection",
  "Storage",
  "Documents",
  "Bank fees",
  "Insurance",
  "Handling fees",
]

const STEPS = [
  "Shipment",
  "Currency",
  "Products",
  "Shipping",
  "Taxes",
  "Expenses",
  "Result",
]

const newProduct = (): ProductLine => ({
  id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: "",
  unitPrice: "",
  quantity: "",
  weight: "",
  cbm: "",
  hsCode: "",
})

const num = (v: string) => {
  const n = Number.parseFloat((v || "").toString().replace(/,/g, ""))
  return Number.isFinite(n) ? n : 0
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function LandedCostEstimator({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState(0)
  const [shipmentType, setShipmentType] = useState<ShipmentType | null>(null)
  const [currency, setCurrency] = useState("USD")
  const [products, setProducts] = useState<ProductLine[]>([newProduct()])
  const [shippingCost, setShippingCost] = useState("")
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null)
  const [allocation, setAllocation] = useState<AllocationMethod>("value")
  const [vatPct, setVatPct] = useState("")
  const [dutyPct, setDutyPct] = useState("")
  const [purchaseTaxPct, setPurchaseTaxPct] = useState("")
  const [otherTaxPct, setOtherTaxPct] = useState("")
  const [expenses, setExpenses] = useState<ExtraExpense[]>([])
  const [copied, setCopied] = useState(false)

  // Margin calculator
  const [showMargin, setShowMargin] = useState(false)
  const [sellPrice, setSellPrice] = useState("")
  const [sellQty, setSellQty] = useState("")
  const [sellingExpenses, setSellingExpenses] = useState("")

  const sym = CURRENCY_SYMBOL[currency] || ""
  const money = (n: number) =>
    `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const isMulti = shipmentType === "multiple"

  // ----- Navigation -----
  const canNext = () => {
    if (step === 0) return shipmentType !== null
    if (step === 1) return currency.length > 0
    if (step === 2) return products.some((p) => num(p.unitPrice) > 0 && num(p.quantity) > 0)
    if (step === 3) return num(shippingCost) >= 0 && shippingMethod !== null
    return true
  }
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const updateProduct = (id: string, patch: Partial<ProductLine>) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  const addProduct = () => setProducts((prev) => [...prev, newProduct()])
  const removeProduct = (id: string) =>
    setProducts((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev))

  const addExpense = (label = "") =>
    setExpenses((prev) => [
      ...prev,
      { id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, label, basis: "fixed", amount: "" },
    ])
  const updateExpense = (id: string, patch: Partial<ExtraExpense>) =>
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  const removeExpense = (id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id))

  // ----- Calculation -----
  const activeProducts = products.filter((p) => num(p.unitPrice) > 0 && num(p.quantity) > 0)
  const totalProductCost = activeProducts.reduce((s, p) => s + num(p.unitPrice) * num(p.quantity), 0)
  const shipping = num(shippingCost)

  // allocation weights
  const allocWeight = (p: ProductLine) => {
    if (allocation === "quantity") return num(p.quantity)
    if (allocation === "cbm") return num(p.cbm)
    if (allocation === "weight") return num(p.weight)
    return num(p.unitPrice) * num(p.quantity) // value
  }
  // fall back to value allocation if the chosen metric is all zeros
  const totalWeightRaw = activeProducts.reduce((s, p) => s + allocWeight(p), 0)
  const allocationFellBack = totalWeightRaw <= 0 && allocation !== "value"
  const effectiveWeight = (p: ProductLine) =>
    allocationFellBack ? num(p.unitPrice) * num(p.quantity) : allocWeight(p)
  const totalWeight = activeProducts.reduce((s, p) => s + effectiveWeight(p), 0)

  // extra expenses total
  const expenseAmount = (e: ExtraExpense) => {
    const a = num(e.amount)
    if (e.basis === "pct_product") return (a / 100) * totalProductCost
    if (e.basis === "pct_shipment") return (a / 100) * (totalProductCost + shipping)
    return a
  }
  const totalExpenses = expenses.reduce((s, e) => s + expenseAmount(e), 0)

  const totalDuty = (num(dutyPct) / 100) * totalProductCost
  // VAT is commonly charged on (goods + shipping + duty)
  const vatBase = totalProductCost + shipping + totalDuty
  const totalVat = (num(vatPct) / 100) * vatBase
  const totalPurchaseTax = (num(purchaseTaxPct) / 100) * totalProductCost
  const totalOtherTax = (num(otherTaxPct) / 100) * totalProductCost
  const totalTaxes = totalVat + totalPurchaseTax + totalOtherTax

  const totalLanded = totalProductCost + shipping + totalDuty + totalTaxes + totalExpenses

  const computed: ComputedProduct[] = activeProducts.map((p) => {
    const productCost = num(p.unitPrice) * num(p.quantity)
    const share = totalWeight > 0 ? effectiveWeight(p) / totalWeight : 1 / activeProducts.length
    const allocatedShipping = shipping * share
    const allocatedDuty = totalDuty * share
    const allocatedExpenses = totalExpenses * share
    const allocatedVat = totalTaxes * share
    const totalCost = productCost + allocatedShipping + allocatedDuty + allocatedExpenses + allocatedVat
    return {
      name: p.name || "Unnamed product",
      quantity: num(p.quantity),
      unitPrice: num(p.unitPrice),
      productCost,
      allocatedShipping,
      allocatedDuty,
      allocatedExpenses,
      allocatedVat,
      totalCost,
      landedPerUnit: num(p.quantity) > 0 ? totalCost / num(p.quantity) : 0,
    }
  })

  // Missing-info notes
  const missingNotes: string[] = []
  if (!dutyPct.trim()) missingNotes.push("Customs duty was not included because no duty percentage was provided.")
  if (!vatPct.trim()) missingNotes.push("VAT was not included because no VAT percentage was provided.")
  if (shipping <= 0) missingNotes.push("Shipping cost was entered as zero — landed cost may be understated.")
  if (allocationFellBack)
    missingNotes.push(
      `No ${allocation === "cbm" ? "CBM/volume" : allocation} data was provided, so shipping and fees were allocated by product value instead.`,
    )

  // ----- Margin -----
  const landedUnitForMargin =
    computed.length === 1 ? computed[0].landedPerUnit : totalLanded / Math.max(1, activeProducts.reduce((s, p) => s + num(p.quantity), 0))
  const sp = num(sellPrice)
  const sq = num(sellQty)
  const se = num(sellingExpenses)
  const grossPerUnit = sp - landedUnitForMargin - (sq > 0 ? se / sq : 0)
  const grossMarginPct = sp > 0 ? (grossPerUnit / sp) * 100 : 0
  const totalProfit = grossPerUnit * sq

  const buildResultText = () => {
    let t = `LANDED COST ESTIMATE (${currency})\n${"=".repeat(40)}\n\n`
    t += `Total product cost:   ${money(totalProductCost)}\n`
    t += `Shipping cost:        ${money(shipping)}\n`
    t += `Estimated customs duty: ${money(totalDuty)}\n`
    t += `Estimated taxes/VAT:  ${money(totalTaxes)}\n`
    t += `Extra expenses:       ${money(totalExpenses)}\n`
    t += `${"-".repeat(40)}\n`
    t += `TOTAL LANDED COST:    ${money(totalLanded)}\n\n`
    t += `PER PRODUCT\n${"-".repeat(40)}\n`
    computed.forEach((c) => {
      t += `${c.name} (x${c.quantity})\n`
      t += `  Landed/unit: ${money(c.landedPerUnit)}  |  Total: ${money(c.totalCost)}\n`
    })
    t += `\nNote: This is an estimated landed cost. Final costs may vary.`
    return t
  }

  const copyResult = () => {
    navigator.clipboard.writeText(buildResultText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportResult = () => {
    const blob = new Blob([buildResultText()], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `landed-cost-estimate-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const restart = () => {
    setStep(0)
    setShipmentType(null)
    setProducts([newProduct()])
    setShippingCost("")
    setShippingMethod(null)
    setVatPct("")
    setDutyPct("")
    setPurchaseTaxPct("")
    setOtherTaxPct("")
    setExpenses([])
    setShowMargin(false)
    setSellPrice("")
    setSellQty("")
    setSellingExpenses("")
  }

  return (
    <Card className="mt-4 overflow-hidden border-secondary/30">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/15">
            <Calculator className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Landed Cost Estimator</p>
            <p className="text-xs text-muted-foreground">Estimate your true import cost per unit</p>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 text-xs">
          Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
        </Badge>
      </div>

      {/* Step tracker */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-muted/20 px-4 py-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <span
              className={cn(
                "whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors",
                i === step
                  ? "bg-secondary text-secondary-foreground"
                  : i < step
                    ? "bg-success/15 text-success"
                    : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="text-muted-foreground/40">·</span>}
          </div>
        ))}
      </div>

      <CardContent className="p-4">
        {/* Step 0: Shipment type */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Is this calculation for…</h4>
              <p className="text-xs text-muted-foreground">Choose how many products are in this shipment.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectTile
                active={shipmentType === "single"}
                icon={Package}
                title="One product only"
                desc="A single product / SKU"
                onClick={() => setShipmentType("single")}
              />
              <SelectTile
                active={shipmentType === "multiple"}
                icon={Boxes}
                title="Multiple products"
                desc="Several products in one shipment / container"
                onClick={() => setShipmentType("multiple")}
              />
            </div>
          </div>
        )}

        {/* Step 1: Currency */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Which currency should we use?</h4>
              <p className="text-xs text-muted-foreground">All amounts will be shown in this currency.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                    currency === c
                      ? "border-secondary bg-secondary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-secondary/40",
                  )}
                >
                  {CURRENCY_SYMBOL[c]} {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Products */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {isMulti ? "Add your products" : "Product details"}
              </h4>
              <p className="text-xs text-muted-foreground">
                Enter unit price and quantity. Weight, CBM and HS code are optional.
              </p>
            </div>

            <div className="space-y-3">
              {(isMulti ? products : products.slice(0, 1)).map((p, idx) => (
                <div key={p.id} className="rounded-lg border border-border bg-muted/10 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {isMulti ? `Product ${idx + 1}` : "Product"}
                    </span>
                    {isMulti && products.length > 1 && (
                      <button onClick={() => removeProduct(p.id)} className="rounded p-1 hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Product name">
                      <Input value={p.name} onChange={(e) => updateProduct(p.id, { name: e.target.value })} placeholder="e.g., Cotton t-shirt" />
                    </Field>
                    <Field label={`Unit price (${currency})`} required>
                      <Input inputMode="decimal" value={p.unitPrice} onChange={(e) => updateProduct(p.id, { unitPrice: e.target.value })} placeholder="e.g., 3.50" />
                    </Field>
                    <Field label="Quantity" required>
                      <Input inputMode="numeric" value={p.quantity} onChange={(e) => updateProduct(p.id, { quantity: e.target.value })} placeholder="e.g., 1000" />
                    </Field>
                    <Field label="Weight (kg, optional)">
                      <Input inputMode="decimal" value={p.weight} onChange={(e) => updateProduct(p.id, { weight: e.target.value })} placeholder="Total or per shipment" />
                    </Field>
                    <Field label="CBM / volume (optional)">
                      <Input inputMode="decimal" value={p.cbm} onChange={(e) => updateProduct(p.id, { cbm: e.target.value })} placeholder="e.g., 2.5" />
                    </Field>
                    {isMulti && (
                      <Field label="HS code / category (optional)">
                        <Input value={p.hsCode} onChange={(e) => updateProduct(p.id, { hsCode: e.target.value })} placeholder="e.g., 6109.10" />
                      </Field>
                    )}
                  </div>
                  {num(p.unitPrice) > 0 && num(p.quantity) > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Line total: <span className="font-medium text-foreground">{money(num(p.unitPrice) * num(p.quantity))}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            {isMulti && (
              <Button variant="outline" size="sm" onClick={addProduct} className="gap-2">
                <Plus className="h-4 w-4" />
                Add another product
              </Button>
            )}
          </div>
        )}

        {/* Step 3: Shipping */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Shipping cost</h4>
              <p className="text-xs text-muted-foreground">Enter the total shipping cost and method.</p>
            </div>
            <Field label={`Total shipping cost (${currency})`}>
              <Input inputMode="decimal" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} placeholder="e.g., 1200" />
            </Field>
            <div>
              <Label className="text-xs">Shipping method</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {SHIPPING_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setShippingMethod(m.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                      shippingMethod === m.id
                        ? "border-secondary bg-secondary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-secondary/40",
                    )}
                  >
                    <m.icon className="h-4 w-4" />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {isMulti && (
              <div className="rounded-lg border border-border bg-muted/10 p-3">
                <Label className="text-xs font-medium">How should we allocate shipping & fees across products?</Label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {ALLOCATION_METHODS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAllocation(a.id)}
                      className={cn(
                        "rounded-lg border p-2.5 text-left transition-colors",
                        allocation === a.id
                          ? "border-secondary bg-secondary/10"
                          : "border-border hover:border-secondary/40",
                      )}
                    >
                      <p className="text-sm font-medium text-foreground">{a.label}</p>
                      <p className="text-[11px] text-muted-foreground">{a.hint}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Taxes */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Taxes & duties</h4>
              <p className="text-xs text-muted-foreground">
                Leave any field empty if you don&apos;t know it — we&apos;ll note it as not included.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <PctField label="VAT %" value={vatPct} onChange={setVatPct} placeholder="e.g., 17" />
              <PctField label="Customs duty % (optional)" value={dutyPct} onChange={setDutyPct} placeholder="e.g., 6" />
              <PctField label="Purchase tax % (optional)" value={purchaseTaxPct} onChange={setPurchaseTaxPct} placeholder="if applicable" />
              <PctField label="Other tax % (optional)" value={otherTaxPct} onChange={setOtherTaxPct} placeholder="if applicable" />
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-info/30 bg-info/5 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
              <p className="text-xs text-muted-foreground">
                VAT is estimated on goods + shipping + duty. Duty is estimated on product value. Adjust with your customs
                broker for exact figures.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Extra expenses */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Additional expenses</h4>
              <p className="text-xs text-muted-foreground">Add any extra costs. Skip this step if there are none.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {COMMON_EXPENSES.filter((c) => !expenses.some((e) => e.label === c)).map((c) => (
                <button
                  key={c}
                  onClick={() => addExpense(c)}
                  className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-secondary/40 hover:text-foreground"
                >
                  <Plus className="h-3 w-3" />
                  {c}
                </button>
              ))}
            </div>

            {expenses.length > 0 && (
              <div className="space-y-2">
                {expenses.map((e) => (
                  <div key={e.id} className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-muted/10 p-2.5">
                    <div className="min-w-[120px] flex-1">
                      <Label className="text-[11px]">Expense</Label>
                      <Input value={e.label} onChange={(ev) => updateExpense(e.id, { label: ev.target.value })} placeholder="Expense name" className="h-9" />
                    </div>
                    <div className="w-28">
                      <Label className="text-[11px]">Type</Label>
                      <select
                        value={e.basis}
                        onChange={(ev) => updateExpense(e.id, { basis: ev.target.value as ExpenseBasis })}
                        className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      >
                        <option value="fixed">Fixed {sym}</option>
                        <option value="pct_product">% product</option>
                        <option value="pct_shipment">% shipment</option>
                      </select>
                    </div>
                    <div className="w-24">
                      <Label className="text-[11px]">{e.basis === "fixed" ? `Amount` : "%"}</Label>
                      <Input inputMode="decimal" value={e.amount} onChange={(ev) => updateExpense(e.id, { amount: ev.target.value })} placeholder="0" className="h-9" />
                    </div>
                    <button onClick={() => removeExpense(e.id)} className="mb-1 rounded p-1.5 hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button variant="outline" size="sm" onClick={() => addExpense()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add custom expense
            </Button>
          </div>
        )}

        {/* Step 6: Result */}
        {step === 6 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Total shipment summary</h4>
                <Badge variant="outline" className="text-xs">{currency}</Badge>
              </div>
              <dl className="space-y-1.5 text-sm">
                <ResultRow label="Total product cost" value={money(totalProductCost)} />
                <ResultRow label="Shipping cost" value={money(shipping)} />
                <ResultRow label="Estimated customs duty" value={money(totalDuty)} muted={totalDuty === 0} />
                <ResultRow label="Estimated taxes / VAT" value={money(totalTaxes)} muted={totalTaxes === 0} />
                <ResultRow label="Extra expenses" value={money(totalExpenses)} muted={totalExpenses === 0} />
                <div className="my-2 border-t border-border" />
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-semibold text-foreground">Total estimated landed cost</dt>
                  <dd className="text-lg font-bold text-secondary">{money(totalLanded)}</dd>
                </div>
              </dl>
            </div>

            {/* Per-product breakdown */}
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Product</th>
                    <th className="px-3 py-2 font-medium">Qty</th>
                    <th className="px-3 py-2 font-medium">Unit</th>
                    <th className="px-3 py-2 font-medium">+Ship</th>
                    <th className="px-3 py-2 font-medium">+Fees</th>
                    <th className="px-3 py-2 font-medium">Total</th>
                    <th className="px-3 py-2 font-medium">Landed/unit</th>
                  </tr>
                </thead>
                <tbody>
                  {computed.map((c) => (
                    <tr key={c.name} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 font-medium text-foreground">{c.name}</td>
                      <td className="px-3 py-2">{c.quantity.toLocaleString()}</td>
                      <td className="px-3 py-2">{money(c.unitPrice)}</td>
                      <td className="px-3 py-2 text-muted-foreground">{money(c.allocatedShipping)}</td>
                      <td className="px-3 py-2 text-muted-foreground">{money(c.allocatedDuty + c.allocatedExpenses + c.allocatedVat)}</td>
                      <td className="px-3 py-2">{money(c.totalCost)}</td>
                      <td className="px-3 py-2 font-semibold text-secondary">{money(c.landedPerUnit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Missing-info notes */}
            {missingNotes.length > 0 && (
              <div className="space-y-1.5 rounded-lg border border-warning/30 bg-warning/5 p-3">
                {missingNotes.map((n) => (
                  <p key={n} className="flex items-start gap-2 text-xs text-foreground/80">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                    {n}
                  </p>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={copyResult} className="gap-2">
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy result"}
              </Button>
              <Button size="sm" variant="outline" onClick={exportResult} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              {!showMargin && (
                <Button size="sm" onClick={() => setShowMargin(true)} className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Calculate profit margin
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={restart} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                New estimate
              </Button>
            </div>

            {/* Margin calculator */}
            {showMargin && (
              <div className="rounded-xl border border-border bg-muted/10 p-4">
                <h4 className="mb-1 text-sm font-semibold text-foreground">Profit margin calculator</h4>
                <p className="mb-3 text-xs text-muted-foreground">Based on a landed cost of {money(landedUnitForMargin)} per unit.</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <PctField label={`Selling price / unit (${currency})`} value={sellPrice} onChange={setSellPrice} placeholder="e.g., 12" plain />
                  <Field label="Expected sell quantity">
                    <Input inputMode="numeric" value={sellQty} onChange={(e) => setSellQty(e.target.value)} placeholder="e.g., 1000" />
                  </Field>
                  <PctField label={`Selling expenses (${currency})`} value={sellingExpenses} onChange={setSellingExpenses} placeholder="optional total" plain />
                </div>
                {sp > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <Stat label="Landed / unit" value={money(landedUnitForMargin)} />
                    <Stat label="Selling price" value={money(sp)} />
                    <Stat label="Gross profit / unit" value={money(grossPerUnit)} positive={grossPerUnit >= 0} />
                    <Stat label="Gross margin" value={`${grossMarginPct.toFixed(1)}%`} positive={grossMarginPct >= 0} />
                  </div>
                )}
                {sp > 0 && sq > 0 && (
                  <p className="mt-3 text-sm">
                    Estimated total gross profit:{" "}
                    <span className={cn("font-semibold", totalProfit >= 0 ? "text-success" : "text-destructive")}>
                      {money(totalProfit)}
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 p-3">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                This is only an estimated landed cost calculation. Final costs may change depending on customs duties,
                VAT, taxes, shipping, port fees, customs broker charges, local delivery, and official import
                requirements.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer nav */}
      {step < 6 && (
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-3">
          <Button variant="ghost" size="sm" onClick={step === 0 ? onClose : back} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          <div className="flex items-center gap-2">
            {(step === 4 || step === 5) && (
              <Button variant="ghost" size="sm" onClick={next} className="text-muted-foreground">
                Skip
              </Button>
            )}
            <Button size="sm" onClick={next} disabled={!canNext()} className="gap-2">
              {step === 5 ? "Calculate" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function SelectTile({
  active,
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  active: boolean
  icon: typeof Package
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
        active ? "border-secondary bg-secondary/10" : "border-border hover:border-secondary/40",
      )}
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", active ? "bg-secondary/20" : "bg-muted")}>
        <Icon className={cn("h-4 w-4", active ? "text-secondary" : "text-muted-foreground")} />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  )
}

function PctField({
  label,
  value,
  onChange,
  placeholder,
  plain,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  plain?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="relative">
        <Input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={plain ? "" : "pr-8"} />
        {!plain && <Percent className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />}
      </div>
    </div>
  )
}

function ResultRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-medium", muted ? "text-muted-foreground" : "text-foreground")}>{value}</dd>
    </div>
  )
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background p-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-semibold", positive === undefined ? "text-foreground" : positive ? "text-success" : "text-destructive")}>
        {value}
      </p>
    </div>
  )
}
