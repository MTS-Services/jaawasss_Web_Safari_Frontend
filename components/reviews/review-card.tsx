"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp, CheckCircle, Flag, MessageSquare } from "lucide-react"
import type { Review } from "@/lib/data/reviews"

interface ReviewCardProps {
  review: Review
  showSupplierResponse?: boolean
}

export function ReviewCard({ review, showSupplierResponse = true }: ReviewCardProps) {
  const [helpful, setHelpful] = useState(review.helpful)
  const [hasVoted, setHasVoted] = useState(false)

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpful(prev => prev + 1)
      setHasVoted(true)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
            {review.buyerName.split(" ").map(n => n[0]).join("")}
          </div>
          
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">{review.buyerName}</span>
              {review.reviewed && (
                <Badge variant="outline" className="gap-1 bg-green-50 border-green-200 text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  Reviewed Buyer
                </Badge>
              )}
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              {review.buyerCompany && <span>{review.buyerCompany} • </span>}
              {review.buyerCountry}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {formatDate(review.date)}
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="mt-4">
        {review.title && (
          <h4 className="font-semibold text-foreground">{review.title}</h4>
        )}
        <p className="mt-2 text-muted-foreground leading-relaxed">
          {review.content}
        </p>
      </div>

      {/* Order Details */}
      {review.orderDetails && (
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge variant="secondary" className="font-normal">
            {review.orderDetails.productCategory}
          </Badge>
          <Badge variant="outline" className="font-normal">
            Order: {review.orderDetails.orderValue}
          </Badge>
        </div>
      )}

      {/* Supplier Response */}
      {showSupplierResponse && review.supplierResponse && (
        <div className="mt-4 rounded-lg bg-muted/50 p-4 border-l-4 border-secondary">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-secondary" />
            <span className="font-semibold text-sm text-foreground">Supplier Response</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.supplierResponse.date)}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {review.supplierResponse.content}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${hasVoted ? "text-secondary" : ""}`}
          onClick={handleHelpful}
          disabled={hasVoted}
        >
          <ThumbsUp className={`h-4 w-4 ${hasVoted ? "fill-current" : ""}`} />
          Helpful ({helpful})
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Flag className="h-4 w-4" />
          Report
        </Button>
      </div>
    </div>
  )
}
