import { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SourceNest terms of service and user agreement.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-medium text-foreground">Terms of Service</h1>
          <p className="mt-4 text-muted-foreground">Last updated: March 2026</p>
          
          <div className="prose prose-neutral mt-8 max-w-none">
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              By accessing and using SourceNest, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">2. Use License</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Permission is granted to temporarily access the materials on SourceNest for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">3. User Accounts</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">4. Buyer and Supplier Conduct</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              All users agree to conduct business in good faith. Suppliers must provide accurate information about their products and capabilities. Buyers must provide accurate information about their requirements.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">5. Limitation of Liability</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              SourceNest shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">6. Contact Information</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Questions about the Terms of Service should be sent to us at info@sourcenest.tech.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
