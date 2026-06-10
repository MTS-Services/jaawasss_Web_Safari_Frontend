import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Prominent "what to do next" card so users always understand the next step.
export function NextStepCard({
  eyebrow = "Your next step",
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
  className,
}: {
  eyebrow?: string
  title: string
  description: string
  icon: LucideIcon
  actionLabel: string
  actionHref: string
  secondaryLabel?: string
  secondaryHref?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-secondary/30 bg-secondary/5 p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              {eyebrow}
            </p>
            <h3 className="mt-0.5 font-medium text-foreground text-balance">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          {secondaryLabel && secondaryHref && (
            <Button variant="outline" asChild>
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}
          <Button className="gap-2" asChild>
            <Link href={actionHref}>
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
