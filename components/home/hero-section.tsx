"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, Globe, Shield, MessageSquare } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function HeroSection() {
  const { t } = useTranslation()
  
  if (!t || !t.landing?.hero) {
    return null
  }
  
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm text-primary-foreground">
            <Globe className="h-4 w-4" />
            <span>{t.landing.hero.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl font-medium tracking-tight text-primary-foreground min-[400px]:text-4xl sm:text-5xl lg:text-6xl">
            <span className="block text-balance">{t.landing.hero.title1}</span>
            <span className="block text-balance">{t.landing.hero.title2}</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80 sm:text-xl">
            {t.landing.hero.subtitle}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.landing.hero.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 border-0 bg-background pl-12 pr-4 text-base shadow-lg"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 bg-secondary px-8 text-secondary-foreground hover:bg-secondary/90">
                {t.landing.hero.searchButton}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-primary-foreground/70">
            <span>{t.landing.hero.popular}</span>
            <Link href="/industries/electronics-electrical" className="hover:text-primary-foreground hover:underline">
              {t.landing.hero.popElectronics}
            </Link>
            <Link href="/industries/textiles-apparel" className="hover:text-primary-foreground hover:underline">
              {t.landing.hero.popTextiles}
            </Link>
            <Link href="/industries/machinery-equipment" className="hover:text-primary-foreground hover:underline">
              {t.landing.hero.popMachinery}
            </Link>
            <Link href="/industries/food-beverage" className="hover:text-primary-foreground hover:underline">
              {t.landing.hero.popFood}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                <Globe className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-semibold text-primary-foreground">50+</span>
              <span className="text-sm text-primary-foreground/70">{t.landing.hero.statCountries}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-semibold text-primary-foreground">100%</span>
              <span className="text-sm text-primary-foreground/70">{t.landing.hero.statReviewed}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-semibold text-primary-foreground">{t.landing.hero.statDirectPrefix}</span>
              <span className="text-sm text-primary-foreground/70">{t.landing.hero.statDirect}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V30C240 50 480 60 720 50C960 40 1200 10 1440 30V60H0Z" className="fill-background" />
        </svg>
      </div>
    </section>
  )
}
