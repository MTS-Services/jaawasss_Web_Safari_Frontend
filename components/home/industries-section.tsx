import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cpu, Cog, Shirt, Home, Heart, Car, UtensilsCrossed, FlaskConical, Package, Lightbulb, Wrench, HardHat, Sofa, Stethoscope, Wheat, Box, FileText, Factory, ShoppingBag, Globe } from "lucide-react"
import { industries as industriesData } from "@/lib/data/industries"

// Only show featured industries on the homepage (limit to 8)
const featuredIndustries = industriesData.filter(i => i.featured).slice(0, 8)

// Map industry icons
const industryIcons: Record<string, React.ReactNode> = {
  "electronics-electrical": <Cpu className="h-8 w-8" />,
  "machinery-equipment": <Cog className="h-8 w-8" />,
  "textiles-apparel": <Shirt className="h-8 w-8" />,
  "home-garden": <Home className="h-8 w-8" />,
  "health-beauty": <Heart className="h-8 w-8" />,
  "automotive-parts": <Car className="h-8 w-8" />,
  "food-beverage": <UtensilsCrossed className="h-8 w-8" />,
  "chemicals-materials": <FlaskConical className="h-8 w-8" />,
  "packaging": <Package className="h-8 w-8" />,
  "lighting": <Lightbulb className="h-8 w-8" />,
  "metal-products": <Wrench className="h-8 w-8" />,
  "construction-materials": <HardHat className="h-8 w-8" />,
  "furniture": <Sofa className="h-8 w-8" />,
  "medical-equipment": <Stethoscope className="h-8 w-8" />,
  "agriculture": <Wheat className="h-8 w-8" />,
  "plastic-products": <Box className="h-8 w-8" />,
  "paper-products": <FileText className="h-8 w-8" />,
  "industrial-machinery": <Factory className="h-8 w-8" />,
  "consumer-goods": <ShoppingBag className="h-8 w-8" />,
}

// Industry background colors for visual distinction
const industryColors: Record<string, string> = {
  "electronics-electrical": "from-blue-500/10 to-blue-600/5 group-hover:from-blue-500/20 group-hover:to-blue-600/10",
  "machinery-equipment": "from-slate-500/10 to-slate-600/5 group-hover:from-slate-500/20 group-hover:to-slate-600/10",
  "textiles-apparel": "from-rose-500/10 to-rose-600/5 group-hover:from-rose-500/20 group-hover:to-rose-600/10",
  "home-garden": "from-emerald-500/10 to-emerald-600/5 group-hover:from-emerald-500/20 group-hover:to-emerald-600/10",
  "health-beauty": "from-pink-500/10 to-pink-600/5 group-hover:from-pink-500/20 group-hover:to-pink-600/10",
  "automotive-parts": "from-red-500/10 to-red-600/5 group-hover:from-red-500/20 group-hover:to-red-600/10",
  "food-beverage": "from-orange-500/10 to-orange-600/5 group-hover:from-orange-500/20 group-hover:to-orange-600/10",
  "chemicals-materials": "from-purple-500/10 to-purple-600/5 group-hover:from-purple-500/20 group-hover:to-purple-600/10",
  "packaging": "from-amber-500/10 to-amber-600/5 group-hover:from-amber-500/20 group-hover:to-amber-600/10",
  "lighting": "from-yellow-500/10 to-yellow-600/5 group-hover:from-yellow-500/20 group-hover:to-yellow-600/10",
  "metal-products": "from-zinc-500/10 to-zinc-600/5 group-hover:from-zinc-500/20 group-hover:to-zinc-600/10",
  "construction-materials": "from-stone-500/10 to-stone-600/5 group-hover:from-stone-500/20 group-hover:to-stone-600/10",
  "furniture": "from-teal-500/10 to-teal-600/5 group-hover:from-teal-500/20 group-hover:to-teal-600/10",
  "medical-equipment": "from-cyan-500/10 to-cyan-600/5 group-hover:from-cyan-500/20 group-hover:to-cyan-600/10",
}

const iconColors: Record<string, string> = {
  "electronics-electrical": "text-blue-600",
  "machinery-equipment": "text-slate-600",
  "textiles-apparel": "text-rose-600",
  "home-garden": "text-emerald-600",
  "health-beauty": "text-pink-600",
  "automotive-parts": "text-red-600",
  "food-beverage": "text-orange-600",
  "chemicals-materials": "text-purple-600",
  "packaging": "text-amber-600",
  "lighting": "text-yellow-600",
  "metal-products": "text-zinc-600",
  "construction-materials": "text-stone-600",
  "furniture": "text-teal-600",
  "medical-equipment": "text-cyan-600",
}

export function IndustriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary mb-4">
            <Package className="h-4 w-4" />
            Popular Industries
          </span>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Find Suppliers by Industry
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Discover reviewed manufacturers across major industrial sectors. Each category features vetted suppliers ready to fulfill your requirements.
          </p>
        </div>

        {/* Industry Cards Grid - Larger cards in 2 rows */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredIndustries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-secondary/50 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-300 ${industryColors[industry.slug] || "from-secondary/10 to-secondary/5 group-hover:from-secondary/20 group-hover:to-secondary/10"}`} />
              
              {/* Content */}
              <div className="relative p-6 lg:p-8">
                {/* Icon */}
                <div className={`flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl bg-card shadow-md transition-transform duration-300 group-hover:scale-110 ${iconColors[industry.slug] || "text-secondary"}`}>
                  {industryIcons[industry.slug] || <Package className="h-8 w-8 lg:h-10 lg:w-10" />}
                </div>

                {/* Industry Name */}
                <h3 className="mt-5 text-xl font-semibold text-foreground group-hover:text-secondary transition-colors">
                  {industry.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {industry.description}
                </p>

                {/* Stats */}
                <div className="mt-5 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Factory className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{industry.supplierCount.toLocaleString()}</span>
                    <span className="text-muted-foreground">suppliers</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="mt-5 flex items-center text-sm font-medium text-secondary">
                  <span>Explore</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="gap-2 px-8" asChild>
            <Link href="/industries">
              View All {industriesData.length} Industries
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <Link href="/suppliers/map">
              <Globe className="h-4 w-4" />
              Explore Global Map
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
