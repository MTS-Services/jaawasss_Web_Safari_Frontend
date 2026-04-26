"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getProduct, type Product } from "@/lib/api/products"
import { useFavorites } from "@/lib/favorites-context"
import { 
  Package,
  ChevronRight,
  MessageSquare,
  Clock,
  CheckCircle,
  Truck,
  Sparkles,
  BoxIcon,
  Zap,
  Loader2,
  AlertCircle,
  FileText,
  Heart,
  Scale
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string // This is the product ID in the URL
  const { 
    addProductToFavorites, 
    removeProductFromFavorites, 
    isProductSaved,
    addToCompare,
    removeFromCompare,
    isInCompare,
    compareCount,
    maxCompare
  } = useFavorites()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      
      const response = await getProduct(slug)
      
      if (response.success && response.data) {
        setProduct(response.data)
      } else {
        setError(response.message || "Product not found")
      }
      
      setLoading(false)
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const handleFavoriteClick = () => {
    if (!product) return
    if (isSaved(product.id)) {
      removeProductFromFavorites(product.id.toString())
    } else {
      // Create a compatible object for favorites context
      addProductToFavorites({
        id: product.id.toString(),
        name: product.name,
        slug: product.slug,
        category: product.category.name,
        price: {
          min: parseFloat(product.pricing_quantities.min_price.price.amount),
          max: parseFloat(product.pricing_quantities.max_price.price.amount),
          unit: product.pricing_quantities.unit,
          currency: product.pricing_quantities.currency.code
        },
        supplierId: "0", // Placeholder - not available from API yet
        supplierSlug: "", // Placeholder
        supplierName: "", // Placeholder
        image: product.image || "/placeholder-product.png",
        rating: 0,
        verified: product.is_approved
      } as any)
    }
  }

  function isSaved(productId: number): boolean {
    return isProductSaved(productId.toString())
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Product Not Found</p>
                  <p className="text-sm mt-1">{error || "The product you're looking for doesn't exist."}</p>
                </div>
              </div>
              <Button className="mt-4" variant="outline" onClick={() => router.push("/products")}>
                Back to Products
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const minPrice = parseFloat(product.pricing_quantities.min_price.price.amount)
  const maxPrice = parseFloat(product.pricing_quantities.max_price.price.amount)
  const isSavedProduct = isSaved(product.id)

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
              <Link href={`/industries/${product.category.slug}`} className="text-muted-foreground hover:text-foreground">
                {product.category.name}
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
                  <Badge>{product.category.name}</Badge>
                  {product.customization_options && product.customization_options.length > 0 && (
                    <Badge variant="outline">Customizable</Badge>
                  )}
                  {product.is_approved && (
                    <Badge variant="secondary">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                <h1 className="mt-4 font-serif text-2xl font-medium text-foreground sm:text-3xl">
                  {product.name}
                </h1>

                <p className="mt-4 text-muted-foreground">
                  {product.description}
                </p>

                {/* Pricing */}
                <div className="mt-6 rounded-xl border border-border bg-card p-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">
                        ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
                      </span>
                      <span className="ml-2 text-muted-foreground">/ {product.pricing_quantities.unit}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">USD</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Price varies based on quantity and customization
                  </p>
                </div>

                {/* Key Info */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Minimum Order</span>
                    </div>
                    <div className="mt-1 font-semibold text-foreground">
                      {product.pricing_quantities.minimum_order_quantity} {product.pricing_quantities.unit}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Lead Time</span>
                    </div>
                    <div className="mt-1 font-semibold text-foreground">
                      {product.pricing_quantities.lead_time} days
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span className="text-sm">Production</span>
                    </div>
                    <div className="mt-1 font-semibold text-foreground">
                      {product.pricing_quantities.production_duration} {product.pricing_quantities.production_unit}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Capacity</span>
                    </div>
                    <div className="mt-1 font-semibold text-foreground">
                      {product.pricing_quantities.production_capacity} units
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {/* Primary Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button 
                      className="flex-1" 
                      size="lg"
                      onClick={() => router.push(`/rfq/new?product_id=${product.id}`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Request Quote
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1" asChild>
                      <Link href={`/messages/new?product=${product.slug}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Supplier
                      </Link>
                    </Button>
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex gap-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="lg"
                            variant={isSavedProduct ? "secondary" : "outline"}
                            className="flex-1 gap-2"
                            onClick={handleFavoriteClick}
                          >
                            <Heart className={cn("h-4 w-4", isSavedProduct && "fill-current")} />
                            {isSavedProduct ? "Saved" : "Save"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isSavedProduct ? "Remove from favorites" : "Save to favorites"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="lg"
                            variant="outline"
                            className="flex-1 gap-2"
                            disabled={true}
                          >
                            <Scale className="h-4 w-4" />
                            Compare
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Compare this product with others
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
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
            
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={spec.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground w-1/3">
                          {spec.specification_title}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {spec.specification_value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Key Features */}
            {product.product_key_features && product.product_key_features.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Key Features
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {product.product_key_features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <span className="text-muted-foreground">{feature.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customization Options */}
            {product.customization_options && product.customization_options.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Customization Options
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.customization_options.map((option) => (
                    <Badge key={option.id} variant="secondary" className="text-sm">
                      {option.option}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging Details */}
            {product.shipping_packaging && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <BoxIcon className="h-5 w-5" />
                  Packaging Details
                </h3>
                <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium text-foreground w-1/3">Type</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.shipping_packaging.packaging_type}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">Dimensions</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.shipping_packaging.packaging_dimensions}</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">Weight</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.shipping_packaging.packaging_weight}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">Port</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.shipping_packaging.port_of_loading}</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">Cost/Unit</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          ${parseFloat(product.shipping_packaging.packaging_cost_per_unit.price.amount).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Shipping Methods */}
            {product.shipping_methods && product.shipping_methods.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Available Shipping Methods
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.shipping_methods.map((method) => (
                    <Badge key={method.id} variant="outline" className="text-sm">
                      {method.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
