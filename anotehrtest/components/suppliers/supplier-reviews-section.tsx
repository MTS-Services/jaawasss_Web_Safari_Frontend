"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ReviewCard } from "@/components/reviews/review-card"
import { RatingSummary } from "@/components/reviews/rating-summary"
import { ReviewForm } from "@/components/reviews/review-form"
import { Star, PenLine, MessageSquareText } from "lucide-react"
import type { Review } from "@/lib/data/reviews"

interface SupplierReviewsSectionProps {
  supplierId: string
  supplierName: string
  reviews: Review[]
  ratingSummary: {
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
}

type SortOption = "newest" | "highest" | "lowest" | "helpful"

export function SupplierReviewsSection({
  supplierId,
  supplierName,
  reviews,
  ratingSummary
}: SupplierReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [filterRating, setFilterRating] = useState<string>("all")

  const sortedReviews = [...reviews]
    .filter(review => filterRating === "all" || review.rating === parseInt(filterRating))
    .sort((a, b) => {
      switch (sortBy) {
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        case "helpful":
          return b.helpful - a.helpful
        case "newest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

  const handleReviewSubmit = () => {
    // In production, this would refresh the reviews list
    console.log("Review submitted")
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <RatingSummary
            average={ratingSummary.average}
            total={ratingSummary.total}
            distribution={ratingSummary.distribution}
          />
          
          <Button 
            onClick={() => setShowReviewForm(true)}
            className="gap-2 self-start"
            size="lg"
          >
            <PenLine className="h-4 w-4" />
            Write a Review
          </Button>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {sortedReviews.length} of {reviews.length} reviews
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <MessageSquareText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-semibold text-foreground">No Reviews Yet</h3>
            <p className="mt-2 text-muted-foreground">
              {filterRating !== "all" 
                ? "No reviews match your filter criteria"
                : "Be the first to share your experience with this supplier"
              }
            </p>
            {filterRating === "all" && (
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="mt-4 gap-2"
              >
                <PenLine className="h-4 w-4" />
                Write the First Review
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Load More */}
      {sortedReviews.length > 0 && sortedReviews.length >= 5 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Reviews
          </Button>
        </div>
      )}

      {/* Review Form Dialog */}
      <ReviewForm
        supplierId={supplierId}
        supplierName={supplierName}
        open={showReviewForm}
        onOpenChange={setShowReviewForm}
        onSubmit={handleReviewSubmit}
      />
    </div>
  )
}
