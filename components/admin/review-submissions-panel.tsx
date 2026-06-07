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
import { useToast } from "@/hooks/use-toast"
import {
  Check,
  X,
  RefreshCcw,
  Loader2,
  Camera,
  Clock,
  Shield,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type {
  ReviewRequest,
  ReviewSubmission,
  ReviewCapture,
  ReviewRequestStatus,
} from "@/lib/api/admin-reviews"
import {
  updateReviewRequestStatus,
  REVIEW_TYPE_LABELS,
  REVIEW_STATUS_LABELS,
} from "@/lib/api/admin-reviews"

// ─── Status badge styles ─────────────────────────────────────────────────────

function statusVariant(status: ReviewRequestStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
    case "submitted":
      return "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
    case "approved":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300"
    case "re_requested":
      return "bg-secondary/15 text-secondary"
    case "completed":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
    default:
      return ""
  }
}

export function ReviewStatusBadge({ status }: { status: ReviewRequestStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-semibold", statusVariant(status))}
    >
      {REVIEW_STATUS_LABELS[status] || status}
    </Badge>
  )
}

// ─── Capture lightbox ────────────────────────────────────────────────────────

function CaptureLightbox({
  captures,
  initialIndex,
  onClose,
}: {
  captures: ReviewCapture[]
  initialIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const current = captures[index]

  if (!current) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center gap-4">
        {/* Image */}
        <div className="relative max-h-[80dvh] max-w-[90vw] overflow-hidden rounded-xl">
          <img
            src={current.photo_url}
            alt={current.area_name}
            className="max-h-[80dvh] max-w-[90vw] object-contain"
          />
          {/* Metadata overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
            <p className="text-sm font-semibold text-white">{current.area_name}</p>
            {current.captured_at && (
              <p className="mt-0.5 text-xs text-white/70">
                {(() => {
                  try {
                    return format(new Date(current.captured_at), "MMM d, yyyy 'at' h:mm a")
                  } catch {
                    return current.captured_at
                  }
                })()}
              </p>
            )}
            {current.has_review_code && (
              <Badge className="mt-1.5 bg-secondary text-secondary-foreground text-xs font-medium">
                <Shield className="mr-1 h-3 w-3" />
                Code Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Navigation */}
        {captures.length > 1 && (
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIndex((p) => (p > 0 ? p - 1 : captures.length - 1))}
              className="h-10 w-10 text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm text-white/70">
              {index + 1} / {captures.length}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIndex((p) => (p < captures.length - 1 ? p + 1 : 0))}
              className="h-10 w-10 text-white hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main panel component ────────────────────────────────────────────────────

interface ReviewSubmissionsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  review: ReviewRequest
  onStatusChange?: () => void
}

export default function ReviewSubmissionsPanel({
  open,
  onOpenChange,
  review,
  onStatusChange,
}: ReviewSubmissionsPanelProps) {
  const { toast } = useToast()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectInput, setShowRejectInput] = useState(false)

  const submission = review.submissions?.[0]
  const allCaptures = submission?.captures || []

  const handleAction = async (
    status: ReviewRequestStatus,
    reason?: string
  ) => {
    try {
      setActionLoading(status)
      await updateReviewRequestStatus(review.id, status, reason)

      toast({
        title: "Success",
        description: `Review ${REVIEW_STATUS_LABELS[status].toLowerCase()}.`,
      })

      onStatusChange?.()
      if (status !== "rejected") {
        onOpenChange(false)
      }
      setShowRejectInput(false)
      setRejectReason("")
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update status"
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—"
    try {
      return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a")
    } catch {
      return dateStr
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton
          className="flex max-h-[min(92dvh,56rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
        >
          {/* Header */}
          <DialogHeader className="shrink-0 space-y-3 border-b border-border bg-gradient-to-r from-secondary/5 to-transparent px-5 pb-5 pt-5 text-left sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg font-semibold">
                  Review Submission
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm">
                  {review.company_name || review.manufacturer_name || "Manufacturer"} —{" "}
                  {REVIEW_TYPE_LABELS[review.review_type]}
                </DialogDescription>
              </div>
              <ReviewStatusBadge status={review.status} />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-secondary/5 border border-secondary/10 px-3 py-1.5 text-sm">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="font-mono font-bold text-secondary">
                  {review.review_code}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Requested {formatDate(review.created_at)}
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            <div className="space-y-5">
              {/* Requested Areas */}
              <div className="rounded-xl border border-border/60 bg-gradient-to-br from-background to-muted/30 p-4 shadow-sm">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Requested Areas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {review.requested_areas.map((area) => (
                    <Badge key={area} variant="outline" className="px-2.5 py-1">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {review.additional_instructions && (
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-background to-muted/30 p-4 shadow-sm">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Instructions
                  </h4>
                  <p className="text-sm text-foreground">{review.additional_instructions}</p>
                </div>
              )}

              {/* Submissions */}
              {submission ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <Camera className="h-4 w-4 text-secondary" />
                      Submitted Captures
                      <Badge variant="outline" className="font-semibold">
                        {allCaptures.length}
                      </Badge>
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(submission.submitted_at)}
                    </p>
                  </div>

                  {/* Capture grid */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {allCaptures.map((capture, i) => (
                      <button
                        key={String(capture.id)}
                        type="button"
                        onClick={() => setLightboxIndex(i)}
                        className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border/60 bg-muted shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-secondary/30"
                      >
                        <img
                          src={capture.photo_url}
                          alt={capture.area_name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute bottom-0 left-0 right-0 translate-y-2 px-2.5 pb-2.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="truncate text-xs font-medium text-white">
                            {capture.area_name}
                          </p>
                        </div>
                        {capture.has_review_code && (
                          <div className="absolute right-1.5 top-1.5">
                            <Badge className="bg-secondary text-secondary-foreground text-[10px] px-1.5 py-0.5 font-medium">
                              <Shield className="mr-0.5 h-2.5 w-2.5" />
                              ✓
                            </Badge>
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <ZoomIn className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Submission notes */}
                  {submission.notes && (
                    <div className="rounded-lg bg-muted/40 px-4 py-3">
                      <p className="text-xs font-semibold text-muted-foreground">Manufacturer Notes</p>
                      <p className="mt-1 text-sm">{submission.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center py-10 text-center">
                  <Camera className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm font-medium text-foreground">No submissions yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The manufacturer hasn&apos;t submitted their review captures yet.
                  </p>
                </div>
              )}

              {/* Reject reason input */}
              {showRejectInput && (
                <div className="space-y-2 rounded-lg border border-red-200/60 bg-red-50/40 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                  <Label className="text-sm font-semibold text-red-700 dark:text-red-400">
                    Reason for Rejection *
                  </Label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Explain why this submission is being rejected..."
                    className="min-h-20 resize-none border-red-200 focus-visible:ring-red-500/30 dark:border-red-500/30"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowRejectInput(false)
                        setRejectReason("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={!rejectReason.trim() || actionLoading === "rejected"}
                      onClick={() => handleAction("rejected", rejectReason)}
                    >
                      {actionLoading === "rejected" ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : null}
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with actions */}
          {submission && review.status === "submitted" && !showRejectInput && (
            <DialogFooter className="shrink-0 gap-2 border-t border-border px-5 py-4 sm:px-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectInput(true)}
                disabled={actionLoading !== null}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10"
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("re_requested")}
                disabled={actionLoading !== null}
                className="text-secondary hover:bg-secondary/10 hover:text-secondary"
              >
                {actionLoading === "re_requested" ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
                )}
                Request Another
              </Button>
              <Button
                size="sm"
                onClick={() => handleAction("approved")}
                disabled={actionLoading !== null}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {actionLoading === "approved" ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                )}
                Approve Review
              </Button>
            </DialogFooter>
          )}

          {/* Mark as completed for approved reviews */}
          {review.status === "approved" && (
            <DialogFooter className="shrink-0 gap-2 border-t border-border px-5 py-4 sm:px-6">
              <Button
                size="sm"
                onClick={() => handleAction("completed")}
                disabled={actionLoading !== null}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {actionLoading === "completed" ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                )}
                Mark as Completed
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <CaptureLightbox
          captures={allCaptures}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
