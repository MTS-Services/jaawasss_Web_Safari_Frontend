"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Search,
  Factory,
  MoreVertical,
  CheckCircle,
  X,
  Eye,
  Star,
  MapPin,
  Ban,
  MessageSquare,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Mail,
  FileQuestion,
  FileText,
  Globe,
  Camera,
  ExternalLink,
  Building2
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

type SupplierStatus = "draft" | "pending" | "approved" | "rejected" | "suspended" | "needs_info"

interface VerificationDocuments {
  businessLicense?: { name: string; uploadedAt: string }
  website?: string
  city: string
  country: string
  factoryPhotos?: { name: string }[]
  additionalNotes?: string
}

interface Supplier {
  id: string
  name: string
  industry: string
  location: string
  rating: number
  status: SupplierStatus
  verification: string
  products: number
  email: string
  submittedAt: string
  verificationDocs?: VerificationDocuments
}

const initialSuppliers: Supplier[] = [
  { id: "1", name: "TechVision Electronics", industry: "Consumer Electronics", location: "Shenzhen, China", rating: 4.9, status: "approved", verification: "premium", products: 234, email: "contact@techvision.com", submittedAt: "2025-12-08", verificationDocs: { businessLicense: { name: "business_license_techvision.pdf", uploadedAt: "2025-12-08" }, website: "https://techvision.com", city: "Shenzhen", country: "China", factoryPhotos: [{ name: "factory_floor.jpg" }, { name: "production_line.jpg" }] } },
  { id: "2", name: "EcoThread Textiles", industry: "Textiles & Apparel", location: "Shanghai, China", rating: 4.7, status: "approved", verification: "standard", products: 156, email: "info@ecothread.com", submittedAt: "2025-11-15", verificationDocs: { businessLicense: { name: "ecothread_registration.pdf", uploadedAt: "2025-11-15" }, website: "https://ecothread.com", city: "Shanghai", country: "China" } },
  { id: "3", name: "GlobalFab Machinery", industry: "Machinery & Equipment", location: "Dongguan, China", rating: 4.8, status: "approved", verification: "premium", products: 89, email: "sales@globalfab.com", submittedAt: "2025-10-20", verificationDocs: { businessLicense: { name: "globalfab_license.pdf", uploadedAt: "2025-10-20" }, website: "https://globalfab.com", city: "Dongguan", country: "China", factoryPhotos: [{ name: "machinery_hall.jpg" }, { name: "warehouse.jpg" }, { name: "office.jpg" }] } },
  { id: "4", name: "NewTech Industries", industry: "Electronics", location: "Hanoi, Vietnam", rating: 0, status: "pending", verification: "none", products: 0, email: "info@newtech.vn", submittedAt: "2026-03-13", verificationDocs: { businessLicense: { name: "newtech_business_cert.pdf", uploadedAt: "2026-03-13" }, website: "https://newtech.vn", city: "Hanoi", country: "Vietnam", factoryPhotos: [{ name: "newtech_factory.jpg" }], additionalNotes: "We are a new electronics manufacturer specializing in IoT devices." } },
  { id: "5", name: "GreenLeaf Organics", industry: "Food & Agriculture", location: "Bangkok, Thailand", rating: 0, status: "pending", verification: "none", products: 0, email: "hello@greenleaf.th", submittedAt: "2026-03-12", verificationDocs: { businessLicense: { name: "greenleaf_registration.pdf", uploadedAt: "2026-03-12" }, city: "Bangkok", country: "Thailand", additionalNotes: "Organic food producer with FDA certification pending." } },
  { id: "6", name: "MetalWorks Pro", industry: "Industrial Parts", location: "Guangzhou, China", rating: 0, status: "needs_info", verification: "basic", products: 12, email: "contact@metalworks.cn", submittedAt: "2026-03-10", verificationDocs: { businessLicense: { name: "metalworks_license.jpg", uploadedAt: "2026-03-10" }, city: "Guangzhou", country: "China" } },
  { id: "7", name: "QuickPack Solutions", industry: "Packaging", location: "Ho Chi Minh, Vietnam", rating: 0, status: "pending", verification: "none", products: 0, email: "sales@quickpack.vn", submittedAt: "2026-03-11", verificationDocs: { businessLicense: { name: "quickpack_certificate.pdf", uploadedAt: "2026-03-11" }, website: "https://quickpack.vn", city: "Ho Chi Minh City", country: "Vietnam", factoryPhotos: [{ name: "packaging_line.jpg" }, { name: "warehouse.jpg" }] } },
  { id: "8", name: "BrightLED Co.", industry: "Lighting", location: "Ningbo, China", rating: 0, status: "rejected", verification: "none", products: 0, email: "info@brightled.cn", submittedAt: "2026-03-05" },
  { id: "9", name: "Suspended Corp", industry: "Electronics", location: "Delhi, India", rating: 3.2, status: "suspended", verification: "standard", products: 45, email: "contact@suspended.in", submittedAt: "2025-08-15", verificationDocs: { businessLicense: { name: "suspended_corp_license.pdf", uploadedAt: "2025-08-15" }, city: "Delhi", country: "India" } },
  { id: "10", name: "Draft Factory", industry: "Textiles", location: "Dhaka, Bangladesh", rating: 0, status: "draft", verification: "none", products: 0, email: "draft@factory.bd", submittedAt: "2026-03-14" },
]

const statusConfig: Record<SupplierStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; color: string }> = {
  draft: { label: "Draft", variant: "outline", color: "bg-slate-100 text-slate-700" },
  pending: { label: "Pending Approval", variant: "secondary", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", variant: "default", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", variant: "destructive", color: "bg-red-100 text-red-700" },
  suspended: { label: "Suspended", variant: "destructive", color: "bg-orange-100 text-orange-700" },
  needs_info: { label: "Needs More Info", variant: "outline", color: "bg-blue-100 text-blue-700" },
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null)
  const [infoRequest, setInfoRequest] = useState("")
  const [rejectReason, setRejectReason] = useState("")

  const filteredSuppliers = suppliers.filter(supplier => {
    if (searchQuery && !supplier.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter !== "all" && supplier.status !== statusFilter) return false
    return true
  })

  const pendingCount = suppliers.filter(s => s.status === "pending").length
  const allSelected = filteredSuppliers.length > 0 && selectedSuppliers.length === filteredSuppliers.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedSuppliers([])
    } else {
      setSelectedSuppliers(filteredSuppliers.map(s => s.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const updateSupplierStatus = (id: string, status: SupplierStatus) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const bulkUpdateStatus = (status: SupplierStatus) => {
    setSuppliers(prev => prev.map(s => 
      selectedSuppliers.includes(s.id) ? { ...s, status } : s
    ))
    setSelectedSuppliers([])
  }

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id))
  }

  const bulkDelete = () => {
    setSuppliers(prev => prev.filter(s => !selectedSuppliers.includes(s.id)))
    setSelectedSuppliers([])
  }

  const openReview = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setShowReviewDialog(true)
  }

  const openInfoRequest = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setInfoRequest("")
    setShowInfoDialog(true)
  }

  const openReject = (supplier: Supplier) => {
    setCurrentSupplier(supplier)
    setRejectReason("")
    setShowRejectDialog(true)
  }

  const submitInfoRequest = () => {
    if (currentSupplier) {
      updateSupplierStatus(currentSupplier.id, "needs_info")
      setShowInfoDialog(false)
    }
  }

  const submitRejection = () => {
    if (currentSupplier) {
      updateSupplierStatus(currentSupplier.id, "rejected")
      setShowRejectDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Suppliers</h1>
          <p className="mt-1 text-muted-foreground">
            Manage supplier accounts and reviews
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700">{pendingCount} pending</Badge>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="needs_info">Needs More Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedSuppliers.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
          <span className="text-sm font-medium">{selectedSuppliers.length} selected</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => bulkUpdateStatus("approved")}>
              <CheckCircle className="mr-1 h-3 w-3" />
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("rejected")}>
              <X className="mr-1 h-3 w-3" />
              Reject
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("suspended")}>
              <Ban className="mr-1 h-3 w-3" />
              Suspend
            </Button>
            <Button size="sm" variant="destructive" onClick={bulkDelete}>
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setSelectedSuppliers([])}>
            Clear
          </Button>
        </div>
      )}

      {/* Suppliers Grid */}
      <div className="grid gap-4">
        {/* Header Row */}
        <div className="hidden lg:flex items-center gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
          <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
          <div className="flex-1">Supplier</div>
          <div className="w-32">Status</div>
          <div className="w-24">Rating</div>
          <div className="w-24">Products</div>
          <div className="w-32">Actions</div>
        </div>

        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <Checkbox 
                checked={selectedSuppliers.includes(supplier.id)} 
                onCheckedChange={() => toggleSelect(supplier.id)}
              />
              <div className="flex items-start gap-4 flex-1">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Factory className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{supplier.name}</h3>
                    {supplier.verification !== "none" && (
                      <Badge 
                        className={supplier.verification === "premium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}
                      >
                        {supplier.verification.charAt(0).toUpperCase() + supplier.verification.slice(1)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{supplier.industry}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {supplier.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {supplier.email}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="w-32 flex-shrink-0">
                <Badge className={statusConfig[supplier.status].color}>
                  {statusConfig[supplier.status].label}
                </Badge>
              </div>

              <div className="w-24 flex-shrink-0">
                {supplier.rating > 0 ? (
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {supplier.rating}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>

              <div className="w-24 flex-shrink-0 text-sm">
                {supplier.products} products
              </div>

              <div className="flex items-center gap-2 w-32 flex-shrink-0">
                {supplier.status === "pending" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => openReview(supplier)}>
                      <Eye className="mr-1 h-3 w-3" />
                      Review
                    </Button>
                  </>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openReview(supplier)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {supplier.status !== "approved" && (
                      <DropdownMenuItem onClick={() => updateSupplierStatus(supplier.id, "approved")}>
                        <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                        Approve
                      </DropdownMenuItem>
                    )}
                    {supplier.status !== "needs_info" && (
                      <DropdownMenuItem onClick={() => openInfoRequest(supplier)}>
                        <FileQuestion className="mr-2 h-4 w-4 text-blue-600" />
                        Request More Info
                      </DropdownMenuItem>
                    )}
                    {supplier.status !== "rejected" && (
                      <DropdownMenuItem onClick={() => openReject(supplier)}>
                        <X className="mr-2 h-4 w-4 text-red-600" />
                        Reject
                      </DropdownMenuItem>
                    )}
                    {supplier.status === "suspended" ? (
                      <DropdownMenuItem onClick={() => updateSupplierStatus(supplier.id, "approved")}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => updateSupplierStatus(supplier.id, "suspended")}>
                        <Ban className="mr-2 h-4 w-4 text-orange-600" />
                        Suspend
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => deleteSupplier(supplier.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <Factory className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No suppliers found</p>
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Supplier Review</DialogTitle>
            <DialogDescription>
              Review supplier details and submitted documents
            </DialogDescription>
          </DialogHeader>
          {currentSupplier && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                  <Factory className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{currentSupplier.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentSupplier.industry}</p>
                  <p className="text-sm text-muted-foreground">{currentSupplier.location}</p>
                </div>
                <Badge className={statusConfig[currentSupplier.status].color}>
                  {statusConfig[currentSupplier.status].label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{currentSupplier.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Submitted:</span>
                  <p className="font-medium">{currentSupplier.submittedAt}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Products:</span>
                  <p className="font-medium">{currentSupplier.products}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Rating:</span>
                  <p className="font-medium">{currentSupplier.rating > 0 ? currentSupplier.rating : "N/A"}</p>
                </div>
              </div>

              {/* Submitted Documents Section */}
              {currentSupplier.verificationDocs && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-secondary" />
Submitted Documents
                    </h4>
                    
                    <div className="space-y-4">
                      {/* Business License */}
                      {currentSupplier.verificationDocs.businessLicense && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                                <FileText className="h-5 w-5 text-secondary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">Business License</p>
                                <p className="text-sm text-muted-foreground">{currentSupplier.verificationDocs.businessLicense.name}</p>
                                <p className="text-xs text-muted-foreground">Uploaded: {currentSupplier.verificationDocs.businessLicense.uploadedAt}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-3 w-3" />
                              View
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Company Address */}
                      <div className="rounded-lg border border-border bg-muted/30 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                            <Building2 className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Company Address</p>
                            <p className="text-sm text-muted-foreground">
                              {currentSupplier.verificationDocs.city}, {currentSupplier.verificationDocs.country}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Website */}
                      {currentSupplier.verificationDocs.website && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                                <Globe className="h-5 w-5 text-secondary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">Company Website</p>
                                <p className="text-sm text-muted-foreground">{currentSupplier.verificationDocs.website}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={currentSupplier.verificationDocs.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-3 w-3" />
                                Visit
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Factory Photos */}
                      {currentSupplier.verificationDocs.factoryPhotos && currentSupplier.verificationDocs.factoryPhotos.length > 0 && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                              <Camera className="h-5 w-5 text-secondary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">Factory Photos</p>
                              <p className="text-sm text-muted-foreground mb-3">
                                {currentSupplier.verificationDocs.factoryPhotos.length} photo(s) uploaded
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {currentSupplier.verificationDocs.factoryPhotos.map((photo, idx) => (
                                  <div key={idx} className="flex items-center gap-2 rounded-md bg-background px-3 py-1.5 text-sm">
                                    <Camera className="h-3 w-3 text-muted-foreground" />
                                    {photo.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Notes */}
                      {currentSupplier.verificationDocs.additionalNotes && (
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <p className="font-medium text-foreground mb-2">Additional Notes</p>
                          <p className="text-sm text-muted-foreground">
                            {currentSupplier.verificationDocs.additionalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {!currentSupplier.verificationDocs && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">No Documents Submitted</p>
                      <p className="text-sm text-amber-700">This supplier has not submitted any documents yet.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => {
              if (currentSupplier) openInfoRequest(currentSupplier)
              setShowReviewDialog(false)
            }}>
              <FileQuestion className="mr-2 h-4 w-4" />
              Request Info
            </Button>
            <Button variant="outline" onClick={() => {
              if (currentSupplier) openReject(currentSupplier)
              setShowReviewDialog(false)
            }}>
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={() => {
              if (currentSupplier) updateSupplierStatus(currentSupplier.id, "approved")
              setShowReviewDialog(false)
            }}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Additional Information</DialogTitle>
            <DialogDescription>
              Send a message to {currentSupplier?.name} requesting more information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Message</Label>
              <Textarea 
                placeholder="Please provide more details about your certifications and factory capacity..."
                value={infoRequest}
                onChange={(e) => setInfoRequest(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInfoDialog(false)}>Cancel</Button>
            <Button onClick={submitInfoRequest}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Reject Supplier
            </DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {currentSupplier?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason for Rejection</Label>
              <Textarea 
                placeholder="The application was rejected because..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-2 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={submitRejection}>Reject Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
