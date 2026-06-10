"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  ArrowRight,
  MessageSquareText,
  FileText,
  Users,
  Send,
  GitCompareArrows,
  FileDown,
} from "lucide-react"

const journey = [
  {
    icon: MessageSquareText,
    title: "Describe what you need",
    description: "Tell us your product, quantity, and destination in plain language.",
  },
  {
    icon: FileText,
    title: "We build a structured RFQ",
    description: "AI organizes your request and flags any missing details.",
  },
  {
    icon: Users,
    title: "Relevant manufacturers receive it",
    description: "Only reviewed manufacturers that fit your request are reached.",
  },
  {
    icon: Send,
    title: "Manufacturers submit offers",
    description: "Responses arrive in one standardized, easy-to-read format.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare and choose",
    description: "Review price, MOQ, lead time, and terms side by side.",
  },
  {
    icon: FileDown,
    title: "Export & communicate",
    description: "Generate a PDF report and message suppliers with AI tools.",
  },
]

export function AiSourcingSection() {
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
      {/* Subtle globe lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            <Sparkles className="h-4 w-4" />
            The SourceNest Journey
          </div>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            From manual searching to organized sourcing.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            SourceNest is more than a manufacturer directory. It guides you through a clear,
            structured path — so you reach the right suppliers and make better decisions.
          </p>
        </div>

        {/* Journey grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {journey.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className={`group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-700 hover:shadow-lg ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 90 + 150}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 transition-colors group-hover:bg-secondary/20">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="font-serif text-3xl font-medium text-border">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 gap-2 bg-secondary px-8 text-base text-secondary-foreground shadow-lg shadow-secondary/20 transition-all hover:bg-secondary/90 hover:shadow-xl"
          >
            <Link href="/find-suppliers">
              <Sparkles className="h-5 w-5" />
              Start smart sourcing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">Free for buyers. No credit card required.</p>
        </div>
      </div>
    </section>
  )
}
