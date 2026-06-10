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
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs sm:text-sm text-secondary">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Trust & Review</span>
            </div>
            <h2 className="mt-3 sm:mt-5 font-serif text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-tight text-foreground">
              Every Supplier is Reviewed Before You See Them
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
              Unlike open marketplaces, SourceNest requires admin approval for every manufacturer. This means you only see suppliers that have been reviewed.
            </p>

            <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4 lg:space-y-5">
              {trustFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-2.5 sm:gap-3 lg:gap-4">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                    <feature.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="mt-5 sm:mt-8 gap-1.5 sm:gap-2 h-9 sm:h-10 text-sm" asChild>
              <Link href="/verification">
                Learn About Our Review Process
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="rounded-xl sm:rounded-2xl bg-primary p-4 sm:p-6 lg:p-10 text-primary-foreground">
              <div className="flex items-center gap-2 sm:gap-3">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
                <span className="font-serif text-base sm:text-xl lg:text-2xl">SourceNest Reviewed</span>
              </div>
              <div className="mt-4 sm:mt-6 lg:mt-8 space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 rounded-lg bg-primary-foreground/10 p-2.5 sm:p-3 lg:p-4">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">Business Registration Documents Reviewed</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 rounded-lg bg-primary-foreground/10 p-2.5 sm:p-3 lg:p-4">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">Factory Location Information Provided</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 rounded-lg bg-primary-foreground/10 p-2.5 sm:p-3 lg:p-4">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">Certifications Submitted</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 rounded-lg bg-primary-foreground/10 p-2.5 sm:p-3 lg:p-4">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">Export Experience Declared</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 rounded-lg bg-primary-foreground/10 p-2.5 sm:p-3 lg:p-4">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">Profile Content Reviewed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
