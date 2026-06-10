"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { servicePackages } from "@/lib/data/service-providers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function ServiceProviderPackages() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  const handleSelect = () => {
    if (isAuthenticated && user?.role === "service-provider") {
      // Existing providers manage/select their plan in the dashboard
      router.push("/dashboard/service-provider/subscription")
    } else if (isAuthenticated) {
      // Logged in as another role — start a provider account
      router.push("/auth/signup?role=service-provider")
    } else {
      router.push("/auth/signup?role=service-provider")
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {servicePackages.map((pkg) => (
        <div
          key={pkg.tier}
          className={cn(
            "relative flex flex-col rounded-2xl border bg-card p-6",
            pkg.highlighted ? "border-secondary shadow-md" : "border-border",
          )}
        >
          {pkg.highlighted && (
            <Badge className="absolute -top-2.5 left-6 bg-secondary text-secondary-foreground">Most popular</Badge>
          )}
          <h3 className="font-serif text-xl font-medium text-foreground">{pkg.name}</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-semibold text-foreground">{pkg.price}</span>
            <span className="text-muted-foreground">{pkg.period}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>
          <ul className="mt-6 flex-1 space-y-3">
            {pkg.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            className="mt-6 w-full"
            variant={pkg.highlighted ? "default" : "outline"}
            onClick={handleSelect}
          >
            {pkg.price === "$0" ? "Start for free" : `Choose ${pkg.name}`}
          </Button>
        </div>
      ))}
    </div>
  )
}
