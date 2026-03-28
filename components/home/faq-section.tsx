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
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to know about using SourceNest
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Have more questions?
            </p>
            <Button variant="outline" className="mt-4 gap-2" asChild>
              <Link href="/faq">
                View Full FAQ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
