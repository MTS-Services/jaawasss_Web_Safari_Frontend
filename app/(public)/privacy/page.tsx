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
              SourceNest is committed to protecting user privacy.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">2. Information Collected</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We may collect personal, business, technical, and transactional information provided by users.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">3. Use of Information</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Information is used to operate the platform, facilitate interactions, improve services, process transactions, and maintain security.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">4. Information Sharing</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Information may be shared between users, with service providers, or as required by law.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">5. Supplier Information Disclaimer</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Supplier information is provided by users. SourceNest does not verify or guarantee the accuracy, completeness, reliability, or legality of such information. Users are solely responsible for verifying any information before relying on it.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">6. No Responsibility for Interactions</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              SourceNest is not responsible for any communications, negotiations, or outcomes between users.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">7. Data Security</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Reasonable safeguards are implemented, but no system is completely secure.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">8. Data Retention</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Data may be retained as required for legal, operational, and security purposes.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">9. Contact</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              <a href="mailto:privacy@sourcenest.com" className="text-primary hover:underline">
                privacy@sourcenest.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
