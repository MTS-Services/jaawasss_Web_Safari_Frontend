export interface StaticArticle {
  id: number
  slug: string
  title: string
  category: string
  excerpt: string
  content: string
  imageUrl: string
  author: string
  publishedAt: string
  readTime: string
  isFeatured: boolean
  metaTitle: string
  metaDescription: string
  tags: string[]
}

export const STATIC_ARTICLES: StaticArticle[] = [
  {
    id: 1,
    slug: "how-to-find-the-right-manufacturer-for-your-product",
    title: "How to Find the Right Manufacturer for Your Product",
    category: "Global Sourcing",
    excerpt:
      "Finding the right manufacturer is not only about price. Buyers should review product fit, production capabilities, MOQ, export experience, certifications, and communication quality before making a sourcing decision.",
    content: `<p>Finding the right manufacturer is one of the most important steps in international sourcing. Many buyers start by looking for the cheapest supplier, but price alone is not enough to make a smart decision.</p>

<p>A good manufacturer should match the buyer's product requirements, production volume, packaging needs, quality expectations, and export destination. Before contacting a manufacturer, buyers should review the company profile, product categories, minimum order quantity, production capabilities, certifications when applicable, and export experience.</p>

<p>Clear manufacturer information helps buyers save time and avoid unnecessary conversations with suppliers that may not fit their needs. This is why SourceNest focuses on structured manufacturer profiles that allow buyers to understand the company before starting the first conversation.</p>

<p>When choosing a manufacturer, buyers should look at:</p>
<ul>
  <li>Product specialization</li>
  <li>MOQ and production capacity</li>
  <li>Packaging and private label options</li>
  <li>Certifications when needed</li>
  <li>Export markets</li>
  <li>Response quality</li>
  <li>Company information</li>
  <li>Reviewed profile status</li>
</ul>

<p>The goal is not only to find a supplier, but to find the right manufacturing partner for the buyer's sourcing needs.</p>`,
    imageUrl: "/blog/article_find_manufacturer.png",
    author: "SourceNest Editorial Team",
    publishedAt: "2025-01-15",
    readTime: "5 min read",
    isFeatured: true,
    metaTitle: "How to Find the Right Manufacturer | SourceNest",
    metaDescription:
      "Learn how to choose the right manufacturer by reviewing product fit, MOQ, production capabilities, export experience, and company information.",
    tags: ["Global Sourcing", "Manufacturer", "MOQ", "Sourcing Tips"],
  },
  {
    id: 2,
    slug: "what-is-an-rfq-and-why-it-matters-in-global-sourcing",
    title: "What Is an RFQ and Why It Matters in Global Sourcing",
    category: "RFQ Guides",
    excerpt:
      "A structured RFQ helps buyers receive clearer offers and helps manufacturers respond with accurate pricing, MOQ, production time, packaging details, and payment terms.",
    content: `<p>An RFQ, or Request for Quotation, is a structured request sent by a buyer to one or more manufacturers in order to receive pricing and supply details for a specific product.</p>

<p>In global sourcing, RFQs are very important because unclear messages often lead to unclear offers. If a buyer simply writes "I need toilet paper" or "send me price," the manufacturer may not have enough information to provide an accurate quotation.</p>

<p>A professional RFQ should include:</p>
<ul>
  <li>Product name</li>
  <li>Quantity</li>
  <li>Packaging requirements</li>
  <li>Destination country</li>
  <li>Private label requirements</li>
  <li>Required certifications</li>
  <li>Shipping terms</li>
  <li>Target delivery time</li>
  <li>Additional notes or files</li>
</ul>

<p>When RFQs are structured properly, manufacturers can respond with more accurate and comparable offers. This allows buyers to compare suppliers based on price, MOQ, production time, payment terms, and product details.</p>

<p>SourceNest is built to make the RFQ process clearer and more professional. Instead of random messages and scattered replies, buyers and manufacturers can communicate around structured sourcing requests.</p>`,
    imageUrl: "/blog/article_rfq_guide.png",
    author: "SourceNest Editorial Team",
    publishedAt: "2025-01-22",
    readTime: "4 min read",
    isFeatured: false,
    metaTitle: "What Is an RFQ? | SourceNest RFQ Guide",
    metaDescription:
      "Understand what an RFQ is and why structured quotation requests help buyers receive clearer and more accurate supplier offers.",
    tags: ["RFQ", "Quotation", "Sourcing", "Procurement"],
  },
  {
    id: 3,
    slug: "why-clear-manufacturer-profiles-save-buyers-time",
    title: "Why Clear Manufacturer Profiles Save Buyers Time",
    category: "Buyer Guides",
    excerpt:
      "Clear manufacturer profiles help buyers understand products, capabilities, MOQ, export markets, and company information before deciding who to contact.",
    content: `<p>One of the biggest challenges in sourcing is wasting time on suppliers that do not match the buyer's needs. Many platforms show large lists of suppliers, but the information is often incomplete, unclear, or difficult to compare.</p>

<p>Clear manufacturer profiles help solve this problem.</p>

<p>A strong profile should show:</p>
<ul>
  <li>Company overview</li>
  <li>Country and location</li>
  <li>Main product categories</li>
  <li>Product images and catalogs</li>
  <li>MOQ information</li>
  <li>Production capabilities</li>
  <li>Packaging options</li>
  <li>Export markets</li>
  <li>Certifications when applicable</li>
  <li>Reviewed status</li>
  <li>Contact and RFQ options</li>
</ul>

<p>When this information is available before the first conversation, buyers can make better decisions and avoid unnecessary back-and-forth communication.</p>

<p>For manufacturers, a clear profile is also valuable. It helps present the company professionally and gives buyers more confidence before sending an RFQ.</p>

<p>SourceNest is designed around this idea: buyers should understand the manufacturer before contacting them.</p>`,
    imageUrl: "/blog/article_manufacturer_profiles.png",
    author: "SourceNest Editorial Team",
    publishedAt: "2025-02-05",
    readTime: "4 min read",
    isFeatured: false,
    metaTitle: "Why Clear Manufacturer Profiles Matter | SourceNest",
    metaDescription:
      "Learn how clear manufacturer profiles help buyers save time, compare suppliers, and make better sourcing decisions.",
    tags: ["Buyer Guide", "Manufacturer Profiles", "Supplier Discovery"],
  },
  {
    id: 4,
    slug: "reviewed-manufacturers-what-it-means-on-sourcenest",
    title: "Reviewed Manufacturers: What It Means on SourceNest",
    category: "Factory Review",
    excerpt:
      "SourceNest uses a reviewed manufacturer process to improve profile quality, support buyer trust, and help manufacturers present clearer company information.",
    content: `<p>On SourceNest, the word "Reviewed" is used to describe manufacturers that have gone through a platform review process before becoming visible or fully active on the platform.</p>

<p>The purpose of this process is to improve profile quality and help buyers review manufacturer information more clearly. It does not represent a legal guarantee or official certification, but it helps create a more professional sourcing environment.</p>

<p>The review process may include:</p>
<ul>
  <li>Company information review</li>
  <li>Product and catalog review</li>
  <li>Factory information review</li>
  <li>Certifications review when applicable</li>
  <li>Profile completeness check</li>
  <li>Live factory photo review when requested</li>
</ul>

<p>In some cases, SourceNest may request selected manufacturers to submit live factory photos with a unique review code. This helps support the review process and adds another layer of profile confidence.</p>

<p>For buyers, the reviewed process helps create a clearer starting point. For manufacturers, it helps build a stronger and more professional profile on the platform.</p>`,
    imageUrl: "/blog/article_reviewed_manufacturers.png",
    author: "SourceNest Editorial Team",
    publishedAt: "2025-02-18",
    readTime: "5 min read",
    isFeatured: false,
    metaTitle: "Reviewed Manufacturers on SourceNest",
    metaDescription:
      "Learn what Reviewed Manufacturer means on SourceNest and how the review process supports profile quality and sourcing trust.",
    tags: ["Reviewed", "Factory Review", "Manufacturer Quality", "Trust"],
  },
  {
    id: 5,
    slug: "how-to-compare-supplier-offers-professionally",
    title: "How to Compare Supplier Offers Professionally",
    category: "Supplier Comparison",
    excerpt:
      "Comparing supplier offers is not only about the lowest price. Buyers should also review MOQ, production time, payment terms, packaging, certifications, and supplier fit.",
    content: `<p>When buyers receive offers from different manufacturers, the cheapest price is not always the best choice. A professional sourcing decision should be based on several important factors.</p>

<p>A supplier offer should be compared by:</p>
<ul>
  <li>Unit price</li>
  <li>MOQ</li>
  <li>Production time</li>
  <li>Payment terms</li>
  <li>Packaging details</li>
  <li>Private label availability</li>
  <li>Shipping terms</li>
  <li>Certifications</li>
  <li>Product images or samples</li>
  <li>Communication quality</li>
  <li>Manufacturer profile quality</li>
</ul>

<p>For example, one manufacturer may offer the lowest price but require a very high MOQ. Another manufacturer may have a slightly higher price but better production time, better packaging, or stronger export experience.</p>

<p>A clear comparison helps buyers make smarter decisions and reduces the risk of choosing the wrong supplier.</p>

<p>SourceNest aims to make supplier comparison easier by organizing offers in a structured way, so buyers can compare important details side by side instead of reviewing scattered messages.</p>`,
    imageUrl: "/blog/article_supplier_comparison.png",
    author: "SourceNest Editorial Team",
    publishedAt: "2025-03-03",
    readTime: "5 min read",
    isFeatured: false,
    metaTitle: "How to Compare Supplier Offers | SourceNest",
    metaDescription:
      "Learn how to compare supplier offers by reviewing price, MOQ, production time, payment terms, packaging, and manufacturer fit.",
    tags: ["Supplier Comparison", "Procurement", "MOQ", "Sourcing Decision"],
  },
  {
    id: 6,
    slug: "private-label-sourcing-what-buyers-should-know",
    title: "Private Label Sourcing: What Buyers Should Know",
    category: "Private Label",
    excerpt:
      "Private label sourcing requires clear communication about packaging, branding, MOQ, production time, product specifications, and quality expectations.",
    content: `<p>Private label sourcing allows buyers to sell products under their own brand name, while the manufacturer produces the product according to agreed specifications.</p>

<p>This can be a powerful business model, but it requires clear planning from the beginning.</p>

<p>Buyers should prepare:</p>
<ul>
  <li>Product specifications</li>
  <li>Packaging design requirements</li>
  <li>Logo and brand placement</li>
  <li>Labeling requirements</li>
  <li>MOQ expectations</li>
  <li>Target market</li>
  <li>Required certifications</li>
  <li>Sample requirements</li>
  <li>Production timeline</li>
</ul>

<p>Not every manufacturer offers private label services. Some factories only produce standard products, while others can support custom packaging, custom labeling, or full OEM production.</p>

<p>Before choosing a manufacturer, buyers should confirm whether private label is available, what the MOQ is, how long packaging production takes, and what files or designs are required.</p>

<p>SourceNest helps buyers review manufacturer profiles and understand which suppliers may support private label production before starting the conversation.</p>`,
    imageUrl: "/blog/article_private_label.png",
    author: "SourceNest Editorial Team",
    publishedAt: "2025-03-17",
    readTime: "5 min read",
    isFeatured: false,
    metaTitle: "Private Label Sourcing Guide | SourceNest",
    metaDescription:
      "Learn what buyers should know before sourcing private label products, including packaging, MOQ, branding, and manufacturer requirements.",
    tags: ["Private Label", "OEM", "Branding", "Packaging", "Sourcing"],
  },
  {
    id: 7,
    slug: "how-manufacturers-can-build-trust-with-global-buyers",
    title: "How Manufacturers Can Build Trust with Global Buyers",
    category: "Manufacturer Tips",
    excerpt:
      "Manufacturers can build stronger buyer trust by presenting clear company information, product catalogs, export experience, certifications, and professional RFQ responses.",
    content: `<p>Global buyers often make decisions before they ever speak to a manufacturer. A professional profile can make a strong first impression and increase the chance of receiving serious RFQs.</p>

<p>Manufacturers should focus on presenting clear and complete information, including:</p>
<ul>
  <li>Company overview</li>
  <li>Main products</li>
  <li>Product photos</li>
  <li>Catalogs</li>
  <li>MOQ</li>
  <li>Production capacity</li>
  <li>Packaging options</li>
  <li>Export markets</li>
  <li>Certifications when applicable</li>
  <li>Factory photos</li>
  <li>Clear contact and response process</li>
</ul>

<p>Professional communication is also important. When buyers send RFQs, manufacturers should respond with complete quotations that include price, MOQ, production time, payment terms, packaging details, and any important notes.</p>

<p>A strong manufacturer profile helps buyers understand the company faster and makes the sourcing process more efficient for both sides.</p>

<p>SourceNest gives manufacturers a professional place to showcase their company and connect with buyers looking for clearer sourcing information.</p>`,
    imageUrl: "/blog/article_manufacturer_trust.png",
    author: "SourceNest Editorial Team",
    publishedAt: "2025-04-01",
    readTime: "5 min read",
    isFeatured: false,
    metaTitle: "How Manufacturers Can Build Trust | SourceNest",
    metaDescription:
      "Tips for manufacturers to build trust with global buyers through clear profiles, product catalogs, export information, and professional RFQ responses.",
    tags: ["Manufacturer Tips", "Export", "RFQ", "Business Trust"],
  },
  {
    id: 8,
    slug: "supplier-directory-vs-sourcing-platform-what-is-the-difference",
    title: "Supplier Directory vs. Sourcing Platform: What Is the Difference?",
    category: "Global Sourcing",
    excerpt:
      "A supplier directory lists companies. A sourcing platform helps buyers discover, request, compare, and make better sourcing decisions.",
    content: `<p>Many B2B websites work like supplier directories. They show long lists of companies and allow buyers to search manually. While this can be useful, it often leaves buyers doing most of the work alone.</p>

<p>A sourcing platform goes further.</p>

<p>Instead of only listing manufacturers, a sourcing platform should help buyers:</p>
<ul>
  <li>Understand company information</li>
  <li>Review product and factory details</li>
  <li>Send structured RFQs</li>
  <li>Receive organized offers</li>
  <li>Compare suppliers</li>
  <li>Make better sourcing decisions</li>
</ul>

<p>For manufacturers, a sourcing platform provides a professional environment to present their company, products, certifications, export capabilities, and RFQ responses.</p>

<p>The difference is simple:<br />
A directory helps buyers find suppliers.<br />
A sourcing platform helps buyers make sourcing decisions.</p>

<p>SourceNest is being built as a global sourcing platform focused on clear manufacturer profiles, structured RFQs, reviewed manufacturers, and smarter sourcing workflows.</p>`,
    imageUrl: "/blog/article_sourcing_platform.png",
    author: "SourceNest Editorial Team",
    publishedAt: "2025-04-14",
    readTime: "4 min read",
    isFeatured: false,
    metaTitle: "Supplier Directory vs Sourcing Platform | SourceNest",
    metaDescription:
      "Understand the difference between a supplier directory and a sourcing platform, and how SourceNest supports clearer sourcing decisions.",
    tags: ["Global Sourcing", "B2B Platform", "Supplier Directory", "RFQ"],
  },
]

export const ARTICLE_CATEGORIES = [
  "All",
  "Global Sourcing",
  "RFQ Guides",
  "Buyer Guides",
  "Factory Review",
  "Supplier Comparison",
  "Private Label",
  "Manufacturer Tips",
  "Import & Export",
  "Supply Chain",
  "Trade Insights",
]

export function getArticleBySlug(slug: string): StaticArticle | undefined {
  return STATIC_ARTICLES.find((a) => a.slug === slug)
}

export function formatPublishedDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}
