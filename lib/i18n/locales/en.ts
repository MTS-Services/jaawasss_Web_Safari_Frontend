const en = {
  // ── Common / Shared ─────────────────────────────────────────────────
  common: {
    save: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    view: "View",
    manage: "Manage",
    close: "Close",
    search: "Search",
    loading: "Loading…",
    noResults: "No results found",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    yes: "Yes",
    no: "No",
    ok: "OK",
    error: "Error",
    success: "Success",
    warning: "Warning",
    email: "Email",
    password: "Password",
  },

  // ── Auth ─────────────────────────────────────────────────────────────
  auth: {
    // Common
    signIn: "Sign In",
    signOut: "Sign Out",
    signUp: "Sign Up",
    email: "Email Address",
    password: "Password",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember me",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    orContinueWith: "Or continue with",
    
    // Sign In page
    welcomeBack: "Welcome back",
    signInToYourAccount: "Sign in to your account to continue",
    buyer: "Buyer",
    manufacturer: "Manufacturer",
    admin: "Admin",
    buyerDescription: "Access your buyer dashboard to manage RFQs, messages, and saved suppliers.",
    manufacturerDescription: "Access your manufacturer dashboard to manage products, inquiries, and company profile.",
    adminDescription: "Access the admin panel to manage users, suppliers, and platform settings.",
    signInAs: "Sign in as",
    continueWithGoogle: "Continue with Google",
    dontHaveAccount: "Don't have an account?",
    createAccount: "Create account",
    canceledDeletion: "Canceled a deletion request?",
    restoreAccount: "Restore account",
    invalidEmailOrPassword: "Invalid email or password. Please try again.",
    accountRestored: "Account restored",
    accountRestoredMessage: "You can sign in with your usual credentials.",
    signingIn: "Signing in...",
    
    // Sign Up page
    createNewAccount: "Create your account",
    joinOurPlatform: "Join our platform to start selling or finding suppliers",
    selectYourRole: "Select your role",
    buyerRole: "Buyer",
    buyerRoleDesc: "Looking for suppliers and products",
    manufacturerRole: "Manufacturer",
    manufacturerRoleDesc: "Supplying products to buyers",
    continueButton: "Continue",
    
    // Sign Up - Details form
    firstName: "First Name",
    lastName: "Last Name",
    company: "Company Name",
    country: "Country",
    confirmPassword: "Confirm Password",
    agreeToTerms: "I agree to the Terms of Service and Privacy Policy",
    
    // Manufacturer specific
    city: "City",
    businessLicense: "Business License",
    website: "Website",
    factoryPhotos: "Factory Photos",
    additionalNotes: "Additional Notes",
    uploadBizLicense: "Upload Business License",
    uploadFactoryPhotos: "Upload Factory Photos (Max 5)",
    uploadDesc: "Drag and drop or click to select files",
    max5Photos: "Maximum 5 photos",
    remove: "Remove",
    
    // Social signup
    needsProfileCompletion: "Complete your profile",
    profileAlmostReady: "Your profile is almost ready",
    continueProfileSetup: "Continue setting up your profile",
    
    // Errors
    googleLoginFailed: "Google login failed. Please try again.",
    errorOccurred: "An error occurred. Please try again.",
    accountCreated: "Your account has been created",
    reviewPlans: "Review plans next, or go straight to your dashboard.",
    verifyEmail: "Please verify your email before continuing.",
    
    // Restore Account
    restoreTitle: "Restore your account",
    restoreSubtitleStep1: "If you requested account deletion, sign in here to cancel it. We will email you a verification code.",
    restoreSubtitleStep2: "Enter the verification code sent to your email.",
    restoreSendingCode: "Sending code…",
    restoreContinue: "Continue",
    restoreVerificationCode: "Verification code",
    restoreEnterCode: "Enter code from email",
    restoreVerifying: "Verifying…",
    restoreVerifyButton: "Verify and restore account",
    restoreDifferentEmail: "Use different email",
    
    // Forgot Password
    forgotTitle: "Forgot your password?",
    resetTitle: "Reset your password",
    forgotSubtitle: "No worries, we'll send you reset instructions.",
    resetSubtitle: "Enter the OTP and your new password to complete reset.",
    forgotSending: "Sending...",
    forgotSendCode: "Send reset code",
    resetPasswordComplete: "Password reset complete",
    resetOtpLabel: "OTP code",
    resetOtpPlaceholder: "Enter OTP",
    resetNewPassword: "New password",
    resetConfirmPassword: "Confirm password",
    resetResetting: "Resetting...",
    resetButton: "Reset password",
    resetDifferentEmail: "Use another email",
    rememberPassword: "Remember your password?",
    passwordMismatch: "Password confirmation does not match.",
    emailMissing: "Email is missing. Please request a reset code again.",
  },

  // ── Auth Layout ──────────────────────────────────────────────────────
  authLayout: {
    connectManufacturers: "Connect with reviewed manufacturers worldwide",
    joinBusinesses: "Join thousands of businesses finding reliable manufacturing partners through our curated network.",
    reviewedManufacturers: "Reviewed Manufacturers",
    countries: "Countries",
    productCategories: "Product Categories",
    clientSatisfaction: "Client Satisfaction",
    allSuppliersReviewed: "All suppliers reviewed and audited",
    globalNetwork: "Global network across 120+ countries",
    secureMessaging: "Secure messaging and transactions",
    realtimeRFQ: "Real-time RFQ matching",
    copyright: "SourceNest. All rights reserved.",
  },

  // ── Navigation / Sidebar ─────────────────────────────────────────────
  nav: {
    dashboard: "Dashboard",
    users: "Users",
    suppliers: "Suppliers",
    products: "Products",
    industries: "Industries",
    reviews: "Reviews",
    rfqs: "RFQs",
    messages: "Messages",
    reports: "Reports",
    pricing: "Pricing",
    promotions: "Promotions",
    subscriptions: "Subscriptions",
    insights: "Insights",
    analytics: "Analytics",
    contact: "Contact Page",
    faq: "FAQ Management",
    siteSettings: "Site Settings",
    settings: "Settings",
    viewSite: "View Site",
    quickFilters: "Quick Filters",
    createManufacturer: "Create Manufacturer",
    mfgRegistrations: "Mfg registrations",
    
    // Header navigation
    headerDiscover: "Discover",
    headerPlatform: "Platform",
    headerResources: "Resources",
    headerInsights: "Insights",
    
    // Discover items
    browseIndustries: "Browse Industries",
    browseIndustriesDesc: "Find suppliers by industry sector and specialization",
    browseSuppliers: "Browse Suppliers",
    browseSuppliersDesc: "Discover reviewed manufacturers from around the world",
    browseProducts: "Browse Products",
    browseProductsDesc: "Explore products across all categories and industries",
    featuredManufacturers: "Featured Manufacturers",
    featuredManufacturersDesc: "Top-rated reviewed manufacturers on the platform",
    globalSupplierMap: "Global Supplier Map",
    globalSupplierMapDesc: "Explore suppliers by country and region",
    compareSuppliers: "Compare Suppliers",
    compareSuppliersDesc: "Compare manufacturers side by side",
    newSuppliers: "New Suppliers",
    newSuppliersDesc: "Recently joined manufacturers on SourceNest",
    
    // Platform items
    forBuyers: "For Buyers",
    forBuyersDesc: "Search, compare, and connect with suppliers for free",
    forManufacturers: "For Manufacturers",
    forManufacturersDesc: "Showcase your factory and reach global buyers",
    
    // Resource items
    review: "Review",
    reviewDesc: "Learn how we review and approve suppliers",
    helpCenter: "Help Center",
    helpCenterDesc: "Find answers to common questions",
    aboutUs: "About Us",
    aboutUsDesc: "Learn more about SourceNest",
    
    // Header favorites dropdown
    savedTabSuppliers: "Suppliers",
    savedTabProducts: "Products",
    noSavedSuppliers: "No saved suppliers yet",
    saveSupplierHint: "Click the heart icon on any supplier to save them",
    browseSuppliersCTA: "Browse Suppliers",
    viewAllSavedSuppliers: "View All Saved Suppliers",
    noSavedProducts: "No saved products yet",
    saveProductHint: "Click the heart icon on any product to save it",
    browseProductsCTA: "Browse Products",
    viewAllSavedProducts: "View All Saved Products",
    moreSuppliersCount: "more suppliers",
    moreProductsCount: "more products",
    
    // Auth menu dropdown
    userMenuDashboard: "Dashboard",
    userMenuSettings: "Settings",
    userMenuSignOut: "Sign Out",
    userMenuSignIn: "Sign In",
    userMenuGetStarted: "Get Started",
    
    // Admin sidebar menu
    adminDashboard: "Dashboard",
    adminUsers: "Users",
    adminCreateManufacturer: "Create Manufacturer",
    adminMfgRegistrations: "Mfg registrations",
    adminSuppliers: "Suppliers",
    adminProducts: "Products",
    adminIndustries: "Industries",
    adminQuickFilters: "Quick Filters",
    adminReviews: "Reviews",
    adminRFQs: "RFQs",
    adminMessages: "Messages",
    adminReports: "Reports",
    adminPricing: "Pricing",
    adminPromotions: "Promotions",
    adminSubscriptions: "Subscriptions",
    adminInsights: "Insights",
    adminCertificateType: "Certificate Type",
    adminAnalytics: "Analytics",
    adminContactPage: "Contact Page",
    adminFAQManagement: "FAQ Management",
    adminHelpCenter: "Help Center",
    adminReviewManagement: "Review Management",
    adminSiteSettings: "Site Settings",
    adminSettings: "Settings",
    adminViewSite: "View Site",
    adminSignOut: "Sign Out",
  },

  // ── Settings Page ────────────────────────────────────────────────────
  settings: {
    title: "Settings",
    subtitle: "Manage your account and preferences",
    adminSubtitle: "Platform configuration and preferences",

    // Account
    accountDetails: "Account Details",
    accountDetailsDesc: "Manage your personal information",
    accountCredentialsDesc: "Manage your login credentials and contact information",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    companyName: "Company Name",
    phoneNumber: "Phone Number",
    changePassword: "Change Password",

    // General (admin)
    generalSettings: "General Settings",
    generalSettingsDesc: "Basic platform configuration",
    platformName: "Platform Name",
    supportEmail: "Support Email",
    contactPhone: "Contact Phone",

    // Security
    security: "Security",
    securityDesc: "Manage your account security settings",
    securitySettings: "Security Settings",
    securitySettingsDesc: "Platform security configuration",
    requireEmailVerification: "Require Email Verification",
    requireEmailVerificationDesc: "Users must verify email before access",
    manualSupplierApproval: "Manual Supplier Approval",
    manualSupplierApprovalDesc: "Require admin approval for new suppliers",
    rateLimiting: "Rate Limiting",
    rateLimitingDesc: "Limit API requests per user",
    loginHistory: "Login History",
    loginHistoryDesc: "View recent login activity",
    connectedDevices: "Connected Devices",
    connectedDevicesDesc: "Manage active sessions",

    // Notifications
    notifications: "Notification Preferences",
    notificationsDesc: "Choose how and when you want to be notified",
    adminNotifications: "Notification Settings",
    adminNotificationsDesc: "Admin notification preferences",
    newQuoteResponses: "New Quote Responses",
    newQuoteResponsesDesc: "Get notified when suppliers respond to your RFQs",
    newMessages: "New Messages",
    newMessagesDesc: "Get notified for new messages from suppliers",
    newMessagesBuyerDesc: "Get notified for new messages from suppliers",
    newMessagesMfgDesc: "Get notified for new messages from buyers",
    supplierUpdates: "Supplier Updates",
    supplierUpdatesDesc: "Get notified when saved suppliers add new products",
    weeklyDigest: "Weekly Digest",
    weeklyDigestDesc: "Receive a weekly summary of new suppliers in your interest areas",
    weeklyPerformanceDigest: "Weekly Performance Digest",
    weeklyPerformanceDigestDesc: "Receive weekly analytics summary",
    marketingPromotions: "Marketing & Promotions",
    marketingPromotionsDesc: "Receive tips and special offers",
    marketingPromotionsMfgDesc: "Receive tips and promotional offers",
    dailySummary: "Daily Summary",
    dailySummaryDesc: "Receive daily platform summary",
    newInquiryAlerts: "New Inquiry Alerts",
    newInquiryAlertsDesc: "Get notified when buyers send inquiries",
    quoteRequests: "Quote Requests",
    quoteRequestsDesc: "Get notified when you receive RFQs",
    newSupplierRegistrations: "New Supplier Registrations",
    newSupplierRegistrationsDesc: "Get notified for new supplier signups",
    reportedContent: "Reported Content",
    reportedContentDesc: "Get notified for flagged content",

    // Language & Region
    languageRegion: "Language & Region",
    languageRegionDesc: "Set your preferred language and timezone",
    language: "Language",
    timezone: "Timezone",
    currencyDisplay: "Currency Display",
    localization: "Localization",
    localizationDesc: "Regional and language settings",
    defaultLanguage: "Default Language",
    defaultCurrency: "Default Currency",
    defaultTimezone: "Default Timezone",

    // Email (admin)
    emailSettings: "Email Settings",
    emailSettingsDesc: "Email delivery configuration",
    fromName: "From Name",
    fromEmail: "From Email",
    testEmailDelivery: "Test Email Delivery",
    primaryEmail: "Primary Email",
    notificationEmail: "Notification Email",
    addEmail: "Add Email",

    // Database (admin)
    database: "Database",
    databaseDesc: "Database maintenance and backups",
    lastBackup: "Last Backup",
    createBackup: "Create Backup",
    exportData: "Export Data",

    // Subscription (manufacturer)
    subscription: "Subscription",
    nextBillingDate: "Next billing date",
    upgradePlan: "Upgrade Plan",
    cancelSubscription: "Cancel Subscription",

    // Danger zone
    dangerZone: "Danger Zone",
    deactivateAccount: "Deactivate Account",
    deleteAccount: "Delete Account",
  },

  // ── FAQ Admin ────────────────────────────────────────────────────────
  faq: {
    title: "FAQ Management",
    subtitle: "Manage frequently asked questions displayed on the FAQ page",
    totalCategories: "Total Categories",
    totalQuestions: "Total Questions",
    avgPerCategory: "Avg Questions/Category",
    categories: "FAQ Categories",
    categoriesDesc: "Organize your FAQs by category. Drag to reorder or use the arrow buttons.",
    addCategory: "Add Category",
    editCategory: "Edit Category",
    addQuestion: "Add Question",
    editQuestion: "Edit Question",
    categoryTitle: "Category Title",
    question: "Question",
    answer: "Answer",
    noCategories: "No FAQ categories yet",
    addFirstCategory: "Add Your First Category",
    noQuestions: "No questions in this category",
    deleteConfirmCategory: "This will delete the category and all questions within it. This action cannot be undone.",
    deleteConfirmFaq: "This will permanently delete this question. This action cannot be undone.",
    createCategoryDesc: "Create a new FAQ category to organize your questions",
    updateCategoryDesc: "Update the category name",
    createFaqDesc: "Add a new FAQ to this category",
    updateFaqDesc: "Update the question and answer",
    questionPlaceholder: "e.g., How do I reset my password?",
    answerPlaceholder: "Provide a clear and helpful answer...",
    categoryPlaceholder: "e.g., General, For Buyers, Billing",
  },
  // ── Landing Page ─────────────────────────────────────────────────────
  landing: {
    hero: {
      badge: "Connecting Global Trade",
      title1: "Discover Reviewed",
      title2: "Manufacturers Worldwide",
      subtitle: "Search products, compare suppliers, request quotes, and connect directly with trusted factories through one premium global sourcing platform.",
      searchPlaceholder: "Search products, suppliers, or industries...",
      searchButton: "Search",
      popular: "Popular:",
      popElectronics: "Electronics",
      popTextiles: "Textiles",
      popMachinery: "Machinery",
      popFood: "Food & Beverage",
      statCountries: "Countries Covered",
      statReviewed: "Reviewed Suppliers",
      statDirect: "Factory Communication",
      statDirectPrefix: "Direct"
    },
    whatIs: {
      title: "What is SourceNest?",
      desc: "SourceNest is a premium global digital marketplace where importers, buyers, and sourcing professionals discover reviewed manufacturers and factories from around the world. Factories present their products, capabilities, and certifications, while buyers search, compare, and connect directly — all in one trusted platform.",
      forBuyers: "For Buyers & Importers",
      forBuyersDesc: "Discover reviewed manufacturers, compare suppliers side-by-side, save favorites, send quote requests, and communicate directly with factories. Your entire sourcing workflow in one place — completely free.",
      buyerPoint1: "Search thousands of reviewed suppliers",
      buyerPoint2: "Compare factories and capabilities",
      buyerPoint3: "Request quotes and message directly",
      buyerPoint4: "Access product catalogs and specs",
      buyerLink: "Learn more for buyers",
      forMfg: "For Manufacturers & Factories",
      forMfgDesc: "Create your digital booth, upload products, showcase certifications, and get discovered by buyers worldwide. Receive inquiries and quote requests directly in your dashboard. Join through affordable subscription plans.",
      mfgPoint1: "Build a professional company profile",
      mfgPoint2: "Upload unlimited product catalogs",
      mfgPoint3: "Receive and manage quote requests",
      mfgPoint4: "Gain global visibility and exposure",
      mfgLink: "Learn more for manufacturers"
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Simple, transparent processes for both buyers and manufacturers",
      tabBuyers: "For Buyers",
      tabMfg: "For Manufacturers",
      buyerStep1Title: "Search & Discover",
      buyerStep1Desc: "Browse our global supplier directory, filter by industry, location, certifications, and capabilities to find the perfect manufacturing partners.",
      buyerStep2Title: "Compare Suppliers",
      buyerStep2Desc: "Save your favorite suppliers, compare them side-by-side, review their products, certifications, and capabilities to make informed decisions.",
      buyerStep3Title: "Connect & Communicate",
      buyerStep3Desc: "Send messages directly to factories, request detailed quotes, and negotiate terms — all within the platform's secure messaging system.",
      buyerStep4Title: "Request Quotes",
      buyerStep4Desc: "Submit detailed RFQs with specifications, quantities, and requirements. Receive competitive quotes directly from reviewed manufacturers.",
      buyerFree: "Buyers use SourceNest completely free — no subscription required.",
      mfgStep1Title: "Create Your Account",
      mfgStep1Desc: "Sign up as a manufacturer and choose the subscription plan that fits your business needs and growth goals.",
      mfgStep2Title: "Complete Payment",
      mfgStep2Desc: "Once your account is reviewed and approved, complete your payment to activate your account and start using the platform.",
      mfgStep3Title: "Build Your Profile",
      mfgStep3Desc: "Complete your factory profile with details, certifications, capabilities, and upload your product catalog and brochures.",
      mfgStep4Title: "Upload Products",
      mfgStep4Desc: "Add your products with images, specifications, MOQ, lead times, and packaging details to showcase your full range.",
      mfgStep5Title: "Submit for Approval",
      mfgStep5Desc: "Once ready, submit your account for review. Our team will review your business before granting access to the platform.",
      mfgStep6Title: "Go Global",
      mfgStep6Desc: "After approval, your profile goes live. Start receiving inquiries and quote requests from buyers worldwide.",
      mfgApproval: "All manufacturer accounts require admin approval before going live — ensuring quality and trust for buyers.",
      important: "Important: No payment is required upfront. Your account will be reviewed first, and you will only be charged after approval.",
      paymentComplete: "Once approved, complete your payment to activate your account and unlock full access to the platform."
    },
    whyUse: {
      buyerTitle: "Why Buyers Choose SourceNest",
      buyerSubtitle: "Everything you need to find and connect with the right manufacturers — at no cost",
      bb1Title: "Free Forever for Buyers",
      bb1Desc: "Search, compare, message, and request quotes — all completely free. No hidden fees, no subscription required.",
      bb2Title: "Reviewed Suppliers Only",
      bb2Desc: "Every manufacturer is reviewed and approved by our team based on submitted information before appearing on the platform.",
      bb3Title: "Global Reach",
      bb3Desc: "Access factories from 50+ countries across all major manufacturing regions worldwide.",
      bb4Title: "Direct Communication",
      bb4Desc: "Chat directly with factory representatives, no middlemen or brokers involved.",
      bb5Title: "Compare & Decide",
      bb5Desc: "Side-by-side supplier comparison with detailed capabilities, certifications, and pricing.",
      bb6Title: "Save Time",
      bb6Desc: "Streamlined RFQ process, organized inbox, and saved suppliers keep your workflow efficient.",
      mfgTitle: "Why Manufacturers Join",
      mfgSubtitle: "Expand your reach and connect with qualified buyers through a trusted platform",
      mb1Title: "Global Visibility",
      mb1Desc: "Get discovered by importers and buyers from around the world looking for your products.",
      mb2Title: "Premium Positioning",
      mb2Desc: "Present your factory with a professional profile, product catalogs, and submitted credentials.",
      mb3Title: "Quality Leads",
      mb3Desc: "Receive inquiries from serious buyers who have already researched your capabilities.",
      whyPayTitle: "Why Do Manufacturers Pay to Join?",
      whyPayDesc: "SourceNest is free for buyers to ensure maximum reach for manufacturers. Factories pay a subscription to fund platform development, review processes, and premium features. This model ensures only serious, committed manufacturers join — giving buyers confidence in every supplier they discover."
    },
    featured: {
      suppliersTitle: "Featured Reviewed Suppliers",
      suppliersSubtitle: "Discover top-rated manufacturers handpicked by our team",
      viewAllSuppliers: "View All Suppliers",
      productsTitle: "Trending Categories",
      productsSubtitle: "Source top-selling products directly from reviewed manufacturers",
      industriesBadge: "Popular Industries",
      industriesTitle: "Find Suppliers by Industry",
      industriesSubtitle: "Discover reviewed manufacturers across major industrial sectors. Each category features vetted suppliers ready to fulfill your requirements.",
      suppliersLabel: "suppliers",
      exploreButton: "Explore",
    },
    trust: {
      title: "Sourcing Built on Trust",
      subtitle: "Every connection on SourceNest is backed by our unwavering commitment to quality and transparency",
      t1Title: "Reviewed Capabilities",
      t1Desc: "Our thorough vetting process ensures every manufacturer is real, capable, and ready to deliver.",
      t2Title: "Platform Integrity",
      t2Desc: "We operate with full transparency. No hidden markups, no paid ranks—just genuine B2B connections.",
      t3Title: "Global Standards",
      t3Desc: "We review submitted compliance documentation against international manufacturing and quality control standards.",
      t4Title: "Dedicated Support",
      t4Desc: "Our sourcing experts are available to guide you through complex manufacturing requirements.",
      badge: "Trust & Review",
      learnMore: "Learn About Our Review Process",
      reviewedBadge: "SourceNest Reviewed",
      point1: "Business information provided",
      point2: "Factory details provided",
      point3: "Certifications (if provided)",
      point4: "Export experience (if provided)",
      point5: "Profile information reviewed"
    },
    testimonials: {
      title: "What Our Community Says",
      subtitle: "Join thousands of successful businesses scaling globally"
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about using SourceNest",
      moreQuestions: "Have more questions?",
      viewFull: "View Full FAQ"
    },
    cta: {
      buyerTitle: "Ready to Find Your Manufacturer?",
      buyerDesc: "Join thousands of buyers already using SourceNest to streamline their global sourcing.",
      buyerBtn: "Start Sourcing Now",
      mfgTitle: "Are You a Manufacturer?",
      mfgDesc: "Get your factory in front of active buyers worldwide.",
      mfgBtn: "Join as Manufacturer"
    },
    footer: {
      slogan: "SourceNest facilitates connections between independent users and does not take responsibility for transactions between them.",
      platform: "Platform",
      forBuyers: "For Buyers",
      forMfg: "For Manufacturers",
      pricing: "Pricing",
      search: "Search",
      discover: "Discover",
      browseSuppliers: "Browse Suppliers",
      browseProducts: "Browse Products",
      industries: "Industries",
      rfq: "Request Quote",
      resources: "Resources",
      helpCenter: "Help Center",
      reviewProcess: "Review Process",
      faq: "FAQ",
      blog: "Blog & Insights",
      company: "Company",
      aboutUs: "About Us",
      contact: "Contact",
      buyerDash: "Buyer Dashboard",
      mfgDash: "Manufacturer Dashboard",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookie: "Cookie Policy",
      popular: "Popular Industries",
      viewAll: "View All Industries",
      rights: "All rights reserved."
    },
    industries: {
      viewAll: "View All Industries",
      explorerMap: "Explore Global Map",
      electronicsElectrical: "Electronics & Electrical",
      machineryEquipment: "Machinery & Equipment",
      textilesApparel: "Textiles & Apparel",
      homeGarden: "Home & Garden",
      healthBeauty: "Health & Beauty",
      // Industries page
      pageTitle: "Explore Industries",
      pageDescription: "Discover reviewed manufacturers and suppliers across all major industries. From electronics to textiles, find the perfect partner for your business.",
      majorIndustriesBadge: "Major Industries",
      categoriesLabel: "Categories",
      suppliersLabel: "Suppliers",
      productsLabel: "Products",
      featuredBadge: "Featured",
      exploreButton: "Explore",
      suppliersButton: "Suppliers",
      moreCategories: "+ {count} more",
      cantFindTitle: "Can't find your industry?",
      cantFindDesc: "We're constantly expanding our network. Contact us to learn about upcoming industries.",
      contactUsButton: "Contact Us",
    },
    suppliers: {
      pageTitle: "Find Reviewed Suppliers",
      pageDescription: "Browse reviewed manufacturers from around the world",
      pageSubtitle: "{count}+ reviewed manufacturers from around the world",
      searchPlaceholder: "Search suppliers, products, or categories...",
      filters: "Filters",
      clearAll: "Clear all",
      industryLabel: "Industry",
      allIndustries: "All Industries",
      countryLabel: "Country",
      allCountries: "All Countries",
      popular: "Popular",
      certificationLabel: "Certification",
      anyCertification: "Any Certification",
      minimumOrderLabel: "Minimum Order",
      anyMOQ: "Any MOQ",
      exportMarketLabel: "Export Market",
      anyRegion: "Any Region",
      reviewedSuppliersOnly: "Reviewed suppliers only",
      suppliersFound: "suppliers found",
      sortBy: "Sort by",
      relevance: "Relevance",
      highestRating: "Highest Rating",
      fastestResponse: "Fastest Response",
      mostProducts: "Most Products",
      activeFilters: "Active filters:",
      search: "Search:",
      reviewedOnly: "Reviewed Only",
      reviewedBadge: "Reviewed",
      productsLabel: "products",
      moreProducts: "+ {count} more",
      noSuppliersFound: "No suppliers found",
      adjustSearchFilters: "Try adjusting your search or filter criteria",
      clearAllFilters: "Clear all filters",
      compare: {
        pageTitle: "Compare Suppliers",
        pageDescription: "Compare up to {max} suppliers side by side",
        breadcrumbHome: "Home",
        breadcrumbSuppliers: "Suppliers",
        breadcrumbCompare: "Compare",
        addSupplier: "Add supplier to compare",
        maximumSuppliersAdded: "Maximum suppliers added",
        noSuppliersSelected: "No Suppliers Selected",
        noSuppliersMessage: "Select suppliers from the dropdown above or browse our supplier directory to start comparing.",
        browseSuppliers: "Browse Suppliers",
        comparing: "Comparing {count} suppliers",
        rating: "Rating",
        reviews: "reviews",
        responseTime: "Response Time",
        responseRate: "Response Rate",
        onTimeDelivery: "On-Time Delivery",
        established: "Established",
        years: "years",
        employees: "Employees",
        productCount: "Product Count",
        minOrderValue: "Min Order Value",
        contactForMOQ: "Contact for MOQ",
        exportMarkets: "Export Markets",
        certifications: "Certifications",
        contactSupplier: "Contact Supplier",
        viewProfile: "View Profile",
        addMore: "Add {count} more supplier{plural} to compare",
        selectSupplier: "Select a supplier",
      }
    },
    products: {
      pageTitle: "Discover Products",
      pageDescription: "Browse {productCount}+ products from reviewed manufacturers worldwide",
      searchPlaceholder: "Search products, categories...",
      categoryLabel: "Category",
      allCategories: "All Categories",
      sortLabel: "Sort By",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      lowestMOQ: "Lowest MOQ",
      newestFirst: "Newest First",
      mostPopular: "Most Popular",
      productsFound: "products found",
      sortDisplay: "Sort:",
      verified: "Verified",
      moqLabel: "MOQ:",
      daysLabel: "days",
      inquiriesLabel: "inquiries",
      noProductsFound: "No products found",
      errorLoadingProducts: "Error loading products",
    },
    suppliersMap: {
      globalNetwork: "Global Network",
      pageTitle: "Global Supplier Map",
      pageDescription: "Explore manufacturers and suppliers from around the world. Find the perfect partner for your sourcing needs.",
      searchPlaceholder: "Search countries or regions...",
      reviewedSuppliersLabel: "Reviewed Suppliers",
      countriesLabel: "Countries",
      industriesLabel: "Industries",
      productsLabel: "Products",
      exploreByRegion: "Explore by Region",
      clickRegionToView: "Click on a region to view suppliers from that area",
      suppliers: "suppliers",
      worldsManufacturingHub: "World's manufacturing hub",
      qualityPrecisionManufacturing: "Quality & precision manufacturing",
      innovationTechnologyLeaders: "Innovation & technology leaders",
      emergingManufacturingMarkets: "Emerging manufacturing markets",
      highQualityProduction: "High-quality production",
      countriesIn: "Countries in {region}",
      countriesAvailable: "countries available",
      viewAllCountries: "View All {count} Countries",
      topManufacturingCountries: "Top Manufacturing Countries",
      countriesMostReviewedSuppliers: "Countries with the most reviewed suppliers on our platform",
      viewAllSuppliers: "View All Suppliers",
      growth: "growth",
      cantFindTitle: "Can't find what you're looking for?",
      cantFindDesc: "Submit a Request for Quotation and let reviewed manufacturers come to you with competitive offers.",
      submitRFQ: "Submit RFQ",
      browseAllSuppliers: "Browse All Suppliers",
    },
    forBuyers: {
      hero: {
        badge: "100% Free for Buyers",
        title: "Source Globally, Completely Free",
        subtitle: "Search reviewed suppliers, compare factories, request quotes, and communicate directly with manufacturers — all at no cost. SourceNest is free for buyers, forever.",
        signupButton: "Create Free Account",
        browseButton: "Browse Suppliers",
      },
      featuresTitle: "Everything You Need to Source Smarter",
      featuresSubtitle: "Powerful tools designed to streamline your entire sourcing workflow",
      features: {
        search: {
          title: "Search Suppliers",
          description: "Access our global directory of reviewed manufacturers. Filter by industry, location, certifications, MOQ, and more to find the perfect partners.",
        },
        compare: {
          title: "Compare Factories",
          description: "Add suppliers to your comparison list and evaluate them side-by-side. Compare capabilities, certifications, lead times, and more.",
        },
        messaging: {
          title: "Direct Messaging",
          description: "Chat directly with factory representatives through our secure platform. No middlemen, no brokers — just direct communication.",
        },
        rfq: {
          title: "Request Quotes",
          description: "Submit detailed RFQs with specifications, quantities, and requirements. Receive competitive quotes directly from manufacturers.",
        },
        favorites: {
          title: "Save Favorites",
          description: "Save suppliers and products to your favorites for easy access. Build your preferred vendor list over time.",
        },
        catalogs: {
          title: "Download Catalogs",
          description: "Access and download product catalogs, specification sheets, and company brochures from reviewed suppliers.",
        },
        dashboard: {
          title: "Organized Dashboard",
          description: "Manage all your sourcing activity in one place. Track messages, RFQs, saved items, and supplier interactions.",
        },
        notifications: {
          title: "Smart Notifications",
          description: "Get notified when suppliers respond to your inquiries, when new suppliers match your preferences, and more.",
        },
      },
      benefitsTitle: "Why Buyers Love SourceNest",
      benefitsSubtitle: "Join thousands of procurement professionals, importers, and sourcing managers who trust SourceNest for their global sourcing needs.",
      benefits: {
        free: "Completely free to use — no subscription, no hidden fees",
        reviewed: "Only reviewed and approved suppliers on the platform",
        directComm: "Direct communication with factory representatives",
        comparison: "Side-by-side supplier comparison tools",
        secure: "Secure RFQ and messaging system",
        catalogs: "Access to product catalogs and specifications",
        dashboard: "Organized dashboard for all sourcing activity",
        global: "Global reach across 50+ manufacturing countries",
      },
      benefitBoxTitle: "Why is it free for buyers?",
      benefitBoxDescription1: "Our business model is simple: manufacturers pay a subscription to be listed on the platform, while buyers use it for free. This ensures maximum reach for factories while giving you access to a premium sourcing tool at no cost.",
      benefitBoxDescription2: "By keeping the platform free for buyers, we attract more serious sourcing professionals — which in turn makes the platform more valuable for manufacturers. Everyone wins.",
      ctaTitle: "Start Sourcing Today",
      ctaSubtitle: "Create your free account in seconds and start connecting with reviewed manufacturers worldwide.",
      ctaButton: "Create Free Buyer Account",
    }
  },
  forManufacturers: {
    hero: {
      badge: "Grow Your Export Business",
      title: "Reach Global Buyers, Grow Your Factory",
      subtitle: "Create your digital booth, showcase products, and connect with importers and sourcing professionals worldwide through SourceNest's premium B2B platform.",
      viewPricing: "View Pricing Plans",
      getStarted: "Get Started"
    },
    features: {
      title: "Everything You Need to Succeed",
      subtitle: "Powerful tools to present your factory and connect with the right buyers",
      f1Title: "Professional Company Profile",
      f1Desc: "Create a comprehensive digital booth showcasing your factory, capabilities, certifications, and production capacity.",
      f2Title: "Global Visibility",
      f2Desc: "Get discovered by importers and sourcing professionals from around the world actively looking for suppliers.",
      f3Title: "Direct Buyer Communication",
      f3Desc: "Receive and respond to inquiries directly through our platform. Chat with serious buyers without intermediaries.",
      f4Title: "RFQ Management",
      f4Desc: "Receive detailed quote requests with specifications. Respond with competitive offers to win new business.",
      f5Title: "Performance Analytics",
      f5Desc: "Track profile views, inquiry rates, and engagement metrics. Understand what buyers are looking for.",
      f6Title: "Reviewed Badge",
      f6Desc: "After approval, receive the SourceNest Reviewed badge — a trust signal that helps you stand out to buyers."
    },
    howItWorks: {
      title: "How to Get Started",
      subtitle: "A simple process to get your factory on SourceNest",
      step1Title: "Create Your Account",
      step1Desc: "Sign up as a manufacturer and choose the subscription plan that fits your business needs and growth goals.",
      step2Title: "Submit for Approval",
      step2Desc: "Once ready, submit your account for review. Our team will review your business before granting access to the platform.",
      step3Title: "Complete Payment",
      step3Desc: "Once your account is reviewed and approved, complete your payment to activate your account and start using the platform.",
      step4Title: "Build Your Profile",
      step4Desc: "Complete your factory profile with details, certifications, capabilities, and upload your product catalog and brochures.",
      step5Title: "Upload Products",
      step5Desc: "Add your products with images, specifications, MOQ, lead times, and packaging details to showcase your full range.",
      step6Title: "Go Global",
      step6Desc: "After approval, your profile goes live. Start receiving inquiries and quote requests from buyers worldwide.",
      important: "Important: No payment is required upfront. Your account will be reviewed first, and you will only be charged after approval.",
      afterApproval: "Once approved, complete your payment to activate your account and unlock full access to the platform."
    },
    benefits: {
      whyChoose: "Why Manufacturers Choose SourceNest",
      desc1: "Unlike general B2B platforms, SourceNest is built specifically for connecting quality manufacturers with serious buyers. Our review process helps ensure you're surrounded by screened businesses, and our premium positioning attracts professional sourcing teams.",
      desc2: "With affordable subscription plans and no commission on deals, SourceNest offers exceptional value for factories looking to expand their global reach.",
      title: "Benefits of Joining",
      b1: "Reach qualified buyers actively searching for suppliers",
      b2: "Present your factory with a professional, polished profile",
      b3: "Receive quality leads and RFQs directly in your inbox",
      b4: "Showcase certifications and build credibility",
      b5: "Expand into new markets and regions",
      b6: "No commission fees — pay only your subscription"
    },
    cta: {
      title: "Ready to Reach Global Buyers?",
      subtitle: "Join SourceNest today and start receiving inquiries from importers worldwide.",
      choosePlan: "Choose Your Plan",
      contactSales: "Contact Sales"
    }
  },
  pricing: {
    hero: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the plan that fits your business. All plans include admin review and approval process.",
      buyersNote: "Pricing is for manufacturers only. Buyers use SourceNest for free."
    },
    founding: {
      badge: "Limited Time Offer",
      title: "Join as a Founding Manufacturer",
      subtitle: "Be among the first 300 manufacturers to join and get 6 months free access to our full {plan} plan - a $1,794 value.",
      plan: "Growth",
      freeFor: "for 6 months",
      saveBadge: "Save $1,794",
      noCardRequired: "No credit card required",
      description: "Get full {plan} plan features free for 6 months. After the trial, continue with any paid plan to keep your account active.",
      spotsRemaining: "Spots remaining:",
      button: "Apply as Founding Member",
      note: "Subject to admin review and approval",
      badge2: "First 300 Only",
      cardTitle: "Founding Manufacturer",
      cardSubtitle: "Early Supplier Program",
      cardFeatures: {
        companyProfile: "Company profile",
        products100: "Up to 100 products",
        internalMessaging: "Internal messaging",
        inquiryAndRfq: "Inquiry inbox & RFQ reception",
        catalogUpload: "Catalog upload",
        certificationsAndMarkets: "Certifications & Export markets",
        advancedAnalytics: "Advanced analytics",
        prioritySearch: "Priority search visibility",
        featuredBadge: "Featured supplier badge",
        teamUsers3: "Multiple team users (3)"
      }
    },
    features: {
      companyProfile: "Company profile",
      products25: "Up to 25 products",
      products100: "Up to 100 products",
      productsUnlimited: "Unlimited products",
      internalMessaging: "Internal messaging",
      inquiryInbox: "Inquiry inbox",
      rfqReception: "RFQ reception",
      catalogUpload: "Catalog upload",
      certificationsSection: "Certifications section",
      exportMarketsSection: "Export markets section",
      basicAnalytics: "Basic analytics",
      advancedAnalytics: "Advanced analytics",
      enterpriseAnalytics: "Enterprise analytics",
      prioritySearchVisibility: "Priority search visibility",
      premiumSearchPlacement: "Premium search placement",
      featuredSupplierBadge: "Featured supplier badge",
      multipleTeamUsers: "Multiple team users",
      multipleTeamUsers3: "Multiple team users (3)",
      unlimitedTeamUsers: "Unlimited team users",
      premiumSupport: "Premium support",
      dedicatedAccountManager: "Dedicated account manager",
      prioritySupport: "Priority support",
      customOnboarding: "Custom onboarding"
    },
    paidPlans: {
      title: "Paid Plans",
      subtitle: "For manufacturers ready to maximize their visibility and reach",
      monthly: "Monthly",
      yearly: "Yearly",
      savePercentage: "Save 17%",
      starter: {
        name: "Starter",
        description: "For small manufacturers starting their export journey",
        monthlyPrice: 149,
        yearlyPrice: 1490,
        cta: "Get Started"
      },
      growth: {
        name: "Growth",
        description: "For established manufacturers seeking more exposure",
        monthlyPrice: 299,
        yearlyPrice: 2990,
        cta: "Get Started",
        badge: "Most Popular"
      },
      enterprise: {
        name: "Enterprise",
        description: "For large manufacturers with custom requirements",
        price: "Custom",
        cta: "Contact Sales"
      },
      billedAnnually: "Billed annually (${price}/month)",
      pricePerCycle: "{cycle}"
    },
    approval: {
      title: "Approval Required",
      description: "Payment does not automatically publish your profile. All manufacturer accounts go through a review process before becoming visible to buyers. This ensures quality and trust on the platform."
    },
    comparison: {
      title: "Compare All Features",
      subtitle: "See exactly what's included in each plan",
      feature: "Feature",
      productsLimit: "Products limit",
      teamMembers: "Team members",
      searchVisibility: "Search visibility",
      analytics: "Analytics",
      featuredBadge: "Featured badge",
      accountManager: "Account manager",
      supportLevel: "Support level",
      standard: "Standard",
      priority: "Priority",
      premium: "Premium",
      basic: "Basic",
      advanced: "Advanced",
      enterpriseLevel: "Enterprise",
      email: "Email",
      priorityEmail: "Priority email",
      dedicated: "Dedicated",
      unlimited: "Unlimited",
      notIncluded: "Not included"
    },
    faq: {
      title: "Pricing FAQ",
      q1: "Does payment automatically publish my profile?",
      a1: "No. Payment creates your manufacturer account, but your profile must still go through our review and approval process before it becomes visible to buyers. This typically takes 2-5 business days after you submit your complete profile.",
      q2: "What happens if my profile is not approved?",
      a2: "If your profile doesn't meet our requirements, we'll provide specific feedback on what needs to be updated. You can make the necessary changes and resubmit. If approval is ultimately not possible, we offer a full refund within 30 days.",
      q3: "Can I upgrade or downgrade my plan?",
      a3: "Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate applies at your next billing cycle.",
      q4: "What is the Founding Manufacturer program?",
      a4: "The Founding Manufacturer program is a limited offer for the first 300 manufacturers who join SourceNest. As a founding member, you get 6 months of free access to our full Growth plan ($299/month value) - including up to 100 products, advanced analytics, priority search visibility, featured supplier badge, and multiple team users. No credit card required to start.",
      q5: "What happens after my 6-month free period ends?",
      a5: "After your 6-month free period ends, you'll need to choose and pay for one of our plans (Starter, Growth, or Enterprise) to continue using the platform. We'll send you reminders before your free period expires so you have plenty of time to choose the right plan for your business.",
      q6: "Is the Founding Manufacturer program still available?",
      a6: "The program is available until we reach 300 approved manufacturer registrations (pending applications don't count toward the limit). You can see the remaining spots on our pricing page. Once all spots are filled, the program will close and new manufacturers will need to choose a paid plan.",
      q7: "Are there any commission fees on sales?",
      a7: "No. SourceNest does not take any commission on deals you close through the platform. Your subscription fee is your only cost.",
      q8: "What payment methods do you accept?",
      a8: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Enterprise plans, we also offer bank transfer options."
    },
    cta: {
      title: "Ready to Get Started?",
      subtitle: "Join SourceNest and start reaching global buyers today.",
      createAccount: "Create Account",
      talkToSales: "Talk to Sales"
    },
    payment: {
      title: "Complete Your Payment",
      plan: "Plan",
      success: "Payment Successful!",
      transactionId: "Transaction ID:",
      redirecting: "Redirecting to sign up...",
      failed: "Payment Failed",
      tryAgain: "Try Again",
      priceInfo: "{plan} Plan ({cycle})",
      processingTime: "💡 This typically takes 2-5 business days."
    }
  },

  // ── Verification / Review Process Page ──────────────────────────────
  verification: {
    hero: {
      badge: "Trust & Quality",
      title: "Our Review Process",
      description: "Suppliers on SourceNest go through a review process based on submitted information. This process is intended to improve transparency and does not constitute verification or guarantee of any kind."
    },
    whyMatters: {
      title: "Why Our Review Process Matters",
      intro: "In the world of B2B sourcing, trust is essential. Buyers need confidence when connecting with suppliers. Traditional platforms often allow anyone to list, which can make it harder to evaluate options and requires more effort from buyers.",
      approach: "SourceNest takes a different approach. We aim to review manufacturer profiles and submitted information to help improve transparency and support better decision-making before suppliers appear on the platform.",
      benefits: "Benefits of Our Process",
      benefit1: "Buyers can access supplier information with greater clarity",
      benefit2: "Manufacturers benefit from being part of a quality-focused marketplace",
      benefit3: "The platform encourages higher standards",
      benefit4: "The process helps simplify supplier discovery"
    },
    steps: {
      title: "How We Review Suppliers",
      subtitle: "Our multi-step review process ensures comprehensive screening based on submitted information",
      documentReview: {
        title: "Document Review",
        description: "We review company information and available documents to support transparency and build trust.",
        item1: "Business registration certificate",
        item2: "Export/import licenses (when applicable)",
        item3: "Industry certifications (ISO, CE, FDA, etc.)",
        item4: "Tax registration documents (when applicable)"
      },
      factoryReview: {
        title: "Factory Information Review",
        description: "We review basic factory information and production capabilities.",
        item1: "Factory location information",
        item2: "Production capabilities",
        item3: "Equipment and machinery",
        item4: "Facility size and workforce"
      },
      profileReview: {
        title: "Profile Review",
        description: "We review profile content for quality and accuracy.",
        item1: "Company description reviewed",
        item2: "Product information quality assessed",
        item3: "Image and media reviewed",
        item4: "Contact information checked"
      },
      monitoring: {
        title: "Ongoing Monitoring",
        description: "We monitor supplier activity and buyer feedback over time.",
        item1: "Response time",
        item2: "Buyer feedback",
        item3: "General performance",
        item4: "Quality checks"
      }
    },
    badges: {
      title: "Trust Badges Explained",
      subtitle: "What our review badges mean for you",
      reviewed: {
        name: "SourceNest Reviewed",
        description: "Supplier has submitted company information and completed a basic review to be listed on the platform."
      },
      featured: {
        name: "Featured Supplier",
        description: "A supplier highlighted based on activity, responsiveness, and buyer feedback."
      },
      exportReady: {
        name: "Export Ready",
        description: "Supplier indicates experience with international shipping."
      }
    },
    rejected: {
      title: "What If My Application is Not Approved?",
      content: "If your manufacturer application cannot be approved based on the information provided, we may share feedback on what can be improved. You can update your details and resubmit your application at any time. Please note that no payment is required during the application process, and payment will only be requested after approval.",
      reasons: "Common reasons for resubmission:",
      reason1: "Incomplete or unclear information",
      reason2: "Missing business details",
      reason3: "Profile content quality issues",
      reason4: "Inconsistent information",
      resubmit: "You can address the issues and resubmit your application. If approval is ultimately not possible."
    },
    cta: {
      title: "Ready to Get Reviewed?",
      subtitle: "Join SourceNest and showcase your factory to buyers worldwide.",
      viewPlans: "View Plans & Get Started",
      readFaq: "Read FAQ"
    }
  },

  // ── Help Center ─────────────────────────────────────────────────────
  help: {
    hero: {
      title: "How Can We Help?",
      subtitle: "Find answers to common questions or contact our support team.",
      searchPlaceholder: "Search for help articles..."
    },
    contactSupport: {
      title: "Still Need Help?",
      subtitle: "Can't find what you're looking for? Our support team is here to help.",
      contactButtonText: "Contact Support",
      faqButtonText: "View FAQ"
    },
    browseCategoryTitle: "Browse by Category",
    viewAllArticles: "View all articles",
    popularArticlesTitle: "Popular Articles",
    backToHelp: "Back to Help Center",
    backToCategory: "Back to {category}",
    wasHelpful: "Was this article helpful?",
    contactSupportCta: "Contact Support",
    categories: {
      buyers: {
        title: "For Buyers",
        description: "Learn how to search, compare, and connect with suppliers",
        articles: {
          searchSuppliers: {
            title: "How to search for suppliers",
            content: "Finding the right manufacturing partner is crucial for your business success. SourceNest provides powerful search and filtering tools to help you discover reviewed suppliers worldwide.",
            steps: [
              "Use the main search bar to enter product names, categories, or keywords",
              "Apply filters to narrow results by country, industry, review level, and MOQ range",
              "Sort results by relevance, rating, or response time",
              "Click on supplier cards to view detailed profiles",
              "Use the 'Save' button to bookmark suppliers for later comparison"
            ]
          },
          compareSave: {
            title: "Comparing and saving suppliers",
            content: "Our comparison tools help you evaluate multiple suppliers side-by-side to make informed decisions.",
            steps: [
              "Click the heart icon on any supplier card to save them",
              "Access saved suppliers from your dashboard",
              "Select up to 4 suppliers to compare",
              "View side-by-side comparison of capabilities, pricing, and certifications",
              "Export comparison reports for team review"
            ]
          },
          sendMessages: {
            title: "Sending messages to factories",
            content: "Direct communication with suppliers is key to successful sourcing. Our messaging system makes it easy to inquire, negotiate, and build relationships.",
            steps: [
              "Visit any supplier profile and click 'Contact Supplier'",
              "Write a clear, detailed message about your requirements",
              "Attach relevant files like specifications or designs",
              "Track all conversations in your Message Center",
              "Enable notifications to respond quickly to supplier replies"
            ]
          },
          requestQuotes: {
            title: "Requesting quotes (RFQs)",
            content: "The Request for Quotation (RFQ) system helps you get competitive quotes from multiple suppliers at once.",
            steps: [
              "Navigate to 'Submit RFQ' from the main menu or dashboard",
              "Fill in product details, specifications, and requirements",
              "Specify quantity, target price, and delivery timeline",
              "Choose to send to specific suppliers or broadcast to relevant manufacturers",
              "Review and compare incoming quotations in your dashboard"
            ]
          },
          manageDashboard: {
            title: "Managing your buyer dashboard",
            content: "Your dashboard is the central hub for all your sourcing activities on SourceNest.",
            steps: [
              "View your active RFQs and their status",
              "Access saved suppliers and recent searches",
              "Manage message conversations with suppliers",
              "Track order history and supplier interactions",
              "Update your profile and notification preferences"
            ]
          },
          createAccount: {
            title: "How to create a buyer account",
            content: "Creating a buyer account on SourceNest is free and gives you access to thousands of reviewed suppliers worldwide.",
            steps: [
              "Click 'Sign Up' or 'Join as Buyer' on the homepage",
              "Enter your email address and create a secure password",
              "Fill in your basic company information",
              "Verify your email address through the confirmation link",
              "Complete your buyer profile to get better supplier recommendations"
            ]
          },
          sendRfq: {
            title: "Sending your first RFQ",
            content: "Learn how to create and send your first Request for Quotation to start getting quotes from manufacturers.",
            steps: [
              "Log in to your buyer account and go to 'Submit RFQ'",
              "Select the product category that best matches your needs",
              "Describe your product requirements in detail",
              "Upload any relevant documents, drawings, or specifications",
              "Set your quantity requirements, target price, and delivery expectations",
              "Review and submit your RFQ to receive quotes from matching suppliers"
            ]
          }
        }
      },
      manufacturers: {
        title: "For Manufacturers",
        description: "Guide to setting up and managing your factory profile",
        articles: {
          gettingStarted: {
            title: "Getting started as a manufacturer",
            content: "Welcome to SourceNest! This guide will help you set up your manufacturer account and start receiving inquiries from global buyers.",
            steps: [
              "Create your account by selecting 'Manufacturer' during signup",
              "Complete your company profile with accurate business information",
              "Upload your product catalog with detailed specifications",
              "Apply for review to build trust with buyers",
              "Optimize your profile to improve visibility in search results"
            ]
          },
          createProfile: {
            title: "Creating your company profile",
            content: "A complete, compelling profile is essential for attracting quality buyers. Here's how to create an effective manufacturer profile.",
            steps: [
              "Add your official company name and registration details",
              "Select your primary industry and product categories",
              "Upload high-quality photos of your factory and products",
              "Write a detailed company description highlighting your strengths",
              "List your certifications, export markets, and production capacity"
            ]
          },
          uploadProducts: {
            title: "Uploading products",
            content: "Showcase your products effectively to attract buyer inquiries.",
            steps: [
              "Go to Dashboard > Products > Add Product",
              "Enter product name, category, and detailed specifications",
              "Upload multiple high-quality product images",
              "Set pricing range, MOQ, and lead time",
              "Add relevant certifications and customization options"
            ]
          },
          manageInquiries: {
            title: "Managing inquiries and RFQs",
            content: "Efficiently handling inquiries is key to converting leads into customers.",
            steps: [
              "Monitor your Inquiries dashboard regularly",
              "Respond to new RFQs within 24 hours for best results",
              "Provide detailed quotations with clear pricing breakdowns",
              "Ask clarifying questions if requirements are unclear",
              "Follow up professionally to build relationships"
            ]
          },
          analytics: {
            title: "Understanding your analytics",
            content: "Use analytics to optimize your presence and improve conversion rates.",
            steps: [
              "Check profile views and visitor demographics",
              "Monitor product inquiry rates and popular items",
              "Track response time and message statistics",
              "Analyze conversion rates from inquiry to quote",
              "Identify trends and adjust your strategy accordingly"
            ]
          },
          profileSetup: {
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
            ]
          }
        }
      },
      billing: {
        title: "Billing & Plans",
        description: "Information about subscriptions, payments, and invoices",
        articles: {
          subscriptionPlans: {
            title: "Understanding subscription plans",
            content: "SourceNest offers flexible subscription plans for manufacturers. Choose the plan that best fits your business needs.",
            steps: [
              "Review all available plans on the Pricing page",
              "Compare features, product limits, and support levels",
              "Starter plan for new manufacturers",
              "Growth plan with advanced analytics and priority support",
              "Enterprise plan with dedicated account management"
            ]
          },
          paymentMethods: {
            title: "Payment methods and billing",
            content: "We accept multiple payment methods to make your subscription easy and convenient.",
            steps: [
              "Choose your payment method during checkout",
              "Credit card, Debit card, or PayPal accepted",
              "Invoices are automatically generated and sent to your email",
              "Update your payment method in your account settings",
              "Cancel or change your plan anytime"
            ]
          },
          invoices: {
            title: "Managing invoices and receipts",
            content: "Access your billing history and download invoices anytime.",
            steps: [
              "Go to Settings > Billing",
              "View your complete invoice history",
              "Download PDF copies of invoices for your records",
              "Print or email invoices to your accounting department",
              "Contact support if you need to dispute any charges"
            ]
          }
        }
      }
    }
  },

  // ── About Page ──────────────────────────────────────────────────────
  about: {
    hero: {
      title: "Making Global Sourcing Work Better",
      subtitle: "SourceNest is on a mission to transform how businesses find and connect with manufacturing partners worldwide."
    },
    story: {
      title: "Our Story",
      p1: "Global sourcing has always been challenging. Buyers struggle to find reliable suppliers, review their legitimacy, and communicate effectively across borders. Manufacturers, especially quality-focused ones, have difficulty standing out among countless options and reaching serious buyers.",
      p2: "SourceNest was born from a simple idea: what if there was a platform that only featured reviewed, approved manufacturers? A place where buyers could know that every supplier had been screened based on submitted information before being listed?",
      p3: "We built SourceNest to be that platform. By requiring admin approval for every manufacturer and keeping the platform free for buyers, we've created an environment where quality prevails and trust is the foundation of every connection.",
      p4: "Today, SourceNest connects thousands of buyers with reviewed manufacturers across 50+ countries, covering 45+ industries. We're proud to be making global trade more accessible, transparent, and efficient."
    },
    stats: {
      countries: "Countries",
      suppliers: "Reviewed Suppliers",
      products: "Products Listed",
      industries: "Industries Covered"
    },
    missionVision: {
      missionTitle: "Our Mission",
      missionDesc: "To make global sourcing more transparent, efficient, and trustworthy by connecting quality-focused buyers with reviewed manufacturers through a premium digital platform.",
      visionTitle: "Our Vision",
      visionDesc: "A world where finding the right manufacturing partner is simple, safe, and successful — regardless of geography, company size, or industry."
    },
    values: {
      title: "Our Values",
      subtitle: "The principles that guide everything we do",
      trust: {
        title: "Trust & Transparency",
        description: "We believe sourcing should be built on trust. Every supplier is reviewed based on submitted information, and we strive to maintain platform quality."
      },
      global: {
        title: "Global Accessibility",
        description: "We're breaking down barriers in international trade, making it easier for businesses of all sizes to connect across borders."
      },
      community: {
        title: "Community First",
        description: "We're building more than a platform — we're creating a community of quality-focused buyers and manufacturers."
      },
      innovation: {
        title: "Innovation",
        description: "We continuously improve our platform with smart features that make sourcing more efficient and effective."
      }
    },
    difference: {
      title: "Why SourceNest is Different",
      reviewed: {
        title: "Reviewed-Only Marketplace:",
        description: "Unlike open platforms where anyone can list, every manufacturer on SourceNest goes through our review and approval process based on submitted information. This means buyers know that suppliers have been screened, and manufacturers know they're in good company."
      },
      free: {
        title: "Free for Buyers:",
        description: "We believe buyers should have access to quality sourcing tools without barriers. By making the platform free for buyers, we ensure maximum reach for manufacturers and maximum access for sourcing professionals."
      },
      nocommission: {
        title: "No Commission Model:",
        description: "We don't take a cut of your deals. Manufacturers pay only their subscription fee, and all communication and negotiation happens directly between parties."
      },
      premium: {
        title: "Premium Focus:",
        description: "We're not trying to be the biggest platform — we're trying to be the most trusted. Quality over quantity is our guiding principle."
      }
    },
    cta: {
      title: "Join the SourceNest Community",
      subtitle: "Whether you're sourcing products or manufacturing them, we'd love to have you.",
      buyerButton: "Join as Buyer",
      manufacturerButton: "Join as Manufacturer"
    }
  }
} as const;

export type TranslationKeys = typeof en;
export default en;
