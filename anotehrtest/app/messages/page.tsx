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
  improveMessage,
  translateMessage,
  improveAndTranslate,
  suggestReply,
  smartHelp,
  assistantChat,
  type ChatTurn,
  type DealContext,
} from "./actions"
import { 
  Search, 
  Send,
  Paperclip,
  Factory,
  CheckCircle,
  MoreVertical,
  ArrowLeft,
  Plus,
  MessageSquare,
  Sparkles,
  Languages,
  Wand2,
  Loader2,
  ChevronDown,
  X,
  Lightbulb,
  Reply
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"

// Deal summary data (extracted from conversation)
const dealSummary = {
  product: "TWS Wireless Earbuds Pro",
  quantity: "5,000 units",
  pricePerUnit: "$14.50",
  customization: "Custom branding"
}

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

// Available languages for translation
const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "Chinese" },
  { code: "es", name: "Spanish" },
  { code: "ar", name: "Arabic" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [showConversations, setShowConversations] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // AI Assistant states
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const [aiAction, setAiAction] = useState<"improve" | "translate" | "both" | "consult" | "suggest" | "smart" | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [originalMessage, setOriginalMessage] = useState("")
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [quickReply, setQuickReply] = useState<string | null>(null)
  
  // AI Consultation states - mini chat assistant
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiChatMessages, setAiChatMessages] = useState<{role: "user" | "assistant", content: string}[]>([])
  const [aiChatInput, setAiChatInput] = useState("")
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [lastSuggestion, setLastSuggestion] = useState<string | null>(null)

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = conversations.filter(c => c.unread).length

  // Build the conversation history + deal context passed to the AI actions.
  const buildAiContext = (): { history: ChatTurn[]; ctx: DealContext } => ({
    history: messages.map((m) => ({ sender: m.sender as "buyer" | "supplier", text: m.text })),
    ctx: {
      supplierName: selectedConversation?.name ?? "the supplier",
      product: dealSummary.product,
      quantity: dealSummary.quantity,
      pricePerUnit: dealSummary.pricePerUnit,
    },
  })

  // AI Improve function - rewrites message professionally using a real LLM
  const handleImproveMessage = async () => {
    if (!newMessage.trim()) return

    setIsAIProcessing(true)
    setAiAction("improve")
    const draft = newMessage
    setOriginalMessage(draft)

    try {
      const { ctx } = buildAiContext()
      const improved = await improveMessage(draft, ctx)
      setNewMessage(improved)
    } catch (err) {
      console.log("[v0] improveMessage failed:", err)
    } finally {
      setIsAIProcessing(false)
      setAiAction(null)
    }
  }

  // AI Translate function - translates the draft into the chosen language
  const handleTranslateMessage = async (targetLang: string) => {
    if (!newMessage.trim()) return

    setIsAIProcessing(true)
    setAiAction("translate")
    const draft = newMessage
    setOriginalMessage(draft)
    setSelectedLanguage(targetLang)
    setShowLanguageMenu(false)

    try {
      const { ctx } = buildAiContext()
      const translated = await translateMessage(draft, targetLang, ctx)
      setNewMessage(translated)
    } catch (err) {
      console.log("[v0] translateMessage failed:", err)
    } finally {
      setIsAIProcessing(false)
      setAiAction(null)
    }
  }

  // AI Improve & Translate - polishes and translates to professional English
  const handleImproveAndTranslate = async () => {
    if (!newMessage.trim()) return

    setIsAIProcessing(true)
    setAiAction("both")
    const draft = newMessage
    setOriginalMessage(draft)

    try {
      const { ctx } = buildAiContext()
      const improved = await improveAndTranslate(draft, ctx)
      setNewMessage(improved)
    } catch (err) {
      console.log("[v0] improveAndTranslate failed:", err)
    } finally {
      setIsAIProcessing(false)
      setAiAction(null)
    }
  }

  // Revert to original message
  const handleRevertMessage = () => {
    if (originalMessage) {
      setNewMessage(originalMessage)
      setOriginalMessage("")
    }
  }

  // Generate quick reply suggestion based on last received message
  const generateQuickReply = () => {
    if (!selectedConversation) return
    // Use the messages array (in real app, this would be per-conversation)
    const lastSupplierMessage = [...messages].reverse().find(m => m.sender === "supplier")
    if (!lastSupplierMessage) return
    
    const text = lastSupplierMessage.text.toLowerCase()
    if (text.includes("price") || text.includes("quote") || text.includes("cost") || text.includes("$")) {
      setQuickReply("Thank you for the pricing details. I will review the quotation and get back to you shortly with our decision.")
    } else if (text.includes("sample")) {
      setQuickReply("Thank you for arranging the samples. I will share the shipping address and confirm once received.")
    } else if (text.includes("ship") || text.includes("tracking")) {
      setQuickReply("Thank you for the shipping update. I will track the delivery and confirm once received.")
    } else if (text.includes("custom") || text.includes("brand")) {
      setQuickReply("Thank you for the customization options. Please proceed as discussed and let me know the next steps.")
    } else if (text.includes("?")) {
      setQuickReply("Thank you for your question. Let me provide the details you need.")
    } else {
      setQuickReply("Thank you for the update. I appreciate your prompt response and will follow up shortly.")
    }
  }

  // Suggest reply button - generates a context-aware reply with a real LLM
  const handleSuggestReply = async () => {
    setIsAIProcessing(true)
    setAiAction("suggest")

    try {
      const { history, ctx } = buildAiContext()
      const suggestedReply = await suggestReply(history, ctx)
      setNewMessage(suggestedReply)
      setOriginalMessage("")
    } catch (err) {
      console.log("[v0] suggestReply failed:", err)
    } finally {
      setIsAIProcessing(false)
      setAiAction(null)
    }
  }

  // Smart Help - analyzes the conversation and drafts the best next message
  const handleSmartHelp = async () => {
    setIsAIProcessing(true)
    setAiAction("smart")

    try {
      const { history, ctx } = buildAiContext()
      const suggestion = await smartHelp(history, ctx)
      setNewMessage(suggestion)
      setOriginalMessage("")
    } catch (err) {
      console.log("[v0] smartHelp failed:", err)
    } finally {
      setIsAIProcessing(false)
      setAiAction(null)
    }
  }

  const useQuickReply = () => {
    if (quickReply) {
      setNewMessage(quickReply)
      setQuickReply(null)
    }
  }

  const dismissQuickReply = () => {
    setQuickReply(null)
  }

  // Get conversation context for AI
  const getConversationContext = () => {
    const allText = messages.map(m => m.text.toLowerCase()).join(" ")
    return {
      product: dealSummary.product,
      quantity: dealSummary.quantity,
      price: dealSummary.pricePerUnit,
      hasPrice: allText.includes("price") || allText.includes("$"),
      hasSample: allText.includes("sample"),
      hasShipping: allText.includes("shipping") || allText.includes("delivery"),
      hasMOQ: allText.includes("moq") || allText.includes("minimum"),
      hasPayment: allText.includes("payment"),
      hasCertification: allText.includes("certif"),
      lastSupplierMessage: [...messages].reverse().find(m => m.sender === "supplier")?.text || "",
      negotiationStage: allText.includes("sample") ? "samples" : allText.includes("$") ? "pricing" : "initial"
    }
  }

  // AI Chat - context-aware assistant powered by a real LLM
  const handleAIChat = async (userMessage: string) => {
    if (!userMessage.trim()) return

    // Add user message to chat
    setAiChatMessages(prev => [...prev, { role: "user", content: userMessage }])
    setAiChatInput("")
    setIsAIThinking(true)
    setLastSuggestion(null)

    try {
      const { history, ctx } = buildAiContext()
      const { response, suggestion } = await assistantChat(userMessage, history, ctx)
      setAiChatMessages(prev => [...prev, { role: "assistant", content: response }])
      if (suggestion) {
        setLastSuggestion(suggestion)
      }
    } catch (err) {
      console.log("[v0] assistantChat failed:", err)
      setAiChatMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I had trouble responding just now. Please try again." },
      ])
    } finally {
      setIsAIThinking(false)
    }
  }

  // Insert AI suggestion into message input
  const handleInsertSuggestion = () => {
    if (lastSuggestion) {
      setNewMessage(lastSuggestion)
      setShowAIAssistant(false)
      setLastSuggestion(null)
    }
  }

  // Open AI assistant with initial context
  const openAIAssistant = () => {
    if (aiChatMessages.length === 0) {
      const ctx = getConversationContext()
      setAiChatMessages([{
        role: "assistant",
        content: `I'm analyzing your conversation with ${selectedConversation.name} about ${ctx.product}.\n\n` +
          `Current status: ${ctx.negotiationStage === "samples" ? "Discussing samples" : ctx.negotiationStage === "pricing" ? "Pricing received" : "Initial inquiry"}\n` +
          `Deal: ${ctx.quantity} at ${ctx.price}/unit\n\n` +
          `How can I help? Ask me anything about this deal.`
      }])
    }
    setShowAIAssistant(true)
  }

  // Quick consultation prompts
  const aiQuickPrompts = [
    "What should I reply?",
    "Is this price good?",
    "What am I missing?",
    "Help me negotiate"
  ]

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
              "flex flex-1 flex-col relative",
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

              {/* Deal Summary - Subtle, compact */}
              <div className="border-b border-border/50 px-4 py-1.5">
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span>{dealSummary.product}</span>
                  <span className="opacity-50">·</span>
                  <span>{dealSummary.quantity}</span>
                  <span className="opacity-50">·</span>
                  <span>{dealSummary.pricePerUnit}/unit</span>
                </div>
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

              {/* AI Assistant Mini Chat */}
              {showAIAssistant && (
                <div className="absolute bottom-20 right-4 w-80 max-h-96 rounded-xl border border-secondary/30 bg-card shadow-xl flex flex-col overflow-hidden z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20">
                        <Sparkles className="h-3.5 w-3.5 text-secondary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Sourcing Assistant</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => setShowAIAssistant(false)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-60">
                    {aiChatMessages.map((msg, i) => (
                      <div key={i} className={cn(
                        "text-sm",
                        msg.role === "user" ? "text-right" : ""
                      )}>
                        <div className={cn(
                          "inline-block rounded-lg px-3 py-2 max-w-[90%]",
                          msg.role === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-foreground"
                        )}>
                          {msg.content.split('\n').map((line, j) => (
                            <p key={j} className={cn(
                              "text-xs leading-relaxed",
                              line.startsWith('•') && "pl-2"
                            )}>
                              {line || <br />}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {/* Thinking indicator */}
                    {isAIThinking && (
                      <div className="flex items-center gap-2">
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-secondary" />
                        </div>
                      </div>
                    )}
                    
                    {/* Insert Suggestion Button */}
                    {lastSuggestion && (
                      <div className="border border-secondary/30 rounded-lg p-2 bg-secondary/5">
                        <p className="text-[10px] text-secondary font-medium mb-1">Suggested reply:</p>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-3">{lastSuggestion}</p>
                        <Button 
                          size="sm" 
                          className="w-full h-7 text-xs gap-1"
                          onClick={handleInsertSuggestion}
                        >
                          <Reply className="h-3 w-3" />
                          Insert into message
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Prompts */}
                  {aiChatMessages.length <= 1 && !isAIThinking && (
                    <div className="px-3 pb-2 flex flex-wrap gap-1">
                      {aiQuickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleAIChat(prompt)}
                          className="rounded-full border border-border bg-background px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Input */}
                  <div className="border-t border-border p-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="Ask about this deal..."
                        value={aiChatInput}
                        onChange={(e) => setAiChatInput(e.target.value)}
                        className="flex-1 h-8 text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && aiChatInput.trim()) {
                            handleAIChat(aiChatInput)
                          }
                        }}
                      />
                      <Button 
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => handleAIChat(aiChatInput)}
                        disabled={!aiChatInput.trim() || isAIThinking}
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="border-t border-border p-4">


                {/* Quick Reply Suggestion */}
                {quickReply && !newMessage.trim() && !showAIAssistant && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-secondary/30 bg-secondary/5 p-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-secondary" />
                    <p className="flex-1 text-sm text-muted-foreground">{quickReply}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={useQuickReply}
                    >
                      Use
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={dismissQuickReply}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* AI Sourcing Assistant - Primary Action */}
                <div className="mb-4">
                  <Button 
                    variant="outline"
                    className={cn(
                      "w-full justify-center gap-2 h-9 border-secondary/30 text-secondary hover:bg-secondary/10",
                      showAIAssistant && "bg-secondary/10"
                    )}
                    onClick={() => showAIAssistant ? setShowAIAssistant(false) : openAIAssistant()}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">{showAIAssistant ? "Close AI Assistant" : "Ask AI for sourcing advice"}</span>
                  </Button>
                </div>

                {/* Secondary Actions - Subtle row */}
                <div className="mb-4 flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleSuggestReply}
                    disabled={isAIProcessing}
                    title="Generate a reply based on the conversation"
                  >
                    {isAIProcessing && aiAction === "suggest" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Reply className="h-3.5 w-3.5" />
                    )}
                    Reply
                  </Button>
                  <span className="text-border">|</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleImproveMessage}
                    disabled={isAIProcessing || !newMessage.trim()}
                    title="Rewrite your message professionally"
                  >
                    {isAIProcessing && aiAction === "improve" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Wand2 className="h-3.5 w-3.5" />
                    )}
                    Improve
                  </Button>
                  <span className="text-border">|</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => handleTranslateMessage("en")}
                    disabled={isAIProcessing || !newMessage.trim()}
                    title="Translate and fix grammar"
                  >
                    {isAIProcessing && aiAction === "translate" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Languages className="h-3.5 w-3.5" />
                    )}
                    Translate
                  </Button>
                  
                  {originalMessage && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                      onClick={handleRevertMessage}
                    >
                      <X className="h-3.5 w-3.5" />
                      Undo
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0" title="Attach file">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value)
                        setQuickReply(null) // Dismiss quick reply when typing
                      }}
                      className="pr-10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newMessage.trim() && !isAIProcessing) {
                          setNewMessage("")
                          setOriginalMessage("")
                          setQuickReply(null)
                        }
                      }}
                      onFocus={() => {
                        // Show quick reply suggestion on focus if no message
                        if (!newMessage.trim() && !quickReply) {
                          generateQuickReply()
                        }
                      }}
                    />
                  </div>
                  <Button 
                    size="icon" 
                    className="shrink-0" 
                    disabled={!newMessage.trim() || isAIProcessing}
                    onClick={() => {
                      if (newMessage.trim() && !isAIProcessing) {
                        setNewMessage("")
                        setOriginalMessage("")
                        setQuickReply(null)
                      }
                    }}
                  >
                    {isAIProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
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
