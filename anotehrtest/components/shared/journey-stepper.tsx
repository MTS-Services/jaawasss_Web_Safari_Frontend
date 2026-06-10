import { Check, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type JourneyStep = {
  label: string
  icon: LucideIcon
}

// Horizontal, scrollable stepper showing the connected sourcing journey.
// `current` is the zero-based index of the active step.
export function JourneyStepper({
  steps,
  current,
  className,
}: {
  steps: JourneyStep[]
  current: number
  className?: string
}) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <ol className="flex min-w-max items-center gap-2 sm:gap-0">
        {steps.map((step, i) => {
          const isComplete = i < current
          const isCurrent = i === current
          const Icon = step.icon
          return (
            <li key={step.label} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isComplete && "border-success bg-success text-success-foreground",
                    isCurrent && "border-secondary bg-secondary text-secondary-foreground",
                    !isComplete && !isCurrent && "border-border bg-card text-muted-foreground",
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 w-8 flex-shrink-0 rounded-full sm:w-12",
                    isComplete ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
