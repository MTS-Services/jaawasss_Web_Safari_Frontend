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
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">1. Introduction</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              By accessing or using SourceNest, you agree to these Terms of Service.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">2. Platform Nature</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              SourceNest is a neutral technology platform that facilitates connections between independent buyers and suppliers. SourceNest is not a manufacturer, seller, distributor, agent, broker, or party to any transaction between users.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">3. Supplier Information</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              All supplier profiles, product details, certifications, and business information are provided directly by suppliers. SourceNest does not independently verify, audit, or guarantee the accuracy, completeness, reliability, legality, or authenticity of such information.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">4. Review Process</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Suppliers may go through a review and approval process based solely on submitted information. This process is limited in scope and does not constitute verification, certification, endorsement, or guarantee of any kind. The review process does not ensure supplier reliability, product quality, performance, identity, or legal compliance.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">5. No Reliance</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Users must not rely solely on any information, badges, or review status presented on the platform. Users are fully responsible for conducting independent due diligence before entering into any agreement.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">6. Transactions</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              All transactions, negotiations, communications, and agreements are conducted directly between users. SourceNest does not participate in, control, manage, or guarantee any transaction, payment, delivery, or fulfillment.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">7. Buyer Responsibility</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Buyers are solely responsible for evaluating suppliers, verifying credentials, confirming product specifications, and assessing all risks.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">8. No Warranty</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The platform and all content are provided "as is" and "as available" without warranties of any kind, express or implied. SourceNest disclaims all warranties including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">9. Limitation of Liability</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, SourceNest shall not be liable for any direct, indirect, incidental, consequential, or special damages, including but not limited to:
            </p>
            <ul className="mt-2 ml-6 list-disc text-muted-foreground leading-relaxed">
              <li>financial loss</li>
              <li>loss of profits</li>
              <li>business interruption</li>
              <li>failed transactions</li>
              <li>supplier misconduct</li>
              <li>product defects</li>
              <li>delays or non-delivery</li>
              <li>misrepresentation or fraud</li>
            </ul>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">10. Disputes</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              All disputes between users must be resolved directly between the parties. SourceNest is not obligated to mediate, intervene, or resolve disputes.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">11. Indemnification</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Users agree to indemnify, defend, and hold harmless SourceNest from any claims, damages, liabilities, losses, costs, or expenses arising from:
            </p>
            <ul className="mt-2 ml-6 list-disc text-muted-foreground leading-relaxed">
              <li>use of the platform</li>
              <li>interactions with other users</li>
              <li>any transactions or agreements</li>
            </ul>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">12. Account Responsibility</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Users are responsible for maintaining the confidentiality and security of their accounts.
            </p>
            
            <h2 className="mt-8 font-serif text-2xl font-medium text-foreground">13. Modifications</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              SourceNest may update these Terms at any time without prior notice.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
