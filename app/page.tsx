import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WhatIsSection } from "@/components/home/what-is-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { WhyUseSection } from "@/components/home/why-use-section"
import { FeaturedSuppliersSection } from "@/components/home/featured-suppliers-section"
import { FeaturedProductsSection } from "@/components/home/featured-products-section"
import { IndustriesSection } from "@/components/home/industries-section"
import { TrustSection } from "@/components/home/trust-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { FaqSection } from "@/components/home/faq-section"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
        <main className="min-w-0 flex-1">
          <HeroSection />
          <IndustriesSection />
          <WhatIsSection />
          <FeaturedSuppliersSection />
          <HowItWorksSection />
          <FeaturedProductsSection />
          <WhyUseSection />
          <TrustSection />
          <TestimonialsSection />
          <FaqSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
