"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  serviceCategories,
  serviceProviders,
  availabilityOptions,
  serviceLanguages,
  priceRanges,
  getFeaturedServiceProviders,
} from "@/lib/data/service-providers"
import { countries as allCountries } from "@/lib/data/countries"
import { ServiceProviderCard } from "@/components/service-providers/service-provider-card"
import { ServiceMatch } from "@/components/service-providers/service-match"
import { Search, Filter, X, Sparkles, ArrowRight, ShieldCheck, Globe2, LayoutGrid, Inbox } from "lucide-react"

function priceBucket(price?: string): string {
  if (!price || price === "Price upon request") return "upon-request"
  const num = Number(price.replace(/[^0-9.]/g, ""))
  if (num < 100) return "under-100"
  if (num < 300) return "100-300"
  if (num <= 500) return "300-500"
  return "500-plus"
}

const exampleSearches = [
  "Packaging Designer",
  "Freight Forwarder",
  "Customs Broker",
  "Quality Inspector",
  "Translator",
]

const availabilityQuickFilters: { value: string; label: string }[] = [
  { value: "all", label: "All Services" },
  { value: "local", label: "Local Services" },
  { value: "remote", label: "Remote Services" },
  { value: "local-remote", label: "Local + Remote" },
]

export default function ServiceProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedAvailability, setSelectedAvailability] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedPrice, setSelectedPrice] = useState("all")
  const [selectedDelivery, setSelectedDelivery] = useState("all")
  const [portfolioOnly, setPortfolioOnly] = useState(false)
  const [reviewedOnly, setReviewedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const usedCountryCodes = useMemo(
    () => Array.from(new Set(serviceProviders.map((p) => p.location.countryCode))),
    [],
  )
  const filterCountries = allCountries.filter((c) => usedCountryCodes.includes(c.code))

  const featured = getFeaturedServiceProviders()

  // Top-level marketplace stats
  const stats = useMemo(() => {
    const reviewedCount = serviceProviders.filter((p) => p.reviewed).length
    const countryCount = new Set(serviceProviders.map((p) => p.location.countryCode)).size
    return [
      { icon: ShieldCheck, value: `${reviewedCount}+`, label: "Reviewed Service Providers" },
      { icon: Globe2, value: `${countryCount}+`, label: "Countries Covered" },
      { icon: LayoutGrid, value: `${serviceCategories.length}`, label: "Service Categories" },
      { icon: Inbox, value: "1,200+", label: "Active Service Requests" },
    ]
  }, [])

  const scrollToResults = () => {
    document.getElementById("providers-results")?.scrollIntoView({ behavior: "smooth" })
  }

  const selectCategoryAndScroll = (slug: string) => {
    setSelectedCategory(slug)
    setTimeout(scrollToResults, 50)
  }

  const filtered = serviceProviders.filter((p) => {
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.servicesOffered.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false
    }
    if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) return false
    if (selectedCountry !== "all" && p.location.countryCode !== selectedCountry) return false
    if (selectedAvailability !== "all" && p.availability !== selectedAvailability) return false
    if (selectedLanguage !== "all" && !p.languages.includes(selectedLanguage)) return false
    if (selectedPrice !== "all" && priceBucket(p.startingPrice) !== selectedPrice) return false
    if (selectedDelivery !== "all") {
      const fast = p.deliveryTime.match(/\d+/)
      if (selectedDelivery === "fast" && !(fast && Number(fast[0]) <= 7)) return false
    }
    if (portfolioOnly && p.portfolio.length === 0) return false
    if (reviewedOnly && !p.reviewed) return false
    return true
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedCountry("all")
    setSelectedAvailability("all")
    setSelectedLanguage("all")
    setSelectedPrice("all")
    setSelectedDelivery("all")
    setPortfolioOnly(false)
    setReviewedOnly(false)
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedCountry !== "all" ||
    selectedAvailability !== "all" ||
    selectedLanguage !== "all" ||
    selectedPrice !== "all" ||
    selectedDelivery !== "all" ||
    portfolioOnly ||
    reviewedOnly

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 gap-1 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/15">
                <Sparkles className="h-3 w-3" />
                The SourceNest Services Marketplace
              </Badge>
              <h1 className="text-balance font-serif text-3xl font-medium tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                Everything You Need Beyond the Factory
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-primary-foreground/80">
                Find trusted professionals for logistics, customs, inspections, compliance, design, documentation, and
                sourcing support — all in one place.
              </p>
            </div>

            {/* Main Search */}
            <div className="mx-auto mt-8 max-w-3xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for packaging designers, freight forwarders, customs brokers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 bg-background pl-12 text-base"
                    aria-label="Search service providers"
                  />
                </div>
                <Button
                  size="lg"
                  className="hidden gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:inline-flex"
                  onClick={scrollToResults}
                >
                  Search
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                  aria-label="Toggle filters"
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </div>

              {/* Example searches */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-primary-foreground/70">Try:</span>
                {exampleSearches.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setSearchQuery(ex)
                      scrollToResults()
                    }}
                    className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground/20"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Availability quick filters */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {availabilityQuickFilters.map((opt) => {
                  const active = selectedAvailability === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSelectedAvailability(opt.value)
                        scrollToResults()
                      }}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary-foreground text-primary"
                          : "border border-primary-foreground/25 text-primary-foreground/90 hover:bg-primary-foreground/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                    <stat.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-serif text-2xl font-medium text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="bg-muted/30 py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-secondary" />
                    <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                      Featured service providers
                    </h2>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    Hand-picked, reviewed professionals trusted by importers worldwide.
                  </p>
                </div>
                <Button variant="outline" className="bg-transparent" onClick={scrollToResults}>
                  View all providers
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((provider) => (
                  <ServiceProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Service Request Assistant + AI Service Match */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                Not sure who you need?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Describe your project or pick a service area, and we&apos;ll match you with the right experts.
              </p>
            </div>
            <div className="mt-8">
              <ServiceMatch onSelectCategory={selectCategoryAndScroll} />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-t border-border py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">Browse by category</h2>
                <p className="mt-1 text-muted-foreground">Every service you need around global sourcing, in one place.</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {serviceCategories.map((category) => {
                const Icon = category.icon
                const isActive = selectedCategory === category.slug
                return (
                  <button
                    key={category.slug}
                    onClick={() => {
                      setSelectedCategory(isActive ? "all" : category.slug)
                      scrollToResults()
                    }}
                    className={`group flex flex-col rounded-xl border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                      isActive ? "border-secondary ring-1 ring-secondary" : "border-border hover:border-secondary"
                    }`}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${category.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-semibold text-foreground">{category.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
                    <span className="mt-3 text-xs font-medium text-secondary">
                      {category.providerCount} provider{category.providerCount === 1 ? "" : "s"}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Main results with filters */}
        <section id="providers-results" className="border-t border-border py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Filters */}
              <aside className={`w-full lg:w-64 lg:flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
                <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Filters</h2>
                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="text-sm text-secondary hover:underline">
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="text-sm font-medium text-foreground">Service category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All categories</SelectItem>
                          {serviceCategories.map((c) => (
                            <SelectItem key={c.slug} value={c.slug}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Country</label>
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="All countries" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          <SelectItem value="all">All countries</SelectItem>
                          {filterCountries.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Service availability</label>
                      <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any availability</SelectItem>
                          {availabilityOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Language</label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Any language" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          <SelectItem value="all">Any language</SelectItem>
                          {serviceLanguages.map((l) => (
                            <SelectItem key={l} value={l}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Price range</label>
                      <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Any price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any price</SelectItem>
                          {priceRanges.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Delivery time</label>
                      <Select value={selectedDelivery} onValueChange={setSelectedDelivery}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any delivery time</SelectItem>
                          <SelectItem value="fast">Within 7 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 border-t border-border pt-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="portfolio"
                          checked={portfolioOnly}
                          onCheckedChange={(c) => setPortfolioOnly(c as boolean)}
                        />
                        <label htmlFor="portfolio" className="cursor-pointer text-sm text-foreground">
                          Portfolio available
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="reviewed-sp"
                          checked={reviewedOnly}
                          onCheckedChange={(c) => setReviewedOnly(c as boolean)}
                        />
                        <label htmlFor="reviewed-sp" className="cursor-pointer text-sm text-foreground">
                          Reviewed providers only
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{filtered.length}</span> service providers found
                  </p>
                </div>

                {hasActiveFilters && (
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        {searchQuery}
                        <button onClick={() => setSearchQuery("")} aria-label="Clear search">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {serviceCategories.find((c) => c.slug === selectedCategory)?.name}
                        <button onClick={() => setSelectedCategory("all")} aria-label="Clear category">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedAvailability !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {availabilityOptions.find((o) => o.value === selectedAvailability)?.label}
                        <button onClick={() => setSelectedAvailability("all")} aria-label="Clear availability">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {filtered.map((provider) => (
                      <ServiceProviderCard key={provider.id} provider={provider} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
                    <p className="font-medium text-foreground">No service providers match your filters</p>
                    <p className="mt-1 text-sm text-muted-foreground">Try adjusting or clearing your filters.</p>
                    <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Become a Service Provider CTA */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-8 lg:p-12">
              <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
                <div className="max-w-2xl text-center lg:text-left">
                  <Badge className="mb-4 gap-1 bg-secondary text-secondary-foreground hover:bg-secondary">
                    <Sparkles className="h-3 w-3" />
                    Become a Service Provider
                  </Badge>
                  <h2 className="text-balance font-serif text-2xl font-medium text-primary-foreground sm:text-3xl">
                    Grow your trade services business on SourceNest
                  </h2>
                  <p className="mt-3 text-pretty text-primary-foreground/80">
                    Join a marketplace of reviewed professionals and reach importers and manufacturers who need your
                    expertise. List your services, receive qualified requests, and win new clients.
                  </p>
                  <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 lg:justify-start">
                    {["Qualified buyer requests", "Reviewed Service Provider badge", "Showcase your portfolio"].map(
                      (item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                          <ShieldCheck className="h-4 w-4 text-secondary" />
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    asChild
                  >
                    <Link href="/auth/signup?role=service-provider">
                      Join as a provider
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                    asChild
                  >
                    <Link href="/for-service-providers">Learn more</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
