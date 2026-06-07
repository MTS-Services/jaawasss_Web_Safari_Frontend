"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
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
    descriptionKey: "worldsManufacturingHub",
    topCountries: ["China", "India", "Vietnam", "Thailand", "Indonesia"],
    industries: ["Electronics", "Textiles", "Machinery", "Plastics"]
  },
  { 
    name: "Europe", 
    supplierCount: 4230, 
    color: "bg-blue-500",
    descriptionKey: "qualityPrecisionManufacturing",
    topCountries: ["Germany", "Italy", "Poland", "Turkey", "France"],
    industries: ["Automotive", "Machinery", "Food Processing", "Chemicals"]
  },
  { 
    name: "Americas", 
    supplierCount: 3180, 
    color: "bg-green-500",
    descriptionKey: "innovationTechnologyLeaders",
    topCountries: ["United States", "Mexico", "Brazil", "Canada", "Argentina"],
    industries: ["Technology", "Aerospace", "Agriculture", "Automotive"]
  },
  { 
    name: "Africa", 
    supplierCount: 890, 
    color: "bg-amber-500",
    descriptionKey: "emergingManufacturingMarkets",
    topCountries: ["South Africa", "Egypt", "Morocco", "Nigeria", "Kenya"],
    industries: ["Textiles", "Agriculture", "Mining", "Food Processing"]
  },
  { 
    name: "Oceania", 
    supplierCount: 420, 
    color: "bg-cyan-500",
    descriptionKey: "highQualityProduction",
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
  const { t } = useTranslation()
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllCountries, setShowAllCountries] = useState(false)

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
                {t?.landing?.suppliersMap?.globalNetwork || "Global Network"}
              </Badge>
              <h1 className="font-serif text-3xl font-medium text-primary-foreground sm:text-4xl lg:text-5xl">
                {t?.landing?.suppliersMap?.pageTitle || "Global Supplier Map"}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                {t?.landing?.suppliersMap?.pageDescription || "Explore manufacturers and suppliers from around the world. Find the perfect partner for your sourcing needs."}
              </p>
              <div className="mt-8 flex justify-center">
                <div className="relative w-full max-w-xl">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder={t?.landing?.suppliersMap?.searchPlaceholder || "Search countries or regions..."}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">21,170+</p>
                <p className="text-sm text-muted-foreground">{t?.landing?.suppliersMap?.reviewedSuppliersLabel || "Reviewed Suppliers"}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">195</p>
                <p className="text-sm text-muted-foreground">{t?.landing?.suppliersMap?.countriesLabel || "Countries"}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">50+</p>
                <p className="text-sm text-muted-foreground">{t?.landing?.suppliersMap?.industriesLabel || "Industries"}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">1M+</p>
                <p className="text-sm text-muted-foreground">{t?.landing?.suppliersMap?.productsLabel || "Products"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Region Selection */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-medium text-foreground lg:text-3xl">
                {t?.landing?.suppliersMap?.exploreByRegion || "Explore by Region"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {t?.landing?.suppliersMap?.clickRegionToView || "Click on a region to view suppliers from that area"}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {regions.map((region) => (
                <Card 
                  key={region.name}
                  className={`h-full cursor-pointer transition-all hover:shadow-lg ${
                    selectedRegion === region.name ? "ring-2 ring-secondary" : ""
                  }`}
                  onClick={() => {
                    setSelectedRegion(selectedRegion === region.name ? null : region.name)
                    setShowAllCountries(false)
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${region.color} flex items-center justify-center`}>
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{region.name}</CardTitle>
                        <CardDescription className="text-xs">{region.supplierCount.toLocaleString()} {t?.landing?.suppliersMap?.suppliers || "suppliers"}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{t?.landing?.suppliersMap?.[region.descriptionKey as keyof typeof t.landing.suppliersMap] || region.name}</p>
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
                      {t?.landing?.suppliersMap?.countriesIn?.replace("{region}", selectedRegion) || `Countries in ${selectedRegion}`}
                    </CardTitle>
                    <CardDescription>
                      {filteredCountries.length} {t?.landing?.suppliersMap?.countriesAvailable || "countries available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {filteredCountries.slice(0, showAllCountries ? undefined : 20).map((country) => (
                        <Link
                          key={country.code}
                          href={`/suppliers?country=${country.code}`}
                          className="w-full flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                        >
                          <img 
                            src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                            width="20"
                            alt={country.name}
                            className="h-5 w-7 rounded-sm object-cover shadow-sm" 
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{country.name}</p>
                            <p className="text-xs text-muted-foreground">{country.subregion || country.region}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                    {filteredCountries.length > 20 && !showAllCountries && (
                      <div className="mt-4 text-center">
                        <Button variant="outline" onClick={() => setShowAllCountries(true)}>
                          {t?.landing?.suppliersMap?.viewAllCountries?.replace("{count}", filteredCountries.length.toString()) || `View All ${filteredCountries.length} Countries`}
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
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-medium text-foreground lg:text-3xl">
                  {t?.landing?.suppliersMap?.topManufacturingCountries || "Top Manufacturing Countries"}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {t?.landing?.suppliersMap?.countriesMostReviewedSuppliers || "Countries with the most reviewed suppliers on our platform"}
                </p>
              </div>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/suppliers" className="w-full text-center sm:w-auto">
                  {t?.landing?.suppliersMap?.viewAllSuppliers || "View All Suppliers"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCountries.map((country) => (
                <Link 
                  key={country.code}
                  href={`/suppliers?country=${country.code}`}
                  className="block h-full"
                >
                  <Card className="h-full rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="md:pt-3">
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                          width="32"
                          alt={country.name}
                          className="h-8 w-11 rounded-sm object-cover shadow-sm" 
                        />
                        <div>
                          <h3 className="font-semibold">{country.name}</h3>
                          <p className="text-sm text-muted-foreground">{country.suppliers.toLocaleString()} {t?.landing?.suppliers?.productsLabel || "suppliers"}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <span>{country.growth}</span>
                          <span className="text-muted-foreground">{t?.landing?.suppliersMap?.growth || "growth"}</span>
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
                  {t?.landing?.suppliersMap?.cantFindTitle || "Can't find what you're looking for?"}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
                  {t?.landing?.suppliersMap?.cantFindDesc || "Submit a Request for Quotation and let reviewed manufacturers come to you with competitive offers."}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto justify-center" asChild>
                    <Link href="/rfq/new" className="w-full text-center sm:w-auto">
                      {t?.landing?.suppliersMap?.submitRFQ || "Submit RFQ"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                    <Link href="/suppliers" className="w-full text-center sm:w-auto">
                      {t?.landing?.suppliersMap?.browseAllSuppliers || "Browse All Suppliers"}
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
