"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { products } from "@/lib/data/products"
import { industries } from "@/lib/data/industries"
import { ProductActionButtons } from "@/components/products/product-action-buttons"
import { 
  Search, 
  Filter, 
  Package,
  ChevronRight,
  X,
  Factory,
  CheckCircle
} from "lucide-react"

export default function ProductsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [sampleAvailable, setSampleAvailable] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedIndustry && selectedIndustry !== "all" && product.industrySlug !== selectedIndustry) {
      return false
    }
    if (sampleAvailable && !product.sampleAvailable) {
      return false
    }
    return true
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedIndustry("all")
    setSampleAvailable(false)
  }

  const hasActiveFilters = searchQuery || selectedIndustry !== "all" || sampleAvailable

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
              <aside className={`w-full lg:w-64 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
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
                    {/* Industry Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground">Industry</label>
                      <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="All Industries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Industries</SelectItem>
                          {industries.map((industry) => (
                            <SelectItem key={industry.slug} value={industry.slug}>
                              {industry.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sample Available */}
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="sample" 
                        checked={sampleAvailable}
                        onCheckedChange={(checked) => setSampleAvailable(checked as boolean)}
                      />
                      <label htmlFor="sample" className="text-sm text-foreground cursor-pointer">
                        Sample available
                      </label>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{filteredProducts.length}</span> products found
                  </p>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="moq-low">Lowest MOQ</SelectItem>
                    </SelectContent>
                  </Select>
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
                    {selectedIndustry !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {industries.find(i => i.slug === selectedIndustry)?.name}
                        <button onClick={() => setSelectedIndustry("all")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {sampleAvailable && (
                      <Badge variant="secondary" className="gap-1">
                        Sample Available
                        <button onClick={() => setSampleAvailable(false)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Product Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => router.push(`/products/${product.slug}`)}
                      className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-[4/3] bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                        <Badge className="absolute left-3 top-3">{product.category}</Badge>
                        <div className="absolute right-3 top-3 flex items-center gap-2">
                          {product.sampleAvailable && (
                            <Badge variant="secondary" className="text-xs">
                              Sample
                            </Badge>
                          )}
                          <ProductActionButtons product={product} variant="icon" />
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-secondary line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <Link 
                          href={`/suppliers/${product.supplierSlug}`}
                          className="mt-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Factory className="h-3 w-3" />
                          {product.supplierName}
                          <CheckCircle className="h-3 w-3 text-secondary" />
                        </Link>

                        {product.price && (
                          <div className="mt-3">
                            <span className="text-lg font-semibold text-foreground">
                              ${product.price.min.toFixed(2)} - ${product.price.max.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground"> / {product.price.unit}</span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                          <span>MOQ: {product.moq} {product.moqUnit}</span>
                          <span>{product.leadTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
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
