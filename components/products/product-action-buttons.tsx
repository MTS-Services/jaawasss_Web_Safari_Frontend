"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFavorites } from "@/lib/favorites-context"
import { Product } from "@/lib/data/products"
import { Heart, MessageSquare, FileText, Scale } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductActionButtonsProps {
  product: Product
  variant?: "icon" | "full"
  className?: string
}

export function ProductActionButtons({ 
  product, 
  variant = "icon",
  className 
}: ProductActionButtonsProps) {
  const { 
    addProductToFavorites, 
    removeProductFromFavorites, 
    isProductSaved,
    addProductToCompare,
    removeProductFromCompare,
    isProductInCompare,
    productCompareCount,
    maxProductCompare
  } = useFavorites()
  
  const isSaved = isProductSaved(product.id)
  const productInCompare = isProductInCompare(product.slug)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isSaved) {
      removeProductFromFavorites(product.id)
    } else {
      addProductToFavorites(product)
    }
  }

  const handleCompareSupplierClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (productInCompare) {
      removeProductFromCompare(product.slug)
      return
    }

    if (productCompareCount < maxProductCompare) {
      addProductToCompare(product)
    }
  }

  if (variant === "full") {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <Button size="lg" className="gap-2" asChild>
          <Link href={`/messages/new?supplier=${product.supplierSlug}&product=${product.slug}`}>
            <MessageSquare className="h-4 w-4" />
            Contact Supplier
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="gap-2" asChild>
          <Link href={`/rfq/new?supplier=${product.supplierSlug}&product=${product.slug}`}>
            <FileText className="h-4 w-4" />
            Request Quote
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Button
            size="lg"
            variant={isSaved ? "secondary" : "outline"}
            className="flex-1 gap-2"
            onClick={handleFavoriteClick}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
            {isSaved ? "Saved" : "Save Product"}
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleCompareSupplierClick}
                  disabled={!productInCompare && productCompareCount >= maxProductCompare}
                >
                  <Scale className="h-4 w-4" />
                  {productInCompare ? "In Compare" : "Compare"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {productInCompare 
                  ? "Remove from comparison" 
                  : productCompareCount >= maxProductCompare 
                    ? `Maximum ${maxProductCompare} products` 
                    : "Add product to comparison"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    )
  }

  // Icon variant for cards
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className={cn(
              "h-8 w-8 rounded-full",
              isSaved && "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600",
              className
            )}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isSaved ? "Remove from favorites" : "Save product"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
