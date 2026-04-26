"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { suppliers, getSupplierBySlug } from "@/lib/data/suppliers"
import { products, getProductBySlug } from "@/lib/data/products"
import { countries } from "@/lib/data/countries"
import { 
  ArrowLeft,
  Factory,
  CheckCircle,
  FileText,
  Package,
  Star
} from "lucide-react"

function NewRFQForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supplierSlug = searchParams.get('supplier')
  const productSlug = searchParams.get('product')
  
  const initialSupplier = supplierSlug ? getSupplierBySlug(supplierSlug) : null
  const initialProduct = productSlug ? getProductBySlug(productSlug) : null
  const productSupplier = initialProduct ? getSupplierBySlug(initialProduct.supplierSlug) : null

  const [selectedSupplier, setSelectedSupplier] = useState(initialSupplier || productSupplier)
  const [selectedProduct, setSelectedProduct] = useState(initialProduct)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSupplierSearch, setShowSupplierSearch] = useState(!initialSupplier && !productSupplier)
  
  const [formData, setFormData] = useState({
    productName: initialProduct?.name || "",
    quantity: "",
    unit: "pieces",
    targetPrice: "",
    currency: "USD",
    deliveryDate: "",
    shippingTerms: "FOB",
    destinationCountry: "",
    destinationPort: "",
    packaging: "",
    requirements: "",
    attachments: false
  })

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.industry.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the RFQ via API
    router.push('/dashboard/buyer/rfqs')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/buyer/rfqs" 
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My RFQs
        </Link>
        <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
          Request for Quotation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Submit a detailed quote request to receive competitive pricing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier Selection */}
        <div className="rounded-xl border border-border bg-card p-6">
          <label className="text-sm font-medium text-foreground">
            Supplier
          </label>
          
          {selectedSupplier ? (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Factory className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{selectedSupplier.name}</span>
                    {selectedSupplier.verified && (
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{selectedSupplier.location.city}, {selectedSupplier.location.country}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {selectedSupplier.rating}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedSupplier(null)
                  setSelectedProduct(null)
                  setShowSupplierSearch(true)
                }}
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="mt-3">
              <Input
                type="text"
                placeholder="Search suppliers by name or industry..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSupplierSearch(true)
                }}
                onFocus={() => setShowSupplierSearch(true)}
              />
              
              {showSupplierSearch && searchQuery && (
                <div className="mt-2 rounded-lg border border-border bg-card shadow-lg">
                  {filteredSuppliers.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No suppliers found
                    </div>
                  ) : (
                    filteredSuppliers.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedSupplier(s)
                          setShowSupplierSearch(false)
                          setSearchQuery("")
                        }}
                        className="flex w-full items-center gap-3 border-b border-border p-3 text-left last:border-b-0 hover:bg-muted/50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Factory className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{s.name}</span>
                            {s.verified && (
                              <CheckCircle className="h-3 w-3 text-secondary" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {s.industry} • {s.location.country}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                          {s.rating}
                        </Badge>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Product (if from product page) */}
        {selectedProduct && (
          <div className="rounded-xl border border-border bg-card p-6">
            <label className="text-sm font-medium text-foreground">
              Product Reference
            </label>
            <div className="mt-3 flex items-center gap-4 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{selectedProduct.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                {selectedProduct.price && (
                  <p className="text-sm text-muted-foreground">
                    ${selectedProduct.price.min} - ${selectedProduct.price.max} / {selectedProduct.price.unit}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Product Details</h2>
          
          <div>
            <label htmlFor="productName" className="text-sm font-medium text-foreground">
              Product Name / Description
            </label>
            <Input
              id="productName"
              type="text"
              placeholder="e.g., TWS Wireless Earbuds with ANC"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="mt-2"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="quantity" className="text-sm font-medium text-foreground">
                Quantity
              </label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="quantity"
                  type="number"
                  placeholder="5000"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="flex-1"
                  required
                />
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="sets">Sets</SelectItem>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="kg">KG</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="cartons">Cartons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="targetPrice" className="text-sm font-medium text-foreground">
                Target Price (Optional)
              </label>
              <div className="mt-2 flex gap-2">
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CNY">CNY</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="targetPrice"
                  type="number"
                  placeholder="15.00"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                  className="flex-1"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Delivery Details</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="deliveryDate" className="text-sm font-medium text-foreground">
                Required Delivery Date
              </label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <label htmlFor="shippingTerms" className="text-sm font-medium text-foreground">
                Shipping Terms
              </label>
              <Select 
                value={formData.shippingTerms} 
                onValueChange={(value) => setFormData({ ...formData, shippingTerms: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOB">FOB (Free On Board)</SelectItem>
                  <SelectItem value="CIF">CIF (Cost, Insurance, Freight)</SelectItem>
                  <SelectItem value="DDP">DDP (Delivered Duty Paid)</SelectItem>
                  <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="destinationCountry" className="text-sm font-medium text-foreground">
              Destination Country
            </label>
            <Select 
              value={formData.destinationCountry} 
              onValueChange={(value) => setFormData({ ...formData, destinationCountry: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="destinationPort" className="text-sm font-medium text-foreground">
              Destination Port / City
            </label>
            <Input
              id="destinationPort"
              type="text"
              placeholder="e.g., Los Angeles Port"
              value={formData.destinationPort}
              onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>

        {/* Packaging Requirements */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Packaging Requirements</h2>
          
          <div>
            <label htmlFor="packaging" className="text-sm font-medium text-foreground">
              Packaging Details
            </label>
            <Select 
              value={formData.packaging} 
              onValueChange={(value) => setFormData({ ...formData, packaging: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select packaging type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Packaging</SelectItem>
                <SelectItem value="oem">OEM Packaging (Custom Brand)</SelectItem>
                <SelectItem value="white-label">White Label / Neutral</SelectItem>
                <SelectItem value="retail">Retail Ready Packaging</SelectItem>
                <SelectItem value="bulk">Bulk / No Retail Packaging</SelectItem>
                <SelectItem value="gift">Gift Box Packaging</SelectItem>
                <SelectItem value="eco">Eco-Friendly Packaging</SelectItem>
                <SelectItem value="other">Other (Specify in requirements)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="rounded-xl border border-border bg-card p-6">
          <label htmlFor="requirements" className="text-sm font-medium text-foreground">
            Additional Requirements
          </label>
          <Textarea
            id="requirements"
            placeholder="Include any specific requirements such as customization, packaging, certifications, etc."
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="mt-3 min-h-[120px]"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/buyer/rfqs">Cancel</Link>
          </Button>
          <Button 
            type="submit" 
            className="gap-2"
            disabled={!selectedSupplier || !formData.productName || !formData.quantity}
          >
            <FileText className="h-4 w-4" />
            Submit RFQ
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function NewRFQPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }>
          <NewRFQForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
