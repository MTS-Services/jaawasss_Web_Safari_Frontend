export interface Review {
  id: string
  supplierId: string
  buyerId: string
  buyerName: string
  buyerCompany?: string
  buyerCountry: string
  rating: number
  title?: string
  content: string
  date: string
  reviewed: boolean
  helpful: number
  orderDetails?: {
    productCategory: string
    orderValue: string
    orderDate: string
  }
  status: "published" | "pending" | "hidden" | "flagged"
  supplierResponse?: {
    content: string
    date: string
  }
}

export const reviews: Review[] = [
  // TechVision Electronics Co., Ltd. reviews
  {
    id: "r1",
    supplierId: "1",
    buyerId: "b1",
    buyerName: "Michael Johnson",
    buyerCompany: "TechMart USA",
    buyerCountry: "United States",
    rating: 5,
    title: "Exceptional quality and communication",
    content: "We've been working with TechVision for over 2 years now. Their TWS earbuds are consistently high quality, and their team is incredibly responsive. Our orders always arrive on time and the packaging is excellent. Highly recommend for anyone looking for a reliable electronics supplier.",
    date: "2026-02-15",
    reviewed: true,
    helpful: 45,
    orderDetails: {
      productCategory: "Wireless Earbuds",
      orderValue: "$25,000 - $50,000",
      orderDate: "2026-01-10"
    },
    status: "published"
  },
  {
    id: "r2",
    supplierId: "1",
    buyerId: "b2",
    buyerName: "Sarah Williams",
    buyerCompany: "Euro Electronics GmbH",
    buyerCountry: "Germany",
    rating: 5,
    title: "Best supplier we've worked with",
    content: "Outstanding quality control and very professional team. They went above and beyond to meet our specifications for a custom product line. The factory audit was impressive - clean, organized, and well-managed.",
    date: "2026-02-01",
    reviewed: true,
    helpful: 38,
    orderDetails: {
      productCategory: "Smart Watches",
      orderValue: "$50,000 - $100,000",
      orderDate: "2025-12-15"
    },
    status: "published"
  },
  {
    id: "r3",
    supplierId: "1",
    buyerId: "b3",
    buyerName: "Ahmed Hassan",
    buyerCompany: "Gulf Trading LLC",
    buyerCountry: "United Arab Emirates",
    rating: 4,
    title: "Good quality, slight delay",
    content: "Products are excellent quality and pricing is competitive. Had a small delay with one shipment due to Chinese New Year, but the team communicated well and kept us updated throughout.",
    date: "2026-01-20",
    reviewed: true,
    helpful: 22,
    orderDetails: {
      productCategory: "Power Banks",
      orderValue: "$10,000 - $25,000",
      orderDate: "2025-11-30"
    },
    status: "published",
    supplierResponse: {
      content: "Thank you for your feedback, Ahmed. We apologize for the delay during the holiday period. We've since improved our inventory management to better handle seasonal demand.",
      date: "2026-01-22"
    }
  },
  {
    id: "r4",
    supplierId: "1",
    buyerId: "b4",
    buyerName: "Emma Thompson",
    buyerCompany: "Nordic Retail AS",
    buyerCountry: "Norway",
    rating: 5,
    content: "Third order with TechVision and consistently impressed. Sample process was smooth and production quality matches samples perfectly.",
    date: "2025-12-10",
    reviewed: true,
    helpful: 18,
    status: "published"
  },
  {
    id: "r5",
    supplierId: "1",
    buyerId: "b5",
    buyerName: "Kenji Tanaka",
    buyerCompany: "Japan Electronics Co.",
    buyerCountry: "Japan",
    rating: 5,
    title: "Reliable partner for OEM production",
    content: "We've completed several OEM projects with TechVision. Their engineering team is knowledgeable and they can handle complex customizations. Quality control meets Japanese standards.",
    date: "2025-11-25",
    reviewed: true,
    helpful: 31,
    orderDetails: {
      productCategory: "Consumer Electronics",
      orderValue: "$100,000+",
      orderDate: "2025-10-01"
    },
    status: "published"
  },

  // GlobalFab Machinery reviews
  {
    id: "r6",
    supplierId: "2",
    buyerId: "b6",
    buyerName: "Roberto Martinez",
    buyerCompany: "Industrial Solutions SA",
    buyerCountry: "Mexico",
    rating: 5,
    title: "Excellent CNC machines",
    content: "The CNC milling machine we purchased exceeded our expectations. Installation support was great and the after-sales service is top-notch. Machine has been running perfectly for 8 months now.",
    date: "2026-02-08",
    reviewed: true,
    helpful: 28,
    orderDetails: {
      productCategory: "CNC Machines",
      orderValue: "$50,000 - $100,000",
      orderDate: "2025-06-15"
    },
    status: "published"
  },
  {
    id: "r7",
    supplierId: "2",
    buyerId: "b7",
    buyerName: "Hans Mueller",
    buyerCompany: "Precision Parts GmbH",
    buyerCountry: "Germany",
    rating: 4,
    title: "Good machinery, documentation could improve",
    content: "Solid machines with good precision. The only area for improvement would be the English documentation - had to work with their team to clarify some maintenance procedures.",
    date: "2026-01-15",
    reviewed: true,
    helpful: 15,
    status: "published",
    supplierResponse: {
      content: "Thank you for the valuable feedback, Hans. We are currently revising all our documentation with professional translation services to improve clarity for our international customers.",
      date: "2026-01-17"
    }
  },

  // EcoThread Textiles reviews
  {
    id: "r8",
    supplierId: "3",
    buyerId: "b8",
    buyerName: "Lisa Anderson",
    buyerCompany: "Green Fashion UK",
    buyerCountry: "United Kingdom",
    rating: 5,
    title: "Perfect for sustainable brands",
    content: "EcoThread has been our go-to supplier for organic cotton products. Their GOTS certification is legitimate and they provide full traceability. The quality is exceptional and aligns perfectly with our brand values.",
    date: "2026-02-20",
    reviewed: true,
    helpful: 52,
    orderDetails: {
      productCategory: "Organic Cotton T-Shirts",
      orderValue: "$25,000 - $50,000",
      orderDate: "2026-01-05"
    },
    status: "published"
  },
  {
    id: "r9",
    supplierId: "3",
    buyerId: "b9",
    buyerName: "Pierre Dubois",
    buyerCompany: "Mode Durable SARL",
    buyerCountry: "France",
    rating: 5,
    title: "True sustainable manufacturing",
    content: "Impressed with their commitment to sustainability. Factory visit showed solar panels, water recycling, and fair labor practices. Product quality is consistent across orders.",
    date: "2026-01-28",
    reviewed: true,
    helpful: 41,
    status: "published"
  },
  {
    id: "r10",
    supplierId: "3",
    buyerId: "b10",
    buyerName: "Jennifer Smith",
    buyerCompany: "Eco Apparel Co.",
    buyerCountry: "Australia",
    rating: 4,
    title: "Great products, long lead times",
    content: "Quality of the organic fabrics is excellent. Lead times can be longer than conventional suppliers, but worth it for the sustainable production. Communication is always clear.",
    date: "2025-12-15",
    reviewed: true,
    helpful: 19,
    status: "published"
  },

  // LuxHome Furniture reviews
  {
    id: "r11",
    supplierId: "4",
    buyerId: "b11",
    buyerName: "David Chen",
    buyerCompany: "Modern Living Inc.",
    buyerCountry: "United States",
    rating: 5,
    title: "Beautiful craftsmanship",
    content: "The solid wood furniture from LuxHome is stunning. We ordered dining tables and they exceeded our expectations. The finishing is immaculate and they honored all customization requests.",
    date: "2026-02-05",
    reviewed: true,
    helpful: 33,
    orderDetails: {
      productCategory: "Dining Tables",
      orderValue: "$25,000 - $50,000",
      orderDate: "2025-11-20"
    },
    status: "published"
  },
  {
    id: "r12",
    supplierId: "4",
    buyerId: "b12",
    buyerName: "Maria Garcia",
    buyerCompany: "Casa Moderna",
    buyerCountry: "Spain",
    rating: 4,
    content: "Good quality furniture with nice designs. Packaging could be improved for long-distance shipping - one piece arrived with minor damage but they handled the claim professionally.",
    date: "2026-01-10",
    reviewed: true,
    helpful: 14,
    status: "published",
    supplierResponse: {
      content: "Thank you Maria. We've upgraded our packaging standards for European shipments to prevent any future issues.",
      date: "2026-01-12"
    }
  },

  // PureGlow Cosmetics reviews
  {
    id: "r13",
    supplierId: "5",
    buyerId: "b13",
    buyerName: "Jessica Lee",
    buyerCompany: "Beauty Box Brands",
    buyerCountry: "United States",
    rating: 5,
    title: "K-beauty expertise you can trust",
    content: "PureGlow developed custom formulations for our serum line that outperformed our expectations. Their R&D team is incredibly knowledgeable and helped us create truly unique products.",
    date: "2026-02-12",
    reviewed: true,
    helpful: 67,
    orderDetails: {
      productCategory: "Skincare Serums",
      orderValue: "$50,000 - $100,000",
      orderDate: "2025-12-01"
    },
    status: "published"
  },
  {
    id: "r14",
    supplierId: "5",
    buyerId: "b14",
    buyerName: "Sophie Martin",
    buyerCompany: "Natural Beauty EU",
    buyerCountry: "Netherlands",
    rating: 5,
    title: "Professional and innovative",
    content: "Working with PureGlow on our private label line has been a pleasure. They handle everything from formulation to packaging design. Regulatory compliance for EU market was handled seamlessly.",
    date: "2026-01-25",
    reviewed: true,
    helpful: 44,
    status: "published"
  },
  {
    id: "r15",
    supplierId: "5",
    buyerId: "b15",
    buyerName: "Aisha Rahman",
    buyerCompany: "Halal Cosmetics ME",
    buyerCountry: "Malaysia",
    rating: 5,
    title: "Halal certified and high quality",
    content: "Their Halal-certified products meet all our requirements for the Middle Eastern market. Quality is consistently excellent and they understand the specific needs of Islamic cosmetics standards.",
    date: "2025-12-20",
    reviewed: true,
    helpful: 38,
    status: "published"
  },

  // AutoParts Global reviews
  {
    id: "r16",
    supplierId: "6",
    buyerId: "b16",
    buyerName: "Carlos Silva",
    buyerCompany: "Auto Parts Brasil",
    buyerCountry: "Brazil",
    rating: 4,
    title: "Reliable auto parts supplier",
    content: "We've been importing brake components from AutoParts Global for 3 years. Quality is consistent with OEM specifications. Occasional slight delays in shipping but overall reliable.",
    date: "2026-02-18",
    reviewed: true,
    helpful: 25,
    orderDetails: {
      productCategory: "Brake Systems",
      orderValue: "$25,000 - $50,000",
      orderDate: "2026-01-01"
    },
    status: "published"
  },
  {
    id: "r17",
    supplierId: "6",
    buyerId: "b17",
    buyerName: "Thomas Wilson",
    buyerCompany: "Parts Warehouse USA",
    buyerCountry: "United States",
    rating: 5,
    title: "Excellent aftermarket parts",
    content: "Best aftermarket parts supplier we've worked with. Their quality control is exceptional and prices are very competitive. Customer service team is responsive and helpful.",
    date: "2026-01-30",
    reviewed: true,
    helpful: 36,
    status: "published"
  },
  {
    id: "r18",
    supplierId: "6",
    buyerId: "b18",
    buyerName: "Mohammed Al-Rashid",
    buyerCompany: "Gulf Auto Parts",
    buyerCountry: "Saudi Arabia",
    rating: 5,
    content: "Wide product range and fast shipping to Middle East. All parts meet required certifications and quality standards.",
    date: "2025-12-05",
    reviewed: true,
    helpful: 21,
    status: "published"
  }
]

export function getReviewsBySupplier(supplierId: string): Review[] {
  return reviews.filter(r => r.supplierId === supplierId && r.status === "published")
}

export function getSupplierRatingSummary(supplierId: string) {
  const supplierReviews = getReviewsBySupplier(supplierId)
  if (supplierReviews.length === 0) {
    return { average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let total = 0

  supplierReviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++
    total += review.rating
  })

  return {
    average: Math.round((total / supplierReviews.length) * 10) / 10,
    total: supplierReviews.length,
    distribution
  }
}

export function getRecentReviews(limit: number = 10): Review[] {
  return reviews
    .filter(r => r.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getAllReviewsForAdmin(): Review[] {
  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
