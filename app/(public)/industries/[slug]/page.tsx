"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { industries, getIndustryBySlug } from "@/lib/data/industries"
import { suppliers } from "@/lib/data/suppliers"
import { products } from "@/lib/data/products"
import { countries as countryData } from "@/lib/data/countries"
import { getPublicCategories, type BackendCategory } from "@/lib/api/categories"
import { 
  ArrowRight, 
  Cpu, 
  Cog, 
  Shirt, 
  Home, 
  Heart, 
  Car, 
  UtensilsCrossed, 
  FlaskConical,
  Factory,
  Package,
  ChevronRight,
  Star,
  CheckCircle,
  MapPin,
  Filter,
  Globe,
  ShieldCheck,
  Search,
  X,
  Lightbulb,
  Wrench,
  HardHat,
  Sofa,
  Stethoscope,
  Wheat,
  Box,
  FileText,
  ShoppingBag
} from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="h-10 w-10" />,
  Cog: <Cog className="h-10 w-10" />,
  Shirt: <Shirt className="h-10 w-10" />,
  Home: <Home className="h-10 w-10" />,
  Heart: <Heart className="h-10 w-10" />,
  Car: <Car className="h-10 w-10" />,
  UtensilsCrossed: <UtensilsCrossed className="h-10 w-10" />,
  FlaskConical: <FlaskConical className="h-10 w-10" />,
  Package: <Package className="h-10 w-10" />,
  Lightbulb: <Lightbulb className="h-10 w-10" />,
  Wrench: <Wrench className="h-10 w-10" />,
  HardHat: <HardHat className="h-10 w-10" />,
  Sofa: <Sofa className="h-10 w-10" />,
  Stethoscope: <Stethoscope className="h-10 w-10" />,
  Wheat: <Wheat className="h-10 w-10" />,
  Box: <Box className="h-10 w-10" />,
  FileText: <FileText className="h-10 w-10" />,
  Factory: <Factory className="h-10 w-10" />,
  ShoppingBag: <ShoppingBag className="h-10 w-10" />,
}

const certifications = [
  "ISO 9001",
  "ISO 14001", 
  "CE Certified",
  "FDA Approved",
  "BSCI",
  "SA8000"
]

const moqRanges = [
  { label: "Under 100 units", value: "0-100" },
  { label: "100-500 units", value: "100-500" },
  { label: "500-1000 units", value: "500-1000" },
  { label: "1000+ units", value: "1000+" },
]

export default function IndustryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [publicCategories, setPublicCategories] = useState<BackendCategory[]>([])
  const [publicCategoriesLoaded, setPublicCategoriesLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadPublicCategories = async () => {
      const response = await getPublicCategories()
      if (!mounted) return
      if (response.success) {
        setPublicCategories(response.data)
      }
      setPublicCategoriesLoaded(true)
    }

    void loadPublicCategories()

    return () => {
      mounted = false
    }
  }, [])

  const backendCurrentCategory = useMemo(
    () => publicCategories.find((category) => category.slug === slug),
    [publicCategories, slug]
  )

  const industry = useMemo(() => {
    if (backendCurrentCategory) {
      const backendSubcategories = backendCurrentCategory.sub_categories?.length
        ? backendCurrentCategory.sub_categories
        : backendCurrentCategory.subcategories || []

      return {
        id: String(backendCurrentCategory.id),
        name: backendCurrentCategory.name,
        slug: backendCurrentCategory.slug || slug,
        description: backendCurrentCategory.description || "",
        icon: "Package",
        supplierCount: backendCurrentCategory.supplier_count || 0,
        productCount: backendCurrentCategory.product_count || 0,
        categories: [
          {
            id: `${backendCurrentCategory.id}-subs`,
            name: "Subcategories",
            slug: "subcategories",
            description: "",
            productCount: 0,
            subcategories: backendSubcategories.map((sub) => sub.name),
          },
        ],
      }
    }

    return getIndustryBySlug(slug)
  }, [backendCurrentCategory, slug])

  // Filter states
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedMoq, setSelectedMoq] = useState<string>("")
  const [selectedCerts, setSelectedCerts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Get featured countries for this industry
  const featuredCountries = useMemo(() => {
    const featured = countryData.filter(c => c.featured)
    if (featured.length > 0) {
      return featured.slice(0, 8)
    }
    // Fallback to popular manufacturing countries if no featured ones
    return countryData
      .filter(c => ["CN", "IN", "VN", "TH", "TR", "DE", "ID", "BD"].includes(c.code))
      .slice(0, 8)
  }, [])

  // Filter suppliers based on criteria
  const filteredSuppliers = useMemo(() => {
    let result = [...suppliers]
    
    if (selectedCountry) {
      result = result.filter(s => 
        s.location.country.toLowerCase() === selectedCountry.toLowerCase()
      )
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
      )
    }
    
    return result.slice(0, 6)
  }, [selectedCountry, searchQuery])

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products]
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    }
    
    return result.slice(0, 8)
  }, [searchQuery])

  const clearFilters = () => {
    setSelectedCountry("")
    setSelectedMoq("")
    setSelectedCerts([])
    setSearchQuery("")
  }

  const hasActiveFilters = selectedCountry || selectedMoq || selectedCerts.length > 0 || searchQuery
  const mainCategories = useMemo(() => {
    if (publicCategoriesLoaded && publicCategories.length > 0) {
      const featured = publicCategories.filter((category) => Boolean(category.featured))
      const source = featured.length > 0 ? featured : publicCategories
      return source.slice(0, 8).map((category) => ({
        id: String(category.id),
        slug: category.slug || "",
        name: category.name,
        icon: "Package",
      }))
    }

    return industries.filter((ind) => ind.featured).slice(0, 8).map((ind) => ({
      id: String(ind.id),
      slug: ind.slug,
      name: ind.name,
      icon: ind.icon,
    }))
  }, [publicCategories, publicCategoriesLoaded])

  if (!industry) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Industry Not Found</h1>
            <p className="mt-2 text-muted-foreground">The industry you are looking for does not exist.</p>
            <Button className="mt-4" asChild>
              <Link href="/industries">Browse All Industries</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link href="/industries" className="text-muted-foreground hover:text-foreground">
                Industries
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{industry.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-primary py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/10 text-primary-foreground">
                  {iconMap[industry.icon] || <Factory className="h-10 w-10" />}
                </div>
                <div>
                  <h1 className="font-serif text-3xl font-medium tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                    {industry.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-lg text-primary-foreground/80">
                    {industry.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="secondary" className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
                  <Link href={`/suppliers?industry=${industry.slug}`}>
                    View All Suppliers
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="rounded-xl bg-primary-foreground/10 p-4 text-center">
                <div className="text-3xl font-bold text-primary-foreground">{industry.supplierCount.toLocaleString()}</div>
                <div className="mt-1 text-sm text-primary-foreground/70">Reviewed Suppliers</div>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 text-center">
                <div className="text-3xl font-bold text-primary-foreground">{industry.productCount.toLocaleString()}</div>
                <div className="mt-1 text-sm text-primary-foreground/70">Products</div>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 text-center">
                <div className="text-3xl font-bold text-primary-foreground">{industry.categories.length}</div>
                <div className="mt-1 text-sm text-primary-foreground/70">Categories</div>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-4 text-center">
                <div className="text-3xl font-bold text-primary-foreground">45+</div>
                <div className="mt-1 text-sm text-primary-foreground/70">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories & Quick Filters Section */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-4">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Search */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                      <Search className="h-4 w-4" />
                      Search
                    </h3>
                    <div className="mt-3">
                      <Input
                        placeholder="Search suppliers or products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <Filter className="h-4 w-4" />
                        Quick Filters
                      </h3>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                          Clear
                        </button>
                      )}
                    </div>
                    
                    {/* Country Filter */}
                    <div className="mt-5">
                      <h4 className="text-sm font-medium text-foreground">Country</h4>
                      <Select 
                        value={selectedCountry || "all"} 
                        onValueChange={(val) => setSelectedCountry(val === "all" ? "" : val)}
                      >
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Countries</SelectItem>
                          {featuredCountries.map((country) => (
                            <SelectItem key={country.code} value={country.name.toLowerCase()}>
                              {country.flag || ""} {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["China", "India", "Vietnam", "Turkey", "Germany"].map((country) => (
                          <button
                            key={country}
                            onClick={() => setSelectedCountry(country.toLowerCase())}
                            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors ${
                              selectedCountry === country.toLowerCase()
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-secondary/20"
                            }`}
                          >
                            <MapPin className="h-3 w-3" />
                            {country}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* MOQ Range */}
                    <div className="mt-5 border-t border-border pt-5">
                      <h4 className="text-sm font-medium text-foreground">Minimum Order</h4>
                      <Select 
                        value={selectedMoq || "all"} 
                        onValueChange={(val) => setSelectedMoq(val === "all" ? "" : val)}
                      >
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue placeholder="Select MOQ range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any MOQ</SelectItem>
                          {moqRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Certifications */}
                    <div className="mt-5 border-t border-border pt-5">
                      <h4 className="text-sm font-medium text-foreground">Certifications</h4>
                      <div className="mt-3 space-y-2">
                        {certifications.map((cert) => (
                          <label
                            key={cert}
                            className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                          >
                            <Checkbox
                              checked={selectedCerts.includes(cert)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCerts([...selectedCerts, cert])
                                } else {
                                  setSelectedCerts(selectedCerts.filter(c => c !== cert))
                                }
                              }}
                            />
                            <ShieldCheck className="h-3 w-3" />
                            {cert}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Export Markets */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                      <Globe className="h-4 w-4" />
                      Export Markets
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["North America", "Europe", "Asia", "Middle East", "Africa"].map((market) => (
                        <Link
                          key={market}
                          href={`/suppliers?industry=${industry.slug}&market=${market.replace(/\s+/g, '-').toLowerCase()}`}
                        >
                          <Badge variant="outline" className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground">
                            {market}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="lg:col-span-3">
                <div className="mb-10">
                  <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                    Main Categories
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Browse the same 8 main categories in a simplified view.
                  </p>
                </div>

                <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {mainCategories.map((mainCategory) => (
                    <Link
                      key={mainCategory.id}
                      href={`/industries/${mainCategory.slug}`}
                      className={`group rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40 ${
                        mainCategory.slug === industry.slug
                          ? "border-foreground/40"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground [&>svg]:h-5 [&>svg]:w-5">
                          {iconMap[mainCategory.icon] || <Factory className="h-5 w-5" />}
                        </div>
                        <span className="text-sm font-medium text-foreground">{mainCategory.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mb-8">
                  <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                    Subcategories
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Text-only subcategory listing for {industry.name}.
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  {industry.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="block border-b border-border p-5 transition-colors last:border-b-0 hover:bg-muted/40"
                    >
                      <h3 className="text-sm font-semibold text-foreground">
                        {category.name}
                      </h3>
                      {category.subcategories && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {category.subcategories.join(", ")}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Suppliers Section */}
        <section className="border-t border-border bg-muted/50 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                  Top Suppliers in {industry.name}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Reviewed manufacturers with excellent ratings
                </p>
              </div>
              <Button variant="outline" className="hidden gap-2 sm:flex" asChild>
                <Link href={`/suppliers?industry=${industry.slug}`}>
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSuppliers.map((supplier) => (
                <Link
                  key={supplier.id}
                  href={`/suppliers/${supplier.slug}`}
                  className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                      <Factory className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground group-hover:text-secondary line-clamp-1">
                          {supplier.name}
                        </h3>
                        {supplier.reviewed && (
                          <CheckCircle className="h-4 w-4 shrink-0 text-secondary" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {supplier.location.city}, {supplier.location.country}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-foreground">{new Date().getFullYear() - supplier.yearEstablished}+ yrs</div>
                      <div className="text-xs text-muted-foreground">Experience</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{supplier.onTimeDelivery}%</div>
                      <div className="text-xs text-muted-foreground">On-time</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 font-semibold text-foreground">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {supplier.rating}
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" className="gap-2" asChild>
                <Link href={`/suppliers?industry=${industry.slug}`}>
                  View All Suppliers
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                  Popular Products
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Top-rated products in {industry.name}
                </p>
              </div>
              <Button variant="outline" className="hidden gap-2 sm:flex" asChild>
                <Link href={`/products?industry=${industry.slug}`}>
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
                >
                  <div className="aspect-square bg-muted p-4">
                    <div className="flex h-full items-center justify-center rounded-lg bg-background">
                      <Package className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-secondary line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold text-secondary">
                        {product.price
                          ? `$${product.price.min.toFixed(2)} - $${product.price.max.toFixed(2)}`
                          : "Price on request"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        MOQ: {product.moq}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" className="gap-2" asChild>
                <Link href={`/products?industry=${industry.slug}`}>
                  View All Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Related Industries */}
        <section className="border-t border-border bg-muted/50 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
              Related Industries
            </h2>
            <div className="mt-8 flex flex-wrap gap-4">
              {industries
                .filter((ind) => ind.slug !== industry.slug)
                .slice(0, 6)
                .map((ind) => (
                  <Link
                    key={ind.id}
                    href={`/industries/${ind.slug}`}
                    className="rounded-lg border border-border bg-card px-4 py-3 transition-all hover:border-secondary hover:shadow-sm"
                  >
                    <span className="font-medium text-foreground">{ind.name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {ind.supplierCount.toLocaleString()} suppliers
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-2xl font-medium text-primary-foreground sm:text-3xl">
              Ready to Source from {industry.name}?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
              Connect with reviewed suppliers and start your sourcing journey today.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
                <Link href="/rfq/new">
                  Submit RFQ
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href={`/suppliers?industry=${industry.slug}`}>
                  Browse Suppliers
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
