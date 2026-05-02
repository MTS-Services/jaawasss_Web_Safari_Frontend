"use client"

import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { 
  Search, 
  Building2, 
  MessageSquare, 
  FileText, 
  Heart, 
  BarChart3,
  Download,
  Bell,
  ArrowRight,
  Check,
  Wallet
} from "lucide-react"


interface FeatureItem {
  icon: any
  titleKey: string
  descriptionKey: string
}

const featureKeys: FeatureItem[] = [
  { icon: Search, titleKey: "search.title", descriptionKey: "search.description" },
  { icon: Building2, titleKey: "compare.title", descriptionKey: "compare.description" },
  { icon: MessageSquare, titleKey: "messaging.title", descriptionKey: "messaging.description" },
  { icon: FileText, titleKey: "rfq.title", descriptionKey: "rfq.description" },
  { icon: Heart, titleKey: "favorites.title", descriptionKey: "favorites.description" },
  { icon: Download, titleKey: "catalogs.title", descriptionKey: "catalogs.description" },
  { icon: BarChart3, titleKey: "dashboard.title", descriptionKey: "dashboard.description" },
  { icon: Bell, titleKey: "notifications.title", descriptionKey: "notifications.description" },
]

const benefitKeys = ["free", "reviewed", "directComm", "comparison", "secure", "catalogs", "dashboard", "global"]

export default function ForBuyersPage() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm text-primary-foreground">
                <Wallet className="h-4 w-4" />
                <span>{t?.landing?.forBuyers?.hero?.badge || "100% Free for Buyers"}</span>
              </div>
              <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                {t?.landing?.forBuyers?.hero?.title || "Source Globally, Completely Free"}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
                {t?.landing?.forBuyers?.hero?.subtitle || "Search reviewed suppliers, compare factories, request quotes, and communicate directly with manufacturers — all at no cost. SourceNest is free for buyers, forever."}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
                  <Link href="/auth/signup?role=buyer">
                    {t?.landing?.forBuyers?.hero?.signupButton || "Create Free Account"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10" asChild>
                  <Link href="/suppliers">
                    {t?.landing?.forBuyers?.hero?.browseButton || "Browse Suppliers"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {t?.landing?.forBuyers?.featuresTitle || "Everything You Need to Source Smarter"}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t?.landing?.forBuyers?.featuresSubtitle || "Powerful tools designed to streamline your entire sourcing workflow"}
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featureKeys.map((feature) => {
                const feats = t?.landing?.forBuyers?.features as any
                const featureData = feats?.[feature.titleKey.split('.')[0]] || {}
                return (
                  <div key={feature.titleKey} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                      <feature.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{featureData.title || "Feature Title"}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {featureData.description || "Feature description"}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-muted/50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  {t?.landing?.forBuyers?.benefitsTitle || "Why Buyers Love SourceNest"}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  {t?.landing?.forBuyers?.benefitsSubtitle || "Join thousands of procurement professionals, importers, and sourcing managers who trust SourceNest for their global sourcing needs."}
                </p>
                <ul className="mt-8 space-y-4">
                  {benefitKeys.map((key, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <Check className="h-3 w-3 text-secondary-foreground" />
                      </div>
                      <span className="text-foreground">{(t?.landing?.forBuyers?.benefits as any)?.[key] || "Benefit text"}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-primary p-8 text-primary-foreground lg:p-12">
                <h3 className="font-serif text-2xl font-medium">{t?.landing?.forBuyers?.benefitBoxTitle || "Why is it free for buyers?"}</h3>
                <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                  {t?.landing?.forBuyers?.benefitBoxDescription1 || "Our business model is simple: manufacturers pay a subscription to be listed on the platform, while buyers use it for free. This ensures maximum reach for factories while giving you access to a premium sourcing tool at no cost."}
                </p>
                <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                  {t?.landing?.forBuyers?.benefitBoxDescription2 || "By keeping the platform free for buyers, we attract more serious sourcing professionals — which in turn makes the platform more valuable for manufacturers. Everyone wins."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                {t?.landing?.forBuyers?.ctaTitle || "Start Sourcing Today"}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t?.landing?.forBuyers?.ctaSubtitle || "Create your free account in seconds and start connecting with reviewed manufacturers worldwide."}
              </p>
              <Button size="lg" className="mt-8 gap-2" asChild>
                <Link href="/auth/signup?role=buyer">
                  {t?.landing?.forBuyers?.ctaButton || "Create Free Buyer Account"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
