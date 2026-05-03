"use client"

import { useEffect, useState } from "react"
import Swal from "sweetalert2"
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
import IconPicker from "@/components/icon-picker"
import DynamicIcon from "@/components/dynamic-icon"
import {
  createAdminCategory,
  createAdminSubcategory,
  deleteAdminCategory,
  deleteAdminSubcategory,
  getAdminCategories,
  getAdminSubcategories,
  moveAdminSubcategoryPosition,
  toggleAdminCategoryFeatured,
  updateAdminCategory,
  updateAdminSubcategory,
  type BackendCategory,
  type BackendSubcategory,
} from "@/lib/api/categories"
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
  X
} from "lucide-react"

// Types
interface Subcategory {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  tags?: string
  subcategories: Subcategory[]
}

interface Industry {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  icon_color?: string
  color?: string
  title_color?: string
  description_color?: string
  btn_color?: string
  supplier_count_color?: string
  supplierCount: number
  productCount: number
  featured: boolean
  categories: Category[]
}

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
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
  const [newIndustry, setNewIndustry] = useState<{
    name: string;
    description: string;
    featured: boolean;
    slug: string;
    color: string;
    title_color: string;
    description_color: string;
    btn_color: string;
    supplier_count_color: string;
    icon: string;
    icon_color: string;
  }>({
    name: "", 
    description: "", 
    featured: false,
    slug: "",
    color: "#ffffff",
    title_color: "#000000",
    description_color: "#64748b",
    btn_color: "#3b82f6",
    supplier_count_color: "#64748b",
    icon: "",
    icon_color: "#000000",
  })
  const [newCategory, setNewCategory] = useState({ name: "", description: "", tags: "" })
  const [newSubcategory, setNewSubcategory] = useState({ name: "" })

  const slugify = (value: string) => value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

  const mapServerData = (categories: BackendCategory[], subcategories: BackendSubcategory[]): Industry[] => {
    const groupedSubcategories = new Map<string, BackendSubcategory[]>()

    for (const sub of subcategories) {
      const parentId = sub.industry_id ?? sub.category_id
      if (parentId === undefined || parentId === null) continue
      const key = String(parentId)
      if (!groupedSubcategories.has(key)) {
        groupedSubcategories.set(key, [])
      }
      groupedSubcategories.get(key)?.push(sub)
    }

    return categories.map((category) => {
      const categoryId = String(category.id)
      const nested = category.sub_categories?.length
        ? category.sub_categories
        : category.subcategories?.length
          ? category.subcategories
          : groupedSubcategories.get(categoryId) || []

      return {
        id: categoryId,
        name: category.name || "Unnamed Industry",
        slug: category.slug || slugify(category.name || ""),
        description: category.description || "",
        icon: category.icon,
        icon_color: category.icon_color,
        color: category.color,
        title_color: category.title_color,
        description_color: category.description_color,
        btn_color: category.btn_color,
        supplier_count_color: category.supplier_count_color,
        supplierCount: category.supplier_count || 0,
        productCount: category.product_count || 0,
        featured: Boolean(category.featured),
        categories: nested.map((sub) => ({
          id: String(sub.id),
          name: sub.name,
          slug: sub.slug || slugify(sub.name),
          subcategories: [],
        })),
      }
    })
  }

  const loadFromBackend = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    const [categoriesResult, subcategoriesResult] = await Promise.all([
      getAdminCategories({ perPage: 50 }),
      getAdminSubcategories(),
    ])

    if (!categoriesResult.success) {
      setIndustries([])
      setErrorMessage(categoriesResult.message || "Failed to load categories.")
      setIsLoading(false)
      return
    }

    const mapped = mapServerData(
      categoriesResult.data,
      subcategoriesResult.success ? subcategoriesResult.data : []
    )
    setIndustries(mapped)

    if (!subcategoriesResult.success) {
      setErrorMessage(subcategoriesResult.message || "Subcategories failed to load.")
    }

    setIsLoading(false)
  }

  useEffect(() => {
    void loadFromBackend()
  }, [])

  // Filter industries
  const filteredIndustries = industries.filter(ind => 
    (ind.name || "").toLowerCase().includes((searchQuery || "").toLowerCase())
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
    void (async () => {
      const result = await createAdminCategory({
        name: newIndustry.name,
        slug: newIndustry.slug || slugify(newIndustry.name),
        description: newIndustry.description,
        featured: newIndustry.featured,
        color: newIndustry.color,
        title_color: newIndustry.title_color,
        description_color: newIndustry.description_color,
        btn_color: newIndustry.btn_color,
        supplier_count_color: newIndustry.supplier_count_color,
        icon: newIndustry.icon || undefined,
        icon_color: newIndustry.icon_color,
      })

      if (!result.success) {
        setErrorMessage(result.message || "Failed to create category.")
        return
      }

      setNewIndustry({ 
        name: "", 
        description: "", 
        featured: false, 
        slug: "", 
        color: "#ffffff", 
        title_color: "#000000",
        description_color: "#64748b",
        btn_color: "#3b82f6",
        supplier_count_color: "#64748b",
        icon: "",
        icon_color: "#000000",
      })
      setShowAddIndustryDialog(false)
      await loadFromBackend()
    })()
  }

  const handleEditIndustry = () => {
    if (!currentIndustry) return
    void (async () => {
      const result = await updateAdminCategory(String(currentIndustry.id), {
        name: currentIndustry.name,
        slug: currentIndustry.slug || slugify(currentIndustry.name),
        description: currentIndustry.description,
        featured: currentIndustry.featured,
        color: currentIndustry.color,
        title_color: currentIndustry.title_color,
        description_color: currentIndustry.description_color,
        btn_color: currentIndustry.btn_color,
        supplier_count_color: currentIndustry.supplier_count_color,
        icon: currentIndustry.icon || undefined,
        icon_color: currentIndustry.icon_color,
      })

      if (!result.success) {
        setErrorMessage(result.message || "Failed to update category.")
        return
      }

      setShowEditIndustryDialog(false)
      await loadFromBackend()
    })()
  }

  const deleteIndustry = (id: string) => {
    void (async () => {
      const result = await deleteAdminCategory(String(id))
      if (!result.success) {
        setErrorMessage(result.message || "Failed to delete category.")
        return
      }
      await loadFromBackend()
    })()
  }

  const toggleFeatured = (id: string) => {
    void (async () => {
      const result = await toggleAdminCategoryFeatured(String(id))
      if (!result.success) {
        await Swal.fire({
          title: "Error",
          text: result.message || "Failed to toggle main category state.",
          icon: "error",
          confirmButtonText: "OK",
        })
        return
      }
      await loadFromBackend()
    })()
  }

  // Category CRUD
  const openAddCategory = (industry: Industry) => {
    setCurrentIndustry(industry)
    setNewCategory({ name: "", description: "", tags: "" })
    setShowAddCategoryDialog(true)
  }

  const handleAddCategory = () => {
    if (!currentIndustry) return
    void (async () => {
      const slug = slugify(newCategory.name)
      const result = await createAdminSubcategory({
        name: newCategory.name,
        slug,
        description: newCategory.description || undefined,
        tags: newCategory.tags || undefined,
        industry_id: String(currentIndustry.id),
      })

      if (!result.success) {
        setErrorMessage(result.message || "Failed to create subcategory.")
        return
      }

      setNewCategory({ name: "", description: "", tags: "" })
      setShowAddCategoryDialog(false)
      await loadFromBackend()
    })()
  }

  const openEditCategory = (industry: Industry, category: Category) => {
    setCurrentIndustry(industry)
    setCurrentCategory({ ...category })
    setShowEditCategoryDialog(true)
  }

  const handleEditCategory = () => {
    if (!currentIndustry || !currentCategory) return
    void (async () => {
      const result = await updateAdminSubcategory(String(currentCategory.id), {
        name: currentCategory.name,
        slug: currentCategory.slug || slugify(currentCategory.name),
        description: currentCategory.description || undefined,
        tags: currentCategory.tags || undefined,
        industry_id: String(currentIndustry.id),
      })

      if (!result.success) {
        setErrorMessage(result.message || "Failed to update subcategory.")
        return
      }

      setShowEditCategoryDialog(false)
      await loadFromBackend()
    })()
  }

  const deleteCategory = (industryId: string, categoryId: string) => {
    void (async () => {
      const result = await deleteAdminSubcategory(String(categoryId))
      if (!result.success) {
        setErrorMessage(result.message || "Failed to delete subcategory.")
        return
      }
      await loadFromBackend()
    })()
  }

  const moveCategoryUp = (industryId: string, categoryId: string) => {
    void (async () => {
      const parent = industries.find((ind) => ind.id === industryId)
      if (!parent) return
      const idx = parent.categories.findIndex((c) => c.id === categoryId)
      if (idx <= 0) return

      const result = await moveAdminSubcategoryPosition(String(categoryId), idx, idx - 1)
      if (!result.success) {
        setErrorMessage(result.message || "Failed to move subcategory.")
        return
      }

      await loadFromBackend()
    })()
  }

  const moveCategoryDown = (industryId: string, categoryId: string) => {
    void (async () => {
      const parent = industries.find((ind) => ind.id === industryId)
      if (!parent) return
      const idx = parent.categories.findIndex((c) => c.id === categoryId)
      if (idx < 0 || idx >= parent.categories.length - 1) return

      const result = await moveAdminSubcategoryPosition(String(categoryId), idx, idx + 1)
      if (!result.success) {
        setErrorMessage(result.message || "Failed to move subcategory.")
        return
      }

      await loadFromBackend()
    })()
  }

  // Subcategory CRUD
  const openAddSubcategory = (industry: Industry, category: Category) => {
    setCurrentIndustry(industry)
    setCurrentCategory(category)
    setErrorMessage("Nested subcategories are not supported by current backend endpoints.")
  }

  const handleAddSubcategory = () => {
    setShowAddSubcategoryDialog(false)
    setErrorMessage("Nested subcategories are not supported by current backend endpoints.")
  }

  const openEditSubcategory = (industry: Industry, category: Category, subcategory: Subcategory) => {
    setCurrentIndustry(industry)
    setCurrentCategory(category)
    setCurrentSubcategory({ ...subcategory })
    setErrorMessage("Nested subcategories are not supported by current backend endpoints.")
  }

  const handleEditSubcategory = () => {
    setShowEditSubcategoryDialog(false)
    setErrorMessage("Nested subcategories are not supported by current backend endpoints.")
  }

  const deleteSubcategory = (industryId: string, categoryId: string, subcategoryId: string) => {
    setErrorMessage("Nested subcategories are not supported by current backend endpoints.")
  }

  const moveSubcategoryUp = (industryId: string, categoryId: string, subcategoryId: string) => {
    setErrorMessage("Nested subcategories are not supported by current backend endpoints.")
  }

  const moveSubcategoryDown = (industryId: string, categoryId: string, subcategoryId: string) => {
    setErrorMessage("Nested subcategories are not supported by current backend endpoints.")
  }

  // Open manage categories dialog
  const openManageCategories = (industry: Industry) => {
    setCurrentIndustry(industry)
    setShowManageCategoriesDialog(true)
  }

  // Stats
  const featuredCount = industries.filter(ind => ind.featured).length
  const totalCategories = industries.length
  const totalSubcategories = industries.reduce((sum, ind) => sum + ind.categories.length, 0)
  const hasCorrectMainCategoryCount = featuredCount === 8

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Industries & Categories</h1>
          <p className="mt-1 text-muted-foreground">
            This page controls main categories, categories, and subcategories.
          </p>
        </div>
        <Button onClick={() => setShowAddIndustryDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Industry
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Homepage and category pages should use exactly 8 main categories.
        </p>
        <Badge className={hasCorrectMainCategoryCount ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
          Main Categories: {featuredCount}/8
        </Badge>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Loading categories from backend...
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Layers className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{industries.length}</p>
              <p className="text-sm text-muted-foreground">Main Categories</p>
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
              <p className="text-sm text-muted-foreground">Category Records</p>
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
              <p className="text-sm text-muted-foreground">Main Categories</p>
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
            <div className="col-span-2">Homepage</div>
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted overflow-hidden" style={{ backgroundColor: industry.color || undefined }}>
                    {industry.icon ? (
                      <DynamicIcon name={industry.icon} size={20} />
                    ) : (
                      <Layers className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{industry.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{industry.description || "No description"}</p>
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
                    <Badge className="bg-amber-100 text-amber-700">Main Category</Badge>
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
                        {industry.featured ? "Remove from Main Categories" : "Add to Main Categories"}
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
                              <DropdownMenuItem onClick={() => openEditCategory(industry, category)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Subcategory
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteCategory(industry.id, category.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Subcategory
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
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Add New Industry</DialogTitle>
            <DialogDescription>
              Create a new industry category for the platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-6 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Industry Name</Label>
                  <Input 
                    placeholder="e.g., Mining"
                    value={newIndustry.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setNewIndustry({ 
                        ...newIndustry, 
                        name, 
                        slug: slugify(name) 
                      })
                    }}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input 
                    placeholder="e.g., mining"
                    value={newIndustry.slug}
                    onChange={(e) => setNewIndustry({ ...newIndustry, slug: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Theme Color (Background)</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input 
                      type="color"
                      value={newIndustry.color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, color: e.target.value })}
                      className="h-10 w-12 p-1 cursor-pointer"
                    />
                    <Input 
                      value={newIndustry.color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Icon</Label>
                  <IconPicker
                    selectedIcon={newIndustry.icon}
                    onSelect={(name) => setNewIndustry({ ...newIndustry, icon: name })}
                  />
                </div>
                <div>
                  <Label>Icon Color</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input 
                      type="color"
                      value={newIndustry.icon_color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, icon_color: e.target.value })}
                      className="h-10 w-12 p-1 cursor-pointer"
                    />
                    <Input 
                      value={newIndustry.icon_color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, icon_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Icon URL</Label>
                  <Input 
                    placeholder="e.g., https://example.com/icon.png"
                    value={newIndustry.icon}
                    onChange={(e) => setNewIndustry({ ...newIndustry, icon: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs">Title Color</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input 
                      type="color"
                      value={newIndustry.title_color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, title_color: e.target.value })}
                      className="h-8 w-8 p-0 border-none cursor-pointer rounded-full overflow-hidden"
                    />
                    <Input 
                      value={newIndustry.title_color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, title_color: e.target.value })}
                      className="h-8 text-xs px-2"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Desc. Color</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input 
                      type="color"
                      value={newIndustry.description_color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, description_color: e.target.value })}
                      className="h-8 w-8 p-0 border-none cursor-pointer rounded-full overflow-hidden"
                    />
                    <Input 
                      value={newIndustry.description_color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, description_color: e.target.value })}
                      className="h-8 text-xs px-2"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Btn Color</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input 
                      type="color"
                      value={newIndustry.btn_color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, btn_color: e.target.value })}
                      className="h-8 w-8 p-0 border-none cursor-pointer rounded-full overflow-hidden"
                    />
                    <Input 
                      value={newIndustry.btn_color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, btn_color: e.target.value })}
                      className="h-8 text-xs px-2"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Supplier Color</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input 
                      type="color"
                      value={newIndustry.supplier_count_color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, supplier_count_color: e.target.value })}
                      className="h-8 w-8 p-0 border-none cursor-pointer rounded-full overflow-hidden"
                    />
                    <Input 
                      value={newIndustry.supplier_count_color}
                      onChange={(e) => setNewIndustry({ ...newIndustry, supplier_count_color: e.target.value })}
                      className="h-8 text-xs px-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe what this industry covers..."
                  value={newIndustry.description}
                  onChange={(e) => setNewIndustry({ ...newIndustry, description: e.target.value })}
                  className="mt-2 h-20"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label className="text-base">Featured</Label>
                  <p className="text-xs text-muted-foreground">Show this industry on the homepage</p>
                </div>
                <Switch 
                  checked={newIndustry.featured}
                  onCheckedChange={(checked) => setNewIndustry({ ...newIndustry, featured: checked })}
                />
              </div>

              {/* Preview Section */}
              <div className="rounded-xl bg-muted/30 p-4 border border-border">
                <Label className="mb-3 block text-xs uppercase tracking-wider text-muted-foreground font-semibold">Card Preview</Label>
                <div className="flex justify-center">
                  <div 
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 w-full max-w-[320px]"
                    style={{ backgroundColor: newIndustry.color }}
                  >
                    <div className="relative p-6">
                      {/* Icon */}
                      <div 
                        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-md"
                      >
                        {newIndustry.icon ? (
                          <DynamicIcon name={newIndustry.icon} size={32} color={newIndustry.icon_color} />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Industry Name */}
                      <h3 
                        className="mt-5 text-xl font-semibold transition-colors truncate"
                        style={{ color: newIndustry.title_color }}
                      >
                        {newIndustry.name || "Industry Name"}
                      </h3>

                      {/* Description */}
                      <p 
                        className="mt-2 text-sm line-clamp-2"
                        style={{ color: newIndustry.description_color }}
                      >
                        {newIndustry.description || "Explore suppliers and products in this industry sector."}
                      </p>

                      {/* Stats */}
                      <div className="mt-5 flex items-center gap-4 text-sm" style={{ color: newIndustry.supplier_count_color }}>
                        <div className="flex items-center gap-1">
                          <Factory className="h-4 w-4" />
                          <span className="font-semibold">0</span>
                          <span>suppliers</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div 
                        className="mt-5 flex items-center text-sm font-medium"
                        style={{ color: newIndustry.btn_color }}
                      >
                        <span>Explore</span>
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-2 border-t border-border bg-muted/10">
            <Button variant="outline" onClick={() => setShowAddIndustryDialog(false)}>Cancel</Button>
            <Button onClick={handleAddIndustry} disabled={!newIndustry.name}>Add Industry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Industry Dialog */}
      <Dialog open={showEditIndustryDialog} onOpenChange={setShowEditIndustryDialog}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Edit Industry</DialogTitle>
            <DialogDescription>
              Update industry details
            </DialogDescription>
          </DialogHeader>
          
          {currentIndustry && (
            <div className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Industry Name</Label>
                    <Input 
                      value={currentIndustry.name}
                      onChange={(e) => setCurrentIndustry({ ...currentIndustry, name: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input 
                      value={currentIndustry.slug}
                      onChange={(e) => setCurrentIndustry({ ...currentIndustry, slug: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Theme Color (Background)</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input 
                        type="color"
                        value={currentIndustry.color || "#ffffff"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, color: e.target.value })}
                        className="h-10 w-12 p-1 cursor-pointer"
                      />
                      <Input 
                        value={currentIndustry.color || "#ffffff"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <IconPicker
                      selectedIcon={currentIndustry.icon}
                      onSelect={(name) => setCurrentIndustry({ ...currentIndustry, icon: name })}
                    />
                  </div>
                  <div>
                    <Label>Icon Color</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input 
                        type="color"
                        value={currentIndustry.icon_color || "#000000"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, icon_color: e.target.value })}
                        className="h-10 w-12 p-1 cursor-pointer"
                      />
                      <Input 
                        value={currentIndustry.icon_color || "#000000"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, icon_color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Icon URL</Label>
                    <Input 
                      placeholder="e.g., https://example.com/icon.png"
                      value={currentIndustry.icon || ""}
                      onChange={(e) => setCurrentIndustry({ ...currentIndustry, icon: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs">Title Color</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input 
                        type="color"
                        value={currentIndustry.title_color || "#000000"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, title_color: e.target.value })}
                        className="h-8 w-8 p-0 border-none cursor-pointer rounded-full overflow-hidden"
                      />
                      <Input 
                        value={currentIndustry.title_color || "#000000"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, title_color: e.target.value })}
                        className="h-8 text-xs px-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Desc. Color</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input 
                        type="color"
                        value={currentIndustry.description_color || "#64748b"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, description_color: e.target.value })}
                        className="h-8 w-8 p-0 border-none cursor-pointer rounded-full overflow-hidden"
                      />
                      <Input 
                        value={currentIndustry.description_color || "#64748b"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, description_color: e.target.value })}
                        className="h-8 text-xs px-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Btn Color</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input 
                        type="color"
                        value={currentIndustry.btn_color || "#3b82f6"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, btn_color: e.target.value })}
                        className="h-8 w-8 p-0 border-none cursor-pointer rounded-full overflow-hidden"
                      />
                      <Input 
                        value={currentIndustry.btn_color || "#3b82f6"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, btn_color: e.target.value })}
                        className="h-8 text-xs px-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Supplier Color</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input 
                        type="color"
                        value={currentIndustry.supplier_count_color || "#64748b"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, supplier_count_color: e.target.value })}
                        className="h-8 w-8 p-0 border-none cursor-pointer rounded-full overflow-hidden"
                      />
                      <Input 
                        value={currentIndustry.supplier_count_color || "#64748b"}
                        onChange={(e) => setCurrentIndustry({ ...currentIndustry, supplier_count_color: e.target.value })}
                        className="h-8 text-xs px-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={currentIndustry.description}
                    onChange={(e) => setCurrentIndustry({ ...currentIndustry, description: e.target.value })}
                    className="mt-2 h-20"
                  />
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <Label className="text-base">Featured</Label>
                    <p className="text-xs text-muted-foreground">Show this industry on the homepage</p>
                  </div>
                  <Switch 
                    checked={currentIndustry.featured}
                    onCheckedChange={(checked) => setCurrentIndustry({ ...currentIndustry, featured: checked })}
                  />
                </div>

                {/* Preview Section */}
                <div className="rounded-xl bg-muted/30 p-4 border border-border">
                  <Label className="mb-3 block text-xs uppercase tracking-wider text-muted-foreground font-semibold">Card Preview</Label>
                  <div className="flex justify-center">
                    <div 
                      className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 w-full max-w-[320px]"
                      style={{ backgroundColor: currentIndustry.color || "#ffffff" }}
                    >
                      <div className="relative p-6">
                        {/* Icon */}
                        <div 
                          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-md"
                        >
                          {currentIndustry.icon ? (
                            <DynamicIcon name={currentIndustry.icon} size={32} color={currentIndustry.icon_color} />
                          ) : (
                            <Package className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>

                        {/* Industry Name */}
                        <h3 
                          className="mt-5 text-xl font-semibold transition-colors truncate"
                          style={{ color: currentIndustry.title_color || "#000000" }}
                        >
                          {currentIndustry.name}
                        </h3>

                        {/* Description */}
                        <p 
                          className="mt-2 text-sm line-clamp-2"
                          style={{ color: currentIndustry.description_color || "#64748b" }}
                        >
                          {currentIndustry.description || "Explore suppliers and products in this industry sector."}
                        </p>

                        {/* Stats */}
                        <div className="mt-5 flex items-center gap-4 text-sm" style={{ color: currentIndustry.supplier_count_color || "#64748b" }}>
                          <div className="flex items-center gap-1">
                            <Factory className="h-4 w-4" />
                            <span className="font-semibold">{currentIndustry.supplierCount.toLocaleString()}</span>
                            <span>suppliers</span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div 
                          className="mt-5 flex items-center text-sm font-medium"
                          style={{ color: currentIndustry.btn_color || "#3b82f6" }}
                        >
                          <span>Explore</span>
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="p-6 pt-2 border-t border-border bg-muted/10">
            <Button variant="outline" onClick={() => setShowEditIndustryDialog(false)}>Cancel</Button>
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
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe this category..."
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="mt-2 h-20"
              />
            </div>
            <div>
              <Label>Tags</Label>
              <Input 
                placeholder="e.g., electronics,gadgets,tech"
                value={newCategory.tags}
                onChange={(e) => setNewCategory({ ...newCategory, tags: e.target.value })}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
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
              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe this category..."
                  value={currentCategory.description || ""}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                  className="mt-2 h-20"
                />
              </div>
              <div>
                <Label>Tags</Label>
                <Input 
                  placeholder="e.g., electronics,gadgets,tech"
                  value={currentCategory.tags || ""}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, tags: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
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
              
              <ScrollArea className="h-100 rounded-lg border border-border">
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
