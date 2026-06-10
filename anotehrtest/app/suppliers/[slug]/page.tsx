import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { suppliers, getSupplierBySlug } from "@/lib/data/suppliers"
import { getProductsBySupplier } from "@/lib/data/products"
import { getReviewsBySupplier, getSupplierRatingSummary } from "@/lib/data/reviews"
import { SupplierReviewsSection } from "@/components/suppliers/supplier-reviews-section"
import { SupplierPageActions } from "@/components/suppliers/supplier-page-actions"
import { CompareBar } from "@/components/suppliers/compare-bar"
import { 
  MapPin, 
  Star, 
  Clock, 
  Package,
  CheckCircle,
  ChevronRight,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Globe,
  Award,
  TrendingUp,
  Factory,
  Shield,
  Download,
  Eye,
  BookOpen,
  Image,
  Building2,
  Wrench,
  Languages,
  CreditCard,
  Camera
} from "lucide-react"

export async function generateStaticParams() {
  return suppliers.map((supplier) => ({
    slug: supplier.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supplier = getSupplierBySlug(slug)
  
  if (!supplier) {
    return { title: "Supplier Not Found" }
  }

  return {
    title: supplier.name,
    description: supplier.shortDescription,
  }
}

export default async function SupplierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supplier = getSupplierBySlug(slug)

  if (!supplier) {
    notFound()
  }

  const supplierProducts = getProductsBySupplier(slug)
  const supplierReviews = getReviewsBySupplier(supplier.id)
  const ratingSummary = getSupplierRatingSummary(supplier.id)

  const reviewBadgeColors = {
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
              <span className="font-medium text-foreground line-clamp-1">{supplier.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-card py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {/* Logo Placeholder */}
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-muted">
                  <Factory className="h-12 w-12 text-muted-foreground" />
                </div>
                
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                      {supplier.name}
                    </h1>
                    {supplier.reviewed && (
                      <Badge className={reviewBadgeColors[supplier.reviewedLevel]}>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {supplier.reviewedLevel.charAt(0).toUpperCase() + supplier.reviewedLevel.slice(1)} Reviewed
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {supplier.location.city}, {supplier.location.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Est. {supplier.yearEstablished}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {supplier.employeeCount} employees
                    </span>
                  </div>

                  <p className="mt-4 max-w-2xl text-muted-foreground">
                    {supplier.shortDescription}
                  </p>

                  {/* Review Badges */}
                  {supplier.reviewed && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1 bg-green-50 border-green-200 text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        Reviewed Manufacturer
                      </Badge>
                      <Badge variant="outline" className="gap-1 bg-blue-50 border-blue-200 text-blue-700">
                        <Shield className="h-3 w-3" />
                        Business License Reviewed
                      </Badge>
                      {supplier.reviewedLevel === "premium" || supplier.reviewedLevel === "enterprise" ? (
                        <Badge variant="outline" className="gap-1 bg-amber-50 border-amber-200 text-amber-700">
                          <Factory className="h-3 w-3" />
                          Factory Information Reviewed
                        </Badge>
                      ) : null}
                      <Badge variant="outline" className="gap-1 bg-purple-50 border-purple-200 text-purple-700">
                        <Calendar className="h-3 w-3" />
                        {new Date().getFullYear() - supplier.yearEstablished}+ Years in Business
                      </Badge>
                      <Badge variant="outline" className="gap-1 bg-cyan-50 border-cyan-200 text-cyan-700">
                        <Globe className="h-3 w-3" />
                        {supplier.exportMarkets.length} Export Markets
                      </Badge>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mt-6 flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="text-lg font-semibold text-foreground">{supplier.rating}</span>
                      <span className="text-sm text-muted-foreground">({supplier.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Response: {supplier.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{supplier.onTimeDelivery}% on-time delivery</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <SupplierPageActions supplier={supplier} />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products ({supplierProducts.length})</TabsTrigger>
                <TabsTrigger value="catalog">Factory Catalog</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Company Profile */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-xl border border-border bg-card p-6">
                      <h2 className="font-semibold text-lg text-foreground">Company Profile</h2>
                      <p className="mt-4 text-muted-foreground leading-relaxed">
                        {supplier.description}
                      </p>
                    </div>

                    {/* Main Products */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <h2 className="font-semibold text-lg text-foreground">Main Products</h2>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {supplier.mainProducts.map((product) => (
                          <Badge key={product} variant="outline" className="text-sm">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Export Markets */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Export Markets
                      </h2>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {supplier.exportMarkets.map((market) => (
                          <Badge key={market} variant="secondary" className="text-sm">
                            {market}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Business Type & Capabilities */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Business Type */}
                      {supplier.businessType && supplier.businessType.length > 0 && (
                        <div className="rounded-xl border border-border bg-card p-6">
                          <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Business Type
                          </h2>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {supplier.businessType.map((type) => (
                              <Badge key={type} variant="outline" className="text-sm capitalize">
                                {type.replace("-", " ")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Manufacturing Capabilities */}
                      {supplier.capabilities && supplier.capabilities.length > 0 && (
                        <div className="rounded-xl border border-border bg-card p-6">
                          <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                            <Wrench className="h-5 w-5" />
                            Manufacturing Capabilities
                          </h2>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {supplier.capabilities.map((cap) => (
                              <Badge key={cap} variant="secondary" className="text-sm uppercase">
                                {cap.replace("-", " ")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Languages & Payment Terms */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Languages */}
                      {supplier.languages && supplier.languages.length > 0 && (
                        <div className="rounded-xl border border-border bg-card p-6">
                          <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                            <Languages className="h-5 w-5" />
                            Languages
                          </h2>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {supplier.languages.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-sm">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Payment Terms */}
                      {supplier.paymentTerms && supplier.paymentTerms.length > 0 && (
                        <div className="rounded-xl border border-border bg-card p-6">
                          <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Terms
                          </h2>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {supplier.paymentTerms.map((term) => (
                              <Badge key={term} variant="outline" className="text-sm">
                                {term}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Factory Photos */}
                    {supplier.factoryPhotos && supplier.factoryPhotos.length > 0 && (
                      <div className="rounded-xl border border-border bg-card p-6">
                        <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                          <Camera className="h-5 w-5" />
                          Factory Photos
                        </h2>
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                          {supplier.factoryPhotos.map((photo, index) => (
                            <div key={index} className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Factory className="h-8 w-8 text-muted-foreground/30" />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                                <Eye className="h-6 w-6 text-secondary" />
                              </div>
                              <span className="absolute bottom-2 left-2 text-xs font-medium text-muted-foreground">
                                Photo {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Facts */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <h2 className="font-semibold text-lg text-foreground">Quick Facts</h2>
                      <dl className="mt-4 space-y-4">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Industry</dt>
                          <dd className="font-medium text-foreground">{supplier.industry}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Established</dt>
                          <dd className="font-medium text-foreground">{supplier.yearEstablished}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Employees</dt>
                          <dd className="font-medium text-foreground">{supplier.employeeCount}</dd>
                        </div>
                        {supplier.annualRevenue && (
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Annual Revenue</dt>
                            <dd className="font-medium text-foreground">{supplier.annualRevenue}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Products</dt>
                          <dd className="font-medium text-foreground">{supplier.productCount.toLocaleString()}</dd>
                        </div>
                        {supplier.minOrderValue && (
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Min Order</dt>
                            <dd className="font-medium text-foreground">{supplier.minOrderValue}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    {/* Response Stats */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <h2 className="font-semibold text-lg text-foreground">Response Stats</h2>
                      <dl className="mt-4 space-y-4">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Response Rate</dt>
                          <dd className="font-medium text-foreground">{supplier.responseRate}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Response Time</dt>
                          <dd className="font-medium text-foreground">{supplier.responseTime}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">On-time Delivery</dt>
                          <dd className="font-medium text-foreground">{supplier.onTimeDelivery}%</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Certifications Preview */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Certifications
                      </h2>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {supplier.certifications.slice(0, 4).map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                        {supplier.certifications.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{supplier.certifications.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {supplierProducts.map((product) => (
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
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {product.shortDescription}
                        </p>
                        {product.price && (
                          <div className="mt-3 text-sm">
                            <span className="font-semibold text-foreground">
                              ${product.price.min.toFixed(2)} - ${product.price.max.toFixed(2)}
                            </span>
                            <span className="text-muted-foreground"> / {product.price.unit}</span>
                          </div>
                        )}
                        <div className="mt-2 text-sm text-muted-foreground">
                          MOQ: {product.moq} {product.moqUnit}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {supplierProducts.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border py-16 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 font-semibold text-foreground">No products listed yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Contact the supplier to learn about their product offerings
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Factory Catalog Tab */}
              <TabsContent value="catalog">
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Catalog Preview */}
                  <div className="lg:col-span-2">
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                      {/* Catalog Header */}
                      <div className="border-b border-border bg-muted/50 px-6 py-4">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-secondary" />
                          <h2 className="font-semibold text-lg text-foreground">Factory Catalog</h2>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Browse {supplier.name}&apos;s complete product catalog
                        </p>
                      </div>

                      {/* Catalog Preview Grid */}
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                          {[1, 2, 3, 4, 5, 6].map((page) => (
                            <div key={page} className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-border bg-muted">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Image className="h-8 w-8 text-muted-foreground/30" />
                              </div>
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                                <span className="text-xs font-medium text-foreground">Page {page}</span>
                              </div>
                              {page === 1 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                                  <Eye className="h-6 w-6 text-secondary" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* View More */}
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                          Showing 6 of 24 pages
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Catalog Actions Sidebar */}
                  <div className="space-y-6">
                    {/* Download Card */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <h3 className="font-semibold text-foreground">Get the Full Catalog</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Download or view the complete factory catalog with all products, specifications, and pricing information.
                      </p>

                      <div className="mt-6 space-y-3">
                        <Button className="w-full gap-2" size="lg">
                          <Eye className="h-4 w-4" />
                          View Catalog Online
                        </Button>
                        <Button variant="outline" className="w-full gap-2" size="lg">
                          <Download className="h-4 w-4" />
                          Download Catalog (PDF)
                        </Button>
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <span>PDF Format</span>
                        <span className="h-3 w-px bg-border" />
                        <span>12.5 MB</span>
                        <span className="h-3 w-px bg-border" />
                        <span>24 Pages</span>
                      </div>
                    </div>

                    {/* Catalog Details */}
                    <div className="rounded-xl border border-border bg-card p-6">
                      <h3 className="font-semibold text-foreground">Catalog Details</h3>
                      <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Last Updated</dt>
                          <dd className="font-medium text-foreground">March 2026</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Language</dt>
                          <dd className="font-medium text-foreground">English</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Products Featured</dt>
                          <dd className="font-medium text-foreground">{supplier.productCount}+</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Includes Pricing</dt>
                          <dd className="font-medium text-foreground">Yes</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Request Custom Catalog */}
                    <div className="rounded-xl border border-dashed border-border bg-muted/50 p-6 text-center">
                      <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                      <h3 className="mt-3 font-semibold text-foreground">Need a Custom Catalog?</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Request a catalog tailored to your specific product requirements.
                      </p>
                      <Button variant="outline" className="mt-4 gap-2" size="sm" asChild>
                        <Link href={`/messages/new?supplier=${supplier.slug}&subject=Custom%20Catalog%20Request`}>
                          <MessageSquare className="h-4 w-4" />
                          Request Custom Catalog
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Certifications Tab */}
              <TabsContent value="certifications">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {supplier.certifications.map((cert) => (
                    <div key={cert} className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                          <Shield className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{cert}</h3>
                          <p className="text-sm text-muted-foreground">Reviewed certification</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <SupplierReviewsSection
                  supplierId={supplier.id}
                  supplierName={supplier.name}
                  reviews={supplierReviews}
                  ratingSummary={ratingSummary}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
      <CompareBar />
    </div>
  )
}
