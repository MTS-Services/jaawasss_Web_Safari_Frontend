import {
  Clock,
  CheckCircle2,
  FileText,
  Search,
  CreditCard,
  Sparkles,
  XCircle,
  AlertCircle,
  Send,
  Loader2,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Tone = "neutral" | "info" | "success" | "warning" | "danger"

type StatusConfig = {
  label: string
  tone: Tone
  icon: LucideIcon
}

// Unified status vocabulary across RFQs, offers, and manufacturer review.
const STATUS_MAP: Record<string, StatusConfig> = {
  // RFQ / inquiry lifecycle
  draft: { label: "Draft", tone: "neutral", icon: FileText },
  pending: { label: "Pending", tone: "warning", icon: Clock },
  new: { label: "New", tone: "info", icon: Sparkles },
  "in review": { label: "In Review", tone: "info", icon: Search },
  reviewing: { label: "In Review", tone: "info", icon: Search },
  sent: { label: "Sent", tone: "info", icon: Send },
  quoted: { label: "Quoted", tone: "success", icon: CheckCircle2 },
  offered: { label: "Offer Received", tone: "success", icon: CheckCircle2 },
  accepted: { label: "Accepted", tone: "success", icon: CheckCircle2 },
  declined: { label: "Declined", tone: "danger", icon: XCircle },
  closed: { label: "Closed", tone: "neutral", icon: XCircle },
  expired: { label: "Expired", tone: "neutral", icon: AlertCircle },

  // Manufacturer review lifecycle
  "under review": { label: "Under Review", tone: "info", icon: Search },
  "more info": { label: "Info Requested", tone: "warning", icon: AlertCircle },
  "request more information": { label: "Info Requested", tone: "warning", icon: AlertCircle },
  approved: { label: "Approved", tone: "success", icon: CheckCircle2 },
  "payment required": { label: "Payment Required", tone: "warning", icon: CreditCard },
  processing: { label: "Processing", tone: "info", icon: Loader2 },
  live: { label: "Live", tone: "success", icon: CheckCircle2 },
}

const TONE_STYLES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-info/10 text-info border-info/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
}

const SIZE_STYLES = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-2.5 py-1 gap-1.5",
}

export function StatusBadge({
  status,
  size = "sm",
  showIcon = true,
  className,
}: {
  status: string
  size?: "sm" | "md"
  showIcon?: boolean
  className?: string
}) {
  const key = status.toLowerCase().trim()
  const config = STATUS_MAP[key] ?? { label: status, tone: "neutral" as Tone, icon: FileText }
  const Icon = config.icon
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium whitespace-nowrap",
        TONE_STYLES[config.tone],
        SIZE_STYLES[size],
        className,
      )}
    >
      {showIcon && <Icon className={cn(iconSize, config.icon === Loader2 && "animate-spin")} />}
      {config.label}
    </span>
  )
}
