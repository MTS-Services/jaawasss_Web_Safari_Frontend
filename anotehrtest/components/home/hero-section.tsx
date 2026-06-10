"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, Globe, Shield, MessageSquare } from "lucide-react"

export function HeroSection() {
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

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-1.5 rounded-full bg-secondary/20 px-3 py-1 text-xs sm:text-sm text-primary-foreground">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Connecting Global Trade</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-2xl font-medium tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
            <span className="block text-balance">Discover Reviewed</span>
            <span className="block text-balance">Manufacturers Worldwide</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-3 sm:mt-5 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 sm:text-lg lg:text-xl">
            Search products, compare suppliers, request quotes, and connect directly with trusted factories through one premium global sourcing platform.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mt-6 sm:mt-8 max-w-2xl">
            <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products, suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 sm:h-12 lg:h-14 border-0 bg-background pl-9 sm:pl-11 lg:pl-12 pr-3 text-sm sm:text-base shadow-lg"
                />
              </div>
              <Button type="submit" size="lg" className="h-11 sm:h-12 lg:h-14 bg-secondary px-6 sm:px-8 text-sm sm:text-base text-secondary-foreground hover:bg-secondary/90">
                Search
                <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-xs sm:text-sm text-primary-foreground/70">
            <span>Popular:</span>
            <Link href="/industries/electronics-electrical" className="hover:text-primary-foreground hover:underline">
              Electronics
            </Link>
            <Link href="/industries/textiles-apparel" className="hover:text-primary-foreground hover:underline">
              Textiles
            </Link>
            <Link href="/industries/machinery-equipment" className="hover:text-primary-foreground hover:underline">
              Machinery
            </Link>
            <Link href="/industries/food-beverage" className="hidden sm:inline hover:text-primary-foreground hover:underline">
              Food & Beverage
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-6">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-secondary/20">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary-foreground">50+</span>
              <span className="text-[10px] sm:text-xs lg:text-sm text-primary-foreground/70">Countries</span>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-secondary/20">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary-foreground">100%</span>
              <span className="text-[10px] sm:text-xs lg:text-sm text-primary-foreground/70">Reviewed</span>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-secondary/20">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary-foreground">Direct</span>
              <span className="text-[10px] sm:text-xs lg:text-sm text-primary-foreground/70">Communication</span>
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
