"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Award,
  Building2,
  Calendar,
  CheckCircle,
  Copy,
  Edit,
  Eye,
  FileText,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  CertificateType,
  createAdminCertificateType,
  deleteAdminCertificateType,
  getAdminCertificateTypes,
  updateAdminCertificateType,
} from "@/lib/api/admin-certificate-types"
import {
  AdminCertification,
  deleteAdminCertification,
  getAdminCertifications,
} from "@/lib/api/admin-certifications"

const typeStatusConfig = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700" },
  inactive: { label: "Inactive", color: "bg-gray-100 text-gray-700" },
}

type CertificateVisualStatus = "valid" | "expiring" | "expired" | "unknown"

const certificateStatusConfig: Record<
  CertificateVisualStatus,
  { label: string; color: string; icon: typeof CheckCircle }
> = {
  valid: {
    label: "Valid",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
  expiring: {
    label: "Expiring Soon",
    color: "bg-amber-100 text-amber-700",
    icon: AlertTriangle,
  },
  expired: {
    label: "Expired",
    color: "bg-red-100 text-red-700",
    icon: AlertTriangle,
  },
  unknown: {
    label: "No Expiry",
    color: "bg-gray-100 text-gray-700",
    icon: AlertTriangle,
  },
}

interface GroupedCertificationStats {
  valid: number
  expiring: number
  expired: number
  lastUpdated: string
}

interface GroupedCertification {
  manufacturerEmail: string
  manufacturerName: string
  certifications: AdminCertification[]
  stats: GroupedCertificationStats
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
}

function calculateCertificationStatus(expiryDate: string): CertificateVisualStatus {
  if (!expiryDate) {
    return "unknown"
  }

  const expiry = new Date(expiryDate)
  if (Number.isNaN(expiry.getTime())) {
    return "unknown"
  }

  const today = new Date()
  if (expiry < today) {
    return "expired"
  }

  const ninetyDaysFromNow = new Date()
  ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)

  if (expiry <= ninetyDaysFromNow) {
    return "expiring"
  }

  return "valid"
}

function formatDisplayDate(rawDate: string): string {
  if (!rawDate) {
    return "N/A"
  }

  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) {
    return "N/A"
  }

  return date.toLocaleDateString()
}

function groupCertificationsByManufacturer(
  certifications: AdminCertification[]
): GroupedCertification[] {
  const groupMap = new Map<string, GroupedCertification>()

  for (const cert of certifications) {
    const email = cert.manufacturer_email || "unknown"
    const name = cert.manufacturer_name || "Unknown Manufacturer"

    if (!groupMap.has(email)) {
      groupMap.set(email, {
        manufacturerEmail: email,
        manufacturerName: name,
        certifications: [],
        stats: {
          valid: 0,
          expiring: 0,
          expired: 0,
          lastUpdated: "",
        },
      })
    }

    const group = groupMap.get(email)!
    group.certifications.push(cert)

    // Update stats
    const status = calculateCertificationStatus(cert.expiry_date)
    if (status === "valid") group.stats.valid++
    else if (status === "expiring") group.stats.expiring++
    else if (status === "expired") group.stats.expired++

    // Update last updated date
    if (cert.updated_at) {
      if (!group.stats.lastUpdated || new Date(cert.updated_at) > new Date(group.stats.lastUpdated)) {
        group.stats.lastUpdated = cert.updated_at
      }
    }
  }

  return Array.from(groupMap.values())
}

export default function AdminCertificateTypePage() {
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("certificates")

  const [groupedCertifications, setGroupedCertifications] = useState<GroupedCertification[]>([])
  const [certificationsLoading, setCertificationsLoading] = useState(true)
  const [certificationsSearch, setCertificationsSearch] = useState("")
  const [certificationsPage, setCertificationsPage] = useState(1)
  const [certificationsPerPage] = useState(12)
  const [certificationsTotalPages, setCertificationsTotalPages] = useState(1)
  const [certificationsTotalItems, setCertificationsTotalItems] = useState(0)
  const [deletingCertificationId, setDeletingCertificationId] = useState<
    string | number | null
  >(null)
  const [isDeletingCertification, setIsDeletingCertification] = useState(false)

  const [types, setTypes] = useState<CertificateType[]>([])
  const [typesLoading, setTypesLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingType, setEditingType] = useState<CertificateType | null>(null)
  const [deletingTypeId, setDeletingTypeId] = useState<string | number | null>(null)
  const [typeSearchQuery, setTypeSearchQuery] = useState("")
  const [isTypeSubmitting, setIsTypeSubmitting] = useState(false)
  const [typeCurrentPage, setTypeCurrentPage] = useState(1)
  const [typesPerPage] = useState(12)
  const [typeTotalPages, setTypeTotalPages] = useState(1)
  const [typeTotalItems, setTypeTotalItems] = useState(0)

  const [newType, setNewType] = useState({
    name: "",
    slug: "",
    status: "active" as "active" | "inactive",
  })
  const [editType, setEditType] = useState({
    name: "",
    slug: "",
    status: "active" as "active" | "inactive",
  })

  useEffect(() => {
    void loadAdminCertificates()
  }, [certificationsPage])

  useEffect(() => {
    void loadCertificateTypes()
  }, [typeCurrentPage, typeSearchQuery])

  const loadAdminCertificates = async (
    page: number = certificationsPage,
    search: string = certificationsSearch
  ) => {
    setCertificationsLoading(true)
    try {
      // Don't pass search to API - let backend return all results for this page
      // Client-side filtering will handle manufacturer search
      const response = await getAdminCertifications("", page, certificationsPerPage)
      if (response.success) {
        const grouped = groupCertificationsByManufacturer(response.data)
        setGroupedCertifications(grouped)
        if (response.pagination) {
          setCertificationsTotalPages(response.pagination.last_page)
          setCertificationsTotalItems(response.pagination.total)
        } else {
          setCertificationsTotalPages(1)
          setCertificationsTotalItems(response.data.length)
        }
      } else {
        setGroupedCertifications([])
        toast({
          title: "Error",
          description: response.message || "Failed to load certifications",
          variant: "destructive",
        })
      }
    } catch (_error) {
      setGroupedCertifications([])
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading certifications",
        variant: "destructive",
      })
    } finally {
      setCertificationsLoading(false)
    }
  }

  const loadCertificateTypes = async (
    page: number = typeCurrentPage,
    search: string = typeSearchQuery
  ) => {
    setTypesLoading(true)
    try {
      const response = await getAdminCertificateTypes(search, page, typesPerPage)
      if (response.success) {
        setTypes(response.data)
        if (response.pagination) {
          setTypeTotalPages(response.pagination.last_page)
          setTypeTotalItems(response.pagination.total)
        } else {
          setTypeTotalPages(1)
          setTypeTotalItems(response.data.length)
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load certificate types",
          variant: "destructive",
        })
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setTypesLoading(false)
    }
  }

  const handleDeleteCertification = async () => {
    if (!deletingCertificationId) {
      return
    }

    setIsDeletingCertification(true)
    try {
      const response = await deleteAdminCertification(deletingCertificationId)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Certification deleted successfully",
        })

        // Check if we need to go to previous page
        const totalCertsInGroups = groupedCertifications.reduce(
          (acc, group) => acc + group.certifications.length,
          0
        )
        const shouldGoToPreviousPage = totalCertsInGroups === 1 && certificationsPage > 1

        if (shouldGoToPreviousPage) {
          setCertificationsPage((prev) => Math.max(1, prev - 1))
        } else {
          await loadAdminCertificates(certificationsPage, certificationsSearch)
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete certification",
          variant: "destructive",
        })
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting certification",
        variant: "destructive",
      })
    } finally {
      setIsDeletingCertification(false)
      setDeletingCertificationId(null)
    }
  }

  const deleteType = async (id: string | number) => {
    setIsTypeSubmitting(true)
    try {
      const response = await deleteAdminCertificateType(id)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Certificate type deleted successfully",
        })
        await loadCertificateTypes(typeCurrentPage, typeSearchQuery)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete certificate type",
          variant: "destructive",
        })
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsTypeSubmitting(false)
      setDeletingTypeId(null)
    }
  }

  const addType = async () => {
    if (!newType.name.trim() || !newType.slug.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const status =
      newType.status === "active" || newType.status === "inactive"
        ? newType.status
        : "active"

    setIsTypeSubmitting(true)
    try {
      const response = await createAdminCertificateType({
        name: newType.name,
        slug: newType.slug,
        status,
      })

      if (response.success) {
        setNewType({ name: "", slug: "", status: "active" })
        setShowAddDialog(false)
        setTypeCurrentPage(1)
        toast({
          title: "Success",
          description: response.message || "Certificate type created successfully",
        })
        await loadCertificateTypes(1, typeSearchQuery)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create certificate type",
          variant: "destructive",
        })
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsTypeSubmitting(false)
    }
  }

  const openEditDialog = (type: CertificateType) => {
    setEditingType(type)
    setEditType({
      name: type.name,
      slug: type.slug,
      status: type.status,
    })
    setShowEditDialog(true)
  }

  const saveEditType = async () => {
    if (!editingType || !editType.name.trim() || !editType.slug.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const status =
      editType.status === "active" || editType.status === "inactive"
        ? editType.status
        : "active"

    setIsTypeSubmitting(true)
    try {
      const response = await updateAdminCertificateType(editingType.id, {
        name: editType.name,
        slug: editType.slug,
        status,
      })

      if (response.success) {
        setShowEditDialog(false)
        setEditingType(null)
        toast({
          title: "Success",
          description: response.message || "Certificate type updated successfully",
        })
        await loadCertificateTypes(typeCurrentPage, typeSearchQuery)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update certificate type",
          variant: "destructive",
        })
      }
    } catch (_error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsTypeSubmitting(false)
    }
  }

  const validCount = useMemo(
    () =>
      groupedCertifications.reduce((acc, group) => acc + group.stats.valid, 0),
    [groupedCertifications]
  )

  const expiringCount = useMemo(
    () =>
      groupedCertifications.reduce((acc, group) => acc + group.stats.expiring, 0),
    [groupedCertifications]
  )

  const expiredCount = useMemo(
    () =>
      groupedCertifications.reduce((acc, group) => acc + group.stats.expired, 0),
    [groupedCertifications]
  )

  const filteredGroupedCertifications = useMemo(() => {
    if (!certificationsSearch.trim()) {
      return groupedCertifications
    }

    const searchTerm = certificationsSearch.toLowerCase()

    return groupedCertifications
      .map((group) => ({
        ...group,
        certifications: group.certifications.filter((cert) =>
          [
            cert.manufacturer_name,
            cert.manufacturer_email,
            cert.certificate_type_name,
            cert.issuing_body,
            cert.certificate_number,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm)
        ),
      }))
      .filter((group) => group.certifications.length > 0)
  }, [groupedCertifications, certificationsSearch])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">
          Certifications Management
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review manufacturer certificates and manage certificate types
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-2">
          <TabsTrigger value="certificates" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            All Certificates
          </TabsTrigger>
          <TabsTrigger value="types" className="gap-2">
            <Award className="h-4 w-4" />
            Certificate Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by certificate, issuer, or manufacturer..."
                value={certificationsSearch}
                onChange={(e) => {
                  setCertificationsSearch(e.target.value)
                  setCertificationsPage(1)
                }}
                className="pl-9"
                disabled={certificationsLoading}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => void loadAdminCertificates(certificationsPage, certificationsSearch)}
              disabled={certificationsLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {certificationsLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Loading submitted certificates...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                        <CheckCircle className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{validCount}</p>
                        <p className="text-sm text-muted-foreground">Valid</p>
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

              <div className="space-y-4">
                {filteredGroupedCertifications.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredGroupedCertifications.map((group, index) => (
                      <AccordionItem key={group.manufacturerEmail} value={`group-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex w-full flex-col gap-3 text-left">
                            <div className="flex flex-col gap-1">
                              <h3 className="font-semibold text-foreground">{group.manufacturerName}</h3>
                              <p className="text-sm text-muted-foreground">{group.manufacturerEmail}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {group.stats.valid > 0 && (
                                <Badge className="bg-emerald-100 text-emerald-700">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  {group.stats.valid} Valid
                                </Badge>
                              )}
                              {group.stats.expiring > 0 && (
                                <Badge className="bg-amber-100 text-amber-700">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  {group.stats.expiring} Expiring
                                </Badge>
                              )}
                              {group.stats.expired > 0 && (
                                <Badge className="bg-red-100 text-red-700">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  {group.stats.expired} Expired
                                </Badge>
                              )}
                              {group.stats.lastUpdated && (
                                <span className="text-xs text-muted-foreground">
                                  Last updated: {formatDisplayDate(group.stats.lastUpdated)}
                                </span>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="space-y-3">
                            {group.certifications.map((certification) => {
                              const status = calculateCertificationStatus(certification.expiry_date)
                              const statusUi = certificateStatusConfig[status]
                              const StatusIcon = statusUi.icon

                              return (
                                <Card key={certification.id} className="w-full overflow-hidden">
                                  <CardContent className="p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                      <div className="flex items-start gap-3 min-w-0">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                          <FileText className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                          <h4 className="font-semibold text-foreground truncate text-sm">
                                            {certification.certificate_type_name ||
                                              `Certificate #${certification.certificate_type_id}`}
                                          </h4>
                                          <p className="text-xs text-muted-foreground truncate">
                                            Issued by {certification.issuing_body || "N/A"} • {certification.certificate_number || "N/A"}
                                          </p>
                                          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                            <span>Issued: {formatDisplayDate(certification.issue_date)}</span>
                                            <span>Expires: {formatDisplayDate(certification.expiry_date)}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <Badge className={statusUi.color}>
                                          <StatusIcon className="mr-1 h-3 w-3" />
                                          {statusUi.label}
                                        </Badge>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                              <MoreVertical className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            {certification.certificate_pdf && (
                                              <DropdownMenuItem asChild>
                                                <a
                                                  href={certification.certificate_pdf}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="cursor-pointer"
                                                >
                                                  <Eye className="mr-2 h-4 w-4" />
                                                  View Document
                                                </a>
                                              </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem
                                              className="text-destructive"
                                              onClick={() => setDeletingCertificationId(certification.id)}
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
                              )
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">
                        {certificationsSearch
                          ? "No certificates found matching your search"
                          : "No submitted certificates found"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {certificationsTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCertificationsPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={certificationsPage === 1 || certificationsLoading}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {certificationsPage} of {certificationsTotalPages} ({certificationsTotalItems} total)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCertificationsPage((prev) =>
                        Math.min(certificationsTotalPages, prev + 1)
                      )
                    }
                    disabled={
                      certificationsPage === certificationsTotalPages || certificationsLoading
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Certificate Type Library</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add and maintain certificate types available in manufacturer forms
              </p>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="gap-2"
              disabled={typesLoading}
            >
              <Plus className="h-4 w-4" />
              Add Certificate Type
            </Button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search certificate types..."
                value={typeSearchQuery}
                onChange={(e) => {
                  setTypeSearchQuery(e.target.value)
                  setTypeCurrentPage(1)
                }}
                className="pl-9"
                disabled={typesLoading}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => void loadCertificateTypes(typeCurrentPage, typeSearchQuery)}
              disabled={typesLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {typesLoading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Loading certificate types...</p>
              </CardContent>
            </Card>
          )}

          {!typesLoading && types.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  {typeSearchQuery
                    ? "No certificate types found matching your search"
                    : "No certificate types available"}
                </p>
                <Button onClick={() => setShowAddDialog(true)} className="mt-4">
                  Add Your First Certificate Type
                </Button>
              </CardContent>
            </Card>
          )}

          {!typesLoading && types.length > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {types.map((type) => (
                  <Card key={type.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex h-full flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                            <Award className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <Badge className={typeStatusConfig[type.status].color}>
                            {typeStatusConfig[type.status].label}
                          </Badge>
                        </div>

                        <div className="flex-1 space-y-2">
                          <h3 className="line-clamp-2 font-semibold text-foreground">{type.name}</h3>
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              <span className="font-semibold">Slug:</span>
                            </p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">
                                {type.slug}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                                    void navigator.clipboard.writeText(type.slug)
                                  }
                                  toast({
                                    title: "Copied",
                                    description: "Slug copied to clipboard",
                                  })
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 border-t pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1"
                            onClick={() => openEditDialog(type)}
                            disabled={isTypeSubmitting}
                          >
                            <Edit className="h-3 w-3" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                disabled={isTypeSubmitting}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(type)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeletingTypeId(type.id)}
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
              </div>

              {typeTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTypeCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={typeCurrentPage === 1 || typesLoading}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {typeCurrentPage} of {typeTotalPages} ({typeTotalItems} total)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setTypeCurrentPage((prev) => Math.min(typeTotalPages, prev + 1))
                    }
                    disabled={typeCurrentPage === typeTotalPages || typesLoading}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open)
          if (!open) {
            setNewType({ name: "", slug: "", status: "active" })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Certificate Type</DialogTitle>
            <DialogDescription>
              Create a new certificate type for manufacturers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Certificate Name *</Label>
              <Input
                placeholder="e.g., ISO 9001:2015"
                value={newType.name}
                onChange={(e) => {
                  const name = e.target.value
                  setNewType({ ...newType, name, slug: generateSlug(name) })
                }}
                className="mt-2"
                disabled={isTypeSubmitting}
              />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input
                placeholder="e.g., iso_9001_2015"
                value={newType.slug}
                onChange={(e) => setNewType({ ...newType, slug: e.target.value })}
                className="mt-2"
                disabled={isTypeSubmitting}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Auto-generated from certificate name. You can edit when needed.
              </p>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={newType.status}
                onValueChange={(value) =>
                  setNewType({ ...newType, status: value as "active" | "inactive" })
                }
                disabled={isTypeSubmitting}
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={isTypeSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={addType} disabled={isTypeSubmitting}>
              {isTypeSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Type"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open)
          if (!open) {
            setEditingType(null)
            setEditType({ name: "", slug: "", status: "active" })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Certificate Type</DialogTitle>
            <DialogDescription>Update certificate type details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Certificate Name *</Label>
              <Input
                placeholder="e.g., ISO 9001:2015"
                value={editType.name}
                onChange={(e) => setEditType({ ...editType, name: e.target.value })}
                className="mt-2"
                disabled={isTypeSubmitting}
              />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input
                placeholder="e.g., iso_9001_2015"
                value={editType.slug}
                onChange={(e) => setEditType({ ...editType, slug: e.target.value })}
                className="mt-2"
                disabled={isTypeSubmitting}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={editType.status}
                onValueChange={(value) =>
                  setEditType({ ...editType, status: value as "active" | "inactive" })
                }
                disabled={isTypeSubmitting}
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isTypeSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={saveEditType} disabled={isTypeSubmitting}>
              {isTypeSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingCertificationId !== null} onOpenChange={() => setDeletingCertificationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected certification document will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingCertification}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDeleteCertification()}
              disabled={isDeletingCertification}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingCertification ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingTypeId} onOpenChange={() => setDeletingTypeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certificate Type?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this certificate type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTypeSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingTypeId && void deleteType(deletingTypeId)}
              disabled={isTypeSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isTypeSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}