import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Clock, CheckCircle, Building2 } from "lucide-react"
import { getFeaturedSuppliers } from "@/lib/data/suppliers"

const featuredSuppliers = getFeaturedSuppliers().slice(0, 4)

export function FeaturedSuppliersSection() {
  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Featured Reviewed Suppliers
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Discover top-rated manufacturers handpicked by our team
            </p>
          </div>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/suppliers">
              View All Suppliers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featuredSuppliers.map((supplier) => (
            <Link
              key={supplier.id}
              href={`/suppliers/${supplier.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-secondary">
                        {supplier.name}
                      </h3>
                      {supplier.reviewed && (
                        <CheckCircle className="h-4 w-4 text-secondary" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {supplier.location.city}, {supplier.location.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {supplier.responseTime}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">{supplier.industry}</Badge>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {supplier.shortDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {supplier.mainProducts.slice(0, 3).map((product) => (
                  <Badge key={product} variant="outline" className="font-normal">
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
