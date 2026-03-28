import Link from "next/link"
import { Factory, Linkedin, Twitter, Facebook, Youtube } from "lucide-react"

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { label: "For Buyers", href: "/for-buyers" },
      { label: "For Manufacturers", href: "/for-manufacturers" },
      { label: "Pricing", href: "/pricing" },
      { label: "Search", href: "/search" },
    ],
  },
  discover: {
    title: "Discover",
    links: [
      { label: "Browse Suppliers", href: "/suppliers" },
      { label: "Browse Products", href: "/products" },
      { label: "Industries", href: "/industries" },
      { label: "Request Quote", href: "/rfq/new" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Review Process", href: "/verification" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog & Insights", href: "/blog" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Buyer Dashboard", href: "/dashboard/buyer" },
      { label: "Manufacturer Dashboard", href: "/dashboard/manufacturer" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
}

const industries = [
  { label: "Electronics & Electrical", href: "/industries/electronics-electrical" },
  { label: "Machinery & Equipment", href: "/industries/machinery-equipment" },
  { label: "Textiles & Apparel", href: "/industries/textiles-apparel" },
  { label: "Home & Garden", href: "/industries/home-garden" },
  { label: "Health & Beauty", href: "/industries/health-beauty" },
  { label: "View All Industries", href: "/industries" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Factory className="h-5 w-5 text-secondary-foreground" />
              </div>
              <span className="font-serif text-xl font-medium">SourceNest</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/80">
              The premium global sourcing platform connecting buyers with reviewed manufacturers worldwide.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="text-sm font-semibold">{footerLinks.platform.title}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.platform.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{footerLinks.discover.title}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.discover.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{footerLinks.resources.title}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{footerLinks.company.title}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Industries Row */}
        <div className="mt-12 border-t border-primary-foreground/10 pt-8">
          <h3 className="text-sm font-semibold">Popular Industries</h3>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {industries.map((industry) => (
              <Link
                key={industry.href}
                href={industry.href}
                className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                {industry.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} SourceNest. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.legal.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
