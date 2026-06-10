"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search,
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  Eye,
  Send,
  Sparkles,
  Package,
  MapPin,
  Layers,
  Award,
  Tag
} from "lucide-react"

// Updated inquiries with AI-generated RFQ details
const inquiries = [
  { 
    id: "INQ-001", 
    buyer: "Global Retail Inc.", 
    company: "USA",
    product: "Toilet Paper - 2 Ply", 
    quantity: "50,000 rolls",
    specs: {
      ply: "2-ply",
      material: "Virgin pulp",
      packaging: "24 rolls per case",
      certifications: ["FSC Certified"],
      privateLabel: true
    },
    message: "Looking for high-quality 2-ply toilet paper for our retail chain. Need FSC certification and custom packaging with our store branding.",
    status: "New", 
    date: "Mar 15, 2026",
    priority: "High",
    source: "AI Sourcing"
  },
  { 
    id: "INQ-002", 
    buyer: "EcoBeauty Distributors", 
    company: "Germany",
    product: "Organic Shampoo - 500ml", 
    quantity: "10,000 units",
    specs: {
      formulation: "Sulfate-free, organic",
      packaging: "Recyclable bottles",
      certifications: ["COSMOS Organic", "Cruelty-Free"],
      privateLabel: true
    },
    message: "Seeking organic shampoo manufacturer for European market. Must have COSMOS certification and be cruelty-free.",
    status: "New", 
    date: "Mar 14, 2026",
    priority: "High",
    source: "AI Sourcing"
  },
  { 
    id: "INQ-003", 
    buyer: "TechMart USA", 
    company: "USA",
    product: "TWS Wireless Earbuds", 
    quantity: "5,000 units",
    specs: {
      features: "Bluetooth 5.3, ANC",
      packaging: "Retail box",
      certifications: ["FCC", "CE"],
      privateLabel: false
    },
    message: "Interested in TWS earbuds with active noise cancellation for our electronics stores.",
    status: "Quoted", 
    date: "Mar 13, 2026",
    priority: "Medium",
    source: "Direct"
  },
  { 
    id: "INQ-004", 
    buyer: "EuroTrade GmbH", 
    company: "Germany",
    product: "LED Smart Bulbs", 
    quantity: "20,000 units",
    specs: {
      wattage: "9W equivalent to 60W",
      connectivity: "WiFi + Bluetooth",
      certifications: ["CE", "RoHS"],
      privateLabel: true
    },
    message: "Looking for smart LED bulbs compatible with major voice assistants. Need CE certification for EU market.",
    status: "Quoted", 
    date: "Mar 12, 2026",
    priority: "Medium",
    source: "AI Sourcing"
  },
  { 
    id: "INQ-005", 
    buyer: "Asia Pacific Foods", 
    company: "Singapore",
    product: "Organic Green Tea", 
    quantity: "2,000 kg",
    specs: {
      grade: "Premium loose leaf",
      origin: "Certified organic farms",
      certifications: ["USDA Organic", "JAS Organic"],
      privateLabel: true
    },
    message: "Sourcing premium organic green tea for private label brand. Need USDA and JAS organic certifications.",
    status: "In Progress", 
    date: "Mar 10, 2026",
    priority: "Low",
    source: "AI Sourcing"
  },
]

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  "New": { color: "bg-secondary text-secondary-foreground", icon: Clock },
  "Quoted": { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  "In Progress": { color: "bg-blue-100 text-blue-700", icon: Send },
}

const priorityConfig: Record<string, string> = {
  "High": "bg-red-100 text-red-700",
  "Medium": "bg-amber-100 text-amber-700",
  "Low": "bg-gray-100 text-gray-700",
}

export default function ManufacturerInquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")

  const filteredInquiries = inquiries.filter(inquiry => {
    if (searchQuery && !inquiry.product.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !inquiry.buyer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !inquiry.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter && statusFilter !== "all" && inquiry.status !== statusFilter) {
      return false
    }
    if (sourceFilter && sourceFilter !== "all" && inquiry.source !== sourceFilter) {
      return false
    }
    return true
  })

  const aiSourcedCount = inquiries.filter(i => i.source === "AI Sourcing").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Buyer Inquiries</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and respond to buyer requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-foreground">{inquiries.length}</div>
          <p className="text-sm text-muted-foreground">Total Inquiries</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-secondary">{inquiries.filter(i => i.status === "New").length}</div>
          <p className="text-sm text-muted-foreground">New</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-emerald-600">{inquiries.filter(i => i.status === "Quoted").length}</div>
          <p className="text-sm text-muted-foreground">Quoted</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-blue-600">{inquiries.filter(i => i.status === "In Progress").length}</div>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            <div className="text-2xl font-bold text-secondary">{aiSourcedCount}</div>
          </div>
          <p className="text-sm text-muted-foreground">AI Sourced</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by buyer, product, or inquiry ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Quoted">Quoted</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="AI Sourcing">AI Sourced</SelectItem>
            <SelectItem value="Direct">Direct</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => {
          const StatusIcon = statusConfig[inquiry.status]?.icon || Clock
          return (
            <div 
              key={inquiry.id} 
              className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-md"
            >
              {/* AI Sourced Banner */}
              {inquiry.source === "AI Sourcing" && (
                <div className="flex items-center gap-2 bg-secondary/10 px-5 py-2 border-b border-secondary/20">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span className="text-xs font-medium text-secondary">AI Sourced Request</span>
                </div>
              )}
              
              <div className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">{inquiry.id}</span>
                      <Badge className={statusConfig[inquiry.status]?.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {inquiry.status}
                      </Badge>
                      <Badge className={priorityConfig[inquiry.priority]}>
                        {inquiry.priority}
                      </Badge>
                    </div>
                    
                    {/* Buyer Info */}
                    <h3 className="font-semibold text-foreground text-lg">{inquiry.buyer}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {inquiry.company}
                    </div>
                    
                    {/* Product & Specs Card */}
                    <div className="mt-4 rounded-lg bg-muted/50 border border-border p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{inquiry.product}</p>
                          <p className="text-sm text-secondary font-medium">{inquiry.quantity}</p>
                        </div>
                      </div>
                      
                      {/* Specifications */}
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        {inquiry.specs.ply && (
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Ply:</span>
                            <span className="text-foreground">{inquiry.specs.ply}</span>
                          </div>
                        )}
                        {inquiry.specs.material && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Material:</span>
                            <span className="text-foreground">{inquiry.specs.material}</span>
                          </div>
                        )}
                        {inquiry.specs.formulation && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Type:</span>
                            <span className="text-foreground">{inquiry.specs.formulation}</span>
                          </div>
                        )}
                        {inquiry.specs.features && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Features:</span>
                            <span className="text-foreground">{inquiry.specs.features}</span>
                          </div>
                        )}
                        {inquiry.specs.wattage && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Power:</span>
                            <span className="text-foreground">{inquiry.specs.wattage}</span>
                          </div>
                        )}
                        {inquiry.specs.connectivity && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Connectivity:</span>
                            <span className="text-foreground">{inquiry.specs.connectivity}</span>
                          </div>
                        )}
                        {inquiry.specs.grade && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Grade:</span>
                            <span className="text-foreground">{inquiry.specs.grade}</span>
                          </div>
                        )}
                        {inquiry.specs.packaging && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Packaging:</span>
                            <span className="text-foreground">{inquiry.specs.packaging}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Certifications & Private Label */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {inquiry.specs.certifications?.map((cert) => (
                          <Badge key={cert} variant="outline" className="gap-1 text-xs">
                            <Award className="h-3 w-3" />
                            {cert}
                          </Badge>
                        ))}
                        {inquiry.specs.privateLabel && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Tag className="h-3 w-3" />
                            Private Label
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Buyer Message */}
                    <p className="mt-3 text-sm text-muted-foreground">{inquiry.message}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3 lg:ml-6">
                    <span className="text-xs text-muted-foreground">{inquiry.date}</span>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="gap-1" asChild>
                        <Link href={`/dashboard/manufacturer/inquiries/${inquiry.id.replace('INQ-00', '')}`}>
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1" asChild>
                        <Link href={`/dashboard/manufacturer/inquiries/${inquiry.id.replace('INQ-00', '')}`}>
                          <MessageSquare className="h-4 w-4" />
                          Message
                        </Link>
                      </Button>
                      {inquiry.status === "New" && (
                        <Button size="sm" className="gap-1" asChild>
                          <Link href={`/dashboard/manufacturer/inquiries/${inquiry.id.replace('INQ-00', '')}`}>
                            <Send className="h-4 w-4" />
                            Send Quote
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredInquiries.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold text-foreground">No inquiries found</h3>
          <p className="mt-2 text-muted-foreground">
            {searchQuery || statusFilter !== "all" || sourceFilter !== "all" 
              ? "Try adjusting your filters" 
              : "New buyer inquiries will appear here"}
          </p>
        </div>
      )}
    </div>
  )
}
