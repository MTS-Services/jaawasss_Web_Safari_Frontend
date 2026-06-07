"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Switch } from "@/components/ui/switch"
import {
  createAdminQuickFilterOption,
  deleteAdminQuickFilterOption,
  getAdminQuickFilterCounts,
  getAdminQuickFilterOptions,
  getAdminQuickFilterTypes,
  sortAdminQuickFilterOption,
  toggleAdminQuickFilterOption,
  type AdminQuickFilterCounts,
  type AdminQuickFilterOption,
  type AdminQuickFilterType,
  updateAdminQuickFilterOption,
} from "@/lib/api/admin-quick-filters"
import Swal from "sweetalert2"
import { 
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  GripVertical,
  Globe,
  Award,
  Package,
  MapPin,
  Filter,
  ArrowUp,
  ArrowDown
} from "lucide-react"

interface FilterItem {
  id: string
  value: string
  label: string
  enabled: boolean
  order: number
}

interface FilterCategory {
  id: string
  name: string
  slug: string
  icon: React.ElementType
  description: string
  items: FilterItem[]
}

const categoryIconByType: Record<string, React.ElementType> = {
  countries: Globe,
  certifications: Award,
  moq_ranges: Package,
  export_markets: MapPin,
}

const categoryDescriptionByType: Record<string, string> = {
  countries: "Filter suppliers by manufacturing country",
  certifications: "Filter by quality and compliance certifications",
  moq_ranges: "Minimum Order Quantity ranges",
  export_markets: "Filter by export destination regions",
}

// Initial filter data
const initialFilters: FilterCategory[] = [
  {
    id: "countries",
    name: "Countries",
    slug: "countries",
    icon: Globe,
    description: "Filter suppliers by manufacturing country",
    items: [
      { id: "cn", value: "china", label: "China", enabled: true, order: 1 },
      { id: "in", value: "india", label: "India", enabled: true, order: 2 },
      { id: "vn", value: "vietnam", label: "Vietnam", enabled: true, order: 3 },
      { id: "tr", value: "turkey", label: "Turkey", enabled: true, order: 4 },
      { id: "de", value: "germany", label: "Germany", enabled: true, order: 5 },
      { id: "us", value: "usa", label: "United States", enabled: true, order: 6 },
      { id: "mx", value: "mexico", label: "Mexico", enabled: true, order: 7 },
      { id: "th", value: "thailand", label: "Thailand", enabled: true, order: 8 },
      { id: "id", value: "indonesia", label: "Indonesia", enabled: true, order: 9 },
      { id: "bd", value: "bangladesh", label: "Bangladesh", enabled: true, order: 10 },
    ]
  },
  {
    id: "certifications",
    name: "Certifications",
    slug: "certifications",
    icon: Award,
    description: "Filter by quality and compliance certifications",
    items: [
      { id: "iso9001", value: "iso-9001", label: "ISO 9001", enabled: true, order: 1 },
      { id: "iso14001", value: "iso-14001", label: "ISO 14001", enabled: true, order: 2 },
      { id: "ce", value: "ce-mark", label: "CE Mark", enabled: true, order: 3 },
      { id: "fda", value: "fda", label: "FDA Approved", enabled: true, order: 4 },
      { id: "rohs", value: "rohs", label: "RoHS", enabled: true, order: 5 },
      { id: "ul", value: "ul", label: "UL Listed", enabled: true, order: 6 },
      { id: "reach", value: "reach", label: "REACH", enabled: true, order: 7 },
      { id: "gmp", value: "gmp", label: "GMP", enabled: true, order: 8 },
      { id: "bsci", value: "bsci", label: "BSCI", enabled: true, order: 9 },
      { id: "sedex", value: "sedex", label: "SEDEX", enabled: true, order: 10 },
    ]
  },
  {
    id: "moq_ranges",
    name: "MOQ Ranges",
    slug: "moq_ranges",
    icon: Package,
    description: "Minimum Order Quantity ranges",
    items: [
      { id: "moq1", value: "1-100", label: "1-100 units", enabled: true, order: 1 },
      { id: "moq2", value: "100-500", label: "100-500 units", enabled: true, order: 2 },
      { id: "moq3", value: "500-1000", label: "500-1,000 units", enabled: true, order: 3 },
      { id: "moq4", value: "1000-5000", label: "1,000-5,000 units", enabled: true, order: 4 },
      { id: "moq5", value: "5000+", label: "5,000+ units", enabled: true, order: 5 },
    ]
  },
  {
    id: "export_markets",
    name: "Export Markets",
    slug: "export_markets",
    icon: MapPin,
    description: "Filter by export destination regions",
    items: [
      { id: "na", value: "north-america", label: "North America", enabled: true, order: 1 },
      { id: "eu", value: "europe", label: "Europe", enabled: true, order: 2 },
      { id: "asia", value: "asia", label: "Asia Pacific", enabled: true, order: 3 },
      { id: "me", value: "middle-east", label: "Middle East", enabled: true, order: 4 },
      { id: "sa", value: "south-america", label: "South America", enabled: true, order: 5 },
      { id: "af", value: "africa", label: "Africa", enabled: true, order: 6 },
      { id: "au", value: "australia", label: "Australia & Oceania", enabled: true, order: 7 },
    ]
  }
]

export default function AdminFiltersPage() {
  const [filters, setFilters] = useState<FilterCategory[]>(initialFilters)
  const [activeTab, setActiveTab] = useState("countries")
  const [counts, setCounts] = useState<AdminQuickFilterCounts | null>(null)
  const [types, setTypes] = useState<AdminQuickFilterType[]>([])
  const [isOptionsLoading, setIsOptionsLoading] = useState(false)
  const [isMutatingOptions, setIsMutatingOptions] = useState(false)
  const [optionsError, setOptionsError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentItem, setCurrentItem] = useState<FilterItem | null>(null)
  const [newItem, setNewItem] = useState({ label: "", value: "" })

  useEffect(() => {
    let mounted = true

    async function loadQuickFilterPageData() {
      const [countsResponse, typesResponse] = await Promise.all([
        getAdminQuickFilterCounts(),
        getAdminQuickFilterTypes(),
      ])

      if (!mounted) {
        return
      }

      if (countsResponse.success) {
        setCounts(countsResponse.data)
      }

      if (typesResponse.success && typesResponse.data.length > 0) {
        setTypes(typesResponse.data)
      }
    }

    void loadQuickFilterPageData()

    return () => {
      mounted = false
    }
  }, [])

  const fallbackTypes = useMemo<AdminQuickFilterType[]>(
    () =>
      filters.map((filter) => ({
        value: filter.id,
        label: filter.name,
      })),
    [filters]
  )

  const visibleTypes = types.length > 0 ? types : fallbackTypes

  const categoryByType = useMemo(() => {
    const map = new Map<string, FilterCategory>()
    for (const category of filters) {
      map.set(category.id, category)
    }
    return map
  }, [filters])

  const resolvedCategories = useMemo<FilterCategory[]>(() => {
    return visibleTypes.map((type) => {
      const existing = categoryByType.get(type.value)
      if (existing) {
        return {
          ...existing,
          name: type.label || existing.name,
        }
      }

      return {
        id: type.value,
        name: type.label || type.value,
        slug: type.value,
        icon: categoryIconByType[type.value] || Filter,
        description: categoryDescriptionByType[type.value] || "Manage quick filter options for this category",
        items: [],
      }
    })
  }, [categoryByType, visibleTypes])

  useEffect(() => {
    if (!resolvedCategories.some((category) => category.id === activeTab)) {
      const first = resolvedCategories[0]
      if (first) {
        setActiveTab(first.id)
      }
    }
  }, [activeTab, resolvedCategories])

  const loadOptionsForType = useCallback(async (type: string) => {
    if (!type) {
      return false
    }

    setIsOptionsLoading(true)
    setOptionsError(null)

    const response = await getAdminQuickFilterOptions(type)
    if (!response.success) {
      setOptionsError(response.message || "Failed to fetch options for this tab.")
      setIsOptionsLoading(false)
      return false
    }

    const normalizedItems: FilterItem[] = response.data.map((option: AdminQuickFilterOption, index) => ({
      id: String(option.id),
      value: option.value,
      label: option.displayLabel || option.value,
      enabled: option.isEnabled,
      order: option.sortOrder > 0 ? option.sortOrder : index + 1,
    }))

    setFilters((prev) => {
      const hasExisting = prev.some((category) => category.id === type)
      if (hasExisting) {
        return prev.map((category) =>
          category.id === type
            ? {
                ...category,
                items: normalizedItems,
              }
            : category
        )
      }

      const currentType = types.find((tabType) => tabType.value === type)

      return [
        ...prev,
        {
          id: type,
          name: currentType?.label || type,
          slug: type,
          icon: categoryIconByType[type] || Filter,
          description: categoryDescriptionByType[type] || "Manage quick filter options for this category",
          items: normalizedItems,
        },
      ]
    })

    setIsOptionsLoading(false)
    return true
  }, [types])

  useEffect(() => {
    let mounted = true

    async function loadOptionsForActiveTab() {
      if (!mounted || !activeTab) {
        return
      }

      await loadOptionsForType(activeTab)
    }

    void loadOptionsForActiveTab()

    return () => {
      mounted = false
    }
  }, [activeTab, loadOptionsForType])

  const activeCategory = resolvedCategories.find(f => f.id === activeTab)

  const handleAddItem = () => {
    void (async () => {
      if (!newItem.label || !activeCategory) return

      setIsMutatingOptions(true)
      const response = await createAdminQuickFilterOption({
        type: activeTab,
        displayLabel: newItem.label,
        value: newItem.value || newItem.label.toLowerCase().replace(/\s+/g, '-'),
        isEnabled: true,
      })

      if (!response.success) {
        setOptionsError(response.message || "Failed to create option.")
        setIsMutatingOptions(false)
        return
      }

      await loadOptionsForType(activeTab)
      setNewItem({ label: "", value: "" })
      setShowAddDialog(false)
      setIsMutatingOptions(false)

      void Swal.fire({
        icon: "success",
        title: "Successfully done",
        text: response.message || "Option created successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3d2e1f",
      })
    })()
  }

  const handleEditItem = async () => {
    if (!currentItem) return

    setIsMutatingOptions(true)
    const response = await updateAdminQuickFilterOption(currentItem.id, {
      displayLabel: currentItem.label,
      value: currentItem.value,
      isEnabled: currentItem.enabled,
    })

    if (!response.success) {
      setOptionsError(response.message || "Failed to update option.")
      setIsMutatingOptions(false)
      return
    }

    await loadOptionsForType(activeTab)
    setIsMutatingOptions(false)
    setShowEditDialog(false)
    setCurrentItem(null)
  }

  const toggleItemEnabled = async (item: FilterItem) => {
    setIsMutatingOptions(true)
    const response = await toggleAdminQuickFilterOption(item.id, !item.enabled)
    if (!response.success) {
      setOptionsError(response.message || "Failed to toggle option status.")
      setIsMutatingOptions(false)
      return
    }

    await loadOptionsForType(activeTab)
    setIsMutatingOptions(false)
  }

  const deleteItem = async (item: FilterItem) => {
    setIsMutatingOptions(true)
    const response = await deleteAdminQuickFilterOption(item.id, {
      displayLabel: item.label,
      value: item.value,
      isEnabled: item.enabled,
    })
    if (!response.success) {
      setOptionsError(response.message || "Failed to delete option.")
      setIsMutatingOptions(false)
      return
    }

    await loadOptionsForType(activeTab)
    setIsMutatingOptions(false)
  }

  const moveItem = async (item: FilterItem, direction: 'up' | 'down') => {
    setIsMutatingOptions(true)
    const response = await sortAdminQuickFilterOption(item.id, direction)
    if (!response.success) {
      setOptionsError(response.message || "Failed to sort option.")
      setIsMutatingOptions(false)
      return
    }

    await loadOptionsForType(activeTab)
    setIsMutatingOptions(false)
  }

  const totalFilters = filters.reduce((sum, cat) => sum + cat.items.length, 0)
  const enabledFilters = filters.reduce((sum, cat) => sum + cat.items.filter(i => i.enabled).length, 0)
  const filterTypeCount = counts?.filterTypes ?? resolvedCategories.length
  const totalOptionsCount = counts?.totalOptions ?? totalFilters
  const enabledCount = counts?.enabled ?? enabledFilters
  const disabledCount = counts?.disabled ?? Math.max(0, totalOptionsCount - enabledCount)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Quick Filters</h1>
          <p className="mt-1 text-muted-foreground">
            Manage filter options displayed on supplier and industry pages
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <Filter className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{filterTypeCount}</p>
                <p className="text-sm text-muted-foreground">Filter Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Package className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalOptionsCount}</p>
                <p className="text-sm text-muted-foreground">Total Options</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <Filter className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{enabledCount}</p>
                <p className="text-sm text-muted-foreground">Enabled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Filter className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{disabledCount}</p>
                <p className="text-sm text-muted-foreground">Disabled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Categories Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {resolvedCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="gap-2">
              <category.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {resolvedCategories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-secondary" />
                    {category.name}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {isOptionsLoading && category.id === activeTab ? (
                    <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                      Loading options...
                    </div>
                  ) : optionsError && category.id === activeTab ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      {optionsError}
                    </div>
                  ) : (
                    [...category.items]
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{item.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.value}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => void moveItem(item, 'up')}
                            disabled={isMutatingOptions || index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => void moveItem(item, 'down')}
                            disabled={isMutatingOptions || index === category.items.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Switch 
                          checked={item.enabled}
                          disabled={isMutatingOptions}
                          onCheckedChange={() => void toggleItemEnabled(item)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setCurrentItem(item)
                              setShowEditDialog(true)
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => void deleteItem(item)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))) }
                  
                  {!isOptionsLoading && !optionsError && category.items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <category.icon className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 font-medium text-foreground">No options yet</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Add your first filter option to get started
                      </p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setShowAddDialog(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Filter Option</DialogTitle>
            <DialogDescription>
              Add a new option to the {activeCategory?.name} filter
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Display Label</Label>
              <Input 
                placeholder="e.g., South Korea"
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Value (optional)</Label>
              <Input 
                placeholder="e.g., south-korea (auto-generated if empty)"
                value={newItem.value}
                onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                className="mt-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Used for filtering. If left empty, will be generated from the label.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isMutatingOptions}>Cancel</Button>
            <Button onClick={handleAddItem} disabled={!newItem.label || isMutatingOptions}>Add Option</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Filter Option</DialogTitle>
            <DialogDescription>
              Update the filter option details
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="space-y-4">
              <div>
                <Label>Display Label</Label>
                <Input 
                  value={currentItem.label}
                  onChange={(e) => setCurrentItem({ ...currentItem, label: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Value</Label>
                <Input 
                  value={currentItem.value}
                  onChange={(e) => setCurrentItem({ ...currentItem, value: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enabled</Label>
                <Switch 
                  checked={currentItem.enabled}
                  onCheckedChange={(checked) => setCurrentItem({ ...currentItem, enabled: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={() => void handleEditItem()} disabled={isMutatingOptions}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
