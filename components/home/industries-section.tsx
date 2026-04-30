"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cpu, Cog, Shirt, Home, Heart, Car, UtensilsCrossed, FlaskConical, Package, Lightbulb, Wrench, HardHat, Sofa, Stethoscope, Wheat, Box, FileText, Factory, ShoppingBag, Globe } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { getPublicCategories, BackendCategory } from "@/lib/api/categories"
import { industries as industriesData } from "@/lib/data/industries"

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

export function IndustriesSection() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<BackendCategory[]>([])

  useEffect(() => {
    async function loadCategories() {
      const res = await getPublicCategories()
      
      let featured: any[] = []
      if (res.success && res.data) {
        // Only show featured categories
        featured = res.data.filter((c) => Boolean(c.featured))
      }

      // If we have less than 8 featured categories from backend, pad with static ones
      if (featured.length < 8) {
        const remaining = 8 - featured.length
        const staticFeatured = industriesData.filter(i => i.featured)
        // Find static ones that are not already in the backend list (by slug or name)
        const additional = staticFeatured.filter(
          s => !featured.some(f => f.slug?.toLowerCase() === s.slug.toLowerCase() || f.name.toLowerCase() === s.name.toLowerCase())
        ).slice(0, remaining)
        
        // Convert static format to match backend format
        const additionalFormatted = additional.map(a => ({
          id: a.slug,
          name: a.name,
          slug: a.slug,
          description: a.description,
          featured: 1,
          color: undefined,
          icon_url: undefined,
          supplier_count: a.supplierCount
        }))
        
        featured = [...featured, ...additionalFormatted]
      }

      setCategories(featured.slice(0, 8))
    }
    loadCategories()
  }, [])

  if (!t || !t.landing?.featured) {
    return null
  }
  
  return (
    <section className="py-8 sm:py-12 lg:py-24 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary mb-4">
            <Package className="h-4 w-4" />
            {t.landing.featured.industriesBadge}
          </span>
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl lg:text-5xl">
            {t.landing.featured.industriesTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t.landing.featured.industriesSubtitle}
          </p>
        </div>

        {/* Industry Cards Grid - Larger cards in 2 rows */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((industry) => {
            const industryColor = industry.color || "#0052cc"; // Fallback blue
            // Compute a very transparent background based on the hex color for gradient
            const hexToRgba = (hex: string, alpha: number) => {
              const r = parseInt(hex.slice(1, 3), 16) || 0;
              const g = parseInt(hex.slice(3, 5), 16) || 0;
              const b = parseInt(hex.slice(5, 7), 16) || 0;
              return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };
            const defaultGradient = `linear-gradient(to bottom right, ${hexToRgba(industryColor, 0.1)}, ${hexToRgba(industryColor, 0.05)})`;
            const hoverGradient = `linear-gradient(to bottom right, ${hexToRgba(industryColor, 0.2)}, ${hexToRgba(industryColor, 0.1)})`;
            
            // Fix image URL by stripping /api/vX from the base URL if present
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
            const baseUrl = apiUrl.replace(/\/api\/v[0-9]+$/, "");

            const iconUrl = industry.icon_url 
              ? (industry.icon_url.startsWith("http") 
                  ? industry.icon_url 
                  : `${baseUrl}${industry.icon_url.startsWith('/') ? '' : '/'}${industry.icon_url}`)
              : null;

            return (
              <Link
                key={industry.slug || industry.id}
                href={`/industries/${industry.slug || industry.id}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-secondary/50 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Background Gradient (Inline styles for custom color logic) */}
                <div 
                  className="absolute inset-0 transition-all duration-300" 
                  style={{ background: defaultGradient }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = hoverGradient; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = defaultGradient; }}
                />
                
                {/* Content */}
                <div className="relative p-6 lg:p-8">
                  {/* Icon */}
                  <div 
                    className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl bg-card shadow-md transition-transform duration-300 group-hover:scale-110 text-secondary"
                  >
                    {iconUrl ? (
                      <img src={iconUrl} alt={industry.name} className="h-8 w-8 lg:h-10 lg:w-10 object-contain" />
                    ) : (
                      industryIcons[industry.slug || ""] || <Package className="h-8 w-8 lg:h-10 lg:w-10" />
                    )}
                  </div>

                  {/* Industry Name */}
                  <h3 className="mt-5 text-xl font-semibold text-foreground group-hover:text-secondary transition-colors">
                    {industry.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2" title={industry.description}>
                    {industry.description || "Explore suppliers and products in this industry sector."}
                  </p>

                  {/* Stats */}
                  <div className="mt-5 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Factory className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{industry.supplier_count?.toLocaleString() || 0}</span>
                      <span className="text-muted-foreground">suppliers</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="mt-5 flex items-center text-sm font-medium text-secondary transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {/* View All Industries Button */}
          <Button size="lg" variant="default" className="gap-2" asChild>
            <Link href="/industries">
              <Package className="h-4 w-4" />
              View All Industries
            </Link>
          </Button>
          {/* Explore Global Map Button */}
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
