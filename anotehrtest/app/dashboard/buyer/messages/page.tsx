"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useMessages, formatChatTime, type ChatMessage } from "@/lib/messages-context"
import {
  Search,
  Send,
  Paperclip,
  Factory,
  CheckCircle,
  MoreHorizontal,
  Languages,
  Wand2,
  Loader2,
  X,
  Image,
  FileText,
  Check,
  ChevronLeft,
  CornerDownLeft,
  PackagePlus,
  RefreshCw,
  ArrowRight,
} from "lucide-react"

// Static demo conversations (inquiries that haven't turned into orders yet).
const mockConversations = [
  {
    id: "mock-1",
    name: "TechVision Electronics",
    lastMessage: "Thank you for your inquiry. We can offer a competitive price for the TWS earbuds...",
    time: "2h ago",
    unread: true,
    reviewed: true,
    online: true,
  },
  {
    id: "mock-2",
    name: "EcoThread Textiles",
    lastMessage: "The samples have been shipped via DHL. Here is the tracking number: DHL1234567890",
    time: "5h ago",
    unread: true,
    reviewed: true,
    online: false,
  },
  {
    id: "mock-3",
    name: "GlobalFab Machinery",
    lastMessage: "Please find the attached quotation for the CNC machining center.",
    time: "1d ago",
    unread: false,
    reviewed: true,
    online: true,
  },
]

const mockMessages: Record<string, { id: string; sender: string; text: string; time: string; status?: string }[]> = {
  "mock-1": [
    { id: "1", sender: "supplier", text: "Hello! Thank you for reaching out to TechVision Electronics. How can I assist you today?", time: "10:30 AM" },
    { id: "2", sender: "buyer", text: "Hi, I'm interested in your TWS Wireless Earbuds Pro. Can you provide pricing for an order of 5000 units?", time: "10:32 AM", status: "read" },
    { id: "3", sender: "supplier", text: "Of course! For an order of 5000 units, we can offer $14.50 per unit. This includes the standard packaging. Would you like any customization?", time: "10:45 AM" },
    { id: "4", sender: "buyer", text: "Yes, we'd like custom branding. Can you send samples first?", time: "10:48 AM", status: "read" },
    { id: "5", sender: "supplier", text: "Thank you for your inquiry. We can offer a competitive price for the TWS earbuds. I'll prepare a formal quotation and send it to you shortly.", time: "2:15 PM" },
  ],
  "mock-2": [
    { id: "1", sender: "buyer", text: "Hello, I received your catalog. The organic cotton collection looks interesting.", time: "9:00 AM", status: "read" },
    { id: "2", sender: "supplier", text: "Thank you for your interest! Our organic cotton is GOTS certified. What products are you looking for?", time: "9:15 AM" },
    { id: "3", sender: "supplier", text: "The samples have been shipped via DHL. Here is the tracking number: DHL1234567890", time: "5 hours ago" },
  ],
  "mock-3": [
    { id: "1", sender: "supplier", text: "Please find the attached quotation for the CNC machining center.", time: "Yesterday" },
  ],
}

interface UIConversation {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: boolean
  reviewed: boolean
  online: boolean
  isOrderThread: boolean
}

export default function BuyerMessagesPage() {
  const { user } = useAuth()
  const { getThreadsForBuyer, sendChatMessage } = useMessages()
  const [newMessage, setNewMessage] = useState("")
  const [showConversations, setShowConversations] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // AI Assistant states
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const [aiAction, setAiAction] = useState<"improve" | "translate" | null>(null)
  const [originalMessage, setOriginalMessage] = useState("")

  // Local copy of mock messages (order threads live in the shared context)
  const [localMockMessages, setLocalMockMessages] = useState(mockMessages)
  const [isSending, setIsSending] = useState(false)

  // Live order/engagement threads delivered into the buyer's conversations.
  const orderThreads = getThreadsForBuyer(user?.email ?? "buyer@demo.com")

  const orderConversations: UIConversation[] = orderThreads.map((t) => {
    const last = t.messages[t.messages.length - 1]
    return {
      id: t.id,
      name: t.sellerName,
      lastMessage: last ? lastMessagePreview(last) : "Order conversation",
      time: t.updatedAt ? formatChatTime(t.updatedAt) : "",
      unread: false,
      reviewed: true,
      online: false,
      isOrderThread: true,
    }
  })

  const allConversations: UIConversation[] = [
    ...orderConversations,
    ...mockConversations.map((c) => ({ ...c, isOrderThread: false })),
  ]

  const [selectedId, setSelectedId] = useState<string>(allConversations[0]?.id ?? "")
  const selectedConversation =
    allConversations.find((c) => c.id === selectedId) ?? allConversations[0]
  const selectedThread = orderThreads.find((t) => t.id === selectedConversation?.id)

  const filteredConversations = allConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedId, selectedThread?.messages.length, localMockMessages])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending || !selectedConversation) return

    setIsSending(true)
    const messageText = newMessage.trim()
    setNewMessage("")
    setOriginalMessage("")
    if (inputRef.current) inputRef.current.style.height = "auto"

    if (selectedConversation.isOrderThread) {
      // Post into the shared buyer↔seller thread.
      sendChatMessage(selectedConversation.id, "buyer", messageText)
      await new Promise((r) => setTimeout(r, 300))
      setIsSending(false)
      return
    }

    // Mock conversation path
    const newMsg = {
      id: Date.now().toString(),
      sender: "buyer",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending",
    }
    setLocalMockMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMsg],
    }))
    await new Promise((r) => setTimeout(r, 500))
    setLocalMockMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: prev[selectedConversation.id].map((m) =>
        m.id === newMsg.id ? { ...m, status: "sent" } : m,
      ),
    }))
    setIsSending(false)
  }

  const handleImproveMessage = async () => {
    if (!newMessage.trim()) return
    setIsAIProcessing(true)
    setAiAction("improve")
    setOriginalMessage(newMessage)
    await new Promise((r) => setTimeout(r, 600))
    const text = newMessage.toLowerCase().trim()
    let improved = newMessage
    if (text.includes("price") || text.includes("cost") || text.includes("quote")) {
      improved = "I am writing to inquire about pricing for your products. Could you please provide a detailed quotation including unit prices, MOQ, and shipping costs?"
    } else if (text.includes("sample")) {
      improved = "I would like to request product samples for evaluation. Could you please advise on sample costs and delivery timeframe?"
    } else if (text.length < 30) {
      improved = `Hello, ${newMessage.charAt(0).toUpperCase() + newMessage.slice(1).trim()}. I look forward to your response.`
    } else {
      improved = `${newMessage.charAt(0).toUpperCase() + newMessage.slice(1).trim()}. I appreciate your time and look forward to your response.`
    }
    setNewMessage(improved)
    setIsAIProcessing(false)
    setAiAction(null)
  }

  const handleTranslate = async () => {
    if (!newMessage.trim()) return
    setIsAIProcessing(true)
    setAiAction("translate")
    setOriginalMessage(newMessage)
    await new Promise((r) => setTimeout(r, 600))
    setNewMessage(`${newMessage.charAt(0).toUpperCase() + newMessage.slice(1).trim()}.`)
    setIsAIProcessing(false)
    setAiAction(null)
  }

  const handleRevertMessage = () => {
    if (originalMessage) {
      setNewMessage(originalMessage)
      setOriginalMessage("")
    }
  }

  const unreadCount = allConversations.filter((c) => c.unread).length

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-medium text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "Order updates arrive here"}
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-lg border border-border bg-card">
        {/* Conversations List */}
        <div
          className={cn(
            "w-full flex-shrink-0 border-r border-border md:w-72 lg:w-80 flex flex-col",
            showConversations ? "flex" : "hidden md:flex",
          )}
        >
          <div className="p-2.5 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                className="h-8 pl-8 text-sm bg-muted/50 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedId(conv.id)
                  setShowConversations(false)
                }}
                className={cn(
                  "flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-muted/50 border-b border-border/50",
                  selectedConversation?.id === conv.id && "bg-muted",
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10">
                    <Factory className="h-4 w-4 text-secondary" />
                  </div>
                  {conv.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <span
                        className={cn(
                          "text-sm truncate",
                          conv.unread ? "font-semibold text-foreground" : "font-medium text-muted-foreground",
                        )}
                      >
                        {conv.name}
                      </span>
                      {conv.reviewed && <CheckCircle className="h-3 w-3 text-secondary flex-shrink-0" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">{conv.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {conv.isOrderThread && (
                      <Badge variant="secondary" className="h-4 px-1 text-[9px] flex-shrink-0">
                        Order
                      </Badge>
                    )}
                    <p
                      className={cn(
                        "text-xs truncate",
                        conv.unread ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={cn("flex flex-1 flex-col bg-muted/20", !showConversations ? "flex" : "hidden md:flex")}>
          {/* Chat Header */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-card border-b border-border">
            <div className="flex items-center gap-2.5">
              <button className="md:hidden p-1 -ml-1 hover:bg-muted rounded" onClick={() => setShowConversations(true)}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                <Factory className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm text-foreground">{selectedConversation?.name}</span>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                    Verified
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {selectedThread ? "Order conversation" : "Typically replies within 2 hours"}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View supplier profile</DropdownMenuItem>
                <DropdownMenuItem>View quotations</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Block supplier</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-3 py-3">
            <div className="space-y-3 max-w-3xl mx-auto">
              {selectedThread
                ? selectedThread.messages.map((msg) => <ThreadBubble key={msg.id} msg={msg} />)
                : (localMockMessages[selectedConversation?.id ?? ""] || []).map((msg, index, arr) => {
                    const isOwn = msg.sender === "buyer"
                    const showAvatar = !isOwn && (index === 0 || arr[index - 1]?.sender !== msg.sender)
                    return (
                      <div key={msg.id} className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}>
                        {!isOwn && (
                          <div className="w-6 flex-shrink-0">
                            {showAvatar && (
                              <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center">
                                <Factory className="h-3 w-3 text-secondary" />
                              </div>
                            )}
                          </div>
                        )}
                        <div className={cn("max-w-[75%] group", isOwn && "flex flex-col items-end")}>
                          <div
                            className={cn(
                              "px-3 py-2 rounded-2xl text-[13px] leading-relaxed",
                              isOwn
                                ? "bg-foreground text-background rounded-br-md"
                                : "bg-card border border-border/60 text-foreground rounded-bl-md",
                            )}
                          >
                            {msg.text}
                          </div>
                          <div className={cn("flex items-center gap-1 mt-0.5 px-1", isOwn ? "flex-row-reverse" : "flex-row")}>
                            <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                            {isOwn && msg.status && (
                              <span className="text-[10px] text-muted-foreground">
                                {msg.status === "sending" && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
                                {msg.status === "sent" && <Check className="h-2.5 w-2.5" />}
                                {msg.status === "read" && (
                                  <span className="flex">
                                    <Check className="h-2.5 w-2.5 -mr-1" />
                                    <Check className="h-2.5 w-2.5 text-secondary" />
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="bg-card border-t border-border p-2.5">
            {newMessage.trim() && (
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-secondary"
                  onClick={handleImproveMessage}
                  disabled={isAIProcessing}
                >
                  {isAIProcessing && aiAction === "improve" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                  Improve
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-secondary"
                  onClick={handleTranslate}
                  disabled={isAIProcessing}
                >
                  {isAIProcessing && aiAction === "translate" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Languages className="h-3 w-3" />}
                  Translate
                </Button>
                {originalMessage && (
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px] text-muted-foreground" onClick={handleRevertMessage}>
                    <X className="h-3 w-3" />
                    Undo
                  </Button>
                )}
              </div>
            )}

            <div className="flex items-end gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0 text-muted-foreground hover:text-foreground">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Document
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  placeholder="Reply to your supplier…"
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="min-h-[36px] max-h-[120px] py-2 px-3 text-sm resize-none bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-secondary/30"
                  rows={1}
                />
              </div>

              <Button size="icon" className="h-9 w-9 flex-shrink-0" disabled={!newMessage.trim() || isSending} onClick={handleSendMessage}>
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-end mt-1.5 px-1">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <CornerDownLeft className="h-2.5 w-2.5" />
                to send
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Renders a single message in an order thread, with a distinct card for system order events.
function ThreadBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === "system") {
    const isCreated = msg.eventKind === "order-created"
    const Icon = isCreated ? PackagePlus : RefreshCw
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10">
              <Icon className="h-4 w-4 text-secondary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground">
                  {isCreated ? "New order created" : "Order update"}
                </span>
                <span className="text-[10px] text-muted-foreground">{formatChatTime(msg.createdAt)}</span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{msg.text}</p>
              {msg.orderId && (
                <Button asChild variant="outline" size="sm" className="mt-2 h-7 gap-1 text-[11px]">
                  <Link href={`/dashboard/buyer/orders/${msg.orderId}`}>
                    View order
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isOwn = msg.role === "buyer"
  return (
    <div className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}>
      {!isOwn && (
        <div className="w-6 flex-shrink-0">
          <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center">
            <Factory className="h-3 w-3 text-secondary" />
          </div>
        </div>
      )}
      <div className={cn("max-w-[75%]", isOwn && "flex flex-col items-end")}>
        <div
          className={cn(
            "px-3 py-2 rounded-2xl text-[13px] leading-relaxed",
            isOwn ? "bg-foreground text-background rounded-br-md" : "bg-card border border-border/60 text-foreground rounded-bl-md",
          )}
        >
          {msg.text}
        </div>
        <span className="mt-0.5 px-1 text-[10px] text-muted-foreground">{formatChatTime(msg.createdAt)}</span>
      </div>
    </div>
  )
}

function lastMessagePreview(msg: ChatMessage): string {
  if (msg.role === "system") {
    return msg.eventKind === "order-created" ? `New order: ${stripPrefix(msg.text)}` : msg.text
  }
  return msg.text
}

function stripPrefix(text: string): string {
  return text.replace(/^New order created:\s*/i, "").replace(/^New engagement started:\s*/i, "")
}
