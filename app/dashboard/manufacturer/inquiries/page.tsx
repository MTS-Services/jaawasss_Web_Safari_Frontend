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
  Send
} from "lucide-react"

const inquiries = [
  { 
    id: "INQ-001", 
    buyer: "Global Retail Inc.", 
    company: "USA",
    product: "TWS Wireless Earbuds Pro", 
    quantity: "5,000 units",
    message: "We are interested in your TWS earbuds for our retail chain. Can you provide pricing for 5000 units with custom branding?",
    status: "New", 
    date: "Mar 15, 2026",
    priority: "High"
  },
  { 
    id: "INQ-002", 
    buyer: "Fashion Forward Ltd.", 
    company: "UK",
    product: "Smart LED Bulbs", 
    quantity: "10,000 units",
    message: "Looking for smart LED bulbs compatible with Alexa and Google Home. Please share specs and pricing.",
    status: "New", 
    date: "Mar 14, 2026",
    priority: "Medium"
  },
  { 
    id: "INQ-003", 
    buyer: "TechMart USA", 
    company: "USA",
    product: "Power Banks 10000mAh", 
    quantity: "3,000 units",
    message: "Interested in power banks with fast charging support. Need samples first.",
    status: "Quoted", 
    date: "Mar 13, 2026",
    priority: "Medium"
  },
  { 
    id: "INQ-004", 
    buyer: "EuroTrade GmbH", 
    company: "Germany",
    product: "TWS Wireless Earbuds", 
    quantity: "8,000 units",
    message: "We need earbuds with ANC feature for European market. CE certification required.",
    status: "Quoted", 
    date: "Mar 12, 2026",
    priority: "High"
  },
  { 
    id: "INQ-005", 
    buyer: "Asia Distributors", 
    company: "Singapore",
    product: "Smart Watches", 
    quantity: "2,000 units",
    message: "Looking for smart watches with health monitoring features. Private label options?",
    status: "In Progress", 
    date: "Mar 10, 2026",
    priority: "Low"
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

  const filteredInquiries = inquiries.filter(inquiry => {
    if (searchQuery && !inquiry.product.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !inquiry.buyer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !inquiry.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter && statusFilter !== "all" && inquiry.status !== statusFilter) {
      return false
    }
    return true
  })

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
      <div className="grid gap-4 sm:grid-cols-4">
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
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => {
          const StatusIcon = statusConfig[inquiry.status]?.icon || Clock
          return (
            <div 
              key={inquiry.id} 
              className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{inquiry.id}</span>
                    <Badge className={statusConfig[inquiry.status]?.color}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {inquiry.status}
                    </Badge>
                    <Badge className={priorityConfig[inquiry.priority]}>
                      {inquiry.priority}
                    </Badge>
                  </div>
                  <h3 className="mt-2 font-semibold text-foreground">{inquiry.buyer}</h3>
                  <p className="text-sm text-muted-foreground">{inquiry.company}</p>
                  
                  <div className="mt-3 rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium text-foreground">{inquiry.product}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {inquiry.quantity}</p>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{inquiry.message}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-muted-foreground">{inquiry.date}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <Link href={`/dashboard/manufacturer/inquiries/${inquiry.id.replace('INQ-00', '')}`}>
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <Link href={`/dashboard/manufacturer/inquiries/${inquiry.id.replace('INQ-00', '')}`}>
                        <MessageSquare className="h-4 w-4" />
                        Reply
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
          )
        })}
      </div>

      {filteredInquiries.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold text-foreground">No inquiries found</h3>
          <p className="mt-2 text-muted-foreground">
            {searchQuery || statusFilter ? "Try adjusting your filters" : "New buyer inquiries will appear here"}
          </p>
        </div>
      )}
    </div>
  )
}
