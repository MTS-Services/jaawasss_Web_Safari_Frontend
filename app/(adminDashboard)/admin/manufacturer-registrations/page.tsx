"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { ManufacturerApplication, ManufacturerRegistrationResponse } from "@/lib/api/admin-manufacturer-registrations"
import { fetchManufacturerRegistrations, deleteManufacturer, approveManufacturer, rejectManufacturer } from "@/lib/api/admin-manufacturer-registrations"
import { ManufacturerApplicationDetailDialog } from "@/components/admin/manufacturer-application-detail-dialog"
import RequestReviewDialog from "@/components/admin/request-review-dialog"
import {
  Factory,
  Check,
  Trash2,
  Eye,
  Globe,
  MapPin,
  Mail,
  Building2,
  MoreVertical,
  MessageSquare,
  FileQuestion,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ScanEye,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const PER_PAGE = 10

function displayName(row: ManufacturerApplication) {
  const n = [row.first_name, row.last_name].filter(Boolean).join(" ").trim()
  return n || "—"
}

function displayCompany(row: ManufacturerApplication) {
  return row.company_name?.trim() || "—"
}

function isPending(row: ManufacturerApplication) {
  return (row.status || "pending") === "pending"
}

export default function ManufacturerRegistrationsPage() {
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<ManufacturerRegistrationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [viewOpen, setViewOpen] = useState(false)
  const [viewTarget, setViewTarget] = useState<ManufacturerApplication | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ManufacturerApplication | null>(null)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [messageTarget, setMessageTarget] = useState<ManufacturerApplication | null>(null)
  const [messageText, setMessageText] = useState("")
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [infoTarget, setInfoTarget] = useState<ManufacturerApplication | null>(null)
  const [infoRequestText, setInfoRequestText] = useState("")
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<ManufacturerApplication | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [reviewTarget, setReviewTarget] = useState<ManufacturerApplication | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [approvingId, setApprovingId] = useState<number | string | null>(null)
  const [rejectingId, setRejectingId] = useState<number | string | null>(null)

  // Fetch data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await fetchManufacturerRegistrations(
          currentPage,
          "pending",
          PER_PAGE
        )
        setData(response)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load manufacturer registrations",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentPage, toast])

  const rows = data?.data || []
  const meta = data?.meta
  const hasNextPage = meta && currentPage < meta.last_page
  const hasPrevPage = currentPage > 1

  const openView = (row: ManufacturerApplication) => {
    setViewTarget(row)
    setViewOpen(true)
  }

  const onApprove = async (row: ManufacturerApplication) => {
    if (!isPending(row)) {
      toast({
        title: "Already processed",
        description: "Only pending applications can be approved.",
        variant: "destructive",
      })
      return
    }

    try {
      setApprovingId(row.id)
      await approveManufacturer(row.id)

      toast({
        title: "Success",
        description: `${displayName(row)} has been approved.`,
      })

      // Refresh data
      const response = await fetchManufacturerRegistrations(currentPage, "pending", PER_PAGE)
      setData(response)

      // Close detail modal if open for this row
      if (viewTarget?.id === row.id) {
        setViewOpen(false)
        setViewTarget(null)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to approve manufacturer"
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setApprovingId(null)
    }
  }

  const openMessage = (row: ManufacturerApplication) => {
    setMessageTarget(row)
    setMessageText("")
    setShowMessageDialog(true)
  }

  const sendMessage = () => {
    if (!messageTarget) return
    toast({ title: "Message sent", description: `Message sent to ${messageTarget.email}` })
    setShowMessageDialog(false)
    setMessageTarget(null)
  }

  const openInfoRequest = (row: ManufacturerApplication) => {
    setInfoTarget(row)
    setInfoRequestText("")
    setShowInfoDialog(true)
  }

  const submitInfoRequest = () => {
    if (!infoTarget) return
    toast({ title: "Info requested", description: `Requested more info from ${infoTarget.email}` })
    setShowInfoDialog(false)
    setInfoTarget(null)
  }

  const openReject = (row: ManufacturerApplication) => {
    setRejectTarget(row)
    setRejectReason("")
    setShowRejectDialog(true)
  }

  const submitReject = async () => {
    if (!rejectTarget) return

    if (!rejectReason.trim()) {
      toast({
        title: "Missing reason",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      })
      return
    }

    try {
      setRejectingId(rejectTarget.id)
      await rejectManufacturer(rejectTarget.id, rejectReason)

      toast({
        title: "Success",
        description: `${displayCompany(rejectTarget)} has been rejected.`,
      })

      setShowRejectDialog(false)
      setRejectTarget(null)
      setRejectReason("")

      // Close detail modal if open for this row
      if (viewTarget?.id === rejectTarget.id) {
        setViewOpen(false)
        setViewTarget(null)
      }

      // Refresh data
      const response = await fetchManufacturerRegistrations(currentPage, "pending", PER_PAGE)
      setData(response)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to reject manufacturer"
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setRejectingId(null)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    
    try {
      setDeletingId(deleteTarget.id)
      const name = displayCompany(deleteTarget)
      
      await deleteManufacturer(deleteTarget.id)
      
      toast({
        title: "Success",
        description: `${name} has been deleted successfully.`,
      })
      
      setDeleteTarget(null)
      if (viewTarget?.id === deleteTarget.id) {
        setViewOpen(false)
        setViewTarget(null)
      }
      
      // Refresh data
      const response = await fetchManufacturerRegistrations(currentPage, "pending", PER_PAGE)
      setData(response)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to delete manufacturer"
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const ActionButtons = ({ row, layout = "row" }: { row: ManufacturerApplication; layout?: "row" | "stack" }) => {
    const pending = isPending(row)
    const isStack = layout === "stack"
    const wrap = isStack
      ? "flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap"
      : "flex items-center justify-end gap-1.5"

    const btnBaseClass = isStack 
      ? "h-10 px-4 gap-2.5 min-w-0 flex-1 sm:flex-none sm:min-w-24 text-sm font-medium" 
      : "h-8 w-8"

    if (isStack) {
      return (
        <div className={wrap}>
          <Button
            size="default"
            variant="default"
            className={btnBaseClass}
            disabled={!pending || approvingId === row.id}
            title={pending ? "Approve application" : "Only pending applications can be approved"}
            onClick={() => onApprove(row)}
          >
            {approvingId === row.id ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                <span className="truncate">Approving...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 shrink-0" />
                <span className="truncate">Approve</span>
              </>
            )}
          </Button>
          <Button
            size="default"
            variant="destructive"
            className={btnBaseClass}
            disabled={deletingId === row.id}
            title="Remove from list"
            onClick={() => setDeleteTarget(row)}
          >
            {deletingId === row.id ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                <span className="truncate">Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 shrink-0" />
                <span className="truncate">Delete</span>
              </>
            )}
          </Button>
          <Button
            size="default"
            variant="outline"
            className={btnBaseClass}
            title="View full application"
            onClick={() => openView(row)}
          >
            <Eye className="h-4 w-4 shrink-0" />
            <span className="truncate">View</span>
          </Button>
        </div>
      )
    }

    return (
      <div className={wrap}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openView(row)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openMessage(row)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openInfoRequest(row)}>
              <FileQuestion className="mr-2 h-4 w-4" />
              Request Info
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setReviewTarget(row); setShowReviewDialog(true) }}>
              <ScanEye className="mr-2 h-4 w-4 text-secondary" />
              <span className="text-secondary font-medium">Request Review</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {pending && (
              <DropdownMenuItem 
                onClick={() => onApprove(row)}
                disabled={approvingId === row.id}
              >
                <Check className="mr-2 h-4 w-4 text-emerald-600" />
                {approvingId === row.id ? "Approving..." : "Approve"}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => openReject(row)}
              disabled={rejectingId === row.id}
            >
              <X className="mr-2 h-4 w-4 text-red-600" />
              {rejectingId === row.id ? "Rejecting..." : "Reject"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive" 
              onClick={() => setDeleteTarget(row)}
              disabled={deletingId === row.id}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deletingId === row.id ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
            Manufacturer registrations
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground md:text-base">
            Review pending applications, approve, or remove entries
          </p>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 font-medium text-foreground">Loading...</p>
          </CardContent>
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Factory className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 font-medium text-foreground">No pending applications</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              All manufacturer applications have been reviewed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop / tablet: horizontal scroll table */}
          <Card className="hidden sm:block lg:px-6">
            <div className="w-full overflow-x-auto overscroll-x-contain">
              <Table className="min-w-160 w-full table-fixed sm:min-w-180 lg:min-w-0 lg:table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[22%] min-w-35">Name</TableHead>
                    <TableHead className="w-[24%] min-w-40">Email</TableHead>
                    <TableHead className="w-[12%] whitespace-nowrap">Applied</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                    <TableHead className="w-[22%] min-w-55 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={String(row.id)}>
                      <TableCell className="align-top">
                        <div className="flex items-start gap-2">
                          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="font-medium leading-snug">{displayName(row)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <span className="flex items-start gap-1.5 break-all text-sm">
                          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          {row.email}
                        </span>
                      </TableCell>
                      <TableCell className="align-top whitespace-nowrap text-sm text-muted-foreground">
                        {row.created_at
                          ? (() => {
                              try {
                                return format(new Date(row.created_at), "MMM d, yyyy")
                              } catch {
                                return row.created_at
                              }
                            })()
                          : "—"}
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant="secondary" className="capitalize">
                          {row.manufacture_status_label || row.status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top text-right">
                        <ActionButtons row={row} layout="row" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Mobile: cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {rows.map((row) => (
              <Card key={String(row.id)}>
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug text-foreground">
                        {displayName(row)}
                      </p>
                      <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground break-all">
                        <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {row.email}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 capitalize">
                      {row.manufacture_status_label || row.status || "pending"}
                    </Badge>
                  </div>
                  {row.created_at && (
                    <p className="text-xs text-muted-foreground">
                      Applied{" "}
                      {(() => {
                        try {
                          return format(new Date(row.created_at), "MMM d, yyyy")
                        } catch {
                          return row.created_at
                        }
                      })()}
                    </p>
                  )}
                  <ActionButtons row={row} layout="stack" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {meta && (
                <>
                  Showing <span className="font-medium">{meta.from}</span> to{" "}
                  <span className="font-medium">{meta.to}</span> of{" "}
                  <span className="font-medium">{meta.total}</span> results
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {meta?.links?.map((link, idx) => {
                  if (!link.url) return null
                  return (
                    <Button
                      key={idx}
                      variant={link.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(link.page || 1)}
                      className="w-8"
                    >
                      {link.label}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {viewTarget ? (
        <ManufacturerApplicationDetailDialog
          open={viewOpen}
          onOpenChange={(o) => {
            setViewOpen(o)
            if (!o) setViewTarget(null)
          }}
          application={viewTarget}
          manufacturerId={viewTarget.id}
        />
      ) : null}

      {/* Send Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {messageTarget?.company_name || messageTarget?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Message</Label>
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="mt-2 min-h-30"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
            <Button onClick={sendMessage}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Additional Information</DialogTitle>
            <DialogDescription>
              Request more details from {infoTarget?.company_name || infoTarget?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Message</Label>
            <Textarea
              value={infoRequestText}
              onChange={(e) => setInfoRequestText(e.target.value)}
              className="mt-2 min-h-30"
            />
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
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {rejectTarget ? displayCompany(rejectTarget) : "this application"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Reason for Rejection *</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this application is being rejected..."
              className="mt-2 min-h-25"
              disabled={rejectingId === rejectTarget?.id}
              required
            />
            {!rejectReason.trim() && (
              <p className="text-xs text-amber-600">Reason is required</p>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRejectDialog(false)}
              disabled={rejectingId === rejectTarget?.id}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={submitReject}
              disabled={rejectingId === rejectTarget?.id || !rejectReason.trim()}
            >
              {rejectingId === rejectTarget?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete application?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Are you sure you want to delete ${displayCompany(deleteTarget)}? This action cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="mt-0" disabled={deletingId !== null}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete()}
              disabled={deletingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === deleteTarget?.id ? (
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

      {/* Request Review Dialog */}
      {reviewTarget && (
        <RequestReviewDialog
          open={showReviewDialog}
          onOpenChange={(o) => {
            setShowReviewDialog(o)
            if (!o) setReviewTarget(null)
          }}
          manufacturer={reviewTarget}
        />
      )}
    </div>
  )
}


