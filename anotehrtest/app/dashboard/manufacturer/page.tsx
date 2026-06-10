import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { JourneyStepper, type JourneyStep } from "@/components/shared/journey-stepper"
import { NextStepCard } from "@/components/shared/next-step-card"
import {
  MessageSquare,
  FileText,
  Eye,
  ArrowRight,
  Users,
  Star,
  DollarSign,
  UserPlus,
  Building2,
  Package,
  ShieldCheck,
  Rocket,
  CreditCard,
} from "lucide-react"

// Connected manufacturer journey: register -> profile -> products -> review -> payment -> live
const manufacturerJourney: JourneyStep[] = [
  { label: "Register", icon: UserPlus },
  { label: "Company Profile", icon: Building2 },
  { label: "Add Products", icon: Package },
  { label: "Review", icon: ShieldCheck },
  { label: "Payment", icon: CreditCard },
  { label: "Live", icon: Rocket },
]

export default function ManufacturerDashboardPage() {
  // Current onboarding/review state drives the banner and next step.
  const reviewStatus = "Payment Required"

  return (
    <div className="space-y-6">
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Account status:</span>
          <StatusBadge status={reviewStatus} size="md" />
        </div>
      </div>

      {/* Onboarding / review journey */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Your setup progress</h2>
          <span className="text-xs text-muted-foreground">Step 5 of 6</span>
        </div>
        <div className="mt-4">
          <JourneyStepper steps={manufacturerJourney} current={4} />
        </div>
      </div>

      <NextStepCard
        title="Complete payment to go live"
        description="Your profile passed our review. Activate your subscription to appear in buyer searches and start receiving RFQs."
        icon={CreditCard}
        actionLabel="Complete payment"
        actionHref="/dashboard/manufacturer/subscription"
        secondaryLabel="Preview profile"
        secondaryHref="/dashboard/manufacturer/profile"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <FileText className="h-5 w-5 text-secondary" />
            </div>
            <Badge variant="secondary" className="border-success/20 bg-success/10 text-xs text-success">
              +12%
            </Badge>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-foreground">28</div>
            <p className="text-sm text-muted-foreground">New RFQs (30d)</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Eye className="h-5 w-5 text-secondary" />
            </div>
            <Badge variant="secondary" className="border-success/20 bg-success/10 text-xs text-success">
              +8%
            </Badge>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-foreground">2,450</div>
            <p className="text-sm text-muted-foreground">Profile Views (30d)</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <DollarSign className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-foreground">$124K</div>
            <p className="text-sm text-muted-foreground">Quote Value (30d)</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
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
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent RFQs */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-semibold text-foreground">Recent RFQs</h2>
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
              <div key={inquiry.id} className="flex items-start justify-between gap-3 p-4 hover:bg-muted/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-foreground">{inquiry.buyer}</h3>
                    <StatusBadge status={inquiry.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {inquiry.product} • {inquiry.quantity}
                  </p>
                </div>
                <div className="flex flex-shrink-0 flex-col items-end gap-2">
                  <span className="text-xs text-muted-foreground">{inquiry.time}</span>
                  <Button size="sm" variant={inquiry.status === "New" ? "default" : "outline"} asChild>
                    <Link href={`/dashboard/manufacturer/inquiries/${inquiry.id}`}>
                      {inquiry.status === "New" ? "Send offer" : "View"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="space-y-6">
          {/* Response Rate */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold text-foreground">Response Metrics</h2>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Response Rate</span>
                  <span className="font-medium text-foreground">98%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-full w-[98%] rounded-full bg-secondary" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Quote Conversion</span>
                  <span className="font-medium text-foreground">72%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-full w-[72%] rounded-full bg-secondary" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">On-time Delivery</span>
                  <span className="font-medium text-foreground">99%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-full w-[99%] rounded-full bg-secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold text-foreground">Quick Stats</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Products</span>
                <span className="font-medium text-foreground">2,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Quotes</span>
                <span className="font-medium text-foreground">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unread Messages</span>
                <span className="font-medium text-foreground">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Response Time</span>
                <span className="font-medium text-foreground">2 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold text-foreground">Recent Activity</h2>
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
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.action}</p>
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
