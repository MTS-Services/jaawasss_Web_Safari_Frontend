"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, User, Clock, Globe, BookOpen, ChevronRight } from "lucide-react"
import {
  STATIC_ARTICLES,
  ARTICLE_CATEGORIES,
  formatPublishedDate,
} from "@/lib/static-articles"

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredArticles =
    selectedCategory === "All"
      ? STATIC_ARTICLES
      : STATIC_ARTICLES.filter((a) => a.category === selectedCategory)

  const featuredArticle = filteredArticles.find((a) => a.isFeatured)
  const regularArticles = filteredArticles.filter((a) => !a.isFeatured)

  // Only show categories that have at least one article
  const activeCategories = ARTICLE_CATEGORIES.filter((cat) => {
    if (cat === "All") return true
    return STATIC_ARTICLES.some((a) => a.category === cat)
  })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">

        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden bg-primary py-20 lg:py-28">
          {/* Background grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Decorative orbs */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-foreground/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-2 text-xs font-medium uppercase tracking-widest text-primary-foreground/80 backdrop-blur-sm mb-6">
                <Globe className="h-3.5 w-3.5" />
                SourceNest Knowledge Center
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                Insights &amp; Resources
              </h1>
              <p className="mt-5 text-lg text-primary-foreground/75 leading-relaxed max-w-2xl mx-auto">
                Professional knowledge on global sourcing, RFQs, manufacturer reviews, supplier comparison, import/export, and international trade — built for serious B2B buyers and manufacturers.
              </p>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-primary-foreground/60">
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{STATIC_ARTICLES.length} Articles</span>
                <span className="h-1 w-1 rounded-full bg-primary-foreground/30" />
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" />SourceNest Editorial Team</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Category Filter ─── */}
        <section className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
              {activeCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    category === selectedCategory
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {filteredArticles.length === 0 ? (
          <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 text-center">
              <p className="text-muted-foreground">No articles found in this category.</p>
            </div>
          </section>
        ) : (
          <>
            {/* ─── Featured Article ─── */}
            {featuredArticle && (
              <section className="py-12 lg:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3">Featured Article</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <Link
                    href={`/blog/${featuredArticle.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/30"
                  >
                    <div className="grid lg:grid-cols-5">
                      {/* Image */}
                      <div className="relative lg:col-span-3 h-64 sm:h-80 lg:h-full min-h-[320px] overflow-hidden bg-muted">
                        <Image
                          src={featuredArticle.imageUrl}
                          alt={featuredArticle.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
                      </div>
                      {/* Content */}
                      <div className="lg:col-span-2 flex flex-col justify-center p-8 lg:p-12">
                        <Badge className="w-fit bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                          {featuredArticle.category}
                        </Badge>
                        <h2 className="mt-5 text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight lg:text-3xl">
                          {featuredArticle.title}
                        </h2>
                        <p className="mt-4 text-muted-foreground leading-relaxed line-clamp-3">
                          {featuredArticle.excerpt}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {featuredArticle.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatPublishedDate(featuredArticle.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {featuredArticle.readTime}
                          </span>
                        </div>
                        <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          Read Article
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {/* ─── Articles Grid ─── */}
            <section className="pb-20 lg:pb-28">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {regularArticles.length > 0 && (
                  <>
                    <div className="mb-8 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">
                        {featuredArticle ? "More Articles" : "All Articles"}
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {regularArticles.length} article{regularArticles.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {regularArticles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/blog/${article.slug}`}
                          className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
                        >
                          {/* Card Image */}
                          <div className="relative h-52 overflow-hidden bg-muted">
                            <Image
                              src={article.imageUrl}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {/* Card Content */}
                          <div className="flex flex-1 flex-col p-6">
                            <Badge
                              variant="outline"
                              className="w-fit text-xs border-primary/30 text-primary bg-primary/5"
                            >
                              {article.category}
                            </Badge>
                            <h3 className="mt-3 font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {article.excerpt}
                            </p>
                            <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatPublishedDate(article.publishedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.readTime}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Read Article <ChevronRight className="h-3 w-3" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}

        {/* ─── CTA Banner ─── */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Ready to Start Sourcing?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Browse reviewed manufacturers, send structured RFQs, and make smarter sourcing decisions on SourceNest.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/suppliers"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                Browse Manufacturers
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/rfq"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:border-primary/30"
              >
                Submit an RFQ
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
