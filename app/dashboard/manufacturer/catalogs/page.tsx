"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  FileBox,
  Upload,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  File,
  Calendar,
  Search,
  Info
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getManufacturerCatalogs,
  deleteManufacturerCatalog,
  changeManufacturerCatalogStatus,
  getManufacturerCatalogStats,
  downloadManufacturerCatalog,
  previewManufacturerCatalog,
  uploadManufacturerCatalog,
} from "@/lib/api/manufacturer-catalogs"
import type { ManufacturerCatalog, ManufacturerCatalogStats } from "@/lib/api/manufacturer-catalogs"

export default function ManufacturerCatalogsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [catalogs, setCatalogs] = useState<ManufacturerCatalog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastPage, setLastPage] = useState(1)
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())
  const [statusChangeIds, setStatusChangeIds] = useState<Set<number>>(new Set())
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set())
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [newCatalog, setNewCatalog] = useState({ name: "", file: null as File | null, status: "active" as "active" | "inactive" })
  const [stats, setStats] = useState<ManufacturerCatalogStats | null>(null)
  const [selectedCatalog, setSelectedCatalog] = useState<ManufacturerCatalog | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [uploadingCatalog, setUploadingCatalog] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewingId, setPreviewingId] = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get query parameters
  const status = searchParams.get("status") ?? "all"
  const page = parseInt(searchParams.get("page") ?? "1", 10)
  const perPage = parseInt(searchParams.get("per_page") ?? "10", 10)

  // Update URL query parameters
  const updateQueryParams = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === "all") {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })
    router.push(`/dashboard/manufacturer/catalogs?${newParams.toString()}`)
  }

  // Fetch catalogs and stats when query params change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const params: Record<string, unknown> = {
        page,
        per_page: perPage,
      }

      if (status !== "all") {
        params.status = status
      }

      const [catalogResponse, statsResponse] = await Promise.all([
        getManufacturerCatalogs(page, params),
        getManufacturerCatalogStats(),
      ])

      if (catalogResponse.success) {
        setCatalogs(catalogResponse.data)
        setLastPage(catalogResponse.meta?.lastPage ?? 1)
      } else {
        setError(catalogResponse.message || "Failed to fetch catalogs")
        setCatalogs([])
      }

      if (statsResponse.success) {
        setStats(statsResponse.data)
      }

      setLoading(false)
    }

    fetchData()
  }, [status, page, perPage])

  // Handle delete catalog
  const handleDeleteCatalog = async (id: number) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Catalog?",
      text: "This action cannot be undone.",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    })

    if (!confirm.isConfirmed) return

    setDeletingIds((prev) => new Set([...prev, id]))
    const response = await deleteManufacturerCatalog(id)

    if (response.success) {
      setCatalogs((prev) => prev.filter((c) => c.id !== id))
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Catalog deleted successfully",
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
      })
    } else {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: response.message || "Failed to delete catalog",
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
      })
    }

    setDeletingIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  // Handle status change
  const handleStatusChange = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    
    setStatusChangeIds((prev) => new Set([...prev, id]))
    const response = await changeManufacturerCatalogStatus(id, newStatus as "active" | "inactive")

    if (response.success) {
      setCatalogs((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus as "active" | "inactive" } : c
        )
      )
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Catalog ${newStatus === "active" ? "published" : "unpublished"} successfully`,
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
      })
    } else {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: response.message || "Failed to change catalog status",
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
      })
    }

    setStatusChangeIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const activeCount = catalogs.filter((c) => c.status === "active").length

  function toNumber(value: unknown, fallback = 0): number {
    if (typeof value === "number") return value
    if (typeof value === "string") {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : fallback
    }
    return fallback
  }

  // Handle preview catalog
  const handlePreview = async (id: number) => {
    setSelectedCatalog(null)
    setPreviewUrl(null)
    setPreviewingId(id)
    
    const catalog = catalogs.find(c => c.id === id)
    if (catalog) {
      setSelectedCatalog(catalog)
      
      // Try to get preview URL from API
      const response = await previewManufacturerCatalog(id)
      if (response.success && response.url) {
        setPreviewUrl(response.url)
      } else {
        // Fallback to file_path if available
        setPreviewUrl(catalog.file_path)
      }
      
      setShowDetailsModal(true)
    }
    
    setPreviewingId(null)
  }

  // Handle download catalog
  const handleDownload = async (id: number) => {
    setDownloadingIds((prev) => new Set([...prev, id]))
    
    const catalog = catalogs.find(c => c.id === id)
    if (!catalog) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Catalog not found",
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
      })
      setDownloadingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      return
    }

    try {
      // Use the file_path directly as it's a full URL from backend
      const fileUrl = catalog.file_path
      const fileName = `${catalog.name}.pdf`
      
      const a = document.createElement("a")
      a.href = fileUrl
      a.download = fileName
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to download catalog",
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
      })
    }

    setDownloadingIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Factory Catalogs</h1>
          <p className="mt-1 text-muted-foreground">
            Upload and manage your product catalogs (PDF)
          </p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Catalog
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <FileBox className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.total_catalogs ?? 0}</p>
                <p className="text-sm text-muted-foreground">Total Catalogs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <FileBox className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.active_catalogs ?? 0}</p>
                <p className="text-sm text-muted-foreground">Active Catalogs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <FileBox className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.inactive_catalogs ?? 0}</p>
                <p className="text-sm text-muted-foreground">Inactive Catalogs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Select
          value={status}
          onValueChange={(value) =>
            updateQueryParams({ status: value, page: 1 })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading catalogs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Catalogs List */}
      {!loading && (
        <>
          <div className="grid gap-4">
            {catalogs.map((catalog) => {
              const isDeleting = deletingIds.has(catalog.id)
              const isChangingStatus = statusChangeIds.has(catalog.id)

              return (
                <Card key={catalog.id} className="w-full overflow-hidden relative">
                  <CardContent className="p-4 sm:p-5">
                    {/* Mobile: floating menu at top-right to avoid centering under stacked buttons */}
                    <div className="absolute right-4 top-4 sm:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting || isChangingStatus}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(catalog.id, catalog.status)}
                            disabled={isChangingStatus}
                          >
                            {catalog.status === "active" ? "Set as Inactive" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteCatalog(catalog.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                          <File className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground truncate">{catalog.name}</h3>
                            <Badge className={catalog.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>
                              {catalog.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{catalog.file_path}</p>
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                            <span className="truncate">{catalog.file_size}</span>
                            <span className="flex items-center gap-1 truncate">
                              <Calendar className="h-3 w-3" />
                              {new Date(catalog.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 truncate">
                              <Download className="h-3 w-3" />
                              {catalog.total_downloads} downloads
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1 w-full sm:w-auto justify-center"
                          onClick={() => handlePreview(catalog.id)}
                        >
                          <Eye className="h-3 w-3" />
                          Preview
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1 w-full sm:w-auto justify-center"
                          disabled={downloadingIds.has(catalog.id)}
                          onClick={() => handleDownload(catalog.id)}
                        >
                          <Download className="h-3 w-3" />
                          {downloadingIds.has(catalog.id) ? "Downloading..." : "Download"}
                        </Button>
                        {/* Inline menu for sm+ */}
                        <div className="hidden sm:block">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={isDeleting || isChangingStatus}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(catalog.id, catalog.status)}
                                disabled={isChangingStatus}
                              >
                                {catalog.status === "active" ? "Set as Inactive" : "Publish"}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteCatalog(catalog.id)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {catalogs.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileBox className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No catalogs found</p>
                  <Button onClick={() => setShowUploadDialog(true)} className="mt-4">
                    Upload Your First Catalog
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() =>
                  updateQueryParams({ page: Math.max(1, page - 1) })
                }
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {lastPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === lastPage}
                onClick={() =>
                  updateQueryParams({ page: Math.min(lastPage, page + 1) })
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Catalog Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Catalog Preview & Details</DialogTitle>
            <DialogDescription>
              View and manage catalog information
            </DialogDescription>
          </DialogHeader>
          {selectedCatalog && (
            <div className="space-y-4">
              {/* PDF Preview Info */}
              {previewUrl && (
                <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                  <p className="text-sm text-blue-900">
                    📄 Click "Open in New Tab" to preview the PDF in a new window, or "Download" to save it locally.
                  </p>
                </div>
              )}

              <div className="flex items-start gap-4 border-t pt-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                  <File className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">{selectedCatalog.name}</h3>
                  <Badge className={selectedCatalog.status === "active" ? "mt-1 bg-emerald-100 text-emerald-700" : "mt-1 bg-slate-100 text-slate-700"}>
                    {selectedCatalog.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">File Path</p>
                  <p className="mt-1 break-all text-sm text-foreground font-mono text-xs bg-muted p-2 rounded">
                    {selectedCatalog.file_path}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">File Size</p>
                    <p className="mt-1 text-sm text-foreground">{selectedCatalog.file_size}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                    <p className="mt-1 text-sm text-foreground">{selectedCatalog.total_downloads}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="mt-1 text-sm text-foreground">
                      {new Date(selectedCatalog.created_at).toLocaleDateString()} {new Date(selectedCatalog.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Updated</p>
                    <p className="mt-1 text-sm text-foreground">
                      {new Date(selectedCatalog.updated_at).toLocaleDateString()} {new Date(selectedCatalog.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 border-t pt-4">
                {previewUrl && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                    Open in New Tab
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="gap-2 flex-1"
                  onClick={() => handleDownload(selectedCatalog.id)}
                  disabled={downloadingIds.has(selectedCatalog.id)}
                >
                  <Download className="h-4 w-4" />
                  {downloadingIds.has(selectedCatalog.id) ? "Downloading..." : "Download"}
                </Button>
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Catalog</DialogTitle>
            <DialogDescription>
              Upload a PDF catalog for buyers to download
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Catalog Name</Label>
              <Input 
                placeholder="e.g., 2026 Product Catalog"
                value={newCatalog.name}
                onChange={(e) => setNewCatalog({ ...newCatalog, name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={newCatalog.status}
                onValueChange={(value) =>
                  setNewCatalog({ ...newCatalog, status: value as "active" | "inactive" })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>PDF File</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setNewCatalog({ ...newCatalog, file })
                  }
                }}
              />
              <div 
                className="mt-2 rounded-lg border-2 border-dashed border-border p-8 text-center hover:border-secondary transition-colors cursor-pointer"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const files = e.dataTransfer?.files
                  if (files && files[0]) {
                    setNewCatalog({ ...newCatalog, file: files[0] })
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {newCatalog.file ? newCatalog.file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">PDF up to 50MB</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setNewCatalog({ name: "", file: null, status: "active" })
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""
                }
                setShowUploadDialog(false)
              }}
              disabled={uploadingCatalog}
            >
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                if (!newCatalog.name || !newCatalog.file) {
                  await Swal.fire({
                    icon: "warning",
                    title: "Missing Fields",
                    text: "Please provide both catalog name and PDF file",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#6366f1",
                  })
                  return
                }

                setUploadingCatalog(true)
                const formData = new FormData()
                formData.append("name", newCatalog.name)
                formData.append("status", newCatalog.status)
                formData.append("catalog", newCatalog.file)

                const response = await uploadManufacturerCatalog(formData)

                if (response.success) {
                  setNewCatalog({ name: "", file: null, status: "active" })
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                  setShowUploadDialog(false)
                  
                  await Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Catalog uploaded successfully",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#6366f1",
                  })
                  
                  // Refresh catalog list
                  const params: Record<string, unknown> = {
                    page,
                    per_page: perPage,
                  }
                  if (status !== "all") {
                    params.status = status
                  }
                  const catalogResponse = await getManufacturerCatalogs(page, params)
                  if (catalogResponse.success) {
                    setCatalogs(catalogResponse.data)
                    setLastPage(catalogResponse.meta?.lastPage ?? 1)
                  }
                } else {
                  await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.message || "Failed to upload catalog",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#6366f1",
                  })
                }

                setUploadingCatalog(false)
              }}
              disabled={uploadingCatalog || !newCatalog.name || !newCatalog.file}
            >
              {uploadingCatalog ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
