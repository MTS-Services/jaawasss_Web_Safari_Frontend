"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { industries as industriesData } from "@/lib/data/industries"
import { 
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Layers,
  Factory,
  Package,
  ChevronRight,
  ChevronDown,
  GripVertical,
  FolderOpen,
  Tag,
  ArrowLeft,
  X,
  Cpu,
  Cog,
  Shirt,
  Home,
  Heart,
  Car,
  UtensilsCrossed,
  FlaskConical,
  Lightbulb,
  Wrench,
  HardHat,
  Sofa,
  Stethoscope,
  Wheat,
  Box,
  FileText,
  ShoppingBag,
  Globe,
  Zap,
  Recycle,
  Droplet,
  Wind,
  Sun,
  Gem,
  Anchor,
  Plane,
  Train,
  Truck,
  Camera,
  Music,
  Gamepad2,
  Tv,
  Smartphone,
  Monitor,
  Printer,
  Scissors,
  Brush,
  Palette,
  Utensils,
  Coffee,
  Wine,
  Apple,
  Leaf,
  TreePine,
  Flower2,
  Bug,
  Fish,
  Bird,
  Dog,
  Cat,
  Baby,
  Dumbbell,
  Trophy,
  Tent,
  Mountain,
  Waves,
  Flame,
  Snowflake,
  CloudRain,
  Thermometer,
  Beaker,
  Atom,
  Microscope,
  Syringe,
  Pill,
  Bone,
  Brain,
  Eye as EyeIcon,
  Ear,
  Hand,
  Footprints,
  Shield,
  Lock,
  Key,
  Wifi,
  Bluetooth,
  Radio,
  Satellite,
  Server,
  Database,
  HardDrive,
  Usb,
  Battery,
  Power,
  Plug,
  Cable,
  CircuitBoard,
  Fingerprint,
  QrCode,
  Barcode,
  CreditCard,
  Wallet,
  Banknote,
  Coins,
  PiggyBank,
  Receipt,
  Calculator,
  Briefcase,
  Building,
  Building2,
  Store,
  Warehouse,
  LandPlot,
  Fence,
  DoorOpen,
  DoorClosed,
  SquareStack,
  Boxes,
  Container,
  Archive,
  FolderArchive,
  Bookmark,
  type LucideIcon
} from "lucide-react"

// Available icons for industry selection
const availableIcons: { name: string; icon: LucideIcon; label: string }[] = [
  // Electronics & Tech
  { name: "Cpu", icon: Cpu, label: "Electronics" },
  { name: "Smartphone", icon: Smartphone, label: "Smartphone" },
  { name: "Monitor", icon: Monitor, label: "Monitor" },
  { name: "Tv", icon: Tv, label: "TV" },
  { name: "Camera", icon: Camera, label: "Camera" },
  { name: "Printer", icon: Printer, label: "Printer" },
  { name: "Gamepad2", icon: Gamepad2, label: "Gaming" },
  { name: "CircuitBoard", icon: CircuitBoard, label: "Circuit" },
  
  // Industry & Manufacturing
  { name: "Factory", icon: Factory, label: "Factory" },
  { name: "Cog", icon: Cog, label: "Machinery" },
  { name: "Wrench", icon: Wrench, label: "Tools" },
  { name: "HardHat", icon: HardHat, label: "Construction" },
  { name: "Building", icon: Building, label: "Building" },
  { name: "Building2", icon: Building2, label: "Office" },
  { name: "Warehouse", icon: Warehouse, label: "Warehouse" },
  
  // Fashion & Apparel
  { name: "Shirt", icon: Shirt, label: "Apparel" },
  { name: "Scissors", icon: Scissors, label: "Tailoring" },
  { name: "Gem", icon: Gem, label: "Jewelry" },
  { name: "Footprints", icon: Footprints, label: "Footwear" },
  
  // Home & Living
  { name: "Home", icon: Home, label: "Home" },
  { name: "Sofa", icon: Sofa, label: "Furniture" },
  { name: "DoorOpen", icon: DoorOpen, label: "Doors" },
  { name: "Lightbulb", icon: Lightbulb, label: "Lighting" },
  
  // Health & Medical
  { name: "Heart", icon: Heart, label: "Health" },
  { name: "Stethoscope", icon: Stethoscope, label: "Medical" },
  { name: "Pill", icon: Pill, label: "Pharma" },
  { name: "Syringe", icon: Syringe, label: "Medical" },
  { name: "Microscope", icon: Microscope, label: "Lab" },
  { name: "Brain", icon: Brain, label: "Neuro" },
  
  // Food & Beverage
  { name: "UtensilsCrossed", icon: UtensilsCrossed, label: "Food" },
  { name: "Utensils", icon: Utensils, label: "Dining" },
  { name: "Coffee", icon: Coffee, label: "Beverages" },
  { name: "Wine", icon: Wine, label: "Wine" },
  { name: "Apple", icon: Apple, label: "Produce" },
  
  // Auto & Transport
  { name: "Car", icon: Car, label: "Auto" },
  { name: "Truck", icon: Truck, label: "Trucking" },
  { name: "Plane", icon: Plane, label: "Aviation" },
  { name: "Train", icon: Train, label: "Rail" },
  { name: "Anchor", icon: Anchor, label: "Marine" },
  
  // Chemicals & Materials
  { name: "FlaskConical", icon: FlaskConical, label: "Chemicals" },
  { name: "Beaker", icon: Beaker, label: "Lab" },
  { name: "Atom", icon: Atom, label: "Science" },
  { name: "Droplet", icon: Droplet, label: "Liquids" },
  
  // Packaging & Storage
  { name: "Package", icon: Package, label: "Packaging" },
  { name: "Box", icon: Box, label: "Box" },
  { name: "Boxes", icon: Boxes, label: "Boxes" },
  { name: "Container", icon: Container, label: "Container" },
  { name: "Archive", icon: Archive, label: "Archive" },
  
  // Agriculture & Nature
  { name: "Wheat", icon: Wheat, label: "Agriculture" },
  { name: "Leaf", icon: Leaf, label: "Organic" },
  { name: "TreePine", icon: TreePine, label: "Forestry" },
  { name: "Flower2", icon: Flower2, label: "Floriculture" },
  { name: "Fish", icon: Fish, label: "Fishery" },
  
  // Energy & Environment
  { name: "Zap", icon: Zap, label: "Energy" },
  { name: "Power", icon: Power, label: "Power" },
  { name: "Battery", icon: Battery, label: "Battery" },
  { name: "Sun", icon: Sun, label: "Solar" },
  { name: "Wind", icon: Wind, label: "Wind" },
  { name: "Recycle", icon: Recycle, label: "Recycling" },
  { name: "Flame", icon: Flame, label: "Gas/Oil" },
  
  // Technology & IT
  { name: "Server", icon: Server, label: "Server" },
  { name: "Database", icon: Database, label: "Database" },
  { name: "HardDrive", icon: HardDrive, label: "Storage" },
  { name: "Wifi", icon: Wifi, label: "Network" },
  { name: "Satellite", icon: Satellite, label: "Telecom" },
  
  // Security & Safety
  { name: "Shield", icon: Shield, label: "Security" },
  { name: "Lock", icon: Lock, label: "Safety" },
  { name: "Key", icon: Key, label: "Access" },
  { name: "Fingerprint", icon: Fingerprint, label: "Biometrics" },
  
  // Art & Design
  { name: "Palette", icon: Palette, label: "Art" },
  { name: "Brush", icon: Brush, label: "Design" },
  { name: "Music", icon: Music, label: "Audio" },
  
  // Finance & Commerce
  { name: "ShoppingBag", icon: ShoppingBag, label: "Retail" },
  { name: "Store", icon: Store, label: "Store" },
  { name: "CreditCard", icon: CreditCard, label: "Payment" },
  { name: "Briefcase", icon: Briefcase, label: "Business" },
  
  // Sports & Recreation
  { name: "Dumbbell", icon: Dumbbell, label: "Fitness" },
  { name: "Trophy", icon: Trophy, label: "Sports" },
  { name: "Tent", icon: Tent, label: "Outdoor" },
  { name: "Mountain", icon: Mountain, label: "Adventure" },
  
  // Baby & Pets
  { name: "Baby", icon: Baby, label: "Baby" },
  { name: "Dog", icon: Dog, label: "Pet" },
  
  // Misc
  { name: "FileText", icon: FileText, label: "Paper" },
  { name: "Globe", icon: Globe, label: "Global" },
  { name: "Layers", icon: Layers, label: "General" },
]

// Icon name to component mapping
const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  availableIcons.map(i => [i.name, i.icon])
)

// Types
interface Subcategory {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  slug: string
  subcategories: Subcategory[]
}

interface Industry {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  supplierCount: number
  productCount: number
  featured: boolean
  categories: Category[]
}

export default function AdminIndustriesPage() {
  // Transform data to include proper IDs
  const [industries, setIndustries] = useState<Industry[]>(
    industriesData.map(ind => ({
      ...ind,
      icon: ind.icon || "Package",
      featured: ind.featured || false,
      categories: ind.categories.map((cat, catIdx) => ({
        id: `${ind.id}-cat-${catIdx}`,
        name: cat.name,
        slug: cat.slug,
        subcategories: cat.subcategories.map((sub, subIdx) => ({
          id: `${ind.id}-cat-${catIdx}-sub-${subIdx}`,
          name: sub
        }))
      }))
    }))
  )
  
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedIndustries, setExpandedIndustries] = useState<Set<string>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  
  // Dialog states
  const [showAddIndustryDialog, setShowAddIndustryDialog] = useState(false)
  const [showEditIndustryDialog, setShowEditIndustryDialog] = useState(false)
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false)
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false)
  const [showAddSubcategoryDialog, setShowAddSubcategoryDialog] = useState(false)
  const [showEditSubcategoryDialog, setShowEditSubcategoryDialog] = useState(false)
  const [showManageCategoriesDialog, setShowManageCategoriesDialog] = useState(false)
  
  // Current selections
  const [currentIndustry, setCurrentIndustry] = useState<Industry | null>(null)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null)
  
  // Form states
  const [newIndustry, setNewIndustry] = useState({ name: "", description: "", icon: "Package", featured: false })
  const [newCategory, setNewCategory] = useState({ name: "" })
  const [newSubcategory, setNewSubcategory] = useState({ name: "" })
  const [iconSearchQuery, setIconSearchQuery] = useState("")

  // Filter industries
  const filteredIndustries = industries.filter(ind => 
    ind.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Toggle expand
  const toggleIndustry = (id: string) => {
    setExpandedIndustries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Industry CRUD
  const handleAddIndustry = () => {
    const id = `ind-${Date.now()}`
    const slug = newIndustry.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setIndustries(prev => [...prev, {
      id,
      name: newIndustry.name,
      slug,
      description: newIndustry.description,
      icon: newIndustry.icon,
      supplierCount: 0,
      productCount: 0,
      featured: newIndustry.featured,
      categories: []
    }])
    setNewIndustry({ name: "", description: "", icon: "Package", featured: false })
    setIconSearchQuery("")
    setShowAddIndustryDialog(false)
  }

  const handleEditIndustry = () => {
    if (!currentIndustry) return
    setIndustries(prev => prev.map(ind => 
      ind.id === currentIndustry.id ? currentIndustry : ind
    ))
    setShowEditIndustryDialog(false)
  }

  const deleteIndustry = (id: string) => {
    setIndustries(prev => prev.filter(ind => ind.id !== id))
  }

  const toggleFeatured = (id: string) => {
    setIndustries(prev => prev.map(ind => 
      ind.id === id ? { ...ind, featured: !ind.featured } : ind
    ))
  }

  // Category CRUD
  const openAddCategory = (industry: Industry) => {
    setCurrentIndustry(industry)
    setNewCategory({ name: "" })
    setShowAddCategoryDialog(true)
  }

  const handleAddCategory = () => {
    if (!currentIndustry) return
    const catId = `${currentIndustry.id}-cat-${Date.now()}`
    const slug = newCategory.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const newCat: Category = {
      id: catId,
      name: newCategory.name,
      slug,
      subcategories: []
    }
    setIndustries(prev => prev.map(ind => 
      ind.id === currentIndustry.id 
        ? { ...ind, categories: [...ind.categories, newCat] }
        : ind
    ))
    setNewCategory({ name: "" })
    setShowAddCategoryDialog(false)
  }

  const openEditCategory = (industry: Industry, category: Category) => {
    setCurrentIndustry(industry)
    setCurrentCategory({ ...category })
    setShowEditCategoryDialog(true)
  }

  const handleEditCategory = () => {
    if (!currentIndustry || !currentCategory) return
    setIndustries(prev => prev.map(ind => 
      ind.id === currentIndustry.id 
        ? { 
            ...ind, 
            categories: ind.categories.map(cat => 
              cat.id === currentCategory.id ? currentCategory : cat
            )
          }
        : ind
    ))
    setShowEditCategoryDialog(false)
  }

  const deleteCategory = (industryId: string, categoryId: string) => {
    setIndustries(prev => prev.map(ind => 
      ind.id === industryId 
        ? { ...ind, categories: ind.categories.filter(cat => cat.id !== categoryId) }
        : ind
    ))
  }

  const moveCategoryUp = (industryId: string, categoryId: string) => {
    setIndustries(prev => prev.map(ind => {
      if (ind.id !== industryId) return ind
      const idx = ind.categories.findIndex(c => c.id === categoryId)
      if (idx <= 0) return ind
      const newCats = [...ind.categories]
      const temp = newCats[idx]
      newCats[idx] = newCats[idx - 1]
      newCats[idx - 1] = temp
      return { ...ind, categories: newCats }
    }))
  }

  const moveCategoryDown = (industryId: string, categoryId: string) => {
    setIndustries(prev => prev.map(ind => {
      if (ind.id !== industryId) return ind
      const idx = ind.categories.findIndex(c => c.id === categoryId)
      if (idx < 0 || idx >= ind.categories.length - 1) return ind
      const newCats = [...ind.categories]
      const temp = newCats[idx]
      newCats[idx] = newCats[idx + 1]
      newCats[idx + 1] = temp
      return { ...ind, categories: newCats }
    }))
  }

  // Subcategory CRUD
  const openAddSubcategory = (industry: Industry, category: Category) => {
    setCurrentIndustry(industry)
    setCurrentCategory(category)
    setNewSubcategory({ name: "" })
    setShowAddSubcategoryDialog(true)
  }

  const handleAddSubcategory = () => {
    if (!currentIndustry || !currentCategory) return
    const subId = `${currentCategory.id}-sub-${Date.now()}`
    const newSub: Subcategory = {
      id: subId,
      name: newSubcategory.name
    }
    setIndustries(prev => prev.map(ind => 
      ind.id === currentIndustry.id 
        ? { 
            ...ind, 
            categories: ind.categories.map(cat => 
              cat.id === currentCategory.id 
                ? { ...cat, subcategories: [...cat.subcategories, newSub] }
                : cat
            )
          }
        : ind
    ))
    setNewSubcategory({ name: "" })
    setShowAddSubcategoryDialog(false)
  }

  const openEditSubcategory = (industry: Industry, category: Category, subcategory: Subcategory) => {
    setCurrentIndustry(industry)
    setCurrentCategory(category)
    setCurrentSubcategory({ ...subcategory })
    setShowEditSubcategoryDialog(true)
  }

  const handleEditSubcategory = () => {
    if (!currentIndustry || !currentCategory || !currentSubcategory) return
    setIndustries(prev => prev.map(ind => 
      ind.id === currentIndustry.id 
        ? { 
            ...ind, 
            categories: ind.categories.map(cat => 
              cat.id === currentCategory.id 
                ? { 
                    ...cat, 
                    subcategories: cat.subcategories.map(sub => 
                      sub.id === currentSubcategory.id ? currentSubcategory : sub
                    )
                  }
                : cat
            )
          }
        : ind
    ))
    setShowEditSubcategoryDialog(false)
  }

  const deleteSubcategory = (industryId: string, categoryId: string, subcategoryId: string) => {
    setIndustries(prev => prev.map(ind => 
      ind.id === industryId 
        ? { 
            ...ind, 
            categories: ind.categories.map(cat => 
              cat.id === categoryId 
                ? { ...cat, subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId) }
                : cat
            )
          }
        : ind
    ))
  }

  const moveSubcategoryUp = (industryId: string, categoryId: string, subcategoryId: string) => {
    setIndustries(prev => prev.map(ind => {
      if (ind.id !== industryId) return ind
      return {
        ...ind,
        categories: ind.categories.map(cat => {
          if (cat.id !== categoryId) return cat
          const idx = cat.subcategories.findIndex(s => s.id === subcategoryId)
          if (idx <= 0) return cat
          const newSubs = [...cat.subcategories]
          const temp = newSubs[idx]
          newSubs[idx] = newSubs[idx - 1]
          newSubs[idx - 1] = temp
          return { ...cat, subcategories: newSubs }
        })
      }
    }))
  }

  const moveSubcategoryDown = (industryId: string, categoryId: string, subcategoryId: string) => {
    setIndustries(prev => prev.map(ind => {
      if (ind.id !== industryId) return ind
      return {
        ...ind,
        categories: ind.categories.map(cat => {
          if (cat.id !== categoryId) return cat
          const idx = cat.subcategories.findIndex(s => s.id === subcategoryId)
          if (idx < 0 || idx >= cat.subcategories.length - 1) return cat
          const newSubs = [...cat.subcategories]
          const temp = newSubs[idx]
          newSubs[idx] = newSubs[idx + 1]
          newSubs[idx + 1] = temp
          return { ...cat, subcategories: newSubs }
        })
      }
    }))
  }

  // Open manage categories dialog
  const openManageCategories = (industry: Industry) => {
    setCurrentIndustry(industry)
    setShowManageCategoriesDialog(true)
  }

  // Stats
  const featuredCount = industries.filter(ind => ind.featured).length
  const totalCategories = industries.reduce((sum, ind) => sum + ind.categories.length, 0)
  const totalSubcategories = industries.reduce((sum, ind) => 
    sum + ind.categories.reduce((catSum, cat) => catSum + cat.subcategories.length, 0), 0
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Industries</h1>
          <p className="mt-1 text-muted-foreground">
            Manage industries, categories, and subcategories
          </p>
        </div>
        <Button onClick={() => setShowAddIndustryDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Industry
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Layers className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{industries.length}</p>
              <p className="text-sm text-muted-foreground">Industries</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <FolderOpen className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalCategories}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Tag className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalSubcategories}</p>
              <p className="text-sm text-muted-foreground">Subcategories</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Layers className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{featuredCount}</p>
              <p className="text-sm text-muted-foreground">Featured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search industries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Industries Tree */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Name</div>
            <div className="col-span-2">Categories</div>
            <div className="col-span-2">Suppliers</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {filteredIndustries.map((industry) => (
            <div key={industry.id}>
              {/* Industry Row */}
              <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="col-span-5 flex items-center gap-2">
                  <button 
                    onClick={() => toggleIndustry(industry.id)}
                    className="p-1 rounded hover:bg-muted"
                  >
                    {expandedIndustries.has(industry.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                    {(() => {
                      const IconComponent = iconMap[industry.icon] || Package
                      return <IconComponent className="h-4 w-4 text-secondary" />
                    })()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{industry.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{industry.description}</p>
                  </div>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {industry.categories.length} categories
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {industry.supplierCount.toLocaleString()} suppliers
                </div>
                <div className="col-span-2">
                  {industry.featured && (
                    <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
                  )}
                </div>
                <div className="col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openManageCategories(industry)}>
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Manage Categories
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openAddCategory(industry)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setCurrentIndustry(industry)
                        setShowEditIndustryDialog(true)
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Industry
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleFeatured(industry.id)}>
                        {industry.featured ? "Remove from Featured" : "Add to Featured"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteIndustry(industry.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Industry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Categories (Expanded) */}
              {expandedIndustries.has(industry.id) && industry.categories.length > 0 && (
                <div className="bg-muted/20">
                  {industry.categories.map((category, catIdx) => (
                    <div key={category.id}>
                      {/* Category Row */}
                      <div className="grid grid-cols-12 items-center px-4 py-2 pl-12 hover:bg-muted/30 transition-colors">
                        <div className="col-span-5 flex items-center gap-2">
                          <button 
                            onClick={() => toggleCategory(category.id)}
                            className="p-1 rounded hover:bg-muted"
                          >
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-100">
                            <FolderOpen className="h-3.5 w-3.5 text-blue-700" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{category.name}</span>
                        </div>
                        <div className="col-span-2 text-xs text-muted-foreground">
                          {category.subcategories.length} subcategories
                        </div>
                        <div className="col-span-2"></div>
                        <div className="col-span-2 flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => moveCategoryUp(industry.id, category.id)}
                            disabled={catIdx === 0}
                          >
                            <ChevronDown className="h-3 w-3 rotate-180" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => moveCategoryDown(industry.id, category.id)}
                            disabled={catIdx === industry.categories.length - 1}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openAddSubcategory(industry, category)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Subcategory
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditCategory(industry, category)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteCategory(industry.id, category.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Subcategories (Expanded) */}
                      {expandedCategories.has(category.id) && category.subcategories.length > 0 && (
                        <div className="bg-muted/10">
                          {category.subcategories.map((subcategory, subIdx) => (
                            <div 
                              key={subcategory.id}
                              className="grid grid-cols-12 items-center px-4 py-1.5 pl-20 hover:bg-muted/30 transition-colors"
                            >
                              <div className="col-span-5 flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-100">
                                  <Tag className="h-3 w-3 text-emerald-700" />
                                </div>
                                <span className="text-sm text-foreground">{subcategory.name}</span>
                              </div>
                              <div className="col-span-2"></div>
                              <div className="col-span-2"></div>
                              <div className="col-span-2 flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => moveSubcategoryUp(industry.id, category.id, subcategory.id)}
                                  disabled={subIdx === 0}
                                >
                                  <ChevronDown className="h-3 w-3 rotate-180" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => moveSubcategoryDown(industry.id, category.id, subcategory.id)}
                                  disabled={subIdx === category.subcategories.length - 1}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="col-span-1 flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditSubcategory(industry, category, subcategory)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Subcategory
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onClick={() => deleteSubcategory(industry.id, category.id, subcategory.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete Subcategory
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Category Button */}
                  <div className="px-4 py-2 pl-12">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground"
                      onClick={() => openAddCategory(industry)}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Add Category
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Empty state for categories */}
              {expandedIndustries.has(industry.id) && industry.categories.length === 0 && (
                <div className="bg-muted/20 px-4 py-4 pl-12">
                  <p className="text-sm text-muted-foreground mb-2">No categories yet</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openAddCategory(industry)}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add First Category
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Industry Dialog */}
      <Dialog open={showAddIndustryDialog} onOpenChange={setShowAddIndustryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Industry</DialogTitle>
            <DialogDescription>
              Create a new industry category for the platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Industry Name</Label>
              <Input 
                placeholder="e.g., Renewable Energy"
                value={newIndustry.name}
                onChange={(e) => setNewIndustry({ ...newIndustry, name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe what this industry covers..."
                value={newIndustry.description}
                onChange={(e) => setNewIndustry({ ...newIndustry, description: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Industry Icon</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                    {(() => {
                      const IconComponent = iconMap[newIndustry.icon] || Package
                      return <IconComponent className="h-5 w-5 text-secondary" />
                    })()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {availableIcons.find(i => i.name === newIndustry.icon)?.label || "Select Icon"}
                    </p>
                    <p className="text-xs text-muted-foreground">Selected icon for this industry</p>
                  </div>
                </div>
                <Input 
                  placeholder="Search icons..."
                  value={iconSearchQuery}
                  onChange={(e) => setIconSearchQuery(e.target.value)}
                  className="mb-2"
                />
                <ScrollArea className="h-[160px] rounded-lg border border-border p-2">
                  <div className="grid grid-cols-8 gap-1">
                    {availableIcons
                      .filter(i => 
                        iconSearchQuery === "" || 
                        i.label.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
                        i.name.toLowerCase().includes(iconSearchQuery.toLowerCase())
                      )
                      .map((iconItem) => {
                        const IconComp = iconItem.icon
                        return (
                          <button
                            key={iconItem.name}
                            type="button"
                            onClick={() => setNewIndustry({ ...newIndustry, icon: iconItem.name })}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                              newIndustry.icon === iconItem.name
                                ? "border-secondary bg-secondary/10 text-secondary"
                                : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                            title={iconItem.label}
                          >
                            <IconComp className="h-4 w-4" />
                          </button>
                        )
                      })}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Featured Industry</Label>
              <Switch 
                checked={newIndustry.featured}
                onCheckedChange={(checked) => setNewIndustry({ ...newIndustry, featured: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddIndustryDialog(false)
              setIconSearchQuery("")
            }}>Cancel</Button>
            <Button onClick={handleAddIndustry} disabled={!newIndustry.name}>Add Industry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Industry Dialog */}
      <Dialog open={showEditIndustryDialog} onOpenChange={(open) => {
        setShowEditIndustryDialog(open)
        if (!open) setIconSearchQuery("")
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Industry</DialogTitle>
            <DialogDescription>
              Update industry details
            </DialogDescription>
          </DialogHeader>
          {currentIndustry && (
            <div className="space-y-4">
              <div>
                <Label>Industry Name</Label>
                <Input 
                  value={currentIndustry.name}
                  onChange={(e) => setCurrentIndustry({ ...currentIndustry, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={currentIndustry.description}
                  onChange={(e) => setCurrentIndustry({ ...currentIndustry, description: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Industry Icon</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                      {(() => {
                        const IconComponent = iconMap[currentIndustry.icon] || Package
                        return <IconComponent className="h-5 w-5 text-secondary" />
                      })()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {availableIcons.find(i => i.name === currentIndustry.icon)?.label || currentIndustry.icon}
                      </p>
                      <p className="text-xs text-muted-foreground">Current icon for this industry</p>
                    </div>
                  </div>
                  <Input 
                    placeholder="Search icons..."
                    value={iconSearchQuery}
                    onChange={(e) => setIconSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                  <ScrollArea className="h-[160px] rounded-lg border border-border p-2">
                    <div className="grid grid-cols-8 gap-1">
                      {availableIcons
                        .filter(i => 
                          iconSearchQuery === "" || 
                          i.label.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
                          i.name.toLowerCase().includes(iconSearchQuery.toLowerCase())
                        )
                        .map((iconItem) => {
                          const IconComp = iconItem.icon
                          return (
                            <button
                              key={iconItem.name}
                              type="button"
                              onClick={() => setCurrentIndustry({ ...currentIndustry, icon: iconItem.name })}
                              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                                currentIndustry.icon === iconItem.name
                                  ? "border-secondary bg-secondary/10 text-secondary"
                                  : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                              title={iconItem.label}
                            >
                              <IconComp className="h-4 w-4" />
                            </button>
                          )
                        })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured Industry</Label>
                <Switch 
                  checked={currentIndustry.featured}
                  onCheckedChange={(checked) => setCurrentIndustry({ ...currentIndustry, featured: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditIndustryDialog(false)
              setIconSearchQuery("")
            }}>Cancel</Button>
            <Button onClick={handleEditIndustry}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Add a new category to {currentIndustry?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input 
                placeholder="e.g., Consumer Electronics"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ name: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCategoryDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCategory} disabled={!newCategory.name}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditCategoryDialog} onOpenChange={setShowEditCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="space-y-4">
              <div>
                <Label>Category Name</Label>
                <Input 
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditCategoryDialog(false)}>Cancel</Button>
            <Button onClick={handleEditCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={showAddSubcategoryDialog} onOpenChange={setShowAddSubcategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>
              Add a new subcategory to {currentCategory?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subcategory Name</Label>
              <Input 
                placeholder="e.g., Smartphones"
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({ name: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSubcategoryDialog(false)}>Cancel</Button>
            <Button onClick={handleAddSubcategory} disabled={!newSubcategory.name}>Add Subcategory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={showEditSubcategoryDialog} onOpenChange={setShowEditSubcategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>
              Update subcategory details
            </DialogDescription>
          </DialogHeader>
          {currentSubcategory && (
            <div className="space-y-4">
              <div>
                <Label>Subcategory Name</Label>
                <Input 
                  value={currentSubcategory.name}
                  onChange={(e) => setCurrentSubcategory({ ...currentSubcategory, name: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditSubcategoryDialog(false)}>Cancel</Button>
            <Button onClick={handleEditSubcategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Categories Dialog (Full View) */}
      <Dialog open={showManageCategoriesDialog} onOpenChange={setShowManageCategoriesDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Manage Categories: {currentIndustry?.name}
            </DialogTitle>
            <DialogDescription>
              Add, edit, reorder, and delete categories and subcategories
            </DialogDescription>
          </DialogHeader>
          
          {currentIndustry && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button size="sm" onClick={() => {
                  setShowManageCategoriesDialog(false)
                  openAddCategory(currentIndustry)
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
              
              <ScrollArea className="h-[400px] rounded-lg border border-border">
                {industries.find(i => i.id === currentIndustry.id)?.categories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-4">No categories yet</p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowManageCategoriesDialog(false)
                        openAddCategory(currentIndustry)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Category
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {industries.find(i => i.id === currentIndustry.id)?.categories.map((category, catIdx, catArr) => (
                      <div key={category.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                              <FolderOpen className="h-4 w-4 text-blue-700" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{category.name}</p>
                              <p className="text-xs text-muted-foreground">{category.subcategories.length} subcategories</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => moveCategoryUp(currentIndustry.id, category.id)}
                              disabled={catIdx === 0}
                            >
                              <ChevronDown className="h-4 w-4 rotate-180" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => moveCategoryDown(currentIndustry.id, category.id)}
                              disabled={catIdx === catArr.length - 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setShowManageCategoriesDialog(false)
                                openEditCategory(currentIndustry, category)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => deleteCategory(currentIndustry.id, category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Subcategories */}
                        <div className="mt-3 ml-11 space-y-2">
                          {category.subcategories.map((sub, subIdx, subArr) => (
                            <div 
                              key={sub.id}
                              className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                            >
                              <div className="flex items-center gap-2">
                                <Tag className="h-3 w-3 text-emerald-600" />
                                <span className="text-sm">{sub.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => moveSubcategoryUp(currentIndustry.id, category.id, sub.id)}
                                  disabled={subIdx === 0}
                                >
                                  <ChevronDown className="h-3 w-3 rotate-180" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => moveSubcategoryDown(currentIndustry.id, category.id, sub.id)}
                                  disabled={subIdx === subArr.length - 1}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    setShowManageCategoriesDialog(false)
                                    openEditSubcategory(currentIndustry, category, sub)
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive"
                                  onClick={() => deleteSubcategory(currentIndustry.id, category.id, sub.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-muted-foreground"
                            onClick={() => {
                              setShowManageCategoriesDialog(false)
                              openAddSubcategory(currentIndustry, category)
                            }}
                          >
                            <Plus className="mr-2 h-3 w-3" />
                            Add Subcategory
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowManageCategoriesDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
