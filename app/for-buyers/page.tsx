import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
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

export const metadata: Metadata = {
  title: "For Buyers - Free Global Sourcing Platform",
  description: "Search suppliers, compare factories, request quotes, and connect with reviewed manufacturers worldwide — completely free for buyers.",
}

const features = [
  {
    icon: Search,
    title: "Search Suppliers",
    description: "Access our global directory of reviewed manufacturers. Filter by industry, location, certifications, MOQ, and more to find the perfect partners.",
  },
  {
    icon: Building2,
    title: "Compare Factories",
    description: "Add suppliers to your comparison list and evaluate them side-by-side. Compare capabilities, certifications, lead times, and more.",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    description: "Chat directly with factory representatives through our secure platform. No middlemen, no brokers — just direct communication.",
  },
  {
    icon: FileText,
    title: "Request Quotes",
    description: "Submit detailed RFQs with specifications, quantities, and requirements. Receive competitive quotes directly from manufacturers.",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Save suppliers and products to your favorites for easy access. Build your preferred vendor list over time.",
  },
  {
    icon: Download,
    title: "Download Catalogs",
    description: "Access and download product catalogs, specification sheets, and company brochures from reviewed suppliers.",
  },
  {
    icon: BarChart3,
    title: "Organized Dashboard",
    description: "Manage all your sourcing activity in one place. Track messages, RFQs, saved items, and supplier interactions.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get notified when suppliers respond to your inquiries, when new suppliers match your preferences, and more.",
  },
]

const benefits = [
  "Completely free to use — no subscription, no hidden fees",
  "Only reviewed and approved suppliers on the platform",
  "Direct communication with factory representatives",
  "Side-by-side supplier comparison tools",
  "Secure RFQ and messaging system",
  "Access to product catalogs and specifications",
  "Organized dashboard for all sourcing activity",
  "Global reach across 50+ manufacturing countries",
]

export default function ForBuyersPage() {
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
                <span>100% Free for Buyers</span>
              </div>
              <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                Source Globally, Completely Free
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
                Search reviewed suppliers, compare factories, request quotes, and communicate directly with manufacturers — all at no cost. SourceNest is free for buyers, forever.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
                  <Link href="/auth/signup?role=buyer">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/suppliers">
                    Browse Suppliers
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
                Everything You Need to Source Smarter
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful tools designed to streamline your entire sourcing workflow
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                    <feature.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-muted/50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  Why Buyers Love SourceNest
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Join thousands of procurement professionals, importers, and sourcing managers who trust SourceNest for their global sourcing needs.
                </p>
                <ul className="mt-8 space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <Check className="h-3 w-3 text-secondary-foreground" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-primary p-8 text-primary-foreground lg:p-12">
                <h3 className="font-serif text-2xl font-medium">Why is it free for buyers?</h3>
                <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                  Our business model is simple: manufacturers pay a subscription to be listed on the platform, while buyers use it for free. This ensures maximum reach for factories while giving you access to a premium sourcing tool at no cost.
                </p>
                <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                  By keeping the platform free for buyers, we attract more serious sourcing professionals — which in turn makes the platform more valuable for manufacturers. Everyone wins.
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
                Start Sourcing Today
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Create your free account in seconds and start connecting with reviewed manufacturers worldwide.
              </p>
              <Button size="lg" className="mt-8 gap-2" asChild>
                <Link href="/auth/signup?role=buyer">
                  Create Free Buyer Account
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
