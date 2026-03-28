export interface Supplier {
  id: string
  name: string
  slug: string
  logo?: string
  description: string
  shortDescription: string
  industry: string
  industrySlug: string
  categories: string[]
  location: {
    city: string
    country: string
    countryCode: string
  }
  reviewed: boolean
  reviewedLevel: "basic" | "standard" | "premium" | "enterprise"
  yearEstablished: number
  employeeCount: string
  annualRevenue?: string
  productCount: number
  rating: number
  reviewCount: number
  responseRate: number
  responseTime: string
  onTimeDelivery: number
  certifications: string[]
  mainProducts: string[]
  exportMarkets: string[]
  minOrderValue?: string
  featured?: boolean
  // New fields
  businessType?: ("manufacturer" | "trading-company" | "oem" | "odm")[]
  capabilities?: ("oem" | "odm" | "private-label" | "customization")[]
  languages?: string[]
  paymentTerms?: string[]
  factoryPhotos?: string[]
}

export const suppliers: Supplier[] = [
  {
    id: "1",
    name: "TechVision Electronics Co., Ltd.",
    slug: "techvision-electronics",
    description: "TechVision Electronics is a leading manufacturer of consumer electronics and electronic components based in Shenzhen, China. With over 15 years of experience, we specialize in smartphones, tablets, wearables, and IoT devices. Our state-of-the-art manufacturing facilities span over 50,000 square meters, equipped with the latest SMT lines and automated assembly systems. We serve major brands worldwide and are committed to innovation, quality, and sustainable manufacturing practices.",
    shortDescription: "Leading manufacturer of consumer electronics and IoT devices with 15+ years experience.",
    industry: "Electronics & Electrical",
    industrySlug: "electronics-electrical",
    categories: ["Consumer Electronics", "Electronic Components", "LED & Lighting"],
    location: {
      city: "Shenzhen",
      country: "China",
      countryCode: "CN"
    },
    reviewed: true,
    reviewedLevel: "enterprise",
    yearEstablished: 2009,
    employeeCount: "1000-5000",
    annualRevenue: "$50M - $100M",
    productCount: 2450,
    rating: 4.9,
    reviewCount: 342,
    responseRate: 98,
    responseTime: "Within 2 hours",
    onTimeDelivery: 99,
    certifications: ["ISO 9001", "ISO 14001", "CE", "FCC", "RoHS"],
    mainProducts: ["Smartphones", "Tablets", "Wireless Earbuds", "Smart Watches", "Power Banks"],
    exportMarkets: ["North America", "Europe", "Southeast Asia", "Middle East"],
    minOrderValue: "$5,000",
    featured: true,
    businessType: ["manufacturer", "oem", "odm"],
    capabilities: ["oem", "odm", "private-label", "customization"],
    languages: ["English", "Mandarin", "Cantonese"],
    paymentTerms: ["T/T", "L/C", "PayPal", "Western Union"],
    factoryPhotos: ["/images/factory/techvision-1.jpg", "/images/factory/techvision-2.jpg", "/images/factory/techvision-3.jpg"]
  },
  {
    id: "2",
    name: "GlobalFab Machinery Inc.",
    slug: "globalfab-machinery",
    description: "GlobalFab Machinery is a premier manufacturer of industrial machinery and automation equipment. Based in Dongguan, China, we design and manufacture CNC machines, packaging equipment, and custom automation solutions for factories worldwide. Our engineering team includes 50+ experts with decades of combined experience in mechanical design and automation.",
    shortDescription: "Premier manufacturer of CNC machines and industrial automation equipment.",
    industry: "Machinery & Equipment",
    industrySlug: "machinery-equipment",
    categories: ["Industrial Machinery", "Packaging Machinery"],
    location: {
      city: "Dongguan",
      country: "China",
      countryCode: "CN"
    },
    reviewed: true,
    reviewedLevel: "premium",
    yearEstablished: 2005,
    employeeCount: "500-1000",
    annualRevenue: "$20M - $50M",
    productCount: 890,
    rating: 4.8,
    reviewCount: 187,
    responseRate: 95,
    responseTime: "Within 4 hours",
    onTimeDelivery: 97,
    certifications: ["ISO 9001", "CE", "SGS"],
    mainProducts: ["CNC Milling Machines", "CNC Lathes", "Laser Cutting Machines", "Packaging Lines"],
    exportMarkets: ["Europe", "North America", "South America", "Africa"],
    minOrderValue: "$10,000",
    featured: true,
    businessType: ["manufacturer"],
    capabilities: ["oem", "customization"],
    languages: ["English", "Mandarin"],
    paymentTerms: ["T/T", "L/C"],
    factoryPhotos: ["/images/factory/globalfab-1.jpg", "/images/factory/globalfab-2.jpg"]
  },
  {
    id: "3",
    name: "EcoThread Textiles",
    slug: "ecothread-textiles",
    description: "EcoThread Textiles is a sustainable textile manufacturer committed to eco-friendly fashion. We produce organic cotton fabrics, recycled polyester, and sustainable apparel for brands that care about environmental impact. Our facilities use 100% renewable energy and we are GOTS and OEKO-TEX certified.",
    shortDescription: "Sustainable textile manufacturer specializing in organic and recycled materials.",
    industry: "Textiles & Apparel",
    industrySlug: "textiles-apparel",
    categories: ["Fabrics & Textiles", "Apparel"],
    location: {
      city: "Dhaka",
      country: "Bangladesh",
      countryCode: "BD"
    },
    reviewed: true,
    reviewedLevel: "premium",
    yearEstablished: 2012,
    employeeCount: "1000-5000",
    annualRevenue: "$30M - $50M",
    productCount: 1560,
    rating: 4.7,
    reviewCount: 256,
    responseRate: 92,
    responseTime: "Within 6 hours",
    onTimeDelivery: 95,
    certifications: ["GOTS", "OEKO-TEX", "ISO 14001", "BSCI"],
    mainProducts: ["Organic Cotton Fabric", "T-Shirts", "Hoodies", "Activewear", "Denim"],
    exportMarkets: ["Europe", "North America", "Australia"],
    minOrderValue: "$3,000",
    featured: true,
    businessType: ["manufacturer", "oem"],
    capabilities: ["oem", "private-label", "customization"],
    languages: ["English", "Bengali"],
    paymentTerms: ["T/T", "L/C", "D/P"],
    factoryPhotos: ["/images/factory/ecothread-1.jpg", "/images/factory/ecothread-2.jpg", "/images/factory/ecothread-3.jpg", "/images/factory/ecothread-4.jpg"]
  },
  {
    id: "4",
    name: "LuxHome Furniture Co.",
    slug: "luxhome-furniture",
    description: "LuxHome Furniture manufactures premium home and office furniture with a focus on modern design and exceptional craftsmanship. Our factory in Vietnam produces solid wood furniture, upholstered pieces, and custom designs for residential and commercial spaces.",
    shortDescription: "Premium furniture manufacturer specializing in modern designs and solid wood products.",
    industry: "Home & Garden",
    industrySlug: "home-garden",
    categories: ["Furniture", "Home Decor"],
    location: {
      city: "Ho Chi Minh City",
      country: "Vietnam",
      countryCode: "VN"
    },
    reviewed: true,
    reviewedLevel: "standard",
    yearEstablished: 2010,
    employeeCount: "200-500",
    annualRevenue: "$10M - $20M",
    productCount: 680,
    rating: 4.6,
    reviewCount: 134,
    responseRate: 90,
    responseTime: "Within 8 hours",
    onTimeDelivery: 94,
    certifications: ["FSC", "ISO 9001", "SMETA"],
    mainProducts: ["Dining Tables", "Sofas", "Bed Frames", "Office Desks", "Outdoor Furniture"],
    exportMarkets: ["North America", "Europe", "Japan", "Korea"],
    minOrderValue: "$5,000",
    featured: true,
    businessType: ["manufacturer", "oem"],
    capabilities: ["oem", "customization"],
    languages: ["English", "Vietnamese"],
    paymentTerms: ["T/T", "L/C"],
    factoryPhotos: ["/images/factory/luxhome-1.jpg", "/images/factory/luxhome-2.jpg"]
  },
  {
    id: "5",
    name: "PureGlow Cosmetics",
    slug: "pureglow-cosmetics",
    description: "PureGlow Cosmetics is a contract manufacturer of skincare, haircare, and color cosmetics. Based in South Korea, we combine cutting-edge K-beauty formulations with world-class manufacturing capabilities. We offer private label, white label, and custom formulation services.",
    shortDescription: "K-beauty contract manufacturer offering private label and custom formulation services.",
    industry: "Health & Beauty",
    industrySlug: "health-beauty",
    categories: ["Cosmetics", "Personal Care"],
    location: {
      city: "Seoul",
      country: "South Korea",
      countryCode: "KR"
    },
    reviewed: true,
    reviewedLevel: "premium",
    yearEstablished: 2008,
    employeeCount: "500-1000",
    annualRevenue: "$20M - $50M",
    productCount: 1200,
    rating: 4.8,
    reviewCount: 298,
    responseRate: 96,
    responseTime: "Within 4 hours",
    onTimeDelivery: 98,
    certifications: ["GMP", "ISO 22716", "FDA Registered", "Halal"],
    mainProducts: ["Serums", "Moisturizers", "Sheet Masks", "Lip Products", "Hair Treatments"],
    exportMarkets: ["North America", "Europe", "Southeast Asia", "Middle East"],
    minOrderValue: "$5,000",
    featured: true,
    businessType: ["manufacturer", "oem", "odm"],
    capabilities: ["oem", "odm", "private-label", "customization"],
    languages: ["English", "Korean", "Japanese"],
    paymentTerms: ["T/T", "L/C", "PayPal"],
    factoryPhotos: ["/images/factory/pureglow-1.jpg", "/images/factory/pureglow-2.jpg", "/images/factory/pureglow-3.jpg"]
  },
  {
    id: "6",
    name: "AutoParts Global",
    slug: "autoparts-global",
    description: "AutoParts Global is a leading supplier of OEM and aftermarket automotive parts. With manufacturing facilities in China and distribution centers worldwide, we provide brake systems, suspension components, and engine parts to auto manufacturers and retailers globally.",
    shortDescription: "Leading supplier of OEM and aftermarket automotive parts with global distribution.",
    industry: "Automotive & Parts",
    industrySlug: "automotive-parts",
    categories: ["Auto Parts", "Auto Electronics"],
    location: {
      city: "Ningbo",
      country: "China",
      countryCode: "CN"
    },
    reviewed: true,
    reviewedLevel: "enterprise",
    yearEstablished: 2003,
    employeeCount: "1000-5000",
    annualRevenue: "$100M+",
    productCount: 5600,
    rating: 4.7,
    reviewCount: 412,
    responseRate: 94,
    responseTime: "Within 4 hours",
    onTimeDelivery: 96,
    certifications: ["IATF 16949", "ISO 9001", "TS16949"],
    mainProducts: ["Brake Pads", "Shock Absorbers", "Filters", "Clutch Kits", "Sensors"],
    exportMarkets: ["North America", "Europe", "Middle East", "Africa", "South America"],
    minOrderValue: "$2,000",
    featured: true,
    businessType: ["manufacturer", "trading-company"],
    capabilities: ["oem"],
    languages: ["English", "Mandarin", "Spanish"],
    paymentTerms: ["T/T", "L/C", "D/A", "Western Union"],
    factoryPhotos: ["/images/factory/autoparts-1.jpg", "/images/factory/autoparts-2.jpg"]
  }
]

export function getSupplierBySlug(slug: string): Supplier | undefined {
  return suppliers.find(supplier => supplier.slug === slug)
}

export function getFeaturedSuppliers(): Supplier[] {
  return suppliers.filter(supplier => supplier.featured)
}

export function getSuppliersByIndustry(industrySlug: string): Supplier[] {
  return suppliers.filter(supplier => supplier.industrySlug === industrySlug)
}

export function searchSuppliers(query: string): Supplier[] {
  const lowercaseQuery = query.toLowerCase()
  return suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(lowercaseQuery) ||
    supplier.description.toLowerCase().includes(lowercaseQuery) ||
    supplier.mainProducts.some(p => p.toLowerCase().includes(lowercaseQuery)) ||
    supplier.categories.some(c => c.toLowerCase().includes(lowercaseQuery))
  )
}
