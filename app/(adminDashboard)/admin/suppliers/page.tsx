"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { fetchSuppliers, deleteManufacturer } from "@/lib/api/admin-manufacturer-registrations"
import type { ManufacturerApplication, ManufacturerRegistrationResponse } from "@/lib/api/admin-manufacturer-registrations"
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
  Building2,
  Loader2
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

type SupplierStatus = "draft" | "pending" | "approved" | "rejected" | "suspended" | "needs_info" | "active" | "deactivated"

interface VerificationDocuments {
  businessLicense?: { name: string; uploadedAt: string }
  website?: string
  city: string
  country: string
  factoryPhotos?: { name: string }[]
  additionalNotes?: string
}

interface Supplier extends ManufacturerApplication {
  verification?: string
  submittedAt?: string
  verificationDocs?: VerificationDocuments
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; color: string }> = {
  draft: { label: "Draft", variant: "outline", color: "bg-slate-100 text-slate-700" },
  pending: { label: "Pending Approval", variant: "secondary", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", variant: "default", color: "bg-emerald-100 text-emerald-700" },
  active: { label: "Active", variant: "default", color: "bg-emerald-100 text-emerald-700" },
  deactivated: { label: "Deactivated", variant: "outline", color: "bg-slate-100 text-slate-700" },
  rejected: { label: "Rejected", variant: "destructive", color: "bg-red-100 text-red-700" },
  suspended: { label: "Suspended", variant: "destructive", color: "bg-orange-100 text-orange-700" },
  needs_info: { label: "Needs More Info", variant: "outline", color: "bg-blue-100 text-blue-700" },
}

const PER_PAGE = 10

export default function AdminSuppliersPage() {
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSuppliers, setSelectedSuppliers] = useState<(string | number)[]>([])
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null)
  const [infoRequest, setInfoRequest] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<(string | number) | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Load suppliers from API
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setLoading(true)
        const response = await fetchSuppliers(currentPage, PER_PAGE)
        // Filter out pending status
        const filtered = response.data.filter(row => row.status !== "pending")
        setSuppliers(filtered)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load suppliers",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadSuppliers()
  }, [currentPage, toast])

  const filteredSuppliers = suppliers.filter(supplier => {
    const name = [supplier.first_name, supplier.last_name].filter(Boolean).join(" ").toLowerCase()
    const company = (supplier.company_name || supplier.company?.company_name || "").toLowerCase()
    
    if (searchQuery && !name.includes(searchQuery.toLowerCase()) && !company.includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter !== "all" && supplier.status !== statusFilter) return false
    return true
  })

  const allSelected = filteredSuppliers.length > 0 && selectedSuppliers.length === filteredSuppliers.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedSuppliers([])
    } else {
      setSelectedSuppliers(filteredSuppliers.map(s => s.id))
    }
  }

  const toggleSelect = (id: string | number) => {
    setSelectedSuppliers(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const deleteSupplier = async (supplierId: string | number) => {
    try {
      setDeleting(supplierId)
      await deleteManufacturer(supplierId)
      setSuppliers(prev => prev.filter(s => s.id !== supplierId))
      setSelectedSuppliers(prev => prev.filter(x => x !== supplierId))
      
      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to delete supplier"
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const bulkDelete = async () => {
    for (const id of selectedSuppliers) {
      await deleteSupplier(id)
    }
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
      // Mark as needs_info (would need API call in real implementation)
      setShowInfoDialog(false)
      toast({
        title: "Success",
        description: "Information request sent",
      })
    }
  }

  const submitRejection = () => {
    if (currentSupplier) {
      // Mark as rejected (would need API call in real implementation)
      setShowRejectDialog(false)
      toast({
        title: "Success",
        description: "Supplier rejected",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Suppliers</h1>
          <p className="mt-1 text-muted-foreground">
            Manage supplier accounts and reviews
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="deactivated">Deactivated</SelectItem>
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
            <Button size="sm" variant="destructive" onClick={bulkDelete} disabled={deleting !== null}>
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setSelectedSuppliers([])}>
            Clear
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading suppliers...</p>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center py-12">
          <Factory className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">No suppliers found</p>
        </div>
      ) : (
        /* Suppliers Grid */
        <div className="grid gap-4">
          {/* Header Row */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
            <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
            <div className="flex-1">Supplier</div>
            <div className="w-32">Status</div>
            <div className="w-24">Rating</div>
            <div className="w-32">Actions</div>
          </div>

          {filteredSuppliers.map((supplier) => {
            const displayName = [supplier.first_name, supplier.last_name].filter(Boolean).join(" ") || "—"
            const displayCompany = supplier.company_name || supplier.company?.company_name || "—"
            const statusKey = supplier.status || "draft"
            const config = statusConfig[statusKey] || statusConfig.draft

            return (
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
                      <h3 className="font-semibold text-foreground">{displayName}</h3>
                      <p className="text-sm text-muted-foreground">{displayCompany}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {supplier.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-32 flex-shrink-0">
                    <Badge className={config.color}>
                      {config.label}
                    </Badge>
                  </div>

                  <div className="w-24 flex-shrink-0 text-sm text-muted-foreground">
                    N/A
                  </div>

                  <div className="flex items-center gap-2 w-32 flex-shrink-0">
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
                        <DropdownMenuItem onClick={() => openInfoRequest(supplier)}>
                          <FileQuestion className="mr-2 h-4 w-4 text-blue-600" />
                          Request More Info
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openReject(supplier)}>
                          <X className="mr-2 h-4 w-4 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Ban className="mr-2 h-4 w-4 text-orange-600" />
                          Suspend
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteSupplier(supplier.id)}
                          disabled={deleting === supplier.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deleting === supplier.id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              View supplier information and documents
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
                  <h3 className="text-lg font-semibold">
                    {[currentSupplier.first_name, currentSupplier.last_name].filter(Boolean).join(" ")}
                  </h3>
                  <p className="text-sm text-muted-foreground">{currentSupplier.company_name || currentSupplier.company?.company_name}</p>
                </div>
                <Badge className={statusConfig[currentSupplier.status || "draft"].color}>
                  {statusConfig[currentSupplier.status || "draft"].label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{currentSupplier.email}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Close
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
              Send a message requesting more information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Message</Label>
              <Textarea 
                placeholder="Please provide more details..."
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
              Provide a reason for rejecting
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
