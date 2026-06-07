"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Package } from "lucide-react"
import { getFeaturedProducts } from "@/lib/data/products"
import { useTranslation } from "@/lib/i18n"

const featuredProducts = getFeaturedProducts().slice(0, 6)

export function FeaturedProductsSection() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <section className="py-8 sm:py-12 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {t.landing.featured.productsTitle}
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              {t.landing.featured.productsSubtitle}
            </p>
          </div>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/products">
              {t.common.view} All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/products/${product.slug}`)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
            >
              {/* Product Image Placeholder */}
              <div className="relative aspect-4/3 bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground/30" />
                </div>
                <Badge className="absolute left-3 top-3">{product.category}</Badge>
              </div>
              
              <div className="p-5">
                <h3 className="font-semibold text-foreground group-hover:text-secondary line-clamp-1">
                  {product.name}
                </h3>
                <Link 
                  href={`/suppliers/${product.supplierSlug}`}
                  className="mt-1 block text-sm text-muted-foreground hover:text-secondary"
                  onClick={(e) => e.stopPropagation()}
                >
                  by {product.supplierName}
                </Link>
                <div className="mt-4 flex flex-col min-[350px]:flex-row min-[350px]:items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">MOQ:</span>
                    <span className="font-medium text-foreground">{product.moq.toLocaleString()} {product.moqUnit}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Lead:</span>
                    <span className="font-medium text-foreground">{product.leadTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
