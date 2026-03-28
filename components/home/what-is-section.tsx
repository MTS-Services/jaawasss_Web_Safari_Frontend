import { Factory, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export function WhatIsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            What is SourceNest?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            SourceNest is a premium global digital marketplace where importers, buyers, and sourcing professionals discover reviewed manufacturers and factories from around the world. Factories present their products, capabilities, and certifications, while buyers search, compare, and connect directly — all in one trusted platform.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* For Buyers */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
              <Users className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">For Buyers & Importers</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Discover reviewed manufacturers, compare suppliers side-by-side, save favorites, send quote requests, and communicate directly with factories. Your entire sourcing workflow in one place — completely free.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Search thousands of reviewed suppliers
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Compare factories and capabilities
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Request quotes and message directly
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Access product catalogs and specs
              </li>
            </ul>
            <Link 
              href="/for-buyers" 
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
            >
              Learn more for buyers
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* For Manufacturers */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
              <Factory className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">For Manufacturers & Factories</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Create your digital booth, upload products, showcase certifications, and get discovered by buyers worldwide. Receive inquiries and quote requests directly in your dashboard. Join through affordable subscription plans.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Build a professional company profile
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Upload unlimited product catalogs
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Receive and manage quote requests
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Gain global visibility and exposure
              </li>
            </ul>
            <Link 
              href="/for-manufacturers" 
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
            >
              Learn more for manufacturers
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
