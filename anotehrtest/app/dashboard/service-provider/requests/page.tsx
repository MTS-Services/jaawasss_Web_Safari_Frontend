"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useServiceRequests, type ServiceRequestStatus } from "@/lib/service-requests-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Inbox, Send, Paperclip, Calendar, DollarSign, MapPin, Building2, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  new: "bg-secondary/15 text-secondary",
  "in-progress": "bg-info/15 text-info",
  completed: "bg-success/15 text-success",
  declined: "bg-muted text-muted-foreground",
}

const statusOptions: { value: ServiceRequestStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "declined", label: "Declined" },
]

export default function ServiceProviderRequestsPage() {
  const { user } = useAuth()
  const { getRequestsForProvider, updateRequestStatus, addMessage } = useServiceRequests()
  const providerId = user?.id ?? "sp-1"
  const myRequests = getRequestsForProvider(providerId)

  const [selectedId, setSelectedId] = useState<string | null>(myRequests[0]?.id ?? null)
  const [reply, setReply] = useState("")

  const selected = myRequests.find((r) => r.id === selectedId) ?? null

  const handleSend = () => {
    if (!selected || !reply.trim()) return
    addMessage(selected.id, "provider", reply.trim())
    if (selected.status === "new") updateRequestStatus(selected.id, "in-progress")
    setReply("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Service Requests</h1>
        <p className="mt-1 text-muted-foreground">Requests from buyers who want to work with you.</p>
      </div>

      {myRequests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 font-medium text-foreground">No requests yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When buyers request your services, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* List */}
          <div className="space-y-3">
            {myRequests.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelectedId(req.id)}
                className={cn(
                  "w-full rounded-xl border bg-card p-4 text-left transition-colors",
                  selectedId === req.id ? "border-secondary ring-1 ring-secondary" : "border-border hover:border-secondary",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium text-foreground">{req.serviceNeeded}</p>
                  <Badge className={statusStyles[req.status]} variant="secondary">
                    {req.status === "in-progress" ? "In progress" : req.status}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{req.buyerCompany || req.buyerName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>

          {/* Detail */}
          {selected && (
            <div className="rounded-xl border border-border bg-card">
              <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground">{selected.serviceNeeded}</h2>
                  <p className="text-sm text-muted-foreground">{selected.categoryName}</p>
                </div>
                <Select
                  value={selected.status}
                  onValueChange={(v) => updateRequestStatus(selected.id, v as ServiceRequestStatus)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-5 p-5">
                {/* Buyer + meta */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {selected.buyerCompany || selected.buyerName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {selected.buyerEmail || "—"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selected.countryRegion || "Remote"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Deadline: {selected.deadline || "Flexible"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Budget: {selected.budget || "Not specified"}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">Request details</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
                </div>

                {selected.notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Additional notes</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{selected.notes}</p>
                  </div>
                )}

                {selected.fileNames.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Attachments</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selected.fileNames.map((name) => (
                        <Badge key={name} variant="outline" className="gap-1">
                          <Paperclip className="h-3 w-3" />
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversation */}
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground">Conversation</h3>
                  <div className="mt-3 space-y-3">
                    {selected.messages.length === 0 && (
                      <p className="text-sm text-muted-foreground">No messages yet. Reply to start the conversation.</p>
                    )}
                    {selected.messages.map((m) => (
                      <div
                        key={m.id}
                        className={cn("flex", m.sender === "provider" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                            m.sender === "provider"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground",
                          )}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Write a reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend()
                      }}
                    />
                    <Button onClick={handleSend} className="gap-2">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
