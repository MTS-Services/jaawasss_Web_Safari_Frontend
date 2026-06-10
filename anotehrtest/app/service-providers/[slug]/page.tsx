"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RequestServiceDialog } from "@/components/service-providers/request-service-dialog"
import { ProviderReviews } from "@/components/service-providers/provider-reviews"
import {
  getServiceProviderBySlug,
  getServiceProvidersByCategory,
  getAvailabilityLabel,
  startingPriceLabel,
  REVIEWED_TOOLTIP,
} from "@/lib/data/service-providers"
import { getCountryByCode } from "@/lib/data/countries"
import { ServiceProviderCard } from "@/components/service-providers/service-provider-card"
import {
  MapPin,
  Star,
  Globe,
  CheckCircle,
  Clock,
  Briefcase,
  Award,
  MessageSquare,
  ChevronRight,
  Check,
  Calendar,
  Wifi,
  MapPinned,
  ImageIcon,
} from "lucide-react"

export default function ServiceProviderProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const provider = getServiceProviderBySlug(slug)

  if (!provider) {
    notFound()
  }

  const related = getServiceProvidersByCategory(provider.categorySlug)
    .filter((p) => p.id !== provider.id)
    .slice(0, 3)

  const AvailabilityIcon =
    provider.availability === "remote" ? Wifi : provider.availability === "local" ? MapPinned : Globe

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-3 text-sm text-muted-foreground sm:px-6 lg:px-8">
            <Link href="/service-providers" className="hover:text-foreground">
              Service Providers
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/service-providers?category=${provider.categorySlug}`} className="hover:text-foreground">
              {provider.categoryName}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="truncate text-foreground">{provider.name}</span>
          </div>
        </div>

        {/* Header */}
        <section className="bg-primary py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-5">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/10">
                  <Briefcase className="h-10 w-10 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-serif text-2xl font-medium text-primary-foreground sm:text-3xl">
                      {provider.name}
                    </h1>
                    {provider.reviewed && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary" className="cursor-help gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Reviewed Service Provider
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-pretty">{REVIEWED_TOOLTIP}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <p className="mt-1 text-secondary-foreground/90 text-primary-foreground/80">{provider.categoryName}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary-foreground/80">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {provider.location.city}, {provider.location.country}
                    </span>
                    <a href="#reviews" className="flex items-center gap-1 transition-opacity hover:opacity-80">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {provider.rating} ({provider.reviewCount} reviews)
                    </a>
                    <span className="flex items-center gap-1">
                      <AvailabilityIcon className="h-4 w-4" />
                      {getAvailabilityLabel(provider.availability)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-3">
                <Button variant="secondary" size="lg" className="gap-2 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" asChild>
                  <Link href={`/messages/new?provider=${provider.slug}`}>
                    <MessageSquare className="h-4 w-4" />
                    Contact
                  </Link>
                </Button>
                <RequestServiceDialog
                  provider={provider}
                  trigger={
                    <Button size="lg" variant="secondary" className="cursor-pointer gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                      Request Service
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main */}
              <div className="space-y-8 lg:col-span-2">
                {/* About */}
                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground">About</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{provider.description}</p>
                </div>

                <Separator />

                {/* Services offered */}
                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground">Services offered</h2>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {provider.servicesOffered.map((service) => (
                      <div key={service} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
                        <Check className="h-4 w-4 flex-shrink-0 text-secondary" />
                        <span className="text-sm text-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Portfolio */}
                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground">Portfolio</h2>
                  {provider.portfolio.length > 0 ? (
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {provider.portfolio.map((src, i) => (
                        <div
                          key={src}
                          className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-border bg-muted"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src || "/placeholder.svg"}
                            alt={`${provider.name} portfolio item ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-12 text-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Portfolio available on request. Contact the provider for samples.
                      </p>
                    </div>
                  )}
                </div>

                {provider.certifications && provider.certifications.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h2 className="font-serif text-xl font-medium text-foreground">Documents & certifications</h2>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {provider.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="gap-1">
                            <Award className="h-3 w-3" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Reviews */}
                <ProviderReviews provider={provider} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Starting price</span>
                      <span className="font-serif text-xl font-medium text-foreground">
                        {startingPriceLabel(provider)}
                      </span>
                    </div>
                    <Separator className="my-4" />
                    <dl className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-2 text-muted-foreground">
                          <AvailabilityIcon className="h-4 w-4" />
                          Availability
                        </dt>
                        <dd className="font-medium text-foreground">{getAvailabilityLabel(provider.availability)}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Delivery time
                        </dt>
                        <dd className="font-medium text-foreground">{provider.deliveryTime}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-2 text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          Response time
                        </dt>
                        <dd className="font-medium text-foreground">{provider.responseTime}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Experience
                        </dt>
                        <dd className="font-medium text-foreground">{provider.experienceYears} years</dd>
                      </div>
                    </dl>
                    <RequestServiceDialog
                      provider={provider}
                      trigger={
                        <Button className="mt-5 w-full cursor-pointer">Request Service</Button>
                      }
                    />
                    <Button variant="outline" className="mt-2 w-full bg-transparent gap-2" asChild>
                      <Link href={`/messages/new?provider=${provider.slug}`}>
                        <MessageSquare className="h-4 w-4" />
                        Contact provider
                      </Link>
                    </Button>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-semibold text-foreground">Languages</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {provider.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="gap-1">
                          <Globe className="h-3 w-3" />
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {provider.serviceCountries && provider.serviceCountries.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="text-sm font-semibold text-foreground">Serves these countries</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {provider.serviceCountries.map((code) => (
                          <Badge key={code} variant="secondary" className="gap-1">
                            <MapPin className="h-3 w-3" />
                            {getCountryByCode(code)?.name ?? code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="font-serif text-xl font-medium text-foreground">
                  More in {provider.categoryName}
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {related.map((p) => (
                    <ServiceProviderCard key={p.id} provider={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
