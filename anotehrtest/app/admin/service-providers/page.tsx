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
import { Separator } from "@/components/ui/separator"
import { serviceProviders, serviceCategories, getAvailabilityLabel } from "@/lib/data/service-providers"
import {
  Search,
  Briefcase,
  MoreVertical,
  CheckCircle,
  X,
  Eye,
  Star,
  MapPin,
  Ban,
  Trash2,
  RefreshCw,
  Globe,
  Power,
  ShieldCheck,
} from "lucide-react"

type SPStatus = "under_review" | "approved" | "active" | "inactive" | "rejected"

interface AdminProvider {
  id: string
  name: string
  slug: string
  category: string
  categorySlug: string
  location: string
  rating: number
  reviewCount: number
  availability: string
  packageTier: string
  reviewed: boolean
  status: SPStatus
  servicesOffered: string[]
  description: string
  submittedAt: string
}

const statusConfig: Record<SPStatus, { label: string; color: string }> = {
  under_review: { label: "Under Review", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-700" },
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700" },
  inactive: { label: "Inactive", color: "bg-slate-100 text-slate-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
}

// Build admin rows from the shared provider data, plus a couple of pending applicants
const baseProviders: AdminProvider[] = serviceProviders.map((p, i) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.categoryName,
  categorySlug: p.categorySlug,
  location: `${p.location.city}, ${p.location.country}`,
  rating: p.rating,
  reviewCount: p.reviewCount,
  availability: getAvailabilityLabel(p.availability),
  packageTier: p.packageTier,
  reviewed: p.reviewed,
  status: "active",
  servicesOffered: p.servicesOffered,
  description: p.description,
  submittedAt: `2026-0${(i % 5) + 1}-1${i}`,
}))

const pendingApplicants: AdminProvider[] = [
  {
    id: "sp-pending-1",
    name: "Apex Trade Compliance",
    slug: "apex-trade-compliance",
    category: "Compliance & Standards",
    categorySlug: "compliance-standards",
    location: "Hamburg, Germany",
    rating: 0,
    reviewCount: 0,
    availability: "Remote Service",
    packageTier: "standard",
    reviewed: false,
    status: "under_review",
    servicesOffered: ["CE marking", "RoHS testing", "Technical documentation"],
    description:
      "Newly applied compliance consultancy specializing in EU product certification for electronics importers.",
    submittedAt: "2026-05-29",
  },
  {
    id: "sp-pending-2",
    name: "Lumen Product Studio",
    slug: "lumen-product-studio",
    category: "Product Content & Marketing",
    categorySlug: "content-marketing",
    location: "Austin, USA",
    rating: 0,
    reviewCount: 0,
    availability: "Local + Remote",
    packageTier: "basic",
    reviewed: false,
    status: "under_review",
    servicesOffered: ["Product photography", "Amazon listings", "Lifestyle imagery"],
    description: "Content studio applying to offer e-commerce photography and listing optimization services.",
    submittedAt: "2026-05-30",
  },
]

const initialProviders: AdminProvider[] = [...pendingApplicants, ...baseProviders]

export default function AdminServiceProvidersPage() {
  const [providers, setProviders] = useState<AdminProvider[]>(initialProviders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selected, setSelected] = useState<string[]>([])
  const [showReview, setShowReview] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [current, setCurrent] = useState<AdminProvider | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const filtered = providers.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (statusFilter !== "all" && p.status !== statusFilter) return false
    if (categoryFilter !== "all" && p.categorySlug !== categoryFilter) return false
    return true
  })

  const pendingCount = providers.filter((p) => p.status === "under_review").length
  const allSelected = filtered.length > 0 && selected.length === filtered.length

  const toggleSelectAll = () => setSelected(allSelected ? [] : filtered.map((p) => p.id))
  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const updateStatus = (id: string, status: SPStatus) =>
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))

  const bulkUpdate = (status: SPStatus) => {
    setProviders((prev) => prev.map((p) => (selected.includes(p.id) ? { ...p, status } : p)))
    setSelected([])
  }

  const remove = (id: string) => setProviders((prev) => prev.filter((p) => p.id !== id))
  const bulkDelete = () => {
    setProviders((prev) => prev.filter((p) => !selected.includes(p.id)))
    setSelected([])
  }

  const toggleReviewed = (id: string) =>
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, reviewed: !p.reviewed } : p)))

  const openReview = (p: AdminProvider) => {
    setCurrent(p)
    setShowReview(true)
  }
  const openReject = (p: AdminProvider) => {
    setCurrent(p)
    setRejectReason("")
    setShowReject(true)
  }
  const submitReject = () => {
    if (current) updateStatus(current.id, "rejected")
    setShowReject(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Service Providers</h1>
        <p className="mt-1 text-muted-foreground">
          Approve applications and manage listed service providers
          {pendingCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700">
              {pendingCount} under review
            </Badge>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {serviceCategories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
          <span className="text-sm font-medium">{selected.length} selected</span>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => bulkUpdate("active")}>
              <CheckCircle className="mr-1 h-3 w-3" />
              Approve & Activate
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkUpdate("inactive")}>
              <Power className="mr-1 h-3 w-3" />
              Deactivate
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkUpdate("rejected")}>
              <X className="mr-1 h-3 w-3" />
              Reject
            </Button>
            <Button size="sm" variant="destructive" onClick={bulkDelete}>
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
            Clear
          </Button>
        </div>
      )}

      {/* List */}
      <div className="grid gap-4">
        <div className="hidden items-center gap-4 px-4 py-2 text-sm font-medium text-muted-foreground lg:flex">
          <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
          <div className="flex-1">Provider</div>
          <div className="w-32">Status</div>
          <div className="w-24">Rating</div>
          <div className="w-28">Plan</div>
          <div className="w-20">Actions</div>
        </div>

        {filtered.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
              <div className="flex flex-1 items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Briefcase className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    {p.reviewed && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        Reviewed
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{p.category}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {p.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {p.availability}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-32 flex-shrink-0">
                <Badge className={statusConfig[p.status].color}>{statusConfig[p.status].label}</Badge>
              </div>

              <div className="w-24 flex-shrink-0">
                {p.rating > 0 ? (
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {p.rating}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>

              <div className="w-28 flex-shrink-0 text-sm capitalize">{p.packageTier}</div>

              <div className="flex w-20 flex-shrink-0 items-center gap-2">
                {p.status === "under_review" && (
                  <Button size="sm" variant="outline" onClick={() => openReview(p)}>
                    <Eye className="mr-1 h-3 w-3" />
                    Review
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openReview(p)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleReviewed(p.id)}>
                      <ShieldCheck className="mr-2 h-4 w-4 text-blue-600" />
                      {p.reviewed ? "Remove Reviewed badge" : "Mark as Reviewed"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {p.status !== "active" && (
                      <DropdownMenuItem onClick={() => updateStatus(p.id, "active")}>
                        <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                        Approve & Activate
                      </DropdownMenuItem>
                    )}
                    {p.status === "active" ? (
                      <DropdownMenuItem onClick={() => updateStatus(p.id, "inactive")}>
                        <Power className="mr-2 h-4 w-4 text-orange-600" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      p.status === "inactive" && (
                        <DropdownMenuItem onClick={() => updateStatus(p.id, "active")}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reactivate
                        </DropdownMenuItem>
                      )
                    )}
                    {p.status !== "rejected" && (
                      <DropdownMenuItem onClick={() => openReject(p)}>
                        <X className="mr-2 h-4 w-4 text-red-600" />
                        Reject
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => remove(p.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No service providers found</p>
          </div>
        )}
      </div>

      {/* Review dialog */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Service Provider Review</DialogTitle>
            <DialogDescription>Review the application details before approving.</DialogDescription>
          </DialogHeader>
          {current && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{current.name}</h3>
                  <p className="text-sm text-muted-foreground">{current.category}</p>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {current.location}
                    </span>
                    <Badge className={statusConfig[current.status].color}>
                      {statusConfig[current.status].label}
                    </Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">About</Label>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{current.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Services offered</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {current.servicesOffered.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Availability</Label>
                  <p className="mt-1 text-foreground">{current.availability}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Selected plan</Label>
                  <p className="mt-1 capitalize text-foreground">{current.packageTier}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submitted</Label>
                  <p className="mt-1 text-foreground">{current.submittedAt}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (current) openReject(current)
                setShowReview(false)
              }}
            >
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => {
                if (current) updateStatus(current.id, "active")
                setShowReview(false)
              }}
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Approve & Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>Let the provider know why their application was rejected.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain what's missing or why the application doesn't qualify..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReject(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitReject}>
              <Ban className="mr-1 h-4 w-4" />
              Reject Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
