"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  Briefcase,
  ListChecks,
  ClipboardList,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Clock,
  LifeBuoy,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard/service-provider", icon: LayoutDashboard },
  { name: "Service Requests", href: "/dashboard/service-provider/requests", icon: Inbox },
  { name: "Engagements", href: "/dashboard/service-provider/engagements", icon: ClipboardList },
  { name: "Messages", href: "/dashboard/service-provider/messages", icon: MessageSquare },
  { name: "My Profile", href: "/dashboard/service-provider/profile", icon: Briefcase },
  { name: "My Services", href: "/dashboard/service-provider/services", icon: ListChecks },
  { name: "Subscription", href: "/dashboard/service-provider/subscription", icon: CreditCard },
  { name: "Support", href: "/dashboard/service-provider/support", icon: LifeBuoy },
  { name: "Settings", href: "/dashboard/service-provider/settings", icon: Settings },
]

const statusLabels: Record<string, string> = {
  under_review: "Under Review",
  approved: "Approved",
  active: "Active",
  inactive: "Inactive",
  rejected: "Rejected",
}

export default function ServiceProviderDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "service-provider")) {
      router.push("/auth/signin?role=service-provider")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "service-provider") {
    return null
  }

  const status = user.serviceProviderStatus ?? "active"
  const showBanner = status === "under_review" || status === "rejected" || status === "inactive"

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <span className="text-sm font-bold text-sidebar-primary-foreground">SN</span>
              </div>
              <span className="font-serif text-lg font-medium text-sidebar-foreground">SourceNest</span>
            </Link>
            <button className="text-sidebar-foreground lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {showBanner && (
            <div
              className={cn(
                "mx-3 mt-3 rounded-lg p-3 text-xs",
                status === "under_review" && "bg-amber-500/20 text-amber-200",
                status === "rejected" && "bg-red-500/20 text-red-200",
                status === "inactive" && "bg-orange-500/20 text-orange-200",
              )}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{statusLabels[status]}</span>
              </div>
              <p className="mt-1 opacity-80">
                {status === "under_review" && "Your profile is being reviewed by our team."}
                {status === "rejected" && "Please contact support for details."}
                {status === "inactive" && "Your listing is currently hidden."}
              </p>
            </div>
          )}

          <div className="border-b border-sidebar-border px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sidebar-foreground/60">Current Package</span>
              <Badge className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">Standard</Badge>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
                <Briefcase className="h-5 w-5 text-sidebar-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-sidebar-foreground">{user.company}</p>
                <p className="text-xs text-sidebar-foreground/60">Service Provider</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-3 w-full justify-start gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              onClick={() => {
                logout()
                router.push("/")
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden gap-1.5 bg-transparent sm:inline-flex" asChild>
              <Link href="/dashboard/service-provider/support">
                <LifeBuoy className="h-4 w-4" />
                Contact Support
              </Link>
            </Button>
            <button className="relative rounded-lg p-2 hover:bg-muted">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary" />
            </button>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to Site
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
