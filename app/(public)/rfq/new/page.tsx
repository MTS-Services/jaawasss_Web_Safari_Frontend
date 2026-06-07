"use client"

import { useState, useEffect, Suspense } from "react"
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
import { getProduct, type Product } from "@/lib/api/products"
import { createRFQ } from "@/lib/api/rfqs"
import { suppliers } from "@/lib/data/suppliers"
import { countries } from "@/lib/data/countries"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft,
  Package,
  FileText,
  Loader2,
  AlertCircle,
  Factory,
  CheckCircle,
  Star,
  X
} from "lucide-react"

function NewRFQForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const productId = searchParams.get('product_id')
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(!!productId)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const [selectedSupplier, setSelectedSupplier] = useState<typeof suppliers[0] | null>(null)
  const [manufacturerSearch, setManufacturerSearch] = useState("")
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false)
  
  const [formData, setFormData] = useState({
    quantity: "",
    quantity_unit: "pieces",
    target_price: "",
    target_currency_code: "USD",
    required_delivery_date: "",
    shipping_terms: "FOB",
    destination_country: "",
    destination_port_city: "",
    packaging_details: "",
    additional_requirements: "",
  })

  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(manufacturerSearch.toLowerCase()) ||
    s.industry.toLowerCase().includes(manufacturerSearch.toLowerCase())
  ).slice(0, 8)

  // Fetch product if product_id provided
  useEffect(() => {
    if (!productId) {
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      
      const response = await getProduct(productId)
      
      if (response.success && response.data) {
        setProduct(response.data)
      } else {
        setError(response.message || "Product not found")
      }
      
      setLoading(false)
    }

    fetchProduct()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!product) {
      toast({
        title: "Error",
        description: "Product is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.quantity || !formData.required_delivery_date || !formData.destination_country) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Quantity, Delivery Date, Destination)",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    const rfqPayload = {
      product_id: product.id,
      quantity: parseInt(formData.quantity),
      quantity_unit: formData.quantity_unit,
      target_price: formData.target_price ? parseFloat(formData.target_price) : 0,
      target_currency_code: formData.target_currency_code,
      required_delivery_date: formData.required_delivery_date,
      shipping_terms: formData.shipping_terms,
      destination_country: formData.destination_country,
      destination_port_city: formData.destination_port_city,
      packaging_details: formData.packaging_details,
      additional_requirements: formData.additional_requirements || undefined,
    }

    const response = await createRFQ(rfqPayload)
    
    if (response.success) {
      // Show success toast
      toast({
        title: "Success! 🎉",
        description: `Your RFQ for "${product.name}" has been sent successfully. Suppliers will review your request shortly.`,
      })
      
      // Redirect after short delay to let user see the toast
      setTimeout(() => {
        router.push('/dashboard/buyer/rfqs')
      }, 1500)
    } else {
      const errorMsg = response.message || "Failed to submit RFQ"
      setSubmitError(errorMsg)
      toast({
        title: "Submission Failed",
        description: errorMsg,
        variant: "destructive",
      })
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-3"
                onClick={() => router.push('/products')}
              >
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/products" 
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
          Request for Quotation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Submit a detailed quote request to receive competitive pricing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Manufacturer Search */}
        <div className="rounded-xl border border-border bg-card p-6">
          <label className="text-sm font-medium text-foreground">
            Search Manufacturer / Industry
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
                    {selectedSupplier.reviewed && (
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
              <button
                type="button"
                onClick={() => {
                  setSelectedSupplier(null)
                  setManufacturerSearch("")
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="mt-3 relative">
              <Input
                type="text"
                placeholder="Search by manufacturer name or industry..."
                value={manufacturerSearch}
                onChange={(e) => {
                  setManufacturerSearch(e.target.value)
                  setShowSupplierDropdown(true)
                }}
                onFocus={() => setShowSupplierDropdown(true)}
                className="w-full"
              />
              
              {showSupplierDropdown && manufacturerSearch && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-10">
                  {filteredSuppliers.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No manufacturers found
                    </div>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <button
                        key={supplier.id}
                        type="button"
                        onClick={() => {
                          setSelectedSupplier(supplier)
                          setShowSupplierDropdown(false)
                          setManufacturerSearch("")
                        }}
                        className="flex w-full items-center gap-3 border-b border-border p-3 text-left last:border-b-0 hover:bg-muted/50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Factory className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{supplier.name}</span>
                            {supplier.reviewed && (
                              <CheckCircle className="h-3 w-3 text-secondary" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {supplier.industry} • {supplier.location.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{supplier.rating}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Product */}
        {product && (
          <div className="rounded-xl border border-border bg-card p-6">
            <label className="text-sm font-medium text-foreground">
              Product Reference
            </label>
            <div className="mt-3 flex items-center gap-4 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${parseFloat(product.pricing_quantities.min_price.price.amount).toFixed(2)} - ${parseFloat(product.pricing_quantities.max_price.price.amount).toFixed(2)} / {product.pricing_quantities.unit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Product Details</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="quantity" className="text-sm font-medium text-foreground">
                Quantity <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="flex-1"
                  required
                  min="1"
                />
                <Select 
                  value={formData.quantity_unit} 
                  onValueChange={(value) => setFormData({ ...formData, quantity_unit: value })}
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
              <label htmlFor="target_price" className="text-sm font-medium text-foreground">
                Target Price (Optional)
              </label>
              <div className="mt-2 flex gap-2">
                <Select 
                  value={formData.target_currency_code} 
                  onValueChange={(value) => setFormData({ ...formData, target_currency_code: value })}
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
                  id="target_price"
                  type="number"
                  placeholder="15.00"
                  value={formData.target_price}
                  onChange={(e) => setFormData({ ...formData, target_price: e.target.value })}
                  className="flex-1"
                  step="0.01"
                  min="0"
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
              <label htmlFor="required_delivery_date" className="text-sm font-medium text-foreground">
                Required Delivery Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="required_delivery_date"
                type="date"
                value={formData.required_delivery_date}
                onChange={(e) => setFormData({ ...formData, required_delivery_date: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            <div>
              <label htmlFor="shipping_terms" className="text-sm font-medium text-foreground">
                Shipping Terms
              </label>
              <Select 
                value={formData.shipping_terms} 
                onValueChange={(value) => setFormData({ ...formData, shipping_terms: value })}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="destination_country" className="text-sm font-medium text-foreground">
                Destination Country <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.destination_country} 
                onValueChange={(value) => setFormData({ ...formData, destination_country: value })}
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
              <label htmlFor="destination_port_city" className="text-sm font-medium text-foreground">
                Destination Port / City
              </label>
              <Input
                id="destination_port_city"
                type="text"
                placeholder="e.g., Chattogram"
                value={formData.destination_port_city}
                onChange={(e) => setFormData({ ...formData, destination_port_city: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Packaging Requirements */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Packaging Requirements</h2>
          
          <div>
            <label htmlFor="packaging_details" className="text-sm font-medium text-foreground">
              Packaging Details
            </label>
            <Textarea
              id="packaging_details"
              placeholder="e.g., Standard Packaging, OEM logo required, export carton needed..."
              value={formData.packaging_details}
              onChange={(e) => setFormData({ ...formData, packaging_details: e.target.value })}
              className="mt-2 min-h-25"
            />
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="rounded-xl border border-border bg-card p-6">
          <label htmlFor="additional_requirements" className="text-sm font-medium text-foreground">
            Additional Requirements
          </label>
          <Textarea
            id="additional_requirements"
            placeholder="Include any specific requirements such as customization, certifications, quality standards, etc."
            value={formData.additional_requirements}
            onChange={(e) => setFormData({ ...formData, additional_requirements: e.target.value })}
            className="mt-3 min-h-30"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Fields marked with * are required
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/products">Cancel</Link>
          </Button>
          <Button 
            type="submit" 
            className="gap-2"
            disabled={!product || !formData.quantity || !formData.required_delivery_date || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Submit RFQ
              </>
            )}
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
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <NewRFQForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
