import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getFeaturedSuppliers } from "@/lib/data/suppliers"
import { StatusBadge } from "@/components/shared/status-badge"
import { JourneyStepper, type JourneyStep } from "@/components/shared/journey-stepper"
import { NextStepCard } from "@/components/shared/next-step-card"
import {
  MessageSquare,
  FileText,
  Heart,
  ArrowRight,
  Factory,
  Package,
  TrendingUp,
  Star,
  Search,
  Send,
  Inbox,
  Handshake,
} from "lucide-react"

const recommendedSuppliers = getFeaturedSuppliers().slice(3, 6)

// Connected buyer journey: discovery -> RFQ -> offers -> communication -> deal
const buyerJourney: JourneyStep[] = [
  { label: "Discover", icon: Search },
  { label: "Send RFQ", icon: Send },
  { label: "Receive Offers", icon: Inbox },
  { label: "Communicate", icon: MessageSquare },
  { label: "Close Deal", icon: Handshake },
]

export default function BuyerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
          Welcome back, John
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's what's happening with your sourcing activities.
        </p>
      </div>

      {/* Journey + Next step */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Your sourcing journey</h2>
          <span className="text-xs text-muted-foreground">Step 3 of 5</span>
        </div>
        <div className="mt-4">
          <JourneyStepper steps={buyerJourney} current={2} />
        </div>
      </div>

      <NextStepCard
        title="You have 2 new offers waiting for review"
        description="Compare pricing, MOQ, and lead times side by side, then continue the conversation with your top manufacturers."
        icon={Inbox}
        actionLabel="Review offers"
        actionHref="/dashboard/buyer/rfqs"
        secondaryLabel="Find more suppliers"
        secondaryHref="/find-suppliers"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <MessageSquare className="h-5 w-5 text-secondary" />
            </div>
            <Badge variant="secondary" className="text-xs">+3 new</Badge>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-sm text-muted-foreground">Active Conversations</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <FileText className="h-5 w-5 text-secondary" />
            </div>
            <Badge variant="secondary" className="text-xs">2 pending</Badge>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-foreground">8</div>
            <p className="text-sm text-muted-foreground">RFQs Submitted</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Heart className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-sm text-muted-foreground">Saved Suppliers</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-foreground">156</div>
            <p className="text-sm text-muted-foreground">Products Viewed</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Messages */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-semibold text-foreground">Recent Messages</h2>
            <Button variant="ghost" size="sm" className="gap-1 text-secondary" asChild>
              <Link href="/dashboard/buyer/messages">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {[
              { name: "TechVision Electronics", message: "Thank you for your inquiry. We can offer...", time: "2 hours ago", unread: true, rfq: "RFQ-001" },
              { name: "EcoThread Textiles", message: "The samples have been shipped. Tracking...", time: "5 hours ago", unread: true, rfq: "RFQ-002" },
              { name: "GlobalFab Machinery", message: "Please find the attached quotation for...", time: "1 day ago", unread: false, rfq: "RFQ-003" },
            ].map((msg, i) => (
              <Link
                key={i}
                href="/dashboard/buyer/messages"
                className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                  <Factory className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-medium truncate ${msg.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {msg.name}
                    </p>
                    <span className="flex-shrink-0 text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="flex-shrink-0 text-[10px] font-normal">
                      {msg.rfq}
                    </Badge>
                    <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                  </div>
                </div>
                {msg.unread && (
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0 mt-2" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold text-foreground">Quick Actions</h2>
          <div className="mt-4 space-y-3">
            <Button className="w-full justify-start gap-2" asChild>
              <Link href="/find-suppliers">
                <Search className="h-4 w-4" />
                Start a sourcing request
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/suppliers">
                <Factory className="h-4 w-4" />
                Browse Manufacturers
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/products">
                <Package className="h-4 w-4" />
                Browse Products
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" asChild>
              <Link href="/dashboard/buyer/rfqs">
                <FileText className="h-4 w-4" />
                Manage RFQs
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* RFQ Status */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold text-foreground">RFQ Status</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-secondary" asChild>
            <Link href="/dashboard/buyer/rfqs">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-sm">
                <th className="px-5 py-3 font-medium text-muted-foreground">RFQ ID</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Product</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Supplier</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: "RFQ-001", product: "TWS Wireless Earbuds", supplier: "TechVision Electronics", status: "Quoted", date: "Mar 12, 2026" },
                { id: "RFQ-002", product: "Organic Cotton Fabric", supplier: "EcoThread Textiles", status: "Pending", date: "Mar 10, 2026" },
                { id: "RFQ-003", product: "CNC Machining Center", supplier: "GlobalFab Machinery", status: "In Review", date: "Mar 8, 2026" },
              ].map((rfq) => (
                <tr key={rfq.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{rfq.id}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{rfq.product}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{rfq.supplier}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={rfq.status} />
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{rfq.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Suppliers */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold text-foreground">Recommended for You</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-secondary" asChild>
            <Link href="/suppliers">
              Explore all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedSuppliers.map((supplier) => (
            <Link
              key={supplier.id}
              href={`/suppliers/${supplier.slug}`}
              className="rounded-lg border border-border bg-card p-4 hover:border-secondary transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Factory className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{supplier.name}</h3>
                  <p className="text-sm text-muted-foreground">{supplier.location.city}, {supplier.location.country}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{supplier.rating}</span>
                    <span className="text-muted-foreground">• {supplier.productCount.toLocaleString()} products</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
