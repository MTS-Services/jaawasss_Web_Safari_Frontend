"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Globe, Shield, Users, Lightbulb, Target, Heart, ArrowRight } from "lucide-react"

export default function AboutPage() {
  const { t } = useTranslation()

  if (!t?.about) {
    return null
  }

  const values = [
    {
      icon: Shield,
      title: t.about.values.trust.title,
      description: t.about.values.trust.description,
    },
    {
      icon: Globe,
      title: t.about.values.global.title,
      description: t.about.values.global.description,
    },
    {
      icon: Users,
      title: t.about.values.community.title,
      description: t.about.values.community.description,
    },
    {
      icon: Lightbulb,
      title: t.about.values.innovation.title,
      description: t.about.values.innovation.description,
    },
  ]

  const stats = [
    { value: "50+", label: t.about.stats.countries },
    { value: "2,000+", label: t.about.stats.suppliers },
    { value: "15,000+", label: t.about.stats.products },
    { value: "45+", label: t.about.stats.industries },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                {t.about.hero.title}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
                {t.about.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {t.about.story.title}
              </h2>
              <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
                <p>{t.about.story.p1}</p>
                <p>{t.about.story.p2}</p>
                <p>{t.about.story.p3}</p>
                <p>{t.about.story.p4}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-muted/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-4xl font-medium text-foreground">{stat.value}</div>
                  <div className="mt-2 text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="rounded-2xl bg-primary p-8 text-primary-foreground lg:p-12">
                <Target className="h-12 w-12" />
                <h3 className="mt-6 font-serif text-2xl font-medium">{t.about.missionVision.missionTitle}</h3>
                <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                  {t.about.missionVision.missionDesc}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-8 lg:p-12">
                <Heart className="h-12 w-12 text-secondary" />
                <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">{t.about.missionVision.visionTitle}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {t.about.missionVision.visionDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted/50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {t.about.values.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t.about.values.subtitle}
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                    <value.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why We're Different */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {t.about.difference.title}
              </h2>
              <div className="mt-8 space-y-6 text-left text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">{t.about.difference.reviewed.title}</strong> {t.about.difference.reviewed.description}
                </p>
                <p>
                  <strong className="text-foreground">{t.about.difference.free.title}</strong> {t.about.difference.free.description}
                </p>
                <p>
                  <strong className="text-foreground">{t.about.difference.nocommission.title}</strong> {t.about.difference.nocommission.description}
                </p>
                <p>
                  <strong className="text-foreground">{t.about.difference.premium.title}</strong> {t.about.difference.premium.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-primary-foreground sm:text-4xl">
                {t.about.cta.title}
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                {t.about.cta.subtitle}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row w-full max-w-lg mx-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto justify-center gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
                  <Link href="/auth/signup?role=buyer" className="w-full text-center sm:w-auto">
                    {t.about.cta.buyerButton}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/pricing" className="w-full text-center sm:w-auto">
                    {t.about.cta.manufacturerButton}
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
