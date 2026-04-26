"use client"

import { useState } from "react"
import Link from "next/link"
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
import { suppliers } from "@/lib/data/suppliers"
import { industries } from "@/lib/data/industries"
import { countries as allCountries, popularManufacturingCountries, exportMarketRegions } from "@/lib/data/countries"
import { SupplierActionButtons } from "@/components/suppliers/supplier-action-buttons"
import { CompareBar } from "@/components/suppliers/compare-bar"
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  Package,
  CheckCircle,
  ChevronRight,
  X,
  Factory
} from "lucide-react"

const reviewLevels = [
  { value: "basic", label: "Basic Reviewed" },
  { value: "standard", label: "Standard Reviewed" },
  { value: "premium", label: "Premium Reviewed" },
  { value: "enterprise", label: "Enterprise Reviewed" },
]

const certifications = [
  { value: "ISO9001", label: "ISO 9001" },
  { value: "ISO14001", label: "ISO 14001" },
  { value: "CE", label: "CE Marking" },
  { value: "BSCI", label: "BSCI" },
  { value: "SEDEX", label: "SEDEX" },
  { value: "ROHS", label: "RoHS" },
  { value: "FDA", label: "FDA Approved" },
]

const moqRanges = [
  { value: "1-100", label: "1-100 units" },
  { value: "100-500", label: "100-500 units" },
  { value: "500-1000", label: "500-1,000 units" },
  { value: "1000-5000", label: "1,000-5,000 units" },
  { value: "5000+", label: "5,000+ units" },
]

// Get popular manufacturing countries for quick filter
const popularCountries = allCountries.filter(c => popularManufacturingCountries.includes(c.code))

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [selectedCertification, setSelectedCertification] = useState<string>("all")
  const [selectedMoq, setSelectedMoq] = useState<string>("all")
  const [selectedExportMarket, setSelectedExportMarket] = useState<string>("all")
  const [reviewedOnly, setReviewedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredSuppliers = suppliers.filter(supplier => {
    if (searchQuery && !supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !supplier.mainProducts.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    if (selectedIndustry && selectedIndustry !== "all" && supplier.industrySlug !== selectedIndustry) {
      return false
    }
    if (selectedCountry && selectedCountry !== "all" && supplier.location.countryCode !== selectedCountry) {
      return false
    }
    if (selectedCertification && selectedCertification !== "all" && 
        !supplier.certifications.some(c => c.toLowerCase().includes(selectedCertification.toLowerCase()))) {
      return false
    }
    if (selectedExportMarket && selectedExportMarket !== "all" &&
        !supplier.exportMarkets.some(m => m.toLowerCase().includes(selectedExportMarket.toLowerCase()))) {
      return false
    }
    if (reviewedOnly && !supplier.reviewed) {
      return false
    }
    return true
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedIndustry("all")
    setSelectedCountry("all")
    setSelectedCertification("all")
    setSelectedMoq("all")
    setSelectedExportMarket("all")
    setReviewedOnly(false)
  }

  const hasActiveFilters = searchQuery || selectedIndustry !== "all" || selectedCountry !== "all" || 
    selectedCertification !== "all" || selectedMoq !== "all" || selectedExportMarket !== "all" || reviewedOnly

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-serif text-3xl font-medium tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                Find Reviewed Suppliers
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                Browse {suppliers.length.toLocaleString()}+ reviewed manufacturers from around the world
              </p>
            </div>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-3xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search suppliers, products, or categories..."
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

                    {/* Country Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground">Country</label>
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="All Countries" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          <SelectItem value="all">All Countries</SelectItem>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Popular</div>
                          {popularCountries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">All Countries</div>
                          {allCountries.filter(c => !popularManufacturingCountries.includes(c.code)).map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Certification Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground">Certification</label>
                      <Select value={selectedCertification} onValueChange={setSelectedCertification}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Any Certification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Certification</SelectItem>
                          {certifications.map((cert) => (
                            <SelectItem key={cert.value} value={cert.value}>
                              {cert.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* MOQ Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground">Minimum Order</label>
                      <Select value={selectedMoq} onValueChange={setSelectedMoq}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Any MOQ" />
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

                    {/* Export Market Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground">Export Market</label>
                      <Select value={selectedExportMarket} onValueChange={setSelectedExportMarket}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Any Region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Region</SelectItem>
                          {exportMarketRegions.map((region) => (
                            <SelectItem key={region} value={region.toLowerCase().replace(" ", "-")}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reviewed Only */}
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="reviewed" 
                        checked={reviewedOnly}
                        onCheckedChange={(checked) => setReviewedOnly(checked as boolean)}
                      />
                      <label htmlFor="reviewed" className="text-sm text-foreground cursor-pointer">
                        Reviewed suppliers only
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
                    <span className="font-medium text-foreground">{filteredSuppliers.length}</span> suppliers found
                  </p>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                      <SelectItem value="response">Fastest Response</SelectItem>
                      <SelectItem value="products">Most Products</SelectItem>
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
                    {selectedCountry !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {allCountries.find(c => c.code === selectedCountry)?.name}
                        <button onClick={() => setSelectedCountry("all")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {reviewedOnly && (
                      <Badge variant="secondary" className="gap-1">
                        Reviewed Only
                        <button onClick={() => setReviewedOnly(false)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Supplier Cards */}
                <div className="space-y-4">
                  {filteredSuppliers.map((supplier) => (
                    <Link
                      key={supplier.id}
                      href={`/suppliers/${supplier.slug}`}
                      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-secondary hover:shadow-md"
                    >
                      <div className="flex flex-col gap-6 sm:flex-row">
                        {/* Logo Placeholder */}
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <Factory className="h-10 w-10 text-muted-foreground" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
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
                            </div>
                            <div className="flex items-center gap-2">
                              <SupplierActionButtons supplier={supplier} variant="icon" />
                              <ChevronRight className="hidden h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 sm:block" />
                            </div>
                          </div>

                          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                            {supplier.shortDescription}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="font-medium text-foreground">{supplier.rating}</span>
                              <span className="text-muted-foreground">({supplier.reviewCount})</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {supplier.responseTime}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Package className="h-4 w-4" />
                              {supplier.productCount.toLocaleString()} products
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {supplier.mainProducts.slice(0, 4).map((product) => (
                              <span 
                                key={product}
                                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                              >
                                {product}
                              </span>
                            ))}
                            {supplier.mainProducts.length > 4 && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                +{supplier.mainProducts.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Empty State */}
                {filteredSuppliers.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border py-16 text-center">
                    <Factory className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 font-semibold text-foreground">No suppliers found</h3>
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
      <CompareBar />
    </div>
  )
}
