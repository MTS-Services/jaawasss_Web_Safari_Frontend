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
  Globe,
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function HowItWorksSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"buyers" | "manufacturers">("buyers")

  const buyerSteps = [
    {
      step: 1,
      title: t.landing.howItWorks.buyerStep1Title,
      description: t.landing.howItWorks.buyerStep1Desc,
      icon: Search,
    },
    {
      step: 2,
      title: t.landing.howItWorks.buyerStep2Title,
      description: t.landing.howItWorks.buyerStep2Desc,
      icon: Building2,
    },
    {
      step: 3,
      title: t.landing.howItWorks.buyerStep3Title,
      description: t.landing.howItWorks.buyerStep3Desc,
      icon: MessageSquare,
    },
    {
      step: 4,
      title: t.landing.howItWorks.buyerStep4Title,
      description: t.landing.howItWorks.buyerStep4Desc,
      icon: FileText,
    },
  ]

  const manufacturerSteps = [
    {
      step: 1,
      title: t.landing.howItWorks.mfgStep1Title,
      description: t.landing.howItWorks.mfgStep1Desc,
      icon: UserPlus,
    },
    {
      step: 2,
      title: t.landing.howItWorks.mfgStep5Title,
      description: t.landing.howItWorks.mfgStep5Desc,
      icon: CheckCircle,
    },
    {
      step: 3,
      title: t.landing.howItWorks.mfgStep2Title,
      description: t.landing.howItWorks.mfgStep2Desc,
      icon: CreditCard,
    },
    {
      step: 4,
      title: t.landing.howItWorks.mfgStep3Title,
      description: t.landing.howItWorks.mfgStep3Desc,
      icon: Settings,
    },
    {
      step: 5,
      title: t.landing.howItWorks.mfgStep4Title,
      description: t.landing.howItWorks.mfgStep4Desc,
      icon: Upload,
    },
    
    {
      step: 6,
      title: t.landing.howItWorks.mfgStep6Title,
      description: t.landing.howItWorks.mfgStep6Desc,
      icon: Globe,
    },
  ]

  return (
    <section className="bg-muted/50 py-8 sm:py-12 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t.landing.howItWorks.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.landing.howItWorks.subtitle}
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
              {t.landing.howItWorks.tabBuyers}
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
              {t.landing.howItWorks.tabMfg}
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
                {t.landing.howItWorks.buyerFree}
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
                {t.landing.howItWorks.mfgApproval}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
