export interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  subcategories?: string[]
}

export interface Industry {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  supplierCount: number
  productCount: number
  categories: Category[]
  featured?: boolean
}

export const industries: Industry[] = [
  {
    id: "1",
    name: "Electronics & Electrical",
    slug: "electronics-electrical",
    description: "Consumer electronics, components, semiconductors, and electrical equipment from certified manufacturers.",
    icon: "Cpu",
    supplierCount: 2840,
    productCount: 45200,
    featured: true,
    categories: [
      {
        id: "1-1",
        name: "Consumer Electronics",
        slug: "consumer-electronics",
        description: "Smartphones, tablets, laptops, and personal devices",
        productCount: 12500,
        subcategories: ["Smartphones", "Tablets", "Laptops", "Wearables", "Audio Equipment"]
      },
      {
        id: "1-2",
        name: "Electronic Components",
        slug: "electronic-components",
        description: "Semiconductors, resistors, capacitors, and PCBs",
        productCount: 18000,
        subcategories: ["Semiconductors", "Resistors", "Capacitors", "PCBs", "Connectors"]
      },
      {
        id: "1-3",
        name: "LED & Lighting",
        slug: "led-lighting",
        description: "LED products, lighting fixtures, and smart lighting solutions",
        productCount: 8500,
        subcategories: ["LED Bulbs", "LED Strips", "Commercial Lighting", "Smart Lighting"]
      },
      {
        id: "1-4",
        name: "Electrical Equipment",
        slug: "electrical-equipment",
        description: "Switchgear, transformers, and power distribution equipment",
        productCount: 6200,
        subcategories: ["Switchgear", "Transformers", "Power Supplies", "Cables & Wires"]
      }
    ]
  },
  {
    id: "2",
    name: "Machinery & Equipment",
    slug: "machinery-equipment",
    description: "Industrial machinery, manufacturing equipment, and automation systems from global suppliers.",
    icon: "Cog",
    supplierCount: 1950,
    productCount: 28400,
    featured: true,
    categories: [
      {
        id: "2-1",
        name: "Industrial Machinery",
        slug: "industrial-machinery",
        description: "Manufacturing and processing machinery",
        productCount: 9500,
        subcategories: ["CNC Machines", "Lathes", "Milling Machines", "Presses"]
      },
      {
        id: "2-2",
        name: "Packaging Machinery",
        slug: "packaging-machinery",
        description: "Packaging, filling, and labeling equipment",
        productCount: 6800,
        subcategories: ["Filling Machines", "Labeling Machines", "Sealing Machines", "Wrapping Machines"]
      },
      {
        id: "2-3",
        name: "Agricultural Machinery",
        slug: "agricultural-machinery",
        description: "Farming equipment and agricultural tools",
        productCount: 5200,
        subcategories: ["Tractors", "Harvesters", "Irrigation Systems", "Seeders"]
      },
      {
        id: "2-4",
        name: "Construction Equipment",
        slug: "construction-equipment",
        description: "Heavy construction and earthmoving equipment",
        productCount: 6900,
        subcategories: ["Excavators", "Loaders", "Cranes", "Concrete Mixers"]
      }
    ]
  },
  {
    id: "3",
    name: "Textiles & Apparel",
    slug: "textiles-apparel",
    description: "Fashion, fabrics, garments, and textile materials from sustainable manufacturers.",
    icon: "Shirt",
    supplierCount: 3200,
    productCount: 52000,
    featured: true,
    categories: [
      {
        id: "3-1",
        name: "Fabrics & Textiles",
        slug: "fabrics-textiles",
        description: "Raw fabrics, yarns, and textile materials",
        productCount: 15000,
        subcategories: ["Cotton", "Polyester", "Silk", "Wool", "Blends"]
      },
      {
        id: "3-2",
        name: "Apparel",
        slug: "apparel",
        description: "Ready-to-wear clothing and fashion items",
        productCount: 22000,
        subcategories: ["Men's Wear", "Women's Wear", "Children's Wear", "Sportswear"]
      },
      {
        id: "3-3",
        name: "Footwear",
        slug: "footwear",
        description: "Shoes, boots, sandals, and athletic footwear",
        productCount: 8500,
        subcategories: ["Casual Shoes", "Athletic Shoes", "Boots", "Sandals"]
      },
      {
        id: "3-4",
        name: "Accessories",
        slug: "accessories",
        description: "Bags, belts, hats, and fashion accessories",
        productCount: 6500,
        subcategories: ["Bags", "Belts", "Hats", "Scarves", "Jewelry"]
      }
    ]
  },
  {
    id: "4",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Furniture, home decor, kitchenware, and gardening supplies from quality manufacturers.",
    icon: "Home",
    supplierCount: 2100,
    productCount: 38500,
    featured: true,
    categories: [
      {
        id: "4-1",
        name: "Furniture",
        slug: "furniture",
        description: "Indoor and outdoor furniture",
        productCount: 14000,
        subcategories: ["Living Room", "Bedroom", "Office", "Outdoor"]
      },
      {
        id: "4-2",
        name: "Home Decor",
        slug: "home-decor",
        description: "Decorative items and home accessories",
        productCount: 9500,
        subcategories: ["Wall Art", "Vases", "Mirrors", "Rugs", "Curtains"]
      },
      {
        id: "4-3",
        name: "Kitchenware",
        slug: "kitchenware",
        description: "Kitchen tools, cookware, and appliances",
        productCount: 8500,
        subcategories: ["Cookware", "Utensils", "Storage", "Small Appliances"]
      },
      {
        id: "4-4",
        name: "Garden & Outdoor",
        slug: "garden-outdoor",
        description: "Garden furniture, tools, and outdoor living",
        productCount: 6500,
        subcategories: ["Garden Furniture", "Tools", "Planters", "Outdoor Lighting"]
      }
    ]
  },
  {
    id: "5",
    name: "Health & Beauty",
    slug: "health-beauty",
    description: "Cosmetics, personal care, medical devices, and wellness products from certified suppliers.",
    icon: "Heart",
    supplierCount: 1680,
    productCount: 29000,
    featured: true,
    categories: [
      {
        id: "5-1",
        name: "Cosmetics",
        slug: "cosmetics",
        description: "Makeup, skincare, and beauty products",
        productCount: 12000,
        subcategories: ["Makeup", "Skincare", "Hair Care", "Nail Products"]
      },
      {
        id: "5-2",
        name: "Personal Care",
        slug: "personal-care",
        description: "Hygiene and personal care items",
        productCount: 8500,
        subcategories: ["Oral Care", "Body Care", "Hair Removal", "Fragrances"]
      },
      {
        id: "5-3",
        name: "Medical Devices",
        slug: "medical-devices",
        description: "Medical equipment and healthcare devices",
        productCount: 5500,
        subcategories: ["Diagnostic Equipment", "Monitoring Devices", "Surgical Tools", "PPE"]
      },
      {
        id: "5-4",
        name: "Wellness Products",
        slug: "wellness-products",
        description: "Supplements, fitness, and wellness items",
        productCount: 3000,
        subcategories: ["Supplements", "Fitness Equipment", "Massage Tools", "Aromatherapy"]
      }
    ]
  },
  {
    id: "6",
    name: "Automotive & Parts",
    slug: "automotive-parts",
    description: "Vehicle parts, accessories, and automotive components from OEM and aftermarket suppliers.",
    icon: "Car",
    supplierCount: 1420,
    productCount: 32000,
    featured: true,
    categories: [
      {
        id: "6-1",
        name: "Auto Parts",
        slug: "auto-parts",
        description: "Engine parts, brakes, and mechanical components",
        productCount: 15000,
        subcategories: ["Engine Parts", "Brakes", "Suspension", "Transmission"]
      },
      {
        id: "6-2",
        name: "Auto Electronics",
        slug: "auto-electronics",
        description: "Car electronics and electrical systems",
        productCount: 8000,
        subcategories: ["Audio Systems", "Navigation", "Sensors", "Lighting"]
      },
      {
        id: "6-3",
        name: "Accessories",
        slug: "auto-accessories",
        description: "Interior and exterior car accessories",
        productCount: 6000,
        subcategories: ["Interior", "Exterior", "Car Care", "Tools"]
      },
      {
        id: "6-4",
        name: "Tires & Wheels",
        slug: "tires-wheels",
        description: "Tires, wheels, and related products",
        productCount: 3000,
        subcategories: ["Tires", "Alloy Wheels", "Wheel Covers", "Tire Accessories"]
      }
    ]
  },
  {
    id: "7",
    name: "Food & Beverage",
    slug: "food-beverage",
    description: "Food products, beverages, and ingredients from certified food-grade suppliers.",
    icon: "UtensilsCrossed",
    supplierCount: 1850,
    productCount: 24000,
    categories: [
      {
        id: "7-1",
        name: "Processed Foods",
        slug: "processed-foods",
        description: "Packaged and processed food products",
        productCount: 9000,
        subcategories: ["Snacks", "Canned Foods", "Frozen Foods", "Dairy"]
      },
      {
        id: "7-2",
        name: "Beverages",
        slug: "beverages",
        description: "Drinks and beverage products",
        productCount: 6000,
        subcategories: ["Soft Drinks", "Juices", "Tea & Coffee", "Alcoholic"]
      },
      {
        id: "7-3",
        name: "Ingredients",
        slug: "ingredients",
        description: "Food ingredients and additives",
        productCount: 5000,
        subcategories: ["Spices", "Flavors", "Preservatives", "Sweeteners"]
      },
      {
        id: "7-4",
        name: "Organic Products",
        slug: "organic-products",
        description: "Certified organic food and beverages",
        productCount: 4000,
        subcategories: ["Organic Produce", "Organic Snacks", "Organic Beverages"]
      }
    ]
  },
  {
    id: "8",
    name: "Chemicals & Materials",
    slug: "chemicals-materials",
    description: "Industrial chemicals, raw materials, and specialty chemicals from certified suppliers.",
    icon: "FlaskConical",
    supplierCount: 980,
    productCount: 18000,
    categories: [
      {
        id: "8-1",
        name: "Industrial Chemicals",
        slug: "industrial-chemicals",
        description: "Chemicals for industrial applications",
        productCount: 7000,
        subcategories: ["Acids", "Bases", "Solvents", "Catalysts"]
      },
      {
        id: "8-2",
        name: "Plastics & Polymers",
        slug: "plastics-polymers",
        description: "Plastic materials and polymer compounds",
        productCount: 5000,
        subcategories: ["PVC", "PE", "PP", "ABS", "Nylon"]
      },
      {
        id: "8-3",
        name: "Rubber Products",
        slug: "rubber-products",
        description: "Natural and synthetic rubber materials",
        productCount: 3500,
        subcategories: ["Natural Rubber", "Synthetic Rubber", "Rubber Compounds"]
      },
      {
        id: "8-4",
        name: "Specialty Chemicals",
        slug: "specialty-chemicals",
        description: "Specialty and fine chemicals",
        productCount: 2500,
        subcategories: ["Adhesives", "Coatings", "Surfactants", "Pigments"]
      }
    ]
  },
  {
    id: "9",
    name: "Packaging",
    slug: "packaging",
    description: "Packaging solutions, containers, and materials for all industries.",
    icon: "Package",
    supplierCount: 1250,
    productCount: 22000,
    featured: true,
    categories: [
      {
        id: "9-1",
        name: "Food Packaging",
        slug: "food-packaging",
        description: "Food-safe packaging and containers",
        productCount: 8000,
        subcategories: ["Flexible Packaging", "Rigid Containers", "Food Boxes", "Vacuum Bags"]
      },
      {
        id: "9-2",
        name: "Industrial Packaging",
        slug: "industrial-packaging",
        description: "Heavy-duty industrial packaging solutions",
        productCount: 6000,
        subcategories: ["Crates", "Pallets", "Drums", "Bulk Containers"]
      },
      {
        id: "9-3",
        name: "Retail Packaging",
        slug: "retail-packaging",
        description: "Consumer product packaging",
        productCount: 5000,
        subcategories: ["Boxes", "Bags", "Blister Packs", "Labels"]
      },
      {
        id: "9-4",
        name: "Eco Packaging",
        slug: "eco-packaging",
        description: "Sustainable and biodegradable packaging",
        productCount: 3000,
        subcategories: ["Biodegradable", "Recycled", "Compostable", "Paper-based"]
      }
    ]
  },
  {
    id: "10",
    name: "Lighting",
    slug: "lighting",
    description: "LED lighting, commercial fixtures, and smart lighting solutions.",
    icon: "Lightbulb",
    supplierCount: 890,
    productCount: 15000,
    featured: true,
    categories: [
      {
        id: "10-1",
        name: "LED Lighting",
        slug: "led-lighting-products",
        description: "Energy-efficient LED products",
        productCount: 6000,
        subcategories: ["LED Bulbs", "LED Panels", "LED Strips", "LED Tubes"]
      },
      {
        id: "10-2",
        name: "Commercial Lighting",
        slug: "commercial-lighting",
        description: "Lighting for offices and commercial spaces",
        productCount: 4500,
        subcategories: ["Office Lights", "Retail Lighting", "Industrial Lighting", "High Bay"]
      },
      {
        id: "10-3",
        name: "Outdoor Lighting",
        slug: "outdoor-lighting",
        description: "Street lights and outdoor fixtures",
        productCount: 2500,
        subcategories: ["Street Lights", "Garden Lights", "Floodlights", "Solar Lights"]
      },
      {
        id: "10-4",
        name: "Smart Lighting",
        slug: "smart-lighting",
        description: "Connected and intelligent lighting systems",
        productCount: 2000,
        subcategories: ["WiFi Lights", "Zigbee", "Bluetooth Mesh", "Smart Controls"]
      }
    ]
  },
  {
    id: "11",
    name: "Metal Products",
    slug: "metal-products",
    description: "Metal fabrication, hardware, and metal components.",
    icon: "Wrench",
    supplierCount: 1560,
    productCount: 28000,
    featured: true,
    categories: [
      {
        id: "11-1",
        name: "Steel Products",
        slug: "steel-products",
        description: "Steel sheets, pipes, and profiles",
        productCount: 10000,
        subcategories: ["Steel Sheets", "Steel Pipes", "Steel Profiles", "Steel Wire"]
      },
      {
        id: "11-2",
        name: "Aluminum Products",
        slug: "aluminum-products",
        description: "Aluminum profiles and components",
        productCount: 7000,
        subcategories: ["Aluminum Profiles", "Aluminum Sheets", "Aluminum Castings"]
      },
      {
        id: "11-3",
        name: "Hardware",
        slug: "hardware",
        description: "Fasteners, hinges, and hardware items",
        productCount: 6000,
        subcategories: ["Fasteners", "Hinges", "Locks", "Handles"]
      },
      {
        id: "11-4",
        name: "Metal Fabrication",
        slug: "metal-fabrication",
        description: "Custom metal fabrication services",
        productCount: 5000,
        subcategories: ["CNC Parts", "Sheet Metal", "Welding", "Stamping"]
      }
    ]
  },
  {
    id: "12",
    name: "Construction Materials",
    slug: "construction-materials",
    description: "Building materials, fixtures, and construction supplies.",
    icon: "HardHat",
    supplierCount: 1340,
    productCount: 24000,
    featured: true,
    categories: [
      {
        id: "12-1",
        name: "Building Materials",
        slug: "building-materials",
        description: "Core construction materials",
        productCount: 9000,
        subcategories: ["Cement", "Bricks", "Blocks", "Aggregates"]
      },
      {
        id: "12-2",
        name: "Flooring",
        slug: "flooring",
        description: "Floor coverings and tiles",
        productCount: 6000,
        subcategories: ["Ceramic Tiles", "Wood Flooring", "Vinyl", "Stone"]
      },
      {
        id: "12-3",
        name: "Plumbing",
        slug: "plumbing",
        description: "Pipes, fittings, and fixtures",
        productCount: 5000,
        subcategories: ["Pipes", "Fittings", "Faucets", "Valves"]
      },
      {
        id: "12-4",
        name: "Doors & Windows",
        slug: "doors-windows",
        description: "Doors, windows, and frames",
        productCount: 4000,
        subcategories: ["Wood Doors", "Aluminum Windows", "Glass", "Frames"]
      }
    ]
  },
  {
    id: "13",
    name: "Furniture",
    slug: "furniture",
    description: "Home, office, and commercial furniture from global manufacturers.",
    icon: "Sofa",
    supplierCount: 1680,
    productCount: 32000,
    featured: true,
    categories: [
      {
        id: "13-1",
        name: "Home Furniture",
        slug: "home-furniture",
        description: "Residential furniture pieces",
        productCount: 12000,
        subcategories: ["Sofas", "Beds", "Tables", "Chairs", "Storage"]
      },
      {
        id: "13-2",
        name: "Office Furniture",
        slug: "office-furniture",
        description: "Commercial and office furniture",
        productCount: 8000,
        subcategories: ["Desks", "Office Chairs", "Workstations", "Filing"]
      },
      {
        id: "13-3",
        name: "Outdoor Furniture",
        slug: "outdoor-furniture",
        description: "Garden and patio furniture",
        productCount: 6000,
        subcategories: ["Patio Sets", "Garden Chairs", "Outdoor Tables", "Loungers"]
      },
      {
        id: "13-4",
        name: "Hotel & Restaurant",
        slug: "hotel-restaurant-furniture",
        description: "Hospitality furniture",
        productCount: 6000,
        subcategories: ["Hotel Beds", "Restaurant Tables", "Bar Furniture", "Lobby"]
      }
    ]
  },
  {
    id: "14",
    name: "Medical Equipment",
    slug: "medical-equipment",
    description: "Medical devices, healthcare equipment, and hospital supplies.",
    icon: "Stethoscope",
    supplierCount: 720,
    productCount: 18000,
    featured: true,
    categories: [
      {
        id: "14-1",
        name: "Diagnostic Equipment",
        slug: "diagnostic-equipment",
        description: "Medical diagnostic devices",
        productCount: 5000,
        subcategories: ["Imaging", "Lab Equipment", "Monitors", "Analyzers"]
      },
      {
        id: "14-2",
        name: "Hospital Furniture",
        slug: "hospital-furniture",
        description: "Medical facility furniture",
        productCount: 4000,
        subcategories: ["Hospital Beds", "Medical Carts", "Examination Tables", "Cabinets"]
      },
      {
        id: "14-3",
        name: "Surgical Equipment",
        slug: "surgical-equipment",
        description: "Surgical tools and equipment",
        productCount: 5000,
        subcategories: ["Surgical Tools", "Sterilization", "Operating Tables", "Lights"]
      },
      {
        id: "14-4",
        name: "PPE & Supplies",
        slug: "ppe-supplies",
        description: "Personal protective equipment",
        productCount: 4000,
        subcategories: ["Masks", "Gloves", "Gowns", "Face Shields"]
      }
    ]
  },
  {
    id: "15",
    name: "Agriculture",
    slug: "agriculture",
    description: "Agricultural equipment, supplies, and farming products.",
    icon: "Wheat",
    supplierCount: 950,
    productCount: 16000,
    categories: [
      {
        id: "15-1",
        name: "Farm Equipment",
        slug: "farm-equipment",
        description: "Agricultural machinery and tools",
        productCount: 5000,
        subcategories: ["Tractors", "Harvesters", "Tillers", "Sprayers"]
      },
      {
        id: "15-2",
        name: "Irrigation",
        slug: "irrigation",
        description: "Irrigation systems and equipment",
        productCount: 4000,
        subcategories: ["Drip Systems", "Sprinklers", "Pumps", "Controllers"]
      },
      {
        id: "15-3",
        name: "Seeds & Fertilizers",
        slug: "seeds-fertilizers",
        description: "Agricultural inputs",
        productCount: 4000,
        subcategories: ["Seeds", "Fertilizers", "Pesticides", "Growth Regulators"]
      },
      {
        id: "15-4",
        name: "Greenhouses",
        slug: "greenhouses",
        description: "Greenhouse structures and equipment",
        productCount: 3000,
        subcategories: ["Greenhouse Frames", "Covers", "Climate Control", "Hydroponics"]
      }
    ]
  },
  {
    id: "16",
    name: "Plastic Products",
    slug: "plastic-products",
    description: "Plastic manufacturing, injection molding, and plastic goods.",
    icon: "Box",
    supplierCount: 1420,
    productCount: 26000,
    categories: [
      {
        id: "16-1",
        name: "Injection Molding",
        slug: "injection-molding",
        description: "Custom plastic parts and components",
        productCount: 10000,
        subcategories: ["Custom Parts", "Enclosures", "Caps", "Components"]
      },
      {
        id: "16-2",
        name: "Plastic Containers",
        slug: "plastic-containers",
        description: "Storage and packaging containers",
        productCount: 7000,
        subcategories: ["Storage Bins", "Bottles", "Jars", "Drums"]
      },
      {
        id: "16-3",
        name: "Plastic Sheets",
        slug: "plastic-sheets",
        description: "Plastic sheets and films",
        productCount: 5000,
        subcategories: ["Acrylic Sheets", "PVC Sheets", "Films", "Laminates"]
      },
      {
        id: "16-4",
        name: "Plastic Pipes",
        slug: "plastic-pipes",
        description: "Plastic piping and fittings",
        productCount: 4000,
        subcategories: ["PVC Pipes", "HDPE Pipes", "PPR Pipes", "Fittings"]
      }
    ]
  },
  {
    id: "17",
    name: "Paper Products",
    slug: "paper-products",
    description: "Paper, printing, and paper-based products.",
    icon: "FileText",
    supplierCount: 680,
    productCount: 12000,
    categories: [
      {
        id: "17-1",
        name: "Paper & Board",
        slug: "paper-board",
        description: "Raw paper and cardboard materials",
        productCount: 4000,
        subcategories: ["Printing Paper", "Cardboard", "Kraft Paper", "Art Paper"]
      },
      {
        id: "17-2",
        name: "Printing Services",
        slug: "printing-services",
        description: "Commercial printing services",
        productCount: 3000,
        subcategories: ["Offset Printing", "Digital Printing", "Packaging Print", "Labels"]
      },
      {
        id: "17-3",
        name: "Paper Packaging",
        slug: "paper-packaging",
        description: "Paper-based packaging products",
        productCount: 3000,
        subcategories: ["Cartons", "Paper Bags", "Paper Cups", "Paper Plates"]
      },
      {
        id: "17-4",
        name: "Stationery",
        slug: "stationery",
        description: "Office and school supplies",
        productCount: 2000,
        subcategories: ["Notebooks", "Envelopes", "Files", "Calendars"]
      }
    ]
  },
  {
    id: "18",
    name: "Industrial Machinery",
    slug: "industrial-machinery",
    description: "Heavy industrial equipment and manufacturing machinery.",
    icon: "Factory",
    supplierCount: 1180,
    productCount: 21000,
    categories: [
      {
        id: "18-1",
        name: "Machine Tools",
        slug: "machine-tools",
        description: "Precision machining equipment",
        productCount: 7000,
        subcategories: ["Lathes", "Mills", "Grinders", "EDM Machines"]
      },
      {
        id: "18-2",
        name: "Material Handling",
        slug: "material-handling",
        description: "Conveyor and handling systems",
        productCount: 5000,
        subcategories: ["Conveyors", "Forklifts", "Cranes", "Hoists"]
      },
      {
        id: "18-3",
        name: "Automation",
        slug: "automation",
        description: "Industrial automation equipment",
        productCount: 5000,
        subcategories: ["Robots", "PLCs", "Sensors", "Control Systems"]
      },
      {
        id: "18-4",
        name: "Compressors & Pumps",
        slug: "compressors-pumps",
        description: "Air and fluid handling equipment",
        productCount: 4000,
        subcategories: ["Air Compressors", "Pumps", "Valves", "Pneumatics"]
      }
    ]
  },
  {
    id: "19",
    name: "Consumer Goods",
    slug: "consumer-goods",
    description: "Everyday consumer products and general merchandise.",
    icon: "ShoppingBag",
    supplierCount: 2100,
    productCount: 45000,
    categories: [
      {
        id: "19-1",
        name: "Household Items",
        slug: "household-items",
        description: "Daily use household products",
        productCount: 15000,
        subcategories: ["Cleaning", "Storage", "Organizers", "Laundry"]
      },
      {
        id: "19-2",
        name: "Sports & Outdoor",
        slug: "sports-outdoor",
        description: "Sports equipment and outdoor gear",
        productCount: 12000,
        subcategories: ["Fitness", "Camping", "Sports Gear", "Bicycles"]
      },
      {
        id: "19-3",
        name: "Toys & Games",
        slug: "toys-games",
        description: "Children's toys and games",
        productCount: 10000,
        subcategories: ["Educational", "Outdoor Toys", "Board Games", "Action Figures"]
      },
      {
        id: "19-4",
        name: "Pet Products",
        slug: "pet-products",
        description: "Pet supplies and accessories",
        productCount: 8000,
        subcategories: ["Pet Food", "Pet Toys", "Pet Grooming", "Pet Accessories"]
      }
    ]
  }
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find(industry => industry.slug === slug)
}

export function getCategoryBySlug(industrySlug: string, categorySlug: string): Category | undefined {
  const industry = getIndustryBySlug(industrySlug)
  return industry?.categories.find(cat => cat.slug === categorySlug)
}

export function getFeaturedIndustries(): Industry[] {
  return industries.filter(industry => industry.featured)
}

export function getAllCategories(): { industry: Industry; category: Category }[] {
  return industries.flatMap(industry => 
    industry.categories.map(category => ({ industry, category }))
  )
}
