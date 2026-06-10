"use client"

import { useState, useEffect, useRef } from "react"
import {
  Wand2,
  Languages,
  CornerUpLeft,
  Lightbulb,
  Building2,
  HelpCircle,
  ShieldCheck,
  PencilLine,
} from "lucide-react"

const chatTools = [
  { icon: Wand2, label: "Improve message" },
  { icon: Languages, label: "Translate message" },
  { icon: PencilLine, label: "Improve & translate" },
  { icon: CornerUpLeft, label: "Reply to last message" },
  { icon: Lightbulb, label: "Suggest what to ask next" },
]

const cards = [
  {
    icon: Building2,
    title: "Profile Assistant for Manufacturers",
    description:
      "Help manufacturers present themselves clearly to global buyers — improve company descriptions, refine product details, translate content to English, and suggest missing information.",
    points: [
      "Improve company & product descriptions",
      "Translate profile content to English",
      "Suggest missing profile details",
    ],
  },
  {
    icon: HelpCircle,
    title: "Sourcing Assistant for Buyers",
    description:
      "A smart support layer for practical sourcing questions — what to ask suppliers, what's missing from your RFQ, and what to check before choosing a manufacturer.",
    points: [
      "What should I ask the supplier?",
      "What's missing in my RFQ?",
      "What to check before private label sourcing?",
    ],
  },
]

export function AiToolsSection() {
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
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-16 sm:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            <Wand2 className="h-4 w-4" />
            Smart Communication
          </div>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Communicate clearly across borders.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Built-in AI tools help buyers and manufacturers write better, understand each other, and
            move faster — without replacing the human conversation.
          </p>
        </div>

        {/* Chat preview with tools */}
        <div
          className={`mx-auto mt-12 max-w-2xl transition-all delay-150 duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-6">
            {/* Incoming message */}
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5">
                <p className="text-sm text-foreground">
                  Merhaba, MOQ için 2 konteyner gerekir. Özel etiket mümkün.
                </p>
              </div>
            </div>

            {/* Input with AI tools */}
            <div className="mt-4 rounded-xl border border-border bg-background p-3">
              <p className="text-sm text-foreground">
                Thanks! Could you confirm your lead time and payment terms for a private-label order?
              </p>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                {chatTools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={tool.label}
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary transition-colors hover:bg-secondary/20"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tool.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Reassurance note */}
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              AI only drafts into your input — nothing sends until you review and approve.
            </div>
          </div>
        </div>

        {/* Assistant cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className={`rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${250 + i * 120}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                <ul className="mt-4 space-y-2">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
