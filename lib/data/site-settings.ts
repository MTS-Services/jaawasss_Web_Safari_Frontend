// Site Settings Data - Admin manageable content pages and social media links

export interface SocialMediaLink {
  id: string
  platform: string
  icon: string // lucide icon name
  url: string
  enabled: boolean
  order: number
}

export interface LegalPageSection {
  id: string
  title: string
  content: string
  order: number
}

export interface LegalPage {
  id: string
  slug: string
  title: string
  lastUpdated: string
  enabled: boolean
  sections: LegalPageSection[]
}

export interface AboutPageData {
  enabled: boolean
  hero: {
    title: string
    subtitle: string
  }
  story: {
    title: string
    paragraphs: string[]
  }
  stats: {
    value: string
    label: string
    enabled: boolean
  }[]
  mission: {
    title: string
    description: string
  }
  vision: {
    title: string
    description: string
  }
  values: {
    id: string
    icon: string
    title: string
    description: string
    enabled: boolean
  }[]
  whyDifferent: {
    title: string
    points: {
      id: string
      title: string
      description: string
      enabled: boolean
    }[]
  }
  cta: {
    title: string
    subtitle: string
    buyerButtonText: string
    manufacturerButtonText: string
  }
}

export interface HelpCategory {
  id: string
  icon: string
  title: string
  description: string
  href: string
  enabled: boolean
  order: number
  articles: {
    id: string
    title: string
    enabled: boolean
  }[]
}

export interface HelpCenterData {
  enabled: boolean
  hero: {
    title: string
    subtitle: string
    searchPlaceholder: string
  }
  categories: HelpCategory[]
  popularArticles: {
    id: string
    title: string
    category: string
    href: string
    enabled: boolean
  }[]
  contactSupport: {
    title: string
    subtitle: string
    contactButtonText: string
    faqButtonText: string
  }
}

// Default Social Media Links
export const defaultSocialLinks: SocialMediaLink[] = [
  {
    id: "linkedin",
    platform: "LinkedIn",
    icon: "Linkedin",
    url: "https://linkedin.com/company/sourcenest",
    enabled: true,
    order: 1
  },
  {
    id: "twitter",
    platform: "X (Twitter)",
    icon: "Twitter",
    url: "https://twitter.com/sourcenest",
    enabled: true,
    order: 2
  },
  {
    id: "facebook",
    platform: "Facebook",
    icon: "Facebook",
    url: "https://facebook.com/sourcenest",
    enabled: true,
    order: 3
  },
  {
    id: "youtube",
    platform: "YouTube",
    icon: "Youtube",
    url: "https://youtube.com/@sourcenest",
    enabled: true,
    order: 4
  },
  {
    id: "instagram",
    platform: "Instagram",
    icon: "Instagram",
    url: "https://instagram.com/sourcenest",
    enabled: false,
    order: 5
  },
  {
    id: "tiktok",
    platform: "TikTok",
    icon: "Music2",
    url: "https://tiktok.com/@sourcenest",
    enabled: false,
    order: 6
  }
]

// Default Legal Pages
export const defaultLegalPages: LegalPage[] = [
  {
    id: "privacy",
    slug: "privacy",
    title: "Privacy Policy",
    lastUpdated: "March 2026",
    enabled: true,
    sections: [
      {
        id: "intro",
        title: "1. Introduction",
        content: "SourceNest (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
        order: 1
      },
      {
        id: "collect",
        title: "2. Information We Collect",
        content: "We collect information you provide directly to us, such as when you create an account, make a purchase, submit an inquiry, or contact us for support. This may include your name, email address, company name, phone number, and payment information.",
        order: 2
      },
      {
        id: "use",
        title: "3. How We Use Your Information",
        content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.",
        order: 3
      },
      {
        id: "security",
        title: "4. Data Security",
        content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        order: 4
      },
      {
        id: "contact",
        title: "5. Contact Us",
        content: "If you have any questions about this Privacy Policy, please contact us at privacy@sourcenest.com.",
        order: 5
      }
    ]
  },
  {
    id: "terms",
    slug: "terms",
    title: "Terms of Service",
    lastUpdated: "March 2026",
    enabled: true,
    sections: [
      {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: "By accessing and using SourceNest, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
        order: 1
      },
      {
        id: "license",
        title: "2. Use License",
        content: "Permission is granted to temporarily access the materials on SourceNest for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.",
        order: 2
      },
      {
        id: "accounts",
        title: "3. User Accounts",
        content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
        order: 3
      },
      {
        id: "conduct",
        title: "4. Buyer and Supplier Conduct",
        content: "All users agree to conduct business in good faith. Suppliers must provide accurate information about their products and capabilities. Buyers must provide accurate information about their requirements.",
        order: 4
      },
      {
        id: "liability",
        title: "5. Limitation of Liability",
        content: "SourceNest shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.",
        order: 5
      },
      {
        id: "contact",
        title: "6. Contact Information",
        content: "Questions about the Terms of Service should be sent to us at legal@sourcenest.com.",
        order: 6
      }
    ]
  },
  {
    id: "cookies",
    slug: "cookies",
    title: "Cookie Policy",
    lastUpdated: "March 2026",
    enabled: true,
    sections: [
      {
        id: "what",
        title: "1. What Are Cookies",
        content: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.",
        order: 1
      },
      {
        id: "how",
        title: "2. How We Use Cookies",
        content: "We use cookies to understand how you use our website, remember your preferences, and improve your overall experience. We also use cookies to analyze site traffic and for marketing purposes.",
        order: 2
      },
      {
        id: "types",
        title: "3. Types of Cookies We Use",
        content: "Essential cookies: Required for the website to function properly. Analytics cookies: Help us understand how visitors interact with our website. Marketing cookies: Used to track visitors across websites for advertising purposes.",
        order: 3
      },
      {
        id: "managing",
        title: "4. Managing Cookies",
        content: "Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. However, this may affect the functionality of our website.",
        order: 4
      },
      {
        id: "contact",
        title: "5. Contact Us",
        content: "If you have any questions about our Cookie Policy, please contact us at privacy@sourcenest.com.",
        order: 5
      }
    ]
  }
]

// Default About Page Data
export const defaultAboutPage: AboutPageData = {
  enabled: true,
  hero: {
    title: "Making Global Sourcing Work Better",
    subtitle: "SourceNest is on a mission to transform how businesses find and connect with manufacturing partners worldwide."
  },
  story: {
    title: "Our Story",
    paragraphs: [
      "Global sourcing has always been challenging. Buyers struggle to find reliable suppliers, verify their legitimacy, and communicate effectively across borders. Manufacturers, especially quality-focused ones, have difficulty standing out among countless options and reaching serious buyers.",
      "SourceNest was born from a simple idea: what if there was a platform that only featured reviewed, approved manufacturers? A place where buyers could trust that every supplier had been reviewed and validated before being listed?",
      "We built SourceNest to be that platform. By requiring admin approval for every manufacturer and keeping the platform free for buyers, we've created an environment where quality prevails and trust is the foundation of every connection.",
      "Today, SourceNest connects thousands of buyers with reviewed manufacturers across 50+ countries, covering 45+ industries. We're proud to be making global trade more accessible, transparent, and efficient."
    ]
  },
  stats: [
    { value: "50+", label: "Countries", enabled: true },
    { value: "2,000+", label: "Reviewed Suppliers", enabled: true },
    { value: "15,000+", label: "Products Listed", enabled: true },
    { value: "45+", label: "Industries Covered", enabled: true }
  ],
  mission: {
    title: "Our Mission",
    description: "To make global sourcing more transparent, efficient, and trustworthy by connecting quality-focused buyers with reviewed manufacturers through a premium digital platform."
  },
  vision: {
    title: "Our Vision",
    description: "A world where finding the right manufacturing partner is simple, safe, and successful — regardless of geography, company size, or industry."
  },
  values: [
    {
      id: "trust",
      icon: "Shield",
      title: "Trust & Transparency",
      description: "We believe sourcing should be built on trust. Every supplier is reviewed based on submitted information, and we strive to maintain platform quality.",
      enabled: true
    },
    {
      id: "global",
      icon: "Globe",
      title: "Global Accessibility",
      description: "We're breaking down barriers in international trade, making it easier for businesses of all sizes to connect across borders.",
      enabled: true
    },
    {
      id: "community",
      icon: "Users",
      title: "Community First",
      description: "We're building more than a platform — we're creating a community of quality-focused buyers and manufacturers.",
      enabled: true
    },
    {
      id: "innovation",
      icon: "Lightbulb",
      title: "Innovation",
      description: "We continuously improve our platform with smart features that make sourcing more efficient and effective.",
      enabled: true
    }
  ],
  whyDifferent: {
    title: "Why SourceNest is Different",
    points: [
      {
        id: "reviewed",
        title: "Reviewed-Only Marketplace",
        description: "Unlike open platforms where anyone can list, every manufacturer on SourceNest goes through our review and approval process based on submitted information. This means buyers know that suppliers have been screened, and manufacturers know they're in good company.",
        enabled: true
      },
      {
        id: "free",
        title: "Free for Buyers",
        description: "We believe buyers should have access to quality sourcing tools without barriers. By making the platform free for buyers, we ensure maximum reach for manufacturers and maximum access for sourcing professionals.",
        enabled: true
      },
      {
        id: "commission",
        title: "No Commission Model",
        description: "We don't take a cut of your deals. Manufacturers pay only their subscription fee, and all communication and negotiation happens directly between parties.",
        enabled: true
      },
      {
        id: "premium",
        title: "Premium Focus",
        description: "We're not trying to be the biggest platform — we're trying to be the most trusted. Quality over quantity is our guiding principle.",
        enabled: true
      }
    ]
  },
  cta: {
    title: "Join the SourceNest Community",
    subtitle: "Whether you're sourcing products or manufacturing them, we'd love to have you.",
    buyerButtonText: "Join as Buyer",
    manufacturerButtonText: "Join as Manufacturer"
  }
}

// Default Help Center Data
export const defaultHelpCenter: HelpCenterData = {
  enabled: true,
  hero: {
    title: "How Can We Help?",
    subtitle: "Find answers to common questions or contact our support team.",
    searchPlaceholder: "Search for help articles..."
  },
  categories: [
    {
      id: "buyers",
      icon: "Users",
      title: "For Buyers",
      description: "Learn how to search, compare, and connect with suppliers",
      href: "/help/buyers",
      enabled: true,
      order: 1,
      articles: [
        { id: "search", title: "How to search for suppliers", enabled: true },
        { id: "compare", title: "Comparing and saving suppliers", enabled: true },
        { id: "messages", title: "Sending messages to factories", enabled: true },
        { id: "rfqs", title: "Requesting quotes (RFQs)", enabled: true },
        { id: "dashboard", title: "Managing your buyer dashboard", enabled: true }
      ]
    },
    {
      id: "manufacturers",
      icon: "Factory",
      title: "For Manufacturers",
      description: "Guide to setting up and managing your factory profile",
      href: "/help/manufacturers",
      enabled: true,
      order: 2,
      articles: [
        { id: "getting-started", title: "Getting started as a manufacturer", enabled: true },
        { id: "profile", title: "Creating your company profile", enabled: true },
        { id: "products", title: "Uploading products", enabled: true },
        { id: "inquiries", title: "Managing inquiries and RFQs", enabled: true },
        { id: "analytics", title: "Understanding your analytics", enabled: true }
      ]
    },
    {
      id: "billing",
      icon: "CreditCard",
      title: "Billing & Plans",
      description: "Information about subscriptions, payments, and invoices",
      href: "/help/billing",
      enabled: true,
      order: 3,
      articles: [
        { id: "plans", title: "Subscription plans explained", enabled: true },
        { id: "upgrade", title: "How to upgrade or downgrade", enabled: true },
        { id: "payment", title: "Payment methods", enabled: true },
        { id: "invoices", title: "Invoices and receipts", enabled: true },
        { id: "refund", title: "Refund policy", enabled: true }
      ]
    },
    {
      id: "review",
      icon: "Shield",
      title: "Review & Approval",
      description: "Understanding the supplier review process",
      href: "/help/review",
      enabled: true,
      order: 4,
      articles: [
        { id: "how-it-works", title: "How review works", enabled: true },
        { id: "documents", title: "Required documents", enabled: true },
        { id: "timeline", title: "Approval timeline", enabled: true },
        { id: "rejected", title: "What if I'm rejected?", enabled: true },
        { id: "badges", title: "Trust badges explained", enabled: true }
      ]
    },
    {
      id: "account",
      icon: "Settings",
      title: "Account & Settings",
      description: "Managing your account, profile, and preferences",
      href: "/help/account",
      enabled: true,
      order: 5,
      articles: [
        { id: "update-profile", title: "Updating profile information", enabled: true },
        { id: "password", title: "Changing your password", enabled: true },
        { id: "notifications", title: "Notification settings", enabled: true },
        { id: "privacy", title: "Privacy settings", enabled: true },
        { id: "delete", title: "Deleting your account", enabled: true }
      ]
    },
    {
      id: "technical",
      icon: "HelpCircle",
      title: "Technical Support",
      description: "Troubleshooting common issues",
      href: "/help/technical",
      enabled: true,
      order: 6,
      articles: [
        { id: "login", title: "Login problems", enabled: true },
        { id: "upload", title: "File upload issues", enabled: true },
        { id: "browser", title: "Browser compatibility", enabled: true },
        { id: "mobile", title: "Mobile app support", enabled: true },
        { id: "bugs", title: "Reporting bugs", enabled: true }
      ]
    }
  ],
  popularArticles: [
    { id: "1", title: "How to create a buyer account", category: "For Buyers", href: "/help/buyers/create-account", enabled: true },
    { id: "2", title: "Understanding subscription plans", category: "Billing", href: "/help/billing/plans", enabled: true },
    { id: "3", title: "How the review process works", category: "Review", href: "/help/review/process", enabled: true },
    { id: "4", title: "Sending your first RFQ", category: "For Buyers", href: "/help/buyers/send-rfq", enabled: true },
    { id: "5", title: "Setting up your manufacturer profile", category: "For Manufacturers", href: "/help/manufacturers/profile-setup", enabled: true }
  ],
  contactSupport: {
    title: "Still Need Help?",
    subtitle: "Can't find what you're looking for? Our support team is here to help.",
    contactButtonText: "Contact Support",
    faqButtonText: "View FAQ"
  }
}
