"use client"

import { use, useEffect, useMemo, useRef, useState } from "react"
import Swal from "sweetalert2"
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
  ImageIcon,
  DollarSign,
  Truck,
  Tags,
  FileText,
  Sparkles,
  Zap,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import {
  getAllPublicCategories,
  getAdminSubcategories,
  type BackendCategory,
  type BackendSubcategory,
} from "@/lib/api/categories"
import {
  buildManufacturerProductUpdateFormData,
  getManufacturerProductBySlug,
  getManufacturerCurrencies,
  getManufacturerShippingMethods,
  updateManufacturerProduct,
} from "@/lib/api/manufacturer-products"
import type {
  ManufacturerCurrencyOption,
  ManufacturerProductStatus,
  ManufacturerSelectOption,
} from "@/lib/api/manufacturer-products"

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

const FALLBACK_CURRENCIES: ManufacturerCurrencyOption[] = [
  { id: 1, code: "USD", name: "US Dollar", symbol: "$" },
  { id: 2, code: "EUR", name: "Euro", symbol: "€" },
  { id: 3, code: "SAR", name: "Saudi Riyal", symbol: "SR" },
]

function currencySelectValue(c: ManufacturerCurrencyOption): string {
  return c.id != null ? String(c.id) : c.code
}

function currencyMenuLabel(c: ManufacturerCurrencyOption): string {
  const sym = c.symbol ? ` (${c.symbol})` : ""
  return `${c.code} — ${c.name}${sym}`
}

const packagingTypes = [
  { value: "standard", label: "Standard Export Packaging" },
  { value: "custom", label: "Custom OEM Packaging" },
  { value: "neutral", label: "Neutral/White Label" },
  { value: "retail", label: "Retail Ready" },
  { value: "bulk", label: "Bulk Packaging" },
]

function packagingTypeLabel(value: string): string {
  const row = packagingTypes.find((t) => t.value === value)
  return row?.label ?? (value.trim() || "Standard Export Packaging")
}

function reversePackagingType(label: string): string {
  const row = packagingTypes.find(
    (t) => t.label.toLowerCase() === label.toLowerCase()
  )
  return row?.value ?? "standard"
}

function unitDisplayLabel(unitValue: string): string {
  const row = units.find((u) => u.value === unitValue)
  return row?.label ?? unitValue
}

function reverseUnit(label: string): string {
  const row = units.find(
    (u) => u.label.toLowerCase() === label.toLowerCase()
  )
  return row?.value ?? "pieces"
}

function productionDurationLabel(period: string): string {
  if (period === "day") return "Per Day"
  if (period === "week") return "Per Week"
  return "Per Month"
}

function reverseProductionDuration(label: string): string {
  const l = label.toLowerCase()
  if (l.includes("day")) return "day"
  if (l.includes("week")) return "week"
  return "month"
}

type ProductImageSlot = { file: File; url: string }

export default function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const brochureInputRef = useRef<HTMLInputElement>(null)

  const [loadingProduct, setLoadingProduct] = useState(true)
  const [productId, setProductId] = useState<number | null>(null)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newImageSlots, setNewImageSlots] = useState<ProductImageSlot[]>([])
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }])
  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [allSubcategories, setAllSubcategories] = useState<BackendSubcategory[]>([])
  const [currencyOptions, setCurrencyOptions] = useState<ManufacturerCurrencyOption[]>([])
  const [shippingOptions, setShippingOptions] = useState<ManufacturerSelectOption[]>([])
  const [brochureFile, setBrochureFile] = useState<File | null>(null)
  const [keyFeatures, setKeyFeatures] = useState<string[]>([""])
  const [customizationOptions, setCustomizationOptions] = useState<string[]>([""])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    priceMin: "",
    priceMax: "",
    currencyId: "",
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
    packagingCostPerUnit: "",
    portOfLoading: "",
    shippingMethodIds: [] as string[],
    sampleAvailable: false,
    samplePrice: "",
    customization: false,
    customizationDetails: "",
    keywords: "",
    status: "draft" as ManufacturerProductStatus,
  })

  // Load product
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoadingProduct(true)
      const res = await getManufacturerProductBySlug(slug)
      if (cancelled) return
      setLoadingProduct(false)
      if (!res.success || !res.data) {
        toast.error(res.message ?? "Could not load product.")
        router.push("/dashboard/manufacturer/products")
        return
      }
      const d = res.data
      setProductId(d.id)

      // Existing images
      const imgUrls = d.images
        .map((img) => img.url ?? img.file_path ?? img.path ?? "")
        .filter(Boolean)
      setExistingImageUrls(imgUrls)

      // Specifications
      if (d.specifications.length > 0) {
        setSpecifications(d.specifications.map((s) => ({ key: s.title, value: s.value })))
      }

      // Key features
      if (d.keyFeatures.length > 0) {
        setKeyFeatures(d.keyFeatures)
      }

      // Customize options
      if (d.customizeOptions.length > 0) {
        setCustomizationOptions(d.customizeOptions)
      }

      setFormData({
        name: d.name,
        description: d.description,
        categoryId: d.categoryId != null ? String(d.categoryId) : "",
        subCategoryId: d.subCategoryId != null ? String(d.subCategoryId) : "",
        priceMin: d.minPrice,
        priceMax: d.maxPrice,
        currencyId: d.currencyId != null ? String(d.currencyId) : "",
        moq: d.minimumOrderQuantity,
        moqUnit: reverseUnit(d.unit),
        leadTime: d.leadTime,
        supplyCapacity: d.productionCapacity,
        supplyUnit: reverseUnit(d.productionUnit),
        supplyPeriod: reverseProductionDuration(d.productionDuration),
        packaging: reversePackagingType(d.packagingType),
        packagingDetails: d.packagingDescription,
        packagingDimensions: d.packagingDimensions,
        packagingWeight: d.packagingWeight,
        packagingCostPerUnit: d.packagingCostPerUnit,
        portOfLoading: d.portOfLoading,
        shippingMethodIds: d.shippingMethodIds,
        sampleAvailable: d.sampleAvailable,
        samplePrice: d.samplePrice,
        customization: d.customizationAvailable,
        customizationDetails: d.customizationDetail,
        keywords: d.keywords.join(", "),
        status: d.status,
      })
    }
    void load()
    return () => { cancelled = true }
  }, [slug, router])

  // Load categories
  useEffect(() => {
    let cancelled = false
    async function loadCategories() {
      setCategoriesLoading(true)
      const res = await getAllPublicCategories({ perPage: 50 })
      if (cancelled) return
      setCategoriesLoading(false)
      if (!res.success) {
        toast.error(res.message ?? "Could not load categories.")
        setCategories([])
        return
      }
      const sorted = [...res.data].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      )
      setCategories(sorted)
    }
    void loadCategories()
    return () => { cancelled = true }
  }, [])

  // Load meta (currencies + shipping)
  useEffect(() => {
    let cancelled = false
    async function loadMeta() {
      const [cur, ship] = await Promise.all([
        getManufacturerCurrencies(),
        getManufacturerShippingMethods(),
      ])
      if (cancelled) return
      const curOpts = cur.success && cur.data.length > 0 ? cur.data : FALLBACK_CURRENCIES
      setCurrencyOptions(curOpts)
      setShippingOptions(ship.success ? ship.data : [])
    }
    void loadMeta()
    return () => { cancelled = true }
  }, [])

  // Load subcategories
  useEffect(() => {
    let cancelled = false
    async function loadSubcategories() {
      const res = await getAdminSubcategories()
      if (cancelled) return
      if (res.success) setAllSubcategories(res.data)
    }
    void loadSubcategories()
    return () => { cancelled = true }
  }, [])

  const selectedCategory = categories.find((c) => String(c.id) === formData.categoryId)
  const subcategoriesForCategory = useMemo(() => {
    const fromApi = allSubcategories.filter(
      (s) =>
        String(s.industry_id) === formData.categoryId ||
        String(s.category_id) === formData.categoryId
    )
    if (fromApi.length > 0) {
      return [...fromApi].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      )
    }
    const subs = selectedCategory?.subcategories ?? []
    return [...subs].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    )
  }, [selectedCategory, allSubcategories, formData.categoryId])

  const toggleShippingMethod = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      shippingMethodIds: prev.shippingMethodIds.includes(id)
        ? prev.shippingMethodIds.filter((x) => x !== id)
        : [...prev.shippingMethodIds, id],
    }))
  }

  const onPickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (!picked.length) return
    setNewImageSlots((prev) => {
      const cap = 10 - existingImageUrls.length - prev.length
      if (cap <= 0) return prev
      const next = [...prev]
      for (const file of picked.slice(0, cap)) {
        next.push({ file, url: URL.createObjectURL(file) })
      }
      return next
    })
  }

  const removeNewImageAt = (index: number) => {
    setNewImageSlots((prev) => {
      const row = prev[index]
      if (row) URL.revokeObjectURL(row.url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault()
    if (!productId) return
    if (!formData.categoryId.trim()) {
      toast.error("Please select a category.")
      return
    }
    if (!formData.currencyId.trim()) {
      toast.error("Please select a currency.")
      return
    }

    setIsSubmitting(true)
    const status: ManufacturerProductStatus = saveAsDraft ? "draft" : formData.status
    const keywords = formData.keywords
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const keyFeatureLines = keyFeatures.map((s) => s.trim()).filter(Boolean)
    const customizeLines = customizationOptions.map((s) => s.trim()).filter(Boolean)
    const specRows = specifications
      .map((s) => ({ title: s.key.trim(), value: s.value.trim() }))
      .filter((s) => s.title && s.value)

    const fd = buildManufacturerProductUpdateFormData({
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      subCategoryId: formData.subCategoryId,
      status,
      minPrice: formData.priceMin,
      maxPrice: formData.priceMax,
      currencyId: formData.currencyId,
      minimumOrderQuantity: formData.moq,
      unit: unitDisplayLabel(formData.moqUnit),
      leadTime: formData.leadTime,
      productionCapacity: formData.supplyCapacity.trim() || "0",
      productionDuration: productionDurationLabel(formData.supplyPeriod),
      productionUnit: unitDisplayLabel(formData.supplyUnit),
      customizeOptions: customizeLines,
      packagingType: packagingTypeLabel(formData.packaging),
      portOfLoading: formData.portOfLoading,
      packagingDimensions: formData.packagingDimensions,
      packagingWeight: formData.packagingWeight,
      packagingCostPerUnit: formData.packagingCostPerUnit,
      packagingDescription: formData.packagingDetails,
      shippingMethodIds: formData.shippingMethodIds,
      sampleAvailable: formData.sampleAvailable,
      samplePrice: formData.samplePrice,
      customizationAvailable: formData.customization,
      customizationDetail: formData.customizationDetails,
      keywords,
      keyFeatures: keyFeatureLines,
      specifications: specRows,
      imageFiles: newImageSlots.map((s) => s.file),
      brochureFile,
    })

    const res = await updateManufacturerProduct(productId, fd)
    setIsSubmitting(false)
    if (!res.success) {
      const errorLines: string[] = []
      if (res.errors && typeof res.errors === "object") {
        for (const msgs of Object.values(res.errors)) {
          if (Array.isArray(msgs)) {
            errorLines.push(...msgs.map((m) => `• ${m}`))
          }
        }
      }
      await Swal.fire({
        title: "Failed to Update Product",
        html: errorLines.length
          ? `<div style="text-align:left;line-height:1.8">${errorLines.join("<br/>")}</div>`
          : res.message ?? "Could not update product.",
        icon: "error",
        confirmButtonText: "OK",
      })
      return
    }
    toast.success(res.message ?? "Product updated.")
    router.push("/dashboard/manufacturer/products")
  }

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading product…
      </div>
    )
  }

  const totalImages = existingImageUrls.length + newImageSlots.length

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
          <h1 className="font-serif text-2xl font-medium text-foreground">Edit Product</h1>
          <p className="mt-1 text-muted-foreground">Update your product details</p>
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
                placeholder="Describe your product in detail…"
                className="mt-2 min-h-30"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="category-parent">Category *</Label>
                <Select
                  value={formData.categoryId || undefined}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value, subCategoryId: "" })
                  }
                  disabled={categoriesLoading || categories.length === 0}
                >
                  <SelectTrigger id="category-parent" className="mt-2">
                    <SelectValue
                      placeholder={
                        categoriesLoading
                          ? "Loading categories…"
                          : categories.length === 0
                            ? "No categories available"
                            : "Select category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={String(cat.id)} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subcategory">Sub-category</Label>
                <Select
                  value={formData.subCategoryId || undefined}
                  onValueChange={(value) => setFormData({ ...formData, subCategoryId: value })}
                  disabled={!formData.categoryId || subcategoriesForCategory.length === 0}
                >
                  <SelectTrigger id="subcategory" className="mt-2">
                    <SelectValue
                      placeholder={
                        !formData.categoryId
                          ? "Select a category first"
                          : subcategoriesForCategory.length === 0
                            ? "No sub-categories"
                            : "Select sub-category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategoriesForCategory.map((sub) => (
                      <SelectItem key={String(sub.id)} value={String(sub.id)}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as ManufacturerProductStatus })
                }
              >
                <SelectTrigger id="status" className="mt-2 max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
              <p className="text-sm text-muted-foreground">
                Existing images are kept. Upload additional images below.
              </p>
            </div>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={onPickImages}
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {/* Existing images (read-only) */}
            {existingImageUrls.map((url, index) => (
              <div
                key={`existing-${index}`}
                className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-[10px] text-white">
                  saved
                </span>
              </div>
            ))}

            {/* New image uploads */}
            {newImageSlots.map((slot, index) => (
              <div
                key={`new-${slot.url}-${index}`}
                className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slot.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImageAt(index)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {totalImages < 10 && (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-secondary hover:text-secondary"
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs">Add more</span>
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
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
                <Label htmlFor="currency">Currency *</Label>
                <Select
                  value={formData.currencyId || undefined}
                  onValueChange={(value) => setFormData({ ...formData, currencyId: value })}
                  disabled={currencyOptions.length === 0}
                >
                  <SelectTrigger id="currency" className="mt-2">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((c) => (
                      <SelectItem key={currencySelectValue(c)} value={currencySelectValue(c)}>
                        {currencyMenuLabel(c)}
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
                  onChange={(e) => {
                    const updated = [...specifications]
                    updated[index].key = e.target.value
                    setSpecifications(updated)
                  }}
                  className="flex-1"
                />
                <Input
                  placeholder="Value (e.g., Stainless Steel)"
                  value={spec.value}
                  onChange={(e) => {
                    const updated = [...specifications]
                    updated[index].value = e.target.value
                    setSpecifications(updated)
                  }}
                  className="flex-1"
                />
                {specifications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSpecifications(specifications.filter((_, i) => i !== index))}
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
              onClick={() => setSpecifications([...specifications, { key: "", value: "" }])}
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
              <p className="text-sm text-muted-foreground">
                Highlight the main selling points of your product
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  placeholder={`Feature ${index + 1}`}
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
              <p className="text-sm text-muted-foreground">
                What can buyers customize for this product?
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {customizationOptions.map((option, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  placeholder={`Option ${index + 1} (e.g., "Logo printing")`}
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
                    onClick={() =>
                      setCustomizationOptions(customizationOptions.filter((_, i) => i !== index))
                    }
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
                <Label>Packaging Type</Label>
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

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="packagingDimensions">Package Dimensions</Label>
                <Input
                  id="packagingDimensions"
                  value={formData.packagingDimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, packagingDimensions: e.target.value })
                  }
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
                <Label htmlFor="packagingCostPerUnit">Packaging cost per unit</Label>
                <Input
                  id="packagingCostPerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.packagingCostPerUnit}
                  onChange={(e) =>
                    setFormData({ ...formData, packagingCostPerUnit: e.target.value })
                  }
                  placeholder="0"
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
                placeholder="Describe your packaging in detail…"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Shipping Methods</Label>
              <div className="mt-3 flex flex-wrap gap-3">
                {shippingOptions.length === 0 ? (
                  <span className="text-sm text-muted-foreground">
                    No shipping methods returned — you can still submit.
                  </span>
                ) : (
                  shippingOptions.map((method) => {
                    const idStr = String(method.id)
                    return (
                      <label key={method.id} className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={formData.shippingMethodIds.includes(idStr)}
                          onCheckedChange={() => toggleShippingMethod(idStr)}
                        />
                        <span className="text-sm">{method.name}</span>
                      </label>
                    )
                  })
                )}
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
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sampleAvailable: checked as boolean })
                }
              />
              <div>
                <Label htmlFor="sampleAvailable" className="cursor-pointer">
                  Samples Available
                </Label>
                <p className="text-sm text-muted-foreground">Buyers can request product samples</p>
              </div>
            </div>

            {formData.sampleAvailable && (
              <div className="ml-6">
                <Label htmlFor="samplePrice">Sample Price</Label>
                <div className="relative mt-2 max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="samplePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.samplePrice}
                    onChange={(e) => setFormData({ ...formData, samplePrice: e.target.value })}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Checkbox
                id="customization"
                checked={formData.customization}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, customization: checked as boolean })
                }
              />
              <div>
                <Label htmlFor="customization" className="cursor-pointer">
                  Customization Available
                </Label>
                <p className="text-sm text-muted-foreground">OEM/ODM services for this product</p>
              </div>
            </div>

            {formData.customization && (
              <div className="ml-6">
                <Label htmlFor="customizationDetails">Customization Details</Label>
                <Textarea
                  id="customizationDetails"
                  value={formData.customizationDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, customizationDetails: e.target.value })
                  }
                  placeholder="Describe available customization options…"
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
                placeholder="wireless earbuds, bluetooth headphones"
                className="mt-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">Separate keywords with commas.</p>
            </div>
          </div>
        </div>

        {/* Brochure */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground mb-4">Product Brochure</h2>
          <div className="space-y-3">
            <input
              ref={brochureInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setBrochureFile(file)
                e.target.value = ""
              }}
            />
            {brochureFile ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
                <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="flex-1 text-sm truncate">{brochureFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setBrochureFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => brochureInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") brochureInputRef.current?.click()
                }}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-muted-foreground transition-colors hover:border-secondary hover:text-secondary"
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm">Upload new brochure (PDF, DOC)</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
