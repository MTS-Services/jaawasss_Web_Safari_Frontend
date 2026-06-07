"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight } from "lucide-react"
import { getFaqCategories } from "@/lib/api/faqs"
import { useTranslation } from "@/lib/i18n"

type FaqEntry = {
  id: string
  question: string
  answer: string
  sort: number
  categorySort: number
}

export function FaqSection() {
  const { t } = useTranslation()
  const [apiFaqs, setApiFaqs] = useState<FaqEntry[]>([])

  useEffect(() => {
    let active = true

    const loadFaqs = async () => {
      const response = await getFaqCategories()
      if (!active || !response.success) {
        return
      }

      const nextFaqs = response.data
        .flatMap((category) =>
          category.faqs.map((faq, faqIndex) => ({
            id: `${category.id}-${faq.id || faqIndex + 1}`,
            question: faq.question,
            answer: faq.answer,
            sort: faq.sort,
            categorySort: category.sort,
          }))
        )
        .filter((faq) => faq.question.trim().length > 0 && faq.answer.trim().length > 0)
        .sort((a, b) => {
          if (a.categorySort !== b.categorySort) {
            return a.categorySort - b.categorySort
          }

          return a.sort - b.sort
        })
        .slice(0, 6)

      setApiFaqs(nextFaqs)
    }

    loadFaqs()

    return () => {
      active = false
    }
  }, [])

  const faqs = useMemo(() => {
    if (apiFaqs.length > 0) {
      return apiFaqs
    }

    return [
      {
        id: "none",
        question: "None",
        answer: "None",
        sort: 0,
        categorySort: 0,
      },
    ]
  }, [apiFaqs])

  return (
    <section className="py-8 sm:py-12 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              {t.landing.faq.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.landing.faq.subtitle}
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq, index) => (
              <AccordionItem key={`${faq.id}-${index}`} value={`item-${index}`}>
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
              {t.landing.faq.moreQuestions}
            </p>
            <Button variant="outline" className="mt-4 gap-2" asChild>
              <Link href="/faq">
                {t.landing.faq.viewFull}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
