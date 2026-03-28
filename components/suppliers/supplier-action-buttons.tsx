"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFavorites } from "@/lib/favorites-context"
import { Supplier } from "@/lib/data/suppliers"
import { Heart, Scale, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SupplierActionButtonsProps {
  supplier: Supplier
  variant?: "icon" | "full"
  className?: string
}

export function SupplierActionButtons({ 
  supplier, 
  variant = "icon",
  className 
}: SupplierActionButtonsProps) {
  const router = useRouter()
  const { 
    addSupplierToFavorites, 
    removeSupplierFromFavorites, 
    isSupplierSaved,
    addToCompare,
    removeFromCompare,
    isInCompare,
    compareCount,
    maxCompare
  } = useFavorites()
  
  const [showSavedFeedback, setShowSavedFeedback] = useState(false)
  const [showCompareFeedback, setShowCompareFeedback] = useState(false)
  
  const isSaved = isSupplierSaved(supplier.id)
  const inCompare = isInCompare(supplier.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isSaved) {
      removeSupplierFromFavorites(supplier.id)
    } else {
      addSupplierToFavorites(supplier)
      setShowSavedFeedback(true)
      setTimeout(() => setShowSavedFeedback(false), 2000)
    }
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (inCompare) {
      removeFromCompare(supplier.id)
    } else {
      const added = addToCompare(supplier.id)
      if (added) {
        setShowCompareFeedback(true)
        setTimeout(() => setShowCompareFeedback(false), 2000)
      }
    }
  }

  const goToCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/suppliers/compare")
  }

  if (variant === "full") {
    return (
      <div className={cn("flex gap-2", className)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isSaved ? "secondary" : "outline"}
                size="sm"
                onClick={handleFavoriteClick}
                className="gap-2"
              >
                <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isSaved ? "Remove from favorites" : "Add to favorites"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={inCompare ? "secondary" : "outline"}
                size="sm"
                onClick={handleCompareClick}
                disabled={!inCompare && compareCount >= maxCompare}
                className="gap-2"
              >
                {inCompare ? (
                  <>
                    <Check className="h-4 w-4" />
                    In Compare
                  </>
                ) : (
                  <>
                    <Scale className="h-4 w-4" />
                    Compare
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {inCompare 
                ? "Remove from comparison" 
                : compareCount >= maxCompare 
                  ? `Maximum ${maxCompare} suppliers` 
                  : "Add to comparison"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {compareCount > 0 && (
          <Button
            variant="default"
            size="sm"
            onClick={goToCompare}
            className="gap-2"
          >
            Compare ({compareCount})
          </Button>
        )}
      </div>
    )
  }

  // Icon variant for cards
  return (
    <div className={cn("flex gap-1", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteClick}
              className={cn(
                "h-8 w-8 rounded-full",
                isSaved && "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
              )}
            >
              <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {showSavedFeedback ? "Saved!" : isSaved ? "Remove from favorites" : "Save supplier"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCompareClick}
              disabled={!inCompare && compareCount >= maxCompare}
              className={cn(
                "h-8 w-8 rounded-full",
                inCompare && "bg-secondary/20 text-secondary hover:bg-secondary/30"
              )}
            >
              {inCompare ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {showCompareFeedback 
              ? "Added to compare!" 
              : inCompare 
                ? "Remove from compare" 
                : compareCount >= maxCompare 
                  ? `Max ${maxCompare} suppliers` 
                  : "Add to compare"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
