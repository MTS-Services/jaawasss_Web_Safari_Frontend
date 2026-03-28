import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, FileCheck, Eye, CheckCircle, ArrowRight } from "lucide-react"

const trustFeatures = [
  {
    icon: FileCheck,
    title: "Document Review",
    description: "Business licenses, certifications, and export documentation are reviewed by our screening team based on submitted information.",
  },
  {
    icon: Eye,
    title: "Profile Review",
    description: "Every manufacturer profile is manually reviewed before approval to assess accuracy based on provided information.",
  },
  {
    icon: CheckCircle,
    title: "Ongoing Monitoring",
    description: "We continuously monitor supplier performance and buyer feedback to maintain quality standards.",
  },
]

export function TrustSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm text-secondary">
              <Shield className="h-4 w-4" />
              <span>Trust & Review</span>
            </div>
            <h2 className="mt-6 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Every Supplier is Reviewed Before You See Them
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Unlike open marketplaces, SourceNest requires admin approval for every manufacturer. This means you only see suppliers that have been reviewed based on submitted information and documents.
            </p>

            <div className="mt-10 space-y-6">
              {trustFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                    <feature.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="mt-10 gap-2" asChild>
              <Link href="/verification">
                Learn About Our Review Process
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="rounded-2xl bg-primary p-8 text-primary-foreground lg:p-12">
              <div className="flex items-center gap-3">
                <Shield className="h-10 w-10" />
                <span className="font-serif text-2xl">SourceNest Reviewed</span>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 p-4">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  <span>Business Registration Documents Reviewed</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 p-4">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  <span>Factory Location Information Provided</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 p-4">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  <span>Certifications Submitted</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 p-4">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  <span>Export Experience Declared</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 p-4">
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  <span>Profile Content Reviewed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
