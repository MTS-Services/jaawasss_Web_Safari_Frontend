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
import { Supplier } from "@/lib/data/suppliers"
import { ReportDialog } from "@/components/report/report-dialog"
import { Heart, Scale, Check, MessageSquare, FileText, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

interface SupplierPageActionsProps {
  supplier: Supplier
}

export function SupplierPageActions({ supplier }: SupplierPageActionsProps) {
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
  
  const isSaved = isSupplierSaved(supplier.id)
  const inCompare = isInCompare(supplier.id)

  const handleFavoriteClick = () => {
    if (isSaved) {
      removeSupplierFromFavorites(supplier.id)
    } else {
      addSupplierToFavorites(supplier)
    }
  }

  const handleCompareClick = () => {
    if (inCompare) {
      removeFromCompare(supplier.id)
    } else {
      addToCompare(supplier.id)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
      <Button size="lg" className="gap-2" asChild>
        <Link href={`/messages/new?supplier=${supplier.slug}`}>
          <MessageSquare className="h-4 w-4" />
          Contact Supplier
        </Link>
      </Button>
      <Button size="lg" variant="outline" className="gap-2" asChild>
        <Link href={`/rfq/new?supplier=${supplier.slug}`}>
          <FileText className="h-4 w-4" />
          Request Quote
        </Link>
      </Button>
      
      <div className="flex gap-2 sm:gap-3">
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
                {isSaved ? "Saved" : "Save"}
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
                variant={inCompare ? "secondary" : "outline"}
                className="flex-1 gap-2"
                onClick={handleCompareClick}
                disabled={!inCompare && compareCount >= maxCompare}
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
      </div>

      {compareCount >= 2 && (
        <Button 
          size="lg" 
          variant="default"
          className="gap-2"
          onClick={() => router.push("/suppliers/compare")}
        >
          <Scale className="h-4 w-4" />
          Compare ({compareCount})
        </Button>
      )}

      {/* Report Button */}
      <ReportDialog type="supplier" targetId={supplier.id} targetName={supplier.name}>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
          <Flag className="h-4 w-4" />
          Report Supplier
        </Button>
      </ReportDialog>
    </div>
  )
}
