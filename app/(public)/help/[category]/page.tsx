"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Users, 
  Factory, 
  CreditCard, 
  Shield, 
  Settings, 
  HelpCircle,
  ArrowLeft,
  ChevronRight
} from "lucide-react"
import { 
  defaultHelpCenterData, 
  getCategoryBySlug, 
  getEnabledArticles 
} from "@/lib/data/help-center"

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Factory,
  CreditCard,
  Shield,
  Settings,
  HelpCircle
}

export default function HelpCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params)
  const categoryData = getCategoryBySlug(defaultHelpCenterData, category)
  
  if (!categoryData) {
    notFound()
  }

  const Icon = iconMap[categoryData.icon] || HelpCircle
  const articles = getEnabledArticles(categoryData)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="border-b border-border bg-muted/50 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/help" className="text-muted-foreground hover:text-foreground">
                Help Center
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{categoryData.title}</span>
            </div>
          </div>
        </section>

        {/* Header */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link 
              href="/help" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Help Center
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
                <Icon className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-medium text-foreground">
                  {categoryData.title}
                </h1>
                <p className="mt-1 text-muted-foreground">{categoryData.description}</p>
              </div>
            </div>

            {/* Search */}
            <div className="mt-8 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={`Search in ${categoryData.title}...`}
                  className="h-12 pl-12 pr-4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="pb-16 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-semibold text-foreground mb-6">All Articles ({articles.length})</h2>
            <div className="space-y-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/help/${category}/${article.slug}`}
                  className="group block rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-secondary/50"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-secondary">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {article.content}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary">
                    Read article
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
