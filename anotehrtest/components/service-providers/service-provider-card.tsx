"use client"

import Link from "next/link"
import type { ServiceProvider } from "@/lib/data/service-providers"
import { getAvailabilityLabel, startingPriceLabel, REVIEWED_TOOLTIP } from "@/lib/data/service-providers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RequestServiceDialog } from "@/components/service-providers/request-service-dialog"
import { MapPin, Star, Globe, Wifi, MapPinned, CheckCircle, Clock, Briefcase } from "lucide-react"

export function ReviewedBadge({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="secondary" className={`flex-shrink-0 cursor-help gap-1 text-xs ${className ?? ""}`}>
          <CheckCircle className="h-3 w-3" />
          Reviewed
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-pretty">{REVIEWED_TOOLTIP}</TooltipContent>
    </Tooltip>
  )
}

function AvailabilityBadge({ provider }: { provider: ServiceProvider }) {
  const label = getAvailabilityLabel(provider.availability)
  const Icon = provider.availability === "remote" ? Wifi : provider.availability === "local" ? MapPinned : Globe
  return (
    <Badge variant="outline" className="gap-1 border-secondary/40 text-secondary">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

export function ServiceProviderCard({ provider }: { provider: ServiceProvider }) {
  return (
    <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-secondary hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Briefcase className="h-7 w-7 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/service-providers/${provider.slug}`}
              className="truncate font-semibold text-foreground group-hover:text-secondary"
            >
              {provider.name}
            </Link>
            {provider.reviewed && <ReviewedBadge />}
          </div>
          <p className="mt-0.5 text-sm text-secondary">{provider.categoryName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {provider.location.city}, {provider.location.country}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {provider.rating} ({provider.reviewCount})
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{provider.shortDescription}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <AvailabilityBadge provider={provider} />
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Globe className="h-3 w-3" />
          {provider.languages.slice(0, 2).join(", ")}
          {provider.languages.length > 2 && ` +${provider.languages.length - 2}`}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {provider.deliveryTime}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <div>
          <span className="text-xs text-muted-foreground">Starting at</span>
          <p className="text-sm font-semibold text-foreground">{startingPriceLabel(provider)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/service-providers/${provider.slug}`}>View Profile</Link>
          </Button>
          <RequestServiceDialog
            provider={provider}
            trigger={
              <Button size="sm" className="cursor-pointer">
                Request
              </Button>
            }
          />
        </div>
      </div>
    </div>
  )
}
