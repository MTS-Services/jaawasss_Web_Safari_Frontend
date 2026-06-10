import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { SmartRfqSection } from "@/components/home/smart-rfq-section"
import { AiSourcingSection } from "@/components/home/ai-sourcing-section"
import { OfferComparisonSection } from "@/components/home/offer-comparison-section"
import { AiToolsSection } from "@/components/home/ai-tools-section"
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        {/* Smart sourcing story: request -> journey -> compare -> communicate */}
        <SmartRfqSection />
        <AiSourcingSection />
        <OfferComparisonSection />
        <AiToolsSection />
        {/* Platform context */}
        <WhatIsSection />
        <IndustriesSection />
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
  )
}
