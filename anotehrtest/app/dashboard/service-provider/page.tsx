"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useServiceRequests } from "@/lib/service-requests-context"
import { serviceProviders } from "@/lib/data/service-providers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Inbox, MessageSquare, Star, Eye, ArrowRight, Briefcase, Clock } from "lucide-react"

const statusStyles: Record<string, string> = {
  new: "bg-secondary/15 text-secondary",
  "in-progress": "bg-info/15 text-info",
  completed: "bg-success/15 text-success",
  declined: "bg-muted text-muted-foreground",
}

export default function ServiceProviderDashboardPage() {
  const { user } = useAuth()
  const { getRequestsForProvider, requests } = useServiceRequests()

  const providerId = user?.id ?? "sp-1"
  const provider = serviceProviders.find((p) => p.id === providerId) ?? serviceProviders[0]
  const myRequests = getRequestsForProvider(providerId)
  const newRequests = myRequests.filter((r) => r.status === "new")

  const stats = [
    { label: "New requests", value: newRequests.length, icon: Inbox, href: "/dashboard/service-provider/requests" },
    { label: "Total requests", value: myRequests.length, icon: MessageSquare, href: "/dashboard/service-provider/requests" },
    { label: "Profile rating", value: provider.rating, icon: Star, href: "/dashboard/service-provider/profile" },
    { label: "Reviews", value: provider.reviewCount, icon: Eye, href: "/dashboard/service-provider/profile" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">
            Welcome back, {user?.firstName ?? "there"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s happening with {provider.name}.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href={`/service-providers/${provider.slug}`}>
            <Eye className="h-4 w-4" />
            View public profile
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-secondary"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-secondary" />
            </div>
            <p className="mt-3 font-serif text-2xl font-medium text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent requests */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold text-foreground">Recent service requests</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-secondary" asChild>
            <Link href="/dashboard/service-provider/requests">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        {myRequests.length > 0 ? (
          <ul className="divide-y divide-border">
            {myRequests.slice(0, 5).map((req) => (
              <li key={req.id}>
                <Link
                  href="/dashboard/service-provider/requests"
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-foreground">{req.serviceNeeded}</p>
                      <Badge className={statusStyles[req.status]} variant="secondary">
                        {req.status === "in-progress" ? "In progress" : req.status}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {req.buyerCompany || req.buyerName} · {req.countryRegion || "Remote"}
                    </p>
                  </div>
                  <span className="flex flex-shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-10 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No service requests yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
