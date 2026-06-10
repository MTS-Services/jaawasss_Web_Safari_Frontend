"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { serviceProviders, servicePackages, type ServicePackageTier } from "@/lib/data/service-providers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ServiceProviderSubscriptionPage() {
  const { user } = useAuth()
  const providerId = user?.id ?? "sp-1"
  const provider = serviceProviders.find((p) => p.id === providerId) ?? serviceProviders[0]
  const [current, setCurrent] = useState<ServicePackageTier>(provider.packageTier)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Subscription & Packages</h1>
        <p className="mt-1 text-muted-foreground">
          Choose the plan that fits your business. Upgrade anytime for more visibility and listings.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {servicePackages.map((pkg) => {
          const isCurrent = pkg.tier === current
          return (
            <div
              key={pkg.tier}
              className={cn(
                "relative flex flex-col rounded-xl border bg-card p-6",
                pkg.highlighted ? "border-secondary shadow-sm" : "border-border",
              )}
            >
              {pkg.highlighted && (
                <Badge className="absolute -top-2.5 left-6 bg-secondary text-secondary-foreground">
                  Most popular
                </Badge>
              )}
              <h3 className="font-serif text-lg font-medium text-foreground">{pkg.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-foreground">{pkg.price}</span>
                <span className="text-muted-foreground">{pkg.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={isCurrent ? "outline" : pkg.highlighted ? "default" : "secondary"}
                disabled={isCurrent}
                onClick={() => setCurrent(pkg.tier)}
              >
                {isCurrent ? "Current plan" : `Switch to ${pkg.name}`}
              </Button>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        Billing is simulated in this demo. In production, plan changes would be processed through your payment
        provider and prorated automatically.
      </div>
    </div>
  )
}
