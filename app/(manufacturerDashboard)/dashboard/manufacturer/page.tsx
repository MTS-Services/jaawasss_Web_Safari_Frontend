import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  FileText, 
  Eye,
  ArrowRight,
  TrendingUp,
  Users,
  Package,
  Star,
  Clock,
  CheckCircle,
  DollarSign
} from "lucide-react"

export default function ManufacturerDashboardPage() {
  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor your business performance and buyer inquiries.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit gap-1 bg-emerald-100 text-emerald-700">
          <CheckCircle className="h-3 w-3" />
          Profile 95% Complete
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 w-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <FileText className="h-5 w-5 text-secondary" />
            </div>
            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">+12%</Badge>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-foreground">28</div>
            <p className="text-sm text-muted-foreground">New Inquiries (30d)</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 w-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Eye className="h-5 w-5 text-secondary" />
            </div>
            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">+8%</Badge>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-foreground">2,450</div>
            <p className="text-sm text-muted-foreground">Profile Views (30d)</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 w-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-foreground">$124K</div>
            <p className="text-sm text-muted-foreground">Quote Value (30d)</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 w-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Star className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">4.9</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Average Rating (342 reviews)</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Inquiries */}
        <div className="md:col-span-2 lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-border p-5 min-w-0">
            <h2 className="font-semibold text-foreground truncate">Recent Inquiries</h2>
            <Button variant="ghost" size="sm" className="gap-1 text-secondary" asChild>
              <Link href="/dashboard/manufacturer/inquiries">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
            <div className="divide-y divide-border">
            {[
              { id: "1", buyer: "Global Retail Inc.", product: "TWS Wireless Earbuds", quantity: "5,000 units", time: "2 hours ago", status: "New" },
              { id: "2", buyer: "Fashion Forward Ltd.", product: "Smart LED Bulbs", quantity: "10,000 units", time: "5 hours ago", status: "New" },
              { id: "3", buyer: "TechMart USA", product: "Power Banks", quantity: "3,000 units", time: "1 day ago", status: "Quoted" },
              { id: "4", buyer: "EuroTrade GmbH", product: "Wireless Earbuds", quantity: "8,000 units", time: "2 days ago", status: "Quoted" },
            ].map((inquiry) => (
              <div key={inquiry.id} className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-medium truncate text-foreground">{inquiry.buyer}</h3>
                      <Badge 
                        variant={inquiry.status === "New" ? "default" : "secondary"}
                        className={inquiry.status === "New" ? "bg-secondary shrink-0" : "shrink-0"}
                      >
                        {inquiry.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{inquiry.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground truncate">
                    {inquiry.product} • {inquiry.quantity}
                  </p>
                </div>

                <div className="shrink-0">
                  <Button size="sm" variant="outline" className="h-8 px-2 sm:h-9 sm:px-4" asChild>
                    <Link href={`/dashboard/manufacturer/inquiries/${inquiry.id}`}>
                      <span className="hidden sm:inline">View</span>
                      <Eye className="h-4 w-4 sm:hidden" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="space-y-6 md:col-span-2 lg:col-span-1 min-w-0">
          {/* Response Rate */}
          <div className="rounded-xl border border-border bg-card p-5 w-full overflow-hidden">
            <h2 className="font-semibold text-foreground truncate">Response Metrics</h2>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 text-sm min-w-0">
                  <span className="text-muted-foreground truncate">Response Rate</span>
                  <span className="font-medium text-foreground shrink-0">98%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-full w-[98%] rounded-full bg-secondary" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 text-sm min-w-0">
                  <span className="text-muted-foreground truncate">Quote Conversion</span>
                  <span className="font-medium text-foreground shrink-0">72%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-full w-[72%] rounded-full bg-secondary" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 text-sm min-w-0">
                  <span className="text-muted-foreground truncate">On-time Delivery</span>
                  <span className="font-medium text-foreground shrink-0">99%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-full w-[99%] rounded-full bg-secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-border bg-card p-5 w-full overflow-hidden">
            <h2 className="font-semibold text-foreground truncate">Quick Stats</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-sm text-muted-foreground truncate">Active Products</span>
                <span className="font-medium text-foreground shrink-0">2,450</span>
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-sm text-muted-foreground truncate">Pending Quotes</span>
                <span className="font-medium text-foreground shrink-0">5</span>
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-sm text-muted-foreground truncate">Unread Messages</span>
                <span className="font-medium text-foreground shrink-0">3</span>
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-sm text-muted-foreground truncate">Avg. Response Time</span>
                <span className="font-medium text-foreground shrink-0">2 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card w-full overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-border p-5 min-w-0">
          <h2 className="font-semibold text-foreground truncate">Recent Activity</h2>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {[
              { action: "Quote sent to Global Retail Inc.", time: "2 hours ago", icon: FileText },
              { action: "New message from Fashion Forward Ltd.", time: "3 hours ago", icon: MessageSquare },
              { action: "Product 'Smart LED Bulb' viewed 45 times", time: "5 hours ago", icon: Eye },
              { action: "Profile viewed by TechMart USA", time: "1 day ago", icon: Users },
              { action: "New review received (5 stars)", time: "2 days ago", icon: Star },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
