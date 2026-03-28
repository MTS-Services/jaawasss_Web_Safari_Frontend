"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ArrowLeft,
  Upload,
  X,
  Plus,
  Package,
  Info,
  ImageIcon,
  DollarSign,
  Truck,
  Tags,
  FileText,
  Sparkles,
  Zap,
  BoxIcon
} from "lucide-react"
import { industries } from "@/lib/data/industries"

const units = [
  { value: "pieces", label: "Pieces" },
  { value: "sets", label: "Sets" },
  { value: "kg", label: "Kilograms" },
  { value: "tons", label: "Metric Tons" },
  { value: "meters", label: "Meters" },
  { value: "sqm", label: "Square Meters" },
  { value: "liters", label: "Liters" },
  { value: "boxes", label: "Boxes" },
  { value: "cartons", label: "Cartons" },
  { value: "pallets", label: "Pallets" },
]

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
]

const shippingMethods = [
  { value: "air", label: "Air Freight" },
  { value: "sea", label: "Sea Freight" },
  { value: "land", label: "Land Freight" },
  { value: "express", label: "Express Courier" },
]

const packagingTypes = [
  { value: "standard", label: "Standard Export Packaging" },
  { value: "custom", label: "Custom OEM Packaging" },
  { value: "neutral", label: "Neutral/White Label" },
  { value: "retail", label: "Retail Ready" },
  { value: "bulk", label: "Bulk Packaging" },
]

export default function AddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [specifications, setSpecifications] = useState([
    { key: "", value: "" }
  ])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    category: "",
    priceMin: "",
    priceMax: "",
    currency: "USD",
    moq: "",
    moqUnit: "pieces",
    leadTime: "",
    supplyCapacity: "",
    supplyUnit: "pieces",
    supplyPeriod: "month",
    packaging: "",
    packagingDetails: "",
    packagingDimensions: "",
    packagingWeight: "",
    unitsPerCarton: "",
    shippingMethods: [] as string[],
    portOfLoading: "",
    sampleAvailable: false,
    samplePrice: "",
    customization: false,
    customizationDetails: "",
    certifications: [] as string[],
    keywords: "",
    status: "draft",
    brochureUrl: ""
  })
  const [keyFeatures, setKeyFeatures] = useState<string[]>([""])
  const [customizationOptions, setCustomizationOptions] = useState<string[]>([""])

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }])
  }

  const handleRemoveSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const handleSpecificationChange = (index: number, field: "key" | "value", value: string) => {
    const updated = [...specifications]
    updated[index][field] = value
    setSpecifications(updated)
  }

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    router.push("/dashboard/manufacturer/products")
  }

  const selectedIndustry = industries.find(i => i.slug === formData.industry)

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/manufacturer/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Add New Product</h1>
          <p className="mt-1 text-muted-foreground">
            Fill in the details to list your product
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
        {/* Basic Information */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Package className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Basic Information</h2>
              <p className="text-sm text-muted-foreground">Product name and description</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Wireless Bluetooth Earbuds TWS"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Product Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product in detail, including key features and benefits..."
                className="mt-2 min-h-[120px]"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => setFormData({ ...formData, industry: value, category: "" })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.slug} value={industry.slug}>
                        {industry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={!formData.industry}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={formData.industry ? "Select category" : "Select industry first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry?.categories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <ImageIcon className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Product Images</h2>
              <p className="text-sm text-muted-foreground">Upload up to 10 high-quality images</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg border border-border bg-muted">
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {images.length < 10 && (
              <button
                type="button"
                onClick={() => setImages([...images, "placeholder"])}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-secondary hover:text-secondary"
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs">Upload</span>
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Recommended: 800x800px or larger. JPG, PNG, or WebP format.
          </p>
        </div>

        {/* Pricing & MOQ */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Pricing & Quantity</h2>
              <p className="text-sm text-muted-foreground">Set your price range and minimum order</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <Label htmlFor="priceMin">Price Min *</Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="priceMin"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.priceMin}
                    onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                    placeholder="0.00"
                    className="pl-7"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="priceMax">Price Max *</Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="priceMax"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.priceMax}
                    onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                    placeholder="0.00"
                    className="pl-7"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="moq">Minimum Order Quantity (MOQ) *</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="moq"
                    type="number"
                    min="1"
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                    placeholder="100"
                    required
                  />
                  <Select 
                    value={formData.moqUnit} 
                    onValueChange={(value) => setFormData({ ...formData, moqUnit: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="leadTime">Lead Time *</Label>
                <Input
                  id="leadTime"
                  value={formData.leadTime}
                  onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                  placeholder="e.g., 15-20 days"
                  className="mt-2"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="supplyCapacity">Supply Capacity</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="supplyCapacity"
                  type="number"
                  min="0"
                  value={formData.supplyCapacity}
                  onChange={(e) => setFormData({ ...formData, supplyCapacity: e.target.value })}
                  placeholder="10000"
                />
                <Select 
                  value={formData.supplyUnit} 
                  onValueChange={(value) => setFormData({ ...formData, supplyUnit: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={formData.supplyPeriod} 
                  onValueChange={(value) => setFormData({ ...formData, supplyPeriod: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Per Day</SelectItem>
                    <SelectItem value="week">Per Week</SelectItem>
                    <SelectItem value="month">Per Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <FileText className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Product Specifications</h2>
              <p className="text-sm text-muted-foreground">Add detailed specifications</p>
            </div>
          </div>

          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  placeholder="Specification (e.g., Material)"
                  value={spec.key}
                  onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value (e.g., Stainless Steel)"
                  value={spec.value}
                  onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                  className="flex-1"
                />
                {specifications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSpecification(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSpecification}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Specification
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Zap className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Key Features</h2>
              <p className="text-sm text-muted-foreground">Highlight the main selling points of your product</p>
            </div>
          </div>

          <div className="space-y-3">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  placeholder={`Feature ${index + 1} (e.g., "Active Noise Cancellation")`}
                  value={feature}
                  onChange={(e) => {
                    const updated = [...keyFeatures]
                    updated[index] = e.target.value
                    setKeyFeatures(updated)
                  }}
                  className="flex-1"
                />
                {keyFeatures.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setKeyFeatures(keyFeatures.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setKeyFeatures([...keyFeatures, ""])}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Feature
            </Button>
            <p className="text-xs text-muted-foreground">
              Add up to 10 key features that make your product stand out
            </p>
          </div>
        </div>

        {/* Customization Options */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Customization Options</h2>
              <p className="text-sm text-muted-foreground">What can buyers customize for this product?</p>
            </div>
          </div>

          <div className="space-y-3">
            {customizationOptions.map((option, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  placeholder={`Option ${index + 1} (e.g., "Logo printing", "Custom color")`}
                  value={option}
                  onChange={(e) => {
                    const updated = [...customizationOptions]
                    updated[index] = e.target.value
                    setCustomizationOptions(updated)
                  }}
                  className="flex-1"
                />
                {customizationOptions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setCustomizationOptions(customizationOptions.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCustomizationOptions([...customizationOptions, ""])}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
            <p className="text-xs text-muted-foreground">
              Common options: Logo printing, Custom color, Custom packaging, OEM branding
            </p>
          </div>
        </div>

        {/* Shipping & Packaging */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Truck className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Shipping & Packaging</h2>
              <p className="text-sm text-muted-foreground">Logistics and packaging details</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="packaging">Packaging Type</Label>
                <Select 
                  value={formData.packaging} 
                  onValueChange={(value) => setFormData({ ...formData, packaging: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select packaging type" />
                  </SelectTrigger>
                  <SelectContent>
                    {packagingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="portOfLoading">Port of Loading</Label>
                <Input
                  id="portOfLoading"
                  value={formData.portOfLoading}
                  onChange={(e) => setFormData({ ...formData, portOfLoading: e.target.value })}
                  placeholder="e.g., Shanghai Port"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <Label htmlFor="packagingDimensions">Package Dimensions</Label>
                <Input
                  id="packagingDimensions"
                  value={formData.packagingDimensions}
                  onChange={(e) => setFormData({ ...formData, packagingDimensions: e.target.value })}
                  placeholder="e.g., 10x8x4 cm"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="packagingWeight">Package Weight</Label>
                <Input
                  id="packagingWeight"
                  value={formData.packagingWeight}
                  onChange={(e) => setFormData({ ...formData, packagingWeight: e.target.value })}
                  placeholder="e.g., 85g"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="unitsPerCarton">Units per Carton</Label>
                <Input
                  id="unitsPerCarton"
                  type="number"
                  min="1"
                  value={formData.unitsPerCarton}
                  onChange={(e) => setFormData({ ...formData, unitsPerCarton: e.target.value })}
                  placeholder="e.g., 50"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="packagingDetails">Packaging Description</Label>
              <Textarea
                id="packagingDetails"
                value={formData.packagingDetails}
                onChange={(e) => setFormData({ ...formData, packagingDetails: e.target.value })}
                placeholder="Describe your packaging in detail (materials used, inserts, branding options...)"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Available Shipping Methods</Label>
              <div className="mt-3 flex flex-wrap gap-3">
                {shippingMethods.map((method) => (
                  <label key={method.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.shippingMethods.includes(method.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            shippingMethods: [...formData.shippingMethods, method.value]
                          })
                        } else {
                          setFormData({
                            ...formData,
                            shippingMethods: formData.shippingMethods.filter(m => m !== method.value)
                          })
                        }
                      }}
                    />
                    <span className="text-sm">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Tags className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Additional Options</h2>
              <p className="text-sm text-muted-foreground">Samples, customization, and keywords</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Checkbox
                id="sampleAvailable"
                checked={formData.sampleAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, sampleAvailable: checked as boolean })}
              />
              <div>
                <Label htmlFor="sampleAvailable" className="cursor-pointer">Samples Available</Label>
                <p className="text-sm text-muted-foreground">Buyers can request product samples</p>
              </div>
            </div>

            {formData.sampleAvailable && (
              <div className="ml-6">
                <Label htmlFor="samplePrice">Sample Price</Label>
                <div className="relative mt-2 max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="samplePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.samplePrice}
                    onChange={(e) => setFormData({ ...formData, samplePrice: e.target.value })}
                    placeholder="0.00 (Free if empty)"
                    className="pl-7"
                  />
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Checkbox
                id="customization"
                checked={formData.customization}
                onCheckedChange={(checked) => setFormData({ ...formData, customization: checked as boolean })}
              />
              <div>
                <Label htmlFor="customization" className="cursor-pointer">Customization Available</Label>
                <p className="text-sm text-muted-foreground">OEM/ODM services for this product</p>
              </div>
            </div>

            {formData.customization && (
              <div className="ml-6">
                <Label htmlFor="customizationDetails">Customization Details</Label>
                <Textarea
                  id="customizationDetails"
                  value={formData.customizationDetails}
                  onChange={(e) => setFormData({ ...formData, customizationDetails: e.target.value })}
                  placeholder="Describe available customization options (logo printing, color options, packaging design...)"
                  className="mt-2"
                />
              </div>
            )}

            <div>
              <Label htmlFor="keywords">Product Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="wireless earbuds, bluetooth headphones, tws earphones"
                className="mt-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Separate keywords with commas. These help buyers find your product.
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Label>Product Brochure / PDF</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a PDF brochure or datasheet for buyers to download
              </p>
              <div className="mt-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/50 p-4 cursor-pointer hover:border-secondary transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Upload PDF</p>
                      <p className="text-xs text-muted-foreground">Max 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/manufacturer/products">Cancel</Link>
          </Button>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
