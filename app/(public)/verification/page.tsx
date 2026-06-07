"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  FileCheck, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Building2,
  Award,
  Globe,
  ArrowRight
} from "lucide-react"

export default function VerificationPage() {
  const { t } = useTranslation()

  const verificationSteps = [
    {
      icon: FileCheck,
      title: t?.verification?.steps?.documentReview?.title,
      description: t?.verification?.steps?.documentReview?.description,
      items: [
        t?.verification?.steps?.documentReview?.item1,
        t?.verification?.steps?.documentReview?.item2,
        t?.verification?.steps?.documentReview?.item3,
        t?.verification?.steps?.documentReview?.item4,
      ],
    },
    {
      icon: Building2,
      title: t?.verification?.steps?.factoryReview?.title,
      description: t?.verification?.steps?.factoryReview?.description,
      items: [
        t?.verification?.steps?.factoryReview?.item1,
        t?.verification?.steps?.factoryReview?.item2,
        t?.verification?.steps?.factoryReview?.item3,
        t?.verification?.steps?.factoryReview?.item4,
      ],
    },
    {
      icon: Eye,
      title: t?.verification?.steps?.profileReview?.title,
      description: t?.verification?.steps?.profileReview?.description,
      items: [
        t?.verification?.steps?.profileReview?.item1,
        t?.verification?.steps?.profileReview?.item2,
        t?.verification?.steps?.profileReview?.item3,
        t?.verification?.steps?.profileReview?.item4,
      ],
    },
    {
      icon: CheckCircle,
      title: t?.verification?.steps?.monitoring?.title,
      description: t?.verification?.steps?.monitoring?.description,
      items: [
        t?.verification?.steps?.monitoring?.item1,
        t?.verification?.steps?.monitoring?.item2,
        t?.verification?.steps?.monitoring?.item3,
        t?.verification?.steps?.monitoring?.item4,
      ],
    },
  ]

  const badges = [
    {
      icon: Shield,
      name: t?.verification?.badges?.reviewed?.name,
      description: t?.verification?.badges?.reviewed?.description,
      color: "bg-secondary",
    },
    {
      icon: Award,
      name: t?.verification?.badges?.featured?.name,
      description: t?.verification?.badges?.featured?.description,
      color: "bg-primary",
    },
    {
      icon: Globe,
      name: t?.verification?.badges?.exportReady?.name,
      description: t?.verification?.badges?.exportReady?.description,
      color: "bg-blue-600",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm text-primary-foreground">
                <Shield className="h-4 w-4" />
                <span>{t?.verification?.hero?.badge}</span>
              </div>
              <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                {t?.verification?.hero?.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
                {t?.verification?.hero?.description}
              </p>
            </div>
          </div>
        </section>

        {/* Why Review Matters */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {t?.verification?.whyMatters?.title}
              </h2>
              <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  {t?.verification?.whyMatters?.intro}
                </p>
                <p>
                  {t?.verification?.whyMatters?.approach}
                </p>
                <div>
                  <p className="font-semibold text-foreground mb-2">{t?.verification?.whyMatters?.benefits}</p>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>{t?.verification?.whyMatters?.benefit1}</li>
                    <li>{t?.verification?.whyMatters?.benefit2}</li>
                    <li>{t?.verification?.whyMatters?.benefit3}</li>
                    <li>{t?.verification?.whyMatters?.benefit4}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Review Steps */}
        <section className="bg-muted/50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {t?.verification?.steps?.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t?.verification?.steps?.subtitle}
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {verificationSteps.map((step) => (
                <div key={step.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
                    <step.icon className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                  <ul className="mt-6 space-y-2">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-secondary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {t?.verification?.badges?.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t?.verification?.badges?.subtitle}
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {badges.map((badge) => (
                <div key={badge.name} className="text-center">
                  <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${badge.color} text-white`}>
                    <badge.icon className="h-10 w-10" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-foreground">{badge.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What If Rejected */}
        <section className="bg-muted/50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-medium text-foreground">
                    {t?.verification?.rejected?.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      {t?.verification?.rejected?.content}
                    </p>
                    <div>
                      <p className="font-semibold text-foreground mb-2">{t?.verification?.rejected?.reasons}</p>
                      <ul className="ml-6 list-disc space-y-2">
                        <li>{t?.verification?.rejected?.reason1}</li>
                        <li>{t?.verification?.rejected?.reason2}</li>
                        <li>{t?.verification?.rejected?.reason3}</li>
                        <li>{t?.verification?.rejected?.reason4}</li>
                      </ul>
                    </div>
                    <p>
                      {t?.verification?.rejected?.resubmit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {t?.verification?.cta?.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t?.verification?.cta?.subtitle}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/pricing">
                    {t?.verification?.cta?.viewPlans}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <Link href="/faq">
                    {t?.verification?.cta?.readFaq}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}