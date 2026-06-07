"use client"

import { Factory, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

export function WhatIsSection() {
  const { t } = useTranslation();
  return (
    <section className="py-8 sm:py-12 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t.landing.whatIs.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {t.landing.whatIs.desc}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {/* For Buyers */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
              <Users className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">{t.landing.whatIs.forBuyers}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {t.landing.whatIs.forBuyersDesc}
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {t.landing.whatIs.buyerPoint1}
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {t.landing.whatIs.buyerPoint2}
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {t.landing.whatIs.buyerPoint3}
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {t.landing.whatIs.buyerPoint4}
              </li>
            </ul>
            <Link 
              href="/for-buyers" 
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
            >
              {t.landing.whatIs.buyerLink}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* For Manufacturers */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
              <Factory className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">{t.landing.whatIs.forMfg}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {t.landing.whatIs.forMfgDesc}
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {t.landing.whatIs.mfgPoint1}
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {t.landing.whatIs.mfgPoint2}
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {t.landing.whatIs.mfgPoint3}
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {t.landing.whatIs.mfgPoint4}
              </li>
            </ul>
            <Link 
              href="/for-manufacturers" 
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
            >
              {t.landing.whatIs.mfgLink}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
