"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search,
  Package,
  MoreVertical,
  CheckCircle,
  X,
  Eye,
  Factory
} from "lucide-react"

const products = [
  { id: "1", name: "TWS Wireless Earbuds Pro", supplier: "TechVision Electronics", category: "Audio", status: "approved", price: "$12.50 - $15.00" },
  { id: "2", name: "Premium Cotton T-Shirt", supplier: "EcoThread Textiles", category: "Apparel", status: "approved", price: "$4.20 - $6.80" },
  { id: "3", name: "CNC Machining Center V2", supplier: "GlobalFab Machinery", category: "Machinery", status: "approved", price: "$45,000 - $68,000" },
  { id: "4", name: "LED Smart Bulb WiFi", supplier: "NewTech Industries", category: "Electronics", status: "pending", price: "$2.50 - $4.00" },
  { id: "5", name: "Organic Green Tea Extract", supplier: "GreenLeaf Organics", category: "Food", status: "pending", price: "$15.00 - $25.00" },
  { id: "6", name: "Stainless Steel Fasteners", supplier: "MetalWorks Pro", category: "Industrial", status: "under_review", price: "$0.05 - $0.25" },
]

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter !== "all" && product.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Products</h1>
        <p className="mt-1 text-muted-foreground">
          Review and manage product listings
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                <Package className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Factory className="h-3 w-3" />
                  {product.supplier}
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm">
                  <Badge variant="outline">{product.category}</Badge>
                  <span className="font-medium text-foreground">{product.price}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  product.status === "approved" ? "secondary" : 
                  product.status === "pending" ? "outline" : 
                  product.status === "under_review" ? "outline" : "destructive"
                }
                className="capitalize"
              >
                {product.status.replace("_", " ")}
              </Badge>
              
              {product.status === "pending" && (
                <>
                  <Button size="sm" variant="outline">
                    <Eye className="mr-1 h-3 w-3" />
                    Review
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    <X className="mr-1 h-3 w-3" />
                    Reject
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Approve
                  </Button>
                </>
              )}
              
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
