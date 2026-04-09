"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Menu, 
  Search, 
  Factory, 
  Package, 
  Grid3X3, 
  Users, 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  HelpCircle,
  Info,
  ChevronDown,
  MessageSquare,
  LayoutDashboard,
  Settings,
  LogOut,
  Scale,
  Globe,
  Heart,
  MapPin,
  Star,
  ExternalLink,
  X,
  type LucideIcon,
} from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"
import { cn } from "@/lib/utils"

interface HeaderNavItemDef {
  title: string
  href: string
  description: string
  icon: LucideIcon
}

const discoverItems: HeaderNavItemDef[] = [
  {
    title: "Browse Industries",
    href: "/industries",
    description: "Find suppliers by industry sector and specialization",
    icon: Grid3X3,
  },
  {
    title: "Browse Suppliers",
    href: "/suppliers",
    description: "Discover reviewed manufacturers from around the world",
    icon: Factory,
  },
  {
    title: "Browse Products",
    href: "/products",
    description: "Explore products across all categories and industries",
    icon: Package,
  },
  {
    title: "Featured Manufacturers",
    href: "/suppliers?featured=true",
    description: "Top-rated reviewed manufacturers on the platform",
    icon: Building2,
  },
  {
    title: "Global Supplier Map",
    href: "/suppliers/map",
    description: "Explore suppliers by country and region",
    icon: Globe,
  },
  {
    title: "Compare Suppliers",
    href: "/suppliers/compare",
    description: "Compare manufacturers side by side",
    icon: Scale,
  },
  {
    title: "New Suppliers",
    href: "/suppliers?sort=newest",
    description: "Recently joined manufacturers on SourceNest",
    icon: Factory,
  },
]

const platformItems: HeaderNavItemDef[] = [
  {
    title: "For Buyers",
    href: "/for-buyers",
    description: "Search, compare, and connect with suppliers for free",
    icon: Users,
  },
  {
    title: "For Manufacturers",
    href: "/for-manufacturers",
    description: "Showcase your factory and reach global buyers",
    icon: Building2,
  },
  {
    title: "Pricing",
    href: "/pricing",
    description: "View subscription plans for manufacturers",
    icon: DollarSign,
  },
]

const resourceItems: HeaderNavItemDef[] = [
  {
    title: "Review",
    href: "/verification",
    description: "Learn how we reviewed and approve suppliers",
    icon: ShieldCheck,
  },
  {
    title: "Help Center",
    href: "/help",
    description: "Get answers to common questions",
    icon: HelpCircle,
  },
  {
    title: "About Us",
    href: "/about",
    description: "Learn about SourceNest and our mission",
    icon: Info,
  },
]

function HeaderNavDropdown({
  label,
  items,
  twoColumn,
}: {
  label: string
  items: HeaderNavItemDef[]
  twoColumn?: boolean
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-1 font-medium">
          {label}
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className={cn(
          "max-h-[min(70vh,520px)] overflow-y-auto p-2",
          twoColumn ? "w-[min(calc(100vw-2rem),560px)]" : "w-[min(calc(100vw-2rem),400px)]",
        )}
      >
        <div className={cn("grid gap-0.5", twoColumn && "sm:grid-cols-2")}>
          {items.map((item) => (
            <DropdownMenuItem key={item.href} asChild className="cursor-pointer p-0 focus:bg-transparent">
              <Link
                href={item.href}
                className="flex w-full items-start gap-3 rounded-md p-3 outline-none hover:bg-muted"
              >
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <div className="min-w-0 text-left">
                  <div className="text-sm font-medium text-foreground">{item.title}</div>
                  <p className="text-xs leading-snug text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { savedSuppliers, savedProducts, removeSupplierFromFavorites, removeProductFromFavorites } = useFavorites()
  
  // Ensure hydration happens only after client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // savedSuppliers and savedProducts already contain full details from context
  const savedSupplierDetails = savedSuppliers.slice(0, 5)
  const savedProductDetails = savedProducts.slice(0, 5)
  
  const totalSaved = savedSuppliers.length + savedProducts.length

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const getDashboardUrl = () => {
    if (!user) return "/auth/signin"
    switch (user.role) {
      case "admin": return "/admin"
      case "manufacturer": return "/dashboard/manufacturer"
      case "buyer": return "/dashboard/buyer"
      default: return "/dashboard/buyer"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 min-w-0 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Factory className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden min-[400px]:block font-serif text-xl font-medium text-foreground">SourceNest</span>
        </Link>

        {/* Desktop navigation: dropdowns (reliable focus/hover vs. NavigationMenu viewport) */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          <HeaderNavDropdown label="Discover" items={discoverItems} twoColumn />
          <HeaderNavDropdown label="Platform" items={platformItems} />
          <HeaderNavDropdown label="Resources" items={resourceItems} />
          <Button variant="ghost" asChild className="font-medium">
            <Link href="/blog">Insights</Link>
          </Button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex" suppressHydrationWarning>
          <Button variant="ghost" size="icon" aria-label="Search" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          
          {/* Favorites Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Saved Items" className="relative">
                <Heart className={cn("h-5 w-5", totalSaved > 0 && "text-rose-500")} />
                {totalSaved > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white">
                    {totalSaved > 9 ? "9+" : totalSaved}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <Tabs defaultValue="suppliers" className="w-full">
                <div className="border-b px-3 pt-3 pb-2">
                  <TabsList className="grid w-full grid-cols-2 h-9">
                    <TabsTrigger value="suppliers" className="gap-1.5 text-xs">
                      <Factory className="h-3.5 w-3.5" />
                      Suppliers ({savedSuppliers.length})
                    </TabsTrigger>
                    <TabsTrigger value="products" className="gap-1.5 text-xs">
                      <Package className="h-3.5 w-3.5" />
                      Products ({savedProducts.length})
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Saved Suppliers Tab */}
                <TabsContent value="suppliers" className="mt-0">
                  {savedSupplierDetails.length === 0 ? (
                    <div className="px-3 py-6 text-center">
                      <Factory className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">No saved suppliers yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Click the heart icon on any supplier to save them
                      </p>
                      <Button variant="outline" size="sm" className="mt-3" asChild>
                        <Link href="/suppliers">Browse Suppliers</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="max-h-70 overflow-y-auto">
                      {savedSupplierDetails.map((supplier) => (
                        <div key={supplier.id} className="group relative">
                          <DropdownMenuItem asChild className="cursor-pointer p-0 rounded-none">
                            <Link href={`/suppliers/${supplier.slug}`} className="flex items-start gap-3 p-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Factory className="h-5 w-5 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">{supplier.name}</p>
                                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {supplier.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    {supplier.rating}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              removeSupplierFromFavorites(supplier.id)
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 opacity-0 hover:bg-muted group-hover:opacity-100"
                            aria-label="Remove from favorites"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                      {savedSuppliers.length > 5 && (
                        <div className="px-3 py-2 text-center text-xs text-muted-foreground border-t">
                          +{savedSuppliers.length - 5} more suppliers
                        </div>
                      )}
                    </div>
                  )}
                  <div className="border-t p-2">
                    <Button variant="ghost" size="sm" className="w-full justify-center gap-2 text-primary" asChild>
                      <Link href="/dashboard/buyer/saved">
                        View All Saved Suppliers
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Saved Products Tab */}
                <TabsContent value="products" className="mt-0">
                  {savedProductDetails.length === 0 ? (
                    <div className="px-3 py-6 text-center">
                      <Package className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">No saved products yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Click the heart icon on any product to save it
                      </p>
                      <Button variant="outline" size="sm" className="mt-3" asChild>
                        <Link href="/products">Browse Products</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="max-h-70 overflow-y-auto">
                      {savedProductDetails.map((product) => (
                        <div key={product.id} className="group relative">
                          <DropdownMenuItem asChild className="cursor-pointer p-0 rounded-none">
                            <Link href={`/products/${product.slug}`} className="flex items-start gap-3 p-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                                <Package className="h-5 w-5 text-secondary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                                  {product.supplier}
                                </p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              removeProductFromFavorites(product.id)
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 opacity-0 hover:bg-muted group-hover:opacity-100"
                            aria-label="Remove from favorites"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                      {savedProducts.length > 5 && (
                        <div className="px-3 py-2 text-center text-xs text-muted-foreground border-t">
                          +{savedProducts.length - 5} more products
                        </div>
                      )}
                    </div>
                  )}
                  <div className="border-t p-2">
                    <Button variant="ghost" size="sm" className="w-full justify-center gap-2 text-primary" asChild>
                      <Link href="/dashboard/buyer/saved">
                        View All Saved Products
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" aria-label="Messages" className="relative" asChild>
            <Link href="/messages">
              <MessageSquare className="h-5 w-5" />
              {/* Unread indicator */}
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary" />
            </Link>
          </Button>
          {mounted && isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-25 truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardUrl()} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${getDashboardUrl()}/settings`} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden" suppressHydrationWarning>
          <Button variant="ghost" size="icon" aria-label="Saved Items" className="relative" asChild>
            <Link href="/dashboard/buyer/saved">
              <Heart className={cn("h-5 w-5", totalSaved > 0 && "text-rose-500")} />
              {totalSaved > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white">
                  {totalSaved > 9 ? "9+" : totalSaved}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Messages" className="relative" asChild>
            <Link href="/messages">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Search" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Factory className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-serif">SourceNest</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {/* Discover Section */}
                <button
                  onClick={() => toggleSection('discover')}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  Discover
                  <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSection === 'discover' && "rotate-180")} />
                </button>
                {expandedSection === 'discover' && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                    {discoverItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Platform Section */}
                <button
                  onClick={() => toggleSection('platform')}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  Platform
                  <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSection === 'platform' && "rotate-180")} />
                </button>
                {expandedSection === 'platform' && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                    {platformItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Resources Section */}
                <button
                  onClick={() => toggleSection('resources')}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  Resources
                  <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSection === 'resources' && "rotate-180")} />
                </button>
                {expandedSection === 'resources' && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                    {resourceItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Direct Links */}
                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  Insights
                </Link>

                <div className="my-4 border-t border-border" />

                {/* Auth Actions */}
                {mounted && (isAuthenticated && user) ? (
                  <>
                    <div className="mb-2 flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href={getDashboardUrl()}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href={`${getDashboardUrl()}/settings`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMobileOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Sign In
                    </Link>
                    <Button className="mt-2 w-full" asChild>
                      <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
