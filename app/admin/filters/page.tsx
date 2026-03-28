"use client"

import { useState } from "react"
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
    id: "moq",
    name: "MOQ Ranges",
    slug: "moq",
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
    id: "export-markets",
    name: "Export Markets",
    slug: "export-markets",
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
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentItem, setCurrentItem] = useState<FilterItem | null>(null)
  const [newItem, setNewItem] = useState({ label: "", value: "" })

  const activeCategory = filters.find(f => f.id === activeTab)

  const handleAddItem = () => {
    if (!newItem.label || !activeCategory) return
    
    const id = `${activeTab}-${Date.now()}`
    const value = newItem.value || newItem.label.toLowerCase().replace(/\s+/g, '-')
    const maxOrder = Math.max(...activeCategory.items.map(i => i.order), 0)
    
    setFilters(prev => prev.map(cat => 
      cat.id === activeTab 
        ? { 
            ...cat, 
            items: [...cat.items, { 
              id, 
              value, 
              label: newItem.label, 
              enabled: true, 
              order: maxOrder + 1 
            }] 
          }
        : cat
    ))
    setNewItem({ label: "", value: "" })
    setShowAddDialog(false)
  }

  const handleEditItem = () => {
    if (!currentItem) return
    
    setFilters(prev => prev.map(cat => 
      cat.id === activeTab 
        ? { 
            ...cat, 
            items: cat.items.map(item => 
              item.id === currentItem.id ? currentItem : item
            ) 
          }
        : cat
    ))
    setShowEditDialog(false)
    setCurrentItem(null)
  }

  const toggleItemEnabled = (itemId: string) => {
    setFilters(prev => prev.map(cat => 
      cat.id === activeTab 
        ? { 
            ...cat, 
            items: cat.items.map(item => 
              item.id === itemId ? { ...item, enabled: !item.enabled } : item
            ) 
          }
        : cat
    ))
  }

  const deleteItem = (itemId: string) => {
    setFilters(prev => prev.map(cat => 
      cat.id === activeTab 
        ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
        : cat
    ))
  }

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    if (!activeCategory) return
    
    const items = [...activeCategory.items].sort((a, b) => a.order - b.order)
    const currentIndex = items.findIndex(i => i.id === itemId)
    
    if (direction === 'up' && currentIndex > 0) {
      const temp = items[currentIndex].order
      items[currentIndex].order = items[currentIndex - 1].order
      items[currentIndex - 1].order = temp
    } else if (direction === 'down' && currentIndex < items.length - 1) {
      const temp = items[currentIndex].order
      items[currentIndex].order = items[currentIndex + 1].order
      items[currentIndex + 1].order = temp
    }
    
    setFilters(prev => prev.map(cat => 
      cat.id === activeTab ? { ...cat, items } : cat
    ))
  }

  const totalFilters = filters.reduce((sum, cat) => sum + cat.items.length, 0)
  const enabledFilters = filters.reduce((sum, cat) => sum + cat.items.filter(i => i.enabled).length, 0)

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
                <p className="text-2xl font-bold text-foreground">{filters.length}</p>
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
                <p className="text-2xl font-bold text-foreground">{totalFilters}</p>
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
                <p className="text-2xl font-bold text-foreground">{enabledFilters}</p>
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
                <p className="text-2xl font-bold text-foreground">{totalFilters - enabledFilters}</p>
                <p className="text-sm text-muted-foreground">Disabled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Categories Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {filters.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="gap-2">
              <category.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {filters.map(category => (
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
                  {category.items
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
                            onClick={() => moveItem(item.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => moveItem(item.id, 'down')}
                            disabled={index === category.items.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Switch 
                          checked={item.enabled}
                          onCheckedChange={() => toggleItemEnabled(item.id)}
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
                              onClick={() => deleteItem(item.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  
                  {category.items.length === 0 && (
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
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddItem} disabled={!newItem.label}>Add Option</Button>
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
            <Button onClick={handleEditItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
