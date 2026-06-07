"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Clock, CheckCircle, Building2 } from "lucide-react"
import { getFeaturedSuppliers } from "@/lib/data/suppliers"
import { useTranslation } from "@/lib/i18n"

const featuredSuppliers = getFeaturedSuppliers().slice(0, 4)

export function FeaturedSuppliersSection() {
  const { t } = useTranslation()
  return (
    <section className="bg-muted/50 py-8 sm:py-12 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {t.landing.featured.suppliersTitle}
            </h2>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              {t.landing.featured.suppliersSubtitle}
            </p>
          </div>
          <Button variant="outline" className="h-11 gap-2 px-6" asChild>
            <Link href="/suppliers">
              {t.landing.featured.viewAllSuppliers}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {featuredSuppliers.map((supplier) => (
            <Link
              key={supplier.id}
              href={`/suppliers/${supplier.slug}`}
              className="group w-full min-w-0 overflow-hidden flex flex-col justify-between rounded-2xl border border-border bg-card p-4 sm:p-6 transition-all duration-300 hover:border-secondary/50 hover:shadow-xl"
            >
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:h-14 sm:w-14">
                      <Building2 className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-secondary truncate">
                          {supplier.name}
                        </h3>
                        {supplier.reviewed && (
                          <CheckCircle className="h-4 w-4 shrink-0 text-secondary" />
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{supplier.location.city}, {supplier.location.country}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {supplier.responseTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit shrink-0 font-medium">
                    {supplier.industry}
                  </Badge>
                </div>
                <p className="mt-4 sm:mt-5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {supplier.shortDescription}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 pt-2 max-w-full overflow-hidden">
                {supplier.mainProducts.slice(0, 3).map((product) => (
                  <Badge key={product} variant="outline" className="bg-background/50 font-normal truncate max-w-full">
                    {product}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
