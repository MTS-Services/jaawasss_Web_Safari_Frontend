import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ServiceProviderPackages } from "@/components/service-providers/service-provider-packages"
import { serviceCategories } from "@/lib/data/service-providers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Inbox,
  MessageSquare,
  BarChart3,
  Globe,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Check,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Service Providers - Grow Your Trade Services Business",
  description:
    "Join SourceNest as a service provider. Offer design, logistics, customs, inspection, and consulting services to importers and manufacturers worldwide.",
}

const benefits = [
  {
    icon: Globe,
    title: "Reach a global trade audience",
    description: "Get discovered by importers and manufacturers actively looking for trusted service partners.",
  },
  {
    icon: Inbox,
    title: "Receive qualified requests",
    description: "Buyers send structured service requests with scope, timeline, and budget — straight to your inbox.",
  },
  {
    icon: MessageSquare,
    title: "Message buyers directly",
    description: "Discuss requirements, share quotes, and close deals through built-in messaging.",
  },
  {
    icon: BarChart3,
    title: "Manage everything in one dashboard",
    description: "Track requests, manage your services and pricing, and update your profile from a single place.",
  },
  {
    icon: ShieldCheck,
    title: "Earn the Reviewed badge",
    description: "Verified providers stand out with a trust signal that helps win more business.",
  },
  {
    icon: Briefcase,
    title: "Showcase your portfolio",
    description: "Highlight past work, certifications, and the services you specialize in.",
  },
]

const steps = [
  { step: 1, title: "Create your account", description: "Sign up as a service provider and tell us what you do." },
  { step: 2, title: "Choose a package", description: "Pick the plan that matches your goals and visibility needs." },
  { step: 3, title: "Get reviewed", description: "Our team reviews your profile to keep the marketplace high quality." },
  { step: 4, title: "Start receiving requests", description: "Go live, get discovered, and respond to buyer requests." },
]

export default function ForServiceProvidersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
                <Briefcase className="h-4 w-4" />
                For Service Providers
              </span>
              <h1 className="mt-5 text-balance font-serif text-4xl font-medium text-foreground sm:text-5xl">
                Grow your trade services business with SourceNest
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Connect with importers and manufacturers who need design, logistics, customs, inspection, and
                consulting services. List your business, receive requests, and win new clients.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/auth/signup?role=service-provider">
                    Become a Provider
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/service-providers">Browse the marketplace</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-medium text-foreground">Services buyers are looking for</h2>
            <p className="mt-2 text-muted-foreground">List your business under one of these categories.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.slug} className="rounded-xl border border-border bg-card p-5">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${category.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{category.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{category.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Benefits */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-medium text-foreground">Why join as a provider</h2>
              <p className="mt-2 text-muted-foreground">Everything you need to find and serve global trade clients.</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/10">
                    <b.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-medium text-foreground">How it works</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative rounded-xl border border-border bg-card p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  {s.step}
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Packages */}
        <section id="packages" className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-medium text-foreground">Choose your package</h2>
              <p className="mt-2 text-muted-foreground">
                Start free and upgrade as your business grows. Cancel anytime.
              </p>
            </div>
            <div className="mt-10">
              <ServiceProviderPackages />
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
              <Check className="mr-1 inline h-4 w-4 text-secondary" />
              All plans include a public profile, buyer messaging, and access to your provider dashboard.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
