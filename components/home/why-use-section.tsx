"use client"

import { 
  Shield, 
  Globe, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  Users,
  Wallet,
  Award,
  TrendingUp
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function WhyUseSection() {
  const { t } = useTranslation();

  if (!t || !t.landing?.whyUse) {
    return null
  }

  const buyerBenefits = [
    {
      icon: Wallet,
      title: t.landing.whyUse.bb1Title,
      description: t.landing.whyUse.bb1Desc,
    },
    {
      icon: Shield,
      title: t.landing.whyUse.bb2Title,
      description: t.landing.whyUse.bb2Desc,
    },
    {
      icon: Globe,
      title: t.landing.whyUse.bb3Title,
      description: t.landing.whyUse.bb3Desc,
    },
    {
      icon: MessageSquare,
      title: t.landing.whyUse.bb4Title,
      description: t.landing.whyUse.bb4Desc,
    },
    {
      icon: BarChart3,
      title: t.landing.whyUse.bb5Title,
      description: t.landing.whyUse.bb5Desc,
    },
    {
      icon: Clock,
      title: t.landing.whyUse.bb6Title,
      description: t.landing.whyUse.bb6Desc,
    },
  ]

  const manufacturerBenefits = [
    {
      icon: TrendingUp,
      title: t.landing.whyUse.mb1Title,
      description: t.landing.whyUse.mb1Desc,
    },
    {
      icon: Award,
      title: t.landing.whyUse.mb2Title,
      description: t.landing.whyUse.mb2Desc,
    },
    {
      icon: Users,
      title: t.landing.whyUse.mb3Title,
      description: t.landing.whyUse.mb3Desc,
    },
  ]

  return (
    <section className="py-8 sm:py-12 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Why Buyers Use SourceNest */}
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {t.landing.whyUse.buyerTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.landing.whyUse.buyerSubtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {buyerBenefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                  <benefit.icon className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-20 border-t border-border" />

        {/* Why Manufacturers Join */}
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {t.landing.whyUse.mfgTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.landing.whyUse.mfgSubtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {manufacturerBenefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border border-border bg-card p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                  <benefit.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Why Factories Pay */}
          <div className="mt-14 rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h3 className="font-serif text-2xl font-medium md:text-3xl">
              {t.landing.whyUse.whyPayTitle}
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80 leading-relaxed">
              {t.landing.whyUse.whyPayDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
