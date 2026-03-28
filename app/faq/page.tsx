import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about SourceNest, our platform, pricing, and review process.",
}

const faqCategories = [
  {
    title: "General",
    faqs: [
      {
        question: "What is SourceNest?",
        answer: "SourceNest is a premium global B2B sourcing platform that connects buyers, importers, and sourcing professionals with reviewed manufacturers and factories worldwide. It's a digital marketplace where you can search for suppliers, compare their capabilities, view products, and communicate directly with factories.",
      },
      {
        question: "Who is SourceNest for?",
        answer: "SourceNest serves two main audiences: Buyers (importers, distributors, retailers, brands, and sourcing professionals looking for manufacturing partners) and Manufacturers (factories and manufacturers seeking to reach global buyers and expand their export business).",
      },
      {
        question: "How is SourceNest different from other B2B platforms?",
        answer: "Unlike open marketplaces where anyone can list, SourceNest requires every manufacturer to go through our review and approval process based on submitted information. This means buyers know that suppliers have been screened, and manufacturers benefit from being in a quality-focused marketplace. We also keep the platform free for buyers, ensuring maximum reach for manufacturers.",
      },
    ],
  },
  {
    title: "For Buyers",
    faqs: [
      {
        question: "Is SourceNest free for buyers?",
        answer: "Yes, absolutely. SourceNest is completely free for buyers. You can create an account, search suppliers, compare factories, send messages, request quotes, and manage your sourcing activity at no cost. There are no hidden fees or premium tiers for buyers.",
      },
      {
        question: "Do I need an account to use SourceNest?",
        answer: "You can browse suppliers and products without an account, but you'll need to create a free buyer account to send messages, request quotes, save suppliers, compare factories, and access other interactive features.",
      },
      {
        question: "How do I message a supplier?",
        answer: "Once you're logged in, you can click 'Message Supplier' on any supplier profile or product page. Your message goes directly to the factory's inbox on SourceNest, and they'll receive a notification. All communication happens within the platform's secure messaging system.",
      },
      {
        question: "What is an RFQ and how do I send one?",
        answer: "RFQ stands for Request for Quote. It's a formal way to ask a supplier for pricing on specific products. When you click 'Request Quote' on a product or supplier page, you'll fill out a form with details about what you need (product, quantity, specifications, etc.), and the manufacturer will respond with their quotation.",
      },
      {
        question: "How do I compare suppliers?",
        answer: "When viewing supplier profiles, you can click 'Add to Compare' to add them to your comparison list. Once you have multiple suppliers saved, go to the Compare page to see them side-by-side with details like capabilities, certifications, MOQ, lead times, and more.",
      },
    ],
  },
  {
    title: "For Manufacturers",
    faqs: [
      {
        question: "Why do manufacturers need to pay to join?",
        answer: "Manufacturers pay a subscription fee to maintain platform quality and fund review processes. This ensures only serious, committed manufacturers join the platform. Because buyers use SourceNest for free, manufacturers get access to a large pool of serious sourcing professionals actively looking for suppliers.",
      },
      {
        question: "What subscription plans are available?",
        answer: "We offer three plans: Starter ($149/month or $1,490/year) for small manufacturers starting their export journey, Growth ($299/month or $2,990/year) for established manufacturers seeking more exposure, and Enterprise (custom pricing) for large manufacturers with specific requirements. All plans include core features like company profiles, messaging, and RFQ management.",
      },
      {
        question: "Does paying automatically make my profile live?",
        answer: "No. Payment creates your manufacturer account, but your profile must go through our review and approval process before it becomes visible to buyers. This typically takes 2-5 business days after you submit your complete profile.",
      },
      {
        question: "What happens if my profile is not approved?",
        answer: "If your profile doesn't meet our requirements, we'll provide specific feedback on what needs to be updated. You can make the necessary changes and resubmit. If approval is ultimately not possible, we offer a full refund within 30 days of your initial payment.",
      },
    ],
  },
  {
    title: "Review & Trust",
    faqs: [
      {
        question: "How does the review process work?",
        answer: "When a manufacturer signs up and completes payment, their profile goes through a multi-step review based on submitted information. We review business documents, check submitted certifications, assess factory details, and review all profile content. Only after passing this review does the manufacturer become visible on the platform.",
      },
      {
        question: "What documents are required for the review process?",
        answer: "We typically review submitted business registration certificates, export/import licenses (if applicable), industry certifications (ISO, CE, FDA, etc.), and tax registration documents. The specific requirements may vary by country and industry.",
      },
      {
        question: "How long does the review take?",
        answer: "The review process typically takes 2-5 business days after you submit your complete profile with all required documents. Complex cases may take longer. We'll notify you via email once your profile is approved or if we need additional information.",
      },
      {
        question: "What do the trust badges mean?",
        answer: "Our primary badge is 'SourceNest Reviewed', which means the supplier has completed our review process based on submitted information. 'Featured Supplier' indicates a premium supplier with excellent ratings and response times. 'Export Ready' shows the supplier has declared experience in international shipping.",
      },
    ],
  },
  {
    title: "Messaging & Communication",
    faqs: [
      {
        question: "Is all communication on the platform?",
        answer: "Yes, all messaging between buyers and manufacturers happens within SourceNest's secure messaging system. This ensures a record of communications, protects both parties, and allows our support team to assist if needed.",
      },
      {
        question: "Can I share my contact information with suppliers?",
        answer: "While we encourage communication through the platform for security reasons, you're free to share contact information within messages once you've established a relationship with a supplier.",
      },
      {
        question: "How quickly do suppliers typically respond?",
        answer: "Response times vary by supplier, but most reviewed suppliers respond within 24-48 hours. You can see each supplier's typical response time on their profile page.",
      },
    ],
  },
  {
    title: "Billing & Payments",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Enterprise plans, we also offer bank transfer options.",
      },
      {
        question: "Can I change my subscription plan?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference immediately. When downgrading, the new rate applies at your next billing cycle.",
      },
      {
        question: "What is your refund policy?",
        answer: "We offer a 30-day money-back guarantee for new subscribers. If you're not satisfied with the platform within the first 30 days, contact us for a full refund. If your profile is not approved during review, you're also eligible for a full refund.",
      },
      {
        question: "Are there any transaction fees or commissions?",
        answer: "No. SourceNest does not take any commission on deals you close through the platform. Your subscription fee is your only cost. All negotiations and transactions happen directly between buyers and manufacturers.",
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-primary-foreground" />
              <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Everything you need to know about SourceNest
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={category.title} className={categoryIndex > 0 ? "mt-16" : ""}>
                <h2 className="font-serif text-2xl font-medium text-foreground">{category.title}</h2>
                <Accordion type="single" collapsible className="mt-6">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.title}-${index}`}>
                      <AccordionTrigger className="text-left text-base font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-muted/50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-2xl font-medium text-foreground">Still Have Questions?</h2>
              <p className="mt-4 text-muted-foreground">
                Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button className="gap-2" asChild>
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                  <Link href="/help">
                    Visit Help Center
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
