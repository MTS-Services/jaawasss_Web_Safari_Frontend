import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Factory } from "lucide-react"

export function CtaSection() {
  return (
    <section className="bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-primary-foreground sm:text-4xl">
            Ready to Transform Your Sourcing?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Join thousands of buyers and manufacturers already connecting through SourceNest.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Buyer CTA */}
          <div className="rounded-2xl bg-primary-foreground/10 p-8 backdrop-blur">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Users className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-primary-foreground">For Buyers</h3>
            <p className="mt-2 text-primary-foreground/80">
              Create a free account to search suppliers, compare factories, and start sourcing globally.
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="mt-6 gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              asChild
            >
              <Link href="/auth/signup?role=buyer">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Manufacturer CTA */}
          <div className="rounded-2xl bg-primary-foreground/10 p-8 backdrop-blur">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Factory className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-primary-foreground">For Manufacturers</h3>
            <p className="mt-2 text-primary-foreground/80">
              Showcase your factory, reach global buyers, and grow your export business with SourceNest.
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="mt-6 gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              asChild
            >
              <Link href="/pricing">
                View Pricing Plans
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
