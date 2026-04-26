import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { products, getProductBySlug, getProductsBySupplier } from "@/lib/data/products"
import { getSupplierBySlug } from "@/lib/data/suppliers"
import { ProductPageActions } from "@/components/products/product-page-actions"
import { CompareBar } from "@/components/suppliers/compare-bar"
import { 
  Package,
  ChevronRight,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  Factory,
  Star,
  Shield,
  Truck,
  FlaskConical,
  Sparkles,
  BoxIcon,
  Download,
  Zap
} from "lucide-react"

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  
  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: product.name,
    description: product.shortDescription,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const supplier = getSupplierBySlug(product.supplierSlug)
  const relatedProducts = getProductsBySupplier(product.supplierSlug).filter(p => p.id !== product.id).slice(0, 3)

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
              <Link href="/products" className="text-muted-foreground hover:text-foreground">
                Products
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link href={`/industries/${product.industrySlug}`} className="text-muted-foreground hover:text-foreground">
                {product.industry}
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Product Images */}
              <div>
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-24 w-24 text-muted-foreground/30" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-lg bg-muted">
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground/20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{product.category}</Badge>
                  {product.customizable && (
                    <Badge variant="outline">Customizable</Badge>
                  )}
                  {product.sampleAvailable && (
                    <Badge variant="secondary">Sample Available</Badge>
                  )}
                </div>

                <h1 className="mt-4 font-serif text-2xl font-medium text-foreground sm:text-3xl">
                  {product.name}
                </h1>

                {/* Supplier Link */}
                <Link 
                  href={`/suppliers/${product.supplierSlug}`}
                  className="mt-3 flex items-center gap-2 text-muted-foreground hover:text-secondary"
                >
                  <Factory className="h-4 w-4" />
                  <span>{product.supplierName}</span>
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  {supplier && (
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {supplier.rating}
                    </span>
                  )}
                </Link>

                <p className="mt-4 text-muted-foreground">
                  {product.description}
                </p>

                {/* Pricing */}
                {product.price && (
                  <div className="mt-6 rounded-xl border border-border bg-card p-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-bold text-foreground">
                          ${product.price.min.toFixed(2)} - ${product.price.max.toFixed(2)}
                        </span>
                        <span className="ml-2 text-muted-foreground">/ {product.price.unit}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{product.price.currency}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Price varies based on quantity and customization
                    </p>
                  </div>
                )}

                {/* Key Info */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Minimum Order</span>
                    </div>
                    <div className="mt-1 font-semibold text-foreground">
                      {product.moq} {product.moqUnit}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Lead Time</span>
                    </div>
                    <div className="mt-1 font-semibold text-foreground">
                      {product.leadTime}
                    </div>
                  </div>
                  {product.sampleAvailable && product.samplePrice && (
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FlaskConical className="h-4 w-4" />
                        <span className="text-sm">Sample Price</span>
                      </div>
                      <div className="mt-1 font-semibold text-foreground">
                        ${product.samplePrice}
                      </div>
                    </div>
                  )}
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span className="text-sm">Shipping</span>
                    </div>
                    <div className="mt-1 font-semibold text-foreground">
                      FOB / CIF / DDP
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <ProductPageActions product={product} />
              </div>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="border-t border-border py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-medium text-foreground">
              Product Specifications
            </h2>
            <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="px-4 py-3 text-sm font-medium text-foreground w-1/3">
                        {key}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Certifications */}
            {product.certifications.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Product Certifications
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-sm">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Key Features
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customization Options */}
            {product.customizable && product.customizationOptions && product.customizationOptions.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Customization Options
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.customizationOptions.map((option) => (
                    <Badge key={option} variant="secondary" className="text-sm">
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging Details */}
            {product.packagingDetails && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <BoxIcon className="h-5 w-5" />
                  Packaging Details
                </h3>
                <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium text-foreground w-1/3">Packaging Type</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.packagingDetails.type}</td>
                      </tr>
                      {product.packagingDetails.dimensions && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Dimensions</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{product.packagingDetails.dimensions}</td>
                        </tr>
                      )}
                      {product.packagingDetails.weight && (
                        <tr className="bg-muted/50">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Weight</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{product.packagingDetails.weight}</td>
                        </tr>
                      )}
                      {product.packagingDetails.unitsPerCarton && (
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Units per Carton</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{product.packagingDetails.unitsPerCarton}</td>
                        </tr>
                      )}
                      {product.packagingDetails.description && (
                        <tr className="bg-muted/50">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">Description</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{product.packagingDetails.description}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Product Brochure Download */}
            {product.brochureUrl && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Product Documentation
                </h3>
                <div className="mt-4">
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={product.brochureUrl} download>
                      <Download className="h-4 w-4" />
                      Download Product Brochure (PDF)
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Supplier Info */}
        {supplier && (
          <section className="border-t border-border bg-muted/50 py-8 lg:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-medium text-foreground">
                About the Supplier
              </h2>
              <div className="mt-6 rounded-xl border border-border bg-card p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Factory className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-foreground">{supplier.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Reviewed
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {supplier.location.city}, {supplier.location.country} • Est. {supplier.yearEstablished}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{supplier.rating}</span>
                          <span className="text-muted-foreground">({supplier.reviewCount} reviews)</span>
                        </span>
                        <span className="text-muted-foreground">
                          {supplier.responseTime} response
                        </span>
                        <span className="text-muted-foreground">
                          {supplier.onTimeDelivery}% on-time
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/suppliers/${supplier.slug}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border py-8 lg:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-medium text-foreground">
                More from this Supplier
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.slug}`}
                    className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground group-hover:text-secondary line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      {relatedProduct.price && (
                        <div className="mt-2 text-sm">
                          <span className="font-semibold text-foreground">
                            ${relatedProduct.price.min.toFixed(2)} - ${relatedProduct.price.max.toFixed(2)}
                          </span>
                          <span className="text-muted-foreground"> / {relatedProduct.price.unit}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <CompareBar />
    </div>
  )
}
