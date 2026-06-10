import type { LucideIcon } from "lucide-react"
import {
  Palette,
  Ship,
  FileCheck,
  ShieldCheck,
  ClipboardCheck,
  Briefcase,
  Languages,
  Megaphone,
  Scale,
} from "lucide-react"

// Service availability options
export type ServiceAvailability = "local" | "remote" | "local-remote"

export const availabilityOptions: { value: ServiceAvailability; label: string; description: string }[] = [
  { value: "local", label: "Local Service", description: "On-site service in a specific location" },
  { value: "remote", label: "Remote Service", description: "Delivered online from anywhere" },
  { value: "local-remote", label: "Local + Remote", description: "Available both on-site and online" },
]

export function getAvailabilityLabel(value: ServiceAvailability): string {
  return availabilityOptions.find((o) => o.value === value)?.label ?? value
}

// Service package tiers
export type ServicePackageTier = "basic" | "standard" | "premium"

export const servicePackages: {
  tier: ServicePackageTier
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
}[] = [
  {
    tier: "basic",
    name: "Basic",
    price: "$0",
    period: "/mo",
    description: "Get listed and start receiving buyer requests.",
    features: [
      "Basic profile",
      "1 service listing",
      "Up to 3 portfolio items",
      "Limited buyer requests",
      "Standard placement",
    ],
  },
  {
    tier: "standard",
    name: "Standard",
    price: "$49",
    period: "/mo",
    description: "For growing service providers who want more visibility.",
    features: [
      "Full profile",
      "Up to 5 service listings",
      "Up to 15 portfolio items / files",
      "More buyer requests",
      "Better visibility in search",
      "Reviewed badge eligibility",
    ],
    highlighted: true,
  },
  {
    tier: "premium",
    name: "Premium",
    price: "$129",
    period: "/mo",
    description: "Maximum exposure and priority access to buyers.",
    features: [
      "Featured listing",
      "Unlimited service listings",
      "Large portfolio (50+ items / files)",
      "Priority buyer requests",
      "Highest visibility & homepage exposure",
      "Priority support",
    ],
  },
]

// Service categories
export interface ServiceCategory {
  slug: string
  name: string
  description: string
  icon: LucideIcon
  // A muted/soft style token pairing for the category card
  accent: string
  providerCount: number
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "design-branding",
    name: "Design & Branding",
    description: "Packaging design, logos, brand identity, and product visuals.",
    icon: Palette,
    accent: "bg-rose-500/10 text-rose-600",
    providerCount: 0,
  },
  {
    slug: "shipping-logistics",
    name: "Shipping & Logistics",
    description: "Freight forwarding, ocean & air freight, and warehousing.",
    icon: Ship,
    accent: "bg-sky-500/10 text-sky-600",
    providerCount: 0,
  },
  {
    slug: "customs-clearance",
    name: "Customs & Import Clearance",
    description: "Customs brokerage, duties, HS codes, and clearance support.",
    icon: FileCheck,
    accent: "bg-amber-500/10 text-amber-600",
    providerCount: 0,
  },
  {
    slug: "compliance-standards",
    name: "Compliance & Standards",
    description: "Product certification, CE, FDA, RoHS, and regulatory advice.",
    icon: ShieldCheck,
    accent: "bg-emerald-500/10 text-emerald-600",
    providerCount: 0,
  },
  {
    slug: "quality-inspection",
    name: "Quality Control & Inspection",
    description: "Factory audits, pre-shipment inspection, and lab testing.",
    icon: ClipboardCheck,
    accent: "bg-teal-500/10 text-teal-600",
    providerCount: 0,
  },
  {
    slug: "import-consulting",
    name: "Import Consulting",
    description: "Sourcing strategy, supplier vetting, and import guidance.",
    icon: Briefcase,
    accent: "bg-indigo-500/10 text-indigo-600",
    providerCount: 0,
  },
  {
    slug: "translation-communication",
    name: "Translation & Business Communication",
    description: "Document translation, interpreters, and supplier negotiation.",
    icon: Languages,
    accent: "bg-violet-500/10 text-violet-600",
    providerCount: 0,
  },
  {
    slug: "content-marketing",
    name: "Product Content & Marketing",
    description: "Product photography, listings, copywriting, and marketing.",
    icon: Megaphone,
    accent: "bg-orange-500/10 text-orange-600",
    providerCount: 0,
  },
  {
    slug: "legal-documentation",
    name: "Legal & Documentation",
    description: "Import & trade documentation, contracts, and regulatory support.",
    icon: Scale,
    accent: "bg-slate-500/10 text-slate-600",
    providerCount: 0,
  },
]

export function getServiceCategory(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.slug === slug)
}

// Service provider
export interface ServiceProvider {
  id: string
  name: string
  slug: string
  logo?: string
  categorySlug: string
  categoryName: string
  shortDescription: string
  description: string
  location: {
    city: string
    country: string
    countryCode: string
  }
  availability: ServiceAvailability
  languages: string[]
  reviewed: boolean
  packageTier: ServicePackageTier
  rating: number
  reviewCount: number
  experienceYears: number
  responseTime: string
  deliveryTime: string
  startingPrice?: string // undefined means "Price upon request"
  servicesOffered: string[]
  portfolio: string[]
  certifications?: string[]
  serviceCountries?: string[] // relevant destination/origin countries for location-based services
  featured?: boolean
}

export const serviceProviders: ServiceProvider[] = [
  {
    id: "sp-1",
    name: "NorthStar Packaging Studio",
    slug: "northstar-packaging-studio",
    categorySlug: "design-branding",
    categoryName: "Design & Branding",
    shortDescription: "Award-winning packaging and brand identity studio for global product brands.",
    description:
      "NorthStar Packaging Studio is a remote-first design house specializing in retail and e-commerce packaging, brand identity, and product visuals. We have helped over 300 importers turn factory products into shelf-ready, branded experiences. Our team handles dieline creation, print-ready files, and supplier-facing specifications so your manufacturer can produce exactly what you envision.",
    location: { city: "Lisbon", country: "Portugal", countryCode: "PT" },
    availability: "remote",
    languages: ["English", "Portuguese", "Spanish"],
    reviewed: true,
    packageTier: "premium",
    rating: 4.9,
    reviewCount: 128,
    experienceYears: 11,
    responseTime: "Within 3 hours",
    deliveryTime: "5-10 business days",
    startingPrice: "$450",
    servicesOffered: [
      "Packaging design & dielines",
      "Brand identity & logo",
      "Print-ready artwork",
      "Label & insert design",
      "Product mockups & 3D visuals",
    ],
    portfolio: ["/images/service-portfolio/packaging-1.png", "/images/service-portfolio/packaging-2.png"],
    featured: true,
  },
  {
    id: "sp-2",
    name: "Pacific Freight Solutions",
    slug: "pacific-freight-solutions",
    categorySlug: "shipping-logistics",
    categoryName: "Shipping & Logistics",
    shortDescription: "Full-service freight forwarder for Asia-to-worldwide ocean and air shipments.",
    description:
      "Pacific Freight Solutions manages end-to-end logistics from Chinese and Southeast Asian factories to ports worldwide. We handle FCL, LCL, air freight, and door-to-door delivery, with real-time tracking and customs coordination. Our team specializes in first-time importers and provides clear, all-in landed cost estimates before you book.",
    location: { city: "Shenzhen", country: "China", countryCode: "CN" },
    availability: "local-remote",
    languages: ["English", "Mandarin"],
    reviewed: true,
    packageTier: "premium",
    rating: 4.8,
    reviewCount: 214,
    experienceYears: 14,
    responseTime: "Within 1 hour",
    deliveryTime: "Varies by route",
    startingPrice: "Price upon request",
    servicesOffered: [
      "Ocean freight (FCL & LCL)",
      "Air freight",
      "Door-to-door delivery",
      "Cargo insurance",
      "Warehousing & consolidation",
    ],
    portfolio: ["/images/service-portfolio/freight-1.png"],
    serviceCountries: ["CN", "VN", "US", "GB", "DE", "AE"],
    featured: true,
  },
  {
    id: "sp-3",
    name: "ClearGate Customs Brokers",
    slug: "cleargate-customs-brokers",
    categorySlug: "customs-clearance",
    categoryName: "Customs & Import Clearance",
    shortDescription: "Licensed customs brokers for US & EU import clearance and duty optimization.",
    description:
      "ClearGate is a team of licensed customs brokers handling import clearance, HS code classification, and duty optimization for US and EU destinations. We help importers avoid costly delays, calculate accurate duties, and stay compliant with evolving trade regulations.",
    location: { city: "Rotterdam", country: "Netherlands", countryCode: "NL" },
    availability: "local-remote",
    languages: ["English", "Dutch", "German"],
    reviewed: true,
    packageTier: "standard",
    rating: 4.7,
    reviewCount: 96,
    experienceYears: 9,
    responseTime: "Within 4 hours",
    deliveryTime: "1-3 business days",
    startingPrice: "$150",
    servicesOffered: [
      "Import clearance",
      "HS code classification",
      "Duty & tax calculation",
      "Customs documentation",
      "Compliance audits",
    ],
    portfolio: [],
    serviceCountries: ["NL", "DE", "FR", "US"],
    featured: false,
  },
  {
    id: "sp-4",
    name: "Veritas Inspection Group",
    slug: "veritas-inspection-group",
    categorySlug: "quality-inspection",
    categoryName: "Quality Control & Inspection",
    shortDescription: "Independent factory audits and pre-shipment inspections across Asia.",
    description:
      "Veritas Inspection Group provides independent third-party quality control across China, Vietnam, India, and Bangladesh. Our inspectors conduct factory audits, during-production checks, and pre-shipment inspections, delivering detailed photo reports within 24 hours so you can ship with confidence.",
    location: { city: "Ho Chi Minh City", country: "Vietnam", countryCode: "VN" },
    availability: "local",
    languages: ["English", "Vietnamese", "Mandarin"],
    reviewed: true,
    packageTier: "premium",
    rating: 4.9,
    reviewCount: 173,
    experienceYears: 12,
    responseTime: "Within 2 hours",
    deliveryTime: "Report within 24h of visit",
    startingPrice: "$199",
    servicesOffered: [
      "Pre-shipment inspection",
      "During-production inspection",
      "Factory audits",
      "Lab testing coordination",
      "Container loading checks",
    ],
    portfolio: ["/images/service-portfolio/inspection-1.png"],
    serviceCountries: ["VN", "CN", "IN", "BD"],
    featured: true,
  },
  {
    id: "sp-5",
    name: "Meridian Import Advisors",
    slug: "meridian-import-advisors",
    categorySlug: "import-consulting",
    categoryName: "Import Consulting",
    shortDescription: "Sourcing strategy and supplier vetting for first-time and scaling importers.",
    description:
      "Meridian Import Advisors guides businesses through the entire import journey, from product sourcing strategy and supplier vetting to negotiation and risk management. We act as your on-the-ground partner to reduce sourcing risk and help you scale confidently.",
    location: { city: "Austin", country: "United States", countryCode: "US" },
    availability: "remote",
    languages: ["English", "Spanish"],
    reviewed: true,
    packageTier: "standard",
    rating: 4.8,
    reviewCount: 64,
    experienceYears: 8,
    responseTime: "Within 5 hours",
    deliveryTime: "Ongoing engagement",
    startingPrice: "$300",
    servicesOffered: [
      "Sourcing strategy",
      "Supplier vetting & due diligence",
      "Negotiation support",
      "Import process setup",
      "Risk assessment",
    ],
    portfolio: [],
    featured: false,
  },
  {
    id: "sp-6",
    name: "LinguaTrade Communications",
    slug: "linguatrade-communications",
    categorySlug: "translation-communication",
    categoryName: "Translation & Business Communication",
    shortDescription: "Trade document translation and live interpreters for supplier negotiations.",
    description:
      "LinguaTrade provides specialized translation for trade documents, contracts, and technical specifications, plus live interpreters for factory visits and supplier calls. We bridge language gaps so your sourcing conversations stay clear and professional.",
    location: { city: "Guangzhou", country: "China", countryCode: "CN" },
    availability: "local-remote",
    languages: ["English", "Mandarin", "Cantonese", "Arabic"],
    reviewed: false,
    packageTier: "basic",
    rating: 4.6,
    reviewCount: 41,
    experienceYears: 6,
    responseTime: "Within 6 hours",
    deliveryTime: "1-4 business days",
    startingPrice: "$60",
    servicesOffered: [
      "Document translation",
      "Contract translation",
      "Live interpreting (calls & visits)",
      "Supplier communication",
      "Technical spec localization",
    ],
    portfolio: [],
    serviceCountries: ["CN"],
    featured: false,
  },
  {
    id: "sp-7",
    name: "CertifyPro Compliance",
    slug: "certifypro-compliance",
    categorySlug: "compliance-standards",
    categoryName: "Compliance & Standards",
    shortDescription: "Product compliance and certification support for CE, FDA, RoHS, and more.",
    description:
      "CertifyPro helps importers navigate product compliance and certification requirements for major markets. From CE marking and FDA registration to RoHS and REACH, we manage testing coordination, documentation, and labeling so your products clear customs and meet regulations.",
    location: { city: "Frankfurt", country: "Germany", countryCode: "DE" },
    availability: "remote",
    languages: ["English", "German"],
    reviewed: true,
    packageTier: "standard",
    rating: 4.7,
    reviewCount: 53,
    experienceYears: 10,
    responseTime: "Within 4 hours",
    deliveryTime: "2-6 weeks",
    startingPrice: "Price upon request",
    servicesOffered: [
      "CE marking",
      "FDA registration",
      "RoHS & REACH compliance",
      "Testing coordination",
      "Labeling & documentation",
    ],
    portfolio: [],
    serviceCountries: ["DE", "FR", "GB", "US"],
    featured: false,
  },
  {
    id: "sp-8",
    name: "PixelCart Studio",
    slug: "pixelcart-studio",
    categorySlug: "content-marketing",
    categoryName: "Product Content & Marketing",
    shortDescription: "Product photography, listing content, and marketing for e-commerce sellers.",
    description:
      "PixelCart Studio creates conversion-focused product content for Amazon, Shopify, and retail. We produce studio photography, lifestyle shots, A+ content, and listing copy that turns sourced products into best sellers.",
    location: { city: "Manila", country: "Philippines", countryCode: "PH" },
    availability: "remote",
    languages: ["English", "Filipino"],
    reviewed: false,
    packageTier: "basic",
    rating: 4.5,
    reviewCount: 29,
    experienceYears: 5,
    responseTime: "Within 8 hours",
    deliveryTime: "3-7 business days",
    startingPrice: "$120",
    servicesOffered: [
      "Product photography",
      "Lifestyle & 3D renders",
      "Amazon A+ content",
      "Listing copywriting",
      "Social media assets",
    ],
    portfolio: ["/images/service-portfolio/content-1.png"],
    featured: false,
  },
  {
    id: "sp-9",
    name: "Lex Trade Documentation",
    slug: "lex-trade-documentation",
    categorySlug: "legal-documentation",
    categoryName: "Legal & Documentation",
    shortDescription: "Import, trade, and contract documentation specialists for cross-border commerce.",
    description:
      "Lex Trade Documentation prepares and reviews the paperwork that keeps your shipments moving and your business protected. From commercial invoices, packing lists, and certificates of origin to supplier contracts and regulatory filings, our trade documentation experts ensure every document is accurate, compliant, and dispute-ready.",
    location: { city: "Singapore", country: "Singapore", countryCode: "SG" },
    availability: "remote",
    languages: ["English", "Mandarin"],
    reviewed: true,
    packageTier: "standard",
    rating: 4.8,
    reviewCount: 47,
    experienceYears: 13,
    responseTime: "Within 3 hours",
    deliveryTime: "1-4 business days",
    startingPrice: "$180",
    servicesOffered: [
      "Import & trade documentation",
      "Commercial invoices & packing lists",
      "Certificates of origin",
      "Supplier contract assistance",
      "Regulatory & business documentation",
    ],
    portfolio: [],
    serviceCountries: ["SG", "CN", "US", "GB"],
    featured: true,
  },
  {
    id: "sp-10",
    name: "Sterling Trade Counsel",
    slug: "sterling-trade-counsel",
    categorySlug: "legal-documentation",
    categoryName: "Legal & Documentation",
    shortDescription: "Contract and regulatory support for importers navigating international trade law.",
    description:
      "Sterling Trade Counsel provides practical legal and documentation support for importers and brands. We draft and review supply agreements, handle trade documentation, and advise on regulatory requirements so you can source and sell with confidence across multiple markets.",
    location: { city: "London", country: "United Kingdom", countryCode: "GB" },
    availability: "remote",
    languages: ["English", "French"],
    reviewed: false,
    packageTier: "basic",
    rating: 4.6,
    reviewCount: 22,
    experienceYears: 7,
    responseTime: "Within 6 hours",
    deliveryTime: "3-7 business days",
    startingPrice: "Price upon request",
    servicesOffered: [
      "Contract drafting & review",
      "Trade & import documentation",
      "Regulatory support",
      "Terms & conditions",
      "Business documentation",
    ],
    portfolio: [],
    serviceCountries: ["GB", "EU", "US"],
    featured: false,
  },
]

// Recalculate provider counts per category
for (const category of serviceCategories) {
  category.providerCount = serviceProviders.filter((p) => p.categorySlug === category.slug).length
}

export function getServiceProviderBySlug(slug: string): ServiceProvider | undefined {
  return serviceProviders.find((p) => p.slug === slug)
}

export function getServiceProvidersByCategory(slug: string): ServiceProvider[] {
  return serviceProviders.filter((p) => p.categorySlug === slug)
}

export function getFeaturedServiceProviders(): ServiceProvider[] {
  return serviceProviders.filter((p) => p.featured)
}

// Common languages for filters
export const serviceLanguages = [
  "English",
  "Mandarin",
  "Cantonese",
  "Spanish",
  "German",
  "French",
  "Portuguese",
  "Arabic",
  "Vietnamese",
  "Dutch",
  "Filipino",
]

// Price range buckets for filtering
export const priceRanges = [
  { value: "under-100", label: "Under $100" },
  { value: "100-300", label: "$100 - $300" },
  { value: "300-500", label: "$300 - $500" },
  { value: "500-plus", label: "$500+" },
  { value: "upon-request", label: "Price upon request" },
]

export function startingPriceLabel(provider: ServiceProvider): string {
  if (!provider.startingPrice || provider.startingPrice === "Price upon request") {
    return "Price upon request"
  }
  return `From ${provider.startingPrice}`
}

// Tooltip copy shown next to the Reviewed badge
export const REVIEWED_TOOLTIP =
  "Reviewed by SourceNest. Profile information and supporting documents have been reviewed by our team."

// Keyword map used for the AI Service Match and guided assistant.
// Maps a category slug to terms that should route a query to it.
const categoryKeywords: Record<string, string[]> = {
  "design-branding": [
    "design",
    "branding",
    "brand",
    "packaging",
    "package",
    "logo",
    "label",
    "artwork",
    "private label",
    "mockup",
    "graphic",
    "identity",
  ],
  "shipping-logistics": [
    "shipping",
    "freight",
    "forwarder",
    "forwarding",
    "logistics",
    "ocean",
    "air freight",
    "warehouse",
    "warehousing",
    "container",
    "delivery",
    "transport",
  ],
  "customs-clearance": [
    "customs",
    "broker",
    "clearance",
    "duty",
    "duties",
    "tariff",
    "hs code",
    "import clearance",
    "declaration",
  ],
  "compliance-standards": [
    "compliance",
    "standard",
    "certification",
    "certify",
    "ce",
    "fda",
    "rohs",
    "reach",
    "regulatory",
    "regulation",
    "safety",
  ],
  "quality-inspection": [
    "quality",
    "inspection",
    "inspector",
    "audit",
    "qc",
    "testing",
    "factory audit",
    "pre-shipment",
  ],
  "import-consulting": [
    "consulting",
    "consultant",
    "sourcing",
    "supplier",
    "vetting",
    "strategy",
    "advisor",
    "guidance",
    "due diligence",
  ],
  "translation-communication": [
    "translation",
    "translate",
    "translator",
    "interpreter",
    "interpreting",
    "language",
    "negotiation",
    "communication",
  ],
  "content-marketing": [
    "content",
    "marketing",
    "photography",
    "photo",
    "listing",
    "copywriting",
    "copy",
    "amazon",
    "social media",
  ],
  "legal-documentation": [
    "legal",
    "lawyer",
    "documentation",
    "document",
    "contract",
    "agreement",
    "trade documentation",
    "paperwork",
    "invoice",
    "certificate of origin",
  ],
}

export interface ServiceMatchResult {
  category: ServiceCategory
  countryCode?: string
  countryName?: string
  providers: ServiceProvider[]
}

/**
 * Lightweight smart matching for the AI Service Match input.
 * Scores each category by keyword hits in the query and returns the best
 * match along with any detected country and relevant providers.
 */
export function matchService(query: string, countries: { code: string; name: string }[] = []): ServiceMatchResult | null {
  const q = query.toLowerCase().trim()
  if (!q) return null

  // Score categories by keyword matches
  let bestSlug: string | null = null
  let bestScore = 0
  for (const [slug, keywords] of Object.entries(categoryKeywords)) {
    let score = 0
    for (const kw of keywords) {
      if (q.includes(kw)) score += kw.includes(" ") ? 2 : 1
    }
    if (score > bestScore) {
      bestScore = score
      bestSlug = slug
    }
  }

  if (!bestSlug || bestScore === 0) return null
  const category = getServiceCategory(bestSlug)
  if (!category) return null

  // Detect a country mentioned in the query
  let detected: { code: string; name: string } | undefined
  for (const c of countries) {
    if (c.name.length > 3 && q.includes(c.name.toLowerCase())) {
      detected = c
      break
    }
  }

  let providers = getServiceProvidersByCategory(bestSlug)
  let countryMatched = false
  if (detected) {
    const local = providers.filter(
      (p) => p.location.countryCode === detected!.code || p.serviceCountries?.includes(detected!.code),
    )
    if (local.length > 0) {
      providers = local
      countryMatched = true
    }
  }

  // Prioritize reviewed + featured providers
  providers = [...providers].sort((a, b) => {
    if (a.reviewed !== b.reviewed) return a.reviewed ? -1 : 1
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1
    return b.rating - a.rating
  })

  return {
    category,
    countryCode: countryMatched ? detected?.code : undefined,
    countryName: countryMatched ? detected?.name : undefined,
    providers,
  }
}

// ---------------------------------------------------------------------------
// Provider reviews
// ---------------------------------------------------------------------------

export interface ProviderReview {
  id: string
  author: string
  company: string
  country: string
  rating: number
  date: string
  title: string
  comment: string
}

interface ReviewSeed {
  author: string
  company: string
  country: string
  title: string
  comment: string
  rating: number
  monthsAgo: number
}

// Pool of realistic review seeds reused deterministically across providers.
const reviewPool: ReviewSeed[] = [
  {
    author: "Daniel R.",
    company: "Harbor Goods Co.",
    country: "United States",
    title: "Exactly the partner we needed",
    comment:
      "Communication was fast and clear from the first message. They understood our requirements immediately and delivered ahead of the deadline. We've already started our next project with them.",
    rating: 5,
    monthsAgo: 1,
  },
  {
    author: "Mei L.",
    company: "Lumen Retail",
    country: "Singapore",
    title: "Professional and reliable",
    comment:
      "Very responsive throughout the whole process and clearly experienced. They flagged a couple of issues we hadn't considered, which saved us time and money down the line.",
    rating: 5,
    monthsAgo: 2,
  },
  {
    author: "Tomás G.",
    company: "Andes Imports",
    country: "Spain",
    title: "Smooth experience end to end",
    comment:
      "Pricing was transparent and there were no surprises. The documentation and updates were detailed and easy to follow. Would recommend to other importers.",
    rating: 4,
    monthsAgo: 3,
  },
  {
    author: "Sarah K.",
    company: "Northwind Brands",
    country: "United Kingdom",
    title: "Great attention to detail",
    comment:
      "They were thorough and patient with all of our questions as first-time importers. Everything was handled professionally and we felt supported the entire way.",
    rating: 5,
    monthsAgo: 4,
  },
  {
    author: "Ahmed F.",
    company: "Gulf Trading House",
    country: "United Arab Emirates",
    title: "Solid work, would use again",
    comment:
      "Delivered what was promised and kept us informed at each stage. Turnaround was a little slower than expected during a busy period, but the quality made up for it.",
    rating: 4,
    monthsAgo: 6,
  },
  {
    author: "Julia M.",
    company: "Meridian Sourcing",
    country: "Germany",
    title: "Highly knowledgeable team",
    comment:
      "Their expertise was obvious from our first call. They guided us through the parts of the process we didn't understand and made the whole thing feel low-risk.",
    rating: 5,
    monthsAgo: 8,
  },
  {
    author: "Carlos V.",
    company: "Pacific Line Co.",
    country: "Mexico",
    title: "Dependable and responsive",
    comment:
      "Always replied quickly and gave honest advice even when it wasn't the most profitable option for them. That kind of integrity is hard to find.",
    rating: 5,
    monthsAgo: 10,
  },
  {
    author: "Priya S.",
    company: "Saffron & Co.",
    country: "India",
    title: "Good value for the price",
    comment:
      "Fair pricing and a clear scope of work from the start. A few small details took an extra round of revisions, but the final result was exactly what we needed.",
    rating: 4,
    monthsAgo: 12,
  },
]

// Simple deterministic hash so each provider gets a stable, unique set of reviews.
function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function monthsAgoToDate(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

/**
 * Returns a deterministic set of reviews for a provider, sized relative to its
 * reviewCount so every profile has a populated, realistic reviews section.
 */
export function getProviderReviews(provider: ServiceProvider): ProviderReview[] {
  const seed = hashString(provider.id)
  const count = Math.min(reviewPool.length, Math.max(3, Math.round(provider.reviewCount / 30)))
  const start = seed % reviewPool.length

  return Array.from({ length: count }, (_, i) => {
    const seedItem = reviewPool[(start + i) % reviewPool.length]
    return {
      id: `${provider.id}-review-${i}`,
      author: seedItem.author,
      company: seedItem.company,
      country: seedItem.country,
      rating: seedItem.rating,
      date: monthsAgoToDate(seedItem.monthsAgo + i),
      title: seedItem.title,
      comment: seedItem.comment,
    }
  })
}

/** Star distribution (1-5) derived deterministically from a provider's reviewCount. */
export function getRatingBreakdown(provider: ServiceProvider): { stars: number; count: number }[] {
  const total = provider.reviewCount
  // Weighting skewed toward higher ratings, nudged by the provider's average.
  const high = provider.rating >= 4.8 ? 0.82 : provider.rating >= 4.6 ? 0.74 : 0.66
  const weights = [high, 0.16, 0.06, 0.015, 0.005]
  const counts = weights.map((w) => Math.round(total * w))
  // Fix rounding drift on the 5-star bucket.
  const diff = total - counts.reduce((a, b) => a + b, 0)
  counts[0] += diff
  return [5, 4, 3, 2, 1].map((stars, i) => ({ stars, count: Math.max(0, counts[i]) }))
}
