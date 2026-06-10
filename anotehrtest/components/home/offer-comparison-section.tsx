"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  GitCompareArrows,
  FileDown,
  Star,
  CheckCircle2,
  Minus,
  ArrowRight,
  Crown,
} from "lucide-react"

type Offer = {
  name: string
  country: string
  flag: string
  price: string
  moq: string
  leadTime: string
  packaging: string
  privateLabel: boolean
  payment: string
  rating: number
  best?: boolean
}

const offers: Offer[] = [
  {
    name: "Anhui Paper Co.",
    country: "China",
    flag: "🇨🇳",
    price: "$0.42 / roll",
    moq: "1 container",
    leadTime: "25 days",
    packaging: "Custom branded",
    privateLabel: true,
    payment: "30% / 70%",
    rating: 4.8,
    best: true,
  },
  {
    name: "İzmir Tissue Mills",
    country: "Türkiye",
    flag: "🇹🇷",
    price: "$0.48 / roll",
    moq: "2 containers",
    leadTime: "18 days",
    packaging: "Custom branded",
    privateLabel: true,
    payment: "50% / 50%",
    rating: 4.6,
  },
  {
    name: "Cairo Hygiene Ltd.",
    country: "Egypt",
    flag: "🇪🇬",
    price: "$0.39 / roll",
    moq: "3 containers",
    leadTime: "30 days",
    packaging: "Standard only",
    privateLabel: false,
    payment: "Letter of credit",
    rating: 4.3,
  },
]

const rows: { key: keyof Offer; label: string }[] = [
  { key: "price", label: "Price" },
  { key: "moq", label: "MOQ" },
  { key: "leadTime", label: "Production time" },
  { key: "packaging", label: "Packaging" },
  { key: "privateLabel", label: "Private label" },
  { key: "payment", label: "Payment terms" },
]

export function OfferComparisonSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-muted/40 py-16 sm:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            <GitCompareArrows className="h-4 w-4" />
            Offer Comparison
          </div>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Compare offers without messy messages.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every manufacturer responds in the same structured format. See price, MOQ, production
            time, packaging, and terms side by side — then choose with confidence.
          </p>
        </div>

        {/* Comparison table */}
        <div
          className={`mx-auto mt-12 max-w-5xl transition-all delay-150 duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Offer
                    </th>
                    {offers.map((offer) => (
                      <th key={offer.name} className="p-4 text-left align-top">
                        <div className="flex items-center gap-2">
                          <span className="text-lg leading-none">{offer.flag}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-foreground">{offer.name}</span>
                              {offer.best && <Crown className="h-3.5 w-3.5 text-secondary" />}
                            </div>
                            <span className="text-xs text-muted-foreground">{offer.country}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                          <span className="text-xs font-medium text-foreground">{offer.rating}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-b border-border last:border-0">
                      <td className="p-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {row.label}
                      </td>
                      {offers.map((offer) => (
                        <td key={offer.name} className="p-4 text-sm text-foreground">
                          {row.key === "privateLabel" ? (
                            offer.privateLabel ? (
                              <span className="inline-flex items-center gap-1.5 text-secondary">
                                <CheckCircle2 className="h-4 w-4" /> Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                <Minus className="h-4 w-4" /> No
                              </span>
                            )
                          ) : (
                            <span className={offer.best && row.key === "price" ? "font-semibold text-secondary" : ""}>
                              {offer[row.key] as string}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PDF Report bar */}
            <div className="flex flex-col items-start justify-between gap-4 border-t border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                  <FileDown className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Export a professional sourcing report</p>
                  <p className="text-xs text-muted-foreground">
                    Manufacturers, countries, prices, MOQ, lead times, packaging, notes & product images in one PDF.
                  </p>
                </div>
              </div>
              <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <FileDown className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 gap-2 border-secondary/40 px-8 text-base text-foreground hover:bg-secondary/10"
            >
              <Link href="/find-suppliers">
                Start comparing offers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
