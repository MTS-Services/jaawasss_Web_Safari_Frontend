import { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "SourceNest cookie policy and how we use cookies on our website.",
}

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-medium text-foreground">Cookie Policy</h1>
          <p className="mt-4 text-muted-foreground">Last updated: March 2026</p>
          
          <div className="prose prose-neutral mt-8 max-w-none">
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">1. What Are Cookies</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">2. How We Use Cookies</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We use cookies to understand how you use our website, remember your preferences, and improve your overall experience. We also use cookies to analyze site traffic and for marketing purposes.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">3. Types of Cookies We Use</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Essential cookies: Required for the website to function properly. Analytics cookies: Help us understand how visitors interact with our website. Marketing cookies: Used to track visitors across websites for advertising purposes.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">4. Managing Cookies</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. However, this may affect the functionality of our website.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">5. Contact Us</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              If you have any questions about our Cookie Policy, please contact us at privacy@sourcenest.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
