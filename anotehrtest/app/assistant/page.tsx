"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  Send,
  Sparkles,
  Factory,
  Package,
  Globe,
  FileText,
  Loader2,
  Plus,
  MessageSquare,
  Trash2,
  ChevronRight,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Search,
  MapPin,
  CheckCircle,
  ArrowRight,
  Download,
  Star,
  Clock,
  DollarSign,
  Boxes,
  Shield,
  Building2,
  X,
  Paperclip,
  Image as ImageIcon,
  File,
  Calculator,
  TrendingUp,
  ShieldCheck,
  PanelLeft,
  Briefcase,
  Truck,
  Tag,
  GitCompare,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { cn } from "@/lib/utils"
import { suppliers as allSuppliers, Supplier } from "@/lib/data/suppliers"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LandedCostEstimator } from "@/components/assistant/landed-cost-estimator"

interface Attachment {
  id: string
  name: string
  type: "image" | "document"
  preview?: string
  size: string
}

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  component?: "sourcing-summary" | "supplier-matches" | "offers-table" | "confirmation" | "questions"
  data?: SourcingData | SupplierMatch[] | SupplierOffer[]
  attachments?: Attachment[]
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  sourcingFlow?: SourcingFlow
}

// Sourcing Flow Types
interface SourcingData {
  product?: string
  country?: string
  quantity?: string
  moq?: string
  packaging?: string
  privateLabel?: boolean
  certifications?: string[]
  additionalNotes?: string
}

interface SourcingFlow {
  active: boolean
  step: "detect" | "questions" | "confirm" | "matching" | "rfq-sent" | "collecting" | "results"
  data: SourcingData
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
  notes: string
  rating: number
}

// Suggested prompts for new users - realistic sourcing questions
const suggestedPrompts = [
  {
    icon: Globe,
    title: "Import regulations",
    prompt: "What certifications are required to import electronics to the USA?",
  },
  {
    icon: Search,
    title: "Start sourcing",
    prompt: "I want to find suppliers",
    action: "redirect" as const,
    redirectTo: "/find-suppliers",
  },
  {
    icon: Package,
    title: "MOQ guidance",
    prompt: "What is a reasonable MOQ for private label products?",
  },
  {
    icon: FileText,
    title: "Shipping methods",
    prompt: "What are the best shipping methods for large orders?",
  },
]

// Everything the assistant can help with — used in the empty-state capabilities grid
const aiCapabilities = [
  { icon: Factory, label: "Find Manufacturers", type: "redirect" as const, to: "/find-suppliers" },
  { icon: Briefcase, label: "Find Service Providers", type: "redirect" as const, to: "/service-providers" },
  { icon: Calculator, label: "Estimate Landed Cost", type: "estimator" as const },
  {
    icon: Globe,
    label: "Import Regulations",
    type: "prompt" as const,
    prompt: "What import regulations and certifications should I be aware of?",
  },
  {
    icon: Package,
    label: "MOQ Guidance",
    type: "prompt" as const,
    prompt: "What is a reasonable MOQ for private label products?",
  },
  {
    icon: Truck,
    label: "Shipping & Logistics",
    type: "prompt" as const,
    prompt: "Which shipping method should I choose for my order?",
  },
  {
    icon: GitCompare,
    label: "Supplier Comparison",
    type: "prompt" as const,
    prompt: "How do I compare supplier quotations effectively?",
  },
  {
    icon: Tag,
    label: "Private Label Guidance",
    type: "prompt" as const,
    prompt: "How do I get started with private label products?",
  },
]

// Popular questions shown in the empty state
const popularQuestions = [
  "How do I find a manufacturer for my product?",
  "What certifications do I need for importing food?",
  "How do I calculate landed cost?",
  "What is a reasonable MOQ?",
  "How do I compare supplier quotations?",
  "Which shipping method should I choose?",
]

// Parse user message to extract product and country
const parseSourceRequest = (message: string): { product?: string; country?: string } => {
  const lowerMessage = message.toLowerCase()
  
  // Common product patterns
  const productPatterns = [
    /(?:need|looking for|find|source|want|searching for)\s+(?:a\s+)?(.+?)\s+(?:supplier|manufacturer|vendor|factory)/i,
    /(?:supplier|manufacturer|vendor|factory)\s+(?:for|of)\s+(.+?)(?:\s+in|\s+from|$)/i,
    /(.+?)\s+(?:supplier|manufacturer|vendor|factory)/i,
  ]
  
  // Words that don't represent a real product and should be ignored if extracted.
  const productStopWords = new Set([
    "a", "an", "the", "my", "your", "our", "their", "his", "her", "its",
    "product", "products", "good", "goods", "item", "items", "thing", "things",
    "something", "anything", "stuff", "some", "any", "new", "best", "right", "good",
  ])

  // Leading filler/question words to strip from the front of a captured phrase.
  const leadingFiller = /^(?:how|do|does|can|could|would|should|i|we|you|to|please|help|me|find|get|a|an|the|my|your|our|some|any)\s+/i

  let product: string | undefined
  for (const pattern of productPatterns) {
    const match = message.match(pattern)
    if (match && match[1]) {
      let cleaned = match[1].trim().replace(/[.?!,;:]+$/, "").trim()
      // Repeatedly strip leading filler words (e.g. "how do I find a ...").
      let previous: string
      do {
        previous = cleaned
        cleaned = cleaned.replace(leadingFiller, "").trim()
      } while (cleaned !== previous)

      const words = cleaned.split(/\s+/).filter(Boolean)
      // Reject empty captures, generic filler, or whole-sentence fragments.
      const meaningful =
        words.length > 0 &&
        words.length <= 4 &&
        !words.every((w) => productStopWords.has(w.toLowerCase().replace(/[.?!,;:]+$/, "")))
      if (meaningful) {
        product = cleaned
        break
      }
    }
  }
  
  // Country patterns
  const countries = [
    "israel", "china", "india", "vietnam", "bangladesh", "turkey", "germany", 
    "usa", "united states", "uk", "united kingdom", "japan", "korea", "south korea",
    "thailand", "indonesia", "malaysia", "philippines", "pakistan", "egypt",
    "brazil", "mexico", "poland", "italy", "spain", "france", "netherlands"
  ]
  
  let country: string | undefined
  for (const c of countries) {
    if (lowerMessage.includes(c)) {
      country = c.charAt(0).toUpperCase() + c.slice(1)
      if (c === "usa") country = "USA"
      if (c === "united states") country = "United States"
      if (c === "uk") country = "UK"
      if (c === "united kingdom") country = "United Kingdom"
      if (c === "south korea") country = "South Korea"
      break
    }
  }
  
  return { product, country }
}

// Check if message is a sourcing request
const isSourcingRequest = (message: string): boolean => {
  const lowerMessage = message.toLowerCase()
  const sourcingKeywords = [
    "find supplier", "need supplier", "looking for supplier",
    "find manufacturer", "need manufacturer", "looking for manufacturer",
    "source", "sourcing", "find vendor", "supplier for", "manufacturer for",
    "find factory", "need factory"
  ]
  return sourcingKeywords.some(keyword => lowerMessage.includes(keyword))
}

// Match suppliers based on sourcing data
const matchSuppliers = (data: SourcingData): SupplierMatch[] => {
  const matches: SupplierMatch[] = []
  
  for (const supplier of allSuppliers) {
    let score = 50 // Base score
    
    // Product match
    if (data.product) {
      const productLower = data.product.toLowerCase()
      if (supplier.mainProducts.some(p => p.toLowerCase().includes(productLower))) {
        score += 30
      }
      if (supplier.categories.some(c => c.toLowerCase().includes(productLower))) {
        score += 20
      }
      if (supplier.description.toLowerCase().includes(productLower)) {
        score += 10
      }
    }
    
    // Certification match
    if (data.certifications && data.certifications.length > 0) {
      const certMatch = data.certifications.filter(cert => 
        supplier.certifications.some(sc => sc.toLowerCase().includes(cert.toLowerCase()))
      ).length
      score += certMatch * 10
    }
    
    // Private label capability
    if (data.privateLabel && supplier.capabilities?.includes("private-label")) {
      score += 15
    }
    
    // Rating boost
    score += supplier.rating * 2
    
    matches.push({
      supplier,
      matchScore: Math.min(score, 100),
      selected: true
    })
  }
  
  // Sort by match score and take top 6
  return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6)
}

// Generate simulated offers from suppliers
const generateOffers = (suppliers: SupplierMatch[], data: SourcingData): SupplierOffer[] => {
  return suppliers.filter(m => m.selected).map(match => {
    const basePrice = 0.5 + Math.random() * 2
    return {
      supplier: match.supplier,
      price: `$${(basePrice * 1000).toFixed(0)} - $${(basePrice * 1000 * 1.2).toFixed(0)}`,
      pricePerUnit: parseFloat(basePrice.toFixed(2)),
      moq: `${[500, 1000, 2000, 5000][Math.floor(Math.random() * 4)]} units`,
      leadTime: `${[14, 21, 30, 45][Math.floor(Math.random() * 4)]} days`,
      packaging: ["Standard carton", "Custom packaging available", "Bulk packaging", "Retail-ready packaging"][Math.floor(Math.random() * 4)],
      notes: data.privateLabel ? "Private label services available" : "Ready to discuss requirements",
      rating: match.supplier.rating
    }
  })
}

// Standard AI responses
const getAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes("rfq") || lowerMessage.includes("quote") || lowerMessage.includes("request")) {
    return `I'll help you create an effective RFQ (Request for Quotation). Here's a template:

**RFQ Structure:**

1. **Company Introduction** (Brief overview of your business)

2. **Product Requirements**
   - Detailed specifications
   - Materials and quality standards
   - Packaging requirements

3. **Quantity & Timeline**
   - Initial order quantity
   - Estimated annual volume
   - Delivery schedule

4. **Commercial Terms**
   - Target price (if any)
   - Payment terms preference
   - Incoterms (FOB, CIF, etc.)

**Pro Tips:**
- Be specific about your requirements
- Include photos or technical drawings
- Mention your timeline clearly
- Ask about MOQ flexibility

Would you like to start filling out an RFQ now?`
  }
  
  if (lowerMessage.includes("import") || lowerMessage.includes("regulation") || lowerMessage.includes("customs")) {
    return `Here's an overview of import considerations:

**Key Import Factors:**

1. **HS Codes**
   - Determine the correct Harmonized System code
   - This affects duty rates and regulations

2. **Documentation Required**
   - Commercial invoice
   - Packing list
   - Bill of lading/Airway bill
   - Certificate of origin
   - Product-specific certificates

3. **Duties & Taxes**
   - Import duty (varies by product and origin)
   - VAT/GST in destination country
   - Anti-dumping duties (if applicable)

**Recommendation:**
I suggest working with a licensed customs broker for your first imports.

What specific products are you looking to import, and to which country?`
  }
  
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("negotiate")) {
    return `Here are some pricing and negotiation strategies:

**Understanding Supplier Pricing:**

1. **Cost Components**
   - Raw materials (40-60%)
   - Labor costs
   - Overhead and profit margin
   - Packaging and shipping

2. **Negotiation Leverage**
   - Order volume commitments
   - Long-term partnership potential
   - Payment terms flexibility
   - Sample order first

**Effective Negotiation Tips:**

- **Research market prices** before negotiating
- **Start with realistic targets** (5-15% reduction is typical)
- **Focus on total value**, not just unit price
- **Consider payment terms** (longer terms = higher price)

Would you like specific advice for a particular product category?`
  }
  
  // Default response
  return `Thank you for your question. I'm here to help with your sourcing needs.

**I can assist you with:**

- **Finding Suppliers** - Search our database of reviewed manufacturers
- **RFQ Creation** - Write professional requests for quotation
- **Import/Export** - Understand regulations and compliance
- **Quality Control** - Set up inspection and QC processes
- **Pricing & Negotiation** - Strategies for better deals
- **Shipping & Logistics** - Compare freight options

What specific topic would you like to explore?`
}

// Sourcing Questions Component
function SourcingQuestions({ 
  data, 
  onSubmit 
}: { 
  data: SourcingData
  onSubmit: (answers: Partial<SourcingData>) => void 
}) {
  const [quantity, setQuantity] = useState(data.quantity || "")
  const [moq, setMoq] = useState(data.moq || "")
  const [packaging, setPackaging] = useState(data.packaging || "")
  const [privateLabel, setPrivateLabel] = useState(data.privateLabel || false)
  const [certifications, setCertifications] = useState<string[]>(data.certifications || [])
  const [notes, setNotes] = useState(data.additionalNotes || "")

  const certOptions = ["ISO 9001", "CE", "FDA", "GOTS", "OEKO-TEX", "FSC", "Halal", "Kosher"]

  const handleSubmit = () => {
    onSubmit({
      quantity,
      moq,
      packaging,
      privateLabel,
      certifications,
      additionalNotes: notes
    })
  }

  return (
    <Card className="mt-4 border-secondary/30 bg-secondary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-secondary" />
          Tell me more about your requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity needed</Label>
            <Input 
              id="quantity"
              placeholder="e.g., 10,000 units"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="moq">Preferred MOQ</Label>
            <Input 
              id="moq"
              placeholder="e.g., 1,000 units minimum"
              value={moq}
              onChange={(e) => setMoq(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="packaging">Packaging requirements</Label>
          <Input 
            id="packaging"
            placeholder="e.g., Individual boxes, bulk packaging"
            value={packaging}
            onChange={(e) => setPackaging(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="private-label" 
            checked={privateLabel}
            onCheckedChange={(checked) => setPrivateLabel(checked === true)}
          />
          <Label htmlFor="private-label" className="text-sm">
            I need private label / custom branding
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Certifications needed (select all that apply)</Label>
          <div className="flex flex-wrap gap-2">
            {certOptions.map((cert) => (
              <Badge
                key={cert}
                variant={certifications.includes(cert) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  if (certifications.includes(cert)) {
                    setCertifications(certifications.filter(c => c !== cert))
                  } else {
                    setCertifications([...certifications, cert])
                  }
                }}
              >
                {cert}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional notes (optional)</Label>
          <Input 
            id="notes"
            placeholder="Any other requirements..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full gap-2">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

// Sourcing Summary Component
function SourcingSummary({ 
  data, 
  onConfirm, 
  onEdit 
}: { 
  data: SourcingData
  onConfirm: () => void
  onEdit: () => void 
}) {
  return (
    <Card className="mt-4 border-secondary/30 bg-secondary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircle className="h-4 w-4 text-secondary" />
          Confirm your sourcing request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground">Product:</span>
              <span className="ml-2 font-medium">{data.product}</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground">Location:</span>
              <span className="ml-2 font-medium">{data.country || "Worldwide"}</span>
            </div>
          </div>
          {data.quantity && (
            <div className="flex items-start gap-3">
              <Boxes className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground">Quantity:</span>
                <span className="ml-2 font-medium">{data.quantity}</span>
              </div>
            </div>
          )}
          {data.moq && (
            <div className="flex items-start gap-3">
              <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground">Preferred MOQ:</span>
                <span className="ml-2 font-medium">{data.moq}</span>
              </div>
            </div>
          )}
          {data.packaging && (
            <div className="flex items-start gap-3">
              <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground">Packaging:</span>
                <span className="ml-2 font-medium">{data.packaging}</span>
              </div>
            </div>
          )}
          {data.privateLabel && (
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <span className="ml-2 font-medium">Private label required</span>
              </div>
            </div>
          )}
          {data.certifications && data.certifications.length > 0 && (
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground">Certifications:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {data.certifications.map(cert => (
                    <Badge key={cert} variant="secondary" className="text-xs">{cert}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={onConfirm} className="flex-1 gap-2">
            <Check className="h-4 w-4" />
            Confirm & Find Suppliers
          </Button>
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Supplier Matches Component
function SupplierMatches({ 
  matches, 
  onSelectChange,
  onSendRFQ 
}: { 
  matches: SupplierMatch[]
  onSelectChange: (supplierId: string, selected: boolean) => void
  onSendRFQ: () => void
}) {
  const selectedCount = matches.filter(m => m.selected).length

  return (
    <Card className="mt-4 border-secondary/30 bg-secondary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Factory className="h-4 w-4 text-secondary" />
            Matching Suppliers ({matches.length})
          </div>
          <Badge variant="secondary">{selectedCount} selected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {matches.map((match) => (
            <div 
              key={match.supplier.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                match.selected ? "border-secondary/50 bg-secondary/5" : "border-border"
              )}
            >
              <Checkbox 
                checked={match.selected}
                onCheckedChange={(checked) => onSelectChange(match.supplier.id, checked === true)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{match.supplier.name}</span>
                  {match.supplier.reviewed && (
                                <Badge variant="outline" className="text-xs flex-shrink-0">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Reviewed
                                </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {match.supplier.shortDescription}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {match.supplier.location.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {match.supplier.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {match.supplier.responseTime}
                  </span>
                </div>
              </div>
              <Badge className="flex-shrink-0">{match.matchScore}% match</Badge>
            </div>
          ))}
        </div>
        <Button 
          onClick={onSendRFQ} 
          className="w-full mt-4 gap-2"
          disabled={selectedCount === 0}
        >
          <Send className="h-4 w-4" />
          Send RFQ to {selectedCount} Supplier{selectedCount !== 1 ? 's' : ''}
        </Button>
      </CardContent>
    </Card>
  )
}

// Offers Comparison Table Component
function OffersTable({ 
  offers,
  onExportPDF
}: { 
  offers: SupplierOffer[]
  onExportPDF: () => void
}) {
  const sortedOffers = [...offers].sort((a, b) => a.pricePerUnit - b.pricePerUnit)
  const lowestPrice = sortedOffers[0]?.pricePerUnit

  return (
    <Card className="mt-4 border-green-500/30 bg-green-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Offers Received ({offers.length})
          </div>
          <Button variant="outline" size="sm" onClick={onExportPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium">Supplier</th>
                <th className="text-left py-2 px-3 font-medium">Price</th>
                <th className="text-left py-2 px-3 font-medium">MOQ</th>
                <th className="text-left py-2 px-3 font-medium">Lead Time</th>
                <th className="text-left py-2 px-3 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedOffers.map((offer, index) => (
                <tr key={offer.supplier.id} className="border-b last:border-0">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{offer.supplier.name}</span>
                      {offer.pricePerUnit === lowestPrice && (
                        <Badge variant="default" className="bg-green-500 text-xs">Best Price</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {offer.supplier.location.country}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium">{offer.price}</span>
                  </td>
                  <td className="py-3 px-3">{offer.moq}</td>
                  <td className="py-3 px-3">{offer.leadTime}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {offer.rating}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">
            <strong>Recommendation:</strong> Based on price, rating, and lead time, we suggest 
            <span className="font-medium text-foreground"> {sortedOffers[0]?.supplier.name}</span> as your best option.
            They offer competitive pricing with excellent reliability.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AIAssistantPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
  ])
  const [activeSessionId, setActiveSessionId] = useState("1")
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEstimator, setShowEstimator] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [supplierMatches, setSupplierMatches] = useState<SupplierMatch[]>([])
  const [supplierOffers, setSupplierOffers] = useState<SupplierOffer[]>([])
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Collapse the sidebar by default on small screens
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setShowSidebar(false)
    }
  }, [])
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map(file => ({
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: "document",
        size: `${(file.size / 1024).toFixed(1)} KB`
      }))
      setPendingAttachments(prev => [...prev, ...newAttachments])
    }
    // Reset input
    if (e.target) e.target.value = ""
  }
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const newAttachment: Attachment = {
            id: `img-${Date.now()}-${Math.random()}`,
            name: file.name,
            type: "image",
            preview: reader.result as string,
            size: `${(file.size / 1024).toFixed(1)} KB`
          }
          setPendingAttachments(prev => [...prev, newAttachment])
        }
        reader.readAsDataURL(file)
      })
    }
    // Reset input
    if (e.target) e.target.value = ""
  }
  
  // Remove pending attachment
  const removeAttachment = (id: string) => {
    setPendingAttachments(prev => prev.filter(a => a.id !== id))
  }

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0]
  const sourcingFlow = activeSession.sourcingFlow

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeSession.messages, supplierMatches, supplierOffers])

  // Update sourcing flow for active session
  const updateSourcingFlow = (flow: Partial<SourcingFlow>) => {
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          sourcingFlow: session.sourcingFlow 
            ? { ...session.sourcingFlow, ...flow }
            : { active: true, step: "detect", data: {}, ...flow } as SourcingFlow
        }
      }
      return session
    }))
  }

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    }
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [...session.messages, newMessage]
        }
      }
      return session
    }))
  }

  const handleSendMessage = async (content: string) => {
    if ((!content.trim() && pendingAttachments.length === 0) || isTyping) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: content.trim() || (pendingAttachments.length > 0 ? "Attached files" : ""),
      timestamp: new Date(),
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
    }

    // Update session with user message
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        const newTitle = session.messages.length === 0 
          ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
          : session.title
        return {
          ...session,
          title: newTitle,
          messages: [...session.messages, userMessage],
        }
      }
      return session
    }))

    setInputValue("")
    setPendingAttachments([])
    setIsTyping(true)

    // Check if this is a sourcing request
    if (isSourcingRequest(content) && !sourcingFlow?.active) {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const parsed = parseSourceRequest(content)
      
      // Initialize sourcing flow
      updateSourcingFlow({
        active: true,
        step: "questions",
        data: {
          product: parsed.product,
          country: parsed.country
        }
      })

      const responseContent = parsed.product && parsed.country
        ? `I understand you're looking for **${parsed.product}** suppliers in **${parsed.country}**. Let me help you find the best matches.`
        : parsed.product
        ? `I found that you need **${parsed.product}** suppliers. Let me gather some details to find the best matches for you.`
        : `I'll help you find suppliers. Let me gather some details about your requirements.`

      addMessage({
        role: "assistant",
        content: responseContent,
        component: "questions",
        data: { product: parsed.product, country: parsed.country }
      })

      setIsTyping(false)
      return
    }

    // Standard chat response
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    const aiResponse = getAIResponse(content)

    addMessage({
      role: "assistant",
      content: aiResponse
    })

    setIsTyping(false)
  }

  // Handle questions submission
  const handleQuestionsSubmit = async (answers: Partial<SourcingData>) => {
    const currentData = sourcingFlow?.data || {}
    const updatedData = { ...currentData, ...answers }
    
    updateSourcingFlow({
      step: "confirm",
      data: updatedData
    })

    addMessage({
      role: "assistant",
      content: "Great! Please review your sourcing request:",
      component: "confirmation",
      data: updatedData
    })
  }

  // Handle confirmation
  const handleConfirm = async () => {
    setIsTyping(true)
    updateSourcingFlow({ step: "matching" })

    addMessage({
      role: "assistant",
      content: "Searching for matching suppliers..."
    })

    await new Promise(resolve => setTimeout(resolve, 1500))

    const matches = matchSuppliers(sourcingFlow?.data || {})
    setSupplierMatches(matches)

    updateSourcingFlow({ step: "matching" })

    addMessage({
      role: "assistant",
      content: `Found ${matches.length} suppliers that match your requirements. Select the ones you'd like to contact:`,
      component: "supplier-matches",
      data: matches
    })

    setIsTyping(false)
  }

  // Handle supplier selection change
  const handleSupplierSelectChange = (supplierId: string, selected: boolean) => {
    setSupplierMatches(prev => prev.map(m => 
      m.supplier.id === supplierId ? { ...m, selected } : m
    ))
  }

  // Handle sending RFQ
  const handleSendRFQ = async () => {
    setIsTyping(true)
    updateSourcingFlow({ step: "rfq-sent" })

    const selectedCount = supplierMatches.filter(m => m.selected).length
    
    addMessage({
      role: "assistant",
      content: `Sending your RFQ to ${selectedCount} supplier${selectedCount !== 1 ? 's' : ''}...`
    })

    await new Promise(resolve => setTimeout(resolve, 1000))

    addMessage({
      role: "assistant",
      content: "RFQ sent successfully! Collecting offers from suppliers..."
    })

    updateSourcingFlow({ step: "collecting" })

    // Simulate collecting offers
    await new Promise(resolve => setTimeout(resolve, 2000))

    const offers = generateOffers(supplierMatches, sourcingFlow?.data || {})
    setSupplierOffers(offers)

    updateSourcingFlow({ step: "results" })

    addMessage({
      role: "assistant",
      content: `Excellent news! We received ${offers.length} offers. Here's a comparison:`,
      component: "offers-table",
      data: offers
    })

    setIsTyping(false)
  }

  // Handle PDF export
  const handleExportPDF = () => {
    // Create PDF content
    const data = sourcingFlow?.data
    let content = `SOURCING REPORT\n${"=".repeat(50)}\n\n`
    content += `Product: ${data?.product || "N/A"}\n`
    content += `Location: ${data?.country || "Worldwide"}\n`
    content += `Quantity: ${data?.quantity || "N/A"}\n`
    content += `Generated: ${new Date().toLocaleDateString()}\n\n`
    content += `SUPPLIER OFFERS\n${"-".repeat(50)}\n\n`
    
    supplierOffers.forEach((offer, i) => {
      content += `${i + 1}. ${offer.supplier.name}\n`
      content += `   Price: ${offer.price}\n`
      content += `   MOQ: ${offer.moq}\n`
      content += `   Lead Time: ${offer.leadTime}\n`
      content += `   Rating: ${offer.rating}/5\n\n`
    })

    // Create and download
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sourcing-report-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Handle edit (go back to questions)
  const handleEdit = () => {
    updateSourcingFlow({ step: "questions" })
  }

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    setSupplierMatches([])
    setSupplierOffers([])
  }

  const handleDeleteSession = (sessionId: string) => {
    if (sessions.length === 1) {
      setSessions([{
        id: "1",
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
      }])
      setActiveSessionId("1")
    } else {
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (activeSessionId === sessionId) {
        setActiveSessionId(sessions[0].id === sessionId ? sessions[1].id : sessions[0].id)
      }
    }
    setSupplierMatches([])
    setSupplierOffers([])
  }

  const handleCopyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handlePromptClick = (prompt: typeof suggestedPrompts[number]) => {
    // Check if this prompt should redirect instead of chat
    if (prompt.action === "redirect" && prompt.redirectTo) {
      router.push(prompt.redirectTo)
      return
    }
    handleSendMessage(prompt.prompt)
  }

  const handleCapabilityClick = (cap: (typeof aiCapabilities)[number]) => {
    if (cap.type === "redirect") {
      router.push(cap.to)
    } else if (cap.type === "estimator") {
      setShowEstimator(true)
    } else {
      handleSendMessage(cap.prompt)
    }
  }

  // Past sessions (with messages) other than the one currently open
  const recentConversations = sessions
    .filter((s) => s.id !== activeSessionId && s.messages.length > 0)
    .slice(0, 3)

  // Calculate sourcing progress
  const getSourcingProgress = () => {
    if (!sourcingFlow?.active) return 0
    const steps = ["detect", "questions", "confirm", "matching", "rfq-sent", "collecting", "results"]
    const currentIndex = steps.indexOf(sourcingFlow.step)
    return Math.round(((currentIndex + 1) / steps.length) * 100)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="flex h-[calc(100vh-64px)]">
          {/* Mobile backdrop */}
          {showSidebar && (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setShowSidebar(false)}
              className="fixed inset-x-0 bottom-0 top-16 z-30 bg-foreground/20 backdrop-blur-sm md:hidden"
            />
          )}

          {/* Sidebar - Chat History */}
          <aside className={cn(
            "z-40 flex-shrink-0 border-r border-border bg-muted/40 transition-all duration-300",
            "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:top-16",
            showSidebar
              ? "w-72 max-md:shadow-2xl"
              : "w-0 overflow-hidden max-md:-translate-x-full"
          )}>
            <div className="flex h-full w-72 flex-col p-3">
              <Button 
                onClick={handleNewChat}
                className="mb-5 w-full gap-2 rounded-xl shadow-sm"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>

              {/* AI Tools */}
              <div className="mb-2 flex items-center gap-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                <Sparkles className="h-3 w-3 text-secondary" />
                AI Tools
              </div>
              <div className="mb-5 space-y-1.5">
                <button
                  onClick={() => router.push("/find-suppliers")}
                  className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 text-sm text-foreground transition-all hover:border-border hover:bg-card hover:shadow-sm"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                    <Search className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-left font-medium">Find suppliers</span>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => setShowEstimator(true)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 text-sm text-foreground transition-all hover:border-border hover:bg-card hover:shadow-sm"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                    <Calculator className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-left font-medium">Landed cost estimator</span>
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">New</Badge>
                </button>
              </div>

              <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Recent Chats
              </div>
              
              <ScrollArea className="-mx-1 flex-1 px-1">
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors cursor-pointer",
                        activeSessionId === session.id
                          ? "bg-secondary text-secondary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-card hover:text-foreground"
                      )}
                      onClick={() => {
                        setActiveSessionId(session.id)
                        setSupplierMatches([])
                        setSupplierOffers([])
                        if (typeof window !== "undefined" && window.innerWidth < 768) {
                          setShowSidebar(false)
                        }
                      }}
                    >
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 truncate font-medium">{session.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSession(session.id)
                        }}
                        className={cn(
                          "rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100",
                          activeSessionId === session.id ? "hover:bg-secondary-foreground/15" : "hover:bg-destructive/10"
                        )}
                      >
                        <Trash2 className={cn("h-3.5 w-3.5", activeSessionId === session.id ? "text-secondary-foreground" : "text-destructive")} />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </aside>

          {/* Main Chat Area */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Top bar */}
            <div className="flex items-center gap-2 border-b border-border bg-background/80 px-3 py-2 backdrop-blur">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar((v) => !v)}
                className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
                title={showSidebar ? "Hide conversations" : "Show conversations"}
              >
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">Toggle conversations</span>
              </Button>
              <div className="flex min-w-0 items-center gap-2">
                <Sparkles className="h-4 w-4 flex-shrink-0 text-secondary" />
                <span className="truncate text-sm font-medium text-foreground">{activeSession.title}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="ml-auto h-8 gap-1.5 text-muted-foreground hover:text-foreground md:hidden"
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>

            {/* Sourcing Progress Bar */}
            {sourcingFlow?.active && (
              <div className="border-b border-border bg-muted/30 px-4 py-2">
                <div className="mx-auto max-w-3xl">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Sourcing Progress</span>
                    <span>{getSourcingProgress()}%</span>
                  </div>
                  <Progress value={getSourcingProgress()} className="h-1.5" />
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <ScrollArea className="flex-1 px-4 py-6">
              <div className="mx-auto max-w-3xl">
                {activeSession.messages.length === 0 ? (
                  // Empty State with Welcome
                  <div className="flex flex-col items-center py-8 md:py-10">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/15 to-secondary/5 shadow-sm ring-1 ring-inset ring-secondary/20">
                      <Sparkles className="h-8 w-8 text-secondary" />
                    </div>
                    <h1 className="mb-3 text-balance text-center font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                      Your AI sourcing copilot
                    </h1>
                    <p className="mb-10 max-w-xl text-pretty text-center leading-relaxed text-muted-foreground">
                      I do more than answer questions — I help you take action. Find suppliers, estimate your true landed cost, and get clear guidance on importing, pricing, and certifications.
                    </p>

                    {/* Primary action tools */}
                    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
                      <button
                        onClick={() => router.push("/find-suppliers")}
                        className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/50 hover:shadow-md"
                      >
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-inset ring-secondary/15 transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:ring-secondary">
                          <Search className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-foreground">Find suppliers</p>
                            <ArrowRight className="h-4 w-4 text-secondary transition-transform group-hover:translate-x-0.5" />
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Start a guided RFQ and get matched with reviewed manufacturers.</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setShowEstimator(true)}
                        className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/50 hover:shadow-md"
                      >
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary ring-1 ring-inset ring-secondary/15 transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:ring-secondary">
                          <Calculator className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-foreground">Estimate landed cost</p>
                            <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">New</Badge>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Calculate your true per-unit cost including duties, freight & fees.</p>
                        </div>
                      </button>
                    </div>

                    {/* What I can help with */}
                    <div className="mb-4 mt-12 flex w-full max-w-2xl items-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">What I can help with</p>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                      {aiCapabilities.map((cap, index) => (
                        <button
                          key={index}
                          onClick={() => handleCapabilityClick(cap)}
                          className="group flex flex-col items-center gap-2.5 rounded-xl border border-border bg-card/50 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:bg-card hover:shadow-sm"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                            <cap.icon className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-medium leading-tight text-foreground">{cap.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Popular questions */}
                    <div className="mb-4 mt-12 flex w-full max-w-2xl items-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Popular questions</p>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid w-full max-w-2xl gap-2.5 sm:grid-cols-2">
                      {popularQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(question)}
                          className="group flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 text-left transition-all hover:border-secondary/40 hover:bg-card hover:shadow-sm"
                        >
                          <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-secondary" />
                          <span className="flex-1 text-sm text-foreground">{question}</span>
                          <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-secondary" />
                        </button>
                      ))}
                    </div>

                    {/* Recent conversations */}
                    {recentConversations.length > 0 && (
                      <>
                        <div className="mb-4 mt-12 flex w-full max-w-2xl items-center gap-3">
                          <div className="h-px flex-1 bg-border" />
                          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Recent conversations</p>
                          <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
                          {recentConversations.map((session) => {
                            const lastMessage = session.messages[session.messages.length - 1]
                            return (
                              <button
                                key={session.id}
                                onClick={() => {
                                  setActiveSessionId(session.id)
                                  setSupplierMatches([])
                                  setSupplierOffers([])
                                }}
                                className="group flex flex-col gap-2 rounded-xl border border-border bg-card/50 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:bg-card hover:shadow-sm"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                  </div>
                                  <span className="truncate text-sm font-medium text-foreground">{session.title}</span>
                                </div>
                                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                  {lastMessage?.content || "Continue this conversation"}
                                </p>
                                <span className="mt-auto text-[11px] text-muted-foreground/70">
                                  {session.messages.length} {session.messages.length === 1 ? "message" : "messages"}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  // Chat Messages
                  <div className="space-y-6">
                    {activeSession.messages.map((message, idx) => (
                      <div key={message.id}>
                        <div
                          className={cn(
                            "flex gap-4",
                            message.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-secondary/10 text-secondary">
                                <Sparkles className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className={cn(
                            "group max-w-[80%] rounded-2xl px-4 py-3",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}>
                            <div className={cn(
                              "prose prose-sm max-w-none",
                              message.role === "user" 
                                ? "prose-invert" 
                                : "prose-neutral dark:prose-invert"
                            )}>
                              {message.content.split('\n').map((line, i) => {
                                if (line.startsWith('**') && line.endsWith('**')) {
                                  return <p key={i} className="font-semibold">{line.replace(/\*\*/g, '')}</p>
                                }
                                if (line.startsWith('- ')) {
                                  return <p key={i} className="ml-4">• {line.slice(2)}</p>
                                }
                                if (line.trim() === '') {
                                  return <br key={i} />
                                }
                                // Handle inline bold
                                const parts = line.split(/\*\*(.+?)\*\*/g)
                                return (
                                  <p key={i}>
                                    {parts.map((part, j) => 
                                      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                    )}
                                  </p>
                                )
                              })}
                            </div>
                            
                            {/* Attachments Display */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-primary-foreground/20">
                                <div className="flex flex-wrap gap-2">
                                  {message.attachments.map((attachment) => (
                                    <div 
                                      key={attachment.id}
                                      className={cn(
                                        "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs",
                                        message.role === "user" 
                                          ? "bg-primary-foreground/20" 
                                          : "bg-muted border border-border"
                                      )}
                                    >
                                      {attachment.type === "image" ? (
                                        <>
                                          {attachment.preview ? (
                                            <img 
                                              src={attachment.preview} 
                                              alt={attachment.name}
                                              className="h-6 w-6 rounded object-cover"
                                            />
                                          ) : (
                                            <ImageIcon className="h-3.5 w-3.5" />
                                          )}
                                        </>
                                      ) : (
                                        <File className="h-3.5 w-3.5" />
                                      )}
                                      <span className="truncate max-w-[100px]">{attachment.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {message.role === "assistant" && !message.component && (
                              <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                  onClick={() => handleCopyMessage(message.id, message.content)}
                                  className="rounded p-1 hover:bg-background/50"
                                  title="Copy"
                                >
                                  {copiedId === message.id ? (
                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                  )}
                                </button>
                                <button className="rounded p-1 hover:bg-background/50" title="Good response">
                                  <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                                <button className="rounded p-1 hover:bg-background/50" title="Bad response">
                                  <ThumbsDown className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {message.role === "user" && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                U
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>

                        {/* Render interactive components */}
                        {message.component === "questions" && sourcingFlow?.step === "questions" && (
                          <div className="ml-12">
                            <SourcingQuestions 
                              data={sourcingFlow.data}
                              onSubmit={handleQuestionsSubmit}
                            />
                          </div>
                        )}

                        {message.component === "confirmation" && sourcingFlow?.step === "confirm" && (
                          <div className="ml-12">
                            <SourcingSummary 
                              data={sourcingFlow.data}
                              onConfirm={handleConfirm}
                              onEdit={handleEdit}
                            />
                          </div>
                        )}

                        {message.component === "supplier-matches" && sourcingFlow?.step === "matching" && supplierMatches.length > 0 && (
                          <div className="ml-12">
                            <SupplierMatches 
                              matches={supplierMatches}
                              onSelectChange={handleSupplierSelectChange}
                              onSendRFQ={handleSendRFQ}
                            />
                          </div>
                        )}

                        {message.component === "offers-table" && sourcingFlow?.step === "results" && supplierOffers.length > 0 && (
                          <div className="ml-12">
                            <OffersTable 
                              offers={supplierOffers}
                              onExportPDF={handleExportPDF}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex gap-4">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-secondary/10 text-secondary">
                            <Sparkles className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl bg-muted px-4 py-3">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border bg-background p-4">
              <div className="mx-auto max-w-3xl">
                {/* Pending Attachments */}
                {pendingAttachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {pendingAttachments.map((attachment) => (
                      <div 
                        key={attachment.id}
                        className="group relative flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2"
                      >
                        {attachment.type === "image" ? (
                          <div className="flex items-center gap-2">
                            {attachment.preview ? (
                              <img 
                                src={attachment.preview} 
                                alt={attachment.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm truncate max-w-[120px]">{attachment.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate max-w-[120px]">{attachment.name}</span>
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">{attachment.size}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="ml-1 rounded-full p-0.5 hover:bg-destructive/10 transition-colors"
                        >
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Hidden file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage(inputValue)
                  }}
                  className="flex items-center gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-all focus-within:border-secondary/50 focus-within:ring-2 focus-within:ring-secondary/15"
                >
                  {/* Upload buttons */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isTyping}
                    className="h-10 w-10 flex-shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
                    title="Upload image"
                  >
                    <ImageIcon className="h-5 w-5" />
                    <span className="sr-only">Upload image</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isTyping}
                    className="h-10 w-10 flex-shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
                    title="Attach document"
                  >
                    <Paperclip className="h-5 w-5" />
                    <span className="sr-only">Attach document</span>
                  </Button>

                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={
                      pendingAttachments.length > 0 
                        ? "Add a message about your attachments..." 
                        : sourcingFlow?.active 
                          ? "Ask a follow-up question..." 
                          : "Ask anything about importing, sourcing, pricing, certifications, or logistics…"
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isTyping}
                    className="h-10 flex-1 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={(!inputValue.trim() && pendingAttachments.length === 0) || isTyping}
                    className="h-10 w-10 flex-shrink-0 rounded-xl"
                    title={isTyping ? "Processing..." : "Send message"}
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send message</span>
                  </Button>
                </form>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground/70">
                  <ShieldCheck className="h-3 w-3 flex-shrink-0" />
                  Estimates and guidance are indicative. Confirm duties, certifications &amp; final pricing with suppliers and customs before ordering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Landed Cost Estimator */}
      <Dialog open={showEstimator} onOpenChange={setShowEstimator}>
        <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="flex items-center gap-2 font-serif text-lg">
              <Calculator className="h-5 w-5 text-secondary" />
              Landed Cost Estimator
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-5">
            <LandedCostEstimator onClose={() => setShowEstimator(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
