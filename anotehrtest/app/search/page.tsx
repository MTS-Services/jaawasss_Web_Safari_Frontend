"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products, searchProducts } from "@/lib/data/products"
import { suppliers, searchSuppliers } from "@/lib/data/suppliers"
import { industries } from "@/lib/data/industries"
import { 
  Search, 
  Package,
  Factory,
  Layers,
  CheckCircle,
  Star,
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("all")

  const filteredProducts = searchQuery ? searchProducts(searchQuery) : products.slice(0, 6)
  const filteredSuppliers = searchQuery ? searchSuppliers(searchQuery) : suppliers.slice(0, 4)
  const filteredIndustries = searchQuery 
    ? industries.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : industries.slice(0, 4)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "")
  }, [searchParams])

  const totalResults = filteredProducts.length + filteredSuppliers.length + filteredIndustries.length

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Search Header */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-center font-serif text-3xl font-medium text-primary-foreground sm:text-4xl">
              Search SourceNest
            </h1>
            <form onSubmit={handleSearch} className="mt-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products, suppliers, industries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 bg-background pl-12 text-base"
                  />
                </div>
                <Button 
                  type="submit"
                  size="lg"
                  variant="secondary" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {searchQuery && (
              <p className="mb-6 text-muted-foreground">
                <span className="font-medium text-foreground">{totalResults}</span> results for 
                <span className="font-medium text-foreground"> "{searchQuery}"</span>
              </p>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="products">Products ({filteredProducts.length})</TabsTrigger>
                <TabsTrigger value="suppliers">Suppliers ({filteredSuppliers.length})</TabsTrigger>
                <TabsTrigger value="industries">Industries ({filteredIndustries.length})</TabsTrigger>
              </TabsList>

              {/* All Results Tab */}
              <TabsContent value="all" className="space-y-10">
                {/* Products Section */}
                {filteredProducts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="flex items-center gap-2 font-semibold text-lg text-foreground">
                        <Package className="h-5 w-5" />
                        Products
                      </h2>
                      <Button variant="ghost" className="gap-1 text-secondary" asChild>
                        <Link href={`/products?search=${searchQuery}`}>
                          View all
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredProducts.slice(0, 3).map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="group rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                              <Package className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground group-hover:text-secondary line-clamp-2">
                                {product.name}
                              </h3>
                              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                {product.supplierName}
                              </p>
                              {product.price && (
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                  ${product.price.min} - ${product.price.max}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suppliers Section */}
                {filteredSuppliers.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="flex items-center gap-2 font-semibold text-lg text-foreground">
                        <Factory className="h-5 w-5" />
                        Suppliers
                      </h2>
                      <Button variant="ghost" className="gap-1 text-secondary" asChild>
                        <Link href={`/suppliers?search=${searchQuery}`}>
                          View all
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="mt-4 space-y-4">
                      {filteredSuppliers.slice(0, 2).map((supplier) => (
                        <Link
                          key={supplier.id}
                          href={`/suppliers/${supplier.slug}`}
                          className="group block rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                              <Factory className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-foreground group-hover:text-secondary">
                                  {supplier.name}
                                </h3>
                                {supplier.reviewed && (
                                  <Badge variant="secondary" className="text-xs">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Reviewed
                                  </Badge>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {supplier.location.city}, {supplier.location.country} • {supplier.industry}
                              </p>
                              <div className="mt-2 flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  {supplier.rating}
                                </span>
                                <span className="text-muted-foreground">
                                  {supplier.productCount} products
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Industries Section */}
                {filteredIndustries.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="flex items-center gap-2 font-semibold text-lg text-foreground">
                        <Layers className="h-5 w-5" />
                        Industries
                      </h2>
                      <Button variant="ghost" className="gap-1 text-secondary" asChild>
                        <Link href="/industries">
                          View all
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      {filteredIndustries.slice(0, 4).map((industry) => (
                        <Link
                          key={industry.id}
                          href={`/industries/${industry.slug}`}
                          className="rounded-lg border border-border bg-card px-4 py-3 transition-all hover:border-secondary hover:shadow-sm"
                        >
                          <span className="font-medium text-foreground">{industry.name}</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {industry.supplierCount.toLocaleString()} suppliers
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-md"
                    >
                      <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-secondary line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{product.supplierName}</p>
                        {product.price && (
                          <p className="mt-2 font-semibold text-foreground">
                            ${product.price.min} - ${product.price.max} / {product.price.unit}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">No products found</p>
                  </div>
                )}
              </TabsContent>

              {/* Suppliers Tab */}
              <TabsContent value="suppliers">
                <div className="space-y-4">
                  {filteredSuppliers.map((supplier) => (
                    <Link
                      key={supplier.id}
                      href={`/suppliers/${supplier.slug}`}
                      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                          <Factory className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground group-hover:text-secondary">
                              {supplier.name}
                            </h3>
                            {supplier.reviewed && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Reviewed
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {supplier.location.city}, {supplier.location.country}
                            </span>
                            <span>{supplier.industry}</span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {supplier.shortDescription}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              {supplier.rating}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {supplier.responseTime}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Package className="h-4 w-4" />
                              {supplier.productCount} products
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {filteredSuppliers.length === 0 && (
                  <div className="py-12 text-center">
                    <Factory className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">No suppliers found</p>
                  </div>
                )}
              </TabsContent>

              {/* Industries Tab */}
              <TabsContent value="industries">
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredIndustries.map((industry) => (
                    <Link
                      key={industry.id}
                      href={`/industries/${industry.slug}`}
                      className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
                    >
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-secondary">
                        {industry.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {industry.description}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-sm">
                        <span className="font-medium text-foreground">
                          {industry.supplierCount.toLocaleString()} suppliers
                        </span>
                        <span className="text-muted-foreground">
                          {industry.productCount.toLocaleString()} products
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                {filteredIndustries.length === 0 && (
                  <div className="py-12 text-center">
                    <Layers className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">No industries found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
