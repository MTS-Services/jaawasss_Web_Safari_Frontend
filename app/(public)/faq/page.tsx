import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { getFaqCategories } from "@/lib/api/faqs"
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

type FaqPageItem = {
  id: string
  question: string
  answer: string
  sort: number
}

type FaqPageCategory = {
  id: string
  title: string
  sort: number
  faqs: FaqPageItem[]
}

export default async function FaqPage() {
  const response = await getFaqCategories()

  const faqCategories: FaqPageCategory[] = response.success
    ? response.data
        .map((category, categoryIndex) => {
          const categoryFaqs = category.faqs
            .filter((faq) => faq.question.trim().length > 0 && faq.answer.trim().length > 0)
            .sort((a, b) => a.sort - b.sort)
            .map((faq, faqIndex) => ({
              id: `${category.id}-${faq.id || faqIndex + 1}`,
              question: faq.question,
              answer: faq.answer,
              sort: faq.sort,
            }))

          return {
            id: String(category.id || categoryIndex + 1),
            title: category.name.trim().length > 0 ? category.name : "None",
            sort: category.sort,
            faqs: categoryFaqs.length > 0
              ? categoryFaqs
              : [
                  {
                    id: `none-${category.id || categoryIndex + 1}`,
                    question: "None",
                    answer: "None",
                    sort: 0,
                  },
                ],
          }
        })
        .sort((a, b) => {
          if (a.sort !== b.sort) {
            return a.sort - b.sort
          }

          return a.id.localeCompare(b.id)
        })
    : []

  const categoriesToRender = faqCategories.length > 0
    ? faqCategories
    : [
        {
          id: "none",
          title: "None",
          sort: 0,
          faqs: [
            {
              id: "none",
              question: "None",
              answer: "None",
              sort: 0,
            },
          ],
        },
      ]

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
            {categoriesToRender.map((category, categoryIndex) => (
              <div key={category.id} className={categoryIndex > 0 ? "mt-16" : ""}>
                <h2 className="font-serif text-2xl font-medium text-foreground">{category.title}</h2>
                <Accordion type="single" collapsible className="mt-6">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`${category.id}-${index}`}>
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
