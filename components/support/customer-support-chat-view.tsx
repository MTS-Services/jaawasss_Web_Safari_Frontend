"use client"

import React, { useEffect, useMemo, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { format, isToday, isYesterday } from "date-fns"
import { 
  Headset, 
  Plus, 
  ShieldCheck, 
  CornerDownLeft, 
  Send, 
  Paperclip, 
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
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
  getMyCustomerSupportTicketById,
  replyCustomerSupportTicket,
  type CustomerTicket,
  type CustomerTicketDetail,
  type CustomerTicketPriority,
  type CustomerTicketStatus,
} from "@/lib/api/customer-support-tickets"
import { useAuth } from "@/lib/auth-context"

interface CustomerSupportChatViewProps {
  basePath: string
  initialTicketId?: string | null
}

function StatusTag({ status }: { status: CustomerTicketStatus }) {
  if (status === "open" || status === "waiting_on_customer") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
        {status === "open" ? "Pending" : "Waiting"}
      </span>
    )
  }
  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
        Open
      </span>
    )
  }
  if (status === "resolved" || status === "closed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
        {status === "resolved" ? "Resolved" : "Closed"}
      </span>
    )
  }
  return null
}

function formatRelativeTime(dateString: string | null) {
  if (!dateString) return ""
  const date = new Date(dateString)
  if (isToday(date)) {
    return format(date, "h:mm a")
  }
  if (isYesterday(date)) {
    return "Yesterday"
  }
  return format(date, "MMM d")
}

function formatDateHeader(dateString: string | null) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return format(date, "EEEE, MMMM d")
}

export function CustomerSupportChatView({ basePath, initialTicketId }: CustomerSupportChatViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  
  // State for tickets list
  const [tickets, setTickets] = useState<CustomerTicket[]>([])
  const [isListLoading, setIsListLoading] = useState(true)
  const [totalTickets, setTotalTickets] = useState(0)

  // State for active ticket detail
  const [activeTicketId, setActiveTicketId] = useState<number | null>(
    initialTicketId ? Number(initialTicketId) : null
  )
  const [activeTicket, setActiveTicket] = useState<CustomerTicketDetail | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  // State for replying
  const [replyMessage, setReplyMessage] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // State for creating new ticket
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newSubject, setNewSubject] = useState("")
  const [newDepartment, setNewDepartment] = useState("sales")
  const [newMessage, setNewMessage] = useState("")
  const [newPriority, setNewPriority] = useState<CustomerTicketPriority>("medium")
  const [newAttachments, setNewAttachments] = useState<File[]>([])

  // Fetch tickets list
  const fetchTicketsList = async () => {
    const res = await getMyCustomerSupportTickets(1, 50)
    if (res.success) {
      setTickets(res.data)
      setTotalTickets(res.meta?.total || res.data.length)
      
      // If we have no active ticket but we have tickets, optionally auto-select the first one
      if (!activeTicketId && res.data.length > 0 && !initialTicketId) {
        // Only auto-select on desktop sizes to prevent hiding the list on mobile
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
          setActiveTicketId(res.data[0].id)
        }
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to load conversations.",
        variant: "destructive"
      })
    }
    setIsListLoading(false)
  }

  useEffect(() => {
    setIsListLoading(true)
    fetchTicketsList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch active ticket details
  useEffect(() => {
    let mounted = true

    const fetchDetail = async () => {
      if (!activeTicketId) {
        setActiveTicket(null)
        return
      }
      setIsDetailLoading(true)
      const res = await getMyCustomerSupportTicketById(activeTicketId)
      if (!mounted) return
      
      if (res.success && res.data) {
        setActiveTicket(res.data)
        // Scroll to bottom when new ticket loads
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      } else {
        toast({
          title: "Error",
          description: "Failed to load the selected conversation.",
          variant: "destructive"
        })
        setActiveTicket(null)
      }
      setIsDetailLoading(false)
    }

    fetchDetail()

    return () => {
      mounted = false
    }
  }, [activeTicketId, toast])

  const handleTicketSelect = (id: number | null) => {
    setActiveTicketId(id)
    if (id) {
      router.push(`${basePath}/${id}`, { scroll: false })
    } else {
      router.push(`${basePath}`, { scroll: false })
    }
  }

  const handleCreateNewTicket = async () => {
    if (!newSubject.trim() || !newMessage.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please provide both a subject and a message.",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    const res = await createCustomerSupportTicket({
      subject: newSubject.trim(),
      departmentType: newDepartment,
      message: newMessage.trim(),
      priority: newPriority,
      attachments: newAttachments
    })
    setIsCreating(false)

    if (res.success && res.data) {
      toast({ title: "Ticket created successfully" })
      setIsNewModalOpen(false)
      // Reset form
      setNewSubject("")
      setNewMessage("")
      setNewAttachments([])
      setNewPriority("medium")
      setNewDepartment("sales")
      
      // Refresh list and select new ticket
      await fetchTicketsList()
      handleTicketSelect(res.data.id)
    } else {
      toast({
        title: "Failed to create ticket",
        description: res.message || "Please try again later.",
        variant: "destructive"
      })
    }
  }

  const handleSendReply = async () => {
    if (!activeTicketId || !replyMessage.trim()) return

    setIsReplying(true)
    const res = await replyCustomerSupportTicket(activeTicketId, {
      message: replyMessage.trim()
    })
    setIsReplying(false)

    if (res.success && res.data) {
      setActiveTicket(res.data)
      setReplyMessage("")
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else {
      toast({
        title: "Failed to send message",
        description: res.message || "Please try again later.",
        variant: "destructive"
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendReply()
    }
  }

  const sortedMessages = useMemo(() => {
    if (!activeTicket?.messages) return []
    return [...activeTicket.messages].sort((a, b) => a.id - b.id)
  }, [activeTicket?.messages])

  const hasAdminReplied = useMemo(() => {
    if (!sortedMessages.length) return false
    // If there is any message from someone other than the current user, it's an admin reply
    return sortedMessages.some(m => m.userId?.toString() !== user?.id?.toString())
  }, [sortedMessages, user?.id])

  return (
    <div className="flex h-[calc(100dvh-120px)] w-full max-w-full flex-col">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#4a3424] text-white">
            <Headset className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Support</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Get help from the SourceNest team.</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsNewModalOpen(true)}
          className="bg-[#4a3424] hover:bg-[#3d2a1d] text-white gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          New conversation
        </Button>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* Left Sidebar - Conversations List */}
        <div className={`w-full flex-col rounded-xl border border-border bg-white shadow-sm overflow-hidden lg:max-w-[320px] xl:max-w-[380px] ${activeTicketId ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-foreground">Your conversations</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {totalTickets}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isListLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <p className="text-sm">No conversations yet.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {tickets.map((t) => {
                  const isActive = t.id === activeTicketId
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleTicketSelect(t.id)}
                      className={`relative flex flex-col items-start gap-2 border-b border-border p-4 text-left transition-colors hover:bg-slate-50 ${
                        isActive ? "bg-slate-50" : ""
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-amber-500 rounded-r-full" />
                      )}
                      
                      <div className="flex w-full items-start justify-between gap-2">
                        <span className="line-clamp-1 font-medium text-foreground">
                          {t.subject}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatRelativeTime(t.updatedAt || t.createdAt)}
                        </span>
                      </div>
                      
                      {/* Fake excerpt for the list since the API doesn't return the last message text in the list response */}
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        Ticket #{t.id} • {t.departmentType}
                      </p>
                      
                      <div className="mt-1 flex items-center gap-2">
                        <StatusTag status={t.status} />
                        <span className="text-xs text-muted-foreground">T-{t.id}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Area - Chat View */}
        <div className={`flex-1 flex-col rounded-xl border border-border bg-white shadow-sm overflow-hidden relative ${!activeTicketId ? 'hidden lg:flex' : 'flex'}`}>
          {!activeTicketId ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Headset className="mb-4 h-12 w-12 opacity-20" />
              <p>Select a conversation from the list or start a new one.</p>
            </div>
          ) : isDetailLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !activeTicket ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Conversation not found.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-border p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Button variant="ghost" size="icon" className="lg:hidden shrink-0 mr-1 -ml-2" onClick={() => handleTicketSelect(null)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <Headset className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-foreground text-sm sm:text-base">{activeTicket.subject}</h2>
                    <p className="truncate text-[10px] sm:text-xs text-muted-foreground">
                      SourceNest Support • T-{activeTicket.id}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 ml-2">
                  <StatusTag status={activeTicket.status} />
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
                {/* Initial ticket creation message */}
                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-muted-foreground">
                      {formatDateHeader(activeTicket.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end w-full">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#4a3424] px-4 py-3 text-[15px] text-white">
                    <p className="whitespace-pre-wrap wrap-break-word">{activeTicket.subject}</p>
                    <div className="mt-1 flex items-center justify-end text-[11px] text-white/70">
                      You · {formatRelativeTime(activeTicket.createdAt)}
                    </div>
                  </div>
                </div>

                {/* The rest of the messages */}
                {sortedMessages.map((msg, idx) => {
                  const isCurrentUser = msg.userId?.toString() === user?.id?.toString()
                  
                  // Add date separator if it's a new day compared to previous message
                  const prevMsgDate = idx > 0 ? sortedMessages[idx-1].createdAt : activeTicket.createdAt
                  const showDateSeparator = msg.createdAt && prevMsgDate && 
                    new Date(msg.createdAt).toDateString() !== new Date(prevMsgDate).toDateString()

                  return (
                    <React.Fragment key={msg.id}>
                      {showDateSeparator && (
                        <div className="relative flex items-center justify-center py-2">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-2 text-muted-foreground">
                              {formatDateHeader(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className={`flex w-full ${isCurrentUser ? "justify-end" : "justify-start"} items-end gap-2`}>
                        {!isCurrentUser && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 mb-1">
                            <Headset className="h-4 w-4" />
                          </div>
                        )}
                        
                        <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} max-w-[80%]`}>
                          <div 
                            className={`rounded-2xl px-4 py-3 text-[15px] ${
                              isCurrentUser 
                                ? "bg-[#4a3424] text-white rounded-tr-sm" 
                                : "bg-slate-100 text-slate-800 rounded-tl-sm"
                            }`}
                          >
                            <p className="whitespace-pre-wrap wrap-break-word">{msg.message}</p>
                            
                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {msg.attachments.map(att => (
                                  <a
                                    key={att.id}
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-1.5 text-xs hover:underline ${
                                      isCurrentUser ? "text-white/90" : "text-blue-600"
                                    }`}
                                  >
                                    <Paperclip className="h-3 w-3" />
                                    {att.originalName}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-1 flex items-center text-[11px] text-muted-foreground px-1">
                            {isCurrentUser ? "You" : msg.user?.fullName || "Support"} · {formatRelativeTime(msg.createdAt)}
                          </div>
                        </div>

                        {isCurrentUser && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 mb-1 text-xs font-medium uppercase">
                            {user?.name?.substring(0, 2) || "ME"}
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Area */}
              <div className="bg-white p-4">
                {!hasAdminReplied && activeTicket.status !== "closed" && activeTicket.status !== "resolved" && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2 text-sm text-amber-800">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                    Our team is reviewing your request. Avg. first reply under an hour.
                  </div>
                )}
                
                {activeTicket.status === "closed" || activeTicket.status === "resolved" ? (
                  <div className="rounded-lg border border-border bg-slate-50 p-4 text-center text-sm text-muted-foreground">
                    This conversation has been {activeTicket.status}.
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-white p-1 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all shadow-sm">
                    <Textarea 
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a message to support..."
                      className="min-h-[60px] resize-none border-0 shadow-none focus-visible:ring-0 px-3 py-2 text-[15px]"
                    />
                    <div className="flex items-center justify-between px-2 pb-1 pt-2 border-t border-border/50">
                      <div className="flex items-center text-xs text-muted-foreground gap-1.5 ml-1">
                        <CornerDownLeft className="h-3.5 w-3.5" />
                        Enter to send
                      </div>
                      <Button 
                        size="sm" 
                        onClick={handleSendReply}
                        disabled={!replyMessage.trim() || isReplying}
                        className="bg-[#9c8475] hover:bg-[#867061] text-white rounded-lg h-8 px-4 font-medium"
                      >
                        {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-1.5" />}
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Start a new support request. Please provide as much detail as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="What do you need help with?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={newDepartment} onValueChange={setNewDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newPriority} onValueChange={(val) => setNewPriority(val as CustomerTicketPriority)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                rows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments</Label>
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={(e) => setNewAttachments(Array.from(e.target.files || []))}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#4a3424] hover:bg-[#3d2a1d] text-white" 
              onClick={handleCreateNewTicket}
              disabled={isCreating}
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
