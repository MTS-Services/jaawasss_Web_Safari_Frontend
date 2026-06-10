"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare,
  FileText,
  Eye,
  Heart,
  CheckCircle,
  Clock,
  Factory,
  Package,
  ArrowRight
} from "lucide-react"

const activities = [
  {
    id: "1",
    type: "message",
    title: "New message from TechVision Electronics",
    description: "Thank you for your inquiry. We can offer a competitive price...",
    time: "2 hours ago",
    icon: MessageSquare,
    link: "/dashboard/buyer/messages"
  },
  {
    id: "2",
    type: "rfq_response",
    title: "Quote received for TWS Earbuds",
    description: "GlobalFab Machinery responded to your RFQ with a quote of $14.50/unit",
    time: "5 hours ago",
    icon: FileText,
    link: "/dashboard/buyer/rfqs"
  },
  {
    id: "3",
    type: "view",
    title: "Viewed supplier profile",
    description: "You viewed EcoThread Textiles - Textiles & Apparel",
    time: "1 day ago",
    icon: Eye,
    link: "/suppliers/ecothread-textiles"
  },
  {
    id: "4",
    type: "save",
    title: "Saved a new supplier",
    description: "LuxHome Furniture has been added to your saved suppliers",
    time: "1 day ago",
    icon: Heart,
    link: "/dashboard/buyer/saved"
  },
  {
    id: "5",
    type: "rfq_sent",
    title: "RFQ submitted",
    description: "Request for 5000 units of Premium Cotton T-Shirts sent to EcoThread",
    time: "2 days ago",
    icon: FileText,
    link: "/dashboard/buyer/rfqs"
  },
  {
    id: "6",
    type: "message",
    title: "Conversation started with PureGlow Cosmetics",
    description: "You initiated a conversation about private label cosmetics",
    time: "3 days ago",
    icon: MessageSquare,
    link: "/dashboard/buyer/messages"
  },
  {
    id: "7",
    type: "view",
    title: "Viewed product",
    description: "CNC Machining Center V2 by GlobalFab Machinery",
    time: "3 days ago",
    icon: Package,
    link: "/products/cnc-machining-center-v2"
  },
  {
    id: "8",
    type: "account",
    title: "Account review completed",
    description: "Your buyer account has been reviewed successfully",
    time: "1 week ago",
    icon: CheckCircle,
    link: "/dashboard/buyer/settings"
  },
]

const activityBadgeColors: Record<string, string> = {
  message: "bg-blue-100 text-blue-700",
  rfq_response: "bg-green-100 text-green-700",
  rfq_sent: "bg-amber-100 text-amber-700",
  view: "bg-gray-100 text-gray-700",
  save: "bg-pink-100 text-pink-700",
  account: "bg-purple-100 text-purple-700",
}

const activityLabels: Record<string, string> = {
  message: "Message",
  rfq_response: "Quote",
  rfq_sent: "RFQ",
  view: "Viewed",
  save: "Saved",
  account: "Account",
}

export default function BuyerActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Recent Activity</h1>
        <p className="mt-1 text-muted-foreground">
          Track your interactions with suppliers and products
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {activities.map((activity, index) => (
          <Link
            key={activity.id}
            href={activity.link}
            className="flex items-start gap-4 border-b border-border p-4 last:border-b-0 hover:bg-muted/50 transition-colors"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
              <activity.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-foreground">{activity.title}</h3>
                    <Badge className={activityBadgeColors[activity.type]} variant="secondary">
                      {activityLabels[activity.type]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-muted">
            <Factory className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">12</p>
          <p className="text-sm text-muted-foreground">Suppliers Contacted</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">8</p>
          <p className="text-sm text-muted-foreground">RFQs Submitted</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-muted">
            <Heart className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">5</p>
          <p className="text-sm text-muted-foreground">Suppliers Saved</p>
        </div>
      </div>
    </div>
  )
}
