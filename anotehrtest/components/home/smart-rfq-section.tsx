"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  ArrowRight,
  FileText,
  Package,
  MapPin,
  Layers,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Send,
  Users,
  GitCompareArrows,
} from "lucide-react"

const flowSteps = [
  { icon: FileText, label: "Request", desc: "One structured RFQ" },
  { icon: Users, label: "Relevant Manufacturers", desc: "Reviewed & matched" },
  { icon: Send, label: "Offers", desc: "Standardized replies" },
  { icon: GitCompareArrows, label: "Comparison", desc: "Decide in one view" },
]

const extractedFields = [
  { icon: Package, label: "Product", value: "3-ply toilet paper" },
  { icon: Layers, label: "Quantity", value: "2 x 40ft containers" },
  { icon: MapPin, label: "Destination", value: "Israel" },
  { icon: Tag, label: "Private label", value: "Yes — custom branding" },
  { icon: ShieldCheck, label: "Certifications", value: "ISO 9001, FSC" },
]

export function SmartRfqSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [transformed, setTransformed] = useState(false)
  const [visibleFields, setVisibleFields] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Run the build animation once visible, then loop
  useEffect(() => {
    if (!isVisible) return
    let fieldTimers: ReturnType<typeof setTimeout>[] = []

    const run = () => {
      setTransformed(false)
      setVisibleFields(0)
      const transformTimer = setTimeout(() => {
        setTransformed(true)
        extractedFields.forEach((_, i) => {
          fieldTimers.push(
            setTimeout(() => setVisibleFields(i + 1), 350 * (i + 1))
          )
        })
      }, 1200)
      fieldTimers.push(transformTimer)
    }

    run()
    const loop = setInterval(run, 7000)
    return () => {
      clearInterval(loop)
      fieldTimers.forEach(clearTimeout)
    }
  }, [isVisible])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-16 sm:py-24"
    >
      {/* Subtle globe lines backdrop */}
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
            Smart RFQ
          </div>
          <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Send one request. Receive multiple supplier offers.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Stop contacting manufacturers one by one. Submit a single structured request and
            SourceNest delivers it to relevant reviewed manufacturers — so organized offers come to you.
          </p>
        </div>

        {/* Flow: Request -> Relevant Manufacturers -> Offers -> Comparison */}
        <div
          className={`mx-auto mt-12 max-w-5xl transition-all delay-150 duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {flowSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.label} className="relative flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="mt-3 text-sm font-semibold text-foreground">{step.label}</span>
                  <span className="mt-0.5 text-xs text-muted-foreground">{step.desc}</span>
                  {i < flowSteps.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-4 hidden h-5 w-5 text-border sm:block" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* AI RFQ Builder: input transforming into RFQ card */}
        <div className="mt-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left copy */}
          <div
            className={`transition-all delay-200 duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <h3 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
              AI RFQ Builder
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Write your request in plain language. The AI structures it into a professional RFQ —
              extracting product, quantity, destination, packaging, private label needs, and
              certifications, then flagging any missing details.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Turns natural language into a structured request",
                "Highlights missing information before you send",
                "Reaches only relevant reviewed manufacturers",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              size="lg"
              className="mt-8 h-12 gap-2 bg-secondary px-8 text-base text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="/find-suppliers">
                <Sparkles className="h-5 w-5" />
                Build my RFQ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Right: animated transform */}
          <div
            className={`transition-all delay-300 duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="relative rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-6">
              {/* Natural language input */}
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-secondary" />
                  Your request
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  &ldquo;I&apos;m looking for a 3-ply toilet paper manufacturer for Israel. Need
                  private label, around two 40ft containers, with ISO and FSC.&rdquo;
                </p>
              </div>

              {/* Transform arrow */}
              <div className="my-4 flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary transition-all duration-500 ${
                    transformed ? "opacity-100" : "opacity-60"
                  }`}
                >
                  <Sparkles className={`h-3.5 w-3.5 ${transformed ? "" : "animate-pulse"}`} />
                  {transformed ? "Structured RFQ" : "Structuring..."}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Structured RFQ card */}
              <div className="rounded-xl border border-secondary/30 bg-background p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10">
                      <FileText className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">RFQ #SN-2048</span>
                  </div>
                  <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-[11px] font-medium text-secondary">
                    Ready to send
                  </span>
                </div>
                <div className="space-y-2">
                  {extractedFields.map((field, i) => {
                    const Icon = field.icon
                    const shown = transformed && i < visibleFields
                    return (
                      <div
                        key={field.label}
                        className={`flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 transition-all duration-300 ${
                          shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon className="h-3.5 w-3.5 text-secondary" />
                          {field.label}
                        </span>
                        <span className="text-xs font-medium text-foreground">{field.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
