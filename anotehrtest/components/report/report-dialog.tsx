"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Flag, AlertTriangle, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export type ReportType = "supplier" | "product"

interface ReportDialogProps {
  type: ReportType
  targetId: string
  targetName: string
  children?: React.ReactNode
}

const reportReasons = {
  supplier: [
    { value: "fake", label: "Fake or fraudulent supplier" },
    { value: "scam", label: "Scam or misleading information" },
    { value: "quality", label: "Poor quality or defective products" },
    { value: "communication", label: "Unresponsive or unprofessional" },
    { value: "certification", label: "False certification claims" },
    { value: "other", label: "Other issue" },
  ],
  product: [
    { value: "fake", label: "Fake or counterfeit product" },
    { value: "misleading", label: "Misleading description or images" },
    { value: "prohibited", label: "Prohibited or illegal item" },
    { value: "copyright", label: "Copyright or trademark violation" },
    { value: "safety", label: "Safety concern" },
    { value: "other", label: "Other issue" },
  ],
}

export function ReportDialog({ type, targetId, targetName, children }: ReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason for your report")
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    toast.success("Report submitted successfully", {
      description: "Our team will review your report within 24-48 hours."
    })

    // Reset and close after showing success
    setTimeout(() => {
      setOpen(false)
      setIsSubmitted(false)
      setReason("")
      setDetails("")
    }, 2000)
  }

  const reasons = reportReasons[type]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
            <Flag className="h-4 w-4" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Report Submitted</h3>
            <p className="mt-2 text-muted-foreground">
              Thank you for helping keep SourceNest safe. Our team will review your report.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Report {type === "supplier" ? "Supplier" : "Product"}
              </DialogTitle>
              <DialogDescription>
                Report an issue with <span className="font-medium text-foreground">{targetName}</span>. 
                Our team will review your report and take appropriate action.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">What is the issue?</Label>
                <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
                  {reasons.map((item) => (
                    <div key={item.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={item.value} id={item.value} />
                      <Label htmlFor={item.value} className="cursor-pointer font-normal">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details" className="text-sm font-medium">
                  Additional details (optional)
                </Label>
                <Textarea
                  id="details"
                  placeholder="Please provide any additional information that would help us investigate this report..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">
                  Reports are reviewed by our Trust & Safety team within 24-48 hours. 
                  False reports may result in account restrictions.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !reason}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag className="h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
