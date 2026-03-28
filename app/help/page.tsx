import { Metadata } from "next"
import Link from "next/link"
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
  ArrowRight,
  MessageSquare
} from "lucide-react"
import { 
  defaultHelpCenterData, 
  getEnabledCategories, 
  getEnabledArticles,
  getEnabledPopularArticles 
} from "@/lib/data/help-center"

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers to common questions about using SourceNest for buyers and manufacturers.",
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Factory,
  CreditCard,
  Shield,
  Settings,
  HelpCircle
}

export default function HelpCenterPage() {
  const data = defaultHelpCenterData
  const categories = getEnabledCategories(data)
  const popularArticles = getEnabledPopularArticles(data)
  const { settings } = data

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                {settings.hero.title}
              </h1>
              <p className="mt-4 text-lg text-primary-foreground/80">
                {settings.hero.subtitle}
              </p>
              
              {/* Search */}
              <div className="mx-auto mt-8 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={settings.hero.searchPlaceholder}
                    className="h-14 border-0 bg-background pl-12 pr-4 text-base shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-medium text-foreground">Browse by Category</h2>
            
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const Icon = iconMap[category.icon] || HelpCircle
                const enabledArticles = getEnabledArticles(category)
                
                return (
                  <Link
                    key={category.id}
                    href={`/help/${category.slug}`}
                    className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground group-hover:text-secondary">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                    <ul className="mt-4 space-y-2">
                      {enabledArticles.slice(0, 3).map((article) => (
                        <li key={article.id} className="text-sm text-muted-foreground">
                          • {article.title}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary">
                      View all articles
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        {popularArticles.length > 0 && (
          <section className="bg-muted/50 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-medium text-foreground">Popular Articles</h2>
              
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {popularArticles.map((article) => {
                  const category = categories.find(c => c.id === article.categoryId)
                  
                  return (
                    <Link
                      key={article.id}
                      href={`/help/${article.categorySlug}/${article.articleSlug}`}
                      className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md"
                    >
                      <div>
                        <span className="text-xs text-muted-foreground">
                          {category?.title || article.categorySlug}
                        </span>
                        <h3 className="mt-1 font-medium text-foreground group-hover:text-secondary">
                          {article.title}
                        </h3>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-secondary" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Contact Support */}
        {settings.contactSupport.enabled && (
          <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl rounded-2xl bg-primary p-8 text-center text-primary-foreground lg:p-12">
                <MessageSquare className="mx-auto h-12 w-12" />
                <h2 className="mt-6 font-serif text-2xl font-medium">
                  {settings.contactSupport.title}
                </h2>
                <p className="mt-4 text-primary-foreground/80">
                  {settings.contactSupport.subtitle}
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link 
                    href="/contact?type=support"
                    className="inline-flex items-center justify-center rounded-md bg-primary-foreground px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90"
                  >
                    {settings.contactSupport.contactButtonText}
                  </Link>
                  <Link 
                    href="/faq"
                    className="inline-flex items-center justify-center rounded-md border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                  >
                    {settings.contactSupport.faqButtonText}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
