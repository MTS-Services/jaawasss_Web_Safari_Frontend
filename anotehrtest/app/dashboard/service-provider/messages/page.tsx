"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useServiceRequests } from "@/lib/service-requests-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Send, MessageSquare } from "lucide-react"

export default function ServiceProviderMessagesPage() {
  const { user } = useAuth()
  const providerId = user?.id ?? "sp-1"
  const { getRequestsForProvider, addMessage } = useServiceRequests()

  const requests = getRequestsForProvider(providerId)
  const [activeId, setActiveId] = useState<string | null>(requests[0]?.id ?? null)
  const [draft, setDraft] = useState("")

  const active = requests.find((r) => r.id === activeId) ?? null

  const handleSend = () => {
    if (!active || !draft.trim()) return
    addMessage(active.id, "provider", draft.trim())
    setDraft("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Messages</h1>
        <p className="mt-1 text-muted-foreground">Chat with buyers about their service requests.</p>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <MessageSquare className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium text-foreground">No conversations yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Messages appear here when buyers contact you.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          {/* Conversation list */}
          <div className="space-y-1.5 rounded-xl border border-border bg-card p-2">
            {requests.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveId(r.id)}
                className={cn(
                  "w-full rounded-lg p-3 text-left transition-colors",
                  activeId === r.id ? "bg-secondary/10" : "hover:bg-muted",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-foreground">{r.buyerCompany}</span>
                  <Badge variant="outline" className="text-[10px]">{r.messages.length}</Badge>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{r.serviceNeeded}</p>
              </button>
            ))}
          </div>

          {/* Conversation thread */}
          <div className="flex min-h-[460px] flex-col rounded-xl border border-border bg-card">
            {active ? (
              <>
                <div className="border-b border-border p-4">
                  <p className="font-semibold text-foreground">{active.buyerCompany}</p>
                  <p className="text-sm text-muted-foreground">{active.serviceNeeded}</p>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Request: </span>
                    {active.description}
                  </div>
                  {active.messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn("flex", m.sender === "provider" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                          m.sender === "provider"
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
                      No messages yet. Send the first reply below.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 border-t border-border p-3">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your reply..."
                  />
                  <Button onClick={handleSend} size="icon" disabled={!draft.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-muted-foreground">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
