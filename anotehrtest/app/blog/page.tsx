import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Insights & Resources | SourceNest",
  description: "Expert insights on global sourcing trends, manufacturing best practices, supply chain strategies, and import/export guides for B2B trade professionals.",
}

const featuredPost = {
  slug: "global-sourcing-trends-2026",
  title: "Global Sourcing Trends 2026: Navigating the New Manufacturing Landscape",
  excerpt: "From nearshoring to AI-powered supply chains, discover the key trends reshaping how businesses source products globally. Learn actionable strategies for adapting your procurement approach in an increasingly complex trade environment.",
  category: "Global Sourcing",
  author: "Sarah Chen",
  date: "March 15, 2026",
  readTime: "15 min read",
}

const posts = [
  // Global Sourcing Trends
  {
    slug: "nearshoring-vs-offshoring-guide",
    title: "Nearshoring vs Offshoring: Making the Right Choice for Your Business",
    excerpt: "As supply chain resilience becomes critical, many businesses are reconsidering their manufacturing locations. Compare the benefits, costs, and risks of nearshoring versus traditional offshoring strategies.",
    category: "Global Sourcing",
    author: "Michael Torres",
    date: "March 14, 2026",
    readTime: "10 min read",
  },
  {
    slug: "china-plus-one-strategy",
    title: "China Plus One Strategy: Diversifying Your Supply Chain",
    excerpt: "Learn how leading companies are reducing risk by expanding manufacturing beyond China to Vietnam, India, Bangladesh, and other emerging markets while maintaining quality and efficiency.",
    category: "Global Sourcing",
    author: "David Park",
    date: "March 12, 2026",
    readTime: "12 min read",
  },
  // Manufacturing Insights
  {
    slug: "factory-automation-trends",
    title: "Factory Automation in 2026: What Buyers Need to Know",
    excerpt: "Smart factories, robotics, and Industry 4.0 are transforming manufacturing. Understand how automation affects product quality, lead times, and pricing when selecting suppliers.",
    category: "Manufacturing",
    author: "Emma Wilson",
    date: "March 10, 2026",
    readTime: "8 min read",
  },
  {
    slug: "quality-control-best-practices",
    title: "Quality Control Best Practices for International Sourcing",
    excerpt: "From pre-production inspections to final quality checks, learn the systematic approach successful importers use to maintain product quality across borders.",
    category: "Manufacturing",
    author: "Lisa Zhang",
    date: "March 8, 2026",
    readTime: "11 min read",
  },
  {
    slug: "sustainable-manufacturing-guide",
    title: "Sustainable Manufacturing: Finding Eco-Friendly Suppliers",
    excerpt: "Consumer demand for sustainability is rising. Discover how to identify, verify, and partner with manufacturers committed to environmental responsibility and ethical practices.",
    category: "Manufacturing",
    author: "Sarah Chen",
    date: "March 6, 2026",
    readTime: "9 min read",
  },
  // Supply Chain Insights
  {
    slug: "supply-chain-risk-management",
    title: "Supply Chain Risk Management: Building Resilience in Uncertain Times",
    excerpt: "From geopolitical tensions to natural disasters, learn proven strategies for identifying, assessing, and mitigating supply chain risks before they impact your business.",
    category: "Supply Chain",
    author: "Michael Torres",
    date: "March 4, 2026",
    readTime: "13 min read",
  },
  {
    slug: "logistics-optimization-guide",
    title: "Logistics Optimization: Reducing Costs and Lead Times",
    excerpt: "Master the fundamentals of international shipping, customs clearance, and logistics planning to streamline your supply chain and reduce total landed costs.",
    category: "Supply Chain",
    author: "David Park",
    date: "March 2, 2026",
    readTime: "10 min read",
  },
  {
    slug: "inventory-management-strategies",
    title: "Smart Inventory Management for Global Sourcing",
    excerpt: "Balance inventory costs with service levels using data-driven approaches to demand forecasting, safety stock calculations, and supplier lead time management.",
    category: "Supply Chain",
    author: "Emma Wilson",
    date: "February 28, 2026",
    readTime: "8 min read",
  },
  // Import/Export Tips
  {
    slug: "import-duties-tariffs-guide",
    title: "Understanding Import Duties and Tariffs: A Complete Guide",
    excerpt: "Navigate the complex world of customs duties, tariff classifications, and trade agreements. Learn how to calculate landed costs and leverage preferential trade arrangements.",
    category: "Import/Export",
    author: "Lisa Zhang",
    date: "February 25, 2026",
    readTime: "14 min read",
  },
  {
    slug: "incoterms-explained",
    title: "Incoterms 2020 Explained: Choosing the Right Terms for Your Shipments",
    excerpt: "From EXW to DDP, understand each Incoterm and when to use them. Make informed decisions about risk, cost, and responsibility in international transactions.",
    category: "Import/Export",
    author: "Sarah Chen",
    date: "February 22, 2026",
    readTime: "12 min read",
  },
  {
    slug: "letters-of-credit-guide",
    title: "Letters of Credit: Securing International Trade Payments",
    excerpt: "Protect your transactions with proper payment terms. Learn how letters of credit work, when to use them, and common pitfalls to avoid in international trade finance.",
    category: "Import/Export",
    author: "Michael Torres",
    date: "February 18, 2026",
    readTime: "10 min read",
  },
  // B2B Trade Knowledge
  {
    slug: "supplier-negotiation-strategies",
    title: "Supplier Negotiation: Strategies for Better Pricing and Terms",
    excerpt: "Master the art of supplier negotiation with proven techniques for securing competitive pricing, favorable payment terms, and value-added services.",
    category: "B2B Trade",
    author: "David Park",
    date: "February 15, 2026",
    readTime: "9 min read",
  },
  {
    slug: "supplier-relationship-management",
    title: "Building Long-Term Supplier Relationships That Last",
    excerpt: "Transform transactional buying into strategic partnerships. Learn how to develop trust, improve communication, and create mutual value with your key suppliers.",
    category: "B2B Trade",
    author: "Emma Wilson",
    date: "February 12, 2026",
    readTime: "8 min read",
  },
  {
    slug: "supplier-audit-checklist",
    title: "Complete Supplier Audit Checklist: What to Verify Before Ordering",
    excerpt: "A comprehensive guide to conducting supplier audits, from factory capabilities and certifications to financial stability and ethical compliance.",
    category: "B2B Trade",
    author: "Lisa Zhang",
    date: "February 8, 2026",
    readTime: "11 min read",
  },
  // Regional Guides
  {
    slug: "sourcing-from-vietnam",
    title: "Sourcing from Vietnam: Complete 2026 Guide",
    excerpt: "Vietnam has emerged as a top manufacturing destination. Explore key industries, regional strengths, business culture, and practical tips for successful sourcing.",
    category: "Regional Guides",
    author: "Sarah Chen",
    date: "February 5, 2026",
    readTime: "16 min read",
  },
  {
    slug: "sourcing-from-india",
    title: "Sourcing from India: Opportunities and Challenges",
    excerpt: "From textiles to pharmaceuticals, India offers diverse manufacturing capabilities. Understand the market landscape, key players, and how to navigate common challenges.",
    category: "Regional Guides",
    author: "Michael Torres",
    date: "February 1, 2026",
    readTime: "14 min read",
  },
  {
    slug: "sourcing-from-mexico",
    title: "Nearshoring to Mexico: A Guide for North American Buyers",
    excerpt: "Leverage USMCA benefits and geographic proximity by sourcing from Mexico. Learn about manufacturing hubs, logistics advantages, and cultural considerations.",
    category: "Regional Guides",
    author: "David Park",
    date: "January 28, 2026",
    readTime: "12 min read",
  },
]

const categories = [
  "All",
  "Global Sourcing",
  "Manufacturing",
  "Supply Chain",
  "Import/Export",
  "B2B Trade",
  "Regional Guides",
]

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                Insights & Resources
              </h1>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Expert knowledge on global sourcing, manufacturing trends, supply chain strategies, and international trade best practices for procurement professionals.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === "All"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
            >
              <div className="grid lg:grid-cols-2">
                <div className="aspect-[16/9] bg-muted lg:aspect-auto" />
                <div className="p-8 lg:p-12">
                  <Badge variant="secondary">{featuredPost.category}</Badge>
                  <h2 className="mt-4 font-serif text-2xl font-medium text-foreground group-hover:text-secondary lg:text-3xl">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-secondary">
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="pb-20 lg:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-medium text-foreground">Latest Articles</h2>
            
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
                >
                  <div className="aspect-[16/9] bg-muted" />
                  <div className="flex flex-1 flex-col p-6">
                    <Badge variant="outline" className="w-fit">{post.category}</Badge>
                    <h3 className="mt-3 font-semibold text-foreground group-hover:text-secondary line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <button className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                Load More Articles
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
