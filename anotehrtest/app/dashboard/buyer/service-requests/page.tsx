"use client"

import { useState } from "react"
import Link from "next/link"
import { useServiceRequests, type ServiceRequestStatus } from "@/lib/service-requests-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Paperclip,
  MessageSquare,
  Send,
  ExternalLink,
} from "lucide-react"

const statusConfig: Record<ServiceRequestStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-amber-100 text-amber-700" },
  "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
  declined: { label: "Declined", color: "bg-red-100 text-red-700" },
}

// Fallback identity for the demo seed data when no user is signed in.
const DEMO_BUYER_EMAIL = "buyer@demo.com"

export default function BuyerServiceRequestsPage() {
  const { requests, addMessage } = useServiceRequests()
  const { user } = useAuth()
  const buyerEmail = user?.email ?? DEMO_BUYER_EMAIL
  // Show requests owned by the current buyer, plus the demo seed data.
  const myRequests = requests.filter(
    (r) => r.buyerEmail === buyerEmail || r.buyerEmail === DEMO_BUYER_EMAIL,
  )

  const [activeId, setActiveId] = useState<string | null>(null)
  const [draft, setDraft] = useState("")

  const active = myRequests.find((r) => r.id === activeId) ?? null

  const handleSend = () => {
    if (!active || !draft.trim()) return
    addMessage(active.id, "buyer", draft.trim())
    setDraft("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Service Requests</h1>
        <p className="mt-1 text-muted-foreground">Track the services you&apos;ve requested from providers.</p>
      </div>

      {myRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Briefcase className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium text-foreground">No service requests yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse providers and request a service to get started.
          </p>
          <Button asChild className="mt-4">
            <Link href="/service-providers">Browse Service Providers</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {myRequests.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">{r.serviceNeeded}</h3>
                    <Badge className={statusConfig[r.status].color}>{statusConfig[r.status].label}</Badge>
                  </div>
                  <Link
                    href={`/service-providers/${r.providerSlug}`}
                    className="mt-0.5 inline-flex items-center gap-1 text-sm text-secondary hover:underline"
                  >
                    {r.providerName}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {r.countryRegion}
                    </span>
                    {r.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {r.deadline}
                      </span>
                    )}
                    {r.budget && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        {r.budget}
                      </span>
                    )}
                    {r.fileNames.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-3.5 w-3.5" />
                        {r.fileNames.length} file{r.fileNames.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveId(r.id)}>
                  <MessageSquare className="h-4 w-4" />
                  Messages
                  {r.messages.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {r.messages.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conversation dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg">
          <DialogHeader>
            <DialogTitle>{active?.providerName}</DialogTitle>
          </DialogHeader>
          {active && (
            <div className="flex max-h-[60vh] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Your request: </span>
                  {active.description}
                </div>
                {active.messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.sender === "buyer" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                        m.sender === "buyer"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-foreground",
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {active.messages.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No messages yet. Send a message to the provider.
                  </p>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                />
                <Button onClick={handleSend} size="icon" disabled={!draft.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
