"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  getAdminCustomerSupportTicketById,
  replyAdminCustomerSupportTicket,
  updateAdminCustomerSupportTicket,
  type CustomerSupportTicketDetail,
  type CustomerSupportTicketMessage,
  type CustomerSupportTicketPriority,
  type CustomerSupportTicketStatus,
} from "@/lib/api/admin-customer-support-tickets"
import { ArrowLeft, Loader2, Paperclip, Send, Save } from "lucide-react"

function statusLabel(status: CustomerSupportTicketStatus): string {
  if (status === "in_progress") return "Open"
  if (status === "waiting_on_customer") return "Waiting On Customer"
  if (status === "resolved") return "Resolved"
  if (status === "closed") return "Closed"
  if (status === "open") return "Pending"
  return "Unknown"
}

function statusClass(status: CustomerSupportTicketStatus): string {
  if (status === "open") return "bg-amber-100 text-amber-700"
  if (status === "in_progress") return "bg-blue-100 text-blue-700"
  if (status === "waiting_on_customer") return "bg-orange-100 text-orange-700"
  if (status === "resolved") return "bg-green-100 text-green-700"
  if (status === "closed") return "bg-slate-100 text-slate-700"
  return "bg-muted text-muted-foreground"
}

function priorityClass(priority: CustomerSupportTicketPriority): string {
  if (priority === "urgent") return "bg-red-100 text-red-700"
  if (priority === "high") return "bg-orange-100 text-orange-700"
  if (priority === "medium") return "bg-blue-100 text-blue-700"
  if (priority === "low") return "bg-slate-100 text-slate-700"
  return "bg-muted text-muted-foreground"
}

function parseTicketId(rawId: string | string[] | undefined): number | null {
  const source = Array.isArray(rawId) ? rawId[0] : rawId
  if (!source) return null
  const parsed = Number(source)
  return Number.isFinite(parsed) ? parsed : null
}

function formatDate(value: string | null): string {
  if (!value) return "N/A"
  const asDate = new Date(value)
  if (!Number.isNaN(asDate.getTime())) {
    return asDate.toLocaleString()
  }
  return value
}

function displayMessageName(message: CustomerSupportTicketMessage): string {
  return message.user?.fullName || "Unknown User"
}

export default function AdminCustomerSupportTicketDetailsPage() {
  const params = useParams<{ ticketId: string }>()
  const ticketId = parseTicketId(params?.ticketId)
  const { user } = useAuth()
  const { toast } = useToast()

  const [ticket, setTicket] = useState<CustomerSupportTicketDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isReplying, setIsReplying] = useState(false)

  const [status, setStatus] = useState<CustomerSupportTicketStatus>("open")
  const [priority, setPriority] = useState<CustomerSupportTicketPriority>("medium")
  const [departmentType, setDepartmentType] = useState("sales")
  const [assignTo, setAssignTo] = useState("")

  const [replyMessage, setReplyMessage] = useState("")
  const [replyAttachments, setReplyAttachments] = useState<File[]>([])

  useEffect(() => {
    if (!ticketId) {
      setIsLoading(false)
      return
    }

    let mounted = true

    const loadTicket = async () => {
      setIsLoading(true)
      const response = await getAdminCustomerSupportTicketById(ticketId)

      if (!mounted) return

      if (!response.success || !response.data) {
        toast({
          title: "Failed to load ticket",
          description: response.message || "Please try again.",
          variant: "destructive",
        })
        setTicket(null)
        setIsLoading(false)
        return
      }

      setTicket(response.data)
      setStatus(response.data.status)
      setPriority(response.data.priority)
      setDepartmentType(response.data.departmentType || "sales")
      setAssignTo(response.data.assignedTo == null ? "" : String(response.data.assignedTo))
      setIsLoading(false)
    }

    void loadTicket()

    return () => {
      mounted = false
    }
  }, [ticketId, toast])

  const sortedMessages = useMemo(() => {
    if (!ticket?.messages) return []
    return [...ticket.messages].sort((a, b) => a.id - b.id)
  }, [ticket?.messages])

  const handleUpdateTicket = async () => {
    if (!ticketId) return

    setIsSaving(true)
    const response = await updateAdminCustomerSupportTicket(ticketId, {
      status,
      priority,
      departmentType,
      assignTo: assignTo.trim() ? Number(assignTo) : null,
    })
    setIsSaving(false)

    if (!response.success || !response.data) {
      toast({
        title: "Failed to update ticket",
        description: response.message || "Please try again.",
        variant: "destructive",
      })
      return
    }

    setTicket(response.data)
    toast({ title: "Ticket updated" })
  }

  const handleSendReply = async () => {
    if (!ticketId || !replyMessage.trim()) {
      toast({
        title: "Reply message required",
        description: "Please write a message before sending.",
        variant: "destructive",
      })
      return
    }

    setIsReplying(true)
    const response = await replyAdminCustomerSupportTicket(ticketId, {
      message: replyMessage.trim(),
      attachments: replyAttachments,
    })
    setIsReplying(false)

    if (!response.success || !response.data) {
      toast({
        title: "Failed to send reply",
        description: response.message || "Please try again.",
        variant: "destructive",
      })
      return
    }

    setTicket(response.data)
    setStatus(response.data.status)
    setPriority(response.data.priority)
    setDepartmentType(response.data.departmentType || "sales")
    setAssignTo(response.data.assignedTo == null ? "" : String(response.data.assignedTo))

    setReplyMessage("")
    setReplyAttachments([])
    toast({ title: "Reply sent" })
  }

  if (!ticketId) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link href="/admin/customer-supports/tickets" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back To Tickets
          </Link>
        </Button>
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Invalid ticket id.
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link href="/admin/customer-supports/tickets" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back To Tickets
          </Link>
        </Button>
        <div className="rounded-lg border border-dashed border-border py-14 text-center text-muted-foreground">
          Ticket not found.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Button variant="outline" asChild className="mb-3">
            <Link href="/admin/customer-supports/tickets" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back To Tickets
            </Link>
          </Button>
          <h1 className="font-serif text-2xl font-medium text-foreground">Ticket #{ticket.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{ticket.subject}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusClass(ticket.status)}>{statusLabel(ticket.status)}</Badge>
          <Badge className={priorityClass(ticket.priority)}>{ticket.priority}</Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 lg:col-span-1 space-y-4">
          <h2 className="font-medium text-foreground">Ticket Settings</h2>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as CustomerSupportTicketStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Pending</SelectItem>
                <SelectItem value="in_progress">Open</SelectItem>
                <SelectItem value="waiting_on_customer">Waiting On Customer</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as CustomerSupportTicketPriority)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department-type">Department Type</Label>
            <Input
              id="department-type"
              value={departmentType}
              onChange={(event) => setDepartmentType(event.target.value)}
              placeholder="sales / technical / billing"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assign-to">Assign To (Admin ID)</Label>
            <Input
              id="assign-to"
              type="number"
              value={assignTo}
              onChange={(event) => setAssignTo(event.target.value)}
              placeholder="Leave empty for unassigned"
            />
          </div>

          <Button className="w-full gap-2" onClick={() => void handleUpdateTicket()} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Ticket Changes
          </Button>

          <div className="rounded-lg border border-border p-3 text-xs text-muted-foreground space-y-1">
            <p>Requester: {ticket.user?.fullName || "N/A"}</p>
            <p>Email: {ticket.user?.email || "N/A"}</p>
            <p>Role: {ticket.user?.role || "unknown"}</p>
            <p>Created: {formatDate(ticket.createdAt)}</p>
            <p>Updated: {formatDate(ticket.updatedAt)}</p>
            <p>Assignee: {ticket.assignee?.fullName || "Unassigned"}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2 space-y-4">
          <h2 className="font-medium text-foreground">Conversation</h2>

          <div className="max-h-130 space-y-3 overflow-y-auto rounded-lg border border-border bg-muted/20 p-3">
            {sortedMessages.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              sortedMessages.map((message) => {
                const isMine = user?.id != null && Number(user.id) === message.userId

                return (
                  <div
                    key={message.id}
                    className={`rounded-lg border px-3 py-2 ${
                      isMine
                        ? "ml-8 border-blue-200 bg-blue-50"
                        : "mr-8 border-border bg-background"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{displayMessageName(message)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</p>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{message.message}</p>

                    {message.attachments.length > 0 ? (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-xs text-blue-700 hover:underline"
                          >
                            <Paperclip className="h-3.5 w-3.5" />
                            {attachment.originalName}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              })
            )}
          </div>

          <div className="space-y-3 rounded-lg border border-border p-3">
            <Label htmlFor="reply-message">Reply Message</Label>
            <Textarea
              id="reply-message"
              value={replyMessage}
              onChange={(event) => setReplyMessage(event.target.value)}
              placeholder="Write your response to the customer"
              rows={4}
            />

            <div className="space-y-2">
              <Label htmlFor="reply-attachments">Attachments</Label>
              <Input
                id="reply-attachments"
                type="file"
                multiple
                onChange={(event) => setReplyAttachments(Array.from(event.target.files || []))}
              />
              {replyAttachments.length > 0 ? (
                <div className="space-y-1 text-xs text-muted-foreground">
                  {replyAttachments.map((file, index) => (
                    <p key={`${file.name}-${index}`}>{file.name}</p>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end">
              <Button
                className="gap-2"
                onClick={() => void handleSendReply()}
                disabled={isReplying || !replyMessage.trim()}
              >
                {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
