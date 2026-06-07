import type { TranslationKeys } from "./en";

// Keep translations as a constant and cast on export to avoid strict
// literal-type mismatches with `en` while preserving runtime values.
const he = {
  common: {
    save: "שמור שינויים",
    cancel: "ביטול",
    delete: "מחק",
    edit: "ערוך",
    add: "הוסף",
    view: "צפה",
    manage: "נהל",
    close: "סגור",
    search: "חיפוש",
    loading: "טוען…",
    noResults: "לא נמצאו תוצאות",
    confirm: "אישור",
    back: "חזרה",
    next: "הבא",
    yes: "כן",
    no: "לא",
    ok: "אישור",
    error: "שגיאה",
    success: "הצלחה",
    warning: "אזהרה",
    email: "דוא\"ל",
    password: "סיסמה",
  },
  auth: {
    // Common
    signIn: "התחברות",
    signOut: "התנתקות",
    signUp: "הרשמה",
    email: "כתובת אימייל",
    password: "סיסמה",
    forgotPassword: "שכחת סיסמה?",
    rememberMe: "זכור אותי",
    noAccount: "אין לך חשבון?",
    hasAccount: "כבר יש לך חשבון?",
    orContinueWith: "או המשך עם",
    
    // Sign In page
    welcomeBack: "ברוכים חזרים",
    signInToYourAccount: "היכנס לחשבונך כדי להמשיך",
    buyer: "רוכש",
    manufacturer: "יצרן",
    admin: "מנהל",
    buyerDescription: "גש ללוח הבקרה של הרוכש כדי לנהל בקשות הצעות מחיר, הודעות וספקים שמורים.",
    manufacturerDescription: "גש ללוח הבקרה של היצרן כדי לנהל מוצרים, פניות וחשבון החברה.",
    adminDescription: "גש ללוח הבקרה של המנהל כדי לנהל משתמשים, ספקים והגדרות הפלטפורמה.",
    signInAs: "היכנס כ",
    continueWithGoogle: "המשך עם Google",
    dontHaveAccount: "אין לך חשבון?",
    createAccount: "צור חשבון",
    canceledDeletion: "ביטלת בקשת מחיקה?",
    restoreAccount: "שחזר חשבון",
    invalidEmailOrPassword: "כתובת אימייל או סיסמה לא חוקית. אנא נסה שוב.",
    accountRestored: "החשבון שוחזר",
    accountRestoredMessage: "אתה יכול להיכנס בעזרת האמצעים הרגילים שלך.",
    signingIn: "מתחבר...",
    
    // Sign Up page
    createNewAccount: "צור את חשבונך",
    joinOurPlatform: "הצטרף לפלטפורמה שלנו כדי להתחיל למכור או למצוא ספקים",
    selectYourRole: "בחר את התפקיד שלך",
    buyerRole: "רוכש",
    buyerRoleDesc: "חיפוש אחר ספקים ומוצרים",
    manufacturerRole: "יצרן",
    manufacturerRoleDesc: "סיפוק מוצרים לרוכשים",
    continueButton: "המשך",
    
    // Sign Up - Details form
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    company: "שם החברה",
    country: "מדינה",
    confirmPassword: "אשר סיסמה",
    agreeToTerms: "אני מסכים לתנאי השירות ולמדיניות הפרטיות",
    createAccountButton: "צור חשבון",
    alreadyHaveAccount: "כבר יש לך חשבון?",
    signInLink: "היכנס כאן",
    registrationFailed: "ההרשמה נכשלה. אנא נסה שוב.",
    
    // Manufacturer specific
    city: "עיר",
    businessLicense: "רישיון עסק",
    website: "אתר אינטרנט",
    factoryPhotos: "תמונות המפעל",
    additionalNotes: "הערות נוספות",
    uploadBizLicense: "העלה רישיון עסק",
    uploadFactoryPhotos: "העלה תמונות מפעל (עד 5)",
    uploadDesc: "גרור וזרוק או לחץ כדי לבחור קבצים",
    max5Photos: "לכל היותר 5 תמונות",
    remove: "הסר",
    
    // Social signup
    needsProfileCompletion: "השלם את הפרופיל שלך",
    profileAlmostReady: "הפרופיל שלך כמעט מוכן",
    continueProfileSetup: "המשך בהגדרת הפרופיל שלך",
    
    // Errors
    googleLoginFailed: "כניסת Google נכשלה. אנא נסה שוב.",
    errorOccurred: "אירעה שגיאה. אנא נסה שוב.",
    accountCreated: "החשבון שלך נוצר",
    reviewPlans: "בדוק תוכניות קادימות, או עבור ישירות ללוח הבקרה שלך.",
    verifyEmail: "אנא אמת את הדוא\"ל שלך לפני שתמשיך.",
    
    // Restore Account
    restoreTitle: "שחזור החשבון שלך",
    restoreSubtitleStep1: "אם ביקשת מחיקת חשבון, התחבר כאן כדי לבטל. נשלח לך קוד אימות בדוא\"ל.",
    restoreSubtitleStep2: "הזן את קוד האימות ששלח לדוא\"ל שלך.",
    restoreSendingCode: "שליחת קוד…",
    restoreContinue: "המשך",
    restoreVerificationCode: "קוד אימות",
    restoreEnterCode: "הזן קוד מהדוא\"ל",
    restoreVerifying: "מאמת…",
    restoreVerifyButton: "אמת והחזר חשבון",
    restoreDifferentEmail: "השתמש בדוא\"ל אחר",
    
    // Forgot Password
    forgotTitle: "שכחת את הסיסמה?",
    resetTitle: "איפוס סיסמה",
    forgotSubtitle: "אל תדאג, נשלח לך הוראות איפוס.",
    resetSubtitle: "הזן את קוד ה-OTP והסיסמה החדשה שלך כדי להשלים את האיפוס.",
    forgotSending: "שליחה...",
    forgotSendCode: "שלח קוד איפוס",
    resetPasswordComplete: "איפוס סיסמה הושלם בהצלחה",
    resetOtpLabel: "קוד OTP",
    resetOtpPlaceholder: "הזן קוד OTP",
    resetNewPassword: "סיסמה חדשה",
    resetConfirmPassword: "אישור סיסמה",
    resetResetting: "מאפס...",
    resetButton: "איפוס סיסמה",
    resetDifferentEmail: "השתמש בדוא\"ל אחר",
    rememberPassword: "זוכר סיסמה?",
    passwordMismatch: "אישור הסיסמה אינו תואם.",
    emailMissing: "דוא\"ל חסר. אנא בקש קוד איפוס שוב.",
  },

  // ── Auth Layout ──────────────────────────────────────────────────────
  authLayout: {
    connectManufacturers: "התחבר עם יצרנים בדוקים ברחבי העולם",
    joinBusinesses: "הצטרף לאלפי עסקים המוצאים שותפי ייצור אמינים דרך הרשת המאורגנת שלנו.",
    reviewedManufacturers: "יצרנים בדוקים",
    countries: "מדינות",
    productCategories: "קטגוריות מוצרים",
    clientSatisfaction: "שביעות רצון הלקוחות",
    allSuppliersReviewed: "כל הספקים בדוקים ומבוקרים",
    globalNetwork: "רשת גלובלית ב-120+ מדינות",
    secureMessaging: "הודעות וטרנזקציות מאובטחות",
    realtimeRFQ: "התאמת RFQ בזמן אמת",
    copyright: "SourceNest. כל הזכויות שמורות.",
  },

  nav: {
    dashboard: "לוח בקרה",
    users: "משתמשים",
    suppliers: "ספקים",
    products: "מוצרים",
    industries: "תעשיות",
    reviews: "ביקורות",
    rfqs: "בקשות הצעת מחיר",
    messages: "הודעות",
    reports: "דוחות",
    pricing: "תמחור",
    promotions: "מבצעים",
    subscriptions: "מנויים",
    insights: "תובנות",
    analytics: "אנליטיקה",
    contact: "דף יצירת קשר",
    faq: "ניהול שאלות נפוצות",
    siteSettings: "הגדרות אתר",
    settings: "הגדרות",
    viewSite: "צפה באתר",
    quickFilters: "מסננים מהירים",
    createManufacturer: "צור יצרן",
    mfgRegistrations: "רישומי יצרנים",
    
    // Header navigation
    headerDiscover: "גלה",
    headerPlatform: "הפלטפורמה",
    headerResources: "משאבים",
    headerInsights: "תובנות",
    
    // Discover items
    browseIndustries: "עיין בתעשיות",
    browseIndustriesDesc: "חפש ספקים לפי סקטור תעשיה והתמחות",
    browseSuppliers: "עיין בספקים",
    browseSuppliersDesc: "גלה יצרנים בדוקים מכל רחבי העולם",
    browseProducts: "עיין במוצרים",
    browseProductsDesc: "חקור מוצרים בכל הקטגוריות והתעשיות",
    featuredManufacturers: "יצרנים מוצגים",
    featuredManufacturersDesc: "יצרנים בדוקים מובילים בפלטפורמה",
    globalSupplierMap: "מפת ספקים גלובלית",
    globalSupplierMapDesc: "חקור ספקים לפי מדינה ואזור",
    compareSuppliers: "השווה ספקים",
    compareSuppliersDesc: "השווה יצרנים זה לזה",
    newSuppliers: "ספקים חדשים",
    newSuppliersDesc: "יצרנים שהצטרפו לאחרונה ל-SourceNest",
    
    // Platform items
    forBuyers: "לקונים",
    forBuyersDesc: "חפש, השווה והתחבר עם ספקים בחינם",
    forManufacturers: "ליצרנים",
    forManufacturersDesc: "הציג את המפעל שלך והשג גישה לקונים עולמיים",
    
    // Resource items
    review: "ביקורת",
    reviewDesc: "למד כיצד אנו בודקים ומאשרים ספקים",
    helpCenter: "מרכז עזרה",
    helpCenterDesc: "מצא תשובות לשאלות נפוצות",
    aboutUs: "עלינו",
    aboutUsDesc: "למד יותר על SourceNest",
    
    // Header favorites dropdown
    savedTabSuppliers: "ספקים",
    savedTabProducts: "מוצרים",
    noSavedSuppliers: "אין ספקים שמורים עדיין",
    saveSupplierHint: "לחץ על אייקון הלב בכל ספק כדי לשמור אותו",
    browseSuppliersCTA: "עיין בספקים",
    viewAllSavedSuppliers: "צפה בכל הספקים השמורים",
    noSavedProducts: "אין מוצרים שמורים עדיין",
    saveProductHint: "לחץ על אייקון הלב בכל מוצר כדי לשמור אותו",
    browseProductsCTA: "עיין במוצרים",
    viewAllSavedProducts: "צפה בכל המוצרים השמורים",
    moreSuppliersCount: "ספקים נוספים",
    moreProductsCount: "מוצרים נוספים",
    
    // Auth menu dropdown
    userMenuDashboard: "לוח בקרה",
    userMenuSettings: "הגדרות",
    userMenuSignOut: "התנתקות",
    userMenuSignIn: "התחברות",
    userMenuGetStarted: "התחל עכשיו",
    
    // Admin sidebar menu
    adminDashboard: "לוח בקרה",
    adminUsers: "משתמשים",
    adminCreateManufacturer: "צור יצרן",
    adminMfgRegistrations: "הרשמות יצרנים",
    adminSuppliers: "ספקים",
    adminProducts: "מוצרים",
    adminIndustries: "תעשיות",
    adminQuickFilters: "מסננים מהירים",
    adminReviews: "ביקורות",
    adminRFQs: "בקשות הצעות",
    adminMessages: "הודעות",
    adminReports: "דוחות",
    adminPricing: "תמחור",
    adminPromotions: "קידומים",
    adminSubscriptions: "מנויים",
    adminInsights: "תובנות",
    adminCertificateType: "סוג תעודה",
    adminAnalytics: "אנליטיקה",
    adminContactPage: "דף יצירת קשר",
    adminFAQManagement: "ניהול שאלות נפוצות",
    adminSiteSettings: "הגדרות אתר",
    adminSettings: "הגדרות",
    adminViewSite: "צפה באתר",
    adminSignOut: "התחברות",
  },
  settings: {
    title: "הגדרות",
    subtitle: "ניהול החשבון וההעדפות שלך",
    adminSubtitle: "הגדרות והעדפות הפלטפורמה",
    accountDetails: "פרטי חשבון",
    accountDetailsDesc: "ניהול המידע האישי שלך",
    accountCredentialsDesc: "ניהול פרטי ההתחברות ומידע ליצירת קשר",
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    emailAddress: "כתובת אימייל",
    companyName: "שם החברה",
    phoneNumber: "מספר טלפון",
    changePassword: "שנה סיסמה",
    generalSettings: "הגדרות כלליות",
    generalSettingsDesc: "הגדרות בסיסיות של הפלטפורמה",
    platformName: "שם הפלטפורמה",
    supportEmail: "אימייל תמיכה",
    contactPhone: "טלפון ליצירת קשר",
    security: "אבטחה",
    securityDesc: "ניהול הגדרות אבטחת החשבון",
    securitySettings: "הגדרות אבטחה",
    securitySettingsDesc: "הגדרות אבטחת הפלטפורמה",
    requireEmailVerification: "דרוש אימות אימייל",
    requireEmailVerificationDesc: "משתמשים חייבים לאמת את האימייל לפני גישה",
    manualSupplierApproval: "אישור ספקים ידני",
    manualSupplierApprovalDesc: "דרוש אישור מנהל לספקים חדשים",
    rateLimiting: "הגבלת קצב",
    rateLimitingDesc: "הגבלת בקשות API למשתמש",
    loginHistory: "היסטוריית התחברות",
    loginHistoryDesc: "צפה בפעילות התחברות אחרונה",
    connectedDevices: "מכשירים מחוברים",
    connectedDevicesDesc: "ניהול הפעלות פעילות",
    notifications: "העדפות התראות",
    notificationsDesc: "בחר כיצד ומתי תרצה לקבל התראות",
    adminNotifications: "הגדרות התראות",
    adminNotificationsDesc: "העדפות התראות מנהל",
    newQuoteResponses: "תגובות הצעות מחיר חדשות",
    newQuoteResponsesDesc: "קבל התראה כאשר ספקים מגיבים לבקשות שלך",
    newMessages: "הודעות חדשות",
    newMessagesDesc: "קבל התראה על הודעות חדשות מספקים",
    newMessagesBuyerDesc: "קבל התראה על הודעות חדשות מספקים",
    newMessagesMfgDesc: "קבל התראה על הודעות חדשות מקונים",
    supplierUpdates: "עדכוני ספקים",
    supplierUpdatesDesc: "קבל התראה כאשר ספקים שמורים מוסיפים מוצרים חדשים",
    weeklyDigest: "סיכום שבועי",
    weeklyDigestDesc: "קבל סיכום שבועי של ספקים חדשים בתחומי העניין שלך",
    weeklyPerformanceDigest: "סיכום ביצועים שבועי",
    weeklyPerformanceDigestDesc: "קבל סיכום אנליטי שבועי",
    marketingPromotions: "שיווק ומבצעים",
    marketingPromotionsDesc: "קבל טיפים והצעות מיוחדות",
    marketingPromotionsMfgDesc: "קבל טיפים והצעות קידום מכירות",
    dailySummary: "סיכום יומי",
    dailySummaryDesc: "קבל סיכום יומי של הפלטפורמה",
    newInquiryAlerts: "התראות פניות חדשות",
    newInquiryAlertsDesc: "קבל התראה כאשר קונים שולחים פניות",
    quoteRequests: "בקשות הצעת מחיר",
    quoteRequestsDesc: "קבל התראה בעת קבלת בקשות הצעת מחיר",
    newSupplierRegistrations: "רישומי ספקים חדשים",
    newSupplierRegistrationsDesc: "קבל התראה על הרשמות ספקים חדשות",
    reportedContent: "תוכן מדווח",
    reportedContentDesc: "קבל התראה על תוכן שסומן",
    languageRegion: "שפה ואזור",
    languageRegionDesc: "הגדר שפה ואזור זמן מועדפים",
    language: "שפה",
    timezone: "אזור זמן",
    currencyDisplay: "תצוגת מטבע",
    localization: "לוקליזציה",
    localizationDesc: "הגדרות אזוריות ושפה",
    defaultLanguage: "שפת ברירת מחדל",
    defaultCurrency: "מטבע ברירת מחדל",
    defaultTimezone: "אזור זמן ברירת מחדל",
    emailSettings: "הגדרות אימייל",
    emailSettingsDesc: "הגדרות שליחת אימייל",
    fromName: "שם השולח",
    fromEmail: "אימייל השולח",
    testEmailDelivery: "בדיקת שליחת אימייל",
    primaryEmail: "אימייל ראשי",
    notificationEmail: "אימייל להתראות",
    addEmail: "הוסף אימייל",
    database: "בסיס נתונים",
    databaseDesc: "תחזוקת בסיס נתונים וגיבויים",
    lastBackup: "גיבוי אחרון",
    createBackup: "צור גיבוי",
    exportData: "ייצוא נתונים",
    subscription: "מנוי",
    nextBillingDate: "תאריך חיוב הבא",
    upgradePlan: "שדרג תוכנית",
    cancelSubscription: "בטל מנוי",
    dangerZone: "אזור סכנה",
    deactivateAccount: "השבת חשבון",
    deleteAccount: "מחק חשבון",
  },
  faq: {
    title: "ניהול שאלות נפוצות",
    subtitle: "ניהול שאלות נפוצות המוצגות בדף השאלות הנפוצות",
    totalCategories: "סך הקטגוריות",
    totalQuestions: "סך השאלות",
    avgPerCategory: "ממוצע לקטגוריה",
    categories: "קטגוריות שאלות נפוצות",
    categoriesDesc: "ארגן שאלות נפוצות לפי קטגוריה. גרור לשינוי סדר או השתמש בכפתורי החצים.",
    addCategory: "הוסף קטגוריה",
    editCategory: "ערוך קטגוריה",
    addQuestion: "הוסף שאלה",
    editQuestion: "ערוך שאלה",
    categoryTitle: "כותרת הקטגוריה",
    question: "שאלה",
    answer: "תשובה",
    noCategories: "עדיין אין קטגוריות שאלות נפוצות",
    addFirstCategory: "הוסף את הקטגוריה הראשונה שלך",
    noQuestions: "אין שאלות בקטגוריה זו",
    deleteConfirmCategory: "פעולה זו תמחק את הקטגוריה ואת כל השאלות שבתוכה. לא ניתן לבטל פעולה זו.",
    deleteConfirmFaq: "פעולה זו תמחק את השאלה לצמיתות. לא ניתן לבטל פעולה זו.",
    createCategoryDesc: "צור קטגוריה חדשה לארגון השאלות שלך",
    updateCategoryDesc: "עדכן את שם הקטגוריה",
    createFaqDesc: "הוסף שאלה חדשה לקטגוריה זו",
    updateFaqDesc: "עדכן את השאלה והתשובה",
    questionPlaceholder: "לדוגמה: כיצד אאפס את הסיסמה שלי?",
    answerPlaceholder: "ספק תשובה ברורה ומועילה...",
    categoryPlaceholder: "לדוגמה: כללי, לקונים, חיוב",
  },
  landing: {
    hero: {
      badge: "מחברים את הסחר העולמי",
      title1: "גלה יצרנים",
      title2: "אמינים ברחבי העולם",
      subtitle: "חפש מוצרים, השווה ספקים, בקש הצעות מחיר וצור קשר ישירות עם מפעלים אמינים דרך פלטפורמת מקורות גלובלית מובילה.",
      searchPlaceholder: "חפש מוצרים, ספקים או תעשיות...",
      searchButton: "חיפוש",
      popular: "פופולרי:",
      popElectronics: "אלקטרוניקה",
      popTextiles: "טקסטיל",
      popMachinery: "מכונות",
      popFood: "מזון ומשקאות",
      statCountries: "מדינות מכוסות",
      statReviewed: "ספקים שנבדקו",
      statDirect: "תקשורת עם מפעלים",
      statDirectPrefix: "ישירה"
    },
    whatIs: {
      title: "מה זה SourceNest?",
      desc: "SourceNest היא זירת מסחר דיגיטלית גלובלית ואיכותית שבה יבואנים, קונים ואנשי רכש מגלים יצרנים ומפעלים אמינים מכל רחבי העולם. מפעלים מציגים את המוצרים, היכולות והאישורים שלהם, בעוד קונים מחפשים, משווים ויוצרים קשר ישירות - הכל בפלטפורמה אמינה אחת.",
      forBuyers: "לקונים ויבואנים",
      forBuyersDesc: "גלה יצרנים אמינים, השווה ספקים זה לצד זה, שמור מועדפים, שלח בקשות להצעת מחיר וצור קשר ישירות עם מפעלים. כל תהליך הרכש שלך במקום אחד - לגמרי בחינם.",
      buyerPoint1: "חפש אלפי ספקים אמינים",
      buyerPoint2: "השווה מפעלים ויכולות",
      buyerPoint3: "בקש הצעות מחיר ושלח הודעות ישירות",
      buyerPoint4: "גישה לקטלוגי מוצרים ומפרטים",
      buyerLink: "למד עוד לקונים",
      forMfg: "ליצרנים ומפעלים",
      forMfgDesc: "צור את הדוכן הדיגיטלי שלך, העלה מוצרים, הצג אישורים והיחשף קונים מרחבי העולם. קבל פניות ובקשות להצעת מחיר ישירות בלוח הבקרה שלך. הצטרף באמצעות תוכניות מנוי משתלמות.",
      mfgPoint1: "בנה פרופיל חברה מקצועי",
      mfgPoint2: "העלה קטלוגי מוצרים ללא הגבלה",
      mfgPoint3: "קבל ונהל בקשות להצעת מחיר",
      mfgPoint4: "השג נראות וחשיפה גלובלית",
      mfgLink: "למד עוד ליצרנים"
    },
    howItWorks: {
      title: "איך זה עובד",
      subtitle: "תהליכים פשוטים ושקופים הן לקונים והן ליצרנים",
      tabBuyers: "לקונים",
      tabMfg: "ליצרנים",
      buyerStep1Title: "חיפוש וגילוי",
      buyerStep1Desc: "עיין בספריית הספקים הגלובלית שלנו, סנן לפי תעשייה, מיקום, אישורים ויכולות כדי למצוא את שותפי הייצור המושלמים.",
      buyerStep2Title: "השוואת ספקים",
      buyerStep2Desc: "שמור את הספקים המועדפים עליך, השווה להם זה לצד זה, סקור את המוצרים, האישורים והיכולות שלהם כדי לקבל החלטות מושכלות.",
      buyerStep3Title: "יצירת קשר ותקשורת",
      buyerStep3Desc: "שלח הודעות ישירות למפעלים, בקש הצעות מחיר מפורטות ונהל משא ומתן על תנאים - הכל בתוך מערכת ההודעות המאובטחת של הפלטפורמה.",
      buyerStep4Title: "בקש הצעות מחיר",
      buyerStep4Desc: "הגש בקשות מפורטות להצעות מחיר עם מפרטים, כמויות ודרישות. קבל הצעות מחיר תחרותיות ישירות מיצרנים שנבדקו.",
      buyerFree: "קונים משתמשים ב-SourceNest לגמרי בחינם — אין צורך במנוי.",
      mfgStep1Title: "צור את החשבון שלך",
      mfgStep1Desc: "הירשם כיצרן ובחר את תוכנית המנוי שמתאימה לצרכי העסק ולמטרות הצמיחה שלך.",
      mfgStep2Title: "השלם תשלום",
      mfgStep2Desc: "לאחר שחשבונך יהיה אומת וחוי, השלם את התשלום שלך כדי להפעיל את החשבון והתחל להשתמש בפלטפורמה.",
      mfgStep3Title: "בנה את הפרופיל שלך",
      mfgStep3Desc: "השלם את פרופיל המפעל שלך עם פרטים, אישורים, יכולות והעלה את קטלוג המוצרים והעלונים שלך.",
      mfgStep4Title: "העלה מוצרים",
      mfgStep4Desc: "הוסף את המוצרים שלך עם תמונות, מפרטים, כמות מינימלית להזמנה (MOQ), זמני אספקה ופרטי אריזה כדי להציג את המגוון המלא שלך.",
      mfgStep5Title: "הגש לאישור",
      mfgStep5Desc: "בהלטה כדי תהיה מוכן, הגש את החשבון שלך לזיהוי ייחום. הצוות שלנו יבדוק את העסק שלך לפני גדאו סיסמה בפלטפורמה.",
      mfgStep6Title: "לך לעולם",
      mfgStep6Desc: "לאחר האישור, הפרופיל שלך פתוח לכולם. התחל לקבל פניות ובקשות להצעות מחיר מקונים מכל העולם.",
      mfgApproval: "כל חשבונות היצרנים דורשים אישור מנהל לפני שהם נפתחים — להבטחת איכות ואמון לקונים.",
      important: "חשוב: לא נדרש תשלום מראש. החשבון שלך יהיה בדיקה ראשונה, וחייב רק לאחר אישור.",
      paymentComplete: "לאחר אישור, השלם את התשלום כדי להפעיל את החשבון שלך ולפתוח גישה מלאה לפלטפורמה."
    },
    industries: {
      viewAll: "צפה בכל התעשיות",
      explorerMap: "חקור מפה גלובלית",
      electronicsElectrical: "אלקטרוניקה וחשמל",
      machineryEquipment: "מכונות וציוד",
      textilesApparel: "טקסטיל וביגוד",
      homeGarden: "בית וגן",
      healthBeauty: "בריאות ויופי",      // Industries page
      pageTitle: "חקור תעשיות",
      pageDescription: "גלה יצרנים וספקים בעלי סקירה בכל התעשיות הגדולות. מאלקטרוניקה לטקסטיל, מצא את השותף המושלם לעסקך.",
      majorIndustriesBadge: "תעשיות גדולות",
      categoriesLabel: "קטגוריות",
      suppliersLabel: "ספקים",
      productsLabel: "מוצרים",
      featuredBadge: "בולט",
      exploreButton: "חקור",
      suppliersButton: "ספקים",
      moreCategories: "+ {count} עוד",
      cantFindTitle: "לא מוצא את התעשייה שלך?",
      cantFindDesc: "אנחנו מרחיבים את הרשת שלנו באופן קבוע. אנא צור קשר אתנו כדי ללמוד על תעשיות קרובות.",
      contactUsButton: "צור קשר",    },
    suppliers: {
      pageTitle: "מצא ספקים סקורים",
      pageDescription: "בדוק יצרנים שנבדקו מכל רחבי העולם",
      pageSubtitle: "{count}+ יצרנים שנבדקו מכל רחבי העולם",
      searchPlaceholder: "חטוף אחר ספקים, מוצרים או קטגוריות...",
      filters: "סינוני",
      clearAll: "טהר הימנפטטה",
      industryLabel: "תעשייה",
      allIndustries: "כל התעשיות",
      countryLabel: "מדינה",
      allCountries: "כל המדינות",
      popular: "הפופולאריות",
      certificationLabel: "סמכה",
      anyCertification: "כל סמכה",
      minimumOrderLabel: "הרטרט הכנד מיומום",
      anyMOQ: "כל טטט הכנד מטגמטט",
      exportMarketLabel: "שוקט מסחסוס",
      anyRegion: "כל אזור",
      reviewedSuppliersOnly: "ספקים סקורים רק ספקים",
      suppliersFound: "ספקים טובים",
      sortBy: "מיין לפי",
      relevance: "טיטמבעע",
      highestRating: "הנבייטגיום הנבייטגיום בדיקה",
      fastestResponse: "ההטנופפיר המהיר ביהודו יופיים",
      mostProducts: "הפחתנט הפחתנט בעל העלט מצרים",
      activeFilters: "סינוני פאפה:",
      search: "חטיבה:",
      reviewedOnly: "סקורים רק פקים",
      reviewedBadge: "סקוטטטטתתתת",
      productsLabel: "מוצרים",
      moreProducts: "+ {count} עוד",
      noSuppliersFound: "לא וטיטה ספקים",
      adjustSearchFilters: "נייה לעדכנתא חטיבה אוט סינוני",
      clearAllFilters: "טהר כל הסינוני",
      compare: {
        pageTitle: "השוואת ספקים",
        pageDescription: "השווה עד {max} ספקים זה לצד זה",
        breadcrumbHome: "בית",
        breadcrumbSuppliers: "ספקים",
        breadcrumbCompare: "השוואה",
        addSupplier: "הוסף ספק להשוואה",
        maximumSuppliersAdded: "נוסף מספר הספקים המרבי",
        noSuppliersSelected: "לא נבחרו ספקים",
        noSuppliersMessage: "בחר ספקים מהתפריט הנפתח למעלה או עיין בספריית הספקים שלנו כדי להתחיל להשוות.",
        browseSuppliers: "עיין בספקים",
        comparing: "השוואת {count} ספקים",
        rating: "דירוג",
        reviews: "ביקורות",
        responseTime: "זמן תגובה",
        responseRate: "שיעור תגובה",
        onTimeDelivery: "הובלה בזמן",
        established: "הוקם בשנת",
        years: "שנים",
        employees: "עובדים",
        productCount: "מספר מוצרים",
        minOrderValue: "ערך הזמנה מינימלי",
        contactForMOQ: "צור קשר לקבלת הזמנה מינימלית",
        exportMarkets: "שווקי ייצוא",
        certifications: "הסמכות",
        contactSupplier: "צור קשר עם הספק",
        viewProfile: "צפה בפרופיל",
        addMore: "הוסף {count} ספקים נוספים להשוואה",
        selectSupplier: "בחר ספק",
      }
    },
    products: {
      pageTitle: "גלה מוצרים",
      pageDescription: "עיין ב-{productCount}+ מוצרים מיצרנים בדוקים בכל העולם",
      searchPlaceholder: "חפש מוצרים, קטגוריות...",
      categoryLabel: "קטגוריה",
      allCategories: "כל הקטגוריות",
      sortLabel: "מיין לפי",
      priceLow: "מחיר: מנמוך לגבוה",
      priceHigh: "מחיר: מגבוה לנמוך",
      lowestMOQ: "הזמנה מינימלית נמוכה",
      newestFirst: "החדש ביותר קודם",
      mostPopular: "הפופולארי ביותר",
      productsFound: "מוצרים נמצאו",
      sortDisplay: "מיון:",
      verified: "מאומת",
      moqLabel: "הזמנה מינימלית:",
      daysLabel: "ימים",
      inquiriesLabel: "שאילתות",
      noProductsFound: "לא נמצאו מוצרים",
      errorLoadingProducts: "שגיאה בטעינת מוצרים",
    },
    suppliersMap: {
      globalNetwork: "רשת גלובלית",
      pageTitle: "מפת ספקים עולמית",
      pageDescription: "גלה יצרנים וספקים מכל רחבי העולם. מצא את השותף המושלם לצרכי ההשווא שלך.",
      searchPlaceholder: "חפש מדינות או אזורים...",
      reviewedSuppliersLabel: "ספקים שנבדקו",
      countriesLabel: "מדינות",
      industriesLabel: "תעשיות",
      productsLabel: "מוצרים",
      exploreByRegion: "חקור לפי אזור",
      clickRegionToView: "לחץ על אזור כדי לצפות בספקים מאזור זה",
      suppliers: "ספקים",
      worldsManufacturingHub: "מרכז ייצור עולמי",
      qualityPrecisionManufacturing: "ייצור איכות ודיוק",
      innovationTechnologyLeaders: "מנהיגי חדשנות וטכנולוגיה",
      emergingManufacturingMarkets: "שווקי ייצור חדשים",
      highQualityProduction: "ייצור באיכות גבוהה",
      countriesIn: "מדינות ב-{region}",
      countriesAvailable: "מדינות זמינות",
      viewAllCountries: "צפה בכל {count} המדינות",
      topManufacturingCountries: "מדינות ייצור מובילות",
      countriesMostReviewedSuppliers: "מדינות עם רוב הספקים המבוקרים בפלטפורמה שלנו",
      viewAllSuppliers: "צפה בכל הספקים",
      growth: "גדילה",
      cantFindTitle: "לא מוצא את מה שחיפשת?",
      cantFindDesc: "הגש בקשת לצעד ותן ליצרנים משומרים לבוא אליך עם הצעות תחרותיות.",
      submitRFQ: "הגש בקשה לצעד",
      browseAllSuppliers: "עיין בכל הספקים",
    },
    whyUse: {
      buyerTitle: "מדוע קונים בוחרים ב-SourceNest",
      buyerSubtitle: "כל מה שאתה צריך כדי למצוא ולהתחבר עם היצרנים הנכונים - ללא עלות",
      bb1Title: "חינם לתמיד לקונים",
      bb1Desc: "חפש, השווה, שלח הודעות ובקש הצעות מחיר - הכל בחינם לחלוטין. ללא עמלות נסתרות, ללא צורך במנוי.",
      bb2Title: "ספקים שנבדקו בלבד",
      bb2Desc: "כל יצרן נבדק ומאושר על ידי הצוות שלנו על סמך מידע שהוגש לפני שהוא מופיע בפלטפורמה.",
      bb3Title: "תפוצה גלובלית",
      bb3Desc: "גישה למפעלים מ-50+ מדינות בכל אזורי הייצור הגדולים בעולם.",
      bb4Title: "תקשורת ישירה",
      bb4Desc: "שוחח ישירות עם נציגי המפעל, ללא מעורבות של מתווכים.",
      bb5Title: "השווה והחלט",
      bb5Desc: "השוואת ספקים זה לצד זה עם מידע מפורט על יכולות, אישורים ותמחור.",
      bb6Title: "חסוך זמן",
      bb6Desc: "תהליך הצעות מחיר יעיל, תיבת דואר נכנס מאורגנת ושמירת ספקים שומרים על יעילות העבודה שלך.",
      mfgTitle: "מדוע יצרנים מצטרפים",
      mfgSubtitle: "הרחב את התפוצה שלך והתחבר עם קונים רלוונטיים באמצעות פלטפורמה אמינה",
      mb1Title: "נראות גלובלית",
      mb1Desc: "שים לב אליך יבואנים וקונים מרחבי העולם שמחפשים את המוצרים שלך.",
      mb2Title: "מיצוב פרימיום",
      mb2Desc: "הצג את המפעל שלך עם פרופיל מקצועי, קטלוגי מוצרים ואישורים שהוגשו.",
      mb3Title: "לידים איכותיים",
      mb3Desc: "קבל פניות מקונים רציניים שכבר חקרו את היכולות שלך.",
      whyPayTitle: "למה יצרנים משלמים כדי להצטרף?",
      whyPayDesc: "SourceNest היא חינמית לקונים כדי להבטיח תפוצה מקסימלית ליצרנים. מפעלים משלמים מנוי כדי לממן את פיתוח הפלטפורמה, תהליכי בדיקה ותכונות פרימיום. מודל זה מבטיח שרק יצרנים רציניים ומחויבים מצטרפים — מעניק לקונים ביטחון בכל ספק שהם מגלים."
    },
    featured: {
      suppliersTitle: "ספקים מובילים שנבדקו",
      suppliersSubtitle: "גלה יצרנים מובילים שנבחרו בקפידה על ידי הצוות שלנו",
      viewAllSuppliers: "צפה בכל הספקים",
      productsTitle: "קטגוריות פופולריות",
      productsSubtitle: "השג מוצרים נמכרים ביותר ישירות מיצרנים מאומתים",
      industriesBadge: "תעשיות פופולריות",
      industriesTitle: "חפש ספקים לפי תעשייה",
      industriesSubtitle: "גלה יצרנים בדוקים על פני מגזרים תעשייתיים עיקריים. כל קטגוריה כוללת ספקים מאומתים המוכנים לעמוד בדרישות שלך.",
      suppliersLabel: "מורדים",
      exploreButton: "חקור",
    },
    trust: {
      title: "רכש המבוסס על אמון",
      subtitle: "כל חיבור ב-SourceNest מגובה במחויבות הבלתי מתפשרת שלנו לאיכות ושקיפות",
      t1Title: "יכולות מאומתות",
      t1Desc: "תהליך הבדיקה היסודי שלנו מבטיח שכל יצרן הוא אמיתי, מסוגל ומוכן לספק.",
      t2Title: "יושר הפלטפורמה",
      t2Desc: "אנו פועלים בשקיפות מלאה. ללא עמלות נסתרות, ללא דירוגים בתשלום - רק קשרי B2B אמיתיים.",
      t3Title: "תקנים גלובליים",
      t3Desc: "אנו מוודאים עמידה בתקני ייצור ובקרת איכות בינלאומיים.",
      t4Title: "תמיכה ייעודית",
      t4Desc: "מומחי הרכש שלנו זמינים להדריך אותך דרך דרישות ייצור מורכבות.",
      badge: "אמון ובדיקה",
      learnMore: "למד על תהליך הבדיקה שלנו",
      reviewedBadge: "SourceNest נבדק",
      point1: "מידע עסקי סופק",
      point2: "פרטי מפעל סופקו",
      point3: "אישורים (אם סופקו)",
      point4: "ניסיון בייצוא (אם סופק)",
      point5: "מידע הפרופיל נבדק"
    },
    testimonials: {
      title: "מה הקהילה שלנו אומרת",
      subtitle: "הצטרף לאלפי עסקים מצליחים שצומחים גלובלית"
    },
    faq: {
      title: "שאלות נפוצות",
      subtitle: "כל מה שצריך לדעת על השימוש ב-SourceNest",
      moreQuestions: "יש לך שאלות נוספות?",
      viewFull: "צפה בשאלות הנפוצות המלאות"
    },
    cta: {
      buyerTitle: "מוכן למצוא את היצרן שלך?",
      buyerDesc: "הצטרף לאלפי קונים שכבר משתמשים ב-SourceNest כדי לייעל את הרכש הגלובלי שלהם.",
      buyerBtn: "התחל בחיפוש עכשיו",
      mfgTitle: "האם אתה יצרן?",
      mfgDesc: "הצב את המפעל שלך מול קונים פעילים ברחבי העולם.",
      mfgBtn: "הצטרף כיצרן"
    },
    footer: {
      slogan: "SourceNest מקל על התחברויות בין משתמשים עצמאיים ואינו נושא אחריות על עסקאות בניהם.",
      platform: "פלטפורמה",
      forBuyers: "לקונים",
      forMfg: "ליצרנים",
      pricing: "תמחור",
      search: "חיפוש",
      discover: "גלה",
      browseSuppliers: "עיין בספקים",
      browseProducts: "עיין במוצרים",
      industries: "תעשיות",
      rfq: "בקש הצעת מחיר",
      resources: "משאבים",
      helpCenter: "מרכז עזרה",
      reviewProcess: "תהליך בדיקה",
      faq: "שאלות נפוצות",
      blog: "בלוג ותובנות",
      company: "חברה",
      aboutUs: "אודותינו",
      contact: "צור קשר",
      buyerDash: "לוח בקרת קונה",
      mfgDash: "לוח בקרת יצרן",
      legal: "משפטי",
      privacy: "מדיניות פרטיות",
      terms: "תנאי שימוש",
      cookie: "מדיניות קובצי Cookie",
      popular: "תעשיות פופולריות",
      viewAll: "צפה בכל התעשיות",
      rights: "כל הזכויות שמורות."
    },
    forBuyers: {
      hero: {
        badge: "100% חינם לקונים",
        title: "סור בעולם, לגמרי חינם",
        subtitle: "חפש ספקים מבדוקים, השווה מפעלים, בקש הצעות מחיר, וקשר ישירות ליצרנים — הכל לגמרי חינם. SourceNest חינם לקונים, לנצח.",
        signupButton: "צור חשבון חינם",
        browseButton: "דפדף בספקים",
      },
      featuresTitle: "כל מה שאתה צריך כדי לסור בחוכמה יותר",
      featuresSubtitle: "כלים חזקים שנועדו לפשט את כל זרימת העבודה של הסורס שלך",
      features: {
        search: {
          title: "חפש ספקים",
          description: "גשש לספריית הגלוית של יצרנים מבדוקים שלנו. סנן לפי תעשייה, מקום, הסמכות, כמות הזמנה מינימלית, ועוד כדי למצוא את השותפים המושלמים.",
        },
        compare: {
          title: "השווה מפעלים",
          description: "הוסף ספקים לרשימת ההשוואה שלך והערך אותם זה לצד זה. השווה יכולות, הסמכות, זמני הובלה, ועוד.",
        },
        messaging: {
          title: "הודעות ישירות",
          description: "צא לשיחה ישירה עם נציגי המפעל דרך הפלטפורמה המאובטחת שלנו. אין תיווכים, אין סמסרים — רק קשר ישיר.",
        },
        rfq: {
          title: "בקש הצעות מחיר",
          description: "הגש בקשות הצעות מחיר מפורטות עם מפרט, כמויות וד require requirements. קבל הצעות תחרותיות ישירות מיצרנים.",
        },
        favorites: {
          title: "שמור מועדפים",
          description: "שמור ספקים ומוצרים למועדפים שלך לגישה קלה. בנה את רשימת הספקים המועדפים שלך לאורך זמן.",
        },
        catalogs: {
          title: "הוריד קטלוגים",
          description: "גשש והוריד קטלוגי מוצרים, דפי מפרט וחוברות חברה מספקים מבדוקים.",
        },
        dashboard: {
          title: "לוח בקרה מאורגן",
          description: "נהל את כל פעילות הסורסים שלך במקום אחד. עקוב אחרי הודעות, RFQs, פריטים שנשמרו ויחסי ספקים.",
        },
        notifications: {
          title: "הודעות חכמות",
          description: "קבל הודעות כאשר ספקים משיבים לשאיליותייך, כאשר ספקים חדשים תואמים את ההעדפות שלך, ועוד.",
        },
      },
      benefitsTitle: "למה קונים אוהבים את SourceNest",
      benefitsSubtitle: "הצטרף לאלפים של אנשי רכש, יובאים וממנהלי סורסים שמאמינים ב-SourceNest לצרכי הסורסים העולמיים שלהם.",
      benefits: {
        free: "לגמרי חינם להשתמש — אין מנוי, אין עמלות מוסתרות",
        reviewed: "רק ספקים מבדוקים ומאושרים בפלטפורמה",
        directComm: "קשר ישיר עם נציגי המפעל",
        comparison: "כלי השוואה של ספקים זה לצד זה",
        secure: "מערכת בטוחה ל-RFQs והודעות",
        catalogs: "גישה לקטלוגי מוצרים ומפרטים",
        dashboard: "לוח בקרה מאורגן לכל פעילות סורסים",
        global: "הגעה גלוית על פני 50+ מדינות ייצור",
      },
      benefitBoxTitle: "למה זה חינם לקונים?",
      benefitBoxDescription1: "מודל העסק שלנו פשוט: יצרנים משלמים מנוי כדי להיות רשומים בפלטפורמה, בעוד קונים משתמשים בה בחינם. זה מבטיח הגעה מקסימלית לספקים תוך מתן לך גישה לכלי סורסים פרימיום ללא עלות.",
      benefitBoxDescription2: "על ידי שמירה על הפלטפורמה חינם לקונים, אנו משכנעים אנשי רכש רציניים יותר — אשר בתורם הופך את הפלטפורמה לערכית יותר ליצרנים. הכל ניצח.",
      ctaTitle: "התחל סורסים היום",
      ctaSubtitle: "צור את חשבונך החינם בשניות והתחל להתחבר ליצרנים מבדוקים ברחבי העולם.",
      ctaButton: "צור חשבון קונה חינם",
    }
  },
  forManufacturers: {
    hero: {
      badge: "הגדל את עסקי הייצוא שלך",
      title: "הגע לקונים גלובליים, הגדל את המפעל שלך",
      subtitle: "צור את הדוכן הדיגיטלי שלך, הצג מוצרים והתחבר ליבואנים ואנשי רכש ברחבי העולם באמצעות פלטפורמת ה-B2B המובחרת של SourceNest.",
      viewPricing: "צפה בתוכניות התמחור",
      getStarted: "התחל עכשיו"
    },
    features: {
      title: "כל מה שאתה צריך כדי להצליח",
      subtitle: "כלים עוצמתיים להצגת המפעל שלך וחיבור לקונים הנכונים",
      f1Title: "פרופיל חברה מקצועי",
      f1Desc: "צור דוכן דיגיטלי מקיף המציג את המפעל, היכולות, האישורים וכושר הייצור שלך.",
      f2Title: "נראות גלובלית",
      f2Desc: "התגלה על ידי יבואנים ואנשי רכש מכל העולם המחפשים ספקים באופן פעיל.",
      f3Title: "תקשורת ישירה עם קונים",
      f3Desc: "קבל פניות והשב להן ישירות דרך הפלטפורמה שלנו. שוחח עם קונים רציניים ללא מתווכים.",
      f4Title: "ניהול בקשות להצעת מחיר (RFQ)",
      f4Desc: "קבל בקשות להצעת מחיר מפורטות עם מפרטים. השב עם הצעות תחרותיות כדי לזכות בעסקאות חדשות.",
      f5Title: "אנליטיקה של ביצועים",
      f5Desc: "עקוב אחר צפיות בפרופיל, שיעורי פניות ומדדי מעורבות. הבן מה הקונים מחפשים.",
      f6Title: "תג נבדק",
      f6Desc: "לאחר האישור, קבל את תג SourceNest Reviewed - סימן אמון שעוזר לך להתבלט בפני קונים."
    },
    howItWorks: {
      title: "איך מתחילים",
      subtitle: "תהליך פשוט להצגת המפעל שלך ב-SourceNest",
      step1Title: "צור את החשבון שלך",
      step1Desc: "הירשם כיצרן ובחר את תוכנית המנוי שמתאימה לצרכי העסק ולמטרות הצמיחה שלך.",
      step2Title: "הגש לאישור",
      step2Desc: "כשתהיה מוכן, הגש את חשבונך לסקירה. הצוות שלנו יסקור את העסק שלך לפני מתן גישה לפלטפורמה.",
      step3Title: "השלם תשלום",
      step3Desc: "לאחר שחשבונך נסקר ואושר, השלם את התשלום שלך כדי להפעיל את חשבונך ולהתחיל להשתמש בפלטפורמה.",
      step4Title: "בנה את הפרופיל שלך",
      step4Desc: "השלם את פרופיל המפעל שלך עם פרטים, אישורים, יכולות והעלה את קטלוג המוצרים והעלונים שלך.",
      step5Title: "העלה מוצרים",
      step5Desc: "הוסף את המוצרים שלך עם תמונות, מפרטים, MOQ, זמני אספקה ופרטי אריזה כדי להציג את המגוון המלא שלך.",
      step6Title: "לך לעולם",
      step6Desc: "לאחר האישור, הפרופיל שלך עולה לאוויר. התחל לקבל פניות ובקשות להצעת מחיר מקונים ברחבי העולם.",
      important: "חשוב: אין צורך בתשלום מראש. חשבונך ייבדק תחילה, ותחויב רק לאחר האישור.",
      afterApproval: "לאחר האישור, השלם את התשלום שלך כדי להפעיל את חשבונך ולפתוח גישה מלאה לפלטפורמה."
    },
    benefits: {
      whyChoose: "מדוע יצרנים בוחרים ב-SourceNest",
      desc1: "בניגוד לפלטפורמות B2B כלליות, SourceNest בנויה במיוחד לחיבור יצרנים איכותיים עם קונים רציניים. תהליך הבדיקה שלנו עוזר להבטיח שאתה מוקף בעסקים מסוננים, והמיצוב היוקרתי שלנו מושך צוותי רכש מקצועיים.",
      desc2: "עם תוכניות מנוי משתלמות וללא עמלות על עסקאות, SourceNest מציעה ערך יוצא דופן למפעלים המעוניינים להרחיב את התפוצה הגלובלית שלהם.",
      title: "יתרונות ההצטרפות",
      b1: "הגע לקונים מוסמכים המחפשים ספקים באופן פעיל",
      b2: "הצג את המפעל שלך עם פרופיל מקצועי ומלוטש",
      b3: "קבל לידים איכותיים ובקשות להצעת מחיר ישירות לתיבת הדואר שלך",
      b4: "הצג אישורים ובנה אמינות",
      b5: "התרחב לשווקים ואזורים חדשים",
      b6: "ללא עמלות - שלם רק את המנוי שלך"
    },
    cta: {
      title: "מוכן להגיע לקונים גלובליים?",
      subtitle: "הצטרף ל-SourceNest היום והתחל לקבל פניות מיבואנים ברחבי העולם.",
      choosePlan: "בחר את התוכנית שלך",
      contactSales: "צור קשר עם המכירות"
    }
  },
  pricing: {
    hero: {
      title: "תמחור פשוט וקריסטל",
      subtitle: "בחר בתוכנית המתאימה לעסקך. כל התוכניות כוללות תהליך בדיקה וקבלה של מנהל.",
      buyersNote: "התמחור מיועד ליצרנים בלבד. קונים יכולים להשתמש ב-SourceNest בחינם."
    },
    founding: {
      badge: "הצע מוגבל זמן",
      title: "הצטרף כיצרן מייסד",
      subtitle: "היה בין 300 היצרנים הראשונים שהצטרפו ל-SourceNest וקבל גישה חינם למשך 6 חודשים לתוכנית {plan} המלאה - בשווי $1,794.",
      plan: "Growth",
      freeFor: "חינם ל-6 חודשים",
      saveBadge: "חסוך $1,794",
      noCardRequired: "אין צורך בכרטיס אשראי",
      description: "קבל את כל תכונות תוכנית {plan} המלאה בחינם ל-6 חודשים. לאחר תקופת הניסיון, בחר בכל תוכנית בתשלום כדי לשמור על חשבונך פעיל.",
      spotsRemaining: "מקומות שנותרו:",
      button: "בקש להיות חבר מייסד",
      note: "כפוף לבדיקה וקבלה של מנהל",
      badge2: "300 הראשונים בלבד",
      cardTitle: "יצרן מייסד",
      cardSubtitle: "תוכנית ספק מוקדם",
      cardFeatures: {
        companyProfile: "פרופיל החברה",
        products100: "עד 100 מוצרים",
        internalMessaging: "הודעות פנימיות",
        inquiryAndRfq: "תיבת בירור וקבלת RFQ",
        catalogUpload: "העלאת קטלוג",
        certificationsAndMarkets: "הסמכות ושווקי ייצוא",
        advancedAnalytics: "ניתוח מתקדם",
        prioritySearch: "עדיפות חיפוש",
        featuredBadge: "תג ספק מובחר",
        teamUsers3: "מספר משתמשי צוות (3)"
      }
    },
    features: {
      companyProfile: "פרופיל החברה",
      products25: "עד 25 מוצרים",
      products100: "עד 100 מוצרים",
      productsUnlimited: "מוצרים בלא הגבלה",
      internalMessaging: "הודעות פנימיות",
      inquiryInbox: "תיבת בירור",
      rfqReception: "קבלת RFQ",
      catalogUpload: "העלאת קטלוג",
      certificationsSection: "סעיף הסמכות",
      exportMarketsSection: "סעיף שווקי ייצוא",
      basicAnalytics: "ניתוח בסיסי",
      advancedAnalytics: "ניתוח מתקדם",
      enterpriseAnalytics: "ניתוח ארגוני",
      prioritySearchVisibility: "עדיפות חיפוש",
      premiumSearchPlacement: "מיקום חיפוש פרימיום",
      featuredSupplierBadge: "תג ספק מובחר",
      multipleTeamUsers: "מספר משתמשי צוות",
      multipleTeamUsers3: "מספר משתמשי צוות (3)",
      unlimitedTeamUsers: "משתמשי צוות ללא הגבלה",
      premiumSupport: "תמיכה פרימיום",
      dedicatedAccountManager: "מנהל חשבון ייעודי",
      prioritySupport: "תמיכה בעדיפות",
      customOnboarding: "הדרכה מותאמת אישית"
    },
    paidPlans: {
      title: "תוכניות בתשלום",
      subtitle: "ליצרנים המוכנים למקסימום נראות והשגה",
      monthly: "חודשי",
      yearly: "שנתי",
      savePercentage: "חסוך 17%",
      starter: {
        name: "Starter",
        description: "ליצרנים קטנים המתחילים את הדרך בעסקי ייצוא",
        monthlyPrice: 149,
        yearlyPrice: 1490,
        cta: "התחל עכשיו"
      },
      growth: {
        name: "Growth",
        description: "ליצרנים מבוססים המחפשים חשיפה נוספת",
        monthlyPrice: 299,
        yearlyPrice: 2990,
        cta: "התחל עכשיו",
        badge: "הפופולרי ביותר"
      },
      enterprise: {
        name: "Enterprise",
        description: "ליצרנים גדולים עם דרישות מותאמות",
        price: "מותאם אישית",
        cta: "צור קשר עם המכירות"
      },
      billedAnnually: "חויוב שנתי (${price}/חודש)",
      pricePerCycle: "{cycle}"
    },
    approval: {
      title: "נדרשת קבלה",
      description: "התשלום לא ינסה את הפרופיל שלך באופן אוטומטי. כל חשבונות היצרנים עוברים תהליך בדיקה לפני שהם הופכים לנראים לקונים. זה מבטיח איכות והשקעה בפלטפורמה."
    },
    comparison: {
      title: "השווה את כל התכונות",
      subtitle: "ראה בדיוק מה כלול בכל תוכנית",
      feature: "תכונה",
      productsLimit: "הגבלת מוצרים",
      teamMembers: "חברי צוות",
      searchVisibility: "נראות חיפוש",
      analytics: "אנליטיקה",
      featuredBadge: "תג ספק מובחר",
      accountManager: "מנהל חשבון",
      supportLevel: "רמת תמיכה",
      standard: "סטנדרטי",
      priority: "ראשוני",
      premium: "פרימיום",
      basic: "בסיסי",
      advanced: "מתקדם",
      enterpriseLevel: "רמת ארגון",
      email: "דוא\"ל",
      priorityEmail: "דוא\"ל עדיפות",
      dedicated: "ייעודי",
      unlimited: "בלתי מוגבל",
      notIncluded: "לא כלול"
    },
    faq: {
      title: "שאלות נפוצות על תמחור",
      q1: "האם התשלום מפרסם את הפרופיל שלי באופן אוטומטי?",
      a1: "לא. התשלום יוצר את חשבון היצרן שלך, אך הפרופיל שלך עדיין חייב לעבור את תהליך הבדיקה והקבלה שלנו לפני שהוא הופך לנראה לקונים. זה בדרך כלל לוקח 2-5 ימי עסקים לאחר שתוגש הפרופיל המלא שלך.",
      q2: "מה קורה אם הפרופיל שלי אינו מאושר?",
      a2: "אם הפרופיל שלך אינו עומד בדרישות שלנו, נספק משוב ספציפי לגבי מה שיש לעדכן. אתה יכול לבצע את השינויים הדרושים ולהגיש שוב. אם הקבלה בסופו של דבר אינה אפשרית, אנו מציעים החזר מלא תוך 30 ימים.",
      q3: "האם אני יכול לשדרג או להוריד תוכנית?",
      a3: "כן, אתה יכול לשנות את התוכנית שלך בכל עת. בעת שדרוג, תחויב בהפרש המחושב בפרופורציה. בעת הורדה, התעריף החדש יחול במחזור החיוב הבא.",
      q4: "מה זה תוכנית יצרן המייסד?",
      a4: "תוכנית יצרן המייסד היא הצעה מוגבלת זמן ל-300 היצרנים הראשונים שהצטרפו ל-SourceNest. כחבר מייסד, אתה מקבל גישה חינם למשך 6 חודשים לתוכנית Growth המלאה (שווי $299/חודש) - כולל עד 100 מוצרים, אנליטיקה מתקדמת, נראות חיפוש עדיפות, תג ספק מובחר וחברי צוות מרובים. אין צורך בכרטיס אשראי כדי להתחיל.",
      q5: "מה קורה לאחר סיום תקופת האחסון החינם של 6 חודשים?",
      a5: "לאחר סיום תקופת הניסיון החינם של 6 חודשים, תצטרך לבחור ולשלם עבור אחת מהתוכניות שלנו (Starter, Growth או Enterprise) כדי להמשיך להשתמש בפלטפורמה. אנו נשלח לך תזכורות לפני תום תקופת הניסיון שלך כדי שיהיה לך זמן רב לבחור בתוכנית המתאימה לעסקך.",
      q6: "האם תוכנית יצרן המייסד עדיין זמינה?",
      a6: "התוכנית זמינה עד שנגיע ל-300 רישום יצרן מאושר (יישומים בהמתנה לא נספרים לעבר הגבול). אתה יכול לראות את המקומות הנותרים בעמוד התמחור שלנו. ברגע שכל המקומות מתמלאים, התוכנית תיסגר והיצרנים החדשים יצטרכו לבחור בתוכנית בתשלום.",
      q7: "האם יש עמלות עמלה על מכירות?",
      a7: "לא. SourceNest אינו גובה עמלה כלשהי על עסקאות שאתה סוגר דרך הפלטפורמה. דמי המנוי שלך הם העלות היחידה שלך.",
      q8: "אילו שיטות תשלום אתה מקבל?",
      a8: "אנחנו מקבלים את כל כרטיסי האשראי הגדולים (Visa, Mastercard, American Express) ו-PayPal. עבור תוכניות Enterprise, אנו מציעים גם אפשרויות העברה בנקאית."
    },
    cta: {
      title: "מוכן להתחיל?",
      subtitle: "הצטרף ל-SourceNest והתחל להגיע לקונים גלובליים היום.",
      createAccount: "צור חשבון",
      talkToSales: "דבר עם המכירות"
    },
    payment: {
      title: "השלם את התשלום שלך",
      plan: "תוכנית",
      success: "התשלום בוצע בהצלחה!",
      transactionId: "מזהה עסקה:",
      redirecting: "מפנה להרשמה...",
      failed: "התשלום נכשל",
      tryAgain: "נסה שוב",
      priceInfo: "תוכנית {plan} ({cycle})",
      processingTime: "💡 זה בדרך כלל לוקח 2-5 ימי עסקים."
    }
  },

  // ── Verification / Review Process Page ──────────────────────────────
  verification: {
    hero: {
      badge: "אמון וכיכולת",
      title: "תהליך הסקירה שלנו",
      description: "ספקים ב-SourceNest עוברים תהליך סקירה על בסיס מידע שהוגש. תהליך זה מכוונן לשיפור השקיפות ואינו מהווה אימות או הבטחה מכל סוג."
    },
    whyMatters: {
      title: "מדוע תהליך הסקירה שלנו חשוב",
      intro: "בעולם של התסיס B2B, אמון חיוני. קונים זקוקים לביטחון בעת התחברות לספקים. פלטפורמות מסורתיות בדרך כלל מאפשרות לכל אחד לרשום, מה שיכול להקשות על הערכת אפשרויות ודורש יותר מאמץ מקונים.",
      approach: "SourceNest נוקטת בגישה שונה. אנו שואפים לסקור פרופילים של יצרנים וממלומעת שהוגשה לסיוע בשיפור השקיפות ותמיכה בקבלת החלטות טובות יותר לפני שספקים מופיעים בפלטפורמה.",
      benefits: "יתרונות תהליך הסקירה שלנו",
      benefit1: "קונים יכולים לגשת לממלומעת של הספקים בבהירות רבה יותר",
      benefit2: "יצרנים נהנים מהיותם חלק משוק מוקד לאיכות",
      benefit3: "הפלטפורמה מעודדת תקנים גבוהים יותר",
      benefit4: "התהליך עוזר לפשט את הגילוי של ספקים"
    },
    steps: {
      title: "כיצד אנו סוקרים ספקים",
      subtitle: "תהליך הסקירה מרובי שלבים שלנו מבטיח סינון כולל בהתאם לממלומעת שהוגשה",
      documentReview: {
        title: "סקירת מסמכים",
        description: "אנו סוקרים ממלומעת חברה ומסמכים זמינים לסיוע בשקיפות ובנייה אמון.",
        item1: "תעודת רישום עסקי",
        item2: "רישיונות ייבוא/ייצוא (כשרלוונטי)",
        item3: "הסמכות תעשיתיות (ISO, CE, FDA וכו')",
        item4: "מסמכי רישום מס (כשרלוונטי)"
      },
      factoryReview: {
        title: "סקירת ממלומעת המפעל",
        description: "אנו סוקרים ממלומעת מפעל בסיסית וכושר ייצור.",
        item1: "ממלומעת מיקום המפעל",
        item2: "יכולות ייצור",
        item3: "ציוד ומכונות",
        item4: "גודל המפעל והכוח העובד"
      },
      profileReview: {
        title: "סקירת פרופיל",
        description: "אנו סוקרים תוכן הפרופיל לאיכות ודיוק.",
        item1: "תיאור החברה נסקר",
        item2: "איכות ממלומעת המוצר הוערכה",
        item3: "תמונות ומדיה נסקרו",
        item4: "ממלומעת יצירת קשר בדוקה"
      },
      monitoring: {
        title: "ניטור מתמשך",
        description: "אנו נוטרים פעילות ספקים ותגובות קנייה לאורך זמן.",
        item1: "זמן תגובה",
        item2: "תגובות קונים",
        item3: "ביצוע כללי",
        item4: "בדיקות איכות"
      }
    },
    badges: {
      title: "תגים אמון מוסברים",
      subtitle: "מה תגי הסקירה שלנו מסמל עבורך",
      reviewed: {
        name: "SourceNest סקור",
        description: "ספקים הגישו ממלומעת חברה ודברו סקירה בסיסית להיות רשומים בפלטפורמה."
      },
      featured: {
        name: "ספקים מובחרים",
        description: "ספקים מובחרים בהתאם לפעילות, תגובתיות ותגובות קונים."
      },
      exportReady: {
        name: "מוכן לייצוא",
        description: "ספקים מציינים ניסיון בשייט בינלאומי."
      }
    },
    rejected: {
      title: "מה אם הבקשה שלי לא אושרה?",
      content: "אם בקשת היצרן שלך לא ניתן אישור על בסיס הממלומעת המסופקת, אנו עשויים לשתף הערות על מה ניתן לשפר. אתה יכול לעדכן את הפרטים שלך ולהגיש מחדש את הבקשה שלך בכל עת. אנא שים לב כי לא נדרש תשלום במהלך תהליך הבקשה, והתשלום יתבקש רק לאחר אישור.",
      reasons: "סיבות נפוצות להגשה מחדש:",
      reason1: "ממלומעת לא מלאה או לא ברורה",
      reason2: "פרטי עסק חסרים",
      reason3: "בעיות איכות תוכן הפרופיל",
      reason4: "ממלומעת סותרת",
      resubmit: "אתה יכול להתמודד עם הבעיות ולהגיש מחדש את הבקשה שלך. אם אישור בסופו של דבר אינו אפשרי."
    },
    cta: {
      title: "מוכן לסקירה?",
      subtitle: "הצטרף ל-SourceNest והציג את המפעל שלך לקונים בכל העולם.",
      viewPlans: "הצג תוכניות והתחל",
      readFaq: "קרא שאלות נפוצות"
    }
  },

  // ── Help Center ─────────────────────────────────────────────────────
  help: {
    hero: {
      title: "כיצד נוכל לעזור לך?",
      subtitle: "מצא תשובות לשאלות נפוצות או פנה לצוות התמיכה שלנו.",
      searchPlaceholder: "חיפוש במאמרי עזרה..."
    },
    contactSupport: {
      title: "עדיין צריך עזרה?",
      subtitle: "לא יכול למצוא מה שאתה חיפש? צוות התמיכה שלנו כאן לעזור.",
      contactButtonText: "צור קשר עם התמיכה",
      faqButtonText: "הצג שאלות נפוצות"
    },
    browseCategoryTitle: "עיין לפי קטגוריה",
    viewAllArticles: "הצג את כל המאמרים",
    popularArticlesTitle: "מאמרים פופולריים",
    backToHelp: "חזור למרכז העזרה",
    backToCategory: "חזור ל- {category}",
    wasHelpful: "האם מאמר זה היה שימושי?",
    contactSupportCta: "צור קשר עם התמיכה",
    categories: {
      buyers: {
        title: "לקונים",
        description: "למד כיצד לחפש, להשוות ולהתחבר לספקים",
        articles: {
          searchSuppliers: {
            title: "כיצד לחפש ספקים",
            content: "מציאת שותף ייצור מתאים היא קריטית להצלחת העסק שלך. SourceNest מספק כלים חיפוש וסינון חזקים כדי לעזור לך לגלות ספקים סקורים בכל העולם.",
            steps: [
              "השתמש בשורת החיפוש הראשית כדי להזין שמות מוצרים, קטגוריות או מילות מפתח",
              "החל מסננים כדי לצמצם תוצאות לפי מדינה, תעשייה, רמת סקירה וטווח ה-MOQ",
              "מיין תוצאות לפי רלוונטיות, דירוג או זמן תגובה",
              "לחץ על כרטיסי ספקים כדי להציג פרופילים מפורטים",
              "השתמש בכפתור 'שמור' כדי להעיר ספקים להשוואה מאוחרת יותר"
            ]
          },
          compareSave: {
            title: "השוואה וחיסכון בספקים",
            content: "כלים ההשוואה שלנו עוזרים לך להעריך מספר ספקים זה לצד זה לקבלת החלטות מדעות.",
            steps: [
              "לחץ על אייקון הלב בכל כרטיס ספקים כדי לשמור אותם",
              "אפשר גישה לספקים שנשמרו מלוח הבקרה שלך",
              "בחר עד 4 ספקים להשוואה",
              "צפה בהשוואה זה לצד זה של יכולות, תמחור והסמכות",
              "ייצוא דוחות השוואה לבדיקת צוות"
            ]
          },
          sendMessages: {
            title: "שליחת הודעות למפעלות",
            content: "תקשורת ישירה עם ספקים היא מפתח לייצור מוצלח. מערכת ההודעות שלנו מקלה על שאילתה, משא ומתן ובנייה של קשרים.",
            steps: [
              "בקרו בכל פרופיל ספקים לחץ על 'צור קשר עם הספק'",
              "כתוב הודעה ברורה ומפורטת לגבי הדרישות שלך",
              "צרף קבצים רלוונטיים כגון מפרטים או עיצובים",
              "עקוב אחר כל השיחות במרכז ההודעות שלך",
              "הפוך הודעות כדי להגיב בתשומת לב לתשובות הספקים"
            ]
          },
          requestQuotes: {
            title: "בקשת ציטוטים (RFQs)",
            content: "מערכת בקשת ציטוטים (RFQ) עוזרת לך להשיג ציטוטים תחרותיים מריבוי ספקים בו זמנית.",
            steps: [
              "עבור אל 'הגשת RFQ' מהתפריט הראשי או לוח הבקרה",
              "מלא פרטי מוצר, מפרטים ודרישות",
              "ציין כמות, מחיר יעד וציר זמן משלוח",
              "בחר לשלוח לספקים ספציפיים או לשדר לייצרנים רלוונטיים",
              "בדוק והשווה ציטוטים נכנסים בלוח הבקרה שלך"
            ]
          },
          manageDashboard: {
            title: "ניהול לוח הבקרה של הקונה שלך",
            content: "לוח הבקרה שלך הוא המרכז המרכזי לכל פעילויות היסוד שלך ב-SourceNest.",
            steps: [
              "הצג את ה-RFQs הפעילים שלך וההסטטוס שלהם",
              "גישה לספקים שנשמרו וחיפוש הקרוב",
              "נהל שיחות הודעות עם ספקים",
              "עקוב אחר היסטוריית הזמנות וייעוץ עם ספקים",
              "עדכן את הפרופיל שלך והעדפות ההודעות שלך"
            ]
          },
          createAccount: {
            title: "כיצד ליצור חשבון קונה",
            content: "יצירת חשבון קונה ב-SourceNest היא בחינם ונותנת לך גישה לאלפי ספקים סקורים בכל העולם.",
            steps: [
              "לחץ על 'הירשם' או 'הצטרף כקונה' בעמוד הבית",
              "הזן את כתובת הדוא\"ל שלך וצור סיסמה מאובטחת",
              "מלא את פרטי החברה הבסיסיים שלך",
              "אמת את כתובת הדוא\"ל שלך דרך קישור האישור",
              "השלם את הפרופיל שלך כקונה כדי לקבל המלצות ספק טובות יותר"
            ]
          },
          sendRfq: {
            title: "שלח את ה-RFQ הראשון שלך",
            content: "למד כיצד ליצור ולשלוח את בקשת הציטוט (RFQ) הראשונה שלך כדי להתחיל להשיג ציטוטים מייצרנים.",
            steps: [
              "התחבר לחשבון הקונה שלך וודא לעבור ל-'הגשת RFQ'",
              "בחר בקטגוריית מוצר המתאימה הטובה ביותר לצרכיך",
              "תאר את דרישות המוצר שלך בפירוט",
              "העלה כל מסמכים, שרטוטים או מפרטים רלוונטיים",
              "קבע את דרישות הכמות שלך, מחיר יעד וציפויות משלוח",
              "בדוק והגש את ה-RFQ שלך כדי להשיג ציטוטים מספקים תואמים"
            ]
          }
        }
      },
      manufacturers: {
        title: "לייצרנים",
        description: "מדריך להקמה וניהול של פרופיל המפעל שלך",
        articles: {
          gettingStarted: {
            title: "התחלה כייצרן",
            content: "!ברוכים הבאים ל-SourceNest. מדריך זה יעזור לך להקים חשבון ייצרן והתחל לקבל שאילתות מקונים גלובליים",
            steps: [
              "צור את החשבון שלך בחירת 'ייצרן' במהלך הרשמה",
              "השלם את פרופיל החברה שלך עם מידע עסקי מדויק",
              "העלה את קטלוג המוצרים שלך עם מפרטים מפורטים",
              "בקשת סקירה לבנוא אמון עם קונים",
              "אופטימיזציה של הפרופיל שלך כדי לשפר את הנראות בתוצאות החיפוש"
            ]
          },
          createProfile: {
            title: "יצירת פרופיל הממונה שלך",
            content: "פרופיל שלם ומושך הוא חיוני לאתר קונים איכותיים. הנה איך ליצור פרופיל ייצרן יעיל.",
            steps: [
              "הוסף את שם החברה הרשמי ופרטי ההרשמה",
              "בחר בתעשייה הראשית שלך וקטגוריות מוצרים",
              "העלה תמונות בעלות גבוהה של המפעל וההמוצרים",
              "כתוב תיאור חברה מפורט המדגיש את החוזקות שלך",
              "רשום את ההסמכות שלך, שוקי ייצוא והיכולת לייצור"
            ]
          },
          uploadProducts: {
            title: "העלאת מוצרים",
            content: "הצג את המוצרים שלך ביעילות כדי לאתר שאילתות קונים.",
            steps: [
              "עבור ללוח בקרה > מוצרים > הוסף מוצר",
              "הזן שם מוצר, קטגוריה ומפרטים מפורטים",
              "הומ תמונות מוצר מרובות בעלות גבוהה",
              "הגדר טווח מחיר, MOQ וזמן הובלה",
              "הוסף הסמכות רלוונטיות ואפשרויות התאמה"
            ]
          },
          manageInquiries: {
            title: "ניהול שאילתות ו-RFQs",
            content: "טיפול יעיל בשאילתות הוא המפתח להעברת עניין לקונים.",
            steps: [
              "מון את לוח הבקרה של הזעות שלך בקביעות",
              "הגב ל-RFQs חדש תוך 24 שעות לתוצאות הטובות ביותר",
              "הספק ציטוטים מפורטים עם קורי תמחור ברור",
              "שאל שאלות הבהרה אם דרישות לא ברורות",
              "עקוב אחר מקצועיות לבנוא קשרים"
            ]
          },
          analytics: {
            title: "הבנת הנתונים שלך",
            content: "השתמש בניתוח כדי לייעל את הנוכחות שלך ולשפר שיעורי המרה.",
            steps: [
              "בדוק את מראות הפרופיל דמוגרפיית מבקרים",
              "מון שיעורי שאילתות מוצר פריטים פופולריים",
              "עקוב אחר סטטיסטיקות זמן תגובה והודעה",
              "נתח שיעורי המרה משאילתה לציטוט",
              "זהה מגמות והתאם את הואסטרטגיה שלך בהתאם"
            ]
          },
          profileSetup: {
            title: "הקמת פרופיל הממונה שלך",
            content: "פרופיל ייצרן מותאם היטב הוא חזית ה-Digital שלך ב-SourceNest. הנה איך להקים אותו לנראות מרבית ותחושת קונה.",
            steps: [
              "עבור ללוח הבקרה שלך לחץ על 'עריכת פרופיל'",
              "העלה לוגו חברה מקצועי ותמונת כרזה",
              "כתוב תיאור חברה משךה (300-500 מילים מומלץ)",
              "הוסף תמונות מפעל, תמונות קו ייצור והסמכות",
              "מלא את כל פרטי העסק: שנת התאסיס, ספירת עובדים, הכנסה שנתית",
              "רשום את מוצרי המוצר החרדה שוקי ייצוא וההסמכות",
              "קבע את זמן התגובה שלך וערכי הזמנה מינימלי בדיוק"
            ]
          }
        }
      },
      billing: {
        title: "חשבונות ותוכניות",
        description: "מידע על מנויים, תשלומים וחשבוניות",
        articles: {
          subscriptionPlans: {
            title: "הבנת תוכניות המנוי",
            content: "SourceNest מציע תוכניות מנוי גמישות לייצרנים. בחר את התוכנית המתאימה הטובה ביותר לצרכי העסק שלך.",
            steps: [
              "סקור את כל התוכניות הזמינות בעמוד התמחור",
              "השוו תכונות, גבולות מוצר ורמות תמיכה",
              "תוכנית סטרטר לייצרנים חדשים",
              "תוכנית צמיחה עם אנליטיקה מתקדמת וקצץ על תמיכה",
              "תוכנית Enterprise עם ניהול חשבונות ייעודי"
            ]
          },
          paymentMethods: {
            title: "שיטות תשלום וחשבונות",
            content: "אנחנו מקבלים שיטות תשלום מרובות כדי להפוך את המנוי שלך קל ונוח.",
            steps: [
              "בחר את שיטת התשלום שלך במהלך התשלום",
              "כרטיס אשראי, כרטיס חיוב ו-PayPal מקובלים",
              "חשבוניות נוצרות באופן אוטומטי ונשלחות לדוא\"ל שלך",
              "עדכן את שיטת התשלום שלך בהגדרות החשבון שלך",
              "בטל או שנה את התוכנית שלך בכל עת"
            ]
          },
          invoices: {
            title: "ניהול חשבוניות וקבלות",
            content: "גש להיסטוריית התשלום שלך והורד חשבוניות בכל עת.",
            steps: [
              "עבור להגדרות > חשבונות",
              "הצג את היסטוריית החשבונית המלאה שלך",
              "הורד עותקי PDF של חשבוניות לרשומות שלך",
              "הדפס או שלח הודעות דוא\"ל לחשבונות למחלקה החשבונאית",
              "צור קשר עם התמיכה אם אתה צריך להטיל ספק בכל תשלום"
            ]
          }
        }
      }
    }
  },

  // ── About Page ──────────────────────────────────────────────────────
  about: {
    hero: {
      title: "הפיכת ספקים גלובליים לעבודה טובה יותר",
      subtitle: "SourceNest שואפת להמיר את הדרך בה עסקים מוצאים ומתחברים לשותפי ייצור ברחבי העולם."
    },
    story: {
      title: "הסיפור שלנו",
      p1: "ספקים גלובליים תמיד היו אתגר. קונים מתקשים למצוא ספקים אמינים, לבדוק את הלגיטימיות שלהם וללוות בעברות גבולות. יצרנים, במיוחד אלה ממוקדי איכות, מתקשים להבחין בין אפשרויות רבות וליצור קשר לקונים ברציניות.",
      p2: "SourceNest נולדה מרעיון פשוט: מה אם הייתה פלטפורמה שהציגה רק יצרנים בדוקים ומאושרים? מקום שבו קונים יכלו לדעת שכל ספק בדוק בהתאם למידע שהוגש לפני הרשימה?",
      p3: "בנינו SourceNest כדי להיות הפלטפורמה הזו. על ידי דרישת אישור מנהל לכל יצרן והשמירה על הפלטפורמה חינם לקונים, יצרנו סביבה שבה איכות יש עדיפות וביטחון הוא בסיס של כל חיבור.",
      p4: "כיום, SourceNest מחברת אלפי קונים עם יצרנים בדוקים ב-50+ מדינות, המכסה 45+ תעשיות. אנחנו גאים שהופכים את הסחר הגלובלי לנגיש, שקוף וחסכוני יותר."
    },
    stats: {
      countries: "מדינות",
      suppliers: "ספקים בדוקים",
      products: "מוצרים ברשימה",
      industries: "תעשיות מכוסות"
    },
    missionVision: {
      missionTitle: "המשימה שלנו",
      missionDesc: "להפוך ספקים גלובליים לשקוף, יעיל וחסכוני יותר על ידי חיבור קונים ממוקדי איכות עם יצרנים בדוקים דרך פלטפורמה B2B פרימיום.",
      visionTitle: "הראייה שלנו",
      visionDesc: "עולם שבו מציאת שותף ייצור הנכון היא פשוטה, בטוחה והצליחה — ללא קשר לגיאוגרפיה, גודל החברה או התעשייה."
    },
    values: {
      title: "הערכים שלנו",
      subtitle: "העקרונות המנחים את כל מה שאנחנו עושים",
      trust: {
        title: "ביטחון ושקיפות",
        description: "אנחנו מאמינים שספקים צריכים להיבנות על ביטחון. כל ספק בדוק בהתאם למידע שהוגש, ואנחנו שואפים לשמור על איכות הפלטפורמה."
      },
      global: {
        title: "הנגישות הגלובלית",
        description: "אנחנו שוברים מחסומים בסחר הבינלאומי, מה שמקל על עסקים בכל גודל להתחבר על פני גבולות."
      },
      community: {
        title: "הקהילה ראשונה",
        description: "אנחנו לא רק בונים פלטפורמה — אנחנו יוצרים קהילה של קונים ויצרנים ממוקדי איכות."
      },
      innovation: {
        title: "חדשנות",
        description: "אנחנו משתפרים ברציפות בפלטפורמה שלנו עם תכונות חכמות שהופכות ספקים לחסכוני ויעיל יותר."
      }
    },
    difference: {
      title: "למה SourceNest שונה",
      reviewed: {
        title: "בדוק רק בשוק:",
        description: "בניגוד לפלטפורמות פתוחות שבהן כל אחד יכול להרשום, כל יצרן ב-SourceNest עובר תהליך סקירה ואישור מנהל בהתאם למידע שהוגש. זה אומר שקונים יודעים שספקים בדוקים, ויצרנים יודעים שהם בחברה טובה."
      },
      free: {
        title: "חינם לקונים:",
        description: "אנחנו מאמינים שקונים צריכים להיות לגישה לכלים ספקים איכותיים ללא מחסומים. על ידי הפיכת הפלטפורמה לחינם לקונים, אנחנו מבטיחים הגעה מרבית ליצרנים וגישה מרבית לעמיתי ספקים."
      },
      nocommission: {
        title: "מודל ללא עמלה:",
        description: "אנחנו לא לוקחים חלק מהעסקות שלך. יצרנים משלמים רק את דמי המנוי שלהם, וכל התקשורת והמשא ומתן קורים ישירות בין הצדדים."
      },
      premium: {
        title: "התמקד פרימיום:",
        description: "אנחנו לא מנסים להיות הפלטפורמה הגדולה ביותר — אנחנו מנסים להיות האמינה ביותר. איכות על כמות היא העקרון המנחה שלנו."
      }
    },
    cta: {
      title: "הצטרף לקהילת SourceNest",
      subtitle: "בין אם אתה מחפש מוצרים או מייצר אותם, היינו רוצים שיהיה לך.",
      buyerButton: "הצטרף כקונה",
      manufacturerButton: "הצטרף כיצרן"
    }
  }
} as const;

export default he as unknown as TranslationKeys;
