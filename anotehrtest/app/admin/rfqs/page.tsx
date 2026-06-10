"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText,
  User,
  Factory,
  Eye,
  Clock
} from "lucide-react"

const rfqs = [
  { id: "RFQ-001", product: "TWS Earbuds", buyer: "ABC Imports LLC", supplier: "TechVision Electronics", quantity: "5,000 units", status: "quoted", createdAt: "2 days ago" },
  { id: "RFQ-002", product: "Cotton T-Shirts", buyer: "European Traders", supplier: "EcoThread Textiles", quantity: "10,000 pieces", status: "pending", createdAt: "3 days ago" },
  { id: "RFQ-003", product: "CNC Machine", buyer: "Pacific Retail", supplier: "GlobalFab Machinery", quantity: "2 units", status: "completed", createdAt: "1 week ago" },
  { id: "RFQ-004", product: "LED Bulbs", buyer: "Smart Home Inc", supplier: "TechVision Electronics", quantity: "20,000 units", status: "expired", createdAt: "2 weeks ago" },
  { id: "RFQ-005", product: "Organic Tea", buyer: "Natural Foods Co", supplier: "GreenLeaf Organics", quantity: "500 kg", status: "pending", createdAt: "4 days ago" },
]

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  quoted: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-700"
}

export default function AdminRFQsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">RFQs</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor request for quotations across the platform
        </p>
      </div>

      {/* RFQs Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">RFQ ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden md:table-cell">Buyer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden lg:table-cell">Supplier</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden sm:table-cell">Quantity</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rfqs.map((rfq) => (
              <tr key={rfq.id} className="border-t border-border hover:bg-muted/50">
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-foreground">{rfq.id}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{rfq.product}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {rfq.buyer}
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Factory className="h-3 w-3" />
                    {rfq.supplier}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                  {rfq.quantity}
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusColors[rfq.status]} variant="secondary">
                    {rfq.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
                      <Clock className="h-3 w-3" />
                      {rfq.createdAt}
                    </span>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
