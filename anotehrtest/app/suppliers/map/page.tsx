"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Globe, 
  MapPin, 
  Search, 
  Factory, 
  Users,
  ArrowRight,
  Building2,
  Package,
  Star,
  ChevronRight
} from "lucide-react"
import { countries, getCountriesByRegion } from "@/lib/data/countries"

const regions = [
  { 
    name: "Asia", 
    supplierCount: 12450, 
    color: "bg-red-500",
    description: "World's manufacturing hub",
    topCountries: ["China", "India", "Vietnam", "Thailand", "Indonesia"],
    industries: ["Electronics", "Textiles", "Machinery", "Plastics"]
  },
  { 
    name: "Europe", 
    supplierCount: 4230, 
    color: "bg-blue-500",
    description: "Quality & precision manufacturing",
    topCountries: ["Germany", "Italy", "Poland", "Turkey", "France"],
    industries: ["Automotive", "Machinery", "Food Processing", "Chemicals"]
  },
  { 
    name: "Americas", 
    supplierCount: 3180, 
    color: "bg-green-500",
    description: "Innovation & technology leaders",
    topCountries: ["United States", "Mexico", "Brazil", "Canada", "Argentina"],
    industries: ["Technology", "Aerospace", "Agriculture", "Automotive"]
  },
  { 
    name: "Africa", 
    supplierCount: 890, 
    color: "bg-amber-500",
    description: "Emerging manufacturing markets",
    topCountries: ["South Africa", "Egypt", "Morocco", "Nigeria", "Kenya"],
    industries: ["Textiles", "Agriculture", "Mining", "Food Processing"]
  },
  { 
    name: "Oceania", 
    supplierCount: 420, 
    color: "bg-cyan-500",
    description: "High-quality production",
    topCountries: ["Australia", "New Zealand", "Fiji", "Papua New Guinea"],
    industries: ["Agriculture", "Mining", "Food Processing", "Machinery"]
  },
]

const featuredCountries = [
  { code: "CN", name: "China", suppliers: 5420, flag: "🇨🇳", growth: "+12%", topIndustry: "Electronics" },
  { code: "IN", name: "India", suppliers: 2890, flag: "🇮🇳", growth: "+18%", topIndustry: "Textiles" },
  { code: "VN", name: "Vietnam", suppliers: 1650, flag: "🇻🇳", growth: "+25%", topIndustry: "Furniture" },
  { code: "DE", name: "Germany", suppliers: 1240, flag: "🇩🇪", growth: "+5%", topIndustry: "Machinery" },
  { code: "TR", name: "Turkey", suppliers: 980, flag: "🇹🇷", growth: "+15%", topIndustry: "Textiles" },
  { code: "MX", name: "Mexico", suppliers: 870, flag: "🇲🇽", growth: "+10%", topIndustry: "Automotive" },
  { code: "TH", name: "Thailand", suppliers: 820, flag: "🇹🇭", growth: "+8%", topIndustry: "Electronics" },
  { code: "PL", name: "Poland", suppliers: 650, flag: "🇵🇱", growth: "+14%", topIndustry: "Furniture" },
]

export default function GlobalSupplierMapPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCountries = searchQuery 
    ? countries.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : selectedRegion 
      ? getCountriesByRegion(selectedRegion)
      : []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground">
                <Globe className="mr-1 h-3 w-3" />
                Global Network
              </Badge>
              <h1 className="font-serif text-3xl font-medium text-primary-foreground sm:text-4xl lg:text-5xl">
                Global Supplier Map
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                Explore manufacturers and suppliers from around the world. Find the perfect partner for your sourcing needs.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="relative w-full max-w-xl">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search countries or regions..."
                    className="h-12 w-full rounded-full border-0 bg-background pl-12 pr-4 text-foreground shadow-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-muted/50 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">21,170+</p>
                <p className="text-sm text-muted-foreground">Reviewed Suppliers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">195</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">50+</p>
                <p className="text-sm text-muted-foreground">Industries</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">1M+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
            </div>
          </div>
        </section>

        {/* Region Selection */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-medium text-foreground lg:text-3xl">
                Explore by Region
              </h2>
              <p className="mt-2 text-muted-foreground">
                Click on a region to view suppliers from that area
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {regions.map((region) => (
                <Card 
                  key={region.name}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedRegion === region.name ? "ring-2 ring-secondary" : ""
                  }`}
                  onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${region.color} flex items-center justify-center`}>
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{region.name}</CardTitle>
                        <CardDescription className="text-xs">{region.supplierCount.toLocaleString()} suppliers</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{region.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {region.industries.slice(0, 3).map((industry) => (
                        <Badge key={industry} variant="secondary" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Region Details */}
            {selectedRegion && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-secondary" />
                      Countries in {selectedRegion}
                    </CardTitle>
                    <CardDescription>
                      {filteredCountries.length} countries available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {filteredCountries.slice(0, 20).map((country) => (
                        <Link
                          key={country.code}
                          href={`/suppliers?country=${country.code}`}
                          className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                        >
                          <span className="text-lg">{country.code === "US" ? "🇺🇸" : country.code === "CN" ? "🇨🇳" : country.code === "IN" ? "🇮🇳" : country.code === "DE" ? "🇩🇪" : "🏳️"}</span>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{country.name}</p>
                            <p className="text-xs text-muted-foreground">{country.subregion || country.region}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                    {filteredCountries.length > 20 && (
                      <div className="mt-4 text-center">
                        <Button variant="outline">
                          View All {filteredCountries.length} Countries
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Featured Countries */}
        <section className="border-t border-border bg-muted/30 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-medium text-foreground lg:text-3xl">
                  Top Manufacturing Countries
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Countries with the most reviewed suppliers on our platform
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/suppliers">
                  View All Suppliers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCountries.map((country) => (
                <Link 
                  key={country.code}
                  href={`/suppliers?country=${country.code}`}
                >
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{country.flag}</span>
                        <div>
                          <h3 className="font-semibold">{country.name}</h3>
                          <p className="text-sm text-muted-foreground">{country.suppliers.toLocaleString()} suppliers</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <span>{country.growth}</span>
                          <span className="text-muted-foreground">growth</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {country.topIndustry}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-12 text-center">
                <h2 className="font-serif text-2xl font-medium lg:text-3xl">
                  Can&apos;t find what you&apos;re looking for?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
                  Submit a Request for Quotation and let reviewed manufacturers come to you with competitive offers.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/rfq/new">
                      Submit RFQ
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                    <Link href="/suppliers">
                      Browse All Suppliers
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
