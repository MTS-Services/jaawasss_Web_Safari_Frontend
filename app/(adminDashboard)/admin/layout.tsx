"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { 
  LayoutDashboard, 
  Users,
  Factory,
  Package,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Shield,
  Flag,
  BarChart3,
  Layers,
  CreditCard,
  Star,
  DollarSign,
  Lightbulb,
  UserPlus,
  Sparkles,
  Mail,
  Filter,
  HelpCircle,
  ClipboardList,
  Award,
  ScanEye,
  ShoppingBag
} from "lucide-react"
import { useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Create navigation array with translated labels
  const navigation = [
    { name: t?.nav?.adminDashboard || "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: t?.nav?.adminUsers || "Users", href: "/admin/users", icon: Users },
    { name: t?.nav?.adminCreateManufacturer || "Create Manufacturer", href: "/admin/manufacturers/create", icon: UserPlus },
    { name: t?.nav?.adminMfgRegistrations || "Mfg registrations", href: "/admin/manufacturer-registrations", icon: ClipboardList },
    { name: t?.nav?.adminReviewManagement || "Review Management", href: "/admin/review-management", icon: ScanEye },
    { name: t?.nav?.adminSuppliers || "Suppliers", href: "/admin/suppliers", icon: Factory, badge: "12" },
    { name: t?.nav?.adminProducts || "Products", href: "/admin/products", icon: Package },
    { name: t?.nav?.adminIndustries || "Industries", href: "/admin/industries", icon: Layers },
    { name: t?.nav?.adminQuickFilters || "Quick Filters", href: "/admin/filters", icon: Filter },
    { name: t?.nav?.adminReviews || "Reviews", href: "/admin/reviews", icon: Star },
    { name: t?.nav?.adminRFQs || "RFQs", href: "/admin/rfqs", icon: FileText },
    { name: t?.nav?.adminOrders || "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: t?.nav?.adminMessages || "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: t?.nav?.adminSupportTickets || "Support Tickets", href: "/admin/customer-supports/tickets", icon: HelpCircle },
    { name: t?.nav?.adminReports || "Reports", href: "/admin/reports", icon: Flag, badge: "3" },
    { name: t?.nav?.adminPricing || "Pricing", href: "/admin/pricing", icon: DollarSign },
    { name: t?.nav?.adminPromotions || "Promotions", href: "/admin/promotions", icon: Sparkles },
    { name: t?.nav?.adminSubscriptions || "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    { name: t?.nav?.adminInsights || "Insights", href: "/admin/insights", icon: Lightbulb },
    { name: t?.nav?.adminCertificateType || "Certificate Type", href: "/admin/certificatetype", icon: Award },
    { name: t?.nav?.adminAnalytics || "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: t?.nav?.adminContactPage || "Contact Page", href: "/admin/contact", icon: Mail },
    { name: t?.nav?.adminFAQManagement || "FAQ Management", href: "/admin/faq", icon: HelpCircle },
    { name: t?.nav?.adminHelpCenter || "Help Center", href: "/admin/help-center", icon: HelpCircle },
    { name: t?.nav?.adminSiteSettings || "Site Settings", href: "/admin/site-settings", icon: FileText },
    { name: t?.nav?.adminSettings || "Settings", href: "/admin/settings", icon: Settings },
  ]

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/auth/signin?role=admin")
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

  if (!user || user.role !== "admin") {
    return null
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
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive">
                <Shield className="h-4 w-4 text-destructive-foreground" />
              </div>
              <span className="font-serif text-lg font-medium text-sidebar-foreground">Admin Panel</span>
            </Link>
            <button 
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto hide-scrollbar overflow-x-hidden overscroll-contain px-3 py-4">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(`${item.href}/`))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-sidebar-primary/20 text-sidebar-primary-foreground text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="shrink-0 border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-sidebar-foreground/60">Super Admin</p>
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
              {t?.nav?.adminSignOut || "Sign Out"}
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
            <div className="relative hidden min-w-0 flex-1 md:block md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search users, suppliers, products..."
                className="h-9 w-full min-w-0 rounded-lg border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            */}
          </div>
          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              {t?.nav?.adminViewSite || "View Site"}
            </Link>
          </div>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto overscroll-y-contain p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
