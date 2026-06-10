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
  User,
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

const DEMO_MANUFACTURER_ID = "mfr-1"

// Static demo conversations (inquiries that haven't turned into orders yet).
const mockConversations = [
  {
    id: "mock-1",
    name: "Emma Wilson",
    company: "European Traders GmbH",
    country: "Germany",
    lastMessage: "Thank you for the quotation. We would like to proceed with a sample order first.",
    time: "5h ago",
    unread: true,
    online: false,
  },
  {
    id: "mock-2",
    name: "David Chen",
    company: "Pacific Retail Group",
    country: "Australia",
    lastMessage: "Can you arrange shipping to Melbourne? What would be the total landed cost?",
    time: "1d ago",
    unread: false,
    online: true,
  },
  {
    id: "mock-3",
    name: "James Anderson",
    company: "Canadian Electronics Inc",
    country: "Canada",
    lastMessage: "Do you offer private labeling services for this product line?",
    time: "3d ago",
    unread: false,
    online: false,
  },
]

const mockMessages: Record<string, { id: string; sender: string; text: string; time: string; status?: string }[]> = {
  "mock-1": [
    { id: "1", sender: "buyer", text: "Hello, I received your quotation for the LED bulbs. The pricing looks good.", time: "9:00 AM" },
    { id: "2", sender: "manufacturer", text: "Thank you! We're confident you'll be satisfied with the quality. Would you like to proceed with a trial order?", time: "9:15 AM", status: "read" },
    { id: "3", sender: "buyer", text: "Thank you for the quotation. We would like to proceed with a sample order first.", time: "5 hours ago" },
  ],
  "mock-2": [
    { id: "1", sender: "buyer", text: "Can you arrange shipping to Melbourne? What would be the total landed cost?", time: "Yesterday" },
  ],
  "mock-3": [
    { id: "1", sender: "buyer", text: "Do you offer private labeling services for this product line?", time: "3 days ago" },
  ],
}

interface UIConversation {
  id: string
  name: string
  company: string
  lastMessage: string
  time: string
  unread: boolean
  online: boolean
  isOrderThread: boolean
}

export default function ManufacturerMessagesPage() {
  const { user } = useAuth()
  const { getThreadsForSeller, sendChatMessage } = useMessages()
  const [newMessage, setNewMessage] = useState("")
  const [showConversations, setShowConversations] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // AI Assistant states
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const [aiAction, setAiAction] = useState<"improve" | "translate" | null>(null)
  const [originalMessage, setOriginalMessage] = useState("")

  const [localMockMessages, setLocalMockMessages] = useState(mockMessages)
  const [isSending, setIsSending] = useState(false)

  // Live order threads for this manufacturer.
  const orderThreads = getThreadsForSeller(user?.id ?? DEMO_MANUFACTURER_ID)

  const orderConversations: UIConversation[] = orderThreads.map((t) => {
    const last = t.messages[t.messages.length - 1]
    return {
      id: t.id,
      name: t.buyerName,
      company: t.buyerCompany,
      lastMessage: last ? lastMessagePreview(last) : "Order conversation",
      time: t.updatedAt ? formatChatTime(t.updatedAt) : "",
      unread: false,
      online: false,
      isOrderThread: true,
    }
  })

  const allConversations: UIConversation[] = [
    ...orderConversations,
    ...mockConversations.map((c) => ({ ...c, isOrderThread: false })),
  ]

  const [selectedId, setSelectedId] = useState<string>(allConversations[0]?.id ?? "")
  const selectedConversation = allConversations.find((c) => c.id === selectedId) ?? allConversations[0]
  const selectedThread = orderThreads.find((t) => t.id === selectedConversation?.id)

  const filteredConversations = allConversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
      sendChatMessage(selectedConversation.id, "seller", messageText)
      await new Promise((r) => setTimeout(r, 300))
      setIsSending(false)
      return
    }

    const newMsg = {
      id: Date.now().toString(),
      sender: "manufacturer",
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
      improved = "Thank you for your inquiry. Based on your requirements, I would like to offer the following pricing. Please let me know if you have any questions."
    } else if (text.includes("sample")) {
      improved = "I would be happy to arrange samples for your evaluation. Please share your shipping address and I will prepare them with tracking information."
    } else if (text.includes("yes") || text.includes("ok") || text.includes("sure")) {
      improved = "Thank you for confirming. I will proceed as discussed and keep you updated on the progress."
    } else if (text.length < 30) {
      improved = `Thank you for your message. ${newMessage.charAt(0).toUpperCase() + newMessage.slice(1).trim()}. Please let me know if you need any additional information.`
    } else {
      improved = `${newMessage.charAt(0).toUpperCase() + newMessage.slice(1).trim()}. Please feel free to reach out if you have any further questions.`
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
            {unreadCount > 0 ? `${unreadCount} unread from buyers` : "Order updates sent here"}
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
                placeholder="Search buyers..."
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
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {conv.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm truncate",
                        conv.unread ? "font-semibold text-foreground" : "font-medium text-muted-foreground",
                      )}
                    >
                      {conv.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">{conv.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                    <span className="truncate">{conv.company}</span>
                    {conv.isOrderThread && (
                      <Badge variant="secondary" className="h-4 px-1 text-[9px] flex-shrink-0">
                        Order
                      </Badge>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs truncate mt-0.5",
                      conv.unread ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {conv.lastMessage}
                  </p>
                </div>

                {conv.unread && <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0 mt-1.5" />}
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <span className="font-medium text-sm text-foreground">{selectedConversation?.name}</span>
                <span className="block text-[11px] text-muted-foreground">{selectedConversation?.company}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View buyer details</DropdownMenuItem>
                <DropdownMenuItem>Create quotation</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Block buyer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-3 py-3">
            <div className="space-y-3 max-w-3xl mx-auto">
              {selectedThread
                ? selectedThread.messages.map((msg) => <ThreadBubble key={msg.id} msg={msg} />)
                : (localMockMessages[selectedConversation?.id ?? ""] || []).map((msg, index, arr) => {
                    const isOwn = msg.sender === "manufacturer"
                    const showAvatar = !isOwn && (index === 0 || arr[index - 1]?.sender !== msg.sender)
                    return (
                      <div key={msg.id} className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}>
                        {!isOwn && (
                          <div className="w-6 flex-shrink-0">
                            {showAvatar && (
                              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-3 w-3 text-muted-foreground" />
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
                  placeholder="Reply to your buyer…"
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
                  {isCreated ? "Order created" : "Order update sent"}
                </span>
                <span className="text-[10px] text-muted-foreground">{formatChatTime(msg.createdAt)}</span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{msg.text}</p>
              {msg.orderId && (
                <Button asChild variant="outline" size="sm" className="mt-2 h-7 gap-1 text-[11px]">
                  <Link href={orderHref(msg.orderId)}>
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

  // For the seller view, "seller" messages are own messages.
  const isOwn = msg.role === "seller"
  return (
    <div className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}>
      {!isOwn && (
        <div className="w-6 flex-shrink-0">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
            <User className="h-3 w-3 text-muted-foreground" />
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

function orderHref(orderId: string): string {
  // Engagements (services) live under the service-provider area; product orders under manufacturer.
  return orderId.startsWith("ENG")
    ? `/dashboard/service-provider/engagements/${orderId}`
    : `/dashboard/manufacturer/orders/${orderId}`
}

function lastMessagePreview(msg: ChatMessage): string {
  if (msg.role === "system") {
    return msg.eventKind === "order-created" ? `Order created: ${stripPrefix(msg.text)}` : msg.text
  }
  return msg.text
}

function stripPrefix(text: string): string {
  return text.replace(/^New order created:\s*/i, "").replace(/^New engagement started:\s*/i, "")
}
