"use client"

import * as Icons from "lucide-react"

interface DynamicIconProps {
  name?: string | null
  size?: number
  className?: string
  color?: string
}

export default function DynamicIcon({ name, size = 24, className = "", color }: DynamicIconProps) {
  if (!name) return null
  
  const Icon = (Icons as Record<string, any>)[name]
  if (!Icon) return null
  
  return <Icon size={size} className={className} color={color} style={color ? { color } : undefined} />
}
