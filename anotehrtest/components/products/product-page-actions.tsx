"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFavorites } from "@/lib/favorites-context"
import { Product } from "@/lib/data/products"
import { ReportDialog } from "@/components/report/report-dialog"
import { Heart, MessageSquare, FileText, Scale, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductPageActionsProps {
  product: Product
}

export function ProductPageActions({ product }: ProductPageActionsProps) {
  const router = useRouter()
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
  
  const isSaved = isProductSaved(product.id)
  const supplierInCompare = isInCompare(product.supplierId)

  const handleFavoriteClick = () => {
    if (isSaved) {
      removeProductFromFavorites(product.id)
    } else {
      addProductToFavorites(product)
    }
  }

  const handleCompareClick = () => {
    if (supplierInCompare) {
      removeFromCompare(product.supplierId)
    } else {
      addToCompare(product.supplierId)
    }
  }

  return (
    <div className="mt-8 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1 gap-2" asChild>
          <Link href={`/rfq/new?product=${product.slug}`}>
            <FileText className="h-4 w-4" />
            Request Quote
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="flex-1 gap-2" asChild>
          <Link href={`/messages/new?supplier=${product.supplierSlug}`}>
            <MessageSquare className="h-4 w-4" />
            Contact Supplier
          </Link>
        </Button>
      </div>
      
      <div className="flex gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                variant={isSaved ? "secondary" : "outline"}
                className="flex-1 gap-2"
                onClick={handleFavoriteClick}
              >
                <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
                {isSaved ? "Saved" : "Save Product"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isSaved ? "Remove from favorites" : "Save to favorites"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                variant={supplierInCompare ? "secondary" : "outline"}
                className="flex-1 gap-2"
                onClick={handleCompareClick}
                disabled={!supplierInCompare && compareCount >= maxCompare}
              >
                <Scale className="h-4 w-4" />
                {supplierInCompare ? "Supplier in Compare" : "Compare Supplier"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {supplierInCompare 
                ? "Remove supplier from comparison" 
                : compareCount >= maxCompare 
                  ? `Maximum ${maxCompare} suppliers` 
                  : "Add supplier to comparison"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {compareCount >= 2 && (
        <Button 
          size="lg" 
          variant="default"
          className="w-full gap-2"
          onClick={() => router.push("/suppliers/compare")}
        >
          <Scale className="h-4 w-4" />
          Compare Suppliers ({compareCount})
        </Button>
      )}

      {/* Report Button */}
      <ReportDialog type="product" targetId={product.id} targetName={product.name}>
        <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground hover:text-destructive">
          <Flag className="h-4 w-4" />
          Report Product
        </Button>
      </ReportDialog>
    </div>
  )
}
