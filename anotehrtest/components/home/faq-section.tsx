"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight } from "lucide-react"

const faqs = [
  {
    question: "What is SourceNest?",
    answer: "SourceNest is a premium global B2B sourcing platform that connects buyers, importers, and sourcing professionals with reviewed manufacturers and factories worldwide. It's a digital marketplace where you can search for suppliers, compare their capabilities, and communicate directly.",
  },
  {
    question: "Is SourceNest free for buyers?",
    answer: "Yes, SourceNest is completely free for buyers. You can create an account, search suppliers, compare factories, send messages, request quotes, and manage your sourcing activity at no cost. There are no hidden fees or premium tiers for buyers.",
  },
  {
    question: "Why do manufacturers pay to join?",
    answer: "Manufacturers pay a subscription fee to maintain platform quality and fund review processes. This ensures only serious, committed manufacturers join the platform, giving buyers confidence that every supplier is legitimate and invested in doing business.",
  },
  {
    question: "How does the review process work?",
    answer: "When a manufacturer signs up and pays for their subscription, their profile goes through a manual review process. Our team reviews business documents, checks certifications, and reviews all profile content. Only after approval does the manufacturer become visible on the platform.",
  },
  {
    question: "How do I message a supplier?",
    answer: "To message a supplier, you need to create a free buyer account. Once logged in, you can click 'Message Supplier' on any supplier profile or product page. All communication happens within the platform's secure messaging system.",
  },
  {
    question: "What is an RFQ and how does it work?",
    answer: "RFQ stands for Request for Quote. It's a formal way to ask a supplier for pricing on specific products. You can submit an RFQ with details about the product, quantity, and requirements, and the manufacturer will respond with their quotation directly through the platform.",
  },
]

export function FaqSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground">
              Everything you need to know about using SourceNest
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-6 sm:mt-10 lg:mt-12">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm sm:text-base font-medium py-3 sm:py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed pb-3 sm:pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 sm:mt-10 lg:mt-12 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Have more questions?
            </p>
            <Button variant="outline" className="mt-3 sm:mt-4 gap-1.5 sm:gap-2 h-9 sm:h-10 text-sm" asChild>
              <Link href="/faq">
                View Full FAQ
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
