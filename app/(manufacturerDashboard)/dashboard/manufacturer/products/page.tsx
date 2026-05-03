"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  Package,
  Eye,
  Edit,
  MoreVertical,
  TrendingUp,
  Copy,
  Trash2,
  Power,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  getManufacturerProducts,
  getManufacturerProductStats,
  getManufacturerProductBySlug,
  updateManufacturerProduct,
  deleteManufacturerProduct,
  changeManufacturerProductStatus,
  duplicateManufacturerProductToDraft,
  buildManufacturerProductUpdateFormData,
} from "@/lib/api/manufacturer-products"
import type {
  ManufacturerProductListItem,
  ManufacturerProductDetail,
  ManufacturerProductMeta,
  ManufacturerProductStats,
  ManufacturerProductStatus,
} from "@/lib/api/manufacturer-products"

function statusLabel(status: ManufacturerProductStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function badgeClass(status: ManufacturerProductStatus): string {
  if (status === "active") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
  }
  if (status === "inactive") {
    return "bg-muted text-muted-foreground"
  }
  return ""
}

function listItemFromDetail(d: ManufacturerProductDetail): ManufacturerProductListItem {
  const first = d.images?.[0]
  const thumb =
    (first?.url || first?.file_path || first?.path || "").trim() || null
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    description: d.description,
    status: d.status,
    categoryLabel: d.categoryLabel,
    priceDisplay: d.priceDisplay,
    moqDisplay: d.moqDisplay,
    viewCount: d.viewCount,
    inquiryCount: d.inquiryCount,
    thumbnailUrl: thumb,
  }
}

export default function ManufacturerProductsPage() {
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ManufacturerProductStatus>("all")
  const [page, setPage] = useState(1)

  const [productsList, setProductsList] = useState<ManufacturerProductListItem[]>([])
  const [meta, setMeta] = useState<ManufacturerProductMeta | null>(null)
  const [stats, setStats] = useState<ManufacturerProductStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingRow, setEditingRow] = useState<ManufacturerProductListItem | null>(null)
  const [editDetail, setEditDetail] = useState<ManufacturerProductDetail | null>(null)
  const [editDetailLoading, setEditDetailLoading] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)

  const [viewDetail, setViewDetail] = useState<ManufacturerProductDetail | null>(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)

  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)
  const [rowActionIds, setRowActionIds] = useState<Set<number>>(new Set())

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    minPrice: "",
    maxPrice: "",
    minimumOrderQuantity: "",
    unit: "",
    leadTime: "",
    status: "draft" as ManufacturerProductStatus,
  })

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 400)
    return () => window.clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [listRes, statsRes] = await Promise.all([
      getManufacturerProducts({
        page,
        per_page: 10,
        search: debouncedSearch || undefined,
        status: statusFilter,
      }),
      getManufacturerProductStats(),
    ])

    if (!listRes.success) {
      setError(listRes.message ?? "Failed to load products.")
      setProductsList([])
      setMeta(null)
    } else {
      setError(null)
      setProductsList(listRes.data)
      setMeta(listRes.meta)
    }

    if (statsRes.success) {
      setStats(statsRes.data)
    }
    setLoading(false)
  }, [page, debouncedSearch, statusFilter])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const markRowBusy = (id: number, busy: boolean) => {
    setRowActionIds((prev) => {
      const next = new Set(prev)
      if (busy) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  const openEditDialog = async (
    product: ManufacturerProductListItem,
    prefetched?: ManufacturerProductDetail | null
  ) => {
    setEditingRow(product)
    setShowEditDialog(true)
    if (prefetched) {
      setEditDetail(prefetched)
      setEditDetailLoading(false)
      setEditFormData({
        name: prefetched.name,
        description: prefetched.description,
        minPrice: prefetched.minPrice,
        maxPrice: prefetched.maxPrice,
        minimumOrderQuantity: prefetched.minimumOrderQuantity,
        unit: prefetched.unit,
        leadTime: prefetched.leadTime,
        status: prefetched.status,
      })
      return
    }
    setEditDetail(null)
    setEditDetailLoading(true)
    const res = await getManufacturerProductBySlug(product.slug)
    setEditDetailLoading(false)
    if (!res.success || !res.data) {
      toast.error(res.message ?? "Could not load product for editing.")
      setShowEditDialog(false)
      setEditingRow(null)
      return
    }
    const d = res.data
    setEditDetail(d)
    setEditFormData({
      name: d.name,
      description: d.description,
      minPrice: d.minPrice,
      maxPrice: d.maxPrice,
      minimumOrderQuantity: d.minimumOrderQuantity,
      unit: d.unit,
      leadTime: d.leadTime,
      status: d.status,
    })
  }

  const saveProductChanges = async () => {
    if (!editingRow || !editDetail) {
      return
    }
    setSavingEdit(true)
    const fd = buildManufacturerProductUpdateFormData({
      name: editFormData.name,
      description: editFormData.description,
      status: editFormData.status,
      categoryId: editDetail.categoryId,
      subCategoryId: editDetail.subCategoryId,
      currencyId: editDetail.currencyId,
      minPrice: editFormData.minPrice,
      maxPrice: editFormData.maxPrice,
      minimumOrderQuantity: editFormData.minimumOrderQuantity,
      unit: editFormData.unit,
      leadTime: editFormData.leadTime,
    })
    const res = await updateManufacturerProduct(editingRow.id, fd)
    setSavingEdit(false)
    if (!res.success) {
      toast.error(res.message ?? "Update failed.")
      return
    }
    toast.success(res.message ?? "Product updated.")
    setShowEditDialog(false)
    setEditingRow(null)
    setEditDetail(null)
    void refresh()
  }

  const duplicateProduct = async (product: ManufacturerProductListItem) => {
    markRowBusy(product.id, true)
    const res = await duplicateManufacturerProductToDraft(product.id)
    markRowBusy(product.id, false)
    if (!res.success) {
      toast.error(res.message ?? "Duplicate failed.")
      return
    }
    toast.success(res.message ?? "Product duplicated as draft.")
    void refresh()
  }

  const setProductStatus = async (productId: number, status: ManufacturerProductStatus) => {
    markRowBusy(productId, true)
    const res = await changeManufacturerProductStatus(productId, status)
    markRowBusy(productId, false)
    if (!res.success) {
      toast.error(res.message ?? "Status change failed.")
      return
    }
    toast.success(res.message ?? "Status updated.")
    void refresh()
  }

  const confirmDeleteProduct = async () => {
    if (deletingProductId == null) {
      return
    }
    const id = deletingProductId
    markRowBusy(id, true)
    const res = await deleteManufacturerProduct(id)
    markRowBusy(id, false)
    setDeletingProductId(null)
    if (!res.success) {
      toast.error(res.message ?? "Delete failed.")
      return
    }
    toast.success(res.message ?? "Product deleted.")
    void refresh()
  }

  const openViewDialog = async (product: ManufacturerProductListItem) => {
    setShowViewDialog(true)
    setViewDetail(null)
    setViewLoading(true)
    const res = await getManufacturerProductBySlug(product.slug)
    setViewLoading(false)
    if (!res.success || !res.data) {
      toast.error(res.message ?? "Could not load product.")
      setShowViewDialog(false)
      return
    }
    setViewDetail(res.data)
  }

  const lastPage = meta?.lastPage ?? 1
  const total = meta?.total ?? productsList.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Products</h1>
          <p className="mt-1 text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/dashboard/manufacturer/products/new">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-foreground">
            {loading && !stats ? "—" : stats?.total ?? total}
          </div>
          <p className="text-sm text-muted-foreground">Total Products</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-emerald-600">
            {loading && !stats ? "—" : stats?.active ?? "—"}
          </div>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-foreground">
            {loading && !stats ? "—" : stats?.totalViews?.toLocaleString() ?? "—"}
          </div>
          <p className="text-sm text-muted-foreground">Total Views</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-foreground">
            {loading && !stats ? "—" : stats?.totalInquiries ?? "—"}
          </div>
          <p className="text-sm text-muted-foreground">Total Inquiries</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading && productsList.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading products…
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left text-sm">
                    <th className="px-5 py-3 font-medium text-muted-foreground">Product</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Price</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">MOQ</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Views</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Inquiries</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {productsList.map((product) => {
                    const busy = rowActionIds.has(product.id)
                    return (
                      <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                              {/* {product.thumbnailUrl ? (
                                <Image
                                  src={product.thumbnailUrl}
                                  alt=""
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <Package className="h-6 w-6 text-muted-foreground/50" />
                              )} */}
                              <Package className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{product.name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {product.categoryLabel}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-foreground whitespace-nowrap">
                          {product.priceDisplay}
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                          {product.moqDisplay}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            {product.viewCount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            {product.inquiryCount}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            variant={product.status === "active" ? "default" : "secondary"}
                            className={badgeClass(product.status)}
                          >
                            {statusLabel(product.status)}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {busy ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  asChild
                                >
                                  <Link href={`/dashboard/manufacturer/products/${product.slug}/edit`}>
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {/* <DropdownMenuItem asChild>
                                      <Link href={`/dashboard/manufacturer/products/${product.slug}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </Link>
                                    </DropdownMenuItem> */}
                                    <DropdownMenuItem onClick={() => void openViewDialog(product)}>
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      View details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => void duplicateProduct(product)}>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicate to draft
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {product.status !== "draft" && (
                                      <DropdownMenuItem
                                        onClick={() => void setProductStatus(product.id, "draft")}
                                      >
                                        <Power className="mr-2 h-4 w-4" />
                                        Set draft
                                      </DropdownMenuItem>
                                    )}
                                    {product.status !== "active" && (
                                      <DropdownMenuItem
                                        onClick={() => void setProductStatus(product.id, "active")}
                                      >
                                        <Power className="mr-2 h-4 w-4" />
                                        Set active
                                      </DropdownMenuItem>
                                    )}
                                    {product.status !== "inactive" && (
                                      <DropdownMenuItem
                                        onClick={() => void setProductStatus(product.id, "inactive")}
                                      >
                                        <Power className="mr-2 h-4 w-4" />
                                        Set inactive
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => setDeletingProductId(product.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-border">
              {productsList.map((product) => {
                const busy = rowActionIds.has(product.id)
                return (
                  <div key={product.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                        {/* {product.thumbnailUrl ? (
                          <Image
                            src={product.thumbnailUrl}
                            alt=""
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground/50" />
                        )} */}
                        <Package className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {product.categoryLabel}
                            </p>
                          </div>
                          <div className="text-sm text-foreground ml-2 shrink-0">
                            {product.priceDisplay}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                          <div>{product.moqDisplay}</div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{product.viewCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{product.inquiryCount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <Badge
                            variant={product.status === "active" ? "default" : "secondary"}
                            className={badgeClass(product.status)}
                          >
                            {statusLabel(product.status)}
                          </Badge>
                          <div className="flex items-center gap-2">
                            {busy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => void openEditDialog(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => void openViewDialog(product)}>
                                      View details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => void duplicateProduct(product)}>
                                      Duplicate to draft
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => setDeletingProductId(product.id)}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {productsList.length === 0 && !loading && (
              <div className="py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold text-foreground">No products found</h3>
                <p className="mt-2 text-muted-foreground">
                  {debouncedSearch || statusFilter !== "all"
                    ? "Try adjusting filters or search."
                    : "Add your first product to get started."}
                </p>
                {!debouncedSearch && statusFilter === "all" && (
                  <Button className="mt-4 gap-2" asChild>
                    <Link href="/dashboard/manufacturer/products/new">
                      <Plus className="h-4 w-4" />
                      Add Product
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {meta && meta.total > 0 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                  Page {meta.currentPage} of {lastPage}
                  {meta.total ? ` · ${meta.total} total` : ""}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= lastPage || loading}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open)
          if (!open) {
            setEditingRow(null)
            setEditDetail(null)
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>Changes are saved to your live listing.</DialogDescription>
          </DialogHeader>
          {editDetailLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : editDetail ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="mt-2"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-min">Min price</Label>
                  <Input
                    id="edit-min"
                    value={editFormData.minPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, minPrice: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-max">Max price</Label>
                  <Input
                    id="edit-max"
                    value={editFormData.maxPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, maxPrice: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-moq">MOQ</Label>
                  <Input
                    id="edit-moq"
                    value={editFormData.minimumOrderQuantity}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, minimumOrderQuantity: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Input
                    id="edit-unit"
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-lead">Lead time</Label>
                <Input
                  id="edit-lead"
                  value={editFormData.leadTime}
                  onChange={(e) => setEditFormData({ ...editFormData, leadTime: e.target.value })}
                  className="mt-2"
                  placeholder="e.g. 15–20 days"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(v) =>
                    setEditFormData({ ...editFormData, status: v as ManufacturerProductStatus })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                Category: {editDetail.categoryLabel}. To change category, use the full product editor
                when available.
              </p>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => void saveProductChanges()} disabled={savingEdit || !editDetail}>
              {savingEdit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deletingProductId != null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingProductId(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The product will be removed from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void confirmDeleteProduct()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={showViewDialog}
        onOpenChange={(open) => {
          setShowViewDialog(open)
          if (!open) {
            setViewDetail(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product details</DialogTitle>
            <DialogDescription>Information from your listing.</DialogDescription>
          </DialogHeader>
          {viewLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : viewDetail ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                  {viewDetail.images?.[0] &&
                  (viewDetail.images[0].url ||
                    viewDetail.images[0].file_path ||
                    viewDetail.images[0].path) ? (
                    <Image
                      src={
                        (viewDetail.images[0].url ||
                          viewDetail.images[0].file_path ||
                          viewDetail.images[0].path) as string
                      }
                      alt=""
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold break-words">{viewDetail.name}</h3>
                    <Badge
                      variant={viewDetail.status === "active" ? "default" : "secondary"}
                      className={badgeClass(viewDetail.status)}
                    >
                      {statusLabel(viewDetail.status)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{viewDetail.categoryLabel}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold">{viewDetail.priceDisplay}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">MOQ</p>
                  <p className="font-semibold">{viewDetail.moqDisplay}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="font-semibold">{viewDetail.viewCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inquiries</p>
                  <p className="font-semibold">{viewDetail.inquiryCount}</p>
                </div>
              </div>

              {viewDetail.description ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-foreground whitespace-pre-wrap">{viewDetail.description}</p>
                </div>
              ) : null}
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (!viewDetail) {
                  return
                }
                setShowViewDialog(false)
                const row =
                  productsList.find((p) => p.slug === viewDetail.slug) ??
                  listItemFromDetail(viewDetail)
                void openEditDialog(row, viewDetail)
              }}
              disabled={!viewDetail}
            >
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
