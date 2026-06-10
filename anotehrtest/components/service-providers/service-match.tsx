"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  serviceCategories,
  matchService,
  type ServiceMatchResult,
} from "@/lib/data/service-providers"
import { countries } from "@/lib/data/countries"
import { Sparkles, ArrowRight, Wand2, CheckCircle2 } from "lucide-react"

const examplePrompts = [
  "I need a customs broker in Israel",
  "Packaging designer for a private label project",
  "Freight forwarder from China to the US",
  "Pre-shipment quality inspection in Vietnam",
]

const assistantNeeds: { label: string; slug: string }[] = [
  { label: "Design & Branding", slug: "design-branding" },
  { label: "Shipping & Logistics", slug: "shipping-logistics" },
  { label: "Customs & Import Clearance", slug: "customs-clearance" },
  { label: "Quality Inspection", slug: "quality-inspection" },
  { label: "Compliance & Standards", slug: "compliance-standards" },
  { label: "Translation", slug: "translation-communication" },
  { label: "Import Consulting", slug: "import-consulting" },
  { label: "Legal & Documentation", slug: "legal-documentation" },
]

export function ServiceMatch({ onSelectCategory }: { onSelectCategory: (slug: string) => void }) {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<ServiceMatchResult | null>(null)
  const [searched, setSearched] = useState(false)

  const runMatch = (value: string) => {
    const match = matchService(value, countries)
    setResult(match)
    setSearched(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    runMatch(query)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* AI Service Match */}
      <div className="rounded-2xl border border-secondary/30 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10">
            <Wand2 className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-foreground">AI Service Match</h3>
            <p className="text-sm text-muted-foreground">Describe what you need in plain language.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. I need a customs broker in Israel"
                className="h-11 pl-9"
                aria-label="Describe the service you need"
              />
            </div>
            <Button type="submit" className="h-11 gap-2">
              Match
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {examplePrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setQuery(p)
                runMatch(p)
              }}
              className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-secondary hover:text-secondary"
            >
              {p}
            </button>
          ))}
        </div>

        {searched && (
          <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
            {result ? (
              <>
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${result.category.accent}`}>
                    <result.category.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-secondary">Best match</p>
                    <p className="font-semibold text-foreground">{result.category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.providers.length} provider{result.providers.length === 1 ? "" : "s"}
                      {result.countryName ? ` matching “${result.countryName}”` : ""}
                    </p>
                  </div>
                </div>
                {result.providers.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {result.providers.slice(0, 3).map((p) => (
                      <li key={p.id} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-secondary" />
                        <span className="truncate">{p.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          · {p.location.country}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 gap-2"
                  onClick={() => onSelectCategory(result.category.slug)}
                >
                  View matching providers
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t find a clear match. Try the categories below or browse all providers.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Service Request Assistant */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-serif text-lg font-medium text-foreground">
          Need help finding the right service provider?
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick what you&apos;re looking for and we&apos;ll point you to the most relevant providers.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {assistantNeeds.map((need) => {
            const category = serviceCategories.find((c) => c.slug === need.slug)
            const Icon = category?.icon ?? Sparkles
            return (
              <button
                key={need.slug}
                type="button"
                onClick={() => onSelectCategory(need.slug)}
                className="group flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-left text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm"
              >
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md ${category?.accent ?? "bg-secondary/10 text-secondary"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="leading-tight">{need.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
