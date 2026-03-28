"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/lib/favorites-context"
import { suppliers } from "@/lib/data/suppliers"
import { Scale, X, ArrowRight, Factory } from "lucide-react"
import { cn } from "@/lib/utils"

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompareList, maxCompare } = useFavorites()
  
  if (compareList.length === 0) return null

  const compareSuppliers = compareList
    .map(id => suppliers.find(s => s.id === id))
    .filter(Boolean)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Scale className="h-5 w-5 text-secondary" />
              <span>Compare Suppliers ({compareList.length}/{maxCompare})</span>
            </div>
            
            <div className="flex items-center gap-2">
              {compareSuppliers.map((supplier) => (
                <div
                  key={supplier!.id}
                  className="flex items-center gap-2 rounded-full bg-muted py-1 pl-3 pr-1 text-sm"
                >
                  <Factory className="h-3 w-3 text-muted-foreground" />
                  <span className="max-w-[100px] truncate text-foreground">{supplier!.name}</span>
                  <button
                    onClick={() => removeFromCompare(supplier!.id)}
                    className="rounded-full p-1 hover:bg-muted-foreground/10"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearCompareList}>
              Clear All
            </Button>
            <Button size="sm" asChild disabled={compareList.length < 2}>
              <Link href="/suppliers/compare" className={cn(compareList.length < 2 && "pointer-events-none opacity-50")}>
                Compare Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
