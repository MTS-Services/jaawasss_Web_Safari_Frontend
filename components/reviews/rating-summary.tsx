"use client"

import { Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface RatingSummaryProps {
  average: number
  total: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function RatingSummary({ average, total, distribution }: RatingSummaryProps) {
  const getPercentage = (count: number) => {
    if (total === 0) return 0
    return Math.round((count / total) * 100)
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
      {/* Overall Rating */}
      <div className="text-center sm:text-left">
        <div className="text-5xl font-bold text-foreground">{average}</div>
        <div className="mt-2 flex items-center justify-center gap-1 sm:justify-start">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= Math.round(average)
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          Based on {total} {total === 1 ? "review" : "reviews"}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-3">
            <div className="flex w-16 items-center gap-1 text-sm">
              <span>{rating}</span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </div>
            <Progress 
              value={getPercentage(distribution[rating as keyof typeof distribution])} 
              className="h-2 flex-1"
            />
            <div className="w-12 text-right text-sm text-muted-foreground">
              {getPercentage(distribution[rating as keyof typeof distribution])}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
