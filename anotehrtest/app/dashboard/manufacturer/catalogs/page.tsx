"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  FileBox,
  Upload,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  File,
  Calendar
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Catalog {
  id: string
  name: string
  fileName: string
  fileSize: string
  uploadedAt: string
  downloads: number
  status: "active" | "draft"
}

const initialCatalogs: Catalog[] = [
  { id: "1", name: "2026 Product Catalog", fileName: "techvision-catalog-2026.pdf", fileSize: "12.5 MB", uploadedAt: "Mar 1, 2026", downloads: 156, status: "active" },
  { id: "2", name: "TWS Earbuds Collection", fileName: "tws-earbuds-catalog.pdf", fileSize: "8.2 MB", uploadedAt: "Feb 15, 2026", downloads: 89, status: "active" },
  { id: "3", name: "Smart Watches Lineup", fileName: "smartwatch-catalog.pdf", fileSize: "6.8 MB", uploadedAt: "Jan 20, 2026", downloads: 67, status: "active" },
  { id: "4", name: "New Products Preview", fileName: "preview-q2-2026.pdf", fileSize: "4.1 MB", uploadedAt: "Mar 10, 2026", downloads: 12, status: "draft" },
]

export default function ManufacturerCatalogsPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>(initialCatalogs)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [newCatalog, setNewCatalog] = useState({ name: "", file: null as File | null })

  const deleteCatalog = (id: string) => {
    setCatalogs(prev => prev.filter(c => c.id !== id))
  }

  const toggleStatus = (id: string) => {
    setCatalogs(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === "active" ? "draft" : "active" } : c
    ))
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
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <FileBox className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{catalogs.length}</p>
                <p className="text-sm text-muted-foreground">Total Catalogs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <FileBox className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{catalogs.filter(c => c.status === "active").length}</p>
                <p className="text-sm text-muted-foreground">Active Catalogs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Download className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{catalogs.reduce((sum, c) => sum + c.downloads, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Catalogs List */}
      <div className="grid gap-4">
        {catalogs.map((catalog) => (
          <Card key={catalog.id}>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                    <File className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{catalog.name}</h3>
                      <Badge className={catalog.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>
                        {catalog.status === "active" ? "Active" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{catalog.fileName}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{catalog.fileSize}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {catalog.uploadedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {catalog.downloads} downloads
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleStatus(catalog.id)}>
                        {catalog.status === "active" ? "Set as Draft" : "Publish"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteCatalog(catalog.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {catalogs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileBox className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No catalogs uploaded yet</p>
              <Button onClick={() => setShowUploadDialog(true)} className="mt-4">
                Upload Your First Catalog
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

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
              <Label>PDF File</Label>
              <div className="mt-2 rounded-lg border-2 border-dashed border-border p-8 text-center hover:border-secondary transition-colors cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF up to 50MB</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              if (newCatalog.name) {
                setCatalogs(prev => [{
                  id: `cat-${Date.now()}`,
                  name: newCatalog.name,
                  fileName: newCatalog.name.toLowerCase().replace(/\s+/g, '-') + '.pdf',
                  fileSize: "0 KB",
                  uploadedAt: "Just now",
                  downloads: 0,
                  status: "draft"
                }, ...prev])
                setNewCatalog({ name: "", file: null })
                setShowUploadDialog(false)
              }
            }}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
