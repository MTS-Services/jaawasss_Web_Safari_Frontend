"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { suppliers, Supplier } from "@/lib/data/suppliers"
import { getSupplierRatingSummary } from "@/lib/data/reviews"
import { useFavorites } from "@/lib/favorites-context"
import {
  ChevronRight,
  Factory,
  Star,
  MapPin,
  Award,
  Clock,
  Package,
  TrendingUp,
  Globe,
  CheckCircle,
  Calendar,
  Users,
  Plus,
  X,
  Scale,
  Shield
} from "lucide-react"

const MAX_COMPARE = 4

export default function SupplierComparePage() {
  const { 
    compareList, 
    addToCompare, 
    removeFromCompare,
    clearCompareList,
    maxCompare 
  } = useFavorites()
  const [isInitialized, setIsInitialized] = useState(false)

  // Sync URL params with context on initial load
  useEffect(() => {
    const idsParam = new URLSearchParams(window.location.search).get("ids")
    if (idsParam && !isInitialized) {
      const ids = idsParam.split(",").filter(id => suppliers.some(s => s.id === id))
      // Add URL params to context
      ids.slice(0, MAX_COMPARE).forEach(id => {
        if (!compareList.includes(id)) {
          addToCompare(id)
        }
      })
    }
    setIsInitialized(true)
  }, [isInitialized, compareList, addToCompare])

  const selectedSuppliers = compareList
    .map(id => suppliers.find(s => s.id === id))
    .filter((s): s is Supplier => s !== undefined)

  const availableSuppliers = suppliers.filter(s => !compareList.includes(s.id))

  const addSupplier = (id: string) => {
    if (compareList.length < MAX_COMPARE && !compareList.includes(id)) {
      addToCompare(id)
    }
  }

  const removeSupplier = (id: string) => {
    removeFromCompare(id)
  }

  const verificationBadgeColors = {
    basic: "bg-gray-100 text-gray-700",
    standard: "bg-blue-100 text-blue-700",
    premium: "bg-amber-100 text-amber-700",
    enterprise: "bg-emerald-100 text-emerald-700"
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
              <Link href="/suppliers" className="text-muted-foreground hover:text-foreground">
                Suppliers
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Compare</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-3 font-serif text-2xl font-medium text-foreground sm:text-3xl">
                <Scale className="h-8 w-8 text-secondary" />
                Compare Suppliers
              </h1>
              <p className="mt-2 text-muted-foreground">
                Compare up to {MAX_COMPARE} suppliers side by side
              </p>
            </div>

            <Select onValueChange={addSupplier}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Add supplier to compare" />
              </SelectTrigger>
              <SelectContent>
                {availableSuppliers.length > 0 ? (
                  availableSuppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    Maximum suppliers added
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedSuppliers.length === 0 ? (
            <div className="mt-12 rounded-xl border border-dashed border-border py-16 text-center">
              <Scale className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <h2 className="mt-6 font-semibold text-xl text-foreground">
                No Suppliers Selected
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Select suppliers from the dropdown above or browse our supplier directory to start comparing.
              </p>
              <Button asChild className="mt-6">
                <Link href="/suppliers">Browse Suppliers</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8">
              {/* Comparison Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Supplier Headers */}
                  <div className={`grid gap-4 mb-6`} style={{ gridTemplateColumns: `200px repeat(${selectedSuppliers.length}, 1fr)` }}>
                    <div className="text-sm font-medium text-muted-foreground p-4">
                      Comparing {selectedSuppliers.length} suppliers
                    </div>
                    {selectedSuppliers.map((supplier) => (
                      <div key={supplier.id} className="rounded-xl border border-border bg-card p-4 relative">
                        <button
                          onClick={() => removeSupplier(supplier.id)}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                            <Factory className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <Link
                              href={`/suppliers/${supplier.slug}`}
                              className="font-semibold text-foreground hover:text-secondary line-clamp-1"
                            >
                              {supplier.name}
                            </Link>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {supplier.location.country}
                            </div>
                          </div>
                        </div>
                        {supplier.verified && (
                          <Badge className={`mt-3 ${verificationBadgeColors[supplier.verificationLevel]}`}>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {supplier.verificationLevel.charAt(0).toUpperCase() + supplier.verificationLevel.slice(1)}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Rating Row */}
                  <ComparisonRow
                    label="Rating"
                    icon={<Star className="h-4 w-4" />}
                    columns={selectedSuppliers.length}
                  >
                    {selectedSuppliers.map((supplier) => {
                      const summary = getSupplierRatingSummary(supplier.id)
                      return (
                        <div key={supplier.id} className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                          <span className="text-lg font-semibold">{summary.average || supplier.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({summary.total || supplier.reviewCount} reviews)
                          </span>
                        </div>
                      )
                    })}
                  </ComparisonRow>

                  {/* Response Time Row */}
                  <ComparisonRow
                    label="Response Time"
                    icon={<Clock className="h-4 w-4" />}
                    columns={selectedSuppliers.length}
                  >
                    {selectedSuppliers.map((supplier) => (
                      <span key={supplier.id} className="font-medium">{supplier.responseTime}</span>
                    ))}
                  </ComparisonRow>

                  {/* Response Rate Row */}
                  <ComparisonRow
                    label="Response Rate"
                    icon={<TrendingUp className="h-4 w-4" />}
                    columns={selectedSuppliers.length}
                  >
                    {selectedSuppliers.map((supplier) => (
                      <span key={supplier.id} className="font-medium">{supplier.responseRate}%</span>
                    ))}
                  </ComparisonRow>

                  {/* On-Time Delivery Row */}
                  <ComparisonRow
                    label="On-Time Delivery"
                    icon={<Package className="h-4 w-4" />}
                    columns={selectedSuppliers.length}
                  >
                    {selectedSuppliers.map((supplier) => (
                      <span key={supplier.id} className="font-medium">{supplier.onTimeDelivery}%</span>
                    ))}
                  </ComparisonRow>

                  {/* Year Established Row */}
                  <ComparisonRow
                    label="Established"
                    icon={<Calendar className="h-4 w-4" />}
                    columns={selectedSuppliers.length}
                  >
                    {selectedSuppliers.map((supplier) => (
                      <div key={supplier.id}>
                        <span className="font-medium">{supplier.yearEstablished}</span>
                        <span className="text-sm text-muted-foreground ml-1">
                          ({new Date().getFullYear() - supplier.yearEstablished} years)
                        </span>
                      </div>
                    ))}
                  </ComparisonRow>

                  {/* Employees Row */}
                  <ComparisonRow
                    label="Employees"
                    icon={<Users className="h-4 w-4" />}
                    columns={selectedSuppliers.length}
                  >
                    {selectedSuppliers.map((supplier) => (
                      <span key={supplier.id} className="font-medium">{supplier.employeeCount}</span>
                    ))}
                  </ComparisonRow>

                  {/* Products Row */}
                  <ComparisonRow
                    label="Product Count"
                    icon={<Package className="h-4 w-4" />}
                    columns={selectedSuppliers.length}
                  >
                    {selectedSuppliers.map((supplier) => (
                      <span key={supplier.id} className="font-medium">{supplier.productCount.toLocaleString()}</span>
                    ))}
                  </ComparisonRow>

                  {/* MOQ Row */}
                  <ComparisonRow
                    label="Min Order Value"
                    icon={<TrendingUp className="h-4 w-4" />}
                    columns={selectedSuppliers.length}
                  >
                    {selectedSuppliers.map((supplier) => (
                      <span key={supplier.id} className="font-medium">
                        {supplier.minOrderValue || "Contact for MOQ"}
                      </span>
                    ))}
                  </ComparisonRow>

                  {/* Export Markets Row */}
                  <ComparisonRow
                    label="Export Markets"
                    icon={<Globe className="h-4 w-4" />}
                    columns={selectedSuppliers.length}
                  >
                    {selectedSuppliers.map((supplier) => (
                      <div key={supplier.id} className="flex flex-wrap gap-1">
                        {supplier.exportMarkets.slice(0, 3).map((market) => (
                          <Badge key={market} variant="secondary" className="text-xs">
                            {market}
                          </Badge>
                        ))}
                        {supplier.exportMarkets.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{supplier.exportMarkets.length - 3}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </ComparisonRow>

                  {/* Certifications Row */}
                  <ComparisonRow
                    label="Certifications"
                    icon={<Shield className="h-4 w-4" />}
                    columns={selectedSuppliers.length}
                  >
                    {selectedSuppliers.map((supplier) => (
                      <div key={supplier.id} className="flex flex-wrap gap-1">
                        {supplier.certifications.slice(0, 4).map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                        {supplier.certifications.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{supplier.certifications.length - 4}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </ComparisonRow>

                  {/* Actions Row */}
                  <div className={`grid gap-4 mt-6`} style={{ gridTemplateColumns: `200px repeat(${selectedSuppliers.length}, 1fr)` }}>
                    <div></div>
                    {selectedSuppliers.map((supplier) => (
                      <div key={supplier.id} className="flex flex-col gap-2">
                        <Button asChild>
                          <Link href={`/messages/new?supplier=${supplier.slug}`}>
                            Contact Supplier
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href={`/suppliers/${supplier.slug}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add More Section */}
              {selectedSuppliers.length < MAX_COMPARE && (
                <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center">
                  <Plus className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-3 text-muted-foreground">
                    Add {MAX_COMPARE - selectedSuppliers.length} more supplier{MAX_COMPARE - selectedSuppliers.length > 1 ? "s" : ""} to compare
                  </p>
                  <Select onValueChange={addSupplier}>
                    <SelectTrigger className="mt-4 mx-auto w-64">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSuppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

interface ComparisonRowProps {
  label: string
  icon: React.ReactNode
  columns: number
  children: React.ReactNode
}

function ComparisonRow({ label, icon, columns, children }: ComparisonRowProps) {
  return (
    <div
      className={`grid gap-4 border-b border-border`}
      style={{ gridTemplateColumns: `200px repeat(${columns}, 1fr)` }}
    >
      <div className="flex items-center gap-2 p-4 bg-muted/30 text-sm font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} className="p-4 flex items-center">
              {child}
            </div>
          ))
        : children}
    </div>
  )
}
