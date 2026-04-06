"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  FileText,
  Heart,
  MessageSquare,
  Activity,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronDown,
  Globe,
  HelpCircle,
  X,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard/buyer",
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: "My RFQs",
    href: "/dashboard/buyer/rfqs",
    icon: FileText,
    badge: "3"
  },
  {
    title: "Saved Suppliers",
    href: "/dashboard/buyer/saved",
    icon: Heart
  },
  {
    title: "Messages",
    href: "/dashboard/buyer/messages",
    icon: MessageSquare,
    badge: "5"
  },
  {
    title: "Recent Activity",
    href: "/dashboard/buyer/activity",
    icon: Activity
  },
  {
    title: "Settings",
    href: "/dashboard/buyer/settings",
    icon: Settings
  }
]

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin")
    }
    if (!isLoading && isAuthenticated && user?.role !== "buyer") {
      router.push(user?.role === "admin" ? "/admin" : "/dashboard/manufacturer")
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "buyer") {
    return null
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const SidebarContent = () => (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <span className="text-sm font-bold text-secondary-foreground">SN</span>
          </div>
          <span className="font-serif text-lg font-medium text-foreground">SourceNest</span>
        </Link>
        <button 
          className="lg:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="shrink-0 border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {user?.name?.charAt(0) || "B"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || "Buyer"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.company || "Your Company"}</p>
          </div>
          <Badge variant="secondary" className="text-xs">Buyer</Badge>
        </div>
      </div>

      {/* Navigation — scrolls inside sidebar if items exceed viewport */}
      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href, item.exact)
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-border p-4">
        <Button className="w-full gap-2" asChild>
          <Link href="/rfq/new">
            <FileText className="h-4 w-4" />
            Submit New RFQ
          </Link>
        </Button>
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/help" className="flex items-center gap-1 hover:text-foreground">
            <HelpCircle className="h-3 w-3" />
            Help
          </Link>
          <Link href="/suppliers" className="flex items-center gap-1 text-foreground">
            <Globe className="h-3 w-3" />
            Browse Suppliers
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 w-full overflow-hidden bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar: fixed to viewport; main area uses lg:pl-64 so content is not hidden */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col border-r border-border bg-card shadow-lg transition-transform duration-200 ease-in-out lg:z-30 lg:shadow-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main column: only this region scrolls */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:pl-64">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            
            {/* Search */}
            {/*
            <div className="relative hidden min-w-0 flex-1 md:block md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search suppliers, products..."
                className="h-9 w-full min-w-0 rounded-lg border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            */}
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <NotificationsDropdown />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {user?.name?.charAt(0) || "B"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline-block">{user?.name || "Buyer"}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user?.name || "Buyer"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/buyer/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <Globe className="mr-2 h-4 w-4" />
                    View Website
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain p-4 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
