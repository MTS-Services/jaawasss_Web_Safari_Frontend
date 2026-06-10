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
  Plus,
  Search,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MessageSquare
} from "lucide-react"

const rfqs = [
  { 
    id: "RFQ-001", 
    product: "TWS Wireless Earbuds Pro", 
    supplier: "TechVision Electronics", 
    quantity: "5,000 units",
    status: "Quoted", 
    date: "Mar 12, 2026",
    quotedPrice: "$14.50/unit"
  },
  { 
    id: "RFQ-002", 
    product: "Organic Cotton Jersey Fabric", 
    supplier: "EcoThread Textiles", 
    quantity: "2,000 meters",
    status: "Pending", 
    date: "Mar 10, 2026",
    quotedPrice: null
  },
  { 
    id: "RFQ-003", 
    product: "CNC Vertical Machining Center", 
    supplier: "GlobalFab Machinery", 
    quantity: "2 sets",
    status: "In Review", 
    date: "Mar 8, 2026",
    quotedPrice: null
  },
  { 
    id: "RFQ-004", 
    product: "Modern Solid Oak Dining Table", 
    supplier: "LuxHome Furniture", 
    quantity: "100 pieces",
    status: "Quoted", 
    date: "Mar 5, 2026",
    quotedPrice: "$225/piece"
  },
  { 
    id: "RFQ-005", 
    product: "Vitamin C Brightening Serum", 
    supplier: "PureGlow Cosmetics", 
    quantity: "10,000 units",
    status: "Expired", 
    date: "Feb 28, 2026",
    quotedPrice: null
  },
]

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  "Quoted": { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  "Pending": { color: "bg-amber-100 text-amber-700", icon: Clock },
  "In Review": { color: "bg-blue-100 text-blue-700", icon: Eye },
  "Expired": { color: "bg-gray-100 text-gray-700", icon: AlertCircle },
}

export default function BuyerRFQsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredRFQs = rfqs.filter(rfq => {
    if (searchQuery && !rfq.product.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !rfq.supplier.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !rfq.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter && statusFilter !== "all" && rfq.status !== statusFilter) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Request for Quotes</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and track your RFQ submissions
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/rfq/new">
            <Plus className="h-4 w-4" />
            New RFQ
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-foreground">{rfqs.length}</div>
          <p className="text-sm text-muted-foreground">Total RFQs</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-emerald-600">{rfqs.filter(r => r.status === "Quoted").length}</div>
          <p className="text-sm text-muted-foreground">Quoted</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-amber-600">{rfqs.filter(r => r.status === "Pending").length}</div>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-blue-600">{rfqs.filter(r => r.status === "In Review").length}</div>
          <p className="text-sm text-muted-foreground">In Review</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by product, supplier, or RFQ ID..."
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
            <SelectItem value="Quoted">Quoted</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Review">In Review</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* RFQ Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-sm">
                <th className="px-5 py-3 font-medium text-muted-foreground">RFQ ID</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Product</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Supplier</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Quantity</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Quote</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRFQs.map((rfq) => {
                const StatusIcon = statusConfig[rfq.status]?.icon || Clock
                return (
                  <tr key={rfq.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => window.location.href = `/dashboard/buyer/rfqs/${rfq.id}`}>
                    <td className="px-5 py-4 text-sm font-medium text-foreground">{rfq.id}</td>
                    <td className="px-5 py-4 text-sm text-foreground">{rfq.product}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{rfq.supplier}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{rfq.quantity}</td>
                    <td className="px-5 py-4">
                      <Badge className={statusConfig[rfq.status]?.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {rfq.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {rfq.quotedPrice ? (
                        <span className="font-semibold text-foreground">{rfq.quotedPrice}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{rfq.date}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/dashboard/buyer/rfqs/${rfq.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href="/dashboard/buyer/messages">
                            <MessageSquare className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredRFQs.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-semibold text-foreground">No RFQs found</h3>
            <p className="mt-2 text-muted-foreground">
              {searchQuery || statusFilter ? "Try adjusting your filters" : "Submit your first RFQ to get started"}
            </p>
            {!searchQuery && !statusFilter && (
              <Button className="mt-4 gap-2" asChild>
                <Link href="/rfq/new">
                  <Plus className="h-4 w-4" />
                  Submit RFQ
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
