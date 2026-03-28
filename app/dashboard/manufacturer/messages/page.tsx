"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Search, 
  Send,
  Paperclip,
  User,
  CheckCircle,
  MoreVertical,
  ArrowLeft,
  MessageSquare,
  Globe
} from "lucide-react"

const conversations = [
  { 
    id: "1",
    name: "John Smith", 
    company: "ABC Imports LLC",
    country: "United States",
    lastMessage: "Hi, I'm interested in your TWS Wireless Earbuds Pro. Can you provide pricing for an order of 5000 units?", 
    time: "2 hours ago", 
    unread: true,
  },
  { 
    id: "2",
    name: "Emma Wilson", 
    company: "European Traders GmbH",
    country: "Germany",
    lastMessage: "Thank you for the quotation. We would like to proceed with a sample order first.", 
    time: "5 hours ago", 
    unread: true,
  },
  { 
    id: "3",
    name: "David Chen", 
    company: "Pacific Retail Group",
    country: "Australia",
    lastMessage: "Can you arrange shipping to Melbourne? What would be the total landed cost?", 
    time: "1 day ago", 
    unread: false,
  },
  { 
    id: "4",
    name: "Sophie Martin", 
    company: "Retail Solutions UK",
    country: "United Kingdom",
    lastMessage: "The samples arrived in perfect condition. We are ready to place the full order.", 
    time: "2 days ago", 
    unread: false,
  },
  { 
    id: "5",
    name: "James Anderson", 
    company: "Canadian Electronics Inc",
    country: "Canada",
    lastMessage: "Do you offer private labeling services for this product line?", 
    time: "3 days ago", 
    unread: false,
  },
]

const messages = [
  { 
    id: "1", 
    sender: "buyer", 
    text: "Hi, I'm interested in your TWS Wireless Earbuds Pro. Can you provide pricing for an order of 5000 units?",
    time: "10:30 AM"
  },
  { 
    id: "2", 
    sender: "manufacturer", 
    text: "Hello! Thank you for reaching out. For an order of 5000 units, we can offer $14.50 per unit. This includes standard packaging. Would you like any customization?",
    time: "10:45 AM"
  },
  { 
    id: "3", 
    sender: "buyer", 
    text: "Yes, we'd like custom branding on the earbuds and packaging. Can you send samples first?",
    time: "10:48 AM"
  },
  { 
    id: "4", 
    sender: "manufacturer", 
    text: "Absolutely! We can send 3 sample units for evaluation. The sample cost is $35 including express shipping. Custom branding will add $0.50 per unit. Would you like me to arrange the samples?",
    time: "11:00 AM"
  },
  { 
    id: "5", 
    sender: "buyer", 
    text: "That sounds reasonable. Please send the samples. I'll share the shipping address.",
    time: "11:05 AM"
  },
  { 
    id: "6", 
    sender: "manufacturer", 
    text: "Perfect! Please share your shipping address and I'll arrange the samples right away. I'll also prepare a formal quotation for the full order.",
    time: "11:10 AM"
  },
  { 
    id: "7", 
    sender: "buyer", 
    text: "Address: 123 Commerce Street, Suite 400, Los Angeles, CA 90015, United States. Looking forward to receiving the samples!",
    time: "2 hours ago"
  },
]

export default function ManufacturerMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [showConversations, setShowConversations] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = conversations.filter(c => c.unread).length

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Messages</h1>
          <p className="mt-1 text-muted-foreground">
            {unreadCount > 0 
              ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''} from buyers` 
              : 'Communicate with potential buyers'
            }
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-xl border border-border bg-card">
        {/* Conversations List */}
        <div className={cn(
          "w-full flex-shrink-0 border-r border-border md:w-80",
          showConversations ? "block" : "hidden md:block"
        )}>
          {/* Search */}
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search buyers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="overflow-auto h-full">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv)
                    setShowConversations(false)
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50",
                    selectedConversation.id === conv.id && "bg-muted"
                  )}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "font-medium text-sm truncate",
                        conv.unread ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {conv.name}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{conv.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {conv.country}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0 mt-2" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex flex-1 flex-col",
          !showConversations ? "block" : "hidden md:flex"
        )}>
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden"
                onClick={() => setShowConversations(true)}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{selectedConversation.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{selectedConversation.company}</span>
                  <span>•</span>
                  <span>{selectedConversation.country}</span>
                </div>
              </div>
            </div>
            <button className="rounded-lg p-2 hover:bg-muted">
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "manufacturer" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5",
                  msg.sender === "manufacturer" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-foreground"
                )}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={cn(
                    "mt-1 text-xs",
                    msg.sender === "manufacturer" ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 hover:bg-muted">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </button>
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button size="icon" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
