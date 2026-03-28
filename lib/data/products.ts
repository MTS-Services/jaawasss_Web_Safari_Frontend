export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  supplierId: string
  supplierName: string
  supplierSlug: string
  industry: string
  industrySlug: string
  category: string
  categorySlug: string
  images?: string[]
  price?: {
    min: number
    max: number
    currency: string
    unit: string
  }
  moq: number
  moqUnit: string
  leadTime: string
  specifications: Record<string, string>
  certifications: string[]
  customizable: boolean
  sampleAvailable: boolean
  samplePrice?: number
  featured?: boolean
  // New fields
  customizationOptions?: string[]
  packagingDetails?: {
    type: string
    dimensions?: string
    weight?: string
    unitsPerCarton?: number
    description?: string
  }
  brochureUrl?: string
  keyFeatures?: string[]
}

export const products: Product[] = [
  {
    id: "1",
    name: "TWS Wireless Earbuds Pro",
    slug: "tws-wireless-earbuds-pro",
    description: "Premium true wireless earbuds featuring active noise cancellation, 40-hour battery life with charging case, and IPX5 water resistance. Perfect for OEM/ODM partnerships with customizable branding options.",
    shortDescription: "Premium TWS earbuds with ANC, 40hr battery, IPX5 rated",
    supplierId: "1",
    supplierName: "TechVision Electronics Co., Ltd.",
    supplierSlug: "techvision-electronics",
    industry: "Electronics & Electrical",
    industrySlug: "electronics-electrical",
    category: "Consumer Electronics",
    categorySlug: "consumer-electronics",
    price: {
      min: 12.50,
      max: 18.00,
      currency: "USD",
      unit: "piece"
    },
    moq: 1000,
    moqUnit: "pieces",
    leadTime: "15-20 days",
    specifications: {
      "Driver Size": "10mm",
      "Frequency Response": "20Hz-20kHz",
      "Battery (Earbuds)": "50mAh",
      "Battery (Case)": "500mAh",
      "Bluetooth": "5.3",
      "Water Resistance": "IPX5",
      "Charging": "USB-C, Wireless"
    },
    certifications: ["CE", "FCC", "RoHS"],
    customizable: true,
    sampleAvailable: true,
    samplePrice: 35,
    featured: true,
    customizationOptions: ["Logo printing", "Custom color", "Custom packaging", "App branding", "Custom sound profile"],
    packagingDetails: {
      type: "Retail Ready",
      dimensions: "10x8x4 cm",
      weight: "85g",
      unitsPerCarton: 50,
      description: "Premium gift box with foam insert, includes USB-C cable and ear tips"
    },
    brochureUrl: "/brochures/tws-earbuds-pro.pdf",
    keyFeatures: ["Active Noise Cancellation", "40-hour battery life", "IPX5 water resistance", "Touch controls", "Wireless charging case", "Bluetooth 5.3"]
  },
  {
    id: "2",
    name: "CNC Vertical Machining Center VMC-850",
    slug: "cnc-vertical-machining-center-vmc850",
    description: "High-precision CNC vertical machining center with 3-axis control, ideal for mold making and precision parts manufacturing. Features Siemens control system and automatic tool changer.",
    shortDescription: "High-precision 3-axis CNC machining center with Siemens control",
    supplierId: "2",
    supplierName: "GlobalFab Machinery Inc.",
    supplierSlug: "globalfab-machinery",
    industry: "Machinery & Equipment",
    industrySlug: "machinery-equipment",
    category: "Industrial Machinery",
    categorySlug: "industrial-machinery",
    price: {
      min: 28000,
      max: 45000,
      currency: "USD",
      unit: "set"
    },
    moq: 1,
    moqUnit: "set",
    leadTime: "45-60 days",
    specifications: {
      "Table Size": "1000x500mm",
      "X/Y/Z Travel": "850/500/550mm",
      "Spindle Speed": "8000 RPM",
      "Spindle Power": "7.5kW",
      "Tool Magazine": "24 tools",
      "Control System": "Siemens 828D",
      "Positioning Accuracy": "±0.008mm"
    },
    certifications: ["CE", "ISO 9001"],
    customizable: true,
    sampleAvailable: false,
    featured: true,
    customizationOptions: ["Custom spindle options", "Tool magazine capacity", "Control system upgrade", "Coolant system", "Chip conveyor"],
    packagingDetails: {
      type: "Industrial Crating",
      dimensions: "280x220x260 cm",
      weight: "4500kg",
      description: "Wooden crate with anti-vibration packaging, includes installation tools and accessories"
    },
    brochureUrl: "/brochures/vmc-850-catalog.pdf",
    keyFeatures: ["High-precision 3-axis control", "Siemens 828D control system", "24-tool automatic changer", "Rapid traverse 30m/min", "±0.008mm positioning accuracy", "Ball screw direct drive"]
  },
  {
    id: "3",
    name: "Organic Cotton Jersey Fabric",
    slug: "organic-cotton-jersey-fabric",
    description: "GOTS-certified organic cotton jersey fabric, perfect for sustainable fashion brands. Available in various weights and over 50 colors. Minimum order 500 meters per color.",
    shortDescription: "GOTS-certified organic cotton jersey, 50+ colors available",
    supplierId: "3",
    supplierName: "EcoThread Textiles",
    supplierSlug: "ecothread-textiles",
    industry: "Textiles & Apparel",
    industrySlug: "textiles-apparel",
    category: "Fabrics & Textiles",
    categorySlug: "fabrics-textiles",
    price: {
      min: 4.50,
      max: 7.00,
      currency: "USD",
      unit: "meter"
    },
    moq: 500,
    moqUnit: "meters",
    leadTime: "20-25 days",
    specifications: {
      "Composition": "100% Organic Cotton",
      "Weight": "180-280 GSM",
      "Width": "150-180cm",
      "Certification": "GOTS, OEKO-TEX",
      "Shrinkage": "<5%",
      "Colors": "50+ options"
    },
    certifications: ["GOTS", "OEKO-TEX Standard 100"],
    customizable: true,
    sampleAvailable: true,
    samplePrice: 15,
    featured: true,
    customizationOptions: ["Custom colors (Pantone)", "Custom weight (GSM)", "Custom width", "Organic dyeing", "Special finishes"],
    packagingDetails: {
      type: "Roll Packaging",
      dimensions: "Variable (by order)",
      weight: "25-40kg per roll",
      unitsPerCarton: 1,
      description: "Rolled on cardboard tubes, wrapped in plastic film, labeled with color and batch info"
    },
    brochureUrl: "/brochures/organic-cotton-catalog.pdf",
    keyFeatures: ["100% GOTS-certified organic cotton", "Pre-shrunk treatment", "Color fastness grade 4+", "50+ standard colors", "Sustainable dyeing process", "Soft hand feel"]
  },
  {
    id: "4",
    name: "Modern Solid Oak Dining Table",
    slug: "modern-solid-oak-dining-table",
    description: "Handcrafted solid oak dining table with modern minimalist design. Features FSC-certified wood and premium oil finish. Available in multiple sizes and finishes.",
    shortDescription: "FSC-certified solid oak dining table, modern minimalist design",
    supplierId: "4",
    supplierName: "LuxHome Furniture Co.",
    supplierSlug: "luxhome-furniture",
    industry: "Home & Garden",
    industrySlug: "home-garden",
    category: "Furniture",
    categorySlug: "furniture",
    price: {
      min: 180,
      max: 350,
      currency: "USD",
      unit: "piece"
    },
    moq: 50,
    moqUnit: "pieces",
    leadTime: "30-45 days",
    specifications: {
      "Material": "Solid Oak (FSC)",
      "Sizes": "160x90cm, 180x90cm, 200x100cm",
      "Height": "75cm",
      "Finish": "Natural Oil / Lacquer",
      "Assembly": "Knock-down / Pre-assembled",
      "Weight Capacity": "150kg"
    },
    certifications: ["FSC", "CARB P2"],
    customizable: true,
    sampleAvailable: true,
    samplePrice: 250,
    featured: true,
    customizationOptions: ["Custom dimensions", "Wood stain color", "Leg style", "Edge profile", "Logo engraving"],
    packagingDetails: {
      type: "Knock-down / Flat-pack",
      dimensions: "200x100x15 cm (packed)",
      weight: "45kg",
      unitsPerCarton: 1,
      description: "Cardboard box with foam corners, includes assembly hardware and instructions"
    },
    brochureUrl: "/brochures/oak-dining-collection.pdf",
    keyFeatures: ["FSC-certified solid oak", "Hand-finished natural oil", "Mortise and tenon joints", "Self-leveling feet", "10-year warranty", "Easy assembly"]
  },
  {
    id: "5",
    name: "Vitamin C Brightening Serum",
    slug: "vitamin-c-brightening-serum",
    description: "K-beauty vitamin C serum with 15% L-ascorbic acid, niacinamide, and hyaluronic acid. Available for private label with custom formulation options. FDA registered facility.",
    shortDescription: "K-beauty vitamin C serum, private label available",
    supplierId: "5",
    supplierName: "PureGlow Cosmetics",
    supplierSlug: "pureglow-cosmetics",
    industry: "Health & Beauty",
    industrySlug: "health-beauty",
    category: "Cosmetics",
    categorySlug: "cosmetics",
    price: {
      min: 2.80,
      max: 4.50,
      currency: "USD",
      unit: "piece"
    },
    moq: 3000,
    moqUnit: "pieces",
    leadTime: "25-30 days",
    specifications: {
      "Volume": "30ml",
      "Key Ingredients": "15% Vitamin C, Niacinamide, HA",
      "Packaging": "Amber Glass Dropper",
      "Shelf Life": "24 months",
      "Private Label": "Available",
      "Custom Formula": "Available"
    },
    certifications: ["GMP", "FDA Registered", "Halal"],
    customizable: true,
    sampleAvailable: true,
    samplePrice: 25,
    featured: true,
    customizationOptions: ["Custom formulation", "Private label", "Custom packaging", "Bottle design", "Fragrance options"],
    packagingDetails: {
      type: "Retail Ready",
      dimensions: "4x4x12 cm",
      weight: "65g",
      unitsPerCarton: 100,
      description: "Amber glass dropper bottle in printed box, includes insert card"
    },
    brochureUrl: "/brochures/vitamin-c-serum.pdf",
    keyFeatures: ["15% L-ascorbic acid", "Niacinamide complex", "Hyaluronic acid", "Stable formula", "Suitable for all skin types", "Cruelty-free"]
  },
  {
    id: "6",
    name: "Ceramic Brake Pad Set - Universal",
    slug: "ceramic-brake-pad-set-universal",
    description: "High-performance ceramic brake pads for passenger vehicles. Low dust, low noise formula with excellent stopping power. Compatible with most Asian and European vehicle models.",
    shortDescription: "High-performance ceramic brake pads, low dust formula",
    supplierId: "6",
    supplierName: "AutoParts Global",
    supplierSlug: "autoparts-global",
    industry: "Automotive & Parts",
    industrySlug: "automotive-parts",
    category: "Auto Parts",
    categorySlug: "auto-parts",
    price: {
      min: 8.50,
      max: 15.00,
      currency: "USD",
      unit: "set"
    },
    moq: 200,
    moqUnit: "sets",
    leadTime: "10-15 days",
    specifications: {
      "Type": "Ceramic",
      "Position": "Front / Rear",
      "Compatibility": "Asian & European vehicles",
      "Friction Coefficient": "0.35-0.45",
      "Temperature Range": "Up to 600°C",
      "Warranty": "50,000 km"
    },
    certifications: ["ECE R90", "IATF 16949"],
    customizable: false,
    sampleAvailable: true,
    samplePrice: 30,
    featured: true,
    packagingDetails: {
      type: "Standard Export",
      dimensions: "20x15x8 cm",
      weight: "850g",
      unitsPerCarton: 20,
      description: "Color box per set, master carton with foam dividers"
    },
    brochureUrl: "/brochures/ceramic-brake-pads.pdf",
    keyFeatures: ["Low dust formula", "Low noise operation", "Excellent stopping power", "Wide vehicle compatibility", "50,000 km warranty", "ECE R90 certified"]
  },
  {
    id: "7",
    name: "Smart LED Bulb - WiFi Enabled",
    slug: "smart-led-bulb-wifi",
    description: "WiFi-enabled smart LED bulb with voice control compatibility (Alexa, Google Home). 16 million colors, dimmable, energy efficient. Perfect for smart home product lines.",
    shortDescription: "WiFi smart LED bulb, voice control, 16M colors",
    supplierId: "1",
    supplierName: "TechVision Electronics Co., Ltd.",
    supplierSlug: "techvision-electronics",
    industry: "Electronics & Electrical",
    industrySlug: "electronics-electrical",
    category: "LED & Lighting",
    categorySlug: "led-lighting",
    price: {
      min: 3.20,
      max: 5.50,
      currency: "USD",
      unit: "piece"
    },
    moq: 500,
    moqUnit: "pieces",
    leadTime: "12-18 days",
    specifications: {
      "Wattage": "9W (60W equivalent)",
      "Lumens": "800lm",
      "Color Temperature": "2700K-6500K + RGB",
      "Base": "E27/E26/B22",
      "WiFi": "2.4GHz",
      "Voice Control": "Alexa, Google Home",
      "Lifespan": "25,000 hours"
    },
    certifications: ["CE", "FCC", "RoHS", "UL"],
    customizable: true,
    sampleAvailable: true,
    samplePrice: 15,
    featured: false,
    customizationOptions: ["Custom app integration", "Logo printing", "Custom packaging", "Bulb shape options"],
    packagingDetails: {
      type: "Retail Ready",
      dimensions: "7x7x12 cm",
      weight: "95g",
      unitsPerCarton: 50,
      description: "Color retail box with hanging tab, includes quick start guide"
    },
    keyFeatures: ["16 million colors", "Voice control ready", "No hub required", "Schedule & timer", "Energy efficient", "25,000 hour lifespan"]
  },
  {
    id: "8",
    name: "Automatic Liquid Filling Machine",
    slug: "automatic-liquid-filling-machine",
    description: "Fully automatic liquid filling machine for beverages, cosmetics, and chemicals. Servo-driven pistons ensure accurate filling. Suitable for production lines up to 6000 bottles/hour.",
    shortDescription: "Servo-driven automatic filling machine, 6000 bottles/hour",
    supplierId: "2",
    supplierName: "GlobalFab Machinery Inc.",
    supplierSlug: "globalfab-machinery",
    industry: "Machinery & Equipment",
    industrySlug: "machinery-equipment",
    category: "Packaging Machinery",
    categorySlug: "packaging-machinery",
    price: {
      min: 15000,
      max: 35000,
      currency: "USD",
      unit: "set"
    },
    moq: 1,
    moqUnit: "set",
    leadTime: "35-50 days",
    specifications: {
      "Filling Volume": "50-1000ml",
      "Speed": "Up to 6000 bottles/hour",
      "Filling Heads": "4/6/8/12",
      "Accuracy": "±0.5%",
      "Power": "220V/380V",
      "Control": "PLC + Touch Screen",
      "Material": "SUS304/316"
    },
    certifications: ["CE", "ISO 9001"],
    customizable: true,
    sampleAvailable: false,
    featured: false,
    customizationOptions: ["Filling head configuration", "Volume range", "Material grade (304/316)", "Control system options", "Integration with capping/labeling"],
    packagingDetails: {
      type: "Industrial Crating",
      dimensions: "180x120x200 cm",
      weight: "800kg",
      description: "Wooden crate with shock absorbers, includes spare parts kit and manual"
    },
    brochureUrl: "/brochures/liquid-filling-machine.pdf",
    keyFeatures: ["Servo-driven accuracy", "PLC touch screen control", "CIP system compatible", "SUS304/316 construction", "Easy changeover", "GMP compliant design"]
  }
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured)
}

export function getProductsBySupplier(supplierSlug: string): Product[] {
  return products.filter(product => product.supplierSlug === supplierSlug)
}

export function getProductsByIndustry(industrySlug: string): Product[] {
  return products.filter(product => product.industrySlug === industrySlug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(product => product.categorySlug === categorySlug)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  )
}
