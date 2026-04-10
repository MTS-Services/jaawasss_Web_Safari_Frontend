"use client"

import Link from "next/link"
import Image from "next/image"
import { Linkedin, Twitter, Facebook, Youtube } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function Footer() {
  const { t } = useTranslation()

  // Guard against undefined translations during SSR/hydration
  if (!t || !t.landing || !t.landing.footer) {
    return null
  }

  const footerLinks = {
    platform: {
      title: t.landing.footer.platform,
      links: [
        { label: t.landing.footer.forBuyers, href: "/for-buyers" },
        { label: t.landing.footer.forMfg, href: "/for-manufacturers" },
        { label: t.landing.footer.pricing, href: "/pricing" },
        { label: t.landing.footer.search, href: "/search" },
      ],
    },
    discover: {
      title: t.landing.footer.discover,
      links: [
        { label: t.landing.footer.browseSuppliers, href: "/suppliers" },
        { label: t.landing.footer.browseProducts, href: "/products" },
        { label: t.landing.footer.industries, href: "/industries" },
        { label: t.landing.footer.rfq, href: "/rfq/new" },
      ],
    },
    resources: {
      title: t.landing.footer.resources,
      links: [
        { label: t.landing.footer.helpCenter, href: "/help" },
        { label: t.landing.footer.reviewProcess, href: "/verification" },
        { label: t.landing.footer.faq, href: "/faq" },
        { label: t.landing.footer.blog, href: "/blog" },
      ],
    },
    company: {
      title: t.landing.footer.company,
      links: [
        { label: t.landing.footer.aboutUs, href: "/about" },
        { label: t.landing.footer.contact, href: "/contact" },
        { label: t.landing.footer.buyerDash, href: "/dashboard/buyer" },
        { label: t.landing.footer.mfgDash, href: "/dashboard/manufacturer" },
      ],
    },
    legal: {
      title: t.landing.footer.legal,
      links: [
        { label: t.landing.footer.privacy, href: "/privacy" },
        { label: t.landing.footer.terms, href: "/terms" },
        { label: t.landing.footer.cookie, href: "/cookies" },
      ],
    },
  }

  const industries = [
    { label: "Electronics & Electrical", href: "/industries/electronics-electrical" },
    { label: "Machinery & Equipment", href: "/industries/machinery-equipment" },
    { label: "Textiles & Apparel", href: "/industries/textiles-apparel" },
    { label: "Home & Garden", href: "/industries/home-garden" },
    { label: "Health & Beauty", href: "/industries/health-beauty" },
    { label: t.landing.footer.viewAll, href: "/industries" },
  ]

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.avif"
                alt="SourceNest"
                width={48}
                height={48}
                className="rounded-lg object-contain h-10 w-10 sm:h-12 sm:w-12"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/80">
              {t.landing.footer.slogan}
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
          <h3 className="text-sm font-semibold">{t.landing.footer.popular}</h3>
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
            © {new Date().getFullYear()} SourceNest. {t.landing.footer.rights}
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
