import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Globe, Shield, Users, Lightbulb, Target, Heart, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about SourceNest's mission to make global sourcing more transparent, efficient, and trustworthy for buyers and manufacturers worldwide.",
}

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We believe sourcing should be built on trust. Every supplier is reviewed based on submitted information, and we strive to maintain platform quality.",
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "We're breaking down barriers in international trade, making it easier for businesses of all sizes to connect across borders.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We're building more than a platform — we're creating a community of quality-focused buyers and manufacturers.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously improve our platform with smart features that make sourcing more efficient and effective.",
  },
]

const stats = [
  { value: "50+", label: "Countries" },
  { value: "2,000+", label: "Reviewed Suppliers" },
  { value: "15,000+", label: "Products Listed" },
  { value: "45+", label: "Industries Covered" },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                Making Global Sourcing Work Better
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
                SourceNest is on a mission to transform how businesses find and connect with manufacturing partners worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                Our Story
              </h2>
              <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Global sourcing has always been challenging. Buyers struggle to find reliable suppliers, review their legitimacy, and communicate effectively across borders. Manufacturers, especially quality-focused ones, have difficulty standing out among countless options and reaching serious buyers.
                </p>
                <p>
                  SourceNest was born from a simple idea: what if there was a platform that only featured reviewed, approved manufacturers? A place where buyers could know that every supplier had been screened based on submitted information before being listed?
                </p>
                <p>
                  We built SourceNest to be that platform. By requiring admin approval for every manufacturer and keeping the platform free for buyers, we&apos;ve created an environment where quality prevails and trust is the foundation of every connection.
                </p>
                <p>
                  Today, SourceNest connects thousands of buyers with reviewed manufacturers across 50+ countries, covering 45+ industries. We&apos;re proud to be making global trade more accessible, transparent, and efficient.
                </p>
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
                <h3 className="mt-6 font-serif text-2xl font-medium">Our Mission</h3>
                <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                  To make global sourcing more transparent, efficient, and trustworthy by connecting quality-focused buyers with reviewed manufacturers through a premium digital platform.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-8 lg:p-12">
                <Heart className="h-12 w-12 text-secondary" />
                <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">Our Vision</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  A world where finding the right manufacturing partner is simple, safe, and successful — regardless of geography, company size, or industry.
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
                Our Values
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The principles that guide everything we do
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
                Why SourceNest is Different
              </h2>
              <div className="mt-8 space-y-6 text-left text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Reviewed-Only Marketplace:</strong> Unlike open platforms where anyone can list, every manufacturer on SourceNest goes through our review and approval process based on submitted information. This means buyers know that suppliers have been screened, and manufacturers know they&apos;re in good company.
                </p>
                <p>
                  <strong className="text-foreground">Free for Buyers:</strong> We believe buyers should have access to quality sourcing tools without barriers. By making the platform free for buyers, we ensure maximum reach for manufacturers and maximum access for sourcing professionals.
                </p>
                <p>
                  <strong className="text-foreground">No Commission Model:</strong> We don&apos;t take a cut of your deals. Manufacturers pay only their subscription fee, and all communication and negotiation happens directly between parties.
                </p>
                <p>
                  <strong className="text-foreground">Premium Focus:</strong> We&apos;re not trying to be the biggest platform — we&apos;re trying to be the most trusted. Quality over quantity is our guiding principle.
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
                Join the SourceNest Community
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Whether you&apos;re sourcing products or manufacturing them, we&apos;d love to have you.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row w-full max-w-lg mx-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto justify-center gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
                  <Link href="/auth/signup?role=buyer" className="w-full text-center sm:w-auto">
                    Join as Buyer
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/pricing" className="w-full text-center sm:w-auto">
                    Join as Manufacturer
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
