"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Camera,
  FileSearch,
  ScanEye,
  Loader2,
  Copy,
  Check,
  Shield,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ManufacturerApplication } from "@/lib/api/admin-manufacturer-registrations"
import {
  createReviewRequest,
  generateReviewCode,
  DEFAULT_FACTORY_AREAS,
  REVIEW_TYPE_LABELS,
  type ReviewType,
} from "@/lib/api/admin-reviews"

interface RequestReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  manufacturer: ManufacturerApplication
}

const REVIEW_TYPE_OPTIONS: {
  value: ReviewType
  label: string
  description: string
  icon: React.ElementType
}[] = [
  {
    value: "live_factory_capture",
    label: "Live Factory Capture",
    description: "Request live camera captures of specific factory areas",
    icon: Camera,
  },
  {
    value: "additional_document_review",
    label: "Additional Document Review",
    description: "Request additional documents for verification",
    icon: FileSearch,
  },
  {
    value: "specific_area_capture",
    label: "Specific Area Capture",
    description: "Request captures of specific custom areas",
    icon: ScanEye,
  },
]

export default function RequestReviewDialog({
  open,
  onOpenChange,
  manufacturer,
}: RequestReviewDialogProps) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  // Form state
  const [reviewType, setReviewType] = useState<ReviewType>("live_factory_capture")
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [customArea, setCustomArea] = useState("")
  const [instructions, setInstructions] = useState("")
  const [reviewCode] = useState(() => generateReviewCode())

  const showAreasSelection =
    reviewType === "live_factory_capture" || reviewType === "specific_area_capture"

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const addCustomArea = () => {
    const trimmed = customArea.trim()
    if (trimmed && !selectedAreas.includes(trimmed)) {
      setSelectedAreas((prev) => [...prev, trimmed])
      setCustomArea("")
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(reviewCode)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleSubmit = async () => {
    if (showAreasSelection && selectedAreas.length === 0) {
      toast({
        title: "Select areas",
        description: "Please select at least one area to review.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await createReviewRequest(manufacturer.id, {
        review_type: reviewType,
        requested_areas: selectedAreas,
        additional_instructions: instructions || undefined,
        review_code: reviewCode,
        // Pass manufacturer metadata for mock data
        _manufacturer_name: [manufacturer.first_name, manufacturer.last_name].filter(Boolean).join(" ") || undefined,
        _manufacturer_email: manufacturer.email,
        _company_name: manufacturer.company_name || undefined,
      })

      toast({
        title: "Review requested",
        description: `Review request ${reviewCode} has been sent to ${manufacturer.company_name || manufacturer.email}.`,
      })

      onOpenChange(false)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to create review request"
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const companyName =
    manufacturer.company_name?.trim() ||
    [manufacturer.first_name, manufacturer.last_name].filter(Boolean).join(" ") ||
    manufacturer.email

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92dvh,52rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        {/* Header */}
        <DialogHeader className="shrink-0 space-y-3 border-b border-border bg-gradient-to-r from-secondary/5 to-transparent px-5 pb-5 pt-5 text-left sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 shadow-sm">
              <ScanEye className="h-5 w-5 text-secondary" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg font-semibold leading-tight">
                Request Review
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Create an official review task for{" "}
                <span className="font-medium text-foreground">{companyName}</span>
              </DialogDescription>
            </div>
          </div>

          {/* Review Code */}
          <div className="flex items-center gap-3 rounded-lg border border-secondary/20 bg-secondary/5 px-4 py-3">
            <Shield className="h-5 w-5 shrink-0 text-secondary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-secondary/80">
                Review Verification Code
              </p>
              <p className="mt-0.5 font-mono text-xl font-bold tracking-widest text-secondary">
                {reviewCode}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 shrink-0 text-secondary hover:bg-secondary/15"
              onClick={copyCode}
            >
              {codeCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <div className="space-y-6">
            {/* Review Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Review Type</Label>
              <div className="grid gap-2.5">
                {REVIEW_TYPE_OPTIONS.map((option) => {
                  const selected = reviewType === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setReviewType(option.value)
                        if (option.value === "additional_document_review") {
                          setSelectedAreas([])
                        }
                      }}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-all",
                        selected
                          ? "border-secondary bg-secondary/5 shadow-sm"
                          : "border-border hover:border-border/80 hover:bg-muted/30"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          selected
                            ? "bg-secondary/15 text-secondary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <option.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            selected ? "text-secondary" : "text-foreground"
                          )}
                        >
                          {option.label}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "mt-1 h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
                          selected
                            ? "border-secondary bg-secondary"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {selected && (
                          <Check className="h-full w-full p-0.5 text-white" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Area Selection */}
            {showAreasSelection && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  <MapPin className="mb-0.5 mr-1.5 inline h-4 w-4 text-muted-foreground" />
                  Requested Areas
                </Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {DEFAULT_FACTORY_AREAS.map((area) => (
                    <label
                      key={area}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                        selectedAreas.includes(area)
                          ? "border-secondary/30 bg-secondary/5"
                          : "border-border hover:bg-muted/30"
                      )}
                    >
                      <Checkbox
                        checked={selectedAreas.includes(area)}
                        onCheckedChange={() => toggleArea(area)}
                        className="data-[state=checked]:border-secondary data-[state=checked]:bg-secondary"
                      />
                      <span className="text-sm">{area}</span>
                    </label>
                  ))}
                </div>

                {/* Custom area */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom area..."
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomArea())}
                    className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addCustomArea}
                    disabled={!customArea.trim()}
                  >
                    Add
                  </Button>
                </div>

                {/* Selected custom areas (non-default) */}
                {selectedAreas
                  .filter((a) => !(DEFAULT_FACTORY_AREAS as readonly string[]).includes(a))
                  .map((area) => (
                    <Badge
                      key={area}
                      variant="secondary"
                      className="mr-1.5 gap-1 px-2.5 py-1"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => toggleArea(area)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}

                {selectedAreas.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedAreas.length} area{selectedAreas.length !== 1 && "s"} selected
                  </p>
                )}
              </div>
            )}

            {/* Additional Instructions */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Additional Instructions{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Provide any specific instructions or notes for the manufacturer..."
                className="min-h-20 resize-none"
              />
            </div>

            {/* Info Notice */}
            <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 px-4 py-3 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              <p className="font-semibold">How this works:</p>
              <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-amber-700 dark:text-amber-400">
                <li>The manufacturer will see this in their <strong>Review Center</strong> (not in messages)</li>
                <li>Camera captures are live only — gallery uploads are blocked</li>
                <li>
                  The verification code <strong className="font-mono">{reviewCode}</strong> will be
                  overlaid during captures
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="shrink-0 gap-2 border-t border-border px-5 py-4 sm:px-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || (showAreasSelection && selectedAreas.length === 0)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <ScanEye className="mr-2 h-4 w-4" />
                Send Review Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
