"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Sparkles, 
  Users, 
  Calendar, 
  Edit, 
  Trash2, 
  RotateCcw, 
  Eye,
  CheckCircle,
  Clock,
  Factory,
  TrendingUp,
  AlertTriangle,
  Save,
  X
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Mock data for founding program
const initialFoundingProgram = {
  id: "founding-manufacturer",
  name: "Founding Manufacturer",
  description: "Early Supplier Program - Get 6 months free access to the Growth plan",
  isActive: true,
  planType: "growth", // starter, growth, enterprise
  duration: 6, // months
  maxSpots: 300,
  usedSpots: 173, // Only approved suppliers count
  createdAt: "2026-01-15",
  expiresAt: null, // null means no expiration date
  ctaText: "Apply as Founding Member",
  badgeText: "First 300 Only",
  highlightText: "Get full Growth plan features free for 6 months. After the trial, continue with any paid plan to keep your account active.",
}

// Mock data for suppliers in the program
const foundingSuppliers = [
  { id: "1", name: "TechVision Electronics", email: "contact@techvision.com", country: "China", joinedAt: "2026-01-20", status: "approved", trialEndsAt: "2026-07-20" },
  { id: "2", name: "EcoThread Textiles", email: "info@ecothread.com", country: "China", joinedAt: "2026-01-25", status: "approved", trialEndsAt: "2026-07-25" },
  { id: "3", name: "GlobalFab Machinery", email: "sales@globalfab.com", country: "China", joinedAt: "2026-02-01", status: "approved", trialEndsAt: "2026-08-01" },
  { id: "4", name: "NewTech Industries", email: "info@newtech.vn", country: "Vietnam", joinedAt: "2026-02-15", status: "pending", trialEndsAt: null },
  { id: "5", name: "GreenLeaf Organics", email: "hello@greenleaf.th", country: "Thailand", joinedAt: "2026-02-20", status: "pending", trialEndsAt: null },
  { id: "6", name: "QuickPack Solutions", email: "sales@quickpack.vn", country: "Vietnam", joinedAt: "2026-03-01", status: "approved", trialEndsAt: "2026-09-01" },
  { id: "7", name: "MetalWorks Pro", email: "contact@metalworks.cn", country: "China", joinedAt: "2026-03-05", status: "approved", trialEndsAt: "2026-09-05" },
]

export default function PromotionsPage() {
  const [program, setProgram] = useState(initialFoundingProgram)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [editForm, setEditForm] = useState(program)
  const [supplierFilter, setSupplierFilter] = useState<"all" | "approved" | "pending">("all")

  const approvedCount = foundingSuppliers.filter(s => s.status === "approved").length
  const pendingCount = foundingSuppliers.filter(s => s.status === "pending").length
  const spotsRemaining = program.maxSpots - program.usedSpots
  const percentUsed = (program.usedSpots / program.maxSpots) * 100

  const filteredSuppliers = foundingSuppliers.filter(s => {
    if (supplierFilter === "all") return true
    return s.status === supplierFilter
  })

  const handleSaveEdit = () => {
    setProgram(editForm)
    setShowEditDialog(false)
  }

  const handleToggleActive = () => {
    setProgram({ ...program, isActive: !program.isActive })
  }

  const handleResetCounter = () => {
    setProgram({ ...program, usedSpots: 0 })
    setShowResetDialog(false)
  }

  const planOptions = [
    { value: "starter", label: "Starter Plan", price: "$149/mo" },
    { value: "growth", label: "Growth Plan", price: "$299/mo" },
    { value: "enterprise", label: "Enterprise Plan", price: "Custom" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promotional Offers</h1>
          <p className="text-muted-foreground">Manage special offers and founding programs</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spots</p>
                <p className="text-2xl font-bold text-foreground">{program.maxSpots}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-foreground">{program.usedSpots}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <CheckCircle className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Spots Remaining</p>
                <p className="text-2xl font-bold text-foreground">{spotsRemaining}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Founding Manufacturer Program Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                <Sparkles className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {program.name}
                  {program.isActive ? (
                    <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </CardTitle>
                <CardDescription>{program.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-4">
                <Label htmlFor="active-toggle" className="text-sm text-muted-foreground">Active</Label>
                <Switch
                  id="active-toggle"
                  checked={program.isActive}
                  onCheckedChange={handleToggleActive}
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                setEditForm(program)
                setShowEditDialog(true)
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowResetDialog(true)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Counter
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Program Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Program Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan Type:</span>
                  <span className="font-medium text-foreground capitalize">{program.planType} Plan</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">{program.duration} months free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Spots:</span>
                  <span className="font-medium text-foreground">{program.maxSpots}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium text-foreground">{program.createdAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium text-foreground">{program.expiresAt || "No expiration"}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Enrollment Progress</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spots Used (Approved Only):</span>
                  <span className="font-medium text-foreground">{program.usedSpots} / {program.maxSpots}</span>
                </div>
                <div className="h-3 rounded-full bg-secondary/20">
                  <div 
                    className="h-full rounded-full bg-secondary transition-all" 
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {percentUsed.toFixed(1)}% filled • {spotsRemaining} spots remaining
                </p>
                {spotsRemaining < 50 && (
                  <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 p-2 text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Running low on spots! Consider adjusting the limit.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Display Settings Preview */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Display Settings</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground">Badge Text</Label>
                <p className="text-sm font-medium text-foreground">{program.badgeText}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">CTA Button Text</Label>
                <p className="text-sm font-medium text-foreground">{program.ctaText}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs text-muted-foreground">Highlight Text</Label>
                <p className="text-sm text-foreground">{program.highlightText}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Suppliers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Enrolled Suppliers
              </CardTitle>
              <CardDescription>Manufacturers who joined under this program</CardDescription>
            </div>
            <Select value={supplierFilter} onValueChange={(v) => setSupplierFilter(v as typeof supplierFilter)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({foundingSuppliers.length})</SelectItem>
                <SelectItem value="approved">Approved ({approvedCount})</SelectItem>
                <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trial Ends</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{supplier.name}</p>
                      <p className="text-xs text-muted-foreground">{supplier.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{supplier.country}</TableCell>
                  <TableCell className="text-muted-foreground">{supplier.joinedAt}</TableCell>
                  <TableCell>
                    {supplier.status === "approved" ? (
                      <Badge className="bg-secondary/20 text-secondary">Approved</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier.trialEndsAt || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Founding Program</DialogTitle>
            <DialogDescription>
              Update the program settings and display content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planType">Plan Type</Label>
                <Select value={editForm.planType} onValueChange={(v) => setEditForm({ ...editForm, planType: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {planOptions.map((plan) => (
                      <SelectItem key={plan.value} value={plan.value}>
                        {plan.label} ({plan.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (months)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="24"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxSpots">Max Spots</Label>
                <Input
                  id="maxSpots"
                  type="number"
                  min="1"
                  value={editForm.maxSpots}
                  onChange={(e) => setEditForm({ ...editForm, maxSpots: parseInt(e.target.value) || 1 })}
                />
                <p className="text-xs text-muted-foreground">
                  Currently {editForm.usedSpots} spots used
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Display Settings</h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="badgeText">Badge Text</Label>
                  <Input
                    id="badgeText"
                    value={editForm.badgeText}
                    onChange={(e) => setEditForm({ ...editForm, badgeText: e.target.value })}
                    placeholder="e.g., First 300 Only"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaText">CTA Button Text</Label>
                  <Input
                    id="ctaText"
                    value={editForm.ctaText}
                    onChange={(e) => setEditForm({ ...editForm, ctaText: e.target.value })}
                    placeholder="e.g., Apply as Founding Member"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlightText">Highlight Text</Label>
                <Textarea
                  id="highlightText"
                  value={editForm.highlightText}
                  onChange={(e) => setEditForm({ ...editForm, highlightText: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the Founding Manufacturer program? This action cannot be undone. Existing enrolled suppliers will keep their trial period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(false)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Counter Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Counter</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset the spots counter to 0? This will not affect existing enrolled suppliers, but will show the full capacity as available on the pricing page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetCounter}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to 0
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
