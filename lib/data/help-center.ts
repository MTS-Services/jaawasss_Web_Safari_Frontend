// Help Center Data - Admin manageable content

export interface HelpArticle {
  id: string
  slug: string
  title: string
  content: string
  steps?: string[]
  enabled: boolean
  order: number
}

export interface HelpCategory {
  id: string
  slug: string
  icon: string // lucide icon name
  title: string
  description: string
  enabled: boolean
  order: number
  articles: HelpArticle[]
}

export interface PopularArticle {
  id: string
  title: string
  categoryId: string
  categorySlug: string
  articleSlug: string
  enabled: boolean
  order: number
}

export interface HelpCenterSettings {
  hero: {
    title: string
    subtitle: string
    searchPlaceholder: string
  }
  contactSupport: {
    enabled: boolean
    title: string
    subtitle: string
    contactButtonText: string
    faqButtonText: string
  }
}

export interface HelpCenterData {
  settings: HelpCenterSettings
  categories: HelpCategory[]
  popularArticles: PopularArticle[]
}

// Default Help Center Data
export const defaultHelpCenterData: HelpCenterData = {
  settings: {
    hero: {
      title: "How Can We Help?",
      subtitle: "Find answers to common questions or contact our support team.",
      searchPlaceholder: "Search for help articles..."
    },
    contactSupport: {
      enabled: true,
      title: "Still Need Help?",
      subtitle: "Can't find what you're looking for? Our support team is here to help.",
      contactButtonText: "Contact Support",
      faqButtonText: "View FAQ"
    }
  },
  categories: [
    {
      id: "buyers",
      slug: "buyers",
      icon: "Users",
      title: "For Buyers",
      description: "Learn how to search, compare, and connect with suppliers",
      enabled: true,
      order: 1,
      articles: [
        {
          id: "buyers-search",
          slug: "search-suppliers",
          title: "How to search for suppliers",
          content: "Finding the right manufacturing partner is crucial for your business success. SourceNest provides powerful search and filtering tools to help you discover reviewed suppliers worldwide.",
          steps: [
            "Use the main search bar to enter product names, categories, or keywords",
            "Apply filters to narrow results by country, industry, review level, and MOQ range",
            "Sort results by relevance, rating, or response time",
            "Click on supplier cards to view detailed profiles",
            "Use the 'Save' button to bookmark suppliers for later comparison"
          ],
          enabled: true,
          order: 1
        },
        {
          id: "buyers-compare",
          slug: "compare-save",
          title: "Comparing and saving suppliers",
          content: "Our comparison tools help you evaluate multiple suppliers side-by-side to make informed decisions.",
          steps: [
            "Click the heart icon on any supplier card to save them",
            "Access saved suppliers from your dashboard",
            "Select up to 4 suppliers to compare",
            "View side-by-side comparison of capabilities, pricing, and certifications",
            "Export comparison reports for team review"
          ],
          enabled: true,
          order: 2
        },
        {
          id: "buyers-messages",
          slug: "send-messages",
          title: "Sending messages to factories",
          content: "Direct communication with suppliers is key to successful sourcing. Our messaging system makes it easy to inquire, negotiate, and build relationships.",
          steps: [
            "Visit any supplier profile and click 'Contact Supplier'",
            "Write a clear, detailed message about your requirements",
            "Attach relevant files like specifications or designs",
            "Track all conversations in your Message Center",
            "Enable notifications to respond quickly to supplier replies"
          ],
          enabled: true,
          order: 3
        },
        {
          id: "buyers-rfq",
          slug: "request-quotes",
          title: "Requesting quotes (RFQs)",
          content: "The Request for Quotation (RFQ) system helps you get competitive quotes from multiple suppliers at once.",
          steps: [
            "Navigate to 'Submit RFQ' from the main menu or dashboard",
            "Fill in product details, specifications, and requirements",
            "Specify quantity, target price, and delivery timeline",
            "Choose to send to specific suppliers or broadcast to relevant manufacturers",
            "Review and compare incoming quotations in your dashboard"
          ],
          enabled: true,
          order: 4
        },
        {
          id: "buyers-dashboard",
          slug: "manage-dashboard",
          title: "Managing your buyer dashboard",
          content: "Your dashboard is the central hub for all your sourcing activities on SourceNest.",
          steps: [
            "View your active RFQs and their status",
            "Access saved suppliers and recent searches",
            "Manage message conversations with suppliers",
            "Track order history and supplier interactions",
            "Update your profile and notification preferences"
          ],
          enabled: true,
          order: 5
        },
        {
          id: "buyers-create-account",
          slug: "create-account",
          title: "How to create a buyer account",
          content: "Creating a buyer account on SourceNest is free and gives you access to thousands of reviewed suppliers worldwide.",
          steps: [
            "Click 'Sign Up' or 'Join as Buyer' on the homepage",
            "Enter your email address and create a secure password",
            "Fill in your basic company information",
            "Verify your email address through the confirmation link",
            "Complete your buyer profile to get better supplier recommendations"
          ],
          enabled: true,
          order: 6
        },
        {
          id: "buyers-send-rfq",
          slug: "send-rfq",
          title: "Sending your first RFQ",
          content: "Learn how to create and send your first Request for Quotation to start getting quotes from manufacturers.",
          steps: [
            "Log in to your buyer account and go to 'Submit RFQ'",
            "Select the product category that best matches your needs",
            "Describe your product requirements in detail",
            "Upload any relevant documents, drawings, or specifications",
            "Set your quantity requirements, target price, and delivery expectations",
            "Review and submit your RFQ to receive quotes from matching suppliers"
          ],
          enabled: true,
          order: 7
        }
      ]
    },
    {
      id: "manufacturers",
      slug: "manufacturers",
      icon: "Factory",
      title: "For Manufacturers",
      description: "Guide to setting up and managing your factory profile",
      enabled: true,
      order: 2,
      articles: [
        {
          id: "mfg-getting-started",
          slug: "getting-started",
          title: "Getting started as a manufacturer",
          content: "Welcome to SourceNest! This guide will help you set up your manufacturer account and start receiving inquiries from global buyers.",
          steps: [
            "Create your account by selecting 'Manufacturer' during signup",
            "Complete your company profile with accurate business information",
            "Upload your product catalog with detailed specifications",
            "Apply for review to build trust with buyers",
            "Optimize your profile to improve visibility in search results"
          ],
          enabled: true,
          order: 1
        },
        {
          id: "mfg-profile",
          slug: "create-profile",
          title: "Creating your company profile",
          content: "A complete, compelling profile is essential for attracting quality buyers. Here's how to create an effective manufacturer profile.",
          steps: [
            "Add your official company name and registration details",
            "Select your primary industry and product categories",
            "Upload high-quality photos of your factory and products",
            "Write a detailed company description highlighting your strengths",
            "List your certifications, export markets, and production capacity"
          ],
          enabled: true,
          order: 2
        },
        {
          id: "mfg-products",
          slug: "upload-products",
          title: "Uploading products",
          content: "Showcase your products effectively to attract buyer inquiries.",
          steps: [
            "Go to Dashboard > Products > Add Product",
            "Enter product name, category, and detailed specifications",
            "Upload multiple high-quality product images",
            "Set pricing range, MOQ, and lead time",
            "Add relevant certifications and customization options"
          ],
          enabled: true,
          order: 3
        },
        {
          id: "mfg-inquiries",
          slug: "manage-inquiries",
          title: "Managing inquiries and RFQs",
          content: "Efficiently handling inquiries is key to converting leads into customers.",
          steps: [
            "Monitor your Inquiries dashboard regularly",
            "Respond to new RFQs within 24 hours for best results",
            "Provide detailed quotations with clear pricing breakdowns",
            "Ask clarifying questions if requirements are unclear",
            "Follow up professionally to build relationships"
          ],
          enabled: true,
          order: 4
        },
        {
          id: "mfg-analytics",
          slug: "analytics",
          title: "Understanding your analytics",
          content: "Use analytics to optimize your presence and improve conversion rates.",
          steps: [
            "Check profile views and visitor demographics",
            "Monitor product inquiry rates and popular items",
            "Track response time and message statistics",
            "Analyze conversion rates from inquiry to quote",
            "Identify trends and adjust your strategy accordingly"
          ],
          enabled: true,
          order: 5
        },
        {
          id: "mfg-profile-setup",
          slug: "profile-setup",
          title: "Setting up your manufacturer profile",
          content: "A well-optimized manufacturer profile is your digital storefront on SourceNest. Here's how to set it up for maximum visibility and buyer engagement.",
          steps: [
            "Navigate to your Dashboard and click 'Edit Profile'",
            "Upload a professional company logo and banner image",
            "Write a compelling company description (300-500 words recommended)",
            "Add your factory photos, production line images, and certificates",
            "Fill in all business details: year established, employee count, annual revenue",
            "List your main products, export markets, and certifications",
            "Set your response time and minimum order values accurately"
          ],
          enabled: true,
          order: 6
        }
      ]
    },
    {
      id: "billing",
      slug: "billing",
      icon: "CreditCard",
      title: "Billing & Plans",
      description: "Information about subscriptions, payments, and invoices",
      enabled: true,
      order: 3,
      articles: [
        {
          id: "billing-plans",
          slug: "plans",
          title: "Subscription plans explained",
          content: "Choose the plan that best fits your business needs and growth stage.",
          steps: [
            "Free Plan: Basic profile, limited inquiries, standard visibility",
            "Professional: Enhanced visibility, unlimited inquiries, priority support",
            "Enterprise: Top placement, dedicated account manager, custom features",
            "Compare all features on our pricing page",
            "Contact sales for custom enterprise solutions"
          ],
          enabled: true,
          order: 1
        },
        {
          id: "billing-upgrade",
          slug: "upgrade-downgrade",
          title: "How to upgrade or downgrade",
          content: "Easily change your subscription plan as your business needs evolve.",
          steps: [
            "Go to Settings > Subscription in your dashboard",
            "Review available plans and their features",
            "Click 'Upgrade' or 'Downgrade' on your chosen plan",
            "Confirm the change and update payment if needed",
            "Upgrades apply immediately; downgrades at cycle end"
          ],
          enabled: true,
          order: 2
        },
        {
          id: "billing-payment",
          slug: "payment-methods",
          title: "Payment methods",
          content: "We offer multiple secure payment options for your convenience.",
          steps: [
            "Credit cards: Visa, MasterCard, American Express",
            "PayPal for easy online payments",
            "Wire transfer for Enterprise accounts",
            "Add payment methods in Settings > Billing",
            "All transactions are secured with encryption"
          ],
          enabled: true,
          order: 3
        },
        {
          id: "billing-invoices",
          slug: "invoices",
          title: "Invoices and receipts",
          content: "Access and manage all your billing documents in one place.",
          steps: [
            "Navigate to Settings > Billing > Invoice History",
            "View all past invoices and payment receipts",
            "Download PDF copies for your records",
            "Request custom invoices via support if needed",
            "Set up automatic invoice emails"
          ],
          enabled: true,
          order: 4
        },
        {
          id: "billing-refund",
          slug: "refunds",
          title: "Refund policy",
          content: "We want you to be satisfied with our service.",
          steps: [
            "14-day money-back guarantee for new subscriptions",
            "Request refunds through Settings > Billing",
            "Provide reason for refund request",
            "Refunds processed within 5-7 business days",
            "Contact support for special circumstances"
          ],
          enabled: true,
          order: 5
        }
      ]
    },
    {
      id: "review",
      slug: "review",
      icon: "Shield",
      title: "Review & Approval",
      description: "Understanding the supplier review process",
      enabled: true,
      order: 4,
      articles: [
        {
          id: "review-process",
          slug: "process",
          title: "How review works",
          content: "Our review process ensures suppliers on SourceNest are legitimate and trustworthy.",
          steps: [
            "Submit your business documentation for review",
            "Our team reviews company registration and licenses",
            "Premium review includes factory inspection",
            "Receive your review badge upon approval",
            "Maintain review status with annual renewal"
          ],
          enabled: true,
          order: 1
        },
        {
          id: "review-documents",
          slug: "documents",
          title: "Required documents",
          content: "Prepare these documents for a smooth review process.",
          steps: [
            "Business registration certificate",
            "Tax registration documents",
            "Company bank account details",
            "Factory ownership or lease agreement",
            "Quality management certifications (ISO, etc.)"
          ],
          enabled: true,
          order: 2
        },
        {
          id: "review-timeline",
          slug: "timeline",
          title: "Approval timeline",
          content: "Understanding the review timeline helps you plan accordingly.",
          steps: [
            "Basic review: 2-5 business days",
            "Premium review: 2-4 weeks",
            "Enterprise review: 4-8 weeks",
            "Timeline may vary based on document completeness",
            "Expedited processing available for Enterprise"
          ],
          enabled: true,
          order: 3
        },
        {
          id: "verify-rejection",
          slug: "rejection",
          title: "What if I'm rejected?",
          content: "Don't worry - most rejections can be resolved by addressing specific issues.",
          steps: [
            "Review the rejection feedback carefully",
            "Correct or update required documents",
            "Contact support for clarification if needed",
            "Resubmit your application with improvements",
            "Allow 2-3 business days for re-review"
          ],
          enabled: true,
          order: 4
        },
        {
          id: "review-badges",
          slug: "badges",
          title: "Trust badges explained",
          content: "Understanding what each review badge means.",
          steps: [
            "Reviewed: Basic documentation confirmed",
            "Premium Reviewed: Factory audit completed",
            "Enterprise Reviewed: Comprehensive on-site inspection",
            "Badges display on your profile and search results",
            "Higher review levels improve buyer confidence"
          ],
          enabled: true,
          order: 5
        }
      ]
    },
    {
      id: "account",
      slug: "account",
      icon: "Settings",
      title: "Account & Settings",
      description: "Managing your account, profile, and preferences",
      enabled: true,
      order: 5,
      articles: [
        {
          id: "account-profile",
          slug: "update-profile",
          title: "Updating profile information",
          content: "Keep your profile current to maintain credibility.",
          steps: [
            "Go to Settings > Profile",
            "Update company information as needed",
            "Upload new photos or documents",
            "Save changes and review your public profile",
            "Some changes may require re-review"
          ],
          enabled: true,
          order: 1
        },
        {
          id: "account-password",
          slug: "change-password",
          title: "Changing your password",
          content: "Regularly updating your password helps keep your account secure.",
          steps: [
            "Navigate to Settings > Security",
            "Enter your current password",
            "Choose a strong new password",
            "Confirm the new password",
            "Click 'Update Password' to save"
          ],
          enabled: true,
          order: 2
        },
        {
          id: "account-notifications",
          slug: "notifications",
          title: "Notification settings",
          content: "Customize how you receive updates and alerts.",
          steps: [
            "Access Settings > Notifications",
            "Toggle email notifications on/off",
            "Configure in-app notification preferences",
            "Set up SMS alerts for urgent messages",
            "Choose digest frequency for summaries"
          ],
          enabled: true,
          order: 3
        },
        {
          id: "account-privacy",
          slug: "privacy",
          title: "Privacy settings",
          content: "Control your data and profile visibility.",
          steps: [
            "Review Settings > Privacy options",
            "Choose who can view your contact details",
            "Manage data sharing preferences",
            "Control search engine visibility",
            "Download your data anytime"
          ],
          enabled: true,
          order: 4
        },
        {
          id: "account-delete",
          slug: "delete-account",
          title: "Deleting your account",
          content: "If you need to close your account, here's how.",
          steps: [
            "Consider exporting your data first",
            "Go to Settings > Account > Delete Account",
            "Confirm your decision",
            "Account deletion is permanent",
            "Contact support if you need help"
          ],
          enabled: true,
          order: 5
        }
      ]
    },
    {
      id: "technical",
      slug: "technical",
      icon: "HelpCircle",
      title: "Technical Support",
      description: "Troubleshooting common issues",
      enabled: true,
      order: 6,
      articles: [
        {
          id: "tech-login",
          slug: "login-issues",
          title: "Login problems",
          content: "Troubleshoot common login issues.",
          steps: [
            "Verify you're using the correct email",
            "Try resetting your password",
            "Clear browser cache and cookies",
            "Try a different browser or device",
            "Contact support if issues persist"
          ],
          enabled: true,
          order: 1
        },
        {
          id: "tech-upload",
          slug: "upload-issues",
          title: "File upload issues",
          content: "Resolve common file upload problems.",
          steps: [
            "Check file size (max 10MB per file)",
            "Ensure file format is supported (JPG, PNG, PDF)",
            "Try a different browser",
            "Disable browser extensions temporarily",
            "Contact support with error details"
          ],
          enabled: true,
          order: 2
        },
        {
          id: "tech-browser",
          slug: "browser",
          title: "Browser compatibility",
          content: "Ensure optimal performance with supported browsers.",
          steps: [
            "Use Chrome 90+ for best experience",
            "Firefox 88+ is fully supported",
            "Safari 14+ works on Mac/iOS",
            "Edge 90+ is compatible",
            "Keep your browser updated"
          ],
          enabled: true,
          order: 3
        },
        {
          id: "tech-mobile",
          slug: "mobile",
          title: "Mobile app support",
          content: "Access SourceNest on your mobile device.",
          steps: [
            "Visit sourcenest.com on your mobile browser",
            "Add to home screen for app-like experience",
            "All features work on mobile browsers",
            "Dedicated mobile app coming soon",
            "Sign up for updates on app release"
          ],
          enabled: true,
          order: 4
        },
        {
          id: "tech-bugs",
          slug: "report-bugs",
          title: "Reporting bugs",
          content: "Help us improve by reporting issues.",
          steps: [
            "Go to Contact Support",
            "Select 'Report a Bug' as the topic",
            "Describe what happened and expected behavior",
            "Include screenshots if possible",
            "We'll investigate and follow up"
          ],
          enabled: true,
          order: 5
        }
      ]
    }
  ],
  popularArticles: [
    {
      id: "pop-1",
      title: "How to create a buyer account",
      categoryId: "buyers",
      categorySlug: "buyers",
      articleSlug: "create-account",
      enabled: true,
      order: 1
    },
    {
      id: "pop-2",
      title: "Understanding subscription plans",
      categoryId: "billing",
      categorySlug: "billing",
      articleSlug: "plans",
      enabled: true,
      order: 2
    },
    {
      id: "pop-3",
      title: "How the review process works",
      categoryId: "review",
      categorySlug: "review",
      articleSlug: "process",
      enabled: true,
      order: 3
    },
    {
      id: "pop-4",
      title: "Sending your first RFQ",
      categoryId: "buyers",
      categorySlug: "buyers",
      articleSlug: "send-rfq",
      enabled: true,
      order: 4
    },
    {
      id: "pop-5",
      title: "Setting up your manufacturer profile",
      categoryId: "manufacturers",
      categorySlug: "manufacturers",
      articleSlug: "profile-setup",
      enabled: true,
      order: 5
    }
  ]
}

// Helper functions
export function getCategoryBySlug(data: HelpCenterData, slug: string): HelpCategory | undefined {
  return data.categories.find(c => c.slug === slug && c.enabled)
}

export function getArticleBySlug(category: HelpCategory, slug: string): HelpArticle | undefined {
  return category.articles.find(a => a.slug === slug && a.enabled)
}

export function getEnabledCategories(data: HelpCenterData): HelpCategory[] {
  return data.categories
    .filter(c => c.enabled)
    .sort((a, b) => a.order - b.order)
}

export function getEnabledArticles(category: HelpCategory): HelpArticle[] {
  return category.articles
    .filter(a => a.enabled)
    .sort((a, b) => a.order - b.order)
}

export function getEnabledPopularArticles(data: HelpCenterData): PopularArticle[] {
  return data.popularArticles
    .filter(a => a.enabled)
    .sort((a, b) => a.order - b.order)
}

// Get category name mapping
export function getCategoryNames(data: HelpCenterData): Record<string, string> {
  const names: Record<string, string> = {}
  data.categories.forEach(c => {
    names[c.slug] = c.title
  })
  return names
}
