import type { TranslationKeys } from "./en";

// NOTE: this file replaces the original Spanish translations and now provides
// Chinese (Simplified) translations under the existing `es` locale code.
const es = {
  common: {
    save: "保存更改",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    add: "添加",
    view: "查看",
    manage: "管理",
    close: "关闭",
    search: "搜索",
    loading: "加载中…",
    noResults: "未找到结果",
    confirm: "确认",
    back: "返回",
    next: "下一步",
    yes: "是",
    no: "否",
    ok: "确定",
    error: "错误",
    success: "成功",
    warning: "警告",
    email: "电子邮件",
    password: "密码",
  },
  auth: {
    // Common
    signIn: "登录",
    signOut: "登出",
    signUp: "注册",
    email: "电子邮件",
    password: "密码",
    forgotPassword: "忘记密码？",
    rememberMe: "记住我",
    noAccount: "还没有账户？",
    hasAccount: "已有账户？",
    orContinueWith: "或使用以下方式继续",
    
    // Sign In page
    welcomeBack: "欢迎回来",
    signInToYourAccount: "登录您的账户以继续",
    buyer: "买家",
    manufacturer: "制造商",
    admin: "管理员",
    buyerDescription: "访问您的买家仪表板以管理询价单、消息和已保存的供应商。",
    manufacturerDescription: "访问您的制造商仪表板以管理产品、询问和公司信息。",
    adminDescription: "访问管理面板以管理用户、供应商和平台设置。",
    signInAs: "作为以下身份登录",
    continueWithGoogle: "使用 Google 继续",
    dontHaveAccount: "还没有账户？",
    createAccount: "创建账户",
    canceledDeletion: "取消了删除请求？",
    restoreAccount: "恢复账户",
    invalidEmailOrPassword: "电子邮件或密码无效。请重试。",
    accountRestored: "账户已恢复",
    accountRestoredMessage: "您可以使用常用凭证登录。",
    signingIn: "正在登录...",
    
    // Sign Up page
    createNewAccount: "创建您的账户",
    joinOurPlatform: "加入我们的平台开始销售或寻找供应商",
    selectYourRole: "选择您的角色",
    buyerRole: "买家",
    buyerRoleDesc: "寻找供应商和产品",
    manufacturerRole: "制造商",
    manufacturerRoleDesc: "向买家供应产品",
    continueButton: "继续",
    
    // Sign Up - Details form
    firstName: "名字",
    lastName: "姓氏",
    company: "公司名称",
    country: "国家",
    confirmPassword: "确认密码",
    agreeToTerms: "我同意服务条款和隐私政策",
    
    // Manufacturer specific
    city: "城市",
    businessLicense: "营业执照",
    website: "网站",
    factoryPhotos: "工厂照片",
    additionalNotes: "其他备注",
    uploadBizLicense: "上传营业执照",
    uploadFactoryPhotos: "上传工厂照片（最多5张）",
    uploadDesc: "拖放或点击选择文件",
    max5Photos: "最多5张照片",
    remove: "删除",
    
    // Social signup
    needsProfileCompletion: "完成您的档案",
    profileAlmostReady: "您的档案几乎已准备好",
    continueProfileSetup: "继续设置您的档案",
    
    // Errors
    googleLoginFailed: "Google 登录失败。请重试。",
    errorOccurred: "发生错误。请重试。",
    accountCreated: "您的账户已创建",
    reviewPlans: "接下来查看计划，或直接前往您的仪表板。",
    verifyEmail: "请在继续前验证您的电子邮件。",
    
    // Restore Account
    restoreTitle: "恢复您的账户",
    restoreSubtitleStep1: "如果您要求删除账户，请在此登录以取消。我们会向您发送验证代码。",
    restoreSubtitleStep2: "输入发送到您邮箱的验证代码。",
    restoreSendingCode: "正在发送代码…",
    restoreContinue: "继续",
    restoreVerificationCode: "验证代码",
    restoreEnterCode: "输入来自电子邮件的代码",
    restoreVerifying: "正在验证…",
    restoreVerifyButton: "验证并恢复账户",
    restoreDifferentEmail: "使用其他电子邮件",
    
    // Forgot Password
    forgotTitle: "忘记密码了吗?",
    resetTitle: "重置密码",
    forgotSubtitle: "别担心，我们会向您发送重置说明。",
    resetSubtitle: "输入 OTP 和您的新密码以完成重置。",
    forgotSending: "正在发送...",
    forgotSendCode: "发送重置代码",
    resetPasswordComplete: "密码重置完成",
    resetOtpLabel: "OTP 代码",
    resetOtpPlaceholder: "输入 OTP",
    resetNewPassword: "新密码",
    resetConfirmPassword: "确认密码",
    resetResetting: "正在重置...",
    resetButton: "重置密码",
    resetDifferentEmail: "使用其他电子邮件",
    rememberPassword: "还记得密码吗?",
    passwordMismatch: "密码确认不匹配。",
    emailMissing: "电子邮件丢失。请重新请求重置代码。",
  },

  // ── Auth Layout ──────────────────────────────────────────────────────
  authLayout: {
    connectManufacturers: "与全球经过审查的制造商建立联系",
    joinBusinesses: "成千上万的企业通过我们的策划网络寻找可靠的制造合作伙伴。",
    reviewedManufacturers: "已审查的制造商",
    countries: "国家",
    productCategories: "产品类别",
    clientSatisfaction: "客户满意度",
    allSuppliersReviewed: "所有供应商都经过审查和审计",
    globalNetwork: "遍布120多个国家的全球网络",
    secureMessaging: "安全消息传递和交易",
    realtimeRFQ: "实时RFQ匹配",
    copyright: "SourceNest。版权所有。",
  },

  nav: {
    dashboard: "仪表板",
    users: "用户",
    suppliers: "供应商",
    products: "产品",
    industries: "行业",
    reviews: "评价",
    rfqs: "询价单",
    messages: "消息",
    reports: "报告",
    pricing: "定价",
    promotions: "促销",
    subscriptions: "订阅",
    insights: "洞察",
    analytics: "分析",
    contact: "联系页面",
    faq: "常见问题管理",
    siteSettings: "网站设置",
    settings: "设置",
    viewSite: "查看网站",
    quickFilters: "快速筛选",
    createManufacturer: "创建制造商",
    mfgRegistrations: "制造商注册",
    
    // Header navigation
    headerDiscover: "发现",
    headerPlatform: "平台",
    headerResources: "资源",
    headerInsights: "洞察",
    
    // Discover items
    browseIndustries: "浏览行业",
    browseIndustriesDesc: "按行业部门和专业领域查找供应商",
    browseSuppliers: "浏览供应商",
    browseSuppliersDesc: "从世界各地发现经过审查的制造商",
    browseProducts: "浏览产品",
    browseProductsDesc: "探索所有类别和行业的产品",
    featuredManufacturers: "精选制造商",
    featuredManufacturersDesc: "平台上排名靠前的经过审查的制造商",
    globalSupplierMap: "全球供应商地图",
    globalSupplierMapDesc: "按国家和地区浏览供应商",
    compareSuppliers: "比较供应商",
    compareSuppliersDesc: "并排比较制造商",
    newSuppliers: "新供应商",
    newSuppliersDesc: "最近加入SourceNest的制造商",
    
    // Platform items
    forBuyers: "对于买家",
    forBuyersDesc: "免费搜索、比较和连接供应商",
    forManufacturers: "对于制造商",
    forManufacturersDesc: "展示您的工厂并吸引全球买家",
    
    // Resource items
    review: "评价",
    reviewDesc: "了解我们如何审查和批准供应商",
    helpCenter: "帮助中心",
    helpCenterDesc: "查找常见问题的答案",
    aboutUs: "关于我们",
    aboutUsDesc: "了解更多关于SourceNest的信息",
    
    // Header favorites dropdown
    savedTabSuppliers: "供应商",
    savedTabProducts: "产品",
    noSavedSuppliers: "还没有保存的供应商",
    saveSupplierHint: "点击任何供应商上的心形图标进行保存",
    browseSuppliersCTA: "浏览供应商",
    viewAllSavedSuppliers: "查看所有保存的供应商",
    noSavedProducts: "还没有保存的产品",
    saveProductHint: "点击任何产品上的心形图标进行保存",
    browseProductsCTA: "浏览产品",
    viewAllSavedProducts: "查看所有保存的产品",
    moreSuppliersCount: "更多供应商",
    moreProductsCount: "更多产品",
    
    // Auth menu dropdown
    userMenuDashboard: "仪表板",
    userMenuSettings: "设置",
    userMenuSignOut: "退出",
    userMenuSignIn: "登录",
    userMenuGetStarted: "开始使用",
    
    // Admin sidebar menu
    adminDashboard: "仪表板",
    adminUsers: "用户",
    adminCreateManufacturer: "创建制造商",
    adminMfgRegistrations: "制造商注册",
    adminSuppliers: "供应商",
    adminProducts: "产品",
    adminIndustries: "工业",
    adminQuickFilters: "快速过滤器",
    adminReviews: "评论",
    adminRFQs: "报价申请",
    adminMessages: "消息",
    adminReports: "报告",
    adminPricing: "定价",
    adminPromotions: "促销",
    adminSubscriptions: "订阅",
    adminInsights: "见解",
    adminCertificateType: "证书类型",
    adminAnalytics: "分析",
    adminContactPage: "联系页面",
    adminFAQManagement: "常见问题管理",
    adminHelpCenter: "帮助中心",
    adminReviewManagement: "评论管理",
    adminSiteSettings: "网站设置",
    adminSettings: "设置",
    adminViewSite: "查看网站",
    adminSignOut: "退出登录",
  },
  settings: {
    title: "设置",
    subtitle: "管理您的帐户和偏好",
    adminSubtitle: "平台配置和首选项",
    accountDetails: "帐户详情",
    accountDetailsDesc: "管理您的个人信息",
    accountCredentialsDesc: "管理您的登录凭据和联系信息",
    firstName: "名字",
    lastName: "姓氏",
    emailAddress: "电子邮件地址",
    companyName: "公司名称",
    phoneNumber: "电话号码",
    changePassword: "更改密码",
    generalSettings: "常规设置",
    generalSettingsDesc: "平台的基本配置",
    platformName: "平台名称",
    supportEmail: "支持邮箱",
    contactPhone: "联系电话",
    security: "安全",
    securityDesc: "管理您的帐户安全设置",
    securitySettings: "安全设置",
    securitySettingsDesc: "平台的安全配置",
    requireEmailVerification: "要求邮箱验证",
    requireEmailVerificationDesc: "用户必须验证邮箱后方可访问",
    manualSupplierApproval: "供应商手动审批",
    manualSupplierApprovalDesc: "新供应商需要管理员审批",
    rateLimiting: "请求速率限制",
    rateLimitingDesc: "按用户限制 API 请求",
    loginHistory: "登录历史",
    loginHistoryDesc: "查看最近的登录活动",
    connectedDevices: "已连接设备",
    connectedDevicesDesc: "管理活动会话",
    notifications: "通知偏好",
    notificationsDesc: "选择您希望何时以及如何收到通知",
    adminNotifications: "通知设置",
    adminNotificationsDesc: "管理员的通知偏好",
    newQuoteResponses: "新的报价回复",
    newQuoteResponsesDesc: "当供应商回复您的询价时收到通知",
    newMessages: "新消息",
    newMessagesDesc: "当有供应商发来新消息时收到通知",
    newMessagesBuyerDesc: "当有供应商发来新消息时收到通知",
    newMessagesMfgDesc: "当有买家发来新消息时收到通知",
    supplierUpdates: "供应商更新",
    supplierUpdatesDesc: "当已保存的供应商添加新产品时收到通知",
    weeklyDigest: "每周摘要",
    weeklyDigestDesc: "接收有关您关注领域中新供应商的每周摘要",
    weeklyPerformanceDigest: "每周性能摘要",
    weeklyPerformanceDigestDesc: "接收每周分析摘要",
    marketingPromotions: "营销与促销",
    marketingPromotionsDesc: "接收技巧与特别优惠",
    marketingPromotionsMfgDesc: "接收促销与优惠信息",
    dailySummary: "每日摘要",
    dailySummaryDesc: "接收平台的每日摘要",
    newInquiryAlerts: "新询价提醒",
    newInquiryAlertsDesc: "当买家发送询价时收到通知",
    quoteRequests: "报价请求",
    quoteRequestsDesc: "当您收到询价单时收到通知",
    newSupplierRegistrations: "新供应商注册",
    newSupplierRegistrationsDesc: "收到有关新供应商注册的通知",
    reportedContent: "被举报内容",
    reportedContentDesc: "收到被标记内容的通知",
    languageRegion: "语言与地区",
    languageRegionDesc: "设置您偏好的语言和时区",
    language: "语言",
    timezone: "时区",
    currencyDisplay: "货币显示",
    localization: "本地化",
    localizationDesc: "区域与语言设置",
    defaultLanguage: "默认语言",
    defaultCurrency: "默认货币",
    defaultTimezone: "默认时区",
    emailSettings: "邮件设置",
    emailSettingsDesc: "邮件投递配置",
    fromName: "发件人名称",
    fromEmail: "发件人邮箱",
    testEmailDelivery: "测试邮件发送",
    primaryEmail: "主邮箱",
    notificationEmail: "通知邮箱",
    addEmail: "添加邮箱",
    database: "数据库",
    databaseDesc: "数据库维护与备份",
    lastBackup: "上次备份",
    createBackup: "创建备份",
    exportData: "导出数据",
    subscription: "订阅",
    nextBillingDate: "下次计费日期",
    upgradePlan: "升级计划",
    cancelSubscription: "取消订阅",
    dangerZone: "危险操作",
    deactivateAccount: "停用账号",
    deleteAccount: "删除账号",
  },
  faq: {
    title: "常见问题管理",
    subtitle: "管理显示在 FAQ 页面的常见问题",
    totalCategories: "分类总数",
    totalQuestions: "问题总数",
    avgPerCategory: "每类平均问题数",
    categories: "FAQ 分类",
    categoriesDesc: "按分类组织常见问题。拖动以重新排序或使用箭头按钮。",
    addCategory: "添加分类",
    editCategory: "编辑分类",
    addQuestion: "添加问题",
    editQuestion: "编辑问题",
    categoryTitle: "分类标题",
    question: "问题",
    answer: "答案",
    noCategories: "暂无 FAQ 分类",
    addFirstCategory: "添加第一个分类",
    noQuestions: "该分类暂无问题",
    deleteConfirmCategory: "这将删除该分类及其中的所有问题。此操作无法撤销。",
    deleteConfirmFaq: "这将永久删除该问题。此操作无法撤销。",
    createCategoryDesc: "创建新的 FAQ 分类以组织问题",
    updateCategoryDesc: "更新分类名称",
    createFaqDesc: "向该分类添加新的常见问题",
    updateFaqDesc: "更新问题和答案",
    questionPlaceholder: "例如：如何重置我的密码？",
    answerPlaceholder: "提供清晰且有帮助的答案...",
    categoryPlaceholder: "例如：常规、买家、计费",
  },
  landing: {
    hero: {
      badge: "连接全球贸易",
      title1: "发现已审核的",
      title2: "制造商遍布全球",
      subtitle: "搜索产品、比较供应商、请求报价，并通过一个优质的全球采购平台直接与受信任的工厂建立联系。",
      searchPlaceholder: "搜索产品、供应商或行业...",
      searchButton: "搜索",
      popular: "热门：",
      popElectronics: "电子产品",
      popTextiles: "纺织品",
      popMachinery: "机械设备",
      popFood: "食品与饮料",
      statCountries: "覆盖国家",
      statReviewed: "已审核供应商",
      statDirect: "工厂沟通",
      statDirectPrefix: "直接"
    },
    whatIs: {
      title: "什么是 SourceNest？",
      desc: "SourceNest 是一个优质的全球数字市场，进口商、买家和采购专业人士可以在此发现经过审核的制造商和工厂。工厂展示其产品、能力和认证，买家可以搜索、比较并直接联系 — 所有功能都在同一个值得信赖的平台上。",
      forBuyers: "面向买家与进口商",
      forBuyersDesc: "发现已审核的制造商，进行并排比较，保存收藏，发送询价并直接与工厂沟通。所有采购流程集中在一个地方，完全免费。",
      buyerPoint1: "搜索数千家已审核供应商",
      buyerPoint2: "比较工厂与能力",
      buyerPoint3: "请求报价并直接发送消息",
      buyerPoint4: "访问产品目录与规格",
      buyerLink: "了解更多针对买家的信息",
      forMfg: "面向制造商与工厂",
      forMfgDesc: "创建您的数字展位，上传产品，展示认证，被全球买家发现。在仪表板中接收询价和报价请求。通过实惠的订阅计划加入。",
      mfgPoint1: "建立专业的公司档案",
      mfgPoint2: "上传无限制的产品目录",
      mfgPoint3: "接收并管理报价请求",
      mfgPoint4: "获得全球曝光",
      mfgLink: "了解更多针对制造商的信息"
    },
    howItWorks: {
      title: "如何运作",
      subtitle: "为买家和制造商提供简单透明的流程",
      tabBuyers: "面向买家",
      tabMfg: "面向制造商",
      buyerStep1Title: "搜索与发现",
      buyerStep1Desc: "浏览我们的全球供应商目录，按行业、地区、认证和能力筛选，找到合适的制造合作伙伴。",
      buyerStep2Title: "比较供应商",
      buyerStep2Desc: "保存您喜欢的供应商，进行并排比较，查看其产品、认证和能力以便做出明智决定。",
      buyerStep3Title: "连接与沟通",
      buyerStep3Desc: "直接向工厂发送消息，请求详细报价并协商条款 — 所有操作都在平台的安全消息系统内完成。",
      buyerStep4Title: "请求报价",
      buyerStep4Desc: "提交包含规格、数量和要求的详细询价单。直接收到来自已审核制造商的有竞争力报价。",
      buyerFree: "买家免费使用 SourceNest — 无需订阅。",
      mfgStep1Title: "创建账户",
      mfgStep1Desc: "以制造商身份注册并选择适合您业务需求与增长目标的订阅计划。",
      mfgStep2Title: "完成付款",
      mfgStep2Desc: "账户审核通过后，完成付款以激活账户并开始使用平台。",
      mfgStep3Title: "建立档案",
      mfgStep3Desc: "完善工厂档案，包括详细信息、认证与能力，并上传产品目录与宣传册。",
      mfgStep4Title: "上传产品",
      mfgStep4Desc: "添加产品图片、规格、最小起订量、交付时间和包装信息，展示您的完整产品线。",
      mfgStep5Title: "提交审核",
      mfgStep5Desc: "准备就绪后，提交账户审核。我们的团队将在授予平台访问权限前进行审查。",
      mfgStep6Title: "走向全球",
      mfgStep6Desc: "审核通过后，您的档案将上线。开始接收来自全球买家的询价与报价请求。",
      mfgApproval: "所有制造商账户在上线前均需管理员审核 — 确保为买家提供质量与信任。",
      important: "重要: 无需预付款。您的账户将首先被审核，批准后才会收费。",
      paymentComplete: "批准后，完成您的付款以激活您的账户并解锁对平台的完整访问权限。"
    },
    industries: {
      viewAll: "查看所有行业",
      explorerMap: "探索全球地图",
      electronicsElectrical: "电子与电气",
      machineryEquipment: "机械与设备",
      textilesApparel: "纺织品与服装",
      homeGarden: "家居与花园",
      healthBeauty: "健康与美容",      // Industries page
      pageTitle: "浏览行业",
      pageDescription: "发现来自各主要行业的评审制造商和供应商。从电子到纺织品，找到您业务的完美合作伙伴。",
      majorIndustriesBadge: "主要行业",
      categoriesLabel: "类别",
      suppliersLabel: "供应商",
      productsLabel: "产品",
      featuredBadge: "精选",
      exploreButton: "浏览",
      suppliersButton: "供应商",
      moreCategories: "+ {count} 更多",
      cantFindTitle: "找不到您的行业？",
      cantFindDesc: "我们不断扩展我们的网络。请联系我们以了解即将推出的行业。",
      contactUsButton: "联系我们",
    },
    suppliers: {
      pageTitle: "寻找已审查的供应商",
      pageDescription: "浏览来自世界各地已验证的制造商",
      pageSubtitle: "{count}+ 来自世界各地已验证的制造商",
      searchPlaceholder: "按供应商、产品或类别搜索...",
      filters: "筛选条件",
      clearAll: "全部清除",
      industryLabel: "行业",
      allIndustries: "所有行业",
      countryLabel: "国家",
      allCountries: "所有国家",
      popular: "受欢迎",
      certificationLabel: "认证",
      anyCertification: "任何认证",
      minimumOrderLabel: "最低订货",
      anyMOQ: "任何数量",
      exportMarketLabel: "出口市场",
      anyRegion: "任何地区",
      reviewedSuppliersOnly: "仅已审查的供应商",
      suppliersFound: "个供应商已找到",
      sortBy: "按以下条件排序",
      relevance: "相关性",
      highestRating: "最高评分",
      fastestResponse: "最快回复",
      mostProducts: "最多产品",
      activeFilters: "活跃的筛选：",
      search: "搜索：",
      reviewedOnly: "仅已审查",
      reviewedBadge: "已审查",
      productsLabel: "产品",
      moreProducts: "+ {count} 更多",
      noSuppliersFound: "找不到供应商",
      adjustSearchFilters: "尝试调整你的搜索或筛选条件",
      clearAllFilters: "清除所有筛选",
      compare: {
        pageTitle: "比较供应商",
        pageDescription: "并排比较最多 {max} 个供应商",
        breadcrumbHome: "主页",
        breadcrumbSuppliers: "供应商",
        breadcrumbCompare: "比较",
        addSupplier: "添加供应商以比较",
        maximumSuppliersAdded: "已添加最大供应商数",
        noSuppliersSelected: "未选择供应商",
        noSuppliersMessage: "从上方下拉菜单中选择供应商或浏览我们的供应商目录以开始比较。",
        browseSuppliers: "浏览供应商",
        comparing: "比较 {count} 个供应商",
        rating: "评分",
        reviews: "评论",
        responseTime: "响应时间",
        responseRate: "响应率",
        onTimeDelivery: "准时交货",
        established: "成立于",
        years: "年",
        employees: "员工",
        productCount: "产品数量",
        minOrderValue: "最小订单值",
        contactForMOQ: "联系获取最小订单量",
        exportMarkets: "出口市场",
        certifications: "认证",
        contactSupplier: "联系供应商",
        viewProfile: "查看资料",
        addMore: "再添加 {count} 个供应商以比较",
        selectSupplier: "选择供应商",
      }
    },
    products: {
      pageTitle: "发现产品",
      pageDescription: "浏览来自世界各地已审核制造商的{productCount}+产品",
      searchPlaceholder: "搜索产品、类别...",
      categoryLabel: "类别",
      allCategories: "所有类别",
      sortLabel: "按以下条件排序",
      priceLow: "价格：从低到高",
      priceHigh: "价格：从高到低",
      lowestMOQ: "最低最小订货量",
      newestFirst: "最新优先",
      mostPopular: "最受欢迎",
      productsFound: "个产品已找到",
      sortDisplay: "排序：",
      verified: "已验证",
      moqLabel: "最小订货量：",
      daysLabel: "天",
      inquiriesLabel: "次查询",
      noProductsFound: "未找到产品",
      errorLoadingProducts: "加载产品时出错",
    },
    suppliersMap: {
      globalNetwork: "全球网络",
      pageTitle: "全球供应商地图",
      pageDescription: "探索来自世界各地的制造商和供应商。为您的采购需求找到完美的合作伙伴。",
      searchPlaceholder: "搜索国家或地区...",
      reviewedSuppliersLabel: "已审查的供应商",
      countriesLabel: "国家",
      industriesLabel: "行业",
      productsLabel: "产品",
      exploreByRegion: "按区域浏览",
      clickRegionToView: "单击一个地区以查看该地区的供应商",
      suppliers: "个供应商",
      worldsManufacturingHub: "世界制造业中心",
      qualityPrecisionManufacturing: "质量与精密制造",
      innovationTechnologyLeaders: "创新与技术领导者",
      emergingManufacturingMarkets: "新兴制造市场",
      highQualityProduction: "高质量生产",
      countriesIn: "{region}中的国家",
      countriesAvailable: "个国家可用",
      viewAllCountries: "查看全部{count}个国家",
      topManufacturingCountries: "顶级制造国家",
      countriesMostReviewedSuppliers: "在我们平台上拥有最多已审查供应商的国家",
      viewAllSuppliers: "查看所有供应商",
      growth: "增长",
      cantFindTitle: "找不到你想要的？",
      cantFindDesc: "提交报价请求，让已审查的制造商为您提供竞争性报价。",
      submitRFQ: "提交报价请求",
      browseAllSuppliers: "浏览所有供应商",
    },
    whyUse: {
      buyerTitle: "为什么买家选择 SourceNest",
      buyerSubtitle: "帮助您免费找到并联系合适制造商的一切工具",
      bb1Title: "对买家永久免费",
      bb1Desc: "搜索、比较、发送消息和请求报价 — 完全免费。无隐藏费用，无需订阅。",
      bb2Title: "仅限已审核供应商",
      bb2Desc: "每家制造商在出现在平台前都由我们的团队基于提交信息进行审核与批准。",
      bb3Title: "全球覆盖",
      bb3Desc: "覆盖 50+ 个国家的工厂，涵盖主要制造区域。",
      bb4Title: "直接沟通",
      bb4Desc: "直接与工厂代表聊天，无需中间人或经纪人。",
      bb5Title: "比较与决策",
      bb5Desc: "并排比较供应商，查看详细能力、认证与报价。",
      bb6Title: "节省时间",
      bb6Desc: "优化的询价流程、有序的收件箱与已保存供应商可提升工作效率。",
      mfgTitle: "制造商加入的原因",
      mfgSubtitle: "通过可信的平台扩大您的曝光并连接优质买家",
      mb1Title: "全球曝光",
      mb1Desc: "被全球的进口商与买家发现，他们正在寻找您的产品。",
      mb2Title: "优质展示",
      mb2Desc: "以专业档案、产品目录与提交的凭证展示您的工厂。",
      mb3Title: "高质量潜在客户",
      mb3Desc: "收到经过调查的买家发出的询盘。",
      whyPayTitle: "制造商为何付费加入？",
      whyPayDesc: "为了确保制造商获得最大曝光，买家免费使用平台。制造商通过订阅费用支持平台开发、审核流程与高级功能。这一模式保证只有认真且有责任心的制造商加入，从而为买家带来信心。"
    },
    featured: {
      suppliersTitle: "精选已审核供应商",
      suppliersSubtitle: "发现我们团队精选的顶级制造商",
      viewAllSuppliers: "查看所有供应商",
      productsTitle: "热门类别",
      productsSubtitle: "直接从已审核制造商获取畅销产品",
      industriesBadge: "热门行业",
      industriesTitle: "按行业查找供应商",
      industriesSubtitle: "发现各主要工业领域中经过审核的制造商。每个类别均包含准备履约的合格供应商。",
      suppliersLabel: "供应商",
      exploreButton: "浏览",
    },
    trust: {
      title: "基于信任的采购",
      subtitle: "SourceNest 的每一次连接都建立在我们对质量与透明度的不懈承诺之上",
      t1Title: "能力审核",
      t1Desc: "我们全面的审核流程确保每家制造商真实可靠并具备交付能力。",
      t2Title: "平台诚信",
      t2Desc: "我们以高度透明的方式运营。无隐藏加价、无付费排名 — 仅为真实的 B2B 连接。",
      t3Title: "全球标准",
      t3Desc: "我们根据国际制造与质量控制标准审核提交的合规文件。",
      t4Title: "专属支持",
      t4Desc: "我们的采购专家可随时为您提供复杂制造需求的指导。",
      badge: "信任与审核",
      learnMore: "了解我们的审核流程",
      reviewedBadge: "SourceNest 已审核",
      point1: "已提供业务信息",
      point2: "已提供工厂详情",
      point3: "认证信息（如有）",
      point4: "出口经验（如有）",
      point5: "个人资料已通过审核"
    },
    testimonials: {
      title: "社区评价",
      subtitle: "加入数千家正在全球扩展的成功企业"
    },
    faq: {
      title: "常见问题",
      subtitle: "您需要了解的关于使用 SourceNest 的一切",
      moreQuestions: "还有更多疑问？",
      viewFull: "查看完整 FAQ"
    },
    cta: {
      buyerTitle: "准备好找到您的制造商了吗？",
      buyerDesc: "加入数千名已经使用 SourceNest 精简其全球采购流程的买家。",
      buyerBtn: "开始采购",
      mfgTitle: "您是制造商吗？",
      mfgDesc: "将您的工厂展示给全球活跃的买家。",
      mfgBtn: "作为制造商加入"
    },
    footer: {
      slogan: "SourceNest 促进独立用户之间的联系，不对他们之间的交易负责。",
      platform: "平台",
      forBuyers: "面向买家",
      forMfg: "面向制造商",
      pricing: "定价",
      search: "搜索",
      discover: "发现",
      browseSuppliers: "浏览供应商",
      browseProducts: "浏览产品",
      industries: "行业",
      rfq: "请求报价",
      resources: "资源",
      helpCenter: "帮助中心",
      reviewProcess: "审核流程",
      faq: "常见问题",
      blog: "博客与洞察",
      company: "公司",
      aboutUs: "关于我们",
      contact: "联系",
      buyerDash: "买家面板",
      mfgDash: "制造商面板",
      legal: "法律",
      privacy: "隐私政策",
      terms: "服务条款",
      cookie: "Cookie 政策",
      popular: "热门行业",
      viewAll: "查看所有行业",
      rights: "版权所有。"
    },
    forBuyers: {
      hero: {
        badge: "100% 免费供买家使用",
        title: "全球采购，完全免费",
        subtitle: "搜索已审查的供应商，比较工厂，请求报价，直接与制造商沟通 — 一切完全免费。SourceNest 对买家永远免费。",
        signupButton: "创建免费账户",
        browseButton: "浏览供应商",
      },
      featuresTitle: "您需要的所有智能采购工具",
      featuresSubtitle: "专为简化整个采购工作流程而设计的强大工具",
      features: {
        search: {
          title: "搜索供应商",
          description: "访问我们的全球已审查制造商目录。按行业、地点、认证、最小订单量等进行过滤，以找到完美的合作伙伴。",
        },
        compare: {
          title: "比较工厂",
          description: "将供应商添加到您的比较列表中并并排评估它们。比较能力、认证、交货时间等。",
        },
        messaging: {
          title: "直接消息",
          description: "通过我们的安全平台直接与工厂代表聊天。没有中间商，没有经纪人 — 只是直接沟通。",
        },
        rfq: {
          title: "请求报价",
          description: "提交详细的采购询价单，包括规格、数量和要求。直接从制造商处获得竞争性报价。",
        },
        favorites: {
          title: "保存收藏",
          description: "将供应商和产品保存到您的收藏中，以便轻松访问。随时间建立您的首选供应商列表。",
        },
        catalogs: {
          title: "下载目录",
          description: "访问并下载已审查供应商的产品目录、规格表和公司宣传册。",
        },
        dashboard: {
          title: "有组织的仪表板",
          description: "在一个地方管理所有采购活动。跟踪消息、采购询价单、保存的项目和供应商交互。",
        },
        notifications: {
          title: "智能通知",
          description: "当供应商响应您的询问时、当新供应商匹配您的偏好时等获得通知。",
        },
      },
      benefitsTitle: "为什么买家喜欢 SourceNest",
      benefitsSubtitle: "加入数千名采购专业人士、进口商和采购经理，他们相信 SourceNest 满足其全球采购需求。",
      benefits: {
        free: "完全免费使用 — 无订阅，无隐藏费用",
        reviewed: "平台上仅有已审查和批准的供应商",
        directComm: "与工厂代表进行直接沟通",
        comparison: "并排供应商比较工具",
        secure: "安全的采购询价单和消息系统",
        catalogs: "访问产品目录和规格说明",
        dashboard: "为所有采购活动组织仪表板",
        global: "全球范围内 50 多个制造国家",
      },
      benefitBoxTitle: "为什么对买家免费？",
      benefitBoxDescription1: "我们的商业模式很简单：制造商为在平台上列出而支付订阅费，而买家免费使用。这确保工厂的最大覆盖范围，同时为您提供一个高级采购工具，无需花费。",
      benefitBoxDescription2: "通过为买家保持平台免费，我们吸引更多认真的采购专业人士 — 这进而使平台对制造商更有价值。每个人都赢了。",
      ctaTitle: "今天开始采购",
      ctaSubtitle: "在几秒钟内创建您的免费账户并开始与全球评审制造商联系。",
      ctaButton: "创建免费买家账户",
    }
  },
  forManufacturers: {
    hero: {
      badge: "拓展您的出口业务",
      title: "触达全球买家，助力工厂成长",
      subtitle: "创建您的数字展位，展示产品，并通过 SourceNest 优质的 B2B 平台与全球进口商和采购专业人士建立联系。",
      viewPricing: "查看定价计划",
      getStarted: "立即开始"
    },
    features: {
      title: "成功所需的一切工具",
      subtitle: "强大的工具，助力展示您的工厂并连接合适的买家",
      f1Title: "专业的公司档案",
      f1Desc: "创建全面的数字展台，展示您的工厂、能力、认证和产能。",
      f2Title: "全球曝光",
      f2Desc: "被全球正在寻找供应商的进口商和采购专业人士发现。",
      f3Title: "与买家直接沟通",
      f3Desc: "通过我们的平台直接接收并回复询盘。无需中间人，直接与严肃买家沟通。",
      f4Title: "询价单 (RFQ) 管理",
      f4Desc: "接收包含详细规格的报价请求。通过提供有竞争力的报价赢得新业务。",
      f5Title: "性能分析",
      f5Desc: "跟踪资料浏览量、询盘率和参与度指标。了解买家的需求。",
      f6Title: "已审核勋章",
      f6Desc: "审核通过后，获得 SourceNest 已审核勋章 — 这是一个帮助您在买家中脱颖而出的信任信号。"
    },
    howItWorks: {
      title: "如何开始",
      subtitle: "让您的工厂入驻 SourceNest 的简单流程",
      step1Title: "创建您的账户",
      step1Desc: "注册成为制造商，并选择适合您业务需求和增长目标的订阅计划。",
      step2Title: "提交审核",
      step2Desc: "准备就绪后，提交账户审核。我们的团队将在授予平台访问权限前对您的业务进行审查。",
      step3Title: "完成付款",
      step3Desc: "一旦您的账户经过审核并获得批准，请完成付款以激活账户并开始使用平台。",
      step4Title: "建立档案",
      step4Desc: "完善您的工厂档案，包括详细信息、认证、能力，并上传您的产品目录和宣传册。",
      step5Title: "上传产品",
      step5Desc: "添加产品图片、规格、最小起订量、交货时间和包装细节，以展示您的完整产品范围。",
      step6Title: "走向全球",
      step6Desc: "审核通过后，您的档案将上线。开始接收来自全球买家的询盘和报价请求。",
      important: "重要提示：无需预付任何费用。您的账户将首先经过审核，只有在批准后才会向您收费。",
      afterApproval: "一旦获得批准，请完成付款以激活账户并解锁平台的全部访问权限。"
    },
    benefits: {
      whyChoose: "为什么制造商选择 SourceNest",
      desc1: "与通用的 B2B 平台不同，SourceNest 专为连接优质制造商与严肃买家而构建。我们的审核流程有助于确保您身边都是经过筛选的企业，而我们的高端定位吸引了专业的采购团队。",
      desc2: "凭借实惠的订阅计划和零交易佣金，SourceNest 为寻求扩展全球业务的工厂提供了卓越的价值。",
      title: "加入的优势",
      b1: "触达正在积极寻找供应商的合格买家",
      b2: "通过专业、精美的档案展示您的工厂",
      b3: "直接在收件箱中接收高质量的潜在客户和询价单",
      b4: "展示认证并建立信誉",
      b5: "扩展到新的市场和地区",
      b6: "无佣金费用 — 仅支付您的订阅费"
    },
    cta: {
      title: "准备好触达全球买家了吗？",
      subtitle: "立即加入 SourceNest，开始接收来自全球进口商的询盘。",
      choosePlan: "选择您的计划",
      contactSales: "联系销售"
    }
  },
  pricing: {
    hero: {
      title: "简单透明的价格",
      subtitle: "选择适合您业务的计划。所有计划都包括管理员审查和批准流程。",
      buyersNote: "定价仅适用于制造商。买家可免费使用 SourceNest。"
    },
    founding: {
      badge: "限时优惠",
      title: "作为创始制造商加入",
      subtitle: "成为前 300 个加入 SourceNest 的制造商，获得 6 个月免费访问我们完整的 {plan} 计划 - 价值 $1,794。",
      plan: "Growth",
      freeFor: "6 个月免费",
      saveBadge: "节省 $1,794",
      noCardRequired: "无需信用卡",
      description: "获得完整的 {plan} 计划功能免费 6 个月。试用期结束后，继续选择任何付费计划以保持您的账户活跃。",
      spotsRemaining: "剩余名额：",
      button: "申请成为创始成员",
      note: "需通过管理员审查和批准",
      badge2: "仅限前 300 名",
      cardTitle: "创始制造商",
      cardSubtitle: "早期供应商计划",
      cardFeatures: {
        companyProfile: "公司资料",
        products100: "最多 100 个产品",
        internalMessaging: "内部消息",
        inquiryAndRfq: "询价收件箱和 RFQ 接收",
        catalogUpload: "目录上传",
        certificationsAndMarkets: "认证和出口市场",
        advancedAnalytics: "高级分析",
        prioritySearch: "优先搜索可见性",
        featuredBadge: "精选供应商徽章",
        teamUsers3: "多个团队用户 (3)"
      }
    },
    features: {
      companyProfile: "公司资料",
      products25: "最多 25 个产品",
      products100: "最多 100 个产品",
      productsUnlimited: "无限产品",
      internalMessaging: "内部消息",
      inquiryInbox: "询价收件箱",
      rfqReception: "RFQ 接收",
      catalogUpload: "目录上传",
      certificationsSection: "认证部分",
      exportMarketsSection: "出口市场部分",
      basicAnalytics: "基础分析",
      advancedAnalytics: "高级分析",
      enterpriseAnalytics: "企业分析",
      prioritySearchVisibility: "优先搜索可见性",
      premiumSearchPlacement: "高级搜索展示",
      featuredSupplierBadge: "精选供应商徽章",
      multipleTeamUsers: "多个团队用户",
      multipleTeamUsers3: "多个团队用户 (3)",
      unlimitedTeamUsers: "无限团队用户",
      premiumSupport: "高级支持",
      dedicatedAccountManager: "专属客户经理",
      prioritySupport: "优先支持",
      customOnboarding: "定制入门"
    },
    paidPlans: {
      title: "付费计划",
      subtitle: "为准备最大化知名度和覆盖范围的制造商打造",
      monthly: "每月",
      yearly: "每年",
      savePercentage: "节省 17%",
      starter: {
        name: "Starter",
        description: "适合刚开始出口业务的中小制造商",
        monthlyPrice: 149,
        yearlyPrice: 1490,
        cta: "开始使用"
      },
      growth: {
        name: "Growth",
        description: "适合寻求更多曝光的成熟制造商",
        monthlyPrice: 299,
        yearlyPrice: 2990,
        cta: "开始使用",
        badge: "最受欢迎"
      },
      enterprise: {
        name: "Enterprise",
        description: "适合有定制需求的大型制造商",
        price: "自定义",
        cta: "联系销售"
      },
      billedAnnually: "按年计费 (${price}/月)",
      pricePerCycle: "{cycle}"
    },
    approval: {
      title: "需要批准",
      description: "付款不会自动发布您的资料。所有制造商账户都需要经过审查流程才能对买家可见。这确保了平台的质量和信任。"
    },
    comparison: {
      title: "比较所有功能",
      subtitle: "查看每个计划中包含的内容",
      feature: "功能",
      productsLimit: "产品限额",
      teamMembers: "团队成员",
      searchVisibility: "搜索可见性",
      analytics: "分析",
      featuredBadge: "精选供应商徽章",
      accountManager: "账户经理",
      supportLevel: "支持级别",
      standard: "标准",
      priority: "优先",
      premium: "高级",
      basic: "基础",
      advanced: "高级",
      enterpriseLevel: "企业级",
      email: "电子邮件",
      priorityEmail: "优先电子邮件",
      dedicated: "专属",
      unlimited: "无限",
      notIncluded: "不包括"
    },
    faq: {
      title: "定价常见问题",
      q1: "付款会自动发布我的资料吗？",
      a1: "不会。付款会创建您的制造商账户，但您的资料仍需要通过我们的审查和批准流程才能对买家可见。通常在您提交完整资料后需要 2-5 个工作日。",
      q2: "如果我的资料未被批准怎么办？",
      a2: "如果您的资料不符合我们的要求，我们将提供具体的反馈说明需要更新的内容。您可以进行必要的更改并重新提交。如果最终无法批准，我们在 30 天内提供全额退款。",
      q3: "我可以升级或降级我的计划吗？",
      a3: "是的，您可以随时更改您的计划。升级时，您将被收取按比例分配的差额。降级时，新费率将在您的下一个计费周期生效。",
      q4: "什么是创始制造商计划？",
      a4: "创始制造商计划是对加入 SourceNest 的前 300 家制造商的限时优惠。作为创始成员，您可以免费获得 6 个月的 Growth 计划全部功能（价值 $299/月）- 包括最多 100 个产品、高级分析、优先搜索可见性、精选供应商徽章和多个团队用户。无需信用卡即可开始。",
      q5: "6 个月免费期结束后会发生什么？",
      a5: "6 个月免费期结束后，您需要选择并支付我们的其中一个计划（Starter、Growth 或 Enterprise）以继续使用该平台。我们会在您的免费期即将结束前发送提醒，以便您有足够的时间选择适合您业务的计划。",
      q6: "创始制造商计划还可用吗？",
      a6: "该计划在我们达到 300 个已批准的制造商注册时可用（待处理应用程序不计入限额）。您可以在我们的定价页面上看到剩余名额。一旦所有名额已满，该计划将关闭，新制造商需要选择付费计划。",
      q7: "销售中有任何佣金费用吗？",
      a7: "没有。SourceNest 不收取您通过平台达成的任何交易的佣金。您的订阅费是您唯一的成本。",
      q8: "您接受哪些付款方式？",
      a8: "我们接受所有主要信用卡（Visa、Mastercard、American Express）和 PayPal。对于企业计划，我们还提供银行转账选项。"
    },
    cta: {
      title: "准备好开始了吗？",
      subtitle: "加入 SourceNest，立即开始与全球买家建立联系。",
      createAccount: "创建账户",
      talkToSales: "联系销售"
    },
    payment: {
      title: "完成您的支付",
      plan: "计划",
      success: "支付成功！",
      transactionId: "交易 ID：",
      redirecting: "正在重定向到注册...",
      failed: "支付失败",
      tryAgain: "重试",
      priceInfo: "{plan} 计划（{cycle}）",
      processingTime: "💡 这通常需要 2-5 个工作日。"
    }
  },

  // ── Verification / Review Process Page ──────────────────────────────
  verification: {
    hero: {
      badge: "信任与质量",
      title: "我们的审核流程",
      description: "SourceNest 上的供应商要经过基于提交信息的审查流程。此流程旨在改进透明度，不构成任何形式的验证或保证。"
    },
    whyMatters: {
      title: "为什么我们的审核流程很重要",
      intro: "在 B2B 采购领域，信任是必不可少的。买家在与供应商建立联系时需要有信心。传统平台通常允许任何人列出商品，这可能使评估选项变得更困难，并需要买家付出更多努力。",
      approach: "SourceNest 采取了不同的方法。我们旨在审核制造商资料和提交的信息，以帮助提高透明度，并在供应商出现在平台上之前支持做出更好的决策。",
      benefits: "我们的流程的好处",
      benefit1: "买家可以更清楚地获取供应商信息",
      benefit2: "制造商受益于成为质量导向型市场的一部分",
      benefit3: "该平台鼓励更高标准",
      benefit4: "该流程有助于简化供应商发现"
    },
    steps: {
      title: "我们如何审核供应商",
      subtitle: "我们的多步审核流程确保基于提交的信息进行全面筛查",
      documentReview: {
        title: "文件审核",
        description: "我们审核公司信息和可用文件以支持透明度并建立信任。",
        item1: "营业执照",
        item2: "进出口许可证（如适用）",
        item3: "行业认证（ISO、CE、FDA 等）",
        item4: "税务登记文件（如适用）"
      },
      factoryReview: {
        title: "工厂信息审核",
        description: "我们审核基本的工厂信息和生产能力。",
        item1: "工厂位置信息",
        item2: "生产能力",
        item3: "设备和机械",
        item4: "工厂规模和劳动力"
      },
      profileReview: {
        title: "资料审核",
        description: "我们审核资料内容的质量和准确性。",
        item1: "审核公司描述",
        item2: "评估产品信息质量",
        item3: "审核图像和媒体",
        item4: "检查联系信息"
      },
      monitoring: {
        title: "持续监控",
        description: "我们随着时间的推移监控供应商活动和买家反馈。",
        item1: "响应时间",
        item2: "买家反馈",
        item3: "总体表现",
        item4: "质量检查"
      }
    },
    badges: {
      title: "信任徽章说明",
      subtitle: "我们的审核徽章对您意味着什么",
      reviewed: {
        name: "SourceNest 已审核",
        description: "供应商已提交公司信息并完成基本审核以在平台上列出。"
      },
      featured: {
        name: "精选供应商",
        description: "根据活动、反应速度和买家反馈突出显示的供应商。"
      },
      exportReady: {
        name: "出口准备就绪",
        description: "供应商表示具有国际运输经验。"
      }
    },
    rejected: {
      title: "如果我的申请未获批准怎么办？",
      content: "如果您的制造商申请无法根据提供的信息获得批准，我们可能会分享可以改进的反馈。您可以随时更新您的详细信息并重新提交申请。请注意，在应用程序过程中不需要付款，只有在批准后才会要求付款。",
      reasons: "常见的重新提交原因：",
      reason1: "信息不完整或不清楚",
      reason2: "缺少业务详情",
      reason3: "资料内容质量问题",
      reason4: "信息不一致",
      resubmit: "您可以解决问题并重新提交申请。如果最终无法批准。"
    },
    cta: {
      title: "准备好接受审核了吗？",
      subtitle: "加入 SourceNest，向全球买家展示您的工厂。",
      viewPlans: "查看计划并开始使用",
      readFaq: "阅读常见问题"
    }
  },

  // ── Help Center ─────────────────────────────────────────────────────
  help: {
    hero: {
      title: "我们如何帮助？",
      subtitle: "查找常见问题的答案或联系我们的支持团队。",
      searchPlaceholder: "搜索帮助文章..."
    },
    contactSupport: {
      title: "仍需帮助？",
      subtitle: "找不到您要找的内容？我们的支持团队随时准备帮助。",
      contactButtonText: "联系支持",
      faqButtonText: "查看常见问题"
    },
    browseCategoryTitle: "按类别浏览",
    viewAllArticles: "查看所有文章",
    popularArticlesTitle: "热门文章",
    backToHelp: "返回帮助中心",
    backToCategory: "返回 {category}",
    wasHelpful: "这篇文章有帮助吗？",
    contactSupportCta: "联系支持",
    categories: {
      buyers: {
        title: "买家",
        description: "了解如何搜索、比较和与供应商联系",
        articles: {
          searchSuppliers: {
            title: "如何搜索供应商",
            content: "找到合适的制造合作伙伴对您的业务成功至关重要。SourceNest 提供强大的搜索和过滤工具，帮助您发现全球评审过的供应商。",
            steps: [
              "使用主搜索栏输入产品名称、类别或关键词",
              "应用过滤器按国家、行业、评审级别和最小订单量范围缩小结果",
              "按相关性、评分或响应时间排序结果",
              "单击供应商卡片查看详细资料",
              "使用\"保存\"按钮为后续比较标记供应商"
            ]
          },
          compareSave: {
            title: "比较和保存供应商",
            content: "我们的比较工具帮助您并排评估多个供应商，做出明智决定。",
            steps: [
              "单击任何供应商卡片上的心形图标保存它们",
              "从您的仪表板访问已保存的供应商",
              "选择最多 4 个供应商进行比较",
              "查看功能、定价和认证的并排比较",
              "导出比较报告供团队审查"
            ]
          },
          sendMessages: {
            title: "向工厂发送消息",
            content: "与供应商的直接沟通是成功采购的关键。我们的消息系统使询问、谈判和建立关系变得容易。",
            steps: [
              "访问任何供应商资料并单击\"联系供应商\"",
              "撰写清晰、详细的消息说明您的需求",
              "附加相关文件，如规格或设计",
              "在您的消息中心跟踪所有对话",
              "启用通知以快速响应供应商回复"
            ]
          },
          requestQuotes: {
            title: "请求报价（RFQ）",
            content: "请求报价（RFQ）系统可帮助您一次从多个供应商获得具有竞争力的报价。",
            steps: [
              "从主菜单或仪表板导航到\"提交 RFQ\"",
              "填写产品详情、规格和需求",
              "指定数量、目标价格和交货时间表",
              "选择发送给特定供应商或广播给相关制造商",
              "在您的仪表板中查看和比较传入的报价"
            ]
          },
          manageDashboard: {
            title: "管理您的买家仪表板",
            content: "您的仪表板是 SourceNest 上所有采购活动的中央枢纽。",
            steps: [
              "查看您的活动 RFQ 及其状态",
              "访问已保存的供应商和最近的搜索",
              "管理与供应商的消息对话",
              "跟踪订单历史和供应商互动",
              "更新您的资料和通知偏好"
            ]
          },
          createAccount: {
            title: "如何创建买家账户",
            content: "在 SourceNest 上创建买家账户是免费的，让您可以访问全球数千家评审过的供应商。",
            steps: [
              "单击主页上的\"注册\"或\"作为买家加入\"",
              "输入您的电子邮件地址并创建安全密码",
              "填写您的基本公司信息",
              "通过确认链接验证您的电子邮件地址",
              "完成您的买家资料以获得更好的供应商建议"
            ]
          },
          sendRfq: {
            title: "发送您的第一个 RFQ",
            content: "了解如何创建和发送您的第一个报价请求，开始从制造商处获取报价。",
            steps: [
              "登录您的买家账户并转到\"提交 RFQ\"",
              "选择最适合您需求的产品类别",
              "详细描述您的产品需求",
              "上传任何相关文件、图纸或规格",
              "设置您的数量需求、目标价格和交货期望",
              "查看并提交您的 RFQ 以从匹配的供应商处获取报价"
            ]
          }
        }
      },
      manufacturers: {
        title: "制造商",
        description: "设置和管理您的工厂资料的指南",
        articles: {
          gettingStarted: {
            title: "作为制造商入门",
            content: "欢迎来到 SourceNest！本指南将帮助您设置制造商账户并开始从全球买家接收询问。",
            steps: [
              "在注册期间选择\"制造商\"创建您的账户",
              "使用准确的业务信息完成您的公司资料",
              "上传具有详细规格的产品目录",
              "申请审核以建立与买家的信任",
              "优化您的资料以提高搜索可见性"
            ]
          },
          createProfile: {
            title: "创建您的公司资料",
            content: "完整、引人注目的资料对于吸引优质买家至关重要。以下是创建有效制造商资料的方法。",
            steps: [
              "添加您的官方公司名称和注册详情",
              "选择您的主要行业和产品类别",
              "上传您的工厂和产品的高质量照片",
              "撰写详细的公司描述，突出您的优势",
              "列出您的认证、出口市场和生产能力"
            ]
          },
          uploadProducts: {
            title: "上传产品",
            content: "有效展示您的产品以吸引买家询问。",
            steps: [
              "转到仪表板 > 产品 > 添加产品",
              "输入产品名称、类别和详细规格",
              "上传多张高质量的产品图像",
              "设置价格范围、最小订单量和交货时间",
              "添加相关认证和自定义选项"
            ]
          },
          manageInquiries: {
            title: "管理询问和 RFQ",
            content: "有效处理询问是将潜在客户转换为客户的关键。",
            steps: [
              "定期监控您的询问仪表板",
              "在 24 小时内回复新 RFQ 以获得最佳效果",
              "提供具有清晰定价明细的详细报价",
              "如果需求不清楚，提出澄清问题",
              "专业跟进以建立关系"
            ]
          },
          analytics: {
            title: "理解您的分析",
            content: "使用分析来优化您的存在并提高转换率。",
            steps: [
              "检查资料浏览次数和访问者人口统计",
              "监控产品询问率和热门项目",
              "跟踪响应时间和消息统计",
              "分析从询问到报价的转换率",
              "识别趋势并相应调整您的策略"
            ]
          },
          profileSetup: {
            title: "设置您的制造商资料",
            content: "优化良好的制造商资料是您在 SourceNest 上的数字展示厅。以下是为最大可见性和买家参与度设置它的方法。",
            steps: [
              "导航到您的仪表板并单击\"编辑资料\"",
              "上传专业的公司徽标和横幅图像",
              "撰写引人注目的公司描述（建议 300-500 字）",
              "添加您的工厂照片、生产线图像和证书",
              "填写所有业务详情：成立年份、员工数量、年收入",
              "列出您的主要产品、出口市场和认证",
              "准确设置您的响应时间和最小订单值"
            ]
          }
        }
      },
      billing: {
        title: "账单和计划",
        description: "关于订阅、付款和发票的信息",
        articles: {
          subscriptionPlans: {
            title: "了解订阅计划",
            content: "SourceNest 为制造商提供灵活的订阅计划。选择最适合您业务需求的计划。",
            steps: [
              "查看定价页面上的所有可用计划",
              "比较功能、产品限制和支持级别",
              "新制造商的 Starter 计划",
              "具有高级分析和优先支持的 Growth 计划",
              "具有专业账户管理的 Enterprise 计划"
            ]
          },
          paymentMethods: {
            title: "付款方式和账单",
            content: "我们接受多种付款方式，使您的订阅轻松便捷。",
            steps: [
              "在结账时选择您的付款方式",
              "接受信用卡、借记卡或 PayPal",
              "发票会自动生成并发送到您的电子邮件",
              "在您的账户设置中更新您的付款方式",
              "随时取消或更改您的计划"
            ]
          },
          invoices: {
            title: "管理发票和收据",
            content: "随时访问您的账单历史并下载发票。",
            steps: [
              "转到设置 > 账单",
              "查看您的完整发票历史记录",
              "下载发票的 PDF 副本供您记录",
              "打印或通过电子邮件发送发票给您的会计部门",
              "如果需要质疑任何费用，请联系支持"
            ]
          }
        }
      }
    }
  },

  // ── About Page ──────────────────────────────────────────────────────
  about: {
    hero: {
      title: "让全球采购运作更顺利",
      subtitle: "SourceNest 致力于改变企业寻找和连接制造合作伙伴的方式。"
    },
    story: {
      title: "我们的故事",
      p1: "全球采购一直充满挑战。买方难以找到可靠的供应商、审查其合法性并有效跨境沟通。尤其是质量导向的制造商，很难在众多选择中脱颖而出并接触到认真的买方。",
      p2: "SourceNest 源于一个简单的想法：如果有一个平台只展示经过审核和批准的制造商呢？一个买方可以确信每个供应商在上市前都经过信息审查的地方？",
      p3: "我们建立了 SourceNest 来实现这一目标。通过要求对每个制造商进行管理员批准并为买方免费提供平台，我们创造了一个质量优先、信任成为每次联系基础的环境。",
      p4: "如今，SourceNest 在 50 多个国家跨越 45 多个行业连接数千名买方与经过审查的制造商。我们很荣幸能够使全球贸易更加便利、透明和高效。"
    },
    stats: {
      countries: "国家",
      suppliers: "审查供应商",
      products: "产品上市",
      industries: "行业覆盖范围"
    },
    missionVision: {
      missionTitle: "我们的使命",
      missionDesc: "通过优质 B2B 平台连接以质量为先的买方和经过审查的制造商，使全球采购更加透明、高效和可信。",
      visionTitle: "我们的愿景",
      visionDesc: "一个寻找合适制造合作伙伴很简单、安全且成功的世界 — 无论地理位置、公司规模或行业如何。"
    },
    values: {
      title: "我们的价值观",
      subtitle: "指导我们一切行动的原则",
      trust: {
        title: "信任与透明",
        description: "我们相信采购应该建立在信任的基础上。每个供应商都根据提交的信息进行审核，我们致力于维持平台质量。"
      },
      global: {
        title: "全球可访问性",
        description: "我们打破国际贸易的壁垒，使各种规模的企业更容易跨境连接。"
      },
      community: {
        title: "社区优先",
        description: "我们不仅在构建平台 — 我们在创建一个以质量为先的买方和制造商社区。"
      },
      innovation: {
        title: "创新",
        description: "我们通过智能功能不断改进平台，使采购更加高效和有效。"
      }
    },
    difference: {
      title: "为什么 SourceNest 与众不同",
      reviewed: {
        title: "仅审查的市场：",
        description: "与任何人都可以上市的开放平台不同，SourceNest 上的每个制造商都经过基于提交信息的审核和批准过程。这意味着买方知道供应商已被筛选，制造商知道他们处于良好的公司中。"
      },
      free: {
        title: "对买方免费：",
        description: "我们相信买方应该无障碍获得优质采购工具。通过为买方免费提供平台，我们确保制造商的最大覆盖范围和采购专业人士的最大访问权限。"
      },
      nocommission: {
        title: "无佣金模式：",
        description: "我们不收取您交易的佣金。制造商仅支付订阅费，所有沟通和谈判直接在各方之间进行。"
      },
      premium: {
        title: "优质专注：",
        description: "我们不是试图成为最大的平台 — 我们试图成为最值得信赖的平台。质量优于数量是我们的指导原则。"
      }
    },
    cta: {
      title: "加入 SourceNest 社区",
      subtitle: "无论您是在采购产品还是制造产品，我们都希望有您。",
      buyerButton: "作为买方加入",
      manufacturerButton: "作为制造商加入"
    }
  }
} as const;

export default es as unknown as TranslationKeys;
