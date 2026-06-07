"use client"

import type { ComponentType, CSSProperties, ReactNode } from "react"
import * as Icons from "lucide-react"

interface DynamicIconProps {
  name?: string | null
  size?: number
  className?: string
  color?: string
  fallback?: ReactNode
}

/** Lucide icons are often `forwardRef` objects (`typeof` is `"object"`), not plain functions. */
function isLikelyComponent(thing: unknown): boolean {
  if (thing == null) return false
  if (typeof thing === "function") return true
  if (typeof thing === "object") {
    const candidate = thing as { render?: unknown }
    return typeof candidate.render === "function"
  }
  return false
}

export default function DynamicIcon({ name, size = 24, className = "", color, fallback = null }: DynamicIconProps) {
  if (!name) return fallback

  const Icon = (Icons as Record<string, unknown>)[name]
  if (!isLikelyComponent(Icon)) return fallback

  const Cmp = Icon as ComponentType<{ size?: number; className?: string; color?: string; style?: CSSProperties }>
  if (color) {
    return <Cmp size={size} className={className} color={color} style={{ color }} />
  }
  return <Cmp size={size} className={className} />
}
