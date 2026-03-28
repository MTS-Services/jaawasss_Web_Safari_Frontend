import { Metadata } from "next"
import Link from "next/link"
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

export const metadata: Metadata = {
  title: "Review Process",
  description: "Learn how SourceNest reviews and approves manufacturers based on submitted information to maintain quality standards for buyers.",
}

const verificationSteps = [
  {
    icon: FileCheck,
    title: "Document Review",
    description: "We review submitted business registration documents, export licenses, and company certifications to assess legitimacy based on provided information.",
    items: [
      "Business registration certificate",
      "Export/import licenses",
      "Industry certifications (ISO, CE, FDA, etc.)",
      "Tax registration documents",
    ],
  },
  {
    icon: Building2,
    title: "Factory Information Review",
    description: "We review the submitted manufacturing facility information and declared production capabilities.",
    items: [
      "Factory location information reviewed",
      "Production capacity details assessed",
      "Equipment and machinery information reviewed",
      "Workforce and facility size details evaluated",
    ],
  },
  {
    icon: Eye,
    title: "Profile Review",
    description: "Our team manually reviews all profile content to assess accuracy and professionalism based on submitted materials.",
    items: [
      "Company description reviewed",
      "Product information quality assessed",
      "Image and media reviewed",
      "Contact information checked",
    ],
  },
  {
    icon: CheckCircle,
    title: "Ongoing Monitoring",
    description: "Even after approval, we continue monitoring supplier performance and buyer feedback.",
    items: [
      "Response time tracking",
      "Buyer feedback monitoring",
      "Regular compliance checks",
      "Quality assurance reviews",
    ],
  },
]

const badges = [
  {
    icon: Shield,
    name: "SourceNest Reviewed",
    description: "The supplier has completed our review process based on submitted information and is approved to list on the platform.",
    color: "bg-secondary",
  },
  {
    icon: Award,
    name: "Featured Supplier",
    description: "A premium supplier with excellent ratings, response times, and buyer feedback.",
    color: "bg-primary",
  },
  {
    icon: Globe,
    name: "Export Ready",
    description: "The supplier has declared experience and capability in international shipping.",
    color: "bg-blue-600",
  },
]

export default function VerificationPage() {
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
                <span>Trust & Quality</span>
              </div>
              <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                Our Review Process
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
                Every manufacturer on SourceNest goes through a thorough review process based on submitted information before being approved. Here&apos;s how we maintain quality standards.
              </p>
            </div>
          </div>
        </section>

        {/* Why Review Matters */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                Why Our Review Process Matters
              </h2>
              <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  In the world of B2B sourcing, trust is everything. Buyers need confidence that the suppliers they find have been screened and assessed. Traditional platforms often allow anyone to list, creating a sea of unreviewed options that puts the burden of due diligence entirely on the buyer.
                </p>
                <p>
                  SourceNest takes a different approach. We require every manufacturer to go through our review and approval process based on submitted information before they can appear on the platform. This means:
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Buyers know that supplier information has been reviewed based on submitted documents</li>
                  <li>Manufacturers benefit from being in a quality-focused marketplace</li>
                  <li>The entire platform maintains a higher standard</li>
                  <li>Initial screening helps reduce time spent on due diligence</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Review Steps */}
        <section className="bg-muted/50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                How We Review Suppliers
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our multi-step review process ensures comprehensive screening based on submitted information
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {verificationSteps.map((step) => (
                <div key={step.title} className="rounded-2xl border border-border bg-card p-8">
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
                Trust Badges Explained
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                What our review badges mean for you
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
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
                    What If My Application is Not Approved?
                  </h2>
                  <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      If your manufacturer application doesn&apos;t meet our requirements, we&apos;ll provide specific feedback on what needs to be addressed. Common reasons for rejection include:
                    </p>
                    <ul className="ml-6 list-disc space-y-2">
                      <li>Incomplete or unclear documentation</li>
                      <li>Unable to review business registration documents</li>
                      <li>Profile content quality issues</li>
                      <li>Inconsistencies in provided information</li>
                    </ul>
                    <p>
                      You can address the issues and resubmit your application. If approval is ultimately not possible, we offer a full refund within 30 days of your initial payment.
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
                Ready to Get Reviewed?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join SourceNest and showcase your factory to buyers worldwide.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/pricing">
                    View Plans & Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <Link href="/faq">
                    Read FAQ
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
