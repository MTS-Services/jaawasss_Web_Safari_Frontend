import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Factory } from "lucide-react"

export function CtaSection() {
  return (
    <section className="bg-primary py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-tight text-primary-foreground">
            Ready to Transform Your Sourcing?
          </h2>
          <p className="mx-auto mt-2 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg text-primary-foreground/80">
            Join thousands of buyers and manufacturers already connecting through SourceNest.
          </p>
        </div>

        <div className="mt-6 sm:mt-10 lg:mt-12 grid gap-3 sm:gap-4 lg:gap-6 md:grid-cols-2">
          {/* Buyer CTA */}
          <div className="rounded-xl sm:rounded-2xl bg-primary-foreground/10 p-4 sm:p-6 lg:p-8 backdrop-blur">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-primary-foreground/20">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary-foreground" />
            </div>
            <h3 className="mt-3 sm:mt-4 lg:mt-6 text-base sm:text-lg lg:text-xl font-semibold text-primary-foreground">For Buyers</h3>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-primary-foreground/80">
              Create a free account to search suppliers, compare factories, and start sourcing globally.
            </p>
            <Button 
              variant="secondary" 
              size="default" 
              className="mt-4 sm:mt-5 lg:mt-6 gap-1.5 sm:gap-2 h-9 sm:h-10 text-sm bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              asChild
            >
              <Link href="/auth/signup?role=buyer">
                Create Free Account
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </div>

          {/* Manufacturer CTA */}
          <div className="rounded-xl sm:rounded-2xl bg-primary-foreground/10 p-4 sm:p-6 lg:p-8 backdrop-blur">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-primary-foreground/20">
              <Factory className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary-foreground" />
            </div>
            <h3 className="mt-3 sm:mt-4 lg:mt-6 text-base sm:text-lg lg:text-xl font-semibold text-primary-foreground">For Manufacturers</h3>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-primary-foreground/80">
              Showcase your factory, reach global buyers, and grow your export business with SourceNest.
            </p>
            <Button 
              variant="secondary" 
              size="default" 
              className="mt-4 sm:mt-5 lg:mt-6 gap-1.5 sm:gap-2 h-9 sm:h-10 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/90"
              asChild
            >
              <Link href="/pricing">
                View Pricing Plans
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
