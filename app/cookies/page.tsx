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
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">1. Use of Cookies</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              SourceNest uses cookies to support functionality, improve performance, and analyze usage.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">2. Types of Cookies</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Essential, analytics, and marketing cookies may be used.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">3. Third-Party Services</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Third-party tools may use cookies. SourceNest does not control or guarantee their behavior.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">4. User Control</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Users can manage cookies through browser settings.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">5. Disclaimer</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              SourceNest does not guarantee that cookies or third-party services are secure, error-free, or uninterrupted.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
