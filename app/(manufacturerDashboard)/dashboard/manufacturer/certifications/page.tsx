"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  RefreshCw,
  Edit,
  Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { AddCertificationModal } from "@/components/manufacturers/add-certification-modal"
import {
  fetchCertifications,
  fetchCertificateTypes,
  Certificate,
} from "@/lib/api/manufacturer-certificates"

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  valid: { label: "Valid", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  expiring: { label: "Expiring Soon", color: "bg-amber-100 text-amber-700", icon: AlertTriangle },
  expired: { label: "Expired", color: "bg-red-100 text-red-700", icon: AlertTriangle },
}

function calculateCertStatus(expiryDate: string): "valid" | "expiring" | "expired" {
  const today = new Date()
  const expiry = new Date(expiryDate)
  
  if (expiry < today) {
    return "expired"
  }
  
  // 90 days from now
  const ninetyDaysFromNow = new Date()
  ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)
  
  if (expiry <= ninetyDaysFromNow) {
    return "expiring"
  }
  
  return "valid"
}

export default function ManufacturerCertificationsPage() {
  const { toast } = useToast()
  const [certs, setCerts] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingCertId, setDeletingCertId] = useState<number | null>(null)
  const [certTypes, setCertTypes] = useState<Map<number, string>>(new Map())

  // Fetch certifications on mount
  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setIsLoading(true)
        const [certs, types] = await Promise.all([
          fetchCertifications(),
          fetchCertificateTypes(),
        ])
        setCerts(certs)
        // Create a map of type IDs to names
        const typeMap = new Map(types.map((t) => [t.id, t.name]))
        setCertTypes(typeMap)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load certifications",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCertifications()
  }, [toast])

  const handleCertificateAdded = (newCert: Certificate) => {
    setCerts((prev) => [newCert, ...prev])
  }

  const handleDeleteCert = async (id: number) => {
    // TODO: Implement delete API call when backend endpoint is available
    toast({
      variant: "destructive",
      title: "Coming Soon",
      description: "Delete functionality will be available soon",
    })
    setDeletingCertId(null)
  }

  const validCount = certs.filter(
    (c) => calculateCertStatus(c.expiry_date) === "valid"
  ).length
  const expiringCount = certs.filter(
    (c) => calculateCertStatus(c.expiry_date) === "expiring"
  ).length
  const expiredCount = certs.filter(
    (c) => calculateCertStatus(c.expiry_date) === "expired"
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Certifications</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your company certifications and compliance documents
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Loading certifications...</p>
          </CardContent>
        </Card>
      ) : (
        <>
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
              const status = calculateCertStatus(cert.expiry_date)
              const StatusIcon = statusConfig[status].icon
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
                          {cert.certificate_pdf && (
                            <DropdownMenuItem asChild>
                              <a
                                href={cert.certificate_pdf}
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
                      <Badge className={statusConfig[status].color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig[status].label}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <Award className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground truncate">
                              {certTypes.get(cert.certificate_type_id) ||
                                `Certificate #${cert.certificate_type_id}`}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            Issued by {cert.issuing_body} • {cert.certificate_number}
                          </p>
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 truncate">
                              <Calendar className="h-3 w-3" />
                              Issued: {new Date(cert.issue_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 truncate">
                              <Calendar className="h-3 w-3" />
                              Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
                        {/* Mobile badge (shows above action buttons) */}
                        <div className="sm:hidden w-full">
                          <Badge className={statusConfig[status].color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[status].label}
                          </Badge>
                        </div>
                        {cert.certificate_pdf && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1 w-full sm:w-auto justify-center"
                            asChild
                          >
                            <a
                              href={cert.certificate_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-3 w-3" />
                              View Document
                            </a>
                          </Button>
                        )}
                        {/* Inline menu for sm+ */}
                        <div className="hidden sm:block">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {cert.certificate_pdf && (
                                <DropdownMenuItem asChild>
                                  <a
                                    href={cert.certificate_pdf}
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
                  <Button onClick={() => setShowAddModal(true)} className="mt-4">
                    Add Your First Certification
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Add Certification Modal */}
      <AddCertificationModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={handleCertificateAdded}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingCertId !== null}
        onOpenChange={(open) => !open && setDeletingCertId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this certification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingCertId && handleDeleteCert(deletingCertId)
              }
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

