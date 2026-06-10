import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { 
  Globe,
  TrendingUp,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  Award,
  Shield,
  ArrowRight,
  Check,
  Building2
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Manufacturers - Reach Global Buyers",
  description: "Showcase your factory, upload products, receive inquiries, and connect with buyers worldwide through SourceNest's premium B2B platform.",
}

const features = [
  {
    icon: Building2,
    title: "Professional Company Profile",
    description: "Create a comprehensive digital booth showcasing your factory, capabilities, certifications, and production capacity.",
  },
  {
    icon: Globe,
    title: "Global Visibility",
    description: "Get discovered by importers and sourcing professionals from around the world actively looking for suppliers.",
  },
  {
    icon: MessageSquare,
    title: "Direct Buyer Communication",
    description: "Receive and respond to inquiries directly through our platform. Chat with serious buyers without intermediaries.",
  },
  {
    icon: FileText,
    title: "RFQ Management",
    description: "Receive detailed quote requests with specifications. Respond with competitive offers to win new business.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track profile views, inquiry rates, and engagement metrics. Understand what buyers are looking for.",
  },
  {
    icon: Award,
    title: "Reviewed Badge",
    description: "After approval, receive the SourceNest Reviewed badge — a trust signal that helps you stand out to buyers.",
  },
]

const steps = [
  {
    step: 1,
    title: "Create Account & Choose Plan",
    description: "Sign up and select the subscription plan that fits your business needs.",
  },
  {
    step: 2,
    title: "Complete Payment",
    description: "Securely pay for your subscription. Your account is created but pending approval.",
  },
  {
    step: 3,
    title: "Build Your Profile",
    description: "Add company details, certifications, capabilities, and upload your product catalog.",
  },
  {
    step: 4,
    title: "Submit for Review",
    description: "Once ready, submit your profile for our review team to assess.",
  },
  {
    step: 5,
    title: "Get Approved & Go Live",
    description: "After approval, your profile becomes visible and you can start receiving inquiries.",
  },
]

const benefits = [
  "Reach qualified buyers actively searching for suppliers",
  "Present your factory with a professional, polished profile",
  "Receive quality leads and RFQs directly in your inbox",
  "Showcase certifications and build credibility",
  "Expand into new markets and regions",
  "No commission fees — pay only your subscription",
]

export default function ForManufacturersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm text-primary-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Grow Your Export Business</span>
              </div>
              <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                Reach Global Buyers, Grow Your Factory
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
                Create your digital booth, showcase products, and connect with importers and sourcing professionals worldwide through SourceNest&apos;s premium B2B platform.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                  <Link href="/pricing">
                    View Pricing Plans
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/auth/signup?role=manufacturer">
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                Everything You Need to Succeed
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful tools to present your factory and connect with the right buyers
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* How It Works */}
        <section className="bg-muted/50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                How to Get Started
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A simple process to get your factory on SourceNest
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-5">
              {steps.map((step, index) => (
                <div key={step.step} className="relative text-center">
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-6 hidden h-0.5 w-full bg-border md:block" />
                  )}
                  <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="font-bold">{step.step}</span>
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-12 max-w-2xl rounded-xl bg-secondary/10 p-6 text-center">
              <Shield className="mx-auto h-8 w-8 text-secondary" />
              <p className="mt-4 font-medium text-secondary">
                Important: All manufacturer accounts require admin approval before going live.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                This review process helps maintain quality standards for buyers on the platform.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="rounded-2xl bg-primary p-8 text-primary-foreground lg:p-12">
                <Users className="h-12 w-12" />
                <h3 className="mt-6 font-serif text-2xl font-medium">Why Manufacturers Choose SourceNest</h3>
                <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                  Unlike general B2B platforms, SourceNest is built specifically for connecting quality manufacturers with serious buyers. Our review process helps ensure you&apos;re surrounded by screened businesses, and our premium positioning attracts professional sourcing teams.
                </p>
                <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                  With affordable subscription plans and no commission on deals, SourceNest offers exceptional value for factories looking to expand their global reach.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  Benefits of Joining
                </h2>
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
                <Button className="mt-8 gap-2" asChild>
                  <Link href="/pricing">
                    View Pricing Plans
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-secondary-foreground sm:text-4xl">
                Ready to Reach Global Buyers?
              </h2>
              <p className="mt-4 text-lg text-secondary-foreground/80">
                Join SourceNest today and start receiving inquiries from importers worldwide.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/pricing">
                    Choose Your Plan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
                  <Link href="/contact">
                    Contact Sales
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
