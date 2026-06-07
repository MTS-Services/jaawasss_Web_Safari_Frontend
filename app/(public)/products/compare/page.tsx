"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProducts, type Product } from "@/lib/api/products"
import { useFavorites } from "@/lib/favorites-context"
import { ChevronRight, Scale, X, Package, Clock, FileText, Layers3, Sparkles } from "lucide-react"

function ComparisonRow({
  label,
  icon,
  children,
}: {
  label: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div className="grid gap-4 border-t border-border py-4 first:border-t-0" style={{ gridTemplateColumns: "220px 1fr" }}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>
    </div>
  )
}

export default function ProductComparePage() {
  const {
    productCompareList,
    addProductToCompare,
    removeProductFromCompare,
    clearProductCompareList,
    productCompareCount,
    maxProductCompare,
  } = useFavorites()

  const [catalog, setCatalog] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      try {
        const catalogResponse = await getProducts()

        if (cancelled) return

        setCatalog(catalogResponse.data || [])
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [productCompareList])

  const selectedProducts = useMemo(() => {
    return productCompareList
      .map((compareKey) => catalog.find((product) => product.id.toString() === compareKey || product.slug === compareKey))
      .filter((product): product is Product => Boolean(product))
  }, [catalog, productCompareList])

  const availableProducts = catalog.filter(
    (product) => !productCompareList.includes(product.slug) && !productCompareList.includes(product.id.toString())
  )

  const handleAddProduct = (slug: string) => {
    const product = catalog.find((item) => item.slug === slug)
    if (product && productCompareCount < maxProductCompare) {
      addProductToCompare(product)
    }
  }

  const hasSelection = selectedProducts.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="border-b border-border bg-muted/40">
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
              <span className="font-medium text-foreground">Compare</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-3 font-serif text-2xl font-medium text-foreground sm:text-3xl">
                <Scale className="h-8 w-8 text-secondary" />
                Compare Products
              </h1>
              <p className="mt-2 text-muted-foreground">
                Compare up to {maxProductCompare} products side by side.
              </p>
            </div>

            <Select onValueChange={handleAddProduct}>
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Add product to compare" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.length > 0 ? (
                  availableProducts.map((product) => (
                    <SelectItem key={product.slug} value={product.slug}>
                      {product.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">Maximum products added</div>
                )}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="mt-12 rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
              Loading comparison...
            </div>
          ) : !hasSelection ? (
            <div className="mt-12 rounded-2xl border border-dashed border-border py-16 text-center">
              <Scale className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <h2 className="mt-6 text-xl font-semibold text-foreground">No Products Selected</h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Add products from the dropdown above or browse the catalog to start comparing.
              </p>
              <Button asChild className="mt-6">
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                <div className="min-w-225 p-6">
                  <div className="grid gap-4 pb-6" style={{ gridTemplateColumns: `220px repeat(${selectedProducts.length}, minmax(0, 1fr))` }}>
                    <div className="text-sm font-medium text-muted-foreground">Selected Products</div>
                    {selectedProducts.map((product) => (
                      <div key={product.slug} className="rounded-xl border border-border bg-muted/30 p-4 relative">
                        <button
                          onClick={() => removeProductFromCompare(product.slug)}
                          className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <div className="space-y-2 pr-8">
                          <Badge variant="secondary" className="w-fit">{product.category.name}</Badge>
                          <Link href={`/products/${product.id}`} className="block text-lg font-semibold text-foreground hover:text-secondary">
                            {product.name}
                          </Link>
                          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <ComparisonRow label="Price" icon={<FileText className="h-4 w-4" />}>
                    {selectedProducts.map((product) => {
                      const minPrice = product.pricing_quantities.min_price.price.amount
                      const maxPrice = product.pricing_quantities.max_price.price.amount

                      return (
                        <div key={product.slug} className="rounded-lg border border-border p-4">
                          <div className="text-base font-semibold text-foreground">
                            ${minPrice} - ${maxPrice}
                          </div>
                          <div className="text-sm text-muted-foreground">/ {product.pricing_quantities.unit}</div>
                        </div>
                      )
                    })}
                  </ComparisonRow>

                  <ComparisonRow label="Minimum Order" icon={<Package className="h-4 w-4" />}>
                    {selectedProducts.map((product) => (
                      <div key={product.slug} className="rounded-lg border border-border p-4">
                        <div className="text-sm text-muted-foreground">MOQ</div>
                        <div className="font-semibold text-foreground">
                          {product.pricing_quantities.minimum_order_quantity} {product.pricing_quantities.unit}
                        </div>
                      </div>
                    ))}
                  </ComparisonRow>

                  <ComparisonRow label="Lead Time" icon={<Clock className="h-4 w-4" />}>
                    {selectedProducts.map((product) => (
                      <div key={product.slug} className="rounded-lg border border-border p-4">
                        <div className="text-sm text-muted-foreground">Lead Time</div>
                        <div className="font-semibold text-foreground">{product.pricing_quantities.lead_time}</div>
                      </div>
                    ))}
                  </ComparisonRow>

                  <ComparisonRow label="Customization" icon={<Sparkles className="h-4 w-4" />}>
                    {selectedProducts.map((product) => (
                      <div key={product.slug} className="rounded-lg border border-border p-4">
                        <div className="text-sm text-muted-foreground">Options</div>
                        <div className="font-semibold text-foreground">
                          {product.customization_options.length > 0 ? `${product.customization_options.length} options` : "Not specified"}
                        </div>
                      </div>
                    ))}
                  </ComparisonRow>

                  <ComparisonRow label="Shipping" icon={<Layers3 className="h-4 w-4" />}>
                    {selectedProducts.map((product) => (
                      <div key={product.slug} className="rounded-lg border border-border p-4">
                        <div className="text-sm text-muted-foreground">Methods</div>
                        <div className="font-semibold text-foreground">
                          {product.shipping_methods.length > 0
                            ? product.shipping_methods.map((method) => method.name).join(", ")
                            : "Not specified"}
                        </div>
                      </div>
                    ))}
                  </ComparisonRow>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                  {productCompareCount} product{productCompareCount === 1 ? "" : "s"} in comparison
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={clearProductCompareList}>
                    Clear All
                  </Button>
                  <Button asChild>
                    <Link href="/products">Browse More Products</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
