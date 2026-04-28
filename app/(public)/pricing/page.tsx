"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PayPalButton } from "@/components/payment/paypal-button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Check, X, ArrowRight, Shield, HelpCircle, Sparkles, Users, CheckCircle, AlertCircle, X as XIcon } from "lucide-react"

const plans = [
  {
    name: "Starter",
    description: "For small manufacturers starting their export journey",
    monthlyPrice: 149,
    yearlyPrice: 1490,
    features: [
      { name: "Company profile", included: true },
      { name: "Up to 25 products", included: true },
      { name: "Internal messaging", included: true },
      { name: "Inquiry inbox", included: true },
      { name: "RFQ reception", included: true },
      { name: "Catalog upload", included: true },
      { name: "Certifications section", included: true },
      { name: "Export markets section", included: true },
      { name: "Basic analytics", included: true },
      { name: "Priority search visibility", included: false },
      { name: "Featured supplier badge", included: false },
      { name: "Multiple team users", included: false },
      { name: "Advanced analytics", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    description: "For established manufacturers seeking more exposure",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    features: [
      { name: "Company profile", included: true },
      { name: "Up to 100 products", included: true },
      { name: "Internal messaging", included: true },
      { name: "Inquiry inbox", included: true },
      { name: "RFQ reception", included: true },
      { name: "Catalog upload", included: true },
      { name: "Certifications section", included: true },
      { name: "Export markets section", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority search visibility", included: true },
      { name: "Featured supplier badge", included: true },
      { name: "Multiple team users (3)", included: true },
      { name: "Premium support", included: false },
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large manufacturers with custom requirements",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      { name: "Company profile", included: true },
      { name: "Unlimited products", included: true },
      { name: "Internal messaging", included: true },
      { name: "Inquiry inbox", included: true },
      { name: "RFQ reception", included: true },
      { name: "Catalog upload", included: true },
      { name: "Certifications section", included: true },
      { name: "Export markets section", included: true },
      { name: "Enterprise analytics", included: true },
      { name: "Premium search placement", included: true },
      { name: "Featured supplier badge", included: true },
      { name: "Unlimited team users", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Priority support", included: true },
      { name: "Custom onboarding", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

const faqs = [
  {
    question: "Does payment automatically publish my profile?",
    answer: "No. Payment creates your manufacturer account, but your profile must still go through our review and approval process before it becomes visible to buyers. This typically takes 2-5 business days after you submit your complete profile.",
  },
  {
    question: "What happens if my profile is not approved?",
    answer: "If your profile doesn't meet our requirements, we'll provide specific feedback on what needs to be updated. You can make the necessary changes and resubmit. If approval is ultimately not possible, we offer a full refund within 30 days.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate applies at your next billing cycle.",
  },
  {
    question: "What is the Founding Manufacturer program?",
    answer: "The Founding Manufacturer program is a limited offer for the first 300 manufacturers who join SourceNest. As a founding member, you get 6 months of free access to our full Growth plan ($299/month value) - including up to 100 products, advanced analytics, priority search visibility, featured supplier badge, and multiple team users. No credit card required to start.",
  },
  {
    question: "What happens after my 6-month free period ends?",
    answer: "After your 6-month free period ends, you'll need to choose and pay for one of our plans (Starter, Growth, or Enterprise) to continue using the platform. We'll send you reminders before your free period expires so you have plenty of time to choose the right plan for your business.",
  },
  {
    question: "Is the Founding Manufacturer program still available?",
    answer: "The program is available until we reach 300 approved manufacturer registrations (pending applications don't count toward the limit). You can see the remaining spots on our pricing page. Once all spots are filled, the program will close and new manufacturers will need to choose a paid plan.",
  },
  {
    question: "Are there any commission fees on sales?",
    answer: "No. SourceNest does not take any commission on deals you close through the platform. Your subscription fee is your only cost.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Enterprise plans, we also offer bank transfer options.",
  },
]

import { useRouter } from "next/navigation"

interface PlanOption {
  name: string;
  price: number;
  cycle: "monthly" | "yearly";
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle")
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const handlePlanSelect = (planName: string, price: number) => {
    setSelectedPlan({
      name: planName,
      price,
      cycle: billingCycle,
    })
    setPaymentStatus("idle")
    setTransactionId(null)
    setErrorMessage(null)
  }

  const handlePaymentSuccess = (id: string) => {
    setPaymentStatus("success")
    setTransactionId(id)
    setTimeout(() => {
      router.push(`/dashboard/manufacturer/subscription?transactionId=${id}`)
    }, 3000)
  }

  const handlePaymentError = (error: string) => {
    setPaymentStatus("error")
    setErrorMessage(error)
  }

  const handleClosePayment = () => {
    setSelectedPlan(null)
    setPaymentStatus("idle")
    setTransactionId(null)
    setErrorMessage(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                Choose the plan that fits your business. All plans include admin review and approval process.
              </p>
              <p className="mt-2 text-sm text-primary-foreground/60">
                Pricing is for manufacturers only. Buyers use SourceNest for free.
              </p>
            </div>
          </div>
        </section>

        {/* Special Launch Plan */}
        <section className="py-16 lg:py-20 bg-linear-to-b from-secondary/5 to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4">
                <Sparkles className="mr-1.5 h-3 w-3" />
                Limited Time Offer
              </Badge>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
                Join as a Founding Manufacturer
              </h2>
              <p className="mt-4 text-muted-foreground">
                Be among the first 300 manufacturers to join and get 6 months free access to our full <span className="font-semibold text-foreground">Growth plan</span> - a $1,794 value.
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              {/* Founding Manufacturer */}
              <div className="relative rounded-2xl border-2 border-secondary bg-card p-8 shadow-lg">
                <Badge className="absolute -top-3 left-6 bg-secondary text-secondary-foreground">
                  <Users className="mr-1.5 h-3 w-3" />
                  First 300 Only
                </Badge>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                    <Sparkles className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Founding Manufacturer</h3>
                    <p className="text-sm text-muted-foreground">Early Supplier Program</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">$0</span>
                    <span className="text-muted-foreground">for 6 months</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm line-through text-muted-foreground">$299/mo</span>
                    <Badge variant="secondary" className="text-xs bg-secondary/20 text-secondary">Save $1,794</Badge>
                  </div>
                  <p className="mt-1 text-sm text-secondary font-medium">No credit card required</p>
                </div>
                <div className="mb-4 rounded-lg bg-secondary/10 p-3 border border-secondary/20">
                  <p className="text-sm text-foreground">
                    Get full <span className="font-semibold text-secondary">Growth plan</span> features free for 6 months. After the trial, continue with any paid plan to keep your account active.
                  </p>
                </div>
                <div className="mb-6 rounded-lg bg-muted/50 p-3 border border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Spots remaining:</span>
                    <span className="font-semibold text-secondary">127 / 300</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-secondary/20">
                    <div className="h-full w-[58%] rounded-full bg-secondary" />
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-foreground">Company profile</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-foreground font-medium">Up to 100 products</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-foreground">Internal messaging</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-foreground">Inquiry inbox & RFQ reception</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-foreground">Catalog upload</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-foreground">Certifications & Export markets</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-foreground font-medium">Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-foreground font-medium">Priority search visibility</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-foreground font-medium">Featured supplier badge</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-secondary" />
                    <span className="text-foreground font-medium">Multiple team users (3)</span>
                  </li>
                </ul>
                <Button
                  className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  onClick={() => router.push('/auth/signup?role=manufacturer&plan=founding')}
                >
                  Apply as Founding Member
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="mt-3 text-xs text-center text-muted-foreground">
                  Subject to admin review and approval
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Toggle & Cards */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
                Paid Plans
              </h2>
              <p className="mt-4 text-muted-foreground">
                For manufacturers ready to maximize their visibility and reach
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-4 rounded-lg bg-muted p-1">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={cn(
                    "rounded-md px-4 py-2 text-sm font-medium transition-all",
                    billingCycle === "monthly"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                    billingCycle === "yearly"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Yearly
                  <Badge variant="secondary" className="text-xs">Save 17%</Badge>
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn(
                    "relative rounded-2xl border bg-card p-8",
                    plan.popular ? "border-secondary shadow-lg" : "border-border"
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="mt-6">
                    {plan.monthlyPrice ? (
                      <>
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-foreground">
                            ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                          </span>
                          <span className="ml-2 text-muted-foreground">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        {billingCycle === "yearly" && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            Billed annually (${Math.round(plan.yearlyPrice! / 12)}/month)
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-4xl font-bold text-foreground">Custom</div>
                    )}
                  </div>
                  <Button
                    className={cn(
                      "mt-6 w-full gap-2",
                      plan.popular && "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    )}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => {
                      if (plan.monthlyPrice) {
                        const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice!
                        handlePlanSelect(plan.name, price)
                      } else {
                        router.push("/contact?type=sales")
                      }
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-3 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-secondary" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/50" />
                        )}
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Approval Notice */}
            <div className="mx-auto mt-12 max-w-2xl rounded-xl bg-secondary/10 p-6 text-center">
              <Shield className="mx-auto h-8 w-8 text-secondary" />
              <h3 className="mt-4 font-semibold text-foreground">Approval Required</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Payment does not automatically publish your profile. All manufacturer accounts go through a review process before becoming visible to buyers. This ensures quality and trust on the platform.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="bg-muted/50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
                Compare All Features
              </h2>
              <p className="mt-4 text-muted-foreground">
                See exactly what&apos;s included in each plan
              </p>
            </div>

            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-150 border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-border p-4 text-left font-medium text-foreground">Feature</th>
                    <th className="border-b border-border p-4 text-center font-medium text-foreground">Starter</th>
                    <th className="border-b border-border p-4 text-center font-medium text-foreground">Growth</th>
                    <th className="border-b border-border p-4 text-center font-medium text-foreground">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">Products limit</td>
                    <td className="border-b border-border p-4 text-center">25</td>
                    <td className="border-b border-border p-4 text-center">100</td>
                    <td className="border-b border-border p-4 text-center">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">Team members</td>
                    <td className="border-b border-border p-4 text-center">1</td>
                    <td className="border-b border-border p-4 text-center">3</td>
                    <td className="border-b border-border p-4 text-center">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">Search visibility</td>
                    <td className="border-b border-border p-4 text-center">Standard</td>
                    <td className="border-b border-border p-4 text-center">Priority</td>
                    <td className="border-b border-border p-4 text-center">Premium</td>
                  </tr>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">Analytics</td>
                    <td className="border-b border-border p-4 text-center">Basic</td>
                    <td className="border-b border-border p-4 text-center">Advanced</td>
                    <td className="border-b border-border p-4 text-center">Enterprise</td>
                  </tr>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">Featured badge</td>
                    <td className="border-b border-border p-4 text-center"><X className="mx-auto h-4 w-4 text-muted-foreground/50" /></td>
                    <td className="border-b border-border p-4 text-center"><Check className="mx-auto h-4 w-4 text-secondary" /></td>
                    <td className="border-b border-border p-4 text-center"><Check className="mx-auto h-4 w-4 text-secondary" /></td>
                  </tr>
                  <tr>
                    <td className="border-b border-border p-4 text-muted-foreground">Account manager</td>
                    <td className="border-b border-border p-4 text-center"><X className="mx-auto h-4 w-4 text-muted-foreground/50" /></td>
                    <td className="border-b border-border p-4 text-center"><X className="mx-auto h-4 w-4 text-muted-foreground/50" /></td>
                    <td className="border-b border-border p-4 text-center"><Check className="mx-auto h-4 w-4 text-secondary" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground">Support level</td>
                    <td className="p-4 text-center">Email</td>
                    <td className="p-4 text-center">Priority email</td>
                    <td className="p-4 text-center">Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <HelpCircle className="mx-auto h-10 w-10 text-secondary" />
              <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-foreground">
                Pricing FAQ
              </h2>
            </div>

            <Accordion type="single" collapsible className="mt-12">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-primary-foreground">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Join SourceNest and start reaching global buyers today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row w-full max-w-lg mx-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto justify-center gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
                  <Link href="/auth/signup?role=manufacturer" className="w-full text-center sm:w-auto">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/contact?type=sales" className="w-full text-center sm:w-auto">
                    Talk to Sales
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
            <div className="w-full max-w-sm rounded-lg bg-white shadow-xl overflow-hidden">
              <div className="border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Complete Your Payment</h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600">{selectedPlan.name} Plan</p>
                  </div>
                  <button
                    onClick={handleClosePayment}
                    className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-6">
                {/* Success State */}
                {paymentStatus === "success" && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                    <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
                    <h3 className="mt-3 font-semibold text-green-900 text-sm sm:text-base">Payment Successful!</h3>
                    <p className="mt-2 text-xs sm:text-sm text-green-700 break-all">
                      Transaction ID: <span className="font-mono text-xs">{transactionId}</span>
                    </p>
                    <p className="mt-4 text-xs text-green-600">
                      Redirecting to sign up...
                    </p>
                  </div>
                )}

                {/* Error State */}
                {paymentStatus === "error" && (
                  <div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4 mb-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-red-600 mt-0.5" />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-red-900 text-sm">Payment Failed</h3>
                          <p className="mt-1 text-xs sm:text-sm text-red-700 break-word">{errorMessage}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setPaymentStatus("idle")}
                      className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Payment Form */}
                {paymentStatus === "idle" && (
                  <div className="space-y-4">
                    {/* Price Summary */}
                    <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm text-gray-600">{selectedPlan.name} Plan ({selectedPlan.cycle})</span>
                        <span className="text-lg sm:text-xl font-bold text-gray-900 shrink-0">
                          ${selectedPlan.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* PayPal Button */}
                    <PayPalButton
                      amount={selectedPlan.price}
                      currency="USD"
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />

                    {/* Info Text */}
                    <div className="rounded-lg bg-blue-50 p-2 sm:p-3 border border-blue-200">
                      <p className="text-xs text-blue-900 leading-relaxed">
                        💡 This typically takes 2-5 business days.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
