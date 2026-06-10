import { Factory, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export function WhatIsSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-tight text-foreground">
            What is SourceNest?
          </h2>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
            SourceNest is a premium global digital marketplace where importers, buyers, and sourcing professionals discover reviewed manufacturers and factories from around the world. Factories present their products, capabilities, and certifications, while buyers search, compare, and connect directly — all in one trusted platform.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 lg:mt-16 grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2">
          {/* For Buyers */}
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card p-5 sm:p-6 lg:p-8 transition-shadow hover:shadow-lg">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-secondary/10">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-secondary" />
            </div>
            <h3 className="mt-4 sm:mt-5 lg:mt-6 text-base sm:text-lg lg:text-xl font-semibold text-foreground">For Buyers & Importers</h3>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Discover reviewed manufacturers, compare suppliers side-by-side, save favorites, send quote requests, and communicate directly with factories.
            </p>
            <ul className="mt-4 sm:mt-5 lg:mt-6 space-y-2 sm:space-y-3">
              <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-secondary flex-shrink-0" />
                Search thousands of reviewed suppliers
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-secondary flex-shrink-0" />
                Compare factories and capabilities
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-secondary flex-shrink-0" />
                Request quotes and message directly
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-secondary flex-shrink-0" />
                Access product catalogs and specs
              </li>
            </ul>
            <Link 
              href="/for-buyers" 
              className="mt-5 sm:mt-6 lg:mt-8 inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-secondary hover:underline"
            >
              Learn more for buyers
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* For Manufacturers */}
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card p-5 sm:p-6 lg:p-8 transition-shadow hover:shadow-lg">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-secondary/10">
              <Factory className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-secondary" />
            </div>
            <h3 className="mt-4 sm:mt-5 lg:mt-6 text-base sm:text-lg lg:text-xl font-semibold text-foreground">For Manufacturers & Factories</h3>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Create your digital booth, upload products, showcase certifications, and get discovered by buyers worldwide. Join through affordable subscription plans.
            </p>
            <ul className="mt-4 sm:mt-5 lg:mt-6 space-y-2 sm:space-y-3">
              <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-secondary flex-shrink-0" />
                Build a professional company profile
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-secondary flex-shrink-0" />
                Upload unlimited product catalogs
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-secondary flex-shrink-0" />
                Receive and manage quote requests
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-secondary flex-shrink-0" />
                Gain global visibility and exposure
              </li>
            </ul>
            <Link 
              href="/for-manufacturers" 
              className="mt-5 sm:mt-6 lg:mt-8 inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-secondary hover:underline"
            >
              Learn more for manufacturers
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
