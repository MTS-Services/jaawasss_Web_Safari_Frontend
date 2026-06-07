"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
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
import { useToast } from "@/hooks/use-toast"
import {
  createCustomerSupportTicket,
  getMyCustomerSupportTickets,
  type CustomerTicket,
  type CustomerTicketPriority,
  type CustomerTicketStatus,
} from "@/lib/api/customer-support-tickets"
import { Loader2, Ticket, PlusCircle, Paperclip } from "lucide-react"

interface CustomerSupportTicketsPageProps {
  title: string
  basePath: string
}

function statusLabel(status: CustomerTicketStatus): string {
  if (status === "in_progress") return "In Progress"
  if (status === "waiting_on_customer") return "Waiting On Customer"
  if (status === "resolved") return "Resolved"
  if (status === "closed") return "Closed"
  if (status === "open") return "Open"
  return "Unknown"
}

function statusClass(status: CustomerTicketStatus): string {
  if (status === "open") return "bg-amber-100 text-amber-700"
  if (status === "in_progress") return "bg-blue-100 text-blue-700"
  if (status === "waiting_on_customer") return "bg-orange-100 text-orange-700"
  if (status === "resolved") return "bg-green-100 text-green-700"
  if (status === "closed") return "bg-slate-100 text-slate-700"
  return "bg-muted text-muted-foreground"
}

function priorityClass(priority: CustomerTicketPriority): string {
  if (priority === "urgent") return "bg-red-100 text-red-700"
  if (priority === "high") return "bg-orange-100 text-orange-700"
  if (priority === "medium") return "bg-blue-100 text-blue-700"
  if (priority === "low") return "bg-slate-100 text-slate-700"
  return "bg-muted text-muted-foreground"
}

export function CustomerSupportTicketsPage({ title, basePath }: CustomerSupportTicketsPageProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [tickets, setTickets] = useState<CustomerTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  const [page, setPage] = useState(1)
  const [perPage] = useState(15)
  const [meta, setMeta] = useState<{
    currentPage: number
    lastPage: number
    total: number
    from: number | null
    to: number | null
  } | null>(null)

  const [subject, setSubject] = useState("")
  const [departmentType, setDepartmentType] = useState("sales")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState<CustomerTicketPriority>("medium")
  const [attachments, setAttachments] = useState<File[]>([])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setIsLoading(true)
      const response = await getMyCustomerSupportTickets(page, perPage)

      if (!mounted) return

      if (!response.success) {
        toast({
          title: "Failed to load support tickets",
          description: response.message || "Please refresh and try again.",
          variant: "destructive",
        })
        setTickets([])
        setMeta(null)
        setIsLoading(false)
        return
      }

      setTickets(response.data)
      setMeta(
        response.meta
          ? {
              currentPage: response.meta.currentPage,
              lastPage: response.meta.lastPage,
              total: response.meta.total,
              from: response.meta.from,
              to: response.meta.to,
            }
          : null
      )
      setIsLoading(false)
    }

    void load()

    return () => {
      mounted = false
    }
  }, [page, perPage, toast])

  const counters = useMemo(
    () => ({
      open: tickets.filter((ticket) => ticket.status === "open").length,
      inProgress: tickets.filter((ticket) => ticket.status === "in_progress").length,
      waitingOnCustomer: tickets.filter((ticket) => ticket.status === "waiting_on_customer").length,
      resolved: tickets.filter((ticket) => ticket.status === "resolved").length,
      closed: tickets.filter((ticket) => ticket.status === "closed").length,
    }),
    [tickets]
  )

  const handleCreate = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing required fields",
        description: "Subject and message are required.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    const response = await createCustomerSupportTicket({
      subject: subject.trim(),
      departmentType,
      message: message.trim(),
      priority,
      attachments,
    })
    setIsCreating(false)

    if (!response.success || !response.data) {
      toast({
        title: "Failed to create ticket",
        description: response.message || "Please try again.",
        variant: "destructive",
      })
      return
    }

    toast({ title: "Ticket created successfully" })
    setSubject("")
    setDepartmentType("sales")
    setMessage("")
    setPriority("medium")
    setAttachments([])

    router.push(`${basePath}/${response.data.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your support tickets and create a new ticket with message and attachments.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-medium text-foreground">Create New Ticket</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ticket-subject">Subject *</Label>
            <Input
              id="ticket-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Describe your issue"
            />
          </div>

          <div className="space-y-2">
            <Label>Department *</Label>
            <Select value={departmentType} onValueChange={setDepartmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="ticket-message">Message *</Label>
            <Textarea
              id="ticket-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="Explain your issue in detail"
            />
          </div>

          <div className="space-y-2">
            <Label>Priority *</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as CustomerTicketPriority)}>
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
            <Label htmlFor="ticket-attachments">Attachments</Label>
            <Input
              id="ticket-attachments"
              type="file"
              multiple
              onChange={(event) => setAttachments(Array.from(event.target.files || []))}
            />
            {attachments.length > 0 ? (
              <div className="space-y-1 text-xs text-muted-foreground">
                {attachments.map((file, index) => (
                  <p key={`${file.name}-${index}`} className="flex items-center gap-1">
                    <Paperclip className="h-3.5 w-3.5" />
                    {file.name}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button className="gap-2" onClick={() => void handleCreate()} disabled={isCreating}>
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            Create Ticket
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Open</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{counters.open}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{counters.inProgress}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Waiting On Customer</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{counters.waitingOnCustomer}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Resolved</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{counters.resolved}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Closed</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{counters.closed}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
          No support tickets found.
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Ticket #{ticket.id}</span>
                  </div>
                  <h3 className="mt-1 font-semibold text-foreground">{ticket.subject}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={statusClass(ticket.status)}>{statusLabel(ticket.status)}</Badge>
                  <Badge className={priorityClass(ticket.priority)}>{ticket.priority}</Badge>
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                <p>Department: {ticket.departmentType}</p>
                <p>Assigned: {ticket.assignee?.fullName || "Unassigned"}</p>
                <p>Created: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}</p>
              </div>

              <div className="mt-3">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`${basePath}/${ticket.id}`}>View Ticket</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {meta?.from ?? 0} - {meta?.to ?? tickets.length} of {meta?.total ?? tickets.length}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={isLoading || (meta ? meta.currentPage <= 1 : page <= 1)}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {meta?.currentPage ?? page} / {meta?.lastPage ?? 1}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isLoading || (meta ? meta.currentPage >= meta.lastPage : tickets.length < perPage)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
