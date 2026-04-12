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
    description: "We may review company information and available documents to support verification and build trust.",
    items: [
      "Business registration certificate",
      "Export/import licenses (when applicable)",
      "Industry certifications (ISO, CE, FDA, etc.)",
      "Tax registration documents (when applicable)"
    ],
  },
  {
    icon: Building2,
    title: "Factory Information Review",
    description: "Basic factory information and production capabilities may be reviewed.",
    items: [
      "Factory location information",
      "Production capabilities",
      "Equipment and machinery",
      "Facility size and workforce"
    ],
  },
  {
    icon: Eye,
    title: "Profile Review",
    description: "Profile content may be reviewed for quality and accuracy.",
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
    description: "Supplier activity and buyer feedback may be monitored over time.",
    items: [
      "Response time",
      "Buyer feedback",
      "General performance",
      "Quality checks"
    ],
  },
]

const badges = [
  {
    icon: Shield,
    name: "SourceNest Reviewed",
    description: "Supplier has submitted company information and completed a basic review to be listed on the platform.",
    color: "bg-secondary",
  },
  {
    icon: Award,
    name: "Featured Supplier",
    description: "A supplier highlighted based on activity, responsiveness, and buyer feedback.",
    color: "bg-primary",
  },
  {
    icon: Globe,
    name: "Export Ready",
    description: "Supplier indicates experience with international shipping",
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
                  In the world of B2B sourcing, trust is essential. Buyers need confidence when connecting with suppliers. Traditional platforms often allow anyone to list, which can make it harder to evaluate options and requires more effort from buyers.
                </p>
                <p>
                  SourceNest takes a different approach. We aim to review manufacturer profiles and submitted information to help improve transparency and support better decision-making before suppliers appear on the platform.
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Buyers can access supplier information with greater clarity</li>



                  <li>Manufacturers benefit from being part of a quality-focused marketplace</li>
                  <li>The platform encourages higher standards</li>
                  <li>The process helps simplify supplier discovery</li>
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
                Trust Badges Explained
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                What our review badges mean for you
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
                    What If My Application is Not Approved?
                  </h2>
                  <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      If your manufacturer application cannot be approved based on the information provided, we may share feedback on what can be improved. You can update your details and resubmit your application at any time. Please note that no payment is required during the application process, and payment will only be requested after approval.
                    </p>
                    <ul className="ml-6 list-disc space-y-2">
                      <li>Incomplete or unclear information</li>
                      <li>Missing business details</li>
                      <li>Profile content quality issues</li>
                      <li>Inconsistent information</li>
                    </ul>
                    <p>
                      You can address the issues and resubmit your application.
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
