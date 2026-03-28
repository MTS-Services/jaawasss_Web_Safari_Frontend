"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { 
  Search, 
  Building2, 
  MessageSquare, 
  FileText,
  UserPlus,
  CreditCard,
  Settings,
  Upload,
  CheckCircle,
  Globe
} from "lucide-react"

const buyerSteps = [
  {
    step: 1,
    title: "Search & Discover",
    description: "Browse our global supplier directory, filter by industry, location, certifications, and capabilities to find the perfect manufacturing partners.",
    icon: Search,
  },
  {
    step: 2,
    title: "Compare Suppliers",
    description: "Save your favorite suppliers, compare them side-by-side, review their products, certifications, and capabilities to make informed decisions.",
    icon: Building2,
  },
  {
    step: 3,
    title: "Connect & Communicate",
    description: "Send messages directly to factories, request detailed quotes, and negotiate terms — all within the platform's secure messaging system.",
    icon: MessageSquare,
  },
  {
    step: 4,
    title: "Request Quotes",
    description: "Submit detailed RFQs with specifications, quantities, and requirements. Receive competitive quotes directly from reviewed manufacturers.",
    icon: FileText,
  },
]

const manufacturerSteps = [
  {
    step: 1,
    title: "Create Your Account",
    description: "Sign up as a manufacturer and choose the subscription plan that fits your business needs and growth goals.",
    icon: UserPlus,
  },
  {
    step: 2,
    title: "Complete Payment",
    description: "Subscribe to your chosen plan with secure payment. Your account is created but requires approval before going live.",
    icon: CreditCard,
  },
  {
    step: 3,
    title: "Build Your Profile",
    description: "Complete your factory profile with details, certifications, capabilities, and upload your product catalog and brochures.",
    icon: Settings,
  },
  {
    step: 4,
    title: "Upload Products",
    description: "Add your products with images, specifications, MOQ, lead times, and packaging details to showcase your full range.",
    icon: Upload,
  },
  {
    step: 5,
    title: "Submit for Approval",
    description: "Once ready, submit your profile for our team to review. We assess your submitted information to maintain platform quality.",
    icon: CheckCircle,
  },
  {
    step: 6,
    title: "Go Global",
    description: "After approval, your profile goes live. Start receiving inquiries and quote requests from buyers worldwide.",
    icon: Globe,
  },
]

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<"buyers" | "manufacturers">("buyers")

  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent processes for both buyers and manufacturers
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex rounded-lg bg-background p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("buyers")}
              className={cn(
                "rounded-md px-6 py-2.5 text-sm font-medium transition-all",
                activeTab === "buyers"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              For Buyers
            </button>
            <button
              onClick={() => setActiveTab("manufacturers")}
              className={cn(
                "rounded-md px-6 py-2.5 text-sm font-medium transition-all",
                activeTab === "manufacturers"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              For Manufacturers
            </button>
          </div>
        </div>

        {/* Buyer Steps */}
        {activeTab === "buyers" && (
          <div className="mt-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {buyerSteps.map((item) => (
                <div key={item.step} className="relative">
                  {/* Connector Line */}
                  {item.step < buyerSteps.length && (
                    <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-border lg:block" />
                  )}
                  <div className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-background shadow-md">
                      <item.icon className="h-8 w-8 text-secondary" />
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 rounded-xl bg-secondary/10 p-6 text-center">
              <p className="text-secondary font-medium">
                Buyers use SourceNest completely free — no subscription required.
              </p>
            </div>
          </div>
        )}

        {/* Manufacturer Steps */}
        {activeTab === "manufacturers" && (
          <div className="mt-16">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {manufacturerSteps.map((item) => (
                <div key={item.step} className="relative rounded-xl bg-background p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                      <item.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {item.step}
                        </span>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 rounded-xl bg-secondary/10 p-6 text-center">
              <p className="text-secondary font-medium">
                All manufacturer accounts require admin approval before going live — ensuring quality and trust for buyers.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
