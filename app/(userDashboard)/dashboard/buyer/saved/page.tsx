"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFavorites } from "@/lib/favorites-context"
import { 
  Factory,
  Package,
  Star,
  MapPin,
  Trash2,
  ExternalLink,
  CheckCircle,
  Heart,
  Scale
} from "lucide-react"

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
}

export default function BuyerSavedPage() {
  const { 
    savedSuppliers, 
    savedProducts, 
    removeSupplierFromFavorites, 
    removeProductFromFavorites,
    addToCompare,
    isInCompare,
    compareCount,
    maxCompare
  } = useFavorites()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Saved Suppliers & Products</h1>
          <p className="mt-1 text-muted-foreground">
            Suppliers and products you've saved by clicking the heart icon
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
          <span className="text-sm text-muted-foreground">
            {savedSuppliers.length + savedProducts.length} saved
          </span>
        </div>
      </div>

      <Tabs defaultValue="suppliers">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-grid">
          <TabsTrigger value="suppliers" className="gap-2">
            <Factory className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span> Suppliers ({savedSuppliers.length})
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span> Products ({savedProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="mt-6">
          {savedSuppliers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 font-semibold text-foreground">No saved suppliers</h3>
              <p className="mt-2 text-muted-foreground">
                Browse suppliers and save your favorites for later
              </p>
              <Button className="mt-4" asChild>
                <Link href="/suppliers">Browse Suppliers</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedSuppliers.map((supplier) => (
                <div 
                  key={supplier.id}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Factory className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{supplier.name}</h3>
                        {supplier.reviewed && (
                          <CheckCircle className="h-4 w-4 text-secondary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{supplier.industry}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {supplier.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {supplier.rating} ({supplier.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">Saved {formatTimeAgo(supplier.savedAt)}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (!isInCompare(supplier.id) && compareCount < maxCompare) {
                          addToCompare(supplier.id)
                        }
                      }}
                      disabled={isInCompare(supplier.id) || compareCount >= maxCompare}
                    >
                      <Scale className="mr-2 h-3 w-3" />
                      {isInCompare(supplier.id) ? "In Compare" : "Compare"}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/suppliers/${supplier.slug}`}>
                        View Profile
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeSupplierFromFavorites(supplier.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {compareCount >= 2 && (
            <div className="mt-6 rounded-lg bg-secondary/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-secondary" />
                <span className="font-medium text-foreground">{compareCount} suppliers in comparison</span>
              </div>
              <Button asChild>
                <Link href="/suppliers/compare">Compare Now</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          {savedProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 font-semibold text-foreground">No saved products</h3>
              <p className="mt-2 text-muted-foreground">
                Browse products and save your favorites for later
              </p>
              <Button className="mt-4" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Package className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <Link 
                        href={`/suppliers/${product.supplierSlug}`}
                        className="text-sm text-muted-foreground hover:text-secondary"
                      >
                        by {product.supplier}
                      </Link>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-medium text-foreground">{product.price}</span>
                        <Badge variant="outline">MOQ: {product.moq}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Saved {formatTimeAgo(product.savedAt)}</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/products/${product.slug}`}>
                        View Product
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeProductFromFavorites(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
