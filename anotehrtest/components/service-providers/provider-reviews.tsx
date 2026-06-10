"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import {
  getProviderReviews,
  getRatingBreakdown,
  type ServiceProvider,
} from "@/lib/data/service-providers"

function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${className} ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

export function ProviderReviews({ provider }: { provider: ServiceProvider }) {
  const allReviews = getProviderReviews(provider)
  const breakdown = getRatingBreakdown(provider)
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? allReviews : allReviews.slice(0, 3)

  return (
    <div id="reviews" className="scroll-mt-24">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-medium text-foreground">
          Reviews{" "}
          <span className="text-muted-foreground">({provider.reviewCount})</span>
        </h2>
      </div>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-1 gap-6 rounded-xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr] sm:gap-8">
        <div className="flex flex-col items-center justify-center text-center sm:px-4">
          <span className="font-serif text-4xl font-medium text-foreground">{provider.rating.toFixed(1)}</span>
          <Stars rating={provider.rating} className="mt-1.5 h-4 w-4" />
          <span className="mt-1 text-xs text-muted-foreground">{provider.reviewCount} reviews</span>
        </div>
        <div className="flex flex-col justify-center gap-1.5 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          {breakdown.map((row) => {
            const pct = provider.reviewCount > 0 ? (row.count / provider.reviewCount) * 100 : 0
            return (
              <div key={row.stars} className="flex items-center gap-3 text-sm">
                <span className="flex w-10 flex-shrink-0 items-center gap-1 text-muted-foreground">
                  {row.stars}
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 flex-shrink-0 text-right text-xs text-muted-foreground">{row.count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Individual reviews */}
      <ul className="mt-6 space-y-5">
        {visible.map((review) => (
          <li key={review.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10 font-medium text-secondary">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{review.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.company} · {review.country}
                  </p>
                </div>
              </div>
              <span className="flex-shrink-0 text-xs text-muted-foreground">{review.date}</span>
            </div>
            <div className="mt-3">
              <Stars rating={review.rating} className="h-3.5 w-3.5" />
              <p className="mt-2 font-medium text-foreground">{review.title}</p>
              <p className="mt-1 leading-relaxed text-muted-foreground">{review.comment}</p>
            </div>
          </li>
        ))}
      </ul>

      {allReviews.length > 3 && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-5 text-sm font-medium text-secondary hover:underline"
        >
          {showAll ? "Show fewer reviews" : `Show all ${allReviews.length} reviews`}
        </button>
      )}
    </div>
  )
}
