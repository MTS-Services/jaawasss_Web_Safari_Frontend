"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare,
  User,
  Factory,
  Eye,
  Clock,
  AlertTriangle
} from "lucide-react"

const conversations = [
  { id: "1", buyer: "John Smith (ABC Imports)", supplier: "TechVision Electronics", messages: 12, lastMessage: "2 hours ago", flagged: false },
  { id: "2", buyer: "Emma Wilson (Euro Traders)", supplier: "EcoThread Textiles", messages: 8, lastMessage: "5 hours ago", flagged: false },
  { id: "3", buyer: "David Chen (Pacific Retail)", supplier: "GlobalFab Machinery", messages: 15, lastMessage: "1 day ago", flagged: true },
  { id: "4", buyer: "Sophie Martin (UK Retail)", supplier: "LuxHome Furniture", messages: 6, lastMessage: "2 days ago", flagged: false },
  { id: "5", buyer: "James Anderson (Canadian Elec)", supplier: "PureGlow Cosmetics", messages: 4, lastMessage: "3 days ago", flagged: false },
]

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Messages</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor conversations between buyers and suppliers
        </p>
      </div>

      {/* Conversations List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Buyer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden md:table-cell">Supplier</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden sm:table-cell">Messages</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Last Activity</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conv) => (
              <tr key={conv.id} className="border-t border-border hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{conv.buyer}</span>
                    {conv.flagged && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Factory className="h-3 w-3" />
                    {conv.supplier}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{conv.messages}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {conv.lastMessage}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
