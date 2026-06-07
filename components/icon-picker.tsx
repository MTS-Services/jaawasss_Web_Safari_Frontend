"use client"

import { useState, useRef, useEffect } from "react"
import * as Icons from "lucide-react"
import { Button } from "@/components/ui/button"

// Common industry icons - unique list
const ICONS = [
  // General UI
  "Package", "Factory", "Layers", "Home", "Heart", "Star", "Settings", "Search",
  "Menu", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown",
  "ChevronRight", "ChevronLeft", "ChevronUp", "ChevronDown",
  "Plus", "Minus", "Check", "CheckCircle", "AlertCircle",
  "Info", "Eye", "EyeOff", "Lock", "Unlock", "Key", "Bell", "AlertTriangle",

  // Ecommerce & Shopping
  "ShoppingCart", "ShoppingBag", "Store", "Wallet", "CreditCard", "Banknote",
  "Receipt", "BadgePercent", "BadgeDollarSign", "CircleDollarSign", "DollarSign",
  "Gift", "GiftCard", "Ticket", "Tag", "Tags", "Barcode", "QrCode",
  "TrendingUp", "TrendingDown", "BarChart", "PieChart", "LineChart",
  "Award", "Trophy", "Medal", "Crown", "Gem", "Diamond",

  // Shipping & Logistics
  "Truck", "Package2", "PackageCheck", "PackageOpen", "PackagePlus",
  "Ship", "Plane", "Train", "Bike", "Car", "Forklift",
  "Warehouse", "Container", "Box", "Archive", "Boxes",

  // Categories
  "Laptop", "Smartphone", "Tablet", "Monitor", "Tv", "Watch", "Camera",
  "Headphones", "Speaker", "Gamepad", "Gamepad2", "Cpu", "HardDrive",
  "Server", "Database", "Router", "Wifi", "Bluetooth", "Printer",

  // Fashion & Apparel
  "Shirt", "Footprints", "Glasses", "Scissors", "Ruler",

  // Home & Living
  "Sofa", "Bed", "Bath", "Lamp", "Refrigerator", "WashingMachine",
  "Hammer", "Wrench", "Tool", "Drill", "PaintBucket", "Paintbrush",

  // Food & Grocery
  "Apple", "Beef", "Fish", "Carrot", "Cookie", "Coffee",
  "Wine", "Beer", "Milk", "Pizza", "Sandwich", "Salad",
  "ShoppingBasket", "UtensilsCrossed", "Utensils", "ChefHat",

  // Health & Beauty
  "HeartPulse", "Stethoscope", "Pill", "Syringe",
  "Dumbbell", "Activity", "Thermometer", "Droplet", "FlaskConical",
  "Microscope", "Baby", "PersonStanding",

  // Books & Education
  "Book", "BookOpen", "BookMarked", "BookCopy", "GraduationCap",
  "Library", "Newspaper", "FileText", "PenLine", "Pencil",

  // Sports & Outdoors
  "Mountain", "Tent", "Compass", "Map", "MapPin",
  "Target", "Swords", "Volleyball",

  // Automotive
  "CarFront", "Fuel", "Gauge", "Settings2",

  // Communication
  "Phone", "Mail", "MessageSquare", "MessageCircle", "Send",
  "Share", "Share2", "Copy", "Link", "ExternalLink",

  // Files & Documents  
  "File", "Folder", "FolderOpen", "Download", "Upload",
  "Trash2", "Edit", "Edit2", "Edit3",

  // Media
  "Play", "Pause", "SkipBack", "SkipForward", "FastForward",
  "Volume", "Volume2", "Mic", "MicOff", "Video",
  "Image", "Images", "Film",

  // Nature & Environment
  "Sun", "Moon", "Cloud", "CloudRain", "Wind", "Snowflake",
  "Leaf", "Trees", "Flower", "Flower2", "TreePine",
  "Globe", "Globe2", "Earth",

  // Misc
  "Briefcase", "Calendar", "Clock", "User", "Users", "UserPlus",
  "Navigation", "Anchor", "Flag", "Bookmark", "Sliders",
  "Power", "Battery", "Maximize", "Minimize", "RotateCcw",
  "Repeat", "Telescope", "Lightbulb", "Zap", "Flame",
]

interface IconPickerProps {
  selectedIcon?: string
  onSelect: (iconName: string) => void
}

export default function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const SelectedIcon = selectedIcon ? (Icons as Record<string, any>)[selectedIcon] : null

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon size={18} />
            <span className="text-sm">{selectedIcon}</span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Pick an icon...</span>
        )}
      </Button>

      {/* Icon Grid Dropdown (Absolute) */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full bg-card border border-border rounded-lg shadow-xl p-2">
          <div className="grid grid-cols-10 gap-x-6 gap-y-0.5 max-h-80 overflow-y-auto">
            {ICONS.map((name) => {
              const Icon = (Icons as Record<string, any>)[name]
              if (!Icon) return null

              return (
                <button
                  type="button"
                  key={name}
                  title={name}
                  onClick={() => {
                    onSelect(name)
                    setIsOpen(false)
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded transition-all ${
                    selectedIcon === name
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-background border border-transparent hover:border-input"
                  }`}
                >
                  <Icon size={22} strokeWidth={1.5} />
                  <span className="text-[9px] mt-0.5 text-center truncate w-full">{name}</span>
                </button>
              )
            })}
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center pt-2 border-t">
            {ICONS.length} icons available
          </div>
        </div>
      )}
    </div>
  )
}
