import { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SourceNest privacy policy and data protection information.",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-medium text-foreground">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">Last updated: March 2026</p>
          
          <div className="prose prose-neutral mt-8 max-w-none">
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">1. Introduction</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              SourceNest (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">2. Information We Collect</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, make a purchase, submit an inquiry, or contact us for support. This may include your name, email address, company name, phone number, and payment information.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">3. How We Use Your Information</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">4. Data Security</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">5. Contact Us</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@sourcenest.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
