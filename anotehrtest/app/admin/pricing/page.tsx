"use client"

import { useState } from "react"
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
  Package
} from "lucide-react"

interface PricingFeature {
  text: string
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

const initialPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Get started with basic features",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: "Basic company profile", included: true },
      { text: "Up to 10 product listings", included: true },
      { text: "Receive buyer inquiries", included: true },
      { text: "Basic analytics", included: true },
      { text: "Email support", included: true },
      { text: "Priority listing", included: false },
      { text: "Reviewed badge", included: false },
      { text: "Featured placement", included: false },
    ],
    highlighted: false,
    buttonText: "Get Started",
    active: true
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing manufacturers",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      { text: "Enhanced company profile", included: true },
      { text: "Up to 100 product listings", included: true },
      { text: "Priority in search results", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Reviewed supplier badge", included: true },
      { text: "Priority email & chat support", included: true },
      { text: "Product catalog downloads", included: true },
      { text: "Featured placement", included: false },
    ],
    highlighted: true,
    buttonText: "Start Free Trial",
    active: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For established manufacturers",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    features: [
      { text: "Premium company profile", included: true },
      { text: "Unlimited product listings", included: true },
      { text: "Top priority in search results", included: true },
      { text: "Custom analytics & reports", included: true },
      { text: "Premium reviewed badge", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Featured homepage placement", included: true },
      { text: "API access", included: true },
    ],
    highlighted: false,
    buttonText: "Contact Sales",
    active: true
  }
]

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>(initialPlans)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [newFeature, setNewFeature] = useState("")
  
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

  const savePlan = () => {
    if (editingPlan) {
      setPlans(prev => prev.map(p => 
        p.id === editingPlan.id 
          ? { ...p, ...editForm }
          : p
      ))
      setShowEditDialog(false)
      setEditingPlan(null)
    }
  }

  const togglePlanActive = (planId: string) => {
    setPlans(prev => prev.map(p => 
      p.id === planId ? { ...p, active: !p.active } : p
    ))
  }

  const toggleHighlighted = (planId: string) => {
    setPlans(prev => prev.map(p => ({
      ...p,
      highlighted: p.id === planId ? !p.highlighted : false
    })))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setEditForm(prev => ({
        ...prev,
        features: [...prev.features, { text: newFeature.trim(), included: true }]
      }))
      setNewFeature("")
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

  const addNewPlan = () => {
    const newPlan: PricingPlan = {
      id: `plan-${Date.now()}`,
      name: editForm.name || "New Plan",
      description: editForm.description || "Plan description",
      monthlyPrice: editForm.monthlyPrice,
      yearlyPrice: editForm.yearlyPrice,
      features: editForm.features.length > 0 ? editForm.features : [
        { text: "Basic features", included: true }
      ],
      highlighted: false,
      buttonText: editForm.buttonText || "Get Started",
      active: true
    }
    setPlans(prev => [...prev, newPlan])
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
  }

  const deletePlan = (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId))
  }

  return (
    <div className="space-y-6">
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
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deletePlan(plan.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
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
                      {feature.text}
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
                  />
                  <span className="text-sm">Active</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleHighlighted(plan.id)}
                >
                  {plan.highlighted ? "Remove Highlight" : "Set as Popular"}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plan Name</Label>
                <Input 
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Button Text</Label>
                <Input 
                  value={editForm.buttonText}
                  onChange={(e) => setEditForm({ ...editForm, buttonText: e.target.value })}
                  className="mt-2"
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
                />
              </div>
            </div>

            <div>
              <Label>Features</Label>
              <div className="mt-2 space-y-2">
                {editForm.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded border border-border">
                    <Switch 
                      checked={feature.included}
                      onCheckedChange={() => toggleFeatureIncluded(i)}
                    />
                    <span className="flex-1 text-sm">{feature.text}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFeature(i)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <Input 
                  placeholder="Add new feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFeature()}
                />
                <Button onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                checked={editForm.highlighted}
                onCheckedChange={(checked) => setEditForm({ ...editForm, highlighted: checked })}
              />
              <Label>Mark as Most Popular</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={savePlan}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plan Name</Label>
                <Input 
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., Business"
                />
              </div>
              <div>
                <Label>Button Text</Label>
                <Input 
                  value={editForm.buttonText}
                  onChange={(e) => setEditForm({ ...editForm, buttonText: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., Get Started"
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
                />
              </div>
            </div>

            <div>
              <Label>Features</Label>
              <div className="mt-2 space-y-2">
                {editForm.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded border border-border">
                    <Switch 
                      checked={feature.included}
                      onCheckedChange={() => toggleFeatureIncluded(i)}
                    />
                    <span className="flex-1 text-sm">{feature.text}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFeature(i)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <Input 
                  placeholder="Add new feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFeature()}
                />
                <Button onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addNewPlan}>
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
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
                          {feature.text}
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
    </div>
  )
}
