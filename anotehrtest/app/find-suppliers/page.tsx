"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Send,
  Sparkles,
  Package,
  Globe,
  FileText,
  Loader2,
  Check,
  Search,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  Star,
  Clock,
  Boxes,
  Shield,
  Plus,
  AlertCircle,
  Eye,
  Trash2,
  Bell,
  Edit3,
  Paperclip,
  Truck,
  CreditCard,
  X,
  Tag,
  Calendar,
  HelpCircle,
  ClipboardList,
  ListChecks,
  Zap,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { cn } from "@/lib/utils"
import { suppliers as allSuppliers, Supplier } from "@/lib/data/suppliers"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface UploadedFile {
  name: string
  type: string
}

interface SourcingData {
  product: string
  productSpecificFields: Record<string, string>
  productNotes: string
  quantity: string
  country: string
  targetPrice: string
  packaging: string
  privateLabel: "yes" | "no" | "unsure" | ""
  brandingNotes: string
  certifications: string[]
  requirements: string
  incoterms: string
  timeline: string
  notes: string
  files: UploadedFile[]
}

interface SupplierMatch {
  supplier: Supplier
  matchScore: number
  selected: boolean
}

interface SupplierOffer {
  supplier: Supplier
  price: string
  pricePerUnit: number
  moq: string
  leadTime: string
  packaging: string
  shippingTerms: string
  paymentTerms: string
  rating: number
}

interface SourcingRequest {
  id: string
  data: SourcingData
  status: "waiting" | "partial" | "complete"
  createdAt: Date
  suppliersContacted: number
  responsesReceived: number
  supplierMatches: SupplierMatch[]
  supplierOffers: SupplierOffer[]
}

type Mode = "build" | "matching" | "select" | "sending" | "waiting" | "results"

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------
const emptyData: SourcingData = {
  product: "",
  productSpecificFields: {},
  productNotes: "",
  quantity: "",
  country: "",
  targetPrice: "",
  packaging: "",
  privateLabel: "",
  brandingNotes: "",
  certifications: [],
  requirements: "",
  incoterms: "",
  timeline: "",
  notes: "",
  files: [],
}

const builderSteps = [
  { label: "Product", icon: Package },
  { label: "Product Details", icon: ListChecks },
  { label: "Quantity & Destination", icon: Globe },
  { label: "Packaging & Branding", icon: Boxes },
  { label: "Certifications", icon: Shield },
  { label: "Shipping & Timeline", icon: Truck },
  { label: "Review", icon: ClipboardList },
  { label: "Match", icon: Search },
  { label: "Send RFQ", icon: Send },
]

const productSuggestions = ["Toilet paper rolls", "Face serums", "LED strip lights", "Cotton t-shirts", "Coffee mugs", "Yoga mats"]
const popularCountries = ["United States", "Germany", "United Kingdom", "France", "UAE", "Canada", "Australia", "Japan"]
const quantityOptions = ["1,000 units", "5,000 units", "10,000 units", "50,000+ units"]
const packagingOptions = ["Standard export cartons", "Individual retail boxes", "Bulk packaging", "Custom packaging"]
const certOptions = ["ISO 9001", "CE", "FDA", "GOTS", "OEKO-TEX", "FSC", "Halal", "BSCI"]
const incotermsOptions = ["FOB", "CIF", "EXW", "DDP"]
const timelineOptions = ["Within 30 days", "1-2 months", "2-3 months", "Flexible"]

// Product-specific spec fields ------------------------------------------------
// Each product category generates smart, tailored follow-up questions so the
// RFQ that reaches the manufacturer already contains everything needed for an
// accurate quotation. Fields can be free text or quick-select chips, and the
// most important ones are flagged so missing-info detection can surface them.
interface SpecField {
  id: string
  label: string
  placeholder?: string
  type?: "text" | "select"
  options?: string[]
  important?: boolean
}
interface ProductSpec {
  category: string
  fields: SpecField[]
  suggestedCerts: string[]
}

const productSpecRules: { match: string[]; spec: ProductSpec }[] = [
  {
    match: ["toilet paper", "tissue", "paper towel", "napkin", "kitchen roll", "facial tissue"],
    spec: {
      category: "Toilet paper & tissue",
      fields: [
        { id: "ply", label: "Number of plies", type: "select", options: ["1-ply", "2-ply", "3-ply", "4-ply"], important: true },
        { id: "rollsPerPack", label: "Rolls per pack", type: "select", options: ["4 rolls", "6 rolls", "8 rolls", "10 rolls", "12 rolls", "24 rolls"], important: true },
        { id: "sheetsPerRoll", label: "Sheets per roll", placeholder: "e.g., 200 sheets", important: true },
        { id: "rollSize", label: "Roll size / dimensions", placeholder: "e.g., 10cm x 10cm, 90mm width" },
        { id: "gsm", label: "GSM / paper quality", placeholder: "e.g., 16-18 GSM, virgin pulp" },
        { id: "coreType", label: "Core type", type: "select", options: ["With core", "Coreless", "No preference"] },
        { id: "embossed", label: "Embossed / printed", type: "select", options: ["Plain", "Embossed", "Printed design"] },
      ],
      suggestedCerts: ["FSC", "ISO 9001"],
    },
  },
  {
    match: ["cooking oil", "edible oil", "sunflower oil", "olive oil", "vegetable oil", "palm oil", "corn oil", "soybean oil", "canola"],
    spec: {
      category: "Cooking oil",
      fields: [
        { id: "oilType", label: "Oil type", type: "select", options: ["Sunflower", "Olive", "Palm", "Corn", "Soybean", "Canola", "Vegetable blend"], important: true },
        { id: "grade", label: "Grade / refinement", type: "select", options: ["Refined", "Cold-pressed", "Extra virgin", "Crude"], important: true },
        { id: "containerSize", label: "Bottle / gallon size", type: "select", options: ["500 ml", "1 L", "2 L", "5 L", "10 L", "20 L drum"], important: true },
        { id: "containerType", label: "Container material", type: "select", options: ["PET bottle", "Glass bottle", "Metal tin", "Jerrycan", "Bulk drum"] },
        { id: "shelfLife", label: "Shelf life required", placeholder: "e.g., 18 months minimum", important: true },
        { id: "fillNotes", label: "Filling / labeling notes", placeholder: "e.g., nitrogen flush, tamper seal" },
      ],
      suggestedCerts: ["FDA", "ISO 22000", "Halal", "HACCP"],
    },
  },
  {
    match: ["charcoal", "briquette", "lump charcoal", "shisha coal", "hookah coal", "bbq coal"],
    spec: {
      category: "Charcoal",
      fields: [
        { id: "charcoalType", label: "Charcoal type", type: "select", options: ["Hardwood lump", "Briquette", "Coconut shell", "Bamboo", "Sawdust"], important: true },
        { id: "usage", label: "Primary usage", type: "select", options: ["Barbecue", "Hookah / shisha", "Restaurant", "Retail", "Industrial"], important: true },
        { id: "bagSize", label: "Bag size", type: "select", options: ["1 kg", "3 kg", "5 kg", "10 kg", "15 kg", "Bulk ton"], important: true },
        { id: "burningTime", label: "Burning time", placeholder: "e.g., 2-3 hours", important: true },
        { id: "smokeOdor", label: "Low smoke / no smell", type: "select", options: ["Low smoke required", "No odor required", "Both required", "No preference"] },
        { id: "ashContent", label: "Ash content / fixed carbon", placeholder: "e.g., <3% ash, 80%+ carbon" },
        { id: "moisture", label: "Moisture content", placeholder: "e.g., under 8%" },
      ],
      suggestedCerts: ["ISO 9001", "SGS Tested", "REACH"],
    },
  },
  {
    match: ["coffee", "espresso", "coffee bean", "ground coffee", "instant coffee"],
    spec: {
      category: "Coffee",
      fields: [
        { id: "form", label: "Form", type: "select", options: ["Whole beans", "Ground", "Instant", "Pods / capsules"], important: true },
        { id: "roast", label: "Roast level", type: "select", options: ["Light", "Medium", "Medium-dark", "Dark"], important: true },
        { id: "origin", label: "Origin / blend", placeholder: "e.g., 100% Arabica, Colombian" },
        { id: "packSize", label: "Pack size", type: "select", options: ["250 g", "500 g", "1 kg", "Bulk"], important: true },
        { id: "shelfLife", label: "Shelf life required", placeholder: "e.g., 12 months" },
      ],
      suggestedCerts: ["FDA", "ISO 22000", "Organic", "Fairtrade"],
    },
  },
  {
    match: ["water", "beverage", "juice", "soft drink", "soda", "energy drink"],
    spec: {
      category: "Beverages",
      fields: [
        { id: "bottleSize", label: "Bottle / can size", type: "select", options: ["250 ml", "330 ml", "500 ml", "1 L", "1.5 L", "2 L"], important: true },
        { id: "containerType", label: "Container type", type: "select", options: ["PET bottle", "Glass bottle", "Aluminum can", "Carton"], important: true },
        { id: "variant", label: "Variant", type: "select", options: ["Still", "Sparkling", "Flavored", "Sugar-free"] },
        { id: "shelfLife", label: "Shelf life required", placeholder: "e.g., 12 months", important: true },
      ],
      suggestedCerts: ["FDA", "ISO 22000", "HACCP", "Halal"],
    },
  },
  {
    match: ["electronic", "led", "charger", "cable", "power bank", "earbud", "speaker", "adapter"],
    spec: {
      category: "Electronics",
      fields: [
        { id: "voltage", label: "Voltage / power", placeholder: "e.g., 5V/2A, 110-240V", important: true },
        { id: "connector", label: "Connector / interface", placeholder: "e.g., USB-C, Lightning", important: true },
        { id: "capacity", label: "Capacity / rating", placeholder: "e.g., 10000mAh, 20W" },
        { id: "warranty", label: "Warranty required", type: "select", options: ["6 months", "1 year", "2 years", "No preference"] },
      ],
      suggestedCerts: ["CE", "FCC", "RoHS", "ISO 9001"],
    },
  },
  {
    match: ["textile", "cotton", "fabric", "t-shirt", "apparel", "garment", "clothing", "hoodie", "towel", "bedding"],
    spec: {
      category: "Textiles & apparel",
      fields: [
        { id: "material", label: "Material composition", placeholder: "e.g., 100% organic cotton", important: true },
        { id: "gsm", label: "GSM / fabric weight", placeholder: "e.g., 180 GSM", important: true },
        { id: "sizes", label: "Size range", placeholder: "e.g., S-XXL", important: true },
        { id: "colors", label: "Colors", placeholder: "e.g., black, white, navy" },
        { id: "printing", label: "Printing / decoration", type: "select", options: ["None", "Screen print", "Embroidery", "DTG", "Sublimation"] },
      ],
      suggestedCerts: ["GOTS", "OEKO-TEX", "BSCI", "ISO 9001"],
    },
  },
  {
    match: ["cosmetic", "serum", "skincare", "beauty", "cream", "lotion", "shampoo", "soap", "makeup"],
    spec: {
      category: "Cosmetics & skincare",
      fields: [
        { id: "formulation", label: "Formulation type", type: "select", options: ["Cream", "Serum", "Lotion", "Gel", "Oil", "Bar / solid"], important: true },
        { id: "size", label: "Volume / size per unit", placeholder: "e.g., 30 ml, 100 ml", important: true },
        { id: "ingredients", label: "Key ingredients", placeholder: "e.g., Hyaluronic acid, Vitamin C", important: true },
        { id: "skinType", label: "Target / claims", placeholder: "e.g., anti-aging, sensitive skin" },
        { id: "shelfLife", label: "Shelf life required", placeholder: "e.g., 24 months" },
      ],
      suggestedCerts: ["FDA", "ISO 22716", "Halal", "Cruelty-free"],
    },
  },
  {
    match: ["furniture", "chair", "table", "sofa", "desk", "cabinet", "shelf"],
    spec: {
      category: "Furniture",
      fields: [
        { id: "material", label: "Primary material", type: "select", options: ["Solid wood", "MDF / engineered", "Metal", "Plastic", "Rattan", "Mixed"], important: true },
        { id: "dimensions", label: "Dimensions", placeholder: "e.g., 120 x 60 x 75 cm", important: true },
        { id: "finish", label: "Finish / color", placeholder: "e.g., matte walnut, white" },
        { id: "assembly", label: "Assembly", type: "select", options: ["Assembled", "Flat-pack / KD", "No preference"] },
      ],
      suggestedCerts: ["FSC", "ISO 9001", "CARB"],
    },
  },
  {
    match: ["food", "snack", "candy", "chocolate", "biscuit", "spice", "sauce", "canned", "frozen"],
    spec: {
      category: "Food products",
      fields: [
        { id: "variant", label: "Product type / flavor", placeholder: "e.g., milk chocolate, chili sauce", important: true },
        { id: "weight", label: "Weight per pack", type: "select", options: ["50 g", "100 g", "250 g", "500 g", "1 kg", "Bulk"], important: true },
        { id: "shelfLife", label: "Shelf life required", placeholder: "e.g., 12 months", important: true },
        { id: "ingredients", label: "Key ingredients / dietary", placeholder: "e.g., gluten-free, no preservatives" },
      ],
      suggestedCerts: ["FDA", "ISO 22000", "HACCP", "Halal", "Kosher"],
    },
  },
]

const getProductSpecificQuestions = (product: string): ProductSpec => {
  const p = product.toLowerCase().trim()
  if (p) {
    const rule = productSpecRules.find((r) => r.match.some((m) => p.includes(m)))
    if (rule) return rule.spec
  }
  return {
    category: "General",
    fields: [
      { id: "specs", label: "Key specifications", placeholder: "e.g., size, model, capacity", important: true },
      { id: "material", label: "Material / make-up", placeholder: "e.g., stainless steel, ABS plastic" },
      { id: "dimensions", label: "Dimensions / size", placeholder: "e.g., 20 x 10 cm" },
      { id: "color", label: "Color / finish", placeholder: "e.g., black, matte" },
    ],
    suggestedCerts: ["ISO 9001", "CE"],
  }
}

const matchSuppliers = (data: SourcingData): SupplierMatch[] => {
  const matches: SupplierMatch[] = []
  for (const supplier of allSuppliers) {
    let score = 50
    if (data.product) {
      const productLower = data.product.toLowerCase()
      if (supplier.mainProducts.some((p) => p.toLowerCase().includes(productLower))) score += 30
      if (supplier.categories.some((c) => c.toLowerCase().includes(productLower))) score += 20
      if (supplier.description.toLowerCase().includes(productLower)) score += 10
    }
    if (data.certifications.length > 0) {
      const certMatch = data.certifications.filter((cert) =>
        supplier.certifications.some((sc) => sc.toLowerCase().includes(cert.toLowerCase())),
      ).length
      score += certMatch * 10
    }
    if (data.privateLabel === "yes" && supplier.capabilities?.includes("private-label")) score += 15
    score += supplier.rating * 2
    matches.push({ supplier, matchScore: Math.min(score, 100), selected: true })
  }
  return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6)
}

const generateOffers = (matchesIn: SupplierMatch[], data: SourcingData): SupplierOffer[] => {
  const shipping = data.incoterms && data.incoterms !== "Not sure" ? data.incoterms : ["FOB", "CIF", "EXW"][Math.floor(Math.random() * 3)]
  const paymentOptions = ["30% deposit, 70% before shipping", "50% deposit, 50% on delivery", "Letter of Credit"]
  return matchesIn
    .filter((m) => m.selected)
    .map((match) => {
      const basePrice = 0.5 + Math.random() * 2
      return {
        supplier: match.supplier,
        price: `$${basePrice.toFixed(2)} / unit`,
        pricePerUnit: parseFloat(basePrice.toFixed(2)),
        moq: `${[500, 1000, 2000, 5000][Math.floor(Math.random() * 4)]} units`,
        leadTime: `${[14, 21, 30, 45][Math.floor(Math.random() * 4)]} days`,
        packaging: data.packaging || "Standard export cartons",
        shippingTerms: shipping,
        paymentTerms: paymentOptions[Math.floor(Math.random() * paymentOptions.length)],
        rating: match.supplier.rating,
      }
    })
}

const initialSavedRequests: SourcingRequest[] = [
  {
    id: "req-1",
    data: {
      ...emptyData,
      product: "Organic cotton towels",
      country: "Germany",
      quantity: "5,000 units",
      packaging: "Individual retail boxes",
      privateLabel: "yes",
      certifications: ["GOTS", "OEKO-TEX"],
      incoterms: "FOB",
      timeline: "1-2 months",
    },
    status: "complete",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    suppliersContacted: 4,
    responsesReceived: 4,
    supplierMatches: [],
    supplierOffers: [],
  },
]

const locationLabel = (s: Supplier) => `${s.location.city}, ${s.location.country}`

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------
function QuickButton({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "border-secondary bg-secondary/10 text-secondary"
          : "border-border bg-background text-foreground hover:border-secondary/50 hover:bg-secondary/5",
        className,
      )}
    >
      {active && <Check className="h-3.5 w-3.5" />}
      {children}
    </button>
  )
}

function StepHeading({ step, total, title, subtitle }: { step: number; total: number; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-medium uppercase tracking-wide text-secondary">
        Step {step} of {total}
      </p>
      <h2 className="mt-1 font-serif text-xl font-medium text-foreground text-balance">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground text-pretty">{subtitle}</p>
    </div>
  )
}

function ReviewRow({
  icon: Icon,
  label,
  value,
  required,
  missing,
}: {
  icon: React.ElementType
  label: string
  value?: string
  required?: boolean
  missing?: boolean
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          {required && <span className="text-xs font-semibold text-destructive">*</span>}
        </div>
        {missing ? (
          <p className="flex items-center gap-1 text-sm font-medium text-amber-700">
            <AlertCircle className="h-3.5 w-3.5" />
            Not provided
          </p>
        ) : (
          <p className="break-words text-sm font-medium text-foreground">{value}</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function FindSuppliersPage() {
  const [mode, setMode] = useState<Mode>("build")
  const [buildStep, setBuildStep] = useState(0)
  const [data, setData] = useState<SourcingData>(emptyData)
  const [supplierMatches, setSupplierMatches] = useState<SupplierMatch[]>([])
  const [supplierOffers, setSupplierOffers] = useState<SupplierOffer[]>([])
  const [savedRequests, setSavedRequests] = useState<SourcingRequest[]>(initialSavedRequests)
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null)
  const [showMyRequests, setShowMyRequests] = useState(false)
  const [matchingStatus, setMatchingStatus] = useState("")
  const [showRequiredHint, setShowRequiredHint] = useState(false)
  // Tracks which select-type spec fields the buyer switched to a custom value for.
  const [customSpecFields, setCustomSpecFields] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const specQuestions = getProductSpecificQuestions(data.product)

  const update = (u: Partial<SourcingData>) => setData((prev) => ({ ...prev, ...u }))
  const updateSpec = (id: string, value: string) =>
    setData((prev) => ({ ...prev, productSpecificFields: { ...prev.productSpecificFields, [id]: value } }))

  // Switch a select field between predefined options and a free-text custom value.
  const setSpecCustomMode = (id: string, custom: boolean) => {
    setCustomSpecFields((prev) => ({ ...prev, [id]: custom }))
    // Clear any previously selected predefined value when entering custom mode.
    updateSpec(id, "")
  }

  const toggleCert = (cert: string) =>
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }))

  // Validation -------------------------------------------------------------
  const requiredMissing = () => {
    const m: string[] = []
    if (!data.product.trim()) m.push("Product")
    if (!data.quantity.trim()) m.push("Quantity")
    if (!data.country.trim()) m.push("Destination country")
    return m
  }
  // Important product-specific specs that are missing (tailored to the product)
  const importantSpecsMissing = () =>
    specQuestions.fields
      .filter((f) => f.important && !(data.productSpecificFields[f.id] || "").trim())
      .map((f) => f.label)

  const recommendedMissing = () => {
    const m: string[] = [...importantSpecsMissing()]
    if (!data.targetPrice.trim()) m.push("Target price")
    if (!data.packaging.trim()) m.push("Packaging")
    if (data.certifications.length === 0) m.push("Certifications")
    if (!data.incoterms.trim()) m.push("Shipping terms")
    if (!data.timeline.trim()) m.push("Delivery timeline")
    return m
  }

  const canAdvance = () => {
    if (buildStep === 0) return data.product.trim().length > 0
    if (buildStep === 2) return data.quantity.trim().length > 0 && data.country.trim().length > 0
    return true
  }

  const goNext = () => {
    if (!canAdvance()) {
      setShowRequiredHint(true)
      return
    }
    setShowRequiredHint(false)
    setBuildStep((s) => Math.min(s + 1, 6))
  }
  const goBack = () => {
    setShowRequiredHint(false)
    setBuildStep((s) => Math.max(s - 1, 0))
  }

  // File upload ------------------------------------------------------------
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
      name: f.name,
      type: f.type.includes("image") ? "Image" : f.type.includes("pdf") ? "PDF" : "File",
    }))
    update({ files: [...data.files, ...newFiles] })
    e.target.value = ""
  }
  const removeFile = (i: number) => update({ files: data.files.filter((_, idx) => idx !== i) })

  // Flow transitions -------------------------------------------------------
  const handleConfirm = async () => {
    if (requiredMissing().length > 0) {
      setShowRequiredHint(true)
      return
    }
    setMode("matching")
    const statuses = [
      "Analyzing your requirements...",
      "Searching the manufacturer network...",
      "Matching by capability & certifications...",
      "Ranking the best manufacturers...",
    ]
    for (const s of statuses) {
      setMatchingStatus(s)
      await new Promise((r) => setTimeout(r, 700))
    }
    setSupplierMatches(matchSuppliers(data))
    setMatchingStatus("")
    setMode("select")
  }

  const selectedCount = supplierMatches.filter((m) => m.selected).length

  const handleSendRFQ = async () => {
    if (selectedCount === 0) return
    setMode("sending")
    await new Promise((r) => setTimeout(r, 1600))
    const newRequest: SourcingRequest = {
      id: `req-${Date.now()}`,
      data: { ...data },
      status: "waiting",
      createdAt: new Date(),
      suppliersContacted: selectedCount,
      responsesReceived: 0,
      supplierMatches: [...supplierMatches],
      supplierOffers: [],
    }
    setSavedRequests((prev) => [newRequest, ...prev])
    setActiveRequestId(newRequest.id)
    setMode("waiting")
  }

  const handleSimulateOffers = async () => {
    setMode("sending")
    await new Promise((r) => setTimeout(r, 1200))
    const offers = generateOffers(supplierMatches, data)
    setSupplierOffers(offers)
    if (activeRequestId) {
      setSavedRequests((prev) =>
        prev.map((req) =>
          req.id === activeRequestId
            ? { ...req, status: "complete" as const, responsesReceived: offers.length, supplierOffers: offers }
            : req,
        ),
      )
    }
    setMode("results")
  }

  const handleStartNew = () => {
    setMode("build")
    setBuildStep(0)
    setData(emptyData)
    setSupplierMatches([])
    setSupplierOffers([])
    setActiveRequestId(null)
    setShowMyRequests(false)
    setShowRequiredHint(false)
    setCustomSpecFields({})
  }

  const handleViewRequest = (request: SourcingRequest) => {
    setActiveRequestId(request.id)
    setData(request.data)
    setSupplierMatches(request.supplierMatches)
    setSupplierOffers(request.supplierOffers)
    setMode(request.status === "complete" ? "results" : "waiting")
    setShowMyRequests(false)
  }

  const handleDeleteRequest = (id: string) => {
    setSavedRequests((prev) => prev.filter((r) => r.id !== id))
    if (activeRequestId === id) handleStartNew()
  }

  const handleExport = () => {
    let content = `SOURCING REPORT\n${"=".repeat(50)}\n\n`
    content += `Product: ${data.product || "N/A"}\nDestination: ${data.country || "N/A"}\nQuantity: ${data.quantity || "N/A"}\n\nOFFERS\n${"-".repeat(50)}\n\n`
    supplierOffers.forEach((o, i) => {
      content += `${i + 1}. ${o.supplier.name}\n   Price: ${o.price}\n   MOQ: ${o.moq}\n   Lead Time: ${o.leadTime}\n\n`
    })
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sourcing-report-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Global step index for the tracker (1-9)
  const globalStep =
    mode === "build"
      ? buildStep + 1
      : mode === "matching" || mode === "select"
        ? 8
        : 9

  const getStatusBadge = (status: SourcingRequest["status"]) => {
    switch (status) {
      case "waiting":
        return (
          <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
            <Clock className="mr-1 h-3 w-3" />
            Waiting
          </Badge>
        )
      case "partial":
        return (
          <Badge variant="outline" className="border-secondary/40 bg-secondary/10 text-secondary">
            <Bell className="mr-1 h-3 w-3" />
            Responses
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Complete
          </Badge>
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="border-b">
          <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/15">
                  <Sparkles className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-sm font-medium text-secondary">AI Sourcing Expert</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setShowMyRequests((v) => !v)}>
                  <FileText className="h-3.5 w-3.5" />
                  My Requests
                </Button>
                <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleStartNew}>
                  <Plus className="h-3.5 w-3.5" />
                  New
                </Button>
              </div>
            </div>
            <div className="mx-auto max-w-xl text-center">
              <h1 className="mb-1 font-serif text-2xl font-medium text-foreground text-balance sm:text-3xl">
                Build a Complete Sourcing Request
              </h1>
              <p className="text-sm text-muted-foreground text-pretty">
                Answer a few guided questions and we&apos;ll turn them into a clear, professional RFQ that manufacturers can quote
                accurately.
              </p>
            </div>
          </div>
        </div>

        {/* My Requests Panel */}
        {showMyRequests && (
          <div className="border-b bg-muted/30">
            <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium">My Requests</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowMyRequests(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {savedRequests.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No requests yet.</p>
              ) : (
                <div className="space-y-2">
                  {savedRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{request.data.product}</span>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {request.suppliersContacted} contacted · {request.responsesReceived} responses
                        </div>
                      </div>
                      <div className="ml-3 flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewRequest(request)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Progress tracker */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex min-w-max items-center gap-1">
              {builderSteps.map((s, i) => {
                const stepNum = i + 1
                const complete = stepNum < globalStep
                const current = stepNum === globalStep
                const Icon = s.icon
                return (
                  <div key={s.label} className="flex items-center">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
                        complete
                          ? "bg-emerald-100 text-emerald-700"
                          : current
                            ? "bg-secondary/15 text-secondary"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {complete ? <CheckCircle className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                      <span className="hidden sm:inline">{s.label}</span>
                      <span className="sm:hidden">{stepNum}</span>
                    </div>
                    {i < builderSteps.length - 1 && (
                      <div className={cn("mx-0.5 h-px w-3 sm:w-4", complete ? "bg-emerald-300" : "bg-border")} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ---------------- BUILD MODE ---------------- */}
          {mode === "build" && (
            <Card>
              <CardContent className="p-6">
                {/* Step 1: Product */}
                {buildStep === 0 && (
                  <div>
                    <StepHeading step={1} total={9} title="What product are you sourcing?" subtitle="Describe it naturally or pick a popular request to get started." />
                    <div className="space-y-2">
                      <Label htmlFor="product">
                        Product <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="product"
                        placeholder="e.g., 2-ply toilet paper rolls"
                        value={data.product}
                        onChange={(e) => update({ product: e.target.value })}
                        className="h-11"
                      />
                      {showRequiredHint && !data.product.trim() && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Please tell us what product you need.
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {productSuggestions.map((s) => (
                        <QuickButton key={s} active={data.product === s} onClick={() => update({ product: s })}>
                          {s}
                        </QuickButton>
                      ))}
                    </div>

                    {/* File upload */}
                    <div className="mt-6">
                      <Label className="text-sm">Reference files, images or specs (optional)</Label>
                      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFiles} />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 py-4 text-sm text-muted-foreground transition-colors hover:border-secondary/50 hover:text-secondary"
                      >
                        <Paperclip className="h-4 w-4" />
                        Upload files
                      </button>
                      {data.files.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {data.files.map((f, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
                              <span className="flex items-center gap-2 truncate">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                {f.name}
                                <Badge variant="secondary" className="text-[10px]">{f.type}</Badge>
                              </span>
                              <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Product Details (AI-tailored, product-specific questions) */}
                {buildStep === 1 && (
                  <div>
                    <StepHeading
                      step={2}
                      total={9}
                      title={`A few details about your ${specQuestions.category === "General" ? "product" : specQuestions.category.toLowerCase()}`}
                      subtitle="These product-specific questions help manufacturers quote accurately the first time. Answer what you know — anything optional can be skipped."
                    />

                    <div className="mb-5 flex items-start gap-2 rounded-lg border border-secondary/30 bg-secondary/5 p-3">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <p className="text-sm text-foreground/80">
                        {specQuestions.category === "General" ? (
                          <>Tell us the key specifications so suppliers can match your exact needs.</>
                        ) : (
                          <>We tailored these questions for <strong>{specQuestions.category}</strong>. Fields marked with <span className="text-destructive">*</span> matter most for an accurate quote.</>
                        )}
                      </p>
                    </div>

                    <div className="space-y-5">
                      {specQuestions.fields.map((f) => {
                        const val = data.productSpecificFields[f.id] || ""
                        const showHint = showRequiredHint && f.important && !val.trim()
                        // A select field is in custom mode when explicitly toggled, or when
                        // it holds a value that isn't one of the predefined options.
                        const isCustom =
                          f.type === "select" && !!f.options &&
                          (customSpecFields[f.id] || (val !== "" && !f.options.includes(val)))
                        return (
                          <div key={f.id} className="space-y-2">
                            <Label className="text-sm">
                              {f.label}
                              {f.important && <span className="ml-0.5 text-destructive">*</span>}
                            </Label>
                            {f.type === "select" && f.options ? (
                              <>
                                <div className="flex flex-wrap gap-2">
                                  {f.options.map((opt) => (
                                    <QuickButton
                                      key={opt}
                                      active={!isCustom && val === opt}
                                      onClick={() => {
                                        setCustomSpecFields((prev) => ({ ...prev, [f.id]: false }))
                                        updateSpec(f.id, val === opt ? "" : opt)
                                      }}
                                    >
                                      {opt}
                                    </QuickButton>
                                  ))}
                                  <QuickButton active={isCustom} onClick={() => setSpecCustomMode(f.id, !isCustom)}>
                                    Other (Custom)
                                  </QuickButton>
                                </div>
                                {isCustom && (
                                  <Input
                                    autoFocus
                                    placeholder={`Please specify ${f.label.toLowerCase()}`}
                                    value={val}
                                    onChange={(e) => updateSpec(f.id, e.target.value)}
                                    className="mt-2 h-11"
                                  />
                                )}
                              </>
                            ) : (
                              <Input
                                placeholder={f.placeholder}
                                value={val}
                                onChange={(e) => updateSpec(f.id, e.target.value)}
                                className="h-11"
                              />
                            )}
                            {showHint && (
                              <p className="flex items-center gap-1 text-xs text-amber-600">
                                <AlertCircle className="h-3.5 w-3.5" />
                                Recommended for an accurate quote — but you can continue without it.
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-6 space-y-2 rounded-lg border border-border bg-muted/20 p-4">
                      <Label htmlFor="productNotes" className="text-sm font-medium">
                        Additional product requirements <span className="font-normal text-muted-foreground">(optional)</span>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Describe anything not covered above — the more detail you share, the more accurate your quotes will be.
                      </p>
                      <Textarea
                        id="productNotes"
                        placeholder="e.g., custom packaging, private label / OEM branding, special materials, custom dimensions, premium quality, reference brand, product-specific notes…"
                        value={data.productNotes}
                        onChange={(e) => update({ productNotes: e.target.value })}
                        rows={4}
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          "Custom packaging",
                          "Private label / OEM",
                          "Special materials",
                          "Custom dimensions",
                          "Premium quality",
                        ].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              update({
                                productNotes: data.productNotes
                                  ? `${data.productNotes.replace(/\s*$/, "")}, ${tag}`
                                  : tag,
                              })
                            }
                            className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-secondary/50 hover:text-foreground"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Quantity & Destination */}
                {buildStep === 2 && (
                  <div>
                    <StepHeading step={3} total={9} title="Quantity & destination" subtitle="This helps manufacturers calculate accurate pricing and shipping." />
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">
                          Quantity needed <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="quantity"
                          placeholder="e.g., 10,000 units"
                          value={data.quantity}
                          onChange={(e) => update({ quantity: e.target.value })}
                          className="h-11"
                        />
                        <div className="flex flex-wrap gap-2">
                          {quantityOptions.map((q) => (
                            <QuickButton key={q} active={data.quantity === q} onClick={() => update({ quantity: q })}>
                              {q}
                            </QuickButton>
                          ))}
                        </div>
                        {showRequiredHint && !data.quantity.trim() && (
                          <p className="flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle className="h-3.5 w-3.5" /> Quantity is required.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">
                          Destination country <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="country"
                          placeholder="Where should the goods be delivered?"
                          value={data.country}
                          onChange={(e) => update({ country: e.target.value })}
                          className="h-11"
                        />
                        <div className="flex flex-wrap gap-2">
                          {popularCountries.map((c) => (
                            <QuickButton key={c} active={data.country === c} onClick={() => update({ country: c })}>
                              {c}
                            </QuickButton>
                          ))}
                        </div>
                        {showRequiredHint && !data.country.trim() && (
                          <p className="flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle className="h-3.5 w-3.5" /> Destination country is required.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Target price (optional)</Label>
                        <Input
                          id="price"
                          placeholder="e.g., $0.80 - $1.20 per unit"
                          value={data.targetPrice === "Not sure" ? "" : data.targetPrice}
                          onChange={(e) => update({ targetPrice: e.target.value })}
                          className="h-11"
                        />
                        <QuickButton active={data.targetPrice === "Not sure"} onClick={() => update({ targetPrice: data.targetPrice === "Not sure" ? "" : "Not sure" })}>
                          <HelpCircle className="h-3.5 w-3.5" />
                          Not sure
                        </QuickButton>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Packaging & Private Label */}
                {buildStep === 3 && (
                  <div>
                    <StepHeading step={4} total={9} title="Packaging & branding" subtitle="Let manufacturers know how you want the product packaged and branded." />
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label>Packaging preference</Label>
                        <div className="flex flex-wrap gap-2">
                          {packagingOptions.map((p) => (
                            <QuickButton key={p} active={data.packaging === p} onClick={() => update({ packaging: p })}>
                              {p}
                            </QuickButton>
                          ))}
                          <QuickButton active={data.packaging === "Not sure"} onClick={() => update({ packaging: "Not sure" })}>
                            <HelpCircle className="h-3.5 w-3.5" />
                            Not sure
                          </QuickButton>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Private label / custom branding?</Label>
                        <div className="flex flex-wrap gap-2">
                          <QuickButton active={data.privateLabel === "yes"} onClick={() => update({ privateLabel: "yes" })}>
                            Yes, custom branding
                          </QuickButton>
                          <QuickButton active={data.privateLabel === "no"} onClick={() => update({ privateLabel: "no" })}>
                            No, standard product
                          </QuickButton>
                          <QuickButton active={data.privateLabel === "unsure"} onClick={() => update({ privateLabel: "unsure" })}>
                            <HelpCircle className="h-3.5 w-3.5" />
                            Not sure
                          </QuickButton>
                        </div>
                      </div>

                      {data.privateLabel === "yes" && (
                        <div className="space-y-2">
                          <Label htmlFor="branding">Branding details (optional)</Label>
                          <Textarea
                            id="branding"
                            placeholder="e.g., Logo on the box, custom colors, our brand name printed on each unit"
                            value={data.brandingNotes}
                            onChange={(e) => update({ brandingNotes: e.target.value })}
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Certifications & Requirements */}
                {buildStep === 4 && (
                  <div>
                    <StepHeading step={5} total={9} title="Certifications & requirements" subtitle="Select any required certifications. We've suggested ones common for your product." />
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label>Required certifications</Label>
                        {specQuestions.suggestedCerts.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Suggested for {data.product || "this product"}: {specQuestions.suggestedCerts.join(", ")}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set([...specQuestions.suggestedCerts, ...certOptions])).map((c) => (
                            <QuickButton key={c} active={data.certifications.includes(c)} onClick={() => toggleCert(c)}>
                              {c}
                            </QuickButton>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reqs">Additional requirements (optional)</Label>
                        <Textarea
                          id="reqs"
                          placeholder="Any quality standards, testing, compliance or other requirements manufacturers should know about."
                          value={data.requirements}
                          onChange={(e) => update({ requirements: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Shipping & Timeline */}
                {buildStep === 5 && (
                  <div>
                    <StepHeading step={6} total={9} title="Shipping terms & timeline" subtitle="Not sure about Incoterms? Choose 'Not sure' and manufacturers will advise." />
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label>Preferred shipping terms (Incoterms)</Label>
                        <div className="flex flex-wrap gap-2">
                          {incotermsOptions.map((t) => (
                            <QuickButton key={t} active={data.incoterms === t} onClick={() => update({ incoterms: t })}>
                              {t}
                            </QuickButton>
                          ))}
                          <QuickButton active={data.incoterms === "Not sure"} onClick={() => update({ incoterms: "Not sure" })}>
                            <HelpCircle className="h-3.5 w-3.5" />
                            Not sure
                          </QuickButton>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>When do you need the goods?</Label>
                        <div className="flex flex-wrap gap-2">
                          {timelineOptions.map((t) => (
                            <QuickButton key={t} active={data.timeline === t} onClick={() => update({ timeline: t })}>
                              {t}
                            </QuickButton>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional notes (optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Anything else manufacturers should know to give you an accurate offer."
                          value={data.notes}
                          onChange={(e) => update({ notes: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Review */}
                {buildStep === 6 && (
                  <div>
                    <StepHeading step={7} total={9} title="Review your request" subtitle="This is exactly what manufacturers will receive. Edit anything before sending." />

                    {requiredMissing().length > 0 ? (
                      <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <p className="text-sm text-destructive">
                          Required information is missing: <strong>{requiredMissing().join(", ")}</strong>. Please complete it before
                          sending.
                        </p>
                      </div>
                    ) : recommendedMissing().length > 0 ? (
                      <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <p className="text-sm text-amber-800">
                          Some important details are missing: <strong>{recommendedMissing().join(", ")}</strong>. Adding them can help
                          manufacturers send more accurate offers — but you can still continue.
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-3">
                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                        <p className="text-sm text-emerald-800">Your request looks complete and ready to send.</p>
                      </div>
                    )}

                    <div className="grid gap-2 sm:grid-cols-2">
                      <ReviewRow icon={Package} label="Product" value={data.product} required missing={!data.product.trim()} />
                      <ReviewRow icon={Boxes} label="Quantity" value={data.quantity} required missing={!data.quantity.trim()} />
                      <ReviewRow icon={Globe} label="Destination country" value={data.country} required missing={!data.country.trim()} />
                      <ReviewRow icon={CreditCard} label="Target price" value={data.targetPrice} missing={!data.targetPrice.trim()} />
                      <ReviewRow icon={Boxes} label="Packaging" value={data.packaging} missing={!data.packaging.trim()} />
                      <ReviewRow
                        icon={Tag}
                        label="Private label"
                        value={data.privateLabel === "yes" ? "Yes, custom branding" : data.privateLabel === "no" ? "No, standard product" : data.privateLabel === "unsure" ? "Not sure" : ""}
                        missing={!data.privateLabel}
                      />
                      <ReviewRow icon={Shield} label="Certifications" value={data.certifications.join(", ")} missing={data.certifications.length === 0} />
                      <ReviewRow icon={Truck} label="Shipping terms" value={data.incoterms} missing={!data.incoterms.trim()} />
                      <ReviewRow icon={Calendar} label="Delivery timeline" value={data.timeline} missing={!data.timeline.trim()} />
                      <ReviewRow icon={Paperclip} label="Uploaded files" value={data.files.length > 0 ? `${data.files.length} file(s)` : ""} missing={data.files.length === 0} />
                    </div>

                    {Object.keys(data.productSpecificFields).some((k) => data.productSpecificFields[k]) && (
                      <div className="mt-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">Product specifications</p>
                        <div className="flex flex-wrap gap-2">
                          {specQuestions.fields
                            .filter((f) => data.productSpecificFields[f.id])
                            .map((f) => (
                              <Badge key={f.id} variant="secondary" className="font-normal">
                                {f.label}: {data.productSpecificFields[f.id]}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}

                    {(data.requirements || data.notes || data.brandingNotes || data.productNotes) && (
                      <div className="mt-2 space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3 text-sm">
                        {data.productNotes && (
                          <p><span className="font-medium text-foreground">Product notes: </span><span className="text-muted-foreground">{data.productNotes}</span></p>
                        )}
                        {data.brandingNotes && (
                          <p><span className="font-medium text-foreground">Branding: </span><span className="text-muted-foreground">{data.brandingNotes}</span></p>
                        )}
                        {data.requirements && (
                          <p><span className="font-medium text-foreground">Requirements: </span><span className="text-muted-foreground">{data.requirements}</span></p>
                        )}
                        {data.notes && (
                          <p><span className="font-medium text-foreground">Notes: </span><span className="text-muted-foreground">{data.notes}</span></p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Build navigation */}
                <div className="mt-8 flex items-center justify-between border-t pt-6">
                  <Button variant="outline" onClick={goBack} disabled={buildStep === 0} className="gap-2 bg-transparent">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  {buildStep < 6 ? (
                    <Button onClick={goNext} className="gap-2">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setBuildStep(0)} className="gap-2 bg-transparent">
                        <Edit3 className="h-4 w-4" />
                        Edit Request
                      </Button>
                      <Button onClick={handleConfirm} className="gap-2">
                        <Search className="h-4 w-4" />
                        Confirm & Find Manufacturers
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ---------------- MATCHING MODE ---------------- */}
          {mode === "matching" && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground">Matching manufacturers</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{matchingStatus}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ---------------- SELECT MODE ---------------- */}
          {mode === "select" && (
            <Card>
              <CardContent className="p-6">
                <StepHeading
                  step={8}
                  total={9}
                  title={`${supplierMatches.length} manufacturers matched`}
                  subtitle="Ranked by relevance to your request. Select the ones you'd like to send your RFQ to."
                />
                <div className="space-y-2">
                  {supplierMatches.map((match) => (
                    <button
                      key={match.supplier.id}
                      type="button"
                      onClick={() =>
                        setSupplierMatches((prev) =>
                          prev.map((m) => (m.supplier.id === match.supplier.id ? { ...m, selected: !m.selected } : m)),
                        )
                      }
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                        match.selected ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/40",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                          match.selected ? "border-secondary bg-secondary text-secondary-foreground" : "border-border",
                        )}
                      >
                        {match.selected && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                        {match.supplier.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{match.supplier.name}</span>
                          {match.supplier.reviewed && (
                            <Badge variant="secondary" className="text-[10px]">Verified</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {locationLabel(match.supplier)}
                          <Star className="h-3 w-3 text-amber-500" />
                          {match.supplier.rating}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "text-sm font-bold",
                            match.matchScore >= 80 ? "text-emerald-600" : match.matchScore >= 60 ? "text-amber-600" : "text-muted-foreground",
                          )}
                        >
                          {match.matchScore}%
                        </div>
                        <div className="text-[10px] text-muted-foreground">match</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t pt-6">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setMode("build")} className="gap-1.5">
                      <ArrowLeft className="h-4 w-4" />
                      Edit request
                    </Button>
                    <span className="text-sm text-muted-foreground">{selectedCount} selected</span>
                  </div>
                  <Button onClick={handleSendRFQ} disabled={selectedCount === 0} className="gap-2">
                    <Send className="h-4 w-4" />
                    Send RFQ to {selectedCount} {selectedCount === 1 ? "manufacturer" : "manufacturers"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ---------------- SENDING MODE ---------------- */}
          {mode === "sending" && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-secondary" />
                <div>
                  <h2 className="font-serif text-lg font-medium text-foreground">Working on it…</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Please wait a moment.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ---------------- WAITING MODE ---------------- */}
          {mode === "waiting" && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-8 w-8 animate-pulse text-amber-600" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground">RFQ sent successfully</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground text-pretty">
                    Your complete request was sent to {supplierMatches.filter((m) => m.selected).length} manufacturers. You can expect
                    structured offers within 24–48 hours.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="outline" onClick={handleStartNew} className="gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    New Request
                  </Button>
                  <Button onClick={handleSimulateOffers} className="gap-2">
                    <Zap className="h-4 w-4" />
                    Simulate Responses
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ---------------- RESULTS MODE ---------------- */}
          {mode === "results" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground">Manufacturer Offers</h2>
                  <p className="text-sm text-muted-foreground">
                    {supplierOffers.length} offers received for {data.product}
                  </p>
                </div>
                <Button variant="outline" onClick={handleExport} className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {supplierOffers.map((offer, index) => (
                  <Card key={offer.supplier.id} className={cn("overflow-hidden", index === 0 && "ring-2 ring-emerald-500/40")}>
                    {index === 0 && (
                      <div className="bg-emerald-500 px-3 py-1 text-center text-xs font-medium text-white">Best Match</div>
                    )}
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold">
                          {offer.supplier.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{offer.supplier.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {locationLabel(offer.supplier)}
                            <Star className="h-3 w-3 text-amber-500" />
                            {offer.rating}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Price</span>
                          <p className="font-semibold text-emerald-600">{offer.price}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">MOQ</span>
                          <p className="font-medium">{offer.moq}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Lead time</span>
                          <p className="font-medium">{offer.leadTime}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Shipping</span>
                          <p className="font-medium">{offer.shippingTerms}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" className="flex-1">Contact</Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
