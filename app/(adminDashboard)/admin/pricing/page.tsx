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
  DollarSign, 
  Edit, 
  Plus, 
  Trash2,
  Check,
  X,
  Save,
  Eye,
  Package,
  Search
} from "lucide-react"
import { fetchPlans, createPlan, updatePlan, deletePlan as deleteApiPlan, fetchPlanFeatures, togglePopularPlan, type PricingPlan as BackendPricingPlan, type PlanFeature } from "@/lib/api/admin-pricing"

interface PricingFeature {
  id: number
  name: string
  included: boolean
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

function transformBackendPlan(plan: BackendPricingPlan): PricingPlan {
  return {
    id: plan.id.toString(),
    name: plan.name,
    description: plan.description,
    monthlyPrice: parseFloat(plan.monthly_price?.amount || "0"),
    yearlyPrice: parseFloat(plan.yearly_price?.amount || "0"),
    features: plan.features?.map((feature) => ({
      id: feature.id,
      name: feature.value,
      included: true
    })) || [],
    highlighted: plan.is_popular,
    buttonText: plan.button_text,
    active: plan.status === 1
  }
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
  const [featureSearchFilter, setFeatureSearchFilter] = useState("")
  const [showFeatureSelector, setShowFeatureSelector] = useState<"add" | "edit" | null>(null)
  const [togglingPlanId, setTogglingPlanId] = useState<string | null>(null)
  const [togglingPopularPlanId, setTogglingPopularPlanId] = useState<string | null>(null)

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true)
      try {
        const [backendPlans, features] = await Promise.all([
          fetchPlans(),
          fetchPlanFeatures()
        ])
        const transformedPlans = backendPlans.map(transformBackendPlan)
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
    features: [] as PricingFeature[]
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
      features: [...plan.features]
    })
    setShowEditDialog(true)
  }

  const savePlan = async () => {
    if (!editingPlan) return

    setIsUpdating(true)
    setUpdateError(null)

    try {
      // Transform features to backend format with sequential IDs
      const transformedFeatures = editForm.features.map((feature, index) => ({
        id: index + 1,
        input_type: "text",
        value: feature.name
      }))

      // Prepare the payload
      const payload = {
        name: editForm.name,
        description: editForm.description,
        button_text: editForm.buttonText,
        monthly_price: editForm.monthlyPrice,
        yearly_price: editForm.yearlyPrice,
        status: editForm.highlighted,
        is_popular: editForm.highlighted,
        features: transformedFeatures
      }

      // Call the API
      const result = await updatePlan(editingPlan.id, payload)

      if (result.success) {
        // Update local state
        setPlans(prev => prev.map(p => 
          p.id === editingPlan.id 
            ? { ...p, ...editForm }
            : p
        ))
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
      // Get current plan features with sequential IDs
      const features = plan.features.map((feature, index) => ({
        id: index + 1,
        input_type: "text",
        value: feature.name
      }))

      // Prepare the payload with flipped active status
      const newActiveStatus = !plan.active
      const payload = {
        name: plan.name,
        description: plan.description,
        button_text: plan.buttonText,
        monthly_price: plan.monthlyPrice,
        yearly_price: plan.yearlyPrice,
        status: newActiveStatus ? 1 : 0,
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
        features: [...prev.features, { id: feature.id, name: feature.name, included: true }]
      }))
      setFeatureSearchFilter("")
    }
  }

  const removeFeature = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const toggleFeatureIncluded = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      features: prev.features.map((f, i) => 
        i === index ? { ...f, included: !f.included } : f
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
      // Transform features to backend format with sequential IDs
      const transformedFeatures = editForm.features.map((feature, index) => ({
        id: index + 1,
        input_type: "text",
        value: feature.name
      }))

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
                    {feature.included ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={!feature.included ? "text-muted-foreground" : ""}>
                      {feature.name}
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
                  editForm.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded border border-border bg-muted/30">
                      {/* <Switch 
                        checked={feature.included}
                        onCheckedChange={() => toggleFeatureIncluded(i)}
                        disabled={isUpdating}
                      /> */}
                      <span className="flex-1 text-sm font-medium">{feature.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFeature(i)}
                        className="h-8 w-8"
                        disabled={isUpdating}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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

            <div className="flex items-center gap-2">
              <Switch 
                checked={editForm.highlighted}
                onCheckedChange={(checked) => setEditForm({ ...editForm, highlighted: checked })}
                disabled={isUpdating}
              />
              <Label>Mark as Most Popular</Label>
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
                  editForm.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded border border-border bg-muted/30">
                      {/* <Switch 
                        checked={feature.included}
                        onCheckedChange={() => toggleFeatureIncluded(i)}
                        disabled={isCreating}
                      /> */}
                      <span className="flex-1 text-sm font-medium">{feature.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFeature(i)}
                        className="h-8 w-8"
                        disabled={isCreating}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
                        {feature.included ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={!feature.included ? "text-muted-foreground" : ""}>
                          {feature.name}
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
