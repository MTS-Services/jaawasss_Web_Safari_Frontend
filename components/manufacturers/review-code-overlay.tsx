"use client"

import { cn } from "@/lib/utils"
import { Shield } from "lucide-react"

interface ReviewCodeOverlayProps {
  code: string
  className?: string
}

/**
 * Floating overlay that displays the review verification code.
 * Designed to be rendered on top of the camera preview so the code
 * appears in every captured photo — making the review authentic.
 */
export default function ReviewCodeOverlay({ code, className }: ReviewCodeOverlayProps) {
  const now = new Date()
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-3 top-3 z-30 flex items-center gap-2 rounded-lg border border-white/20 bg-black/50 px-3 py-2 backdrop-blur-md",
        className
      )}
    >
      <Shield className="h-4 w-4 text-secondary" />
      <div className="text-right">
        <p className="font-mono text-sm font-bold leading-none tracking-widest text-white">
          {code}
        </p>
        <p className="mt-0.5 font-mono text-[10px] leading-none text-white/60">{timestamp}</p>
      </div>
    </div>
  )
}
