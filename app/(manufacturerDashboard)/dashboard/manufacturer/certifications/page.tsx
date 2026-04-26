"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { 
  Award,
  Upload,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Plus,
  FileText,
  RefreshCw,
  Edit
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Certification {
  id: string
  name: string
  issuingBody: string
  certNumber: string
  issueDate: string
  expiryDate: string
  status: "valid" | "expiring" | "expired"
  documentUrl?: string
  notes?: string
}

const initialCerts: Certification[] = [
  { id: "1", name: "ISO 9001:2015", issuingBody: "SGS", certNumber: "ISO-9001-2023-12345", issueDate: "Jan 15, 2023", expiryDate: "Jan 15, 2026", status: "valid" },
  { id: "2", name: "ISO 14001:2015", issuingBody: "TUV Rheinland", certNumber: "ISO-14001-2023-67890", issueDate: "Mar 1, 2023", expiryDate: "Mar 1, 2026", status: "expiring" },
  { id: "3", name: "CE Certification", issuingBody: "Bureau Veritas", certNumber: "CE-2022-54321", issueDate: "Jun 20, 2022", expiryDate: "Jun 20, 2025", status: "expired" },
  { id: "4", name: "RoHS Compliance", issuingBody: "Intertek", certNumber: "ROHS-2024-11111", issueDate: "Feb 1, 2024", expiryDate: "Feb 1, 2027", status: "valid" },
  { id: "5", name: "BSCI Audit", issuingBody: "Amfori", certNumber: "BSCI-2023-22222", issueDate: "Sep 15, 2023", expiryDate: "Sep 15, 2026", status: "valid" },
]

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  valid: { label: "Valid", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  expiring: { label: "Expiring Soon", color: "bg-amber-100 text-amber-700", icon: AlertTriangle },
  expired: { label: "Expired", color: "bg-red-100 text-red-700", icon: AlertTriangle },
}

const certificationTypes = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 45001",
  "CE Certification",
  "RoHS Compliance",
  "REACH Compliance",
  "FCC Certification",
  "UL Certification",
  "BSCI Audit",
  "SA8000",
  "GMP",
  "HACCP",
  "FDA Registration",
  "Other"
]

export default function ManufacturerCertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>(initialCerts)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [viewingCert, setViewingCert] = useState<Certification | null>(null)
  const [deletingCertId, setDeletingCertId] = useState<string | null>(null)
  const [newCert, setNewCert] = useState({
    name: "",
    issuingBody: "",
    certNumber: "",
    issueDate: "",
    expiryDate: "",
    notes: ""
  })
  const [editCert, setEditCert] = useState({
    name: "",
    issuingBody: "",
    certNumber: "",
    issueDate: "",
    expiryDate: "",
    notes: ""
  })

  const deleteCert = (id: string) => {
    setCerts(prev => prev.filter(c => c.id !== id))
    setDeletingCertId(null)
  }

  const openEditDialog = (cert: Certification) => {
    setEditingCert(cert)
    setEditCert({
      name: cert.name,
      issuingBody: cert.issuingBody,
      certNumber: cert.certNumber,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      notes: cert.notes || ""
    })
    setShowEditDialog(true)
  }

  const saveEditCert = () => {
    if (editingCert) {
      setCerts(prev => prev.map(c => 
        c.id === editingCert.id 
          ? { ...c, ...editCert }
          : c
      ))
      setShowEditDialog(false)
      setEditingCert(null)
    }
  }

  const openViewDialog = (cert: Certification) => {
    setViewingCert(cert)
    setShowViewDialog(true)
  }

  const validCount = certs.filter(c => c.status === "valid").length
  const expiringCount = certs.filter(c => c.status === "expiring").length
  const expiredCount = certs.filter(c => c.status === "expired").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Certifications</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your company certifications and compliance documents
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{validCount}</p>
                <p className="text-sm text-muted-foreground">Valid Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{expiringCount}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{expiredCount}</p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications List */}
      <div className="grid gap-4">
        {certs.map((cert) => {
          const StatusIcon = statusConfig[cert.status].icon
          return (
            <Card key={cert.id} className="w-full overflow-hidden relative">
              <CardContent className="p-4 sm:p-5">
                {/* Mobile floating menu */}
                <div className="absolute right-4 top-4 sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(cert)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(cert)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Renew Certificate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(cert)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Replace File
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => setDeletingCertId(cert.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Desktop badge (top-right) */}
                <div className="hidden sm:block absolute right-4 top-4">
                  <Badge className={statusConfig[cert.status].color}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusConfig[cert.status].label}
                  </Badge>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Award className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{cert.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Issued by {cert.issuingBody} • {cert.certNumber}
                      </p>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <Calendar className="h-3 w-3" />
                          Issued: {cert.issueDate}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <Calendar className="h-3 w-3" />
                          Expires: {cert.expiryDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
                    {/* Mobile badge (shows above action buttons) */}
                    <div className="sm:hidden w-full">
                      <Badge className={statusConfig[cert.status].color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig[cert.status].label}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 w-full sm:w-auto justify-center"
                      onClick={() => openViewDialog(cert)}
                    >
                      <Eye className="h-3 w-3" />
                      View Document
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 w-full sm:w-auto justify-center"
                      onClick={() => openEditDialog(cert)}
                    >
                      <Upload className="h-3 w-3" />
                      Update
                    </Button>
                    {/* Inline menu for sm+ */}
                    <div className="hidden sm:block">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(cert)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(cert)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Renew Certificate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(cert)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Replace File
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletingCertId(cert.id)}
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

        {certs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No certifications added yet</p>
              <Button onClick={() => setShowAddDialog(true)} className="mt-4">
                Add Your First Certification
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Certification Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Certification</DialogTitle>
            <DialogDescription>
              Add a new certification to your profile
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Certification Type</Label>
              <Select 
                value={newCert.name}
                onValueChange={(value) => setNewCert({ ...newCert, name: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select certification type" />
                </SelectTrigger>
                <SelectContent>
                  {certificationTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Issuing Body</Label>
              <Input 
                placeholder="e.g., SGS, TUV, Bureau Veritas"
                value={newCert.issuingBody}
                onChange={(e) => setNewCert({ ...newCert, issuingBody: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Certificate Number</Label>
              <Input 
                placeholder="Enter certificate number"
                value={newCert.certNumber}
                onChange={(e) => setNewCert({ ...newCert, certNumber: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Issue Date</Label>
                <Input 
                  type="date"
                  value={newCert.issueDate}
                  onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input 
                  type="date"
                  value={newCert.expiryDate}
                  onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Upload Certificate (PDF)</Label>
              <div className="mt-2 rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-secondary transition-colors cursor-pointer">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea 
                placeholder="Add any notes about this certification..."
                value={newCert.notes}
                onChange={(e) => setNewCert({ ...newCert, notes: e.target.value })}
                className="mt-2"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              if (newCert.name && newCert.issuingBody) {
                setCerts(prev => [{
                  id: `cert-${Date.now()}`,
                  name: newCert.name,
                  issuingBody: newCert.issuingBody,
                  certNumber: newCert.certNumber || "Pending",
                  issueDate: newCert.issueDate || "N/A",
                  expiryDate: newCert.expiryDate || "N/A",
                  status: "valid",
                  notes: newCert.notes
                }, ...prev])
                setNewCert({ name: "", issuingBody: "", certNumber: "", issueDate: "", expiryDate: "", notes: "" })
                setShowAddDialog(false)
              }
            }}>Add Certification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Certification Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
            <DialogDescription>
              Update the certification details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Certification Type</Label>
              <Select 
                value={editCert.name}
                onValueChange={(value) => setEditCert({ ...editCert, name: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select certification type" />
                </SelectTrigger>
                <SelectContent>
                  {certificationTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Issuing Body</Label>
              <Input 
                placeholder="e.g., SGS, TUV, Bureau Veritas"
                value={editCert.issuingBody}
                onChange={(e) => setEditCert({ ...editCert, issuingBody: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Certificate Number</Label>
              <Input 
                placeholder="Enter certificate number"
                value={editCert.certNumber}
                onChange={(e) => setEditCert({ ...editCert, certNumber: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Issue Date</Label>
                <Input 
                  type="date"
                  value={editCert.issueDate}
                  onChange={(e) => setEditCert({ ...editCert, issueDate: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input 
                  type="date"
                  value={editCert.expiryDate}
                  onChange={(e) => setEditCert({ ...editCert, expiryDate: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Replace Certificate (PDF)</Label>
              <div className="mt-2 rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-secondary transition-colors cursor-pointer">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea 
                placeholder="Add any notes about this certification..."
                value={editCert.notes}
                onChange={(e) => setEditCert({ ...editCert, notes: e.target.value })}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={saveEditCert}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate Document</DialogTitle>
            <DialogDescription>
              {viewingCert?.name} - {viewingCert?.certNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-medium">{viewingCert?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Certificate #{viewingCert?.certNumber}
                  </p>
                </div>
              </div>
              <Badge className={viewingCert?.status ? statusConfig[viewingCert.status]?.color : ""}>
                {viewingCert?.status ? statusConfig[viewingCert.status]?.label : ""}
              </Badge>
            </div>
            
            <div className="aspect-[4/3] rounded-lg border border-border bg-muted/50 flex items-center justify-center">
              <div className="text-center">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Certificate Preview</p>
                <p className="text-sm text-muted-foreground">PDF document would display here</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Issuing Organization</p>
                <p className="font-medium">{viewingCert?.issuingBody}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Certificate Number</p>
                <p className="font-medium">{viewingCert?.certNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Issue Date</p>
                <p className="font-medium">{viewingCert?.issueDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expiry Date</p>
                <p className="font-medium">{viewingCert?.expiryDate}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCertId} onOpenChange={() => setDeletingCertId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this certification from your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingCertId && deleteCert(deletingCertId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
