"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { 
  DollarSign, 
  Edit, 
  Plus, 
  Trash2,
  ChevronDown,
  Check,
  X,
  Save,
  Eye,
  Package,
  Search
} from "lucide-react"
import { fetchPlans, createPlan, updatePlan, deletePlan as deleteApiPlan, fetchPlanFeatures, togglePopularPlan, updatePlanFeature, type PricingPlan as BackendPricingPlan, type PlanFeature } from "@/lib/api/admin-pricing"

interface PricingFeature {
  rowId: string
  id: number
  label?: string
  inputType: "boolean" | "text"
  value: string
}

interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: PricingFeature[]
  highlighted: boolean
  buttonText: string
  active: boolean
}

function transformBackendPlan(plan: BackendPricingPlan, featureCatalog: PlanFeature[] = []): PricingPlan {
  return {
    id: plan.id.toString(),
    name: plan.name,
    description: plan.description,
    monthlyPrice: parseFloat(plan.monthly_price?.amount || "0"),
    yearlyPrice: parseFloat(plan.yearly_price?.amount || "0"),
    features: plan.features?.map((feature) => ({
      rowId: `${feature.id}-${feature.input_type}-${feature.value}`,
      id: feature.id,
      label: featureCatalog.find((item) => Number(item.id) === Number(feature.id))?.name,
      inputType: feature.input_type === "boolean" ? "boolean" : "text",
      value: feature.value,
    })) || [],
    highlighted: plan.is_popular,
    buttonText: plan.button_text,
    active: plan.status === 1
  }
}

function createEditableFeatureRowId(id: number) {
  return `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function serializePlanFeatures(features: PricingFeature[]) {
  return features.map((feature) => ({
    id: feature.id,
    input_type: feature.inputType,
    value: feature.inputType === "boolean"
      ? (feature.value === "1" ? "1" : "0")
      : feature.value.trim(),
  }))
}

function isFeatureEnabled(feature: PricingFeature) {
  if (feature.inputType === "boolean") {
    return feature.value === "1"
  }

  return feature.value.trim().length > 0
}

function EditableFeatureRow(props: {
  feature: PricingFeature
  onRemove: () => void
  onChange: (feature: PricingFeature) => void
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border border-border bg-muted/20">
        <div className="flex items-center gap-2 p-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{props.feature.label || `Feature ${props.feature.id}`}</p>
            <p className="text-xs text-muted-foreground">
              ID {props.feature.id} · {props.feature.inputType === "boolean"
                ? `Boolean value: ${props.feature.value === "1" ? "1" : "0"}`
                : `Text value: ${props.feature.value || "empty"}`}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {props.feature.inputType === "boolean" ? (props.feature.value === "1" ? "Yes" : "No") : "Text"}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={props.onRemove}
            className="h-8 w-8 shrink-0"
            disabled={props.disabled}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        <CollapsibleContent className="px-2 pb-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={props.feature.inputType}
                onValueChange={(value) =>
                  props.onChange({
                    ...props.feature,
                    inputType: value as "boolean" | "text",
                    value:
                      value === "boolean"
                        ? (props.feature.value === "0" ? "0" : "1")
                                    : (props.feature.value === "1" || props.feature.value === "0" ? "" : props.feature.value.replace(/[^0-9]/g, "")),
                  })
                }
                disabled={props.disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {props.feature.inputType === "boolean" ? (
              <div className="space-y-2">
                <Label>Value</Label>
                <Select
                  value={props.feature.value === "1" ? "yes" : "no"}
                  onValueChange={(value) =>
                    props.onChange({
                      ...props.feature,
                      value: value === "yes" ? "1" : "0",
                    })
                  }
                  disabled={props.disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose yes or no" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2 md:col-span-2">
                <Label>Text Value</Label>
                <Input
                  type="number"
                  min="0"
                  value={props.feature.value}
                  onChange={(event) =>
                    props.onChange({
                      ...props.feature,
                      value: event.target.value.replace(/[^0-9]/g, ""),
                    })
                  }
                  placeholder="Enter numeric value"
                  disabled={props.disabled}
                />
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [availableFeatures, setAvailableFeatures] = useState<PlanFeature[]>([])
  const [featureCatalogFilter, setFeatureCatalogFilter] = useState("")
  const [featureSearchFilter, setFeatureSearchFilter] = useState("")
  const [showFeatureSelector, setShowFeatureSelector] = useState<"add" | "edit" | null>(null)
  const [editingFeature, setEditingFeature] = useState<PlanFeature | null>(null)
  const [showFeatureEditDialog, setShowFeatureEditDialog] = useState(false)
  const [isFeatureUpdating, setIsFeatureUpdating] = useState(false)
  const [featureUpdateError, setFeatureUpdateError] = useState<string | null>(null)
  const [togglingPlanId, setTogglingPlanId] = useState<string | null>(null)
  const [togglingPopularPlanId, setTogglingPopularPlanId] = useState<string | null>(null)
  const [isFeatureCatalogOpen, setIsFeatureCatalogOpen] = useState(false)

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true)
      try {
        const [backendPlans, features] = await Promise.all([
          fetchPlans(),
          fetchPlanFeatures()
        ])
        const transformedPlans = backendPlans.map((plan) => transformBackendPlan(plan, features))
        setPlans(transformedPlans)
        setAvailableFeatures(features)
      } catch (error) {
        console.error("Error loading plans:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlans()
  }, [])
  
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    monthlyPrice: 0,
    yearlyPrice: 0,
    buttonText: "",
    highlighted: false,
    active: true,
    features: [] as PricingFeature[]
  })

  const [featureForm, setFeatureForm] = useState({
    name: "",
  })

  const openEditDialog = (plan: PricingPlan) => {
    setEditingPlan(plan)
    setEditForm({
      name: plan.name,
      description: plan.description,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      buttonText: plan.buttonText,
      highlighted: plan.highlighted,
      active: plan.active,
      features: plan.features.map((feature, index) => ({
        ...feature,
        rowId: feature.rowId || createEditableFeatureRowId(feature.id + index),
      }))
    })
    setShowEditDialog(true)
  }

  const openFeatureEditDialog = (feature: PlanFeature) => {
    setEditingFeature(feature)
    setFeatureForm({
      name: feature.name,
    })
    setFeatureUpdateError(null)
    setShowFeatureEditDialog(true)
  }

  const saveFeature = async () => {
    if (!editingFeature) return

    const trimmedName = featureForm.name.trim()

    if (!trimmedName) {
      setFeatureUpdateError("Feature name is required")
      return
    }

    setIsFeatureUpdating(true)
    setFeatureUpdateError(null)

    try {
      const result = await updatePlanFeature(editingFeature.id, {
        name: trimmedName,
      })

      if (result.success) {
        setAvailableFeatures(prev => prev.map(feature => (
          feature.id === editingFeature.id
            ? result.feature || { ...feature, name: trimmedName }
            : feature
        )))
        setShowFeatureEditDialog(false)
        setEditingFeature(null)
      } else {
        setFeatureUpdateError(result.message || "Failed to update feature")
      }
    } catch (error) {
      console.error("Error updating feature:", error)
      setFeatureUpdateError("An unexpected error occurred")
    } finally {
      setIsFeatureUpdating(false)
    }
  }

  const savePlan = async () => {
    if (!editingPlan) return

    setIsUpdating(true)
    setUpdateError(null)

    try {
      const transformedFeatures = serializePlanFeatures(editForm.features)

      const hasEmptyTextFeature = editForm.features.some(feature => feature.inputType === "text" && !feature.value.trim())
      if (hasEmptyTextFeature) {
        setUpdateError("Text features need a text value before saving.")
        setIsUpdating(false)
        return
      }

      // Prepare the payload
      const payload = {
        name: editForm.name,
        description: editForm.description,
        button_text: editForm.buttonText,
        monthly_price: editForm.monthlyPrice,
        yearly_price: editForm.yearlyPrice,
        status: editForm.active,
        is_popular: editForm.highlighted,
        features: transformedFeatures
      }

      // Call the API
      const result = await updatePlan(editingPlan.id, payload)

      if (result.success) {
        // Update local state
        setPlans(prev => {
          const updatedPlans = prev.map(p => 
            p.id === editingPlan.id 
              ? { ...p, ...editForm }
              : p
          )
          if (editForm.highlighted) {
            return updatedPlans.map(p => 
              p.id === editingPlan.id ? p : { ...p, highlighted: false }
            )
          }
          return updatedPlans
        })
        setShowEditDialog(false)
        setEditingPlan(null)
      } else {
        setUpdateError(result.message || "Failed to update plan")
      }
    } catch (error) {
      console.error("Error updating plan:", error)
      setUpdateError("An unexpected error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  const togglePlanActive = async (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    if (!plan) return

    setTogglingPlanId(planId)
    try {
      const features = serializePlanFeatures(plan.features)

      // Prepare the payload with flipped active status
      const newActiveStatus = !plan.active
      const payload = {
        name: plan.name,
        description: plan.description,
        button_text: plan.buttonText,
        monthly_price: plan.monthlyPrice,
        yearly_price: plan.yearlyPrice,
        status: newActiveStatus,
        is_popular: plan.highlighted,
        features: features
      }

      // Call the API
      const result = await updatePlan(planId, payload)

      if (result.success) {
        // Update local state
        setPlans(prev => prev.map(p => 
          p.id === planId ? { ...p, active: newActiveStatus } : p
        ))
      } else {
        console.error("Failed to toggle plan status:", result.message)
      }
    } catch (error) {
      console.error("Error toggling plan status:", error)
    } finally {
      setTogglingPlanId(null)
    }
  }

  const toggleHighlighted = async (planId: string) => {
    setTogglingPopularPlanId(planId)
    try {
      const result = await togglePopularPlan(planId)
      
      if (result.success) {
        // Update local state - ensure only one plan is highlighted
        const plan = plans.find(p => p.id === planId)
        setPlans(prev => prev.map(p => ({
          ...p,
          highlighted: p.id === planId ? !plan?.highlighted : false
        })))
      } else {
        console.error("Failed to toggle plan popular status:", result.message)
      }
    } catch (error) {
      console.error("Error toggling plan popular status:", error)
    } finally {
      setTogglingPopularPlanId(null)
    }
  }

  const addFeature = (featureId: number) => {
    const feature = availableFeatures.find(f => f.id === featureId)
    if (feature && !editForm.features.find(f => f.id === featureId)) {
      setEditForm(prev => ({
        ...prev,
        features: [...prev.features, {
          rowId: createEditableFeatureRowId(feature.id),
          id: feature.id,
          label: feature.name,
          inputType: "boolean",
          value: "1",
        }]
      }))
      setFeatureSearchFilter("")
    }
  }

  const removeFeature = (rowId: string) => {
    setEditForm(prev => ({
      ...prev,
      features: prev.features.filter((feature) => feature.rowId !== rowId)
    }))
  }

  const updateFeature = (rowId: string, updatedFeature: PricingFeature) => {
    setEditForm(prev => ({
      ...prev,
      features: prev.features.map((feature) =>
        feature.rowId === rowId ? updatedFeature : feature
      )
    }))
  }

  const addNewPlan = async () => {
    if (!editForm.name.trim()) {
      setCreateError("Plan name is required")
      return
    }

    setIsCreating(true)
    setCreateError(null)

    try {
      const hasEmptyTextFeature = editForm.features.some(feature => feature.inputType === "text" && !feature.value.trim())
      if (hasEmptyTextFeature) {
        setCreateError("Text features need a text value before creating the plan.")
        setIsCreating(false)
        return
      }

      const transformedFeatures = serializePlanFeatures(editForm.features)

      // Prepare the payload
      const payload = {
        name: editForm.name,
        description: editForm.description || "Plan description",
        button_text: editForm.buttonText || "Get Started",
        monthly_price: editForm.monthlyPrice,
        yearly_price: editForm.yearlyPrice,
        currency_code: "USD",
        features: transformedFeatures
      }

      // Call the API
      const result = await createPlan(payload)

      if (result.success) {
        // If API returns the created plan, use it; otherwise create locally
        if (result.plan) {
          const newPlan = transformBackendPlan(result.plan)
          setPlans(prev => [...prev, newPlan])
        } else {
          const newPlan: PricingPlan = {
            id: `plan-${Date.now()}`,
            name: editForm.name,
            description: editForm.description,
            monthlyPrice: editForm.monthlyPrice,
            yearlyPrice: editForm.yearlyPrice,
            features: editForm.features,
            highlighted: false,
            buttonText: editForm.buttonText,
            active: true
          }
          setPlans(prev => [...prev, newPlan])
        }

        // Reset form
        setShowAddDialog(false)
        setEditForm({
          name: "",
          description: "",
          monthlyPrice: 0,
          yearlyPrice: 0,
          buttonText: "",
          highlighted: false,
          active: true,
          features: []
        })
      } else {
        setCreateError(result.message || "Failed to create plan")
      }
    } catch (error) {
      console.error("Error creating plan:", error)
      setCreateError("An unexpected error occurred")
    } finally {
      setIsCreating(false)
    }
  }

  const deletePlan = async (planId: string) => {
    setIsDeleting(planId)
    try {
      const result = await deleteApiPlan(planId)
      if (result.success) {
        setPlans(prev => prev.filter(p => p.id !== planId))
      }
    } catch (error) {
      console.error("Error deleting plan:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading pricing plans...</div>
        </div>
      )}
      {!isLoading && (
        <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing Management</h1>
          <p className="text-muted-foreground">Manage subscription plans and pricing</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={() => {
            setEditForm({
              name: "",
              description: "",
              monthlyPrice: 0,
              yearlyPrice: 0,
              buttonText: "Get Started",
              highlighted: false,
              active: true,
              features: []
            })
            setShowAddDialog(true)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-sm text-muted-foreground">Total Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-600">
              {plans.filter(p => p.active).length}
            </div>
            <p className="text-sm text-muted-foreground">Active Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ${Math.max(...plans.map(p => p.monthlyPrice))}
            </div>
            <p className="text-sm text-muted-foreground">Highest Monthly</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ${Math.max(...plans.map(p => p.yearlyPrice))}
            </div>
            <p className="text-sm text-muted-foreground">Highest Yearly</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Catalog */}
      <Card>
        <Collapsible open={isFeatureCatalogOpen} onOpenChange={setIsFeatureCatalogOpen}>
          <CardHeader className="pb-4">
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-start justify-between gap-4 text-left">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Feature Catalog
                  </CardTitle>
                  <CardDescription>
                    Manage the feature records used across pricing plans and selectors.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{availableFeatures.length} features</Badge>
                  <span className="text-xs text-muted-foreground">
                    {isFeatureCatalogOpen ? "Hide" : "Show"}
                  </span>
                </div>
              </button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search features by name or key..."
                  value={featureCatalogFilter}
                  onChange={(e) => setFeatureCatalogFilter(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {availableFeatures
                  .filter((feature) => {
                    const query = featureCatalogFilter.toLowerCase().trim()
                    if (!query) return true
                    return feature.name.toLowerCase().includes(query) || feature.key.toLowerCase().includes(query)
                  })
                  .map((feature) => (
                    <div key={feature.id} className="rounded-lg border border-border bg-muted/20 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{feature.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground break-all">{feature.key}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => openFeatureEditDialog(feature)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                {availableFeatures.filter((feature) => {
                  const query = featureCatalogFilter.toLowerCase().trim()
                  if (!query) return true
                  return feature.name.toLowerCase().includes(query) || feature.key.toLowerCase().includes(query)
                }).length === 0 && (
                  <div className="col-span-full rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                    {featureCatalogFilter ? "No features match your search." : "No features loaded from the backend."}
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.highlighted ? 'ring-2 ring-primary' : ''} ${!plan.active ? 'opacity-60' : ''}`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    {!plan.active && <Badge variant="secondary">Inactive</Badge>}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => openEditDialog(plan)}
                    disabled={isDeleting === plan.id}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deletePlan(plan.id)}
                    className="text-destructive"
                    disabled={isDeleting === plan.id}
                  >
                    {isDeleting === plan.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${plan.monthlyPrice}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  or ${plan.yearlyPrice}/year (save {plan.monthlyPrice > 0 ? Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100) : 0}%)
                </p>
              </div>

              <div className="space-y-2">
                {plan.features.slice(0, 5).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {isFeatureEnabled(feature) ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={!isFeatureEnabled(feature) ? "text-muted-foreground" : ""}>
                      {feature.label || (feature.inputType === "boolean" ? (feature.value === "1" ? "Yes" : "No") : feature.value)}
                    </span>
                  </div>
                ))}
                {plan.features.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    +{plan.features.length - 5} more features
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={plan.active}
                    onCheckedChange={() => togglePlanActive(plan.id)}
                    disabled={togglingPlanId === plan.id || isDeleting === plan.id}
                  />
                  <span className="text-sm">
                    {togglingPlanId === plan.id ? "Updating..." : "Active"}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleHighlighted(plan.id)}
                  disabled={togglingPlanId === plan.id || togglingPopularPlanId === plan.id || isDeleting === plan.id}
                >
                  {togglingPopularPlanId === plan.id ? (
                    <>
                      <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Updating...
                    </>
                  ) : plan.highlighted ? "Remove Highlight" : "Set as Popular"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Plan Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Plan: {editingPlan?.name}</DialogTitle>
            <DialogDescription>
              Update plan details and pricing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {updateError && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                {updateError}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plan Name</Label>
                <Input 
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-2"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <Label>Button Text</Label>
                <Input 
                  value={editForm.buttonText}
                  onChange={(e) => setEditForm({ ...editForm, buttonText: e.target.value })}
                  className="mt-2"
                  disabled={isUpdating}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea 
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="mt-2"
                rows={2}
                disabled={isUpdating}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Monthly Price ($)</Label>
                <Input 
                  type="number"
                  min="0"
                  value={editForm.monthlyPrice}
                  onChange={(e) => setEditForm({ ...editForm, monthlyPrice: Number(e.target.value) })}
                  className="mt-2"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <Label>Yearly Price ($)</Label>
                <Input 
                  type="number"
                  min="0"
                  value={editForm.yearlyPrice}
                  onChange={(e) => setEditForm({ ...editForm, yearlyPrice: Number(e.target.value) })}
                  className="mt-2"
                  disabled={isUpdating}
                />
              </div>
            </div>

            <div>
              <Label>Features</Label>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-2">
                {editForm.features.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">No features selected. Click "Add Feature" to add.</p>
                ) : (
                  editForm.features.map((feature) => (
                    <EditableFeatureRow
                      key={feature.rowId}
                      feature={feature}
                      onRemove={() => removeFeature(feature.rowId)}
                      onChange={(updatedFeature) => updateFeature(feature.rowId, updatedFeature)}
                      disabled={isUpdating}
                    />
                  ))
                )}
              </div>
              <Button 
                onClick={() => setShowFeatureSelector("edit")}
                disabled={isUpdating}
                className="mt-3 w-full"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 border-t pt-4">
              <div className="flex items-center gap-2">
                <Switch 
                  id="edit-plan-active"
                  checked={editForm.active}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, active: checked })}
                  disabled={isUpdating}
                />
                <Label htmlFor="edit-plan-active" className="cursor-pointer">Active Plan Status</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id="edit-plan-popular"
                  checked={editForm.highlighted}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, highlighted: checked })}
                  disabled={isUpdating}
                />
                <Label htmlFor="edit-plan-popular" className="cursor-pointer">Mark as Most Popular</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowEditDialog(false)
                setUpdateError(null)
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={savePlan} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Plan Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
            <DialogDescription>
              Create a new subscription plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {createError && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                {createError}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plan Name</Label>
                <Input 
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., Business"
                  disabled={isCreating}
                />
              </div>
              <div>
                <Label>Button Text</Label>
                <Input 
                  value={editForm.buttonText}
                  onChange={(e) => setEditForm({ ...editForm, buttonText: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., Get Started"
                  disabled={isCreating}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea 
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="mt-2"
                rows={2}
                placeholder="Brief description of this plan"
                disabled={isCreating}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Monthly Price ($)</Label>
                <Input 
                  type="number"
                  min="0"
                  value={editForm.monthlyPrice}
                  onChange={(e) => setEditForm({ ...editForm, monthlyPrice: Number(e.target.value) })}
                  className="mt-2"
                  disabled={isCreating}
                />
              </div>
              <div>
                <Label>Yearly Price ($)</Label>
                <Input 
                  type="number"
                  min="0"
                  value={editForm.yearlyPrice}
                  onChange={(e) => setEditForm({ ...editForm, yearlyPrice: Number(e.target.value) })}
                  className="mt-2"
                  disabled={isCreating}
                />
              </div>
            </div>

            <div>
              <Label>Features</Label>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-2">
                {editForm.features.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">No features selected. Click "Add Feature" to add.</p>
                ) : (
                  editForm.features.map((feature) => (
                    <EditableFeatureRow
                      key={feature.rowId}
                      feature={feature}
                      onRemove={() => removeFeature(feature.rowId)}
                      onChange={(updatedFeature) => updateFeature(feature.rowId, updatedFeature)}
                      disabled={isCreating}
                    />
                  ))
                )}
              </div>
              <Button 
                onClick={() => setShowFeatureSelector("add")}
                disabled={isCreating}
                className="mt-3 w-full"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddDialog(false)
                setCreateError(null)
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={addNewPlan} disabled={isCreating}>
              {isCreating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Plan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Feature Dialog */}
      <Dialog open={showFeatureEditDialog} onOpenChange={setShowFeatureEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Feature</DialogTitle>
            <DialogDescription>
              Update the feature label used by plan selectors.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {featureUpdateError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {featureUpdateError}
              </div>
            )}

            <div>
              <Label>Feature Name</Label>
              <Input
                value={featureForm.name}
                onChange={(e) => setFeatureForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-2"
                disabled={isFeatureUpdating}
              />
            </div>

            <div>
              <Label>Feature Key</Label>
              <Input
                value={editingFeature?.key || ""}
                className="mt-2"
                disabled
              />
            </div>

          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowFeatureEditDialog(false)
                setFeatureUpdateError(null)
              }}
              disabled={isFeatureUpdating}
            >
              Cancel
            </Button>
            <Button onClick={saveFeature} disabled={isFeatureUpdating}>
              {isFeatureUpdating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Feature
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pricing Page Preview</DialogTitle>
            <DialogDescription>
              How the pricing page will appear to users
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground mt-2">
                Choose the plan that fits your business needs
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.filter(p => p.active).map((plan) => (
                <div 
                  key={plan.id}
                  className={`rounded-xl border p-6 ${plan.highlighted ? 'border-primary ring-2 ring-primary' : 'border-border'}`}
                >
                  {plan.highlighted && (
                    <Badge className="mb-4 bg-primary">Most Popular</Badge>
                  )}
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.monthlyPrice}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <Button className={`w-full mt-6 ${plan.highlighted ? '' : 'variant-outline'}`}>
                    {plan.buttonText}
                  </Button>
                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {isFeatureEnabled(feature) ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={!isFeatureEnabled(feature) ? "text-muted-foreground" : ""}>
                          {feature.label || (feature.inputType === "boolean" ? (feature.value === "1" ? "Yes" : "No") : feature.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feature Selector Dialog */}
      <Dialog open={showFeatureSelector !== null} onOpenChange={(open) => !open && setShowFeatureSelector(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Features</DialogTitle>
            <DialogDescription>
              Choose from available features ({availableFeatures.length} total)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search features..."
                value={featureSearchFilter}
                onChange={(e) => setFeatureSearchFilter(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto border border-border rounded-lg p-3">
              {availableFeatures
                .filter(f => 
                  !editForm.features.find(ef => ef.id === f.id) &&
                  f.name.toLowerCase().includes(featureSearchFilter.toLowerCase())
                )
                .map((feature) => (
                  <div 
                    key={feature.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => addFeature(feature.id)}
                  >
                    <div>
                      <p className="font-medium text-sm">{feature.name}</p>
                      <p className="text-xs text-muted-foreground">{feature.key}</p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              {availableFeatures.filter(f => 
                !editForm.features.find(ef => ef.id === f.id) &&
                f.name.toLowerCase().includes(featureSearchFilter.toLowerCase())
              ).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {featureSearchFilter ? "No features match your search" : "All features are already added"}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowFeatureSelector(null)
                setFeatureSearchFilter("")
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  )
}
