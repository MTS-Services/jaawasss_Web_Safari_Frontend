"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Search, 
  Send,
  Paperclip,
  Factory,
  CheckCircle,
  MoreVertical,
  ArrowLeft,
  Plus,
  MessageSquare
} from "lucide-react"

const conversations = [
  { 
    id: "1",
    name: "TechVision Electronics", 
    slug: "techvision-electronics",
    lastMessage: "Thank you for your inquiry. We can offer a competitive price for the TWS earbuds...", 
    time: "2 hours ago", 
    unread: true,
    reviewed: true
  },
  { 
    id: "2",
    name: "EcoThread Textiles", 
    slug: "ecothread-textiles",
    lastMessage: "The samples have been shipped via DHL. Here is the tracking number: DHL1234567890", 
    time: "5 hours ago", 
    unread: true,
    reviewed: true
  },
  { 
    id: "3",
    name: "GlobalFab Machinery", 
    slug: "globalfab-machinery",
    lastMessage: "Please find the attached quotation for the CNC machining center.", 
    time: "1 day ago", 
    unread: false,
    reviewed: true
  },
  { 
    id: "4",
    name: "LuxHome Furniture", 
    slug: "luxhome-furniture",
    lastMessage: "We can customize the dining tables as per your requirements.", 
    time: "2 days ago", 
    unread: false,
    reviewed: true
  },
  { 
    id: "5",
    name: "PureGlow Cosmetics", 
    slug: "pureglow-cosmetics",
    lastMessage: "The MOQ for private label products is 3000 units per SKU.", 
    time: "3 days ago", 
    unread: false,
    reviewed: true
  },
]

const messages = [
  { 
    id: "1", 
    sender: "supplier", 
    text: "Hello! Thank you for reaching out to TechVision Electronics. How can I assist you today?",
    time: "10:30 AM"
  },
  { 
    id: "2", 
    sender: "buyer", 
    text: "Hi, I'm interested in your TWS Wireless Earbuds Pro. Can you provide pricing for an order of 5000 units?",
    time: "10:32 AM"
  },
  { 
    id: "3", 
    sender: "supplier", 
    text: "Of course! For an order of 5000 units, we can offer $14.50 per unit. This includes the standard packaging. Would you like any customization?",
    time: "10:45 AM"
  },
  { 
    id: "4", 
    sender: "buyer", 
    text: "Yes, we'd like custom branding on the earbuds and packaging. Can you send samples first?",
    time: "10:48 AM"
  },
  { 
    id: "5", 
    sender: "supplier", 
    text: "Absolutely! We can send 3 sample units for evaluation. The sample cost is $35 including express shipping. Custom branding will add $0.50 per unit. Would you like me to arrange the samples?",
    time: "11:00 AM"
  },
  { 
    id: "6", 
    sender: "buyer", 
    text: "That sounds reasonable. Please send the samples. I'll share the shipping address.",
    time: "11:05 AM"
  },
  { 
    id: "7", 
    sender: "supplier", 
    text: "Thank you for your inquiry. We can offer a competitive price for the TWS earbuds. I'll prepare a formal quotation and send it to you shortly. In the meantime, please share your shipping address for the samples.",
    time: "2 hours ago"
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [showConversations, setShowConversations] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = conversations.filter(c => c.unread).length

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                Messages
              </h1>
              <p className="mt-1 text-muted-foreground">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` 
                  : 'Communicate directly with suppliers'
                }
              </p>
            </div>
            <Button className="gap-2" asChild>
              <Link href="/suppliers">
                <Plus className="h-4 w-4" />
                New Conversation
              </Link>
            </Button>
          </div>

          {/* Messages Container */}
          <div className="flex h-[calc(100vh-16rem)] overflow-hidden rounded-xl border border-border bg-card">
            {/* Conversations List */}
            <div className={cn(
              "w-full flex-shrink-0 border-r border-border md:w-80 lg:w-96",
              showConversations ? "block" : "hidden md:block"
            )}>
              {/* Search */}
              <div className="border-b border-border p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search conversations..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="h-[calc(100%-4.5rem)] overflow-y-auto">
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
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                        <Factory className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 min-w-0">
                            <span className={cn(
                              "font-medium text-sm truncate",
                              conv.unread ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {conv.name}
                            </span>
                            {conv.reviewed && (
                              <CheckCircle className="h-3 w-3 flex-shrink-0 text-secondary" />
                            )}
                          </div>
                          <span className="flex-shrink-0 text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unread && (
                        <div className="h-2.5 w-2.5 rounded-full bg-secondary flex-shrink-0 mt-1.5" />
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
                    <Factory className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/suppliers/${selectedConversation.slug}`}
                        className="font-medium text-foreground hover:text-secondary"
                      >
                        {selectedConversation.name}
                      </Link>
                      {selectedConversation.reviewed && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Reviewed
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">Usually responds within 2 hours</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sender === "buyer" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3",
                      msg.sender === "buyer" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-foreground"
                    )}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={cn(
                        "mt-1.5 text-xs",
                        msg.sender === "buyer" ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-border p-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newMessage.trim()) {
                        setNewMessage("")
                      }
                    }}
                  />
                  <Button size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
