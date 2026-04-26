"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getProducts, type Product } from "@/lib/api/products"
import { ProductActionButtons } from "@/components/products/product-action-buttons"
import { 
  Search, 
  Filter, 
  Package,
  ChevronRight,
  X,
  Factory,
  CheckCircle,
  Loader2
} from "lucide-react"

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [showFilters, setShowFilters] = useState(false)

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Map<string, string>()
    products.forEach(p => {
      cats.set(p.category.slug, p.category.name)
    })
    return Array.from(cats.entries()).map(([slug, name]) => ({ slug, name }))
  }, [products])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      
      const response = await getProducts(1, {})
      
      if (response.success) {
        setProducts(response.data)
      } else {
        setError(response.message || "Failed to load products")
        setProducts([])
      }
      
      setLoading(false)
    }

    fetchProducts()
  }, [])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.name.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category.slug === selectedCategory)
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => {
          const priceA = parseFloat(a.pricing_quantities.min_price.price.amount)
          const priceB = parseFloat(b.pricing_quantities.min_price.price.amount)
          return priceA - priceB
        })
        break
      case "price-high":
        result.sort((a, b) => {
          const priceA = parseFloat(a.pricing_quantities.max_price.price.amount)
          const priceB = parseFloat(b.pricing_quantities.max_price.price.amount)
          return priceB - priceA
        })
        break
      case "moq-low":
        result.sort((a, b) =>
          a.pricing_quantities.minimum_order_quantity - b.pricing_quantities.minimum_order_quantity
        )
        break
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "popularity":
        result.sort((a, b) => b.inquiry_count - a.inquiry_count)
        break
      default:
        // Relevance: by inquiry count
        result.sort((a, b) => b.inquiry_count - a.inquiry_count)
    }

    return result
  }, [products, searchQuery, selectedCategory, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("relevance")
  }

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || sortBy !== "relevance"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-serif text-3xl font-medium tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                Discover Products
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                Browse {products.length.toLocaleString()}+ products from reviewed manufacturers worldwide
              </p>
            </div>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-3xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 bg-background pl-12 text-base"
                  />
                </div>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Filters Sidebar */}
              <aside className={`w-full lg:w-64 lg:shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Filters</h2>
                    {hasActiveFilters && (
                      <button 
                        onClick={clearFilters}
                        className="text-sm text-secondary hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="mt-6 space-y-6">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.slug} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="text-sm font-medium text-foreground">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="moq-low">Lowest MOQ</SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="popularity">Most Popular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{filteredAndSortedProducts.length}</span> products found
                  </p>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        Search: {searchQuery}
                        <button onClick={() => setSearchQuery("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {categories.find(c => c.slug === selectedCategory)?.name}
                        <button onClick={() => setSelectedCategory("all")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {sortBy !== "relevance" && (
                      <Badge variant="secondary" className="gap-1">
                        Sort: {sortBy}
                        <button onClick={() => setSortBy("relevance")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                    <p className="font-semibold">Error loading products</p>
                    <p className="mt-1">{error}</p>
                  </div>
                )}

                {/* Product Cards */}
                {!loading && !error && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
                      >
                        {/* Product Image */}
                        <div className="relative aspect-4/3 bg-muted">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                          <Badge className="absolute left-3 top-3">{product.category.name}</Badge>
                          {product.is_approved && (
                            <Badge className="absolute right-3 top-3 bg-green-500/20 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-foreground group-hover:text-secondary line-clamp-2">
                            {product.name}
                          </h3>
                          
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>

                          <div className="mt-3">
                            <span className="text-lg font-semibold text-foreground">
                              ${parseFloat(product.pricing_quantities.min_price.price.amount).toFixed(2)} - ${parseFloat(product.pricing_quantities.max_price.price.amount).toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground"> / {product.pricing_quantities.unit}</span>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                            <span>MOQ: {product.pricing_quantities.minimum_order_quantity}</span>
                            <span>{product.pricing_quantities.lead_time} days</span>
                          </div>

                          {product.inquiry_count > 0 && (
                            <div className="mt-2 text-xs text-amber-600">
                              ⭐ {product.inquiry_count} inquiries
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredAndSortedProducts.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border py-16 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 font-semibold text-foreground">No products found</h3>
                    <p className="mt-2 text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
