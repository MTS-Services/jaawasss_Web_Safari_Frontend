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
    title: "Create Your Account",
    description: "Sign up as a manufacturer and choose the subscription plan that fits your business needs and growth goals.",
  },
  {
    step: 2,
    title: "Submit for Approval",
    description: "Once ready, submit your account for review. Our team will review your business before granting access to the platform.",
  },
  {
    step: 3,
    title: "Complete Payment",
    description: "Once your account is reviewed and approved, complete your payment to activate your account and start using the platform.",
  },
  {
    step: 4,
    title: "Build Your Profile",
    description: "Complete your factory profile with details, certifications, capabilities, and upload your product catalog and brochures.",
  },
  {
    step: 5,
    title: "Upload Products",
    description: "Add your products with images, specifications, MOQ, lead times, and packaging details to showcase your full range.",
  },
  {
    step: 6,
    title: "Go Global",
    description: "After approval, your profile goes live. Start receiving inquiries and quote requests from buyers worldwide.",
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
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row w-full max-w-lg mx-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                  <Link href="/pricing" className="w-full text-center sm:w-auto">
                    View Pricing Plans
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/auth/signup?role=manufacturer" className="w-full text-center sm:w-auto">
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

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg">
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

            <div className="mt-16 grid gap-6 md:grid-cols-6">
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
                Important: No payment is required upfront. Your account will be reviewed first, and you will only be charged after approval.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Once approved, complete your payment to activate your account and unlock full access to the platform.
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
                <Button className="mt-8 gap-2 w-full sm:w-auto" asChild>
                  <Link href="/pricing" className="w-full text-center sm:w-auto">
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
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row w-full max-w-lg mx-auto">
                <Button size="lg" className="w-full sm:w-auto justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/pricing" className="w-full text-center sm:w-auto">
                    Choose Your Plan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent w-full sm:w-auto border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
                  <Link href="/contact" className="w-full text-center sm:w-auto">
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
