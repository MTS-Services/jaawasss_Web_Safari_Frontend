"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Factory,
  Star,
  Award,
  Globe,
  CreditCard,
  FileBox,
  Clock,
  ScanEye,
  HelpCircle,
  ShoppingBag
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard/manufacturer", icon: LayoutDashboard },
  { name: "Inquiries", href: "/dashboard/manufacturer/inquiries", icon: FileText },
  { name: "Messages", href: "/dashboard/manufacturer/messages", icon: MessageSquare },
  { name: "Support Tickets", href: "/dashboard/manufacturer/support-tickets", icon: HelpCircle },
  { name: "Review Center", href: "/dashboard/manufacturer/review-center", icon: ScanEye },
  { name: "Orders", href: "/dashboard/manufacturer/orders", icon: ShoppingBag },
  { name: "Products", href: "/dashboard/manufacturer/products", icon: Package },
  { name: "Catalogs", href: "/dashboard/manufacturer/catalogs", icon: FileBox },
  { name: "Certifications", href: "/dashboard/manufacturer/certifications", icon: Award },
  { name: "Export Markets", href: "/dashboard/manufacturer/markets", icon: Globe },
  { name: "Analytics", href: "/dashboard/manufacturer/analytics", icon: BarChart3 },
  { name: "Company Profile", href: "/dashboard/manufacturer/profile", icon: Factory },
  { name: "Subscription", href: "/dashboard/manufacturer/subscription", icon: CreditCard },
  { name: "Settings", href: "/dashboard/manufacturer/settings", icon: Settings },
]

export default function ManufacturerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "manufacturer")) {
      router.push("/auth/signin?role=manufacturer")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "manufacturer") {
    return null
  }

  // Show approval status banner for non-approved manufacturers
  const showApprovalBanner = user.manufacturerStatus && user.manufacturerStatus !== "approved"
  const isNavItemActive = (href: string) => {
    if (pathname === href) return true
    if (href !== "/dashboard/manufacturer" && pathname.startsWith(`${href}/`)) return true
    return false
  }

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 w-full overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col bg-sidebar shadow-lg transition-transform duration-200 ease-in-out lg:z-30 lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <span className="text-sm font-bold text-sidebar-primary-foreground">SN</span>
              </div>
              <span className="font-serif text-lg font-medium text-sidebar-foreground">SourceNest</span>
            </Link>
            <button 
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {showApprovalBanner && (
            <div className={cn(
              "mx-3 mt-3 shrink-0 rounded-lg p-3 text-xs",
              user.manufacturerStatus === "pending_approval" && "bg-amber-500/20 text-amber-200",
              user.manufacturerStatus === "rejected" && "bg-red-500/20 text-red-200",
              user.manufacturerStatus === "suspended" && "bg-orange-500/20 text-orange-200",
              user.manufacturerStatus === "needs_more_info" && "bg-blue-500/20 text-blue-200",
            )}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                  {user.manufacturerStatus === "pending_approval" && "Pending Approval"}
                  {user.manufacturerStatus === "rejected" && "Application Rejected"}
                  {user.manufacturerStatus === "suspended" && "Account Suspended"}
                  {user.manufacturerStatus === "needs_more_info" && "More Info Needed"}
                </span>
              </div>
              <p className="mt-1 opacity-80">
                {user.manufacturerStatus === "pending_approval" && "Your account is under review."}
                {user.manufacturerStatus === "rejected" && "Please contact support."}
                {user.manufacturerStatus === "suspended" && "Please contact support."}
                {user.manufacturerStatus === "needs_more_info" && "Check your messages."}
              </p>
            </div>
          )}

          <div className="shrink-0 border-b border-sidebar-border px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sidebar-foreground/60">Current Plan</span>
              <Badge className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                Premium
              </Badge>
            </div>
          </div>

          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden overscroll-contain px-3 py-4">
            {navigation.map((item) => {
              const isActive = isNavItemActive(item.href)
              const navItem = item as typeof item & { highlight?: boolean }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    navItem.highlight && !isActive && "bg-secondary/20 text-secondary border border-secondary/30"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5", navItem.highlight && !isActive && "text-secondary")} />
                    {item.name}
                  </div>
                  {navItem.highlight && !isActive && (
                    <Badge className="bg-secondary text-secondary-foreground text-xs">
                      Required
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="shrink-0 border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
                <Factory className="h-5 w-5 text-sidebar-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-foreground">{user.company}</p>
                <div className="flex items-center gap-1 text-xs text-sidebar-foreground/60">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  4.9 Rating
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="mt-3 w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
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

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:pl-64">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            {/*
            <div className="relative hidden min-w-0 flex-1 md:block md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search inquiries, messages..."
                className="h-9 w-full min-w-0 rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            */}
          </div>
          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to Site
            </Link>
          </div>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain p-4 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
