"use client"

import { useMemo, useState } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { ManufacturerApplication } from "@/lib/api/admin-manufacturer-registrations"
import { cloneManufacturerRegistrationsSeed } from "@/lib/data/manufacturer-registrations-static"
import { ManufacturerApplicationDetailDialog } from "@/components/admin/manufacturer-application-detail-dialog"
import {
  Factory,
  RefreshCw,
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
  Ban,
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
  const [statusFilter, setStatusFilter] = useState("pending")
  const [applications, setApplications] = useState<ManufacturerApplication[]>(() =>
    cloneManufacturerRegistrationsSeed()
  )
  const [viewOpen, setViewOpen] = useState(false)
  const [viewTarget, setViewTarget] = useState<ManufacturerApplication | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ManufacturerApplication | null>(null)
  const [messageTarget, setMessageTarget] = useState<ManufacturerApplication | null>(null)
  const [messageText, setMessageText] = useState("")
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [infoTarget, setInfoTarget] = useState<ManufacturerApplication | null>(null)
  const [infoRequestText, setInfoRequestText] = useState("")
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<ManufacturerApplication | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const rows = useMemo(() => {
    if (statusFilter === "all") return applications
    return applications.filter((r) => (r.status || "pending") === statusFilter)
  }, [applications, statusFilter])

  const resetFromJson = () => {
    setApplications(cloneManufacturerRegistrationsSeed())
    toast({
      title: "Sample data reloaded",
      description: "Restored rows from lib/data/manufacturer-registrations.json",
    })
  }

  const openView = (row: ManufacturerApplication) => {
    setViewTarget(row)
    setViewOpen(true)
  }

  const onApprove = (row: ManufacturerApplication) => {
    if (!isPending(row)) {
      toast({
        title: "Already processed",
        description: "Only pending applications can be approved.",
        variant: "destructive",
      })
      return
    }
    setApplications((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: "approved" } : r))
    )
    toast({
      title: "Approved (demo)",
      description: `${displayCompany(row)} marked approved in this session only.`,
    })
  }

  const updateApplicationStatus = (id: number | string, status: string) => {
    setApplications((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const openMessage = (row: ManufacturerApplication) => {
    setMessageTarget(row)
    setMessageText("")
    setShowMessageDialog(true)
  }

  const sendMessage = () => {
    if (!messageTarget) return
    toast({ title: "Message sent (demo)", description: `Message sent to ${messageTarget.email}` })
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
    updateApplicationStatus(infoTarget.id, "needs_info")
    toast({ title: "Info requested (demo)", description: `Requested more info from ${infoTarget.email}` })
    setShowInfoDialog(false)
    setInfoTarget(null)
  }

  const openReject = (row: ManufacturerApplication) => {
    setRejectTarget(row)
    setRejectReason("")
    setShowRejectDialog(true)
  }

  const submitReject = () => {
    if (!rejectTarget) return
    updateApplicationStatus(rejectTarget.id, "rejected")
    toast({ title: "Rejected (demo)", description: `${displayCompany(rejectTarget)} marked rejected.` })
    setShowRejectDialog(false)
    setRejectTarget(null)
    if (viewTarget?.id === rejectTarget.id) {
      setViewOpen(false)
      setViewTarget(null)
    }
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    const name = displayCompany(deleteTarget)
    setApplications((prev) => prev.filter((r) => r.id !== deleteTarget.id))
    toast({
      title: "Removed (demo)",
      description: `${name} removed from this list locally.`,
    })
    setDeleteTarget(null)
    if (viewTarget?.id === deleteTarget.id) {
      setViewOpen(false)
      setViewTarget(null)
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
            disabled={!pending}
            title={pending ? "Approve application" : "Only pending applications can be approved"}
            onClick={() => onApprove(row)}
          >
            <Check className="h-4 w-4 shrink-0" />
            <span className="truncate">Approve</span>
          </Button>
          <Button
            size="default"
            variant="destructive"
            className={btnBaseClass}
            title="Remove from list"
            onClick={() => setDeleteTarget(row)}
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            <span className="truncate">Delete</span>
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
              Request More Info
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {pending && (
              <DropdownMenuItem onClick={() => onApprove(row)}>
                <Check className="mr-2 h-4 w-4 text-emerald-600" />
                Approve
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => openReject(row)}>
              <X className="mr-2 h-4 w-4 text-red-600" />
              Reject
            </DropdownMenuItem>
            {row.status === "suspended" ? (
              <DropdownMenuItem onClick={() => updateApplicationStatus(row.id, "approved")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => updateApplicationStatus(row.id, "suspended")}>
                <Ban className="mr-2 h-4 w-4 text-orange-600" />
                Suspend
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(row)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
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
            Review full applications, approve, or remove entries
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full min-w-0 sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button type="button" variant="outline" size="sm" className="gap-2 shrink-0" onClick={resetFromJson}>
            <RefreshCw className="h-4 w-4" />
            Reload JSON
          </Button> */}
        </div>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Factory className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 font-medium text-foreground">No applications</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              No rows match this filter. Try another status or reload sample JSON.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop / tablet: horizontal scroll table */}
          <Card className="hidden sm:block lg:px-6">
            <div className="w-full overflow-x-auto overscroll-x-contain">
              <Table className="min-w-[640px] w-full table-fixed sm:min-w-[720px] lg:min-w-0 lg:table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[22%] min-w-[140px]">Company</TableHead>
                    <TableHead className="w-[24%] min-w-[160px]">Contact</TableHead>
                    <TableHead className="w-[18%] min-w-[120px]">Location</TableHead>
                    <TableHead className="w-[12%] whitespace-nowrap">Submitted</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                    <TableHead className="w-[22%] min-w-[220px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={String(row.id)}>
                      <TableCell className="align-top">
                        <div className="flex items-start gap-2">
                          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="font-medium leading-snug wrap-break-word">{displayCompany(row)}</p>
                            {row.company_website && (
                              <a
                                href={row.company_website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-0.5 inline-flex items-center gap-1 text-xs text-secondary hover:underline break-all"
                              >
                                <Globe className="h-3 w-3 shrink-0" />
                                Site
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="space-y-1 text-sm min-w-0">
                          <span className="flex items-start gap-1.5 break-all">
                            <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            {row.email}
                          </span>
                          <span className="block text-muted-foreground">{displayName(row)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <span className="flex items-start gap-1 text-sm text-muted-foreground">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span className="wrap-break-word">
                            {[row.city, row.country].filter(Boolean).join(", ") || "—"}
                          </span>
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
                          {row.status || "pending"}
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
                      <p className="font-semibold leading-snug text-foreground wrap-break-word">
                        {displayCompany(row)}
                      </p>
                      <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground break-all">
                        <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {row.email}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{displayName(row)}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 capitalize">
                      {row.status || "pending"}
                    </Badge>
                  </div>
                  <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="wrap-break-word">{[row.city, row.country].filter(Boolean).join(", ") || "—"}</span>
                  </div>
                  {row.created_at && (
                    <p className="text-xs text-muted-foreground">
                      Submitted{" "}
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
              className="mt-2 min-h-[120px]"
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
              className="mt-2 min-h-[120px]"
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
            <Label>Reason for Rejection</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={submitReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete application?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Remove ${displayCompany(deleteTarget)} from this list? This demo action only affects your current session.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete()}
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
