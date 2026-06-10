import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cpu, Cog, Shirt, Home, Heart, Car, UtensilsCrossed, FlaskConical, Package, Lightbulb, Wrench, HardHat, Sofa, Stethoscope, Wheat, Box, FileText, Factory, ShoppingBag, Globe } from "lucide-react"
import { industries as industriesData } from "@/lib/data/industries"

// Only show featured industries on the homepage (limit to 8)
const featuredIndustries = industriesData.filter(i => i.featured).slice(0, 8)

// Map icon names to components - supports both slug-based lookup and icon name from data
const iconNameToComponent: Record<string, React.ElementType> = {
  // Icon names (as stored in data)
  "Cpu": Cpu,
  "Cog": Cog,
  "Shirt": Shirt,
  "Home": Home,
  "Heart": Heart,
  "Car": Car,
  "UtensilsCrossed": UtensilsCrossed,
  "FlaskConical": FlaskConical,
  "Package": Package,
  "Lightbulb": Lightbulb,
  "Wrench": Wrench,
  "HardHat": HardHat,
  "Sofa": Sofa,
  "Stethoscope": Stethoscope,
  "Wheat": Wheat,
  "Box": Box,
  "FileText": FileText,
  "Factory": Factory,
  "ShoppingBag": ShoppingBag,
}

// Legacy slug-based mapping (fallback for industries without icon field)
const slugToIconMap: Record<string, React.ElementType> = {
  "electronics-electrical": Cpu,
  "machinery-equipment": Cog,
  "textiles-apparel": Shirt,
  "home-garden": Home,
  "health-beauty": Heart,
  "automotive-parts": Car,
  "food-beverage": UtensilsCrossed,
  "chemicals-materials": FlaskConical,
  "packaging": Package,
  "lighting": Lightbulb,
  "metal-products": Wrench,
  "construction-materials": HardHat,
  "furniture": Sofa,
  "medical-equipment": Stethoscope,
  "agriculture": Wheat,
  "plastic-products": Box,
  "paper-products": FileText,
  "industrial-machinery": Factory,
  "consumer-goods": ShoppingBag,
}

// Helper to get icon component from industry data
const getIndustryIcon = (industry: { icon?: string; slug: string }): React.ElementType => {
  // First try to use the icon field from data
  if (industry.icon && iconNameToComponent[industry.icon]) {
    return iconNameToComponent[industry.icon]
  }
  // Fallback to slug-based lookup
  return slugToIconMap[industry.slug] || Package
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
    <section className="py-10 sm:py-14 lg:py-20 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-10 lg:mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-secondary mb-3 sm:mb-4">
            <Package className="h-3 w-3 sm:h-4 sm:w-4" />
            Popular Industries
          </span>
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-tight text-foreground">
            Find Suppliers by Industry
          </h2>
          <p className="mx-auto mt-2 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg text-muted-foreground">
            Discover reviewed manufacturers across major industrial sectors.
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-4">
          {featuredIndustries.map((industry) => {
            const IconComponent = getIndustryIcon(industry)
            return (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card transition-all duration-300 hover:border-secondary/50 hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-300 ${industryColors[industry.slug] || "from-secondary/10 to-secondary/5 group-hover:from-secondary/20 group-hover:to-secondary/10"}`} />
                
                {/* Content */}
                <div className="relative p-3 sm:p-5 lg:p-6">
                  {/* Icon */}
                  <div className={`flex h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-lg sm:rounded-xl lg:rounded-2xl bg-card shadow-sm sm:shadow-md transition-transform duration-300 group-hover:scale-105 sm:group-hover:scale-110 ${iconColors[industry.slug] || "text-secondary"}`}>
                    <IconComponent className="h-5 w-5 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                  </div>

                  {/* Industry Name */}
                  <h3 className="mt-3 sm:mt-4 lg:mt-5 text-sm sm:text-base lg:text-lg font-semibold text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                    {industry.name}
                  </h3>

                  {/* Description - Hidden on mobile */}
                  <p className="hidden sm:block mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {industry.description}
                  </p>

                  {/* Stats */}
                  <div className="mt-2 sm:mt-4 flex items-center gap-1 text-xs sm:text-sm">
                    <Factory className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{industry.supplierCount.toLocaleString()}</span>
                    <span className="text-muted-foreground hidden sm:inline">suppliers</span>
                  </div>

                  {/* Arrow - Hidden on mobile */}
                  <div className="hidden sm:flex mt-3 sm:mt-4 items-center text-xs sm:text-sm font-medium text-secondary">
                    <span>Explore</span>
                    <ArrowRight className="ml-1.5 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1 sm:group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="mt-6 sm:mt-10 lg:mt-12 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center">
          <Button size="default" className="gap-2 px-6 sm:px-8 h-10 sm:h-11 text-sm" asChild>
            <Link href="/industries">
              View All {industriesData.length} Industries
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </Button>
          <Button size="default" variant="outline" className="gap-2 h-10 sm:h-11 text-sm" asChild>
            <Link href="/suppliers/map">
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Explore Global Map
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
