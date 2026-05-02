import type { TranslationKeys } from "./en";

// Keep translations as a constant and cast on export to avoid strict
// literal-type mismatches with `en` while preserving runtime values.
const ar = {
  common: {
    save: "حفظ التغييرات",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    view: "عرض",
    manage: "إدارة",
    close: "إغلاق",
    search: "بحث",
    loading: "جارٍ التحميل…",
    noResults: "لم يتم العثور على نتائج",
    confirm: "تأكيد",
    back: "رجوع",
    next: "التالي",
    yes: "نعم",
    no: "لا",
    ok: "موافق",
    error: "خطأ",
    success: "نجاح",
    warning: "تحذير",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
  },
  auth: {
    // Common
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    signUp: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgotPassword: "هل نسيت كلمة المرور؟",
    rememberMe: "تذكرني",
    noAccount: "ليس لديك حساب؟",
    hasAccount: "لديك حساب بالفعل؟",
    orContinueWith: "أو تابع باستخدام",
    
    // Sign In page
    welcomeBack: "مرحبا بعودتك",
    signInToYourAccount: "سجل الدخول إلى حسابك للمتابعة",
    buyer: "مشتري",
    manufacturer: "مصنع",
    admin: "المسؤول",
    buyerDescription: "قم بالوصول إلى لوحة تحكم المشتري لإدارة الطلبات والرسائل والموردين المحفوظة.",
    manufacturerDescription: "قم بالوصول إلى لوحة تحكم المصنع لإدارة المنتجات والاستفسارات وملف الشركة.",
    adminDescription: "قم بالوصول إلى لوحة التحكم لإدارة المستخدمين والموردين وإعدادات المنصة.",
    signInAs: "سجل الدخول باسم",
    continueWithGoogle: "المتابعة باستخدام Google",
    dontHaveAccount: "ليس لديك حساب؟",
    createAccount: "إنشاء حساب",
    canceledDeletion: "ألغيت طلب الحذف؟",
    restoreAccount: "استعادة الحساب",
    invalidEmailOrPassword: "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
    accountRestored: "تم استعادة الحساب",
    accountRestoredMessage: "يمكنك تسجيل الدخول باستخدام بيانات اعتمادك المعتادة.",
    signingIn: "جارٍ تسجيل الدخول...",
    
    // Sign Up page
    createNewAccount: "إنشاء حسابك",
    joinOurPlatform: "انضم إلى منصتنا لبدء البيع أو العثور على موردين",
    selectYourRole: "اختر دورك",
    buyerRole: "مشتري",
    buyerRoleDesc: "البحث عن الموردين والمنتجات",
    manufacturerRole: "مصنع",
    manufacturerRoleDesc: "توريد المنتجات للمشترين",
    continueButton: "المتابعة",
    
    // Sign Up - Details form
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    company: "اسم الشركة",
    country: "الدولة",
    confirmPassword: "تأكيد كلمة المرور",
    agreeToTerms: "أوافق على شروط الخدمة وسياسة الخصوصية",
    
    // Manufacturer specific
    city: "المدينة",
    businessLicense: "الترخيص التجاري",
    website: "الموقع الإلكتروني",
    factoryPhotos: "صور المصنع",
    additionalNotes: "ملاحظات إضافية",
    uploadBizLicense: "تحميل الترخيص التجاري",
    uploadFactoryPhotos: "تحميل صور المصنع (بحد أقصى 5)",
    uploadDesc: "اسحب الملفات أو انقر لاختيار الملفات",
    max5Photos: "بحد أقصى 5 صور",
    remove: "إزالة",
    
    // Social signup
    needsProfileCompletion: "أكمل ملفك الشخصي",
    profileAlmostReady: "ملفك الشخصي جاهز تقريبا",
    continueProfileSetup: "متابعة إعداد ملفك الشخصي",
    
    // Errors
    googleLoginFailed: "فشل تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.",
    errorOccurred: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    accountCreated: "تم إنشاء حسابك",
    reviewPlans: "راجع الخطط القادمة، أو انتقل مباشرة إلى لوحة التحكم الخاصة بك.",
    verifyEmail: "يرجى التحقق من بريدك الإلكتروني قبل المتابعة.",
    
    // Restore Account
    restoreTitle: "استعادة حسابك",
    restoreSubtitleStep1: "إذا طلبت حذف حسابك، فسجل الدخول هنا لإلغاء الطلب. سنرسل لك رمز التحقق عبر البريد الإلكتروني.",
    restoreSubtitleStep2: "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني.",
    restoreSendingCode: "جارٍ إرسال الرمز…",
    restoreContinue: "متابعة",
    restoreVerificationCode: "رمز التحقق",
    restoreEnterCode: "أدخل الرمز من البريد الإلكتروني",
    restoreVerifying: "جارٍ التحقق…",
    restoreVerifyButton: "تحقق واستعيد حسابك",
    restoreDifferentEmail: "استخدم بريداً إلكترونياً آخر",
    
    // Forgot Password
    forgotTitle: "هل نسيت كلمة المرور؟",
    resetTitle: "إعادة تعيين كلمة المرور",
    forgotSubtitle: "لا تقلق، سنرسل لك تعليمات إعادة التعيين.",
    resetSubtitle: "أدخل رمز OTP وكلمة المرور الجديدة لإكمال إعادة التعيين.",
    forgotSending: "جارٍ الإرسال...",
    forgotSendCode: "إرسال رمز إعادة التعيين",
    resetPasswordComplete: "تمت إعادة تعيين كلمة المرور بنجاح",
    resetOtpLabel: "رمز OTP",
    resetOtpPlaceholder: "أدخل رمز OTP",
    resetNewPassword: "كلمة المرور الجديدة",
    resetConfirmPassword: "تأكيد كلمة المرور",
    resetResetting: "جارٍ إعادة التعيين...",
    resetButton: "إعادة تعيين كلمة المرور",
    resetDifferentEmail: "استخدم بريداً إلكترونياً آخر",
    rememberPassword: "هل تتذكر كلمة المرور؟",
    passwordMismatch: "لا تتطابق تأكيدات كلمة المرور.",
    emailMissing: "البريد الإلكتروني مفقود. يرجى طلب رمز إعادة تعيين مرة أخرى.",
  },

  // ── Auth Layout ──────────────────────────────────────────────────────
  authLayout: {
    connectManufacturers: "تواصل مع الشركات المصنعة المراجعة عالميا",
    joinBusinesses: "انضم إلى آلاف الشركات التي تجد شركاء تصنيع موثوقين من خلال شبكتنا المنسقة.",
    reviewedManufacturers: "شركات مصنعة مراجعة",
    countries: "دول",
    productCategories: "فئات المنتجات",
    clientSatisfaction: "رضا العملاء",
    allSuppliersReviewed: "تم مراجعة وتدقيق جميع الموردين",
    globalNetwork: "شبكة عالمية تغطي أكثر من 120 دولة",
    secureMessaging: "المراسلة الآمنة والمعاملات",
    realtimeRFQ: "مطابقة RFQ في الوقت الفعلي",
    copyright: "SourceNest. جميع الحقوق محفوظة.",
  },

  nav: {
    dashboard: "لوحة التحكم",
    users: "المستخدمون",
    suppliers: "الموردون",
    products: "المنتجات",
    industries: "الصناعات",
    reviews: "التقييمات",
    rfqs: "طلبات الأسعار",
    messages: "الرسائل",
    reports: "التقارير",
    pricing: "التسعير",
    promotions: "العروض",
    subscriptions: "الاشتراكات",
    insights: "الرؤى",
    analytics: "التحليلات",
    contact: "صفحة التواصل",
    faq: "إدارة الأسئلة الشائعة",
    siteSettings: "إعدادات الموقع",
    settings: "الإعدادات",
    viewSite: "عرض الموقع",
    quickFilters: "فلاتر سريعة",
    createManufacturer: "إنشاء مصنّع",
    mfgRegistrations: "تسجيلات المصنّعين",
    
    // Header navigation
    headerDiscover: "اكتشف",
    headerPlatform: "المنصة",
    headerResources: "الموارد",
    headerInsights: "الرؤى",
    
    // Discover items
    browseIndustries: "تصفح الصناعات",
    browseIndustriesDesc: "ابحث عن الموردين حسب قطاع الصناعة والتخصص",
    browseSuppliers: "تصفح الموردين",
    browseSuppliersDesc: "اكتشف الشركات المصنعة المراجعة من جميع أنحاء العالم",
    browseProducts: "تصفح المنتجات",
    browseProductsDesc: "استكشف المنتجات عبر جميع الفئات والصناعات",
    featuredManufacturers: "المصنعون المميزون",
    featuredManufacturersDesc: "أفضل الشركات المصنعة المراجعة على المنصة",
    globalSupplierMap: "خريطة الموردين العالمية",
    globalSupplierMapDesc: "استكشف الموردين حسب البلد والمنطقة",
    compareSuppliers: "مقارنة الموردين",
    compareSuppliersDesc: "قارن الشركات المصنعة جنباً إلى جنب",
    newSuppliers: "موردون جدد",
    newSuppliersDesc: "الشركات المصنعة التي انضمت مؤخراً إلى SourceNest",
    
    // Platform items
    forBuyers: "للمشترين",
    forBuyersDesc: "ابحث وقارن واتصل بالموردين مجاناً",
    forManufacturers: "للمصنعين",
    forManufacturersDesc: "اعرض مصنعك واصل إلى المشترين العالميين",
    
    // Resource items
    review: "المراجعة",
    reviewDesc: "تعرف على كيفية مراجعة والموافقة على الموردين",
    helpCenter: "مركز المساعدة",
    helpCenterDesc: "ابحث عن إجابات الأسئلة الشائعة",
    aboutUs: "معلومات عنا",
    aboutUsDesc: "تعرف أكثر عن SourceNest",
    
    // Header favorites dropdown
    savedTabSuppliers: "الموردون",
    savedTabProducts: "المنتجات",
    noSavedSuppliers: "لا توجد موردون محفوظون حتى الآن",
    saveSupplierHint: "انقر على رمز القلب على أي مورد لحفظه",
    browseSuppliersCTA: "تصفح الموردين",
    viewAllSavedSuppliers: "عرض جميع الموردين المحفوظين",
    noSavedProducts: "لا توجد منتجات محفوظة حتى الآن",
    saveProductHint: "انقر على رمز القلب على أي منتج لحفظه",
    browseProductsCTA: "تصفح المنتجات",
    viewAllSavedProducts: "عرض جميع المنتجات المحفوظة",
    moreSuppliersCount: "موردون آخرون",
    moreProductsCount: "منتجات أخرى",
    
    // Auth menu dropdown
    userMenuDashboard: "لوحة التحكم",
    userMenuSettings: "الإعدادات",
    userMenuSignOut: "تسجيل الخروج",
    userMenuSignIn: "تسجيل الدخول",
    userMenuGetStarted: "ابدأ الآن",
    
    // Admin sidebar menu
    adminDashboard: "لوحة التحكم",
    adminUsers: "المستخدمون",
    adminCreateManufacturer: "إنشاء مصنع",
    adminMfgRegistrations: "تسجيلات المصانع",
    adminSuppliers: "الموردون",
    adminProducts: "المنتجات",
    adminIndustries: "الصناعات",
    adminQuickFilters: "المرشحات السريعة",
    adminReviews: "التقييمات",
    adminRFQs: "طلبات العروض",
    adminMessages: "الرسائل",
    adminReports: "التقارير",
    adminPricing: "التسعير",
    adminPromotions: "العروض الترويجية",
    adminSubscriptions: "الاشتراكات",
    adminInsights: "الرؤى",
    adminAnalytics: "التحليلات",
    adminContactPage: "صفحة التواصل",
    adminFAQManagement: "إدارة الأسئلة الشائعة",
    adminSiteSettings: "إعدادات الموقع",
    adminSettings: "الإعدادات",
    adminViewSite: "عرض الموقع",    adminSignOut: "تسجيل الخروج",  },
  settings: {
    title: "الإعدادات",
    subtitle: "إدارة حسابك وتفضيلاتك",
    adminSubtitle: "إعدادات وتفضيلات المنصة",
    accountDetails: "تفاصيل الحساب",
    accountDetailsDesc: "إدارة معلوماتك الشخصية",
    accountCredentialsDesc: "إدارة بيانات تسجيل الدخول ومعلومات الاتصال",
    firstName: "الاسم الأول",
    lastName: "الاسم الأخير",
    emailAddress: "البريد الإلكتروني",
    companyName: "اسم الشركة",
    phoneNumber: "رقم الهاتف",
    changePassword: "تغيير كلمة المرور",
    generalSettings: "الإعدادات العامة",
    generalSettingsDesc: "الإعدادات الأساسية للمنصة",
    platformName: "اسم المنصة",
    supportEmail: "بريد الدعم",
    contactPhone: "هاتف التواصل",
    security: "الأمان",
    securityDesc: "إدارة إعدادات أمان حسابك",
    securitySettings: "إعدادات الأمان",
    securitySettingsDesc: "إعدادات أمان المنصة",
    requireEmailVerification: "التحقق من البريد الإلكتروني مطلوب",
    requireEmailVerificationDesc: "يجب على المستخدمين التحقق من بريدهم الإلكتروني قبل الوصول",
    manualSupplierApproval: "الموافقة اليدوية على الموردين",
    manualSupplierApprovalDesc: "يتطلب موافقة المسؤول على الموردين الجدد",
    rateLimiting: "تحديد معدل الطلبات",
    rateLimitingDesc: "تحديد طلبات API لكل مستخدم",
    loginHistory: "سجل تسجيل الدخول",
    loginHistoryDesc: "عرض نشاط تسجيل الدخول الأخير",
    connectedDevices: "الأجهزة المتصلة",
    connectedDevicesDesc: "إدارة الجلسات النشطة",
    notifications: "تفضيلات الإشعارات",
    notificationsDesc: "اختر كيف ومتى تريد أن يتم إشعارك",
    adminNotifications: "إعدادات الإشعارات",
    adminNotificationsDesc: "تفضيلات إشعارات المسؤول",
    newQuoteResponses: "ردود الأسعار الجديدة",
    newQuoteResponsesDesc: "اشعار عندما يرد الموردون على طلبات الأسعار",
    newMessages: "رسائل جديدة",
    newMessagesDesc: "اشعار عند وصول رسائل جديدة من الموردين",
    newMessagesBuyerDesc: "اشعار عند وصول رسائل جديدة من الموردين",
    newMessagesMfgDesc: "اشعار عند وصول رسائل جديدة من المشترين",
    supplierUpdates: "تحديثات الموردين",
    supplierUpdatesDesc: "اشعار عندما يضيف الموردون المحفوظون منتجات جديدة",
    weeklyDigest: "ملخص أسبوعي",
    weeklyDigestDesc: "ملخص أسبوعي بالموردين الجدد في مجالات اهتمامك",
    weeklyPerformanceDigest: "ملخص الأداء الأسبوعي",
    weeklyPerformanceDigestDesc: "ملخص تحليلي أسبوعي",
    marketingPromotions: "التسويق والعروض",
    marketingPromotionsDesc: "نصائح وعروض خاصة",
    marketingPromotionsMfgDesc: "نصائح وعروض ترويجية",
    dailySummary: "ملخص يومي",
    dailySummaryDesc: "ملخص يومي للمنصة",
    newInquiryAlerts: "تنبيهات الاستفسارات الجديدة",
    newInquiryAlertsDesc: "اشعار عندما يرسل المشترون استفسارات",
    quoteRequests: "طلبات الأسعار",
    quoteRequestsDesc: "اشعار عند استلام طلبات الأسعار",
    newSupplierRegistrations: "تسجيلات موردين جدد",
    newSupplierRegistrationsDesc: "اشعار عند تسجيل موردين جدد",
    reportedContent: "محتوى مُبلغ عنه",
    reportedContentDesc: "اشعار بالمحتوى المُبلغ عنه",
    languageRegion: "اللغة والمنطقة",
    languageRegionDesc: "تعيين اللغة والمنطقة الزمنية المفضلة",
    language: "اللغة",
    timezone: "المنطقة الزمنية",
    currencyDisplay: "عرض العملة",
    localization: "التوطين",
    localizationDesc: "إعدادات اللغة والمنطقة",
    defaultLanguage: "اللغة الافتراضية",
    defaultCurrency: "العملة الافتراضية",
    defaultTimezone: "المنطقة الزمنية الافتراضية",
    emailSettings: "إعدادات البريد الإلكتروني",
    emailSettingsDesc: "إعدادات تسليم البريد الإلكتروني",
    fromName: "اسم المرسل",
    fromEmail: "بريد المرسل",
    testEmailDelivery: "اختبار إرسال البريد",
    primaryEmail: "البريد الرئيسي",
    notificationEmail: "بريد الإشعارات",
    addEmail: "إضافة بريد",
    database: "قاعدة البيانات",
    databaseDesc: "صيانة قاعدة البيانات والنسخ الاحتياطي",
    lastBackup: "آخر نسخة احتياطية",
    createBackup: "إنشاء نسخة احتياطية",
    exportData: "تصدير البيانات",
    subscription: "الاشتراك",
    nextBillingDate: "تاريخ الفاتورة التالية",
    upgradePlan: "ترقية الخطة",
    cancelSubscription: "إلغاء الاشتراك",
    dangerZone: "منطقة الخطر",
    deactivateAccount: "تعطيل الحساب",
    deleteAccount: "حذف الحساب",
  },
  faq: {
    title: "إدارة الأسئلة الشائعة",
    subtitle: "إدارة الأسئلة المتكررة المعروضة في صفحة الأسئلة الشائعة",
    totalCategories: "إجمالي الفئات",
    totalQuestions: "إجمالي الأسئلة",
    avgPerCategory: "المتوسط لكل فئة",
    categories: "فئات الأسئلة الشائعة",
    categoriesDesc: "نظّم أسئلتك الشائعة حسب الفئة. اسحب لإعادة الترتيب أو استخدم أزرار الأسهم.",
    addCategory: "إضافة فئة",
    editCategory: "تعديل الفئة",
    addQuestion: "إضافة سؤال",
    editQuestion: "تعديل السؤال",
    categoryTitle: "عنوان الفئة",
    question: "السؤال",
    answer: "الإجابة",
    noCategories: "لا توجد فئات أسئلة شائعة بعد",
    addFirstCategory: "أضف فئتك الأولى",
    noQuestions: "لا توجد أسئلة في هذه الفئة",
    deleteConfirmCategory: "سيؤدي هذا إلى حذف الفئة وجميع الأسئلة الموجودة فيها. لا يمكن التراجع عن هذا الإجراء.",
    deleteConfirmFaq: "سيؤدي هذا إلى حذف هذا السؤال نهائياً. لا يمكن التراجع عن هذا الإجراء.",
    createCategoryDesc: "إنشاء فئة جديدة لتنظيم أسئلتك",
    updateCategoryDesc: "تحديث اسم الفئة",
    createFaqDesc: "إضافة سؤال جديد لهذه الفئة",
    updateFaqDesc: "تحديث السؤال والإجابة",
    questionPlaceholder: "مثال: كيف أعيد تعيين كلمة المرور؟",
    answerPlaceholder: "قدّم إجابة واضحة ومفيدة...",
    categoryPlaceholder: "مثال: عام، للمشترين، الفواتير",
  },
  landing: {
    hero: {
      badge: "ربط التجارة العالمية",
      title1: "اكتشف المصنعين",
      title2: "الموثوقين حول العالم",
      subtitle: "ابحث عن المنتجات، وقارن بين الموردين، واطلب عروض الأسعار، وتواصل مباشرة مع المصانع الموثوقة من خلال منصة مصادر عالمية متميزة.",
      searchPlaceholder: "ابحث عن المنتجات، الموردين، أو الصناعات...",
      searchButton: "بحث",
      popular: "شائع:",
      popElectronics: "إلكترونيات",
      popTextiles: "منسوجات",
      popMachinery: "آلات",
      popFood: "أغذية ومشروبات",
      statCountries: "الدول المغطاة",
      statReviewed: "الموردين المراجعين",
      statDirect: "تواصل مع المصانع",
      statDirectPrefix: "مباشر"
    },
    whatIs: {
      title: "ما هي SourceNest؟",
      desc: "منصة SourceNest هي سوق رقمي عالمي متميز حيث يكتشف المستوردون والمشترون والمحترفون المصنعين والمصانع الموثوقة من جميع أنحاء العالم. تعرض المصانع منتجاتها وقدراتها وشهاداتها، بينما يبحث المشترون ويقارنون ويتواصلون مباشرة — كل ذلك في منصة واحدة موثوقة.",
      forBuyers: "للمشترين والمستوردين",
      forBuyersDesc: "اكتشف المصنعين الموثوقين، وقارن بين الموردين جنباً إلى جنب، واحفظ المفضلات، وأرسل طلبات عروض الأسعار، وتواصل مباشرة مع المصانع. كل سير عمل المصادر الخاص بك في مكان واحد - مجاناً تماماً.",
      buyerPoint1: "ابحث في آلاف الموردين الموثوقين",
      buyerPoint2: "قارن بين المصانع والقدرات",
      buyerPoint3: "اطلب عروض أسعار وراسل مباشرة",
      buyerPoint4: "الوصول إلى كتالوجات ومواصفات المنتجات",
      buyerLink: "اكتشف المزيد للمشترين",
      forMfg: "للمصنعين والمصانع",
      forMfgDesc: "قم بإنشاء جناحك الرقمي، وارفع منتجاتك، واعرض شهاداتك، ودع المشترين من جميع أنحاء العالم يكتشفونك. استقبل الاستفسارات وطلبات الأسعار مباشرة في لوحة التحكم الخاصة بك. انضم من خلال خطط اشتراك ميسورة التكلفة.",
      mfgPoint1: "بناء ملف تعريفي احترافي للشركة",
      mfgPoint2: "رفع كتالوجات منتجات غير محدودة",
      mfgPoint3: "استقبال وإدارة طلبات عروض الأسعار",
      mfgPoint4: "احصل على رؤية وتعرض عالمي",
      mfgLink: "اكتشف المزيد للمصنعين"
    },
    howItWorks: {
      title: "كيف يعمل",
      subtitle: "عمليات بسيطة وشفافة لكل من المشترين والمصنعين",
      tabBuyers: "للمشترين",
      tabMfg: "للمصنعين",
      buyerStep1Title: "البحث والاكتشاف",
      buyerStep1Desc: "تصفح دليل الموردين العالمي الخاص بنا، وقم بالتصفية حسب الصناعة والموقع والشهادات والقدرات للعثور على شركاء التصنيع المثاليين.",
      buyerStep2Title: "مقارنة الموردين",
      buyerStep2Desc: "احفظ مورديك المفضلين، وقارنهم جنباً إلى جنب، وراجع منتجاتهم وشهاداتهم وقدراتهم لاتخاذ قرارات مستنيرة.",
      buyerStep3Title: "التواصل والاتصال",
      buyerStep3Desc: "أرسل رسائل مباشرة إلى المصانع، واطلب عروض أسعار تفصيلية، وتفاوض على الشروط — كل ذلك داخل نظام المراسلة الآمن للمنصة.",
      buyerStep4Title: "طلب عروض الأسعار",
      buyerStep4Desc: "أرسل طلبات عروض أسعار تفصيلية بالمواصفات والكميات والمتطلبات. احصل على عروض أسعار تنافسية مباشرة من المصنعين المراجعين.",
      buyerFree: "يستخدم المشترون SourceNest مجانًا تمامًا — لا حاجة للاشتراك.",
      mfgStep1Title: "إنشاء حسابك",
      mfgStep1Desc: "اشترك كشركة مصنعة واختر خطة الاشتراك التي تناسب احتياجات عملك وأهداف نموك.",
      mfgStep2Title: "إتمام الدفع",
      mfgStep2Desc: "بمجرد التحقق من حسابك والموافقة عليه، أتمم دفعتك لتفعيل حسابك والبدء باستخدام المنصة.",
      mfgStep3Title: "بناء ملفك الشخصي",
      mfgStep3Desc: "أكمل ملف المصنع الخاص بك بالتفاصيل والشهادات والقدرات، وقم بتحميل كتالوج منتجاتك والكتيبات.",
      mfgStep4Title: "تحميل المنتجات",
      mfgStep4Desc: "أضف منتجاتك بالصور والمواصفات والحد الأدنى لكمية الطلب وأوقات التنفيذ وتفاصيل التعبئة لِعَرْض مجموعتك الكاملة.",
      mfgStep5Title: "تقديم للموافقة",
      mfgStep5Desc: "بمجرد أن يصبح جاهزاً، أرسل حسابك للتحقق. سيقوم فريقنا بمراجعة عملك قبل منح الوصول إلى المنصة.",
      mfgStep6Title: "انطلق للعالمية",
      mfgStep6Desc: "بعد الموافقة، يصبح ملفك الشخصي نشطاً. ابدأ في تلقي الاستفسارات وطلبات عروض الأسعار من المشترين حول العالم.",
      mfgApproval: "تتطلب جميع حسابات الشركات المصنعة موافقة الإدارة قبل تفعيلها — لضمان الجودة والثقة للمشترين.",
      important: "مهم: لا يتطلب أي دفع مقدم. سيتم مراجعة حسابك أولاً، وسيكون مسؤولاً عن الرسوم فقط بعد الموافقة.",
      paymentComplete: "بعد الموافقة، أكمل الدفع لتفعيل حسابك والوصول الكامل إلى المنصة."
    },
    industries: {
      viewAll: "عرض جميع الصناعات",
      explorerMap: "استكشاف الخريطة العالمية",
      electronicsElectrical: "الإلكترونيات والكهرباء",
      machineryEquipment: "الآلات والمعدات",
      textilesApparel: "المنسوجات والملابس",
      homeGarden: "المنزل والحديقة",
      healthBeauty: "الصحة والجمال",      // Industries page
      pageTitle: "استكشف الصناعات",
      pageDescription: "اكتشف الشركات المصنعة والموردين المراجعين عبر جميع الصناعات الرئيسية. من الإلكترونيات إلى النسيج، ابحث عن الشريك المثالي لعملك.",
      majorIndustriesBadge: "الصناعات الرئيسية",
      categoriesLabel: "الفئات",
      suppliersLabel: "الموردون",
      productsLabel: "المنتجات",
      featuredBadge: "مميز",
      exploreButton: "استكشاف",
      suppliersButton: "الموردون",
      moreCategories: "+ {count} المزيد",
      cantFindTitle: "لا تجد صناعتك؟",
      cantFindDesc: "نحن نوسع شبكتنا باستمرار. تواصل معنا لمعرفة المزيد عن الصناعات القادمة.",
      contactUsButton: "اتصل بنا",    },
    suppliers: {
      pageTitle: "ابحث عن موردين مراجعين",
      pageDescription: "تصفح الشركات المصنعة المراجعة من جميع أنحاء العالم",
      pageSubtitle: "{count}+ الشركات المصنعة المراجعة من جميع أنحاء العالم",
      searchPlaceholder: "ابحث عن موردين أو منتجات أو فئات...",
      filters: "التصفية",
      clearAll: "مسح الكل",
      industryLabel: "الصناعة",
      allIndustries: "جميع الصناعات",
      countryLabel: "الدولة",
      allCountries: "جميع الدول العالمية",
      popular: "موضوعة",
      certificationLabel: "الترخيص",
      anyCertification: "أي ترخيص",
      minimumOrderLabel: "الحد الأدنى للطلب",
      anyMOQ: "أي حد أدنى",
      exportMarketLabel: "سوق التصدير",
      anyRegion: "أي منطقة",
      reviewedSuppliersOnly: "الموردون المراجعون فقط",
      suppliersFound: "وجدان موردون",
      sortBy: "ترتيب حسب",
      relevance: "الصلة",
      highestRating: "أعلى تقييم",
      fastestResponse: "أسرع رد",
      mostProducts: "معظم المنتجات",
      activeFilters: "التصفيات النشطة:",
      search: "بحث:",
      reviewedOnly: "مراجع فقط",
      reviewedBadge: "مراجع",
      productsLabel: "المنتجات",
      moreProducts: "+ {count} المزيد",
      noSuppliersFound: "لم يتم العثور على موردين",
      adjustSearchFilters: "حاول تعديل معايير البحث أو التصفية",
      clearAllFilters: "مسح جميع التصفيات",
      compare: {
        pageTitle: "مقارنة الموردين",
        pageDescription: "قارن ما يصل إلى {max} موردين جنباً إلى جنب",
        breadcrumbHome: "الرئيسية",
        breadcrumbSuppliers: "الموردون",
        breadcrumbCompare: "مقارنة",
        addSupplier: "إضافة مورد للمقارنة",
        maximumSuppliersAdded: "تم إضافة الحد الأقصى من الموردين",
        noSuppliersSelected: "لم يتم تحديد موردين",
        noSuppliersMessage: "حدد الموردين من القائمة المنسدلة أعلاه أو تصفح دليل الموردين الخاص بنا لبدء المقارنة.",
        browseSuppliers: "استعرض الموردين",
        comparing: "مقارنة {count} موردين",
        rating: "التقييم",
        reviews: "تقييمات",
        responseTime: "وقت الاستجابة",
        responseRate: "معدل الاستجابة",
        onTimeDelivery: "التسليم في الموعد المحدد",
        established: "تأسس عام",
        years: "سنوات",
        employees: "الموظفون",
        productCount: "عدد المنتجات",
        minOrderValue: "الحد الأدنى لقيمة الطلب",
        contactForMOQ: "اتصل للحصول على الحد الأدنى للطلب",
        exportMarkets: "أسواق التصدير",
        certifications: "الشهادات",
        contactSupplier: "اتصل بالمورد",
        viewProfile: "عرض الملف الشخصي",
        addMore: "إضافة {count} موردين آخرين للمقارنة",
        selectSupplier: "حدد مورد",
      }
    },
    products: {
      pageTitle: "اكتشف المنتجات",
      pageDescription: "استعرض {productCount}+ منتج من الشركات المصنعة المراجعة في جميع أنحاء العالم",
      searchPlaceholder: "البحث عن المنتجات والفئات...",
      categoryLabel: "الفئة",
      allCategories: "جميع الفئات",
      sortLabel: "ترتيب حسب",
      priceLow: "السعر: من الأقل إلى الأعلى",
      priceHigh: "السعر: من الأعلى إلى الأقل",
      lowestMOQ: "أقل حد أدنى للطلب",
      newestFirst: "الأحدث أولاً",
      mostPopular: "الأكثر شهرة",
      productsFound: "تم العثور على منتج",
      sortDisplay: "الترتيب:",
      verified: "موثق",
      moqLabel: "حد أدنى للطلب:",
      daysLabel: "أيام",
      inquiriesLabel: "استفسارات",
      noProductsFound: "لم يتم العثور على منتجات",
      errorLoadingProducts: "خطأ في تحميل المنتجات",
    },
    suppliersMap: {
      globalNetwork: "الشبكة العالمية",
      pageTitle: "خريطة الموردين العالمية",
      pageDescription: "اكتشف الشركات المصنعة والموردين من جميع أنحاء العالم. ابحث عن الشريك المثالي لاحتياجات المشتريات الخاصة بك.",
      searchPlaceholder: "ابحث عن الدول أو المناطق...",
      reviewedSuppliersLabel: "موردين تم مراجعتهم",
      countriesLabel: "الدول",
      industriesLabel: "الصناعات",
      productsLabel: "المنتجات",
      exploreByRegion: "استكشف حسب المنطقة",
      clickRegionToView: "انقر على منطقة لعرض الموردين من تلك المنطقة",
      suppliers: "موردين",
      worldsManufacturingHub: "مركز التصنيع العالمي",
      qualityPrecisionManufacturing: "تصنيع الجودة والدقة",
      innovationTechnologyLeaders: "قادة الابتكار والتكنولوجيا",
      emergingManufacturingMarkets: "أسواق التصنيع الناشئة",
      highQualityProduction: "الإنتاج عالي الجودة",
      countriesIn: "الدول في {region}",
      countriesAvailable: "دول متاحة",
      viewAllCountries: "عرض جميع {count} الدول",
      topManufacturingCountries: "أفضل دول التصنيع",
      countriesMostReviewedSuppliers: "الدول التي تضم معظم الموردين المراجعين على منصتنا",
      viewAllSuppliers: "عرض جميع الموردين",
      growth: "النمو",
      cantFindTitle: "لا تجد ما تبحث عنه؟",
      cantFindDesc: "قدم طلب عرض أسعار واترك الشركات المصنعة المراجعة تأتي إليك مع عروض تنافسية.",
      submitRFQ: "قدم طلب عرض أسعار",
      browseAllSuppliers: "تصفح جميع الموردين",
    },
    whyUse: {
      buyerTitle: "لماذا يختار المشترون SourceNest",
      buyerSubtitle: "كل ما تحتاجه للعثور على المصنعين المناسبين والتواصل معهم — مجاناً",
      bb1Title: "مجاني للأبد للمشترين",
      bb1Desc: "ابحث وقارن وراسل واطلب عروض الأسعار — كل ذلك مجانًا تمامًا. لا توجد رسوم خفية، ولا يلزم الاشتراك.",
      bb2Title: "الموردين المراجعين فقط",
      bb2Desc: "يتم مراجعة كل مصنع والموافقة عليه من قبل فريقنا بناءً على المعلومات المقدمة قبل ظهوره على المنصة.",
      bb3Title: "وصول عالمي",
      bb3Desc: "الوصول إلى المصانع من أكثر من 50 دولة في جميع مناطق التصنيع الرئيسية حول العالم.",
      bb4Title: "اتصال مباشر",
      bb4Desc: "الدردشة مباشرة مع ممثلي المصنع، لا يوجد وسطاء أو سماسرة.",
      bb5Title: "قارن وقرر",
      bb5Desc: "مقارنة جنباً إلى جنب للموردين مع قدرات وشهادات وأسعار تفصيلية.",
      bb6Title: "توفير الوقت",
      bb6Desc: "عملية طلب عروض أسعار مبسطة، وبريد وارد منظم، والموردين المحفوظين تحافظ على كفاءة سير عملك.",
      mfgTitle: "لماذا ينضم المصنعون",
      mfgSubtitle: "قم بتوسيع نطاق وصولك وتواصل مع المشترين المؤهلين عبر منصة موثوقة",
      mb1Title: "رؤية عالمية",
      mb1Desc: "دع المستوردين والمشترين من جميع أنحاء العالم الذين يبحثون عن منتجاتك يكتشفونك.",
      mb2Title: "مكانة متميزة",
      mb2Desc: "قدم مصنعك بملف تعريف احترافي وكتالوجات منتجات وبيانات اعتماد مقدمة.",
      mb3Title: "عملاء محتملون ذوو جودة",
      mb3Desc: "تلقي الاستفسارات من المشترين الجادين الذين بحثوا بالفعل في قدراتك.",
      whyPayTitle: "لماذا يدفع المصنعون للانضمام؟",
      whyPayDesc: "SourceNest مجاني للمشترين لضمان أقصى وصول للمصنعين. تدفع المصانع اشتراكًا لتمويل تطوير المنصة وعمليات المراجعة والميزات المميزة. يضمن هذا النموذج انضمام المصنعين الجادين والملتزمين فقط - مما يمنح المشترين الثقة في كل مورد يكتشفونه."
    },
    featured: {
      suppliersTitle: "الموردين المراجعين المميزين",
      suppliersSubtitle: "اكتشف المصنعين الأعلى تقييماً الذين تم اختيارهم بعناية من قبل فريقنا",
      viewAllSuppliers: "عرض جميع الموردين",
      productsTitle: "فئات رائجة",
      productsSubtitle: "احصل على المنتجات الأكثر مبيعاً مباشرة من المصنعين المعتمدين",
      industriesBadge: "الصناعات الشائعة",
      industriesTitle: "ابحث عن الموردين حسب الصناعة",
      industriesSubtitle: "اكتشف المصنعين المراجعين عبر قطاعات صناعية رئيسية. تتميز كل فئة بموردين معتمدين مستعدين لتلبية احتياجاتك.",
      suppliersLabel: "موردون",
      exploreButton: "استكشاف",
    },
    trust: {
      title: "مصادر مبنية على الثقة",
      subtitle: "كل اتصال على SourceNest مدعوم بالتزامنا الثابت بالجودة والشفافية",
      t1Title: "قدرات تم التحقق منها",
      t1Desc: "تضمن عملية الفحص الشاملة لدينا أن كل شركة مصنعة حقيقية وقادرة ومستعدة للتسليم.",
      t2Title: "نزاهة المنصة",
      t2Desc: "نحن نعمل بشفافية كاملة. لا توجد هوامش مخفية، ولا رتب مدفوعة - مجرد اتصالات B2B حقيقية.",
      t3Title: "المعايير العالمية",
      t3Desc: "نتحقق من الامتثال لمعايير التصنيع الدولية ومراقبة الجودة.",
      t4Title: "دعم مخصص",
      t4Desc: "خبراء المصادر لدينا متاحون لإرشادك عبر متطلبات التصنيع المعقدة.",
      badge: "الثقة والمراجعة",
      learnMore: "تعرف على عملية المراجعة لدينا",
      reviewedBadge: "SourceNest مراجع",
      point1: "تم تقديم معلومات العمل",
      point2: "تم تقديم تفاصيل المصنع",
      point3: "الشهادات (إن وجدت)",
      point4: "خبرة التصدير (إن وجدت)",
      point5: "تمت مراجعة معلومات الملف الشخصي"
    },
    testimonials: {
      title: "ماذا يقول مجتمعنا",
      subtitle: "انضم إلى آلاف الشركات الناجحة التي تتوسع عالمياً"
    },
    faq: {
      title: "أسئلة مكررة",
      subtitle: "كل ما تحتاج لمعرفته حول استخدام SourceNest",
      moreQuestions: "هل لديك المزيد من الأسئلة؟",
      viewFull: "عرض الأسئلة الشائعة بالكامل"
    },
    cta: {
      buyerTitle: "هل أنت مستعد للعثور على الشركة المصنعة الخاصة بك؟",
      buyerDesc: "انضم إلى آلاف المشترين الذين يستخدمون SourceNest بالفعل لتبسيط مصادرهم العالمية.",
      buyerBtn: "ابدأ التوريد الآن",
      mfgTitle: "هل أنت شركة مصنعة؟",
      mfgDesc: "ضع مصنعك أمام المشترين النشطين في جميع أنحاء العالم.",
      mfgBtn: "انضم كشركة مصنعة"
    },
    footer: {
      slogan: "منصة المصادر العالمية المتميزة التي تربط المشترين بالمصنعين المراجعين في جميع أنحاء العالم.",
      platform: "المنصة",
      forBuyers: "للمشترين",
      forMfg: "للمصنعين",
      pricing: "التسعير",
      search: "البحث",
      discover: "اكتشف",
      browseSuppliers: "تصفح الموردين",
      browseProducts: "تصفح المنتجات",
      industries: "الصناعات",
      rfq: "طلب تسعير",
      resources: "الموارد",
      helpCenter: "مركز المساعدة",
      reviewProcess: "عملية المراجعة",
      faq: "أسئلة مكررة",
      blog: "المدونة والرؤى",
      company: "الشركة",
      aboutUs: "معلومات عنا",
      contact: "اتصل بنا",
      buyerDash: "لوحة تحكم المشتري",
      mfgDash: "لوحة تحكم المصنع",
      legal: "قانوني",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      cookie: "سياسة ملفات تعريف الارتباط",
      popular: "الصناعات الشائعة",
      viewAll: "عرض جميع الصناعات",
      rights: "جميع الحقوق محفوظة."
    },
    forBuyers: {
      hero: {
        badge: "100% مجاني للمشترين",
        title: "المصادر عالميًا، بالكامل مجانًا",
        subtitle: "ابحث عن موردين مراجعين، قارن المصانع، اطلب أسعارًا، وتواصل مباشرة مع الشركات المصنعة — كل ذلك بدون تكلفة. SourceNest مجاني للمشترين إلى الأبد.",
        signupButton: "إنشاء حساب مجاني",
        browseButton: "استعرض الموردين",
      },
      featuresTitle: "كل ما تحتاجه للمصادر بذكاء أكبر",
      featuresSubtitle: "أدوات قوية مصممة لتبسيط سير عمل المصادر بالكامل",
      features: {
        search: {
          title: "ابحث عن الموردين",
          description: "قم بالوصول إلى دليلنا العالمي للشركات المصنعة المراجعة. تصفية حسب الصناعة والموقع والشهادات والحد الأدنى من كميات الطلب والمزيد لعثور على الشركاء المثاليين.",
        },
        compare: {
          title: "مقارنة المصانع",
          description: "أضف الموردين إلى قائمة المقارنة الخاصة بك وقيمهم جنباً إلى جنب. قارن الإمكانيات والشهادات وأوقات التسليم والمزيد.",
        },
        messaging: {
          title: "المراسلة المباشرة",
          description: "تحدث مباشرة مع ممثلي المصنع من خلال منصتنا الآمنة. لا وسطاء، لا سمسرة — فقط اتصال مباشر.",
        },
        rfq: {
          title: "اطلب الأسعار",
          description: "قدم طلبات تسعير مفصلة مع المواصفات والكميات والمتطلبات. احصل على أسعار تنافسية مباشرة من الشركات المصنعة.",
        },
        favorites: {
          title: "حفظ المفضلات",
          description: "احفظ الموردين والمنتجات لديك في المفضلات للوصول السهل. بناء قائمة الموردين المفضلين لديك بمرور الوقت.",
        },
        catalogs: {
          title: "تحميل الفهارس",
          description: "استعرض وحمل فهارس المنتجات وأوراق المواصفات والكتيبات الخاصة بالشركة من الموردين المراجعين.",
        },
        dashboard: {
          title: "لوحة تحكم منظمة",
          description: "إدارة جميع فعاليات المصادر الخاصة بك في مكان واحد. عقب الرسائل وطلبات التسعير والفرايط المحفوظة وتفاعلات الموردين.",
        },
        notifications: {
          title: "الإخطارات الذكية",
          description: "احصل على إخطارات عند رد الموردين على استفساراتك، عندما يطابق الموردين الجدد تفضيلاتك، والمزيد.",
        },
      },
      benefitsTitle: "لماذا يحب المشترون SourceNest",
      benefitsSubtitle: "انضم إلى آلاف متخصصي المشتريات والمستوردين ومديري المصادر الماميين بـ SourceNest لحاجاتك المصادر العالمية الخاصة بهم.",
      benefits: {
        free: "مجاني تماماً للاستخدام — بدون اشتراك، بدون رسوم مخفية",
        reviewed: "فقط الموردين المراجعين والمعتمدين على المنصة",
        directComm: "اتصال مباشر مع ممثلي المصنع",
        comparison: "أدوات مقارنة الموردين جنباً إلى جنب",
        secure: "نظام آمن لطلبات التسعير والمراسلة",
        catalogs: "الوصول إلى فهارس المنتجات والمواصفات",
        dashboard: "لوحة تحكم منظمة لجميع نشاط المصادر",
        global: "وصول عالمي عبر 50+ دول تصنيع",
      },
      benefitBoxTitle: "لماذا هو مجاني للمشترين؟",
      benefitBoxDescription1: "نموذج عملنا بسيط: تدفع الشركات المصنعة اشتراكاً لقوائم على المنصة، بينما يستخدمها المشترون مجاناً. هذا يضمن الحد الأقصى لوصول الموردين مع إعطائك إمكانية الوصول إلى أداة مصادر متميزة بدون تكلفة.",
      benefitBoxDescription2: "من خلال الحفاظ على المنصة مجانية للمشترين، نجذب متخصصي مصادر أكثر جدية — مما يجعل المنصة أكثر قيمة لليسرين. كل ذلك بتور اللغة.",
      ctaTitle: "ابدأ المصادر اليوم",
      ctaSubtitle: "أنشئ حسابك المجاني في ثوان واتصل بالشركات المصنعة المراجعة في جميع أنحاء العالم.",
      ctaButton: "إنشاء حساب مشترٍ مجاني",
    }
  },
  forManufacturers: {
    hero: {
      badge: "تنمية أعمالك التصديرية",
      title: "الوصول إلى مشترين عالميين، نمي مصنعك",
      subtitle: "قم بإنشاء جناحك الرقمي، واعرض منتجاتك، وتواصل مع المستوردين ومحترفي المصادر في جميع أنحاء العالم من خلال منصة SourceNest المتميزة.",
      viewPricing: "عرض خطط التسعير",
      getStarted: "ابدأ الآن"
    },
    features: {
      title: "كل ما تحتاجه للنجاح",
      subtitle: "أدوات قوية لتقديم مصنعك والتواصل مع المشترين المناسبين",
      f1Title: "ملف تعريف شركة احترافي",
      f1Desc: "أنشئ كشكًا رقميًا شاملاً يعرض مصنعك وقدراتك وشهاداتك وقدرتك الإنتاجية.",
      f2Title: "رؤية عالمية",
      f2Desc: "اكتشف من قبل المستوردين ومحترفي المصادر من جميع أنحاء العالم الذين يبحثون بنشاط عن موردين.",
      f3Title: "تواصل مباشر مع المشتري",
      f3Desc: "استقبل الاستفسارات ورد عليها مباشرة من خلال منصتنا. دردش مع مشترين جادين دون وسطاء.",
      f4Title: "إدارة طلبات الأسعار (RFQ)",
      f4Desc: "استقبل طلبات عروض أسعار مفصلة مع المواصفات. رد بعروض تنافسية للفوز بأعمال جديدة.",
      f5Title: "تحليلات الأداء",
      f5Desc: "تتبع مشاهدات الملف الشخصي ومعدلات الاستفسار ومقاييس المشاركة. افهم ما يبحث عنه المشترون.",
      f6Title: "شارة مراجع",
      f6Desc: "بعد الموافقة، احصل على شارة SourceNest Reviewed - وهي إشارة ثقة تساعدك على التميز أمام المشترين."
    },
    howItWorks: {
      title: "كيفية البدء",
      subtitle: "عملية بسيطة لوضع مصنعك على SourceNest",
      step1Title: "أنشئ حسابك",
      step1Desc: "سجل كشركة مصنعة واختر خطة الاشتراك التي تناسب احتياجات عملك وأهداف نموك.",
      step2Title: "تقديم للموافقة",
      step2Desc: "بمجرد أن يصبح جاهزًا، أرسل حسابك للمراجعة. سيقوم فريقنا بمراجعة عملك قبل منح الوصول إلى المنصة.",
      step3Title: "إتمام الدفع",
      step3Desc: "بمجرد مراجعة حسابك والموافقة عليه، أكمل دفعتك لتفعيل حسابك والبدء في استخدام المنصة.",
      step4Title: "بناء ملفك الشخصي",
      step4Desc: "أكمل ملف المصنع الخاص بك بالتفاصيل والشهادات والقدرات، وقم بتحميل كتالوج منتجاتك والكتيبات.",
      step5Title: "تحميل المنتجات",
      step5Desc: "أضف منتجاتك بالصور والمواصفات والحد الأدنى لكمية الطلب وأوقات التنفيذ وتفاصيل التعبئة لعرض مجموعتك الكاملة.",
      step6Title: "انطلق للعالمية",
      step6Desc: "بعد الموافقة، يصبح ملفك الشخصي نشطًا. ابدأ في تلقي الاستفسارات وطلبات عروض الأسعار من المشترين حول العالم.",
      important: "هام: لا يلزم الدفع مقدمًا. ستتم مراجعة حسابك أولاً، ولن يتم تحصيل الرسوم منك إلا بعد الموافقة.",
      afterApproval: "بمجرد الموافقة، أكمل دفعتك لتفعيل حسابك وفتح الوصول الكامل إلى المنصة."
    },
    benefits: {
      whyChoose: "لماذا يختار المصنعون SourceNest",
      desc1: "على عكس منصات B2B العامة، تم بناء SourceNest خصيصًا لربط المصنعين ذوي الجودة مع المشترين الجادين. تساعد عملية المراجعة لدينا في ضمان أنك محاط بشركات مفحوصة، ويجذب موقعنا المتميز فرق المصادر الاحترافية.",
      desc2: "مع خطط اشتراك ميسورة التكلفة ولا توجد عمولة على الصفقات، تقدم SourceNest قيمة استثنائية للمصانع التي تتطلع إلى توسيع نطاق وصولها العالمي.",
      title: "فوائد الانضمام",
      b1: "الوصول إلى مشترين مؤهلين يبحثون بنشاط عن موردين",
      b2: "قدم مصنعك بملف تعريف احترافي ومصقول",
      b3: "احصل على عملاء محتملين وطلبات أسعار عالية الجودة مباشرة في صندوق الوارد الخاص بك",
      b4: "عرض الشهادات وبناء المصداقية",
      b5: "التوسع في أسواق ومناطق جديدة",
      b6: "لا توجد رسوم عمولة - ادفع اشتراكك فقط"
    },
    cta: {
      title: "هل أنت مستعد للوصول إلى المشترين العالميين؟",
      subtitle: "انضم إلى SourceNest اليوم وابدأ في تلقي الاستفسارات من المستوردين في جميع أنحاء العالم.",
      choosePlan: "اختر خطتك",
      contactSales: "اتصل بالمبيعات"
    }
  },
  pricing: {
    hero: {
      title: "تسعير بسيط وشفاف",
      subtitle: "اختر الخطة التي تناسب عملك. تتضمن جميع الخطط عملية مراجعة وموافقة المسؤول.",
      buyersNote: "الأسعار للمصنعين فقط. يمكن للمشترين استخدام SourceNest مجانًا."
    },
    founding: {
      badge: "عرض محدود الوقت",
      title: "انضم كمصنع مؤسس",
      subtitle: "كن من بين أول 300 مصنع ينضم إلى SourceNest واحصل على 6 أشهر من الوصول المجاني الكامل إلى خطة {plan} - بقيمة 1,794 دولار.",
      plan: "Growth",
      freeFor: "مجاني لمدة 6 أشهر",
      saveBadge: "وفر 1,794 دولار",
      noCardRequired: "لا توجد بطاقة ائتمان مطلوبة",
      description: "احصل على جميع ميزات خطة {plan} الكاملة مجانًا لمدة 6 أشهر. بعد فترة التجربة، اختر أي خطة مدفوعة للحفاظ على حسابك نشطًا.",
      spotsRemaining: "الأماكن المتبقية:",
      button: "تقدم كعضو مؤسس",
      note: "يخضع لمراجعة وموافقة المسؤول",
      badge2: "أول 300 فقط",
      cardTitle: "مصنع مؤسس",
      cardSubtitle: "برنامج المورد المبكر",
      cardFeatures: {
        companyProfile: "ملف تعريف الشركة",
        products100: "حتى 100 منتج",
        internalMessaging: "المراسلة الداخلية",
        inquiryAndRfq: "صندوق الاستفسارات واستقبال طلبات العروض",
        catalogUpload: "تحميل الكتالوج",
        certificationsAndMarkets: "الشهادات والأسواق التصديرية",
        advancedAnalytics: "التحليلات المتقدمة",
        prioritySearch: "أولوية ظهور البحث",
        featuredBadge: "شارة المورد المميز",
        teamUsers3: "عدة مستخدمين فريق (3)"
      }
    },
    features: {
      companyProfile: "ملف تعريف الشركة",
      products25: "حتى 25 منتج",
      products100: "حتى 100 منتج",
      productsUnlimited: "منتجات غير محدودة",
      internalMessaging: "المراسلة الداخلية",
      inquiryInbox: "صندوق الاستفسارات",
      rfqReception: "استقبال طلبات العروض",
      catalogUpload: "تحميل الكتالوج",
      certificationsSection: "قسم الشهادات",
      exportMarketsSection: "قسم أسواق التصدير",
      basicAnalytics: "التحليلات الأساسية",
      advancedAnalytics: "التحليلات المتقدمة",
      enterpriseAnalytics: "تحليلات المؤسسة",
      prioritySearchVisibility: "أولوية ظهور البحث",
      premiumSearchPlacement: "وضع البحث المتميز",
      featuredSupplierBadge: "شارة المورد المميز",
      multipleTeamUsers: "عدة مستخدمين فريق",
      multipleTeamUsers3: "عدة مستخدمين فريق (3)",
      unlimitedTeamUsers: "عدد مستخدمي الفريق غير محدود",
      premiumSupport: "دعم متميز",
      dedicatedAccountManager: "مدير حساب مخصص",
      prioritySupport: "دعم أولويات",
      customOnboarding: "إعداد مخصص"
    },
    paidPlans: {
      title: "الخطط المدفوعة",
      subtitle: "للمصنعين المستعدين لتعظيم رؤيتهم والوصول إليهم",
      monthly: "شهري",
      yearly: "سنوي",
      savePercentage: "وفر 17%",
      starter: {
        name: "Starter",
        description: "للمصنعين الصغار الذين يبدأون رحلة التصدير الخاصة بهم",
        monthlyPrice: 149,
        yearlyPrice: 1490,
        cta: "ابدأ الآن"
      },
      growth: {
        name: "Growth",
        description: "للمصنعين المنشأة الذين يسعون لمزيد من الرؤية",
        monthlyPrice: 299,
        yearlyPrice: 2990,
        cta: "ابدأ الآن",
        badge: "الأكثر شعبية"
      },
      enterprise: {
        name: "Enterprise",
        description: "للمصنعين الكبار ذوي الاحتياجات المخصصة",
        price: "مخصص",
        cta: "اتصل بالمبيعات"
      },
      billedAnnually: "يتم الفوترة سنويًا (${price}/شهر)",
      pricePerCycle: "{cycle}"
    },
    approval: {
      title: "موافقة مطلوبة",
      description: "الدفع لا ينشر ملفك تلقائيًا. يجب أن تمر جميع حسابات المصنعين بعملية مراجعة قبل أن تصبح مرئية للمشترين. وهذا يضمن جودة ثقة المنصة."
    },
    comparison: {
      title: "قارن جميع الميزات",
      subtitle: "شاهد بالضبط ما هو مضمن في كل خطة",
      feature: "ميزة",
      productsLimit: "حد المنتجات",
      teamMembers: "أعضاء الفريق",
      searchVisibility: "رؤية البحث",
      analytics: "التحليلات",
      featuredBadge: "شارة الموردين المميزة",
      accountManager: "مدير الحساب",
      supportLevel: "مستوى الدعم",
      standard: "قياسي",
      priority: "أولوية",
      premium: "متميز",
      basic: "أساسي",
      advanced: "متقدم",
      enterpriseLevel: "مستوى المؤسسة",
      email: "البريد الإلكتروني",
      priorityEmail: "البريد الإلكتروني الأولوي",
      dedicated: "مخصص",
      unlimited: "غير محدود",
      notIncluded: "غير مضمن"
    },
    faq: {
      title: "أسئلة شائعة عن الأسعار",
      q1: "هل ينشر الدفع ملفي تلقائيًا؟",
      a1: "لا. يقوم الدفع بإنشاء حساب المصنع الخاص بك، لكن ملفك يجب أن يمر عبر عملية المراجعة والموافقة الخاصة بنا قبل أن يصبح مرئيًا للمشترين. يستغرق هذا عادةً 2-5 أيام عمل بعد إرسال ملفك الكامل.",
      q2: "ماذا يحدث إذا لم تتم الموافقة على ملفي؟",
      a2: "إذا كان ملفك لا يستوفي متطلباتنا، سنقدم ملاحظات محددة حول ما يجب تحديثه. يمكنك إجراء التغييرات اللازمة وإعادة الإرسال. إذا لم تكن الموافقة ممكنة في النهاية، فإننا نقدم استرداد أموال كامل في غضون 30 يومًا.",
      q3: "هل يمكنني الترقية أو الخفض إلى خطة أخرى؟",
      a3: "نعم، يمكنك تغيير خطتك في أي وقت. عند الترقية، سيتم فرض الفرق المحسوب بالتناسب عليك. عند الخفض، ستنطبق الأسعار الجديدة في دورة الفوترة التالية.",
      q4: "ما هو برنامج المصنع المؤسس؟",
      a4: "برنامج المصنع المؤسس هو عرض محدود الوقت لأول 300 مصنع ينضم إلى SourceNest. كعضو مؤسس، تحصل على 6 أشهر من الوصول المجاني الكامل إلى خطة Growth (قيمة 299 دولار/شهر) - بما في ذلك ما يصل إلى 100 منتج، تحليلات متقدمة، رؤية البحث الأولوية، شارة الموردين المميزة، وأعضاء الفريق المتعددين. لا توجد بطاقة ائتمان مطلوبة للبدء.",
      q5: "ماذا يحدث بعد انتهاء فترة التجربة المجانية 6 أشهر؟",
      a5: "بعد انتهاء فترة التجربة المجانية لمدة 6 أشهر، ستحتاج إلى اختيار ودفع ثمن إحدى خططنا (Starter أو Growth أو Enterprise) لمتابعة استخدام المنصة. سنرسل لك تذكيرات قبل انتهاء فترة التجربة الخاصة بك حتى يكون لديك الكثير من الوقت لاختيار الخطة المناسبة لعملك.",
      q6: "هل برنامج المصنع المؤسس لا يزال متاحًا؟",
      a6: "البرنامج متاح حتى نصل إلى 300 تسجيل مصنع موافق عليه (لا تحتسب الطلبات المعلقة نحو الحد). يمكنك رؤية الأماكن المتبقية على صفحة التسعير الخاصة بنا. بمجرد ملء جميع الأماكن، سيتم إغلاق البرنامج وسيحتاج المصنعون الجدد إلى اختيار خطة مدفوعة.",
      q7: "هل هناك رسوم عمولة على المبيعات؟",
      a7: "لا. لا تأخذ SourceNest أي عمولة على الصفقات التي تقفلها عبر المنصة. رسم الاشتراك الخاص بك هو التكلفة الوحيدة.",
      q8: "ما طرق الدفع التي تقبلونها؟",
      a8: "نحن نقبل جميع بطاقات الائتمان الرئيسية (Visa و Mastercard و American Express) و PayPal. للخطط الخاصة بالمؤسسات، نقدم أيضًا خيارات التحويل البنكي."
    },
    cta: {
      title: "هل أنت مستعد للبدء؟",
      subtitle: "انضم إلى SourceNest وابدأ في الوصول إلى المشترين العالميين اليوم.",
      createAccount: "إنشاء حساب",
      talkToSales: "تحدث إلى المبيعات"
    },
    payment: {
      title: "أكمل دفعتك",
      plan: "خطة",
      success: "تمت عملية الدفع بنجاح!",
      transactionId: "رقم المعاملة:",
      redirecting: "جاري إعادة التوجيه إلى الاشتراك...",
      failed: "فشل الدفع",
      tryAgain: "حاول مجددًا",
      priceInfo: "خطة {plan} ({cycle})",
      processingTime: "💡 هذا عادة ما يستغرق 2-5 أيام عمل."
    }
  },

  // ── Verification / Review Process Page ──────────────────────────────
  verification: {
    hero: {
      badge: "الثقة والجودة",
      title: "عملية المراجعة لدينا",
      description: "كل مصنع على SourceNest يمر بعملية مراجعة شاملة بناءً على المعلومات المقدمة قبل الموافقة عليه. إليك كيف نحافظ على معايير الجودة."
    },
    whyMatters: {
      title: "لماذا تهمك عملية المراجعة لدينا",
      intro: "في عالم التوريد B2B، الثقة ضرورية. يحتاج المشترون إلى الثقة عند الاتصال بالموردين. عادة ما تسمح المنصات التقليدية لأي شخص بالقائمة، مما قد يجعل تقييم الخيارات أصعب ويتطلب المزيد من الجهد من المشترين.",
      approach: "اتخذت SourceNest نهجًا مختلفًا. نهدف إلى مراجعة ملفات المصنع والمعلومات المقدمة لمساعدة تحسين الشفافية ودعم اتخاذ قرارات أفضل قبل ظهور الموردين على المنصة.",
      benefits: "فوائد عملية المراجعة لدينا",
      benefit1: "يمكن للمشترين الوصول إلى معلومات الموردين بوضوح أكبر",
      benefit2: "يستفيد المصنعون من كونهم جزءًا من سوق تركز على الجودة",
      benefit3: "تشجع المنصة على معايير أعلى",
      benefit4: "تساعد العملية في تبسيط اكتشاف الموردين"
    },
    steps: {
      title: "كيفية مراجعة الموردين لدينا",
      subtitle: "تضمن عملية المراجعة متعددة الخطوات لدينا فحصًا شاملاً بناءً على المعلومات المقدمة",
      documentReview: {
        title: "مراجعة الوثائق",
        description: "نقوم بمراجعة معلومات الشركة والمستندات المتاحة لدعم الشفافية وبناء الثقة.",
        item1: "شهادة التسجيل التجاري",
        item2: "تراخيص الاستيراد/التصدير (عند الانطباق)",
        item3: "الشهادات الصناعية (ISO و CE و FDA وغيرها)",
        item4: "مستندات التسجيل الضريبي (عند الانطباق)"
      },
      factoryReview: {
        title: "مراجعة معلومات المصنع",
        description: "نقوم بمراجعة معلومات المصنع الأساسية والقدرات الإنتاجية.",
        item1: "معلومات موقع المصنع",
        item2: "القدرات الإنتاجية",
        item3: "المعدات والآلية",
        item4: "حجم المصنع والقوى العاملة"
      },
      profileReview: {
        title: "مراجعة الملف الشخصي",
        description: "نقوم بمراجعة محتوى الملف الشخصي من حيث الجودة والدقة.",
        item1: "تم مراجعة وصف الشركة",
        item2: "تم تقييم جودة معلومات المنتج",
        item3: "تمت مراجعة الصور والوسائط",
        item4: "تم التحقق من معلومات الاتصال"
      },
      monitoring: {
        title: "المراقبة المستمرة",
        description: "نحن نراقب نشاط الموردين وتعليقات المشترين بمرور الوقت.",
        item1: "وقت الاستجابة",
        item2: "تعليقات المشترين",
        item3: "الأداء العام",
        item4: "فحوصات الجودة"
      }
    },
    badges: {
      title: "شروحات شارات الثقة",
      subtitle: "ماذا تعني شارات المراجعة لدينا لك",
      reviewed: {
        name: "تم مراجعة SourceNest",
        description: "قدم الموردون معلومات الشركة واكملوا مراجعة أساسية للقائمة على المنصة."
      },
      featured: {
        name: "موردون مميزون",
        description: "موردون مميزون بناءً على النشاط والاستجابة وتعليقات المشترين."
      },
      exportReady: {
        name: "جاهز للتصدير",
        description: "يشير الموردون إلى وجود خبرة في الشحن الدولي."
      }
    },
    rejected: {
      title: "ماذا لو لم يتم الموافقة على طلبي؟",
      content: "إذا لم يتمكن طلب المصنع الخاص بك من الموافقة عليه بناءً على المعلومات المقدمة، قد نشارك الملاحظات حول ما يمكن تحسينه. يمكنك تحديث تفاصيلك وإعادة تقديم طلبك في أي وقت. يرجى ملاحظة أنه لا يلزم الدفع أثناء عملية التقديم، وسيتم طلب الدفع فقط بعد الموافقة.",
      reasons: "الأسباب الشائعة لإعادة الإرسال:",
      reason1: "معلومات غير مكتملة أو غير واضحة",
      reason2: "تفاصيل الأعمال المفقودة",
      reason3: "مشاكل جودة محتوى الملف الشخصي",
      reason4: "معلومات متناقضة",
      resubmit: "يمكنك معالجة المشاكل وإعادة تقديم طلبك. إذا لم تكن الموافقة ممكنة في النهاية."
    },
    cta: {
      title: "هل أنت مستعد للمراجعة؟",
      subtitle: "انضم إلى SourceNest وعرض مصنعك لملايين المشترين في جميع أنحاء العالم.",
      viewPlans: "عرض الخطط والبدء",
      readFaq: "اقرأ الأسئلة الشائعة"
    }
  },

  // ── Help Center ─────────────────────────────────────────────────────
  help: {
    hero: {
      title: "كيف يمكننا مساعدتك؟",
      subtitle: "ابحث عن إجابات للأسئلة الشائعة أو اتصل بفريق الدعم لدينا.",
      searchPlaceholder: "البحث عن مقالات المساعدة..."
    },
    contactSupport: {
      title: "هل تحتاج إلى مساعدة إضافية؟",
      subtitle: "لا يمكنك العثور على ما تبحث عنه؟ فريق الدعم لدينا هنا للمساعدة.",
      contactButtonText: "اتصل بالدعم",
      faqButtonText: "عرض الأسئلة الشائعة"
    },
    browseCategoryTitle: "البحث حسب الفئة",
    viewAllArticles: "عرض جميع المقالات",
    popularArticlesTitle: "المقالات الشهيرة",
    backToHelp: "العودة إلى مركز المساعدة",
    backToCategory: "العودة إلى {category}",
    wasHelpful: "هل كانت هذه المقالة مفيدة؟",
    contactSupportCta: "اتصل بالدعم",
    categories: {
      buyers: {
        title: "للمشترين",
        description: "تعرف على كيفية البحث والمقارنة والتواصل مع الموردين",
        articles: {
          searchSuppliers: {
            title: "كيفية البحث عن الموردين",
            content: "العثور على شريك التصنيع المناسب أمر حاسم لنجاح عملك. يوفر SourceNest أدوات بحث وتصفية قوية لمساعدتك في اكتشاف الموردين المراجعين في جميع أنحاء العالم.",
            steps: [
              "استخدم شريط البحث الرئيسي لإدخال أسماء المنتجات أو الفئات أو الكلمات الرئيسية",
              "تطبيق عوامل التصفية لتضييق النتائج حسب الدولة والصناعة ومستوى المراجعة ونطاق الحد الأدنى للطلب",
              "فرز النتائج حسب الصلة أو التقييم أو وقت الاستجابة",
              "انقر على بطاقات الموردين لعرض الملفات الشاملة",
              "استخدم زر 'حفظ' لوضع إشارة مرجعية على الموردين للمقارنة لاحقًا"
            ]
          },
          compareSave: {
            title: "مقارنة وحفظ الموردين",
            content: "تساعدك أدوات المقارنة لدينا على تقييم عدة موردين جنبًا إلى جنب لاتخاذ قرارات مستنيرة.",
            steps: [
              "انقر على أيقونة القلب على أي بطاقة موردين لحفظها",
              "قم بالوصول إلى الموردين المحفوظين من لوحة المعلومات الخاصة بك",
              "حدد ما يصل إلى 4 موردين للمقارنة",
              "عرض المقارنة جنبًا إلى جنب للقدرات والتسعير والشهادات",
              "تصدير تقارير المقارنة لمراجعة الفريق"
            ]
          },
          sendMessages: {
            title: "إرسال رسائل إلى المصانع",
            content: "التواصل المباشر مع الموردين هو مفتاح التوريد الناجح. يسهل نظام المراسلة لدينا الاستفسار والتفاوض وبناء العلاقات.",
            steps: [
              "قم بزيارة أي ملف تعريف للموردين وانقر على 'اتصل بالموردين'",
              "اكتب رسالة واضحة وتفصيلية حول متطلباتك",
              "إرفاق الملفات ذات الصلة مثل المواصفات أو التصاميم",
              "تتبع جميع المحادثات في مركز الرسائل الخاص بك",
              "تفعيل الإخطارات للرد بسرعة على رد الموردين"
            ]
          },
          requestQuotes: {
            title: "طلب عروض الأسعار (RFQs)",
            content: "يساعدك نظام طلب عرض السعر (RFQ) على الحصول على عروض أسعار تنافسية من عدة موردين في المرة الواحدة.",
            steps: [
              "انتقل إلى 'Submit RFQ' من القائمة الرئيسية أو لوحة المعلومات",
              "املأ تفاصيل المنتج والمواصفات والمتطلبات",
              "حدد الكمية والسعر المستهدف والجدول الزمني للتسليم",
              "اختر الإرسال إلى موردين محددين أو بث إلى الشركات المصنعة ذات الصلة",
              "مراجعة ومقارنة عروض الأسعار الواردة في لوحة المعلومات الخاصة بك"
            ]
          },
          manageDashboard: {
            title: "إدارة لوحة معلومات المشتري الخاصة بك",
            content: "لوحة المعلومات الخاصة بك هي المركز الأساسي لجميع أنشطة التوريد لديك في SourceNest.",
            steps: [
              "اعرض RFQs النشط والحالة الخاصة بك",
              "الوصول إلى الموردين المحفوظين والبحث الأخير",
              "إدارة محادثات الرسائل مع الموردين",
              "تتبع تاريخ الطلب والتفاعلات مع الموردين",
              "تحديث ملفك الشخصي وتفضيلات الإخطارات"
            ]
          },
          createAccount: {
            title: "كيفية إنشاء حساب المشتري",
            content: "إنشاء حساب مشتري على SourceNest مجاني ويمنحك الوصول إلى آلاف الموردين المراجعين في جميع أنحاء العالم.",
            steps: [
              "انقر فوق 'تسجيل' أو 'الانضمام كمشتري' على الصفحة الرئيسية",
              "أدخل عنوان بريدك الإلكتروني وأنشئ كلمة مرور آمنة",
              "أدخل معلومات الشركة الأساسية الخاصة بك",
              "تحقق من عنوان بريدك الإلكتروني من خلال رابط التأكيد",
              "أكمل ملفك الشخصي كمشتري للحصول على توصيات موردين أفضل"
            ]
          },
          sendRfq: {
            title: "إرسال RFQ الأول الخاص بك",
            content: "تعرف على كيفية إنشاء وإرسال طلب عرض السعر (RFQ) الأول الخاص بك لبدء الحصول على عروض أسعار من الشركات المصنعة.",
            steps: [
              "قم بتسجيل الدخول إلى حسابك كمشتري وانتقل إلى 'Submit RFQ'",
              "حدد فئة المنتج التي تناسب احتياجاتك بشكل أفضل",
              "صف احتياجات المنتج الخاصة بك بالتفصيل",
              "تحميل أي مستندات أو رسومات أو مواصفات ذات صلة",
              "حدد احتياجات الكمية والسعر المستهدف وتوقعات التسليم",
              "راجع وأرسل RFQ للحصول على عروض أسعار من الموردين المتطابقين"
            ]
          }
        }
      },
      manufacturers: {
        title: "للشركات المصنعة",
        description: "دليل لإعداد وإدارة ملفك الشخصي للمصنع",
        articles: {
          gettingStarted: {
            title: "البدء كمصنع",
            content: "مرحبا بك في SourceNest! سيساعدك هذا الدليل على إعداد حسابك كشركة مصنعة وبدء تلقي الاستفسارات من المشترين العالميين.",
            steps: [
              "أنشئ حسابك بتحديد 'الشركة المصنعة' أثناء التسجيل",
              "أكمل ملفك الشخصي للشركة بمعلومات عملك الدقيقة",
              "قم بتحميل كتالوج المنتجات الخاص بك مع المواصفات التفصيلية",
              "تقدم للمراجعة لبناء الثقة مع المشترين",
              "قم بتحسين ملفك الشخصي لتحسين الظهور في نتائج البحث"
            ]
          },
          createProfile: {
            title: "إنشاء ملفك الشخصي للشركة",
            content: "ملف تعريف كامل وجذاب ضروري لجذب المشترين من الجودة. إليك كيفية إنشاء ملف تعريف مصنع فعال.",
            steps: [
              "أضف اسم الشركة الرسمي والتفاصيل التسجيلية",
              "حدد صناعتك الأساسية وفئات المنتجات",
              "قم بتحميل صور عالية الجودة لمصنعك ومنتجاتك",
              "اكتب وصف شركة مفصل يسلط الضوء على نقاط قوتك",
              "قائمة شهاداتك وأسواق التصدير والقدرة الإنتاجية"
            ]
          },
          uploadProducts: {
            title: "تحميل المنتجات",
            content: "عرض منتجاتك بفعالية لجذب استفسارات المشترين.",
            steps: [
              "انتقل إلى لوحة المعلومات > المنتجات > إضافة منتج",
              "أدخل اسم المنتج والفئة والمواصفات التفصيلية",
              "تحميل صور متعددة عالية الجودة للمنتج",
              "تعيين نطاق الأسعار والحد الأدنى للطلب والمهلة الزمنية",
              "أضف الشهادات والخيارات المخصصة ذات الصلة"
            ]
          },
          manageInquiries: {
            title: "إدارة الاستفسارات و RFQs",
            content: "التعامل بكفاءة مع الاستفسارات هو مفتاح تحويل الاهتمامات إلى العملاء.",
            steps: [
              "مراقبة لوحة معلومات الاستفسارات الخاصة بك بانتظام",
              "الرد على RFQs الجديدة في غضون 24 ساعة لأفضل النتائج",
              "تقديم عروض أسعار مفصلة مع معاينة الأسعار واضحة",
              "اطرح أسئلة توضيحية إذا كانت المتطلبات غير واضحة",
              "المتابعة المهنية لبناء العلاقات"
            ]
          },
          analytics: {
            title: "فهم تحليلاتك",
            content: "استخدم التحليلات لتحسين وجودك وتحسين معدلات التحويل.",
            steps: [
              "تحقق من مشاهدات الملف الشخصي والديموغرافيا الزوار",
              "مراقبة معدلات استفسار المنتج والعناصر الشهيرة",
              "تتبع إحصائيات وقت الاستجابة والرسائل",
              "تحليل معدلات التحويل من الاستفسار إلى عرض السعر",
              "تحديد الاتجاهات وتعديل استراتيجيتك وفقًا لذلك"
            ]
          },
          profileSetup: {
            title: "إعداد ملفك الشخصي للشركة المصنعة",
            content: "ملف تعريف شركة مصنع محسّن جيدًا هو واجهتك الرقمية على SourceNest. إليك كيفية إعداده للحصول على أقصى قدر من الظهور والتفاعل مع المشترين.",
            steps: [
              "انتقل إلى لوحة المعلومات الخاصة بك وانقر فوق 'تحرير الملف الشخصي'",
              "قم بتحميل شعار الشركة الاحترافي وصورة اللافتة",
              "كتابة وصف شركة جذاب (300-500 كلمة موصى بها)",
              "أضف صور المصنع وصور خط الإنتاج والشهادات",
              "ملء جميع تفاصيل الأعمال: سنة التأسيس وعدد الموظفين والإيرادات السنوية",
              "قائمة المنتجات الرئيسية وأسواق التصدير والشهادات",
              "تعيين وقت الاستجابة والحد الأدنى لقيم الطلب بدقة"
            ]
          }
        }
      },
      billing: {
        title: "الفواتير والخطط",
        description: "معلومات حول الاشتراكات والمدفوعات والفواتير",
        articles: {
          subscriptionPlans: {
            title: "فهم خطط الاشتراك",
            content: "يوفر SourceNest خطط اشتراك مرنة للشركات المصنعة. اختر الخطة التي تناسب احتياجات عملك بشكل أفضل.",
            steps: [
              "راجع جميع الخطط المتاحة على صفحة التسعير",
              "قارن الميزات وحدود المنتجات ومستويات الدعم",
              "خطة Starter للشركات المصنعة الجديدة",
              "خطة Growth مع تحليلات متقدمة والدعم ذو الأولوية",
              "خطة Enterprise مع إدارة الحسابات المخصصة"
            ]
          },
          paymentMethods: {
            title: "طرق الدفع والفواتير",
            content: "نحن نقبل طرق دفع متعددة لتسهيل اشتراكك وتيسره.",
            steps: [
              "اختر طريقة الدفع الخاصة بك أثناء الدفع",
              "بطاقات ائتمان وبطاقات خصم و PayPal مقبولة",
              "يتم إنشء الفواتير تلقائيًا وإرسالها إلى بريدك الإلكتروني",
              "قم بتحديث طريقة الدفع الخاصة بك في إعدادات حسابك",
              "قم بالإلغاء أو تغيير خطتك في أي وقت"
            ]
          },
          invoices: {
            title: "إدارة الفواتير والإيصالات",
            content: "قم بالوصول إلى سجل الفواتير الخاص بك وتنزيل الفواتير في أي وقت.",
            steps: [
              "انتقل إلى الإعدادات > الفواتير",
              "عرض سجل الفواتير الكامل",
              "تنزيل نسخ PDF من الفواتير للحفظ الخاص بك",
              "طباعة أو إرسال الفواتير عبر البريد الإلكتروني إلى قسم المحاسبة",
              "اتصل بالدعم إذا كنت بحاجة إلى الطعن في أي رسوم"
            ]
          }
        }
      }
    }
  },

  // ── About Page ──────────────────────────────────────────────────────
  about: {
    hero: {
      title: "جعل الحصول على المصادر العالمية يعمل بشكل أفضل",
      subtitle: "SourceNest تهدف إلى تحويل الطريقة التي تجد بها الشركات وتتصل بشركاء التصنيع في جميع أنحاء العالم."
    },
    story: {
      title: "قصتنا",
      p1: "كان الحصول على المصادر العالمية دائمًا تحديًا. يجد المشترون صعوبة في العثور على موردين موثوقين، والتحقق من شرعيتهم، والتواصل بفعالية عبر الحدود. يجد المصنعون، خاصة أولئك الموجهين نحو الجودة، صعوبة في التميز وسط خيارات لا تحصى والوصول إلى المشترين الجادين.",
      p2: "ولدت SourceNest من فكرة بسيطة: ماذا لو كانت هناك منصة تضم فقط الشركات المصنعة المراجعة والموافق عليها؟ مكان يمكن للمشترين أن يعرفوا فيه أن كل مورد قد تم فحصه بناءً على المعلومات المقدمة قبل الظهور؟",
      p3: "بنينا SourceNest ليكون تلك المنصة. من خلال متطلبات الموافقة من الإدارة لكل شركة مصنعة والاحتفاظ بالمنصة مجانية للمشترين، أنشأنا بيئة تسود فيها الجودة والثقة هي أساس كل اتصال.",
      p4: "اليوم، تربط SourceNest آلاف المشترين مع الشركات المصنعة المراجعة عبر 50+ دول، تغطي 45+ صناعة. نحن فخورون بجعل التجارة العالمية أكثر سهولة وشفافية وكفاءة."
    },
    stats: {
      countries: "الدول",
      suppliers: "الموردين المراجعين",
      products: "المنتجات المدرجة",
      industries: "الصناعات المغطاة"
    },
    missionVision: {
      missionTitle: "مهمتنا",
      missionDesc: "لجعل الحصول على المصادر العالمية أكثر شفافية وكفاءة وجدارة بالثقة من خلال ربط المشترين الموجهين نحو الجودة بالشركات المصنعة المراجعة من خلال منصة B2B المميزة.",
      visionTitle: "رؤيتنا",
      visionDesc: "عالم حيث يكون العثور على شريك التصنيع المناسب بسيطًا وآمنًا وناجحًا — بغض النظر عن الجغرافيا أو حجم الشركة أو الصناعة."
    },
    values: {
      title: "قيمنا",
      subtitle: "المبادئ التي توجه كل ما نفعله",
      trust: {
        title: "الثقة والشفافية",
        description: "نحن نعتقد أن الحصول على المصادر يجب أن يكون مبنيًا على الثقة. يتم مراجعة كل مورد بناءً على المعلومات المقدمة، وننسى الحفاظ على جودة المنصة."
      },
      global: {
        title: "الإمكانية الوصول العالمية",
        description: "نحن نكسر العوائق في التجارة الدولية، مما يسهل على الشركات من جميع الأحجام الاتصال عبر الحدود."
      },
      community: {
        title: "المجتمع أولاً",
        description: "نحن لا نبني منصة فحسب — نحن ننشئ مجتمعًا من المشترين والمصنعين الموجهين نحو الجودة."
      },
      innovation: {
        title: "الابتكار",
        description: "نحن نحسن المنصة باستمرار من خلال الميزات الذكية التي تجعل الحصول على المصادر أكثر كفاءة وفعالية."
      }
    },
    difference: {
      title: "لماذا SourceNest مختلفة",
      reviewed: {
        title: "السوق المراجع فقط:",
        description: "على عكس المنصات المفتوحة حيث يمكن لأي شخص الإدراج، تمر كل شركة مصنعة على SourceNest عملية المراجعة والموافقة من الإدارة بناءً على المعلومات المقدمة. هذا يعني أن المشترين يعرفون أن الموردين تم فحصهم، والمصنعون يعرفون أنهم في شركة جيدة."
      },
      free: {
        title: "مجاني للمشترين:",
        description: "نحن نعتقد أن المشترين يجب أن يتمكنوا من الوصول إلى أدوات الحصول على المصادر بدون عوائق. من خلال جعل المنصة مجانية للمشترين، نضمن أقصى وصول للشركات المصنعة والوصول الأقصى لمتخصصي الحصول على المصادر."
      },
      nocommission: {
        title: "نموذج بدون عمولة:",
        description: "نحن لا نأخذ أي جزء من صفقاتك. تدفع الشركات المصنعة فقط رسم الاشتراك، وكل الاتصالات والمفاوضات تحدث مباشرة بين الطرفين."
      },
      premium: {
        title: "التركيز على المميز:",
        description: "نحن لا نحاول أن نكون أكبر منصة — نحن نحاول أن نكون الأكثر موثوقية. الجودة على العدد هي مبدأنا الموجه."
      }
    },
    cta: {
      title: "انضم إلى مجتمع SourceNest",
      subtitle: "سواء كنت تقوم بالحصول على المنتجات أو تصنيعها، نود أن يكون لديك.",
      buyerButton: "انضم كمشتري",
      manufacturerButton: "انضم كمصنع"
    }
  }
} as const;

export default ar as unknown as TranslationKeys;
