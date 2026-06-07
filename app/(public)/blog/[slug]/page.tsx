"use client"

import React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, ArrowLeft, ChevronRight, Globe } from "lucide-react"
import {
  STATIC_ARTICLES,
  getArticleBySlug,
  formatPublishedDate,
} from "@/lib/static-articles"

export default function BlogArticlePage() {
  const params = useParams()
  const slugParam = params?.slug
  const slug = slugParam ? decodeURIComponent(String(slugParam)) : ""

  const article = getArticleBySlug(slug)

  const suggestedArticles = STATIC_ARTICLES.filter(
    (a) => a.slug !== slug
  ).slice(0, 3)

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-24 px-4">
            <div className="text-6xl mb-6">📄</div>
            <h1 className="text-2xl font-bold text-foreground mb-3">Article Not Found</h1>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              This article does not exist or may have been moved.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Insights
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">

        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden bg-primary">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-foreground/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-primary-foreground/50 mb-7 flex-wrap">
              <Link href="/blog" className="hover:text-primary-foreground/80 transition-colors flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                Insights
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="text-primary-foreground/70">{article.category}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="text-primary-foreground/90 line-clamp-1">{article.title}</span>
            </nav>

            <div className="max-w-3xl">
              <Badge className="mb-5 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
                {article.category}
              </Badge>

              <h1 className="text-3xl font-bold text-primary-foreground leading-tight sm:text-4xl lg:text-[2.6rem]">
                {article.title}
              </h1>

              <p className="mt-4 text-base text-primary-foreground/70 leading-relaxed max-w-2xl">
                {article.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-primary-foreground/60">
                <span className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/10">
                    <User className="h-3.5 w-3.5 text-primary-foreground/80" />
                  </div>
                  {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatPublishedDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Main Layout ─── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Featured Image — full width of content area */}
          <div className="relative mt-8 lg:mt-10 w-full h-72 sm:h-96 lg:h-[460px] overflow-hidden rounded-xl shadow-xl border border-border bg-muted">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>

          {/* Content grid */}
          <div className="py-10 lg:py-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">

            {/* ─── Article body ─── */}
            <article className="min-w-0">
              {/* Inline styles force bullets to render regardless of Tailwind prose resets */}
              <div
                className="text-base leading-relaxed text-muted-foreground"
                style={{
                  lineHeight: "1.85",
                }}
                dangerouslySetInnerHTML={{
                  __html: article.content
                    // Ensure <p> styling
                    .replace(/<p>/g, '<p style="margin-bottom:1.25rem;color:inherit;">')
                    // Ensure <ul> has bullets
                    .replace(/<ul>/g, '<ul style="list-style-type:disc;padding-left:1.5rem;margin-bottom:1.25rem;margin-top:0.5rem;">')
                    // Ensure <ol> has numbers
                    .replace(/<ol>/g, '<ol style="list-style-type:decimal;padding-left:1.5rem;margin-bottom:1.25rem;margin-top:0.5rem;">')
                    // Ensure <li> spacing
                    .replace(/<li>/g, '<li style="margin-bottom:0.4rem;padding-left:0.25rem;">')
                    // Strong text
                    .replace(/<strong>/g, '<strong style="color:var(--foreground);font-weight:600;">')
                }}
              />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Author card */}
              <div className="mt-10 rounded-xl border border-border bg-muted/40 p-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{article.author}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    SourceNest publishes professional sourcing knowledge to help buyers and manufacturers make better decisions in global trade.
                  </p>
                </div>
              </div>

              {/* Back link */}
              <div className="mt-8 pb-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to all articles
                </Link>
              </div>
            </article>

            {/* ─── Sidebar ─── */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 mb-5">
                  More Articles
                </h3>

                {suggestedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group block rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="relative h-32 w-full overflow-hidden bg-muted">
                      <Image
                        src={related.imageUrl}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="300px"
                      />
                    </div>
                    <div className="p-4">
                      <Badge variant="outline" className="text-xs border-primary/20 text-primary mb-2">
                        {related.category}
                      </Badge>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {related.title}
                      </h4>
                      <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {related.readTime}
                      </p>
                    </div>
                  </Link>
                ))}

                {/* CTA box */}
                <div className="rounded-xl bg-primary/5 border border-primary/15 p-5 text-center mt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mx-auto mb-3">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">Browse Manufacturers</p>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    Find reviewed manufacturers and send structured RFQs.
                  </p>
                  <Link
                    href="/suppliers"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Start Sourcing <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
