"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n"
import { getAllPublicCategories, type BackendCategory } from "@/lib/api/categories"
import DynamicIcon from "@/components/dynamic-icon"
import { ArrowRight, Factory } from "lucide-react"

interface Industry {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  supplierCount: number
  productCount: number
  featured?: boolean
  /** Sub-industry rows from API `sub_categories`, shown as tag chips. */
  categories: { id: string; name: string }[]
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

function mapCategoryToIndustry(category: BackendCategory): Industry {
  const subs = category.sub_categories?.length
    ? category.sub_categories
    : category.subcategories ?? []

  return {
    id: String(category.id),
    name: category.name,
    slug: (category.slug && category.slug.trim()) || slugify(category.name),
    description: category.description ?? "",
    icon: category.icon?.trim() || "Package",
    icon_color: category.icon_color,
    supplierCount: category.supplier_count ?? 0,
    productCount: category.product_count ?? 0,
    featured: Number(category.featured) === 1,
    categories: subs.map((sub) => ({
      id: String(sub.id),
      name: sub.name,
    })),
  }
}

export function IndustriesPageContent() {
  const { t } = useTranslation()
  const [industries, setIndustries] = useState<Industry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      setIsLoading(true)
      setLoadError(null)
      const res = await getAllPublicCategories({ perPage: 50 })
      if (cancelled) return
      if (!res.success) {
        setIndustries([])
        setLoadError(res.message || "Failed to load industries.")
        setIsLoading(false)
        return
      }
      setIndustries(res.data.map(mapCategoryToIndustry))
      setIsLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const totalSuppliers = industries.reduce((acc, ind) => acc + ind.supplierCount, 0)
  const totalProducts = industries.reduce((acc, ind) => acc + ind.productCount, 0)
  const totalSubcategories = industries.reduce((acc, ind) => acc + ind.categories.length, 0)

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-secondary/20 text-primary-foreground">
              {t?.landing?.industries?.majorIndustriesBadge || "Major Industries"}{" "}
              {isLoading ? "" : `(${industries.length})`}
            </Badge>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              {t?.landing?.industries?.pageTitle || "Explore Industries"}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
              {t?.landing?.industries?.pageDescription ||
                "Discover reviewed manufacturers and suppliers across all major industries. From electronics to textiles, find the perfect partner for your business."}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">
                {isLoading ? "—" : industries.length}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t?.landing?.industries?.majorIndustriesBadge || "Industries"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">{isLoading ? "—" : totalSubcategories}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t?.landing?.industries?.categoriesLabel || "Categories"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">
                {isLoading ? "—" : `${Math.max(0, (totalSuppliers / 1000) || 0).toFixed(0)}K+`}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t?.landing?.industries?.suppliersLabel || "Suppliers"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">
                {isLoading ? "—" : `${Math.max(0, (totalProducts / 1000) || 0).toFixed(0)}K+`}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t?.landing?.industries?.productsLabel || "Products"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {loadError && (
        <section className="border-b border-border bg-destructive/10 py-4 text-center text-sm text-destructive">
          {loadError}
        </section>
      )}

      {/* Industries Grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-border bg-card p-6 animate-pulse"
                >
                  <div className="h-14 w-14 rounded-xl bg-muted" />
                  <div className="mt-5 h-6 w-3/4 rounded bg-muted" />
                  <div className="mt-3 h-4 w-full rounded bg-muted" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-muted" />
                  <div className="mt-4 flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-muted" />
                    <div className="h-6 w-20 rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry) => (
                <div
                  key={industry.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                        <DynamicIcon
                          name={industry.icon}
                          size={32}
                          className="h-8 w-8"
                          fallback={<Factory className="h-8 w-8" />}
                        />
                      </div>
                      {industry.featured && (
                        <Badge variant="secondary">{t?.landing?.industries?.featuredBadge || "Featured"}</Badge>
                      )}
                    </div>

                    <h2 className="mt-5 font-serif text-xl font-medium text-foreground group-hover:text-secondary transition-colors">
                      {industry.name}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{industry.description}</p>

                    <div className="mt-4 flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Factory className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{industry.supplierCount.toLocaleString()}</span>
                        <span className="text-muted-foreground">
                          {t?.landing?.industries?.suppliersLabel || "Suppliers"}
                        </span>
                      </div>
                    </div>

                    {industry.categories.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {industry.categories.slice(0, 3).map((category) => (
                            <span
                              key={category.id}
                              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {category.name}
                            </span>
                          ))}
                          {industry.categories.length > 3 && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {(() => {
                                const n = industry.categories.length - 3
                                const tpl = t?.landing?.industries?.moreCategories
                                if (typeof tpl === "string" && tpl.includes("{count}")) {
                                  return tpl.replace(/\{count\}/g, String(n))
                                }
                                return `+${n} more`
                              })()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex items-center gap-3">
                      <Button size="sm" className="gap-2" asChild>
                        <Link href={`/industries/${industry.slug}`}>
                          {t?.landing?.industries?.exploreButton || "Explore"}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/suppliers?industry=${industry.slug}`}>
                          {t?.landing?.industries?.suppliersButton || "Suppliers"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-medium text-foreground">
              {t?.landing?.industries?.cantFindTitle || "Can't find your industry?"}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t?.landing?.industries?.cantFindDesc ||
                "We're constantly expanding our network. Contact us to learn about upcoming industries."}
            </p>
            <Button className="mt-8 gap-2" asChild>
              <Link href="/contact">
                {t?.landing?.industries?.contactUsButton || "Contact Us"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
