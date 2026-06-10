"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { 
  Factory,
  MapPin,
  Send,
  Sparkles,
  Star,
  Shield,
  Clock,
  ArrowLeft,
  Package,
  Box,
  Loader2,
  FileText,
  HelpCircle,
  MessageCircle
} from "lucide-react"

// Sample suppliers
const sampleSuppliers = [
  {
    id: "1",
    name: "Jiangsu Paper Industries Co., Ltd",
    location: "Jiangsu, China",
    rating: 4.8,
    reviews: 156,
    reviewed: true,
    moq: "5,000 units",
    leadTime: "15-20 days",
    matchScore: 95,
    avatar: "JP",
  },
  {
    id: "2", 
    name: "Guangzhou Hygiene Products Ltd",
    location: "Guangzhou, China",
    rating: 4.6,
    reviews: 89,
    reviewed: true,
    moq: "3,000 units",
    leadTime: "12-18 days",
    matchScore: 88,
    avatar: "GH",
  },
  {
    id: "3",
    name: "Zhejiang Comfort Paper Co.",
    location: "Zhejiang, China",
    rating: 4.7,
    reviews: 203,
    reviewed: true,
    moq: "10,000 units",
    leadTime: "20-25 days",
    matchScore: 82,
    avatar: "ZC",
  },
]

const countryOptions = ["Israel", "United States", "Germany", "United Kingdom", "France", "Canada", "Australia", "UAE"]
const quantityOptions = ["1,000 units", "5,000 units", "10,000 units", "25,000 units", "50,000+ units"]

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  type: "text" | "suppliers" | "follow-up"
  options?: string[]
  suppliers?: typeof sampleSuppliers
}

export default function SmartSourcingPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [product, setProduct] = useState<string | null>(null)
  const [destination, setDestination] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<string | null>(null)
  const [awaitingField, setAwaitingField] = useState<"product" | "destination" | "quantity" | null>(null)
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [rfqSent, setRfqSent] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const extractProduct = (text: string): string | null => {
    const lower = text.toLowerCase()
    if (lower.includes("toilet paper") || lower.includes("toilet-paper")) return "toilet paper"
    if (lower.includes("tissue")) return "tissue"
    if (lower.includes("t-shirt") || lower.includes("tshirt")) return "t-shirts"
    if (lower.includes("phone case")) return "phone cases"
    return null
  }

  const extractDestination = (text: string): string | null => {
    const lower = text.toLowerCase()
    if (lower.includes("israel")) return "Israel"
    if (lower.includes("usa") || lower.includes("united states")) return "United States"
    if (lower.includes("uk") || lower.includes("united kingdom")) return "United Kingdom"
    if (lower.includes("germany")) return "Germany"
    if (lower.includes("france")) return "France"
    return null
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      type: "text"
    }
    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)
    
    await new Promise(r => setTimeout(r, 600))
    
    // Handle awaiting field
    if (awaitingField === "destination") {
      setDestination(inputValue)
      setAwaitingField("quantity")
      const msg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Great, shipping to **${inputValue}**. How many units do you need?`,
        type: "follow-up",
        options: quantityOptions
      }
      setMessages(prev => [...prev, msg])
      setIsTyping(false)
      return
    }
    
    if (awaitingField === "quantity") {
      setQuantity(inputValue)
      setAwaitingField(null)
      await searchSuppliers()
      return
    }
    
    // Extract from input
    const foundProduct = extractProduct(inputValue)
    const foundDestination = extractDestination(inputValue)
    
    if (foundProduct) {
      setProduct(foundProduct)
      setDestination(foundDestination)
      
      if (!foundDestination) {
        setAwaitingField("destination")
        const msg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I found that you need **${foundProduct}** suppliers. Where will this be shipped to?`,
          type: "follow-up",
          options: countryOptions
        }
        setMessages(prev => [...prev, msg])
        setIsTyping(false)
        return
      }
      
      setAwaitingField("quantity")
      const msg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Looking for **${foundProduct}** suppliers shipping to **${foundDestination}**. How many units do you need?`,
        type: "follow-up",
        options: quantityOptions
      }
      setMessages(prev => [...prev, msg])
      setIsTyping(false)
      return
    }
    
    // Default
    const msg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `I can help you find suppliers. Tell me what product you need and where to ship it.\n\nFor example: "I need a toilet paper supplier for Israel"`,
      type: "text"
    }
    setMessages(prev => [...prev, msg])
    setIsTyping(false)
  }

  const searchSuppliers = async () => {
    const searchMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `Searching for suppliers...`,
      type: "text"
    }
    setMessages(prev => [...prev, searchMsg])
    
    await new Promise(r => setTimeout(r, 1200))
    
    const resultsMsg: Message = {
      id: (Date.now() + 2).toString(),
      role: "assistant",
      content: `Found **${sampleSuppliers.length} reviewed suppliers**:`,
      type: "suppliers",
      suppliers: sampleSuppliers
    }
    setMessages(prev => [...prev, resultsMsg])
    setIsTyping(false)
  }

  const handleOptionClick = (option: string) => {
    setInputValue(option)
    setTimeout(() => handleSend(), 50)
  }

  const toggleSupplier = (id: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleSendRFQ = async () => {
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 800))
    
    const msg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: `Your RFQ has been sent to **${selectedSuppliers.length} supplier${selectedSuppliers.length > 1 ? "s" : ""}**. They typically respond within 24-48 hours.`,
      type: "text"
    }
    setMessages(prev => [...prev, msg])
    setRfqSent(true)
    setSelectedSuppliers([])
    setIsTyping(false)
  }

  const quickPrompts = [
    { icon: Package, text: "Find suppliers", prompt: "I need a supplier for " },
    { icon: HelpCircle, text: "How to choose suppliers", prompt: "What should I check before choosing a supplier?" },
    { icon: FileText, text: "RFQ best practices", prompt: "How do I write an effective RFQ?" },
    { icon: MessageCircle, text: "Negotiation tips", prompt: "How do I negotiate with factories?" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-4 px-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
              <Sparkles className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">AI Sourcing Assistant</h1>
              <p className="text-xs text-muted-foreground">Find suppliers &amp; get expert advice</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {/* Welcome */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">How can I help you today?</h2>
              <p className="mb-8 max-w-md text-muted-foreground">
                Find suppliers, get quotes, or ask any sourcing question
              </p>
              
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {quickPrompts.map((item) => (
                  <button
                    key={item.text}
                    onClick={() => {
                      setInputValue(item.prompt)
                    }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                      <item.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "")}>
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                    <Sparkles className="h-4 w-4 text-secondary" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[85%]",
                  msg.role === "user" ? "rounded-2xl bg-primary px-4 py-3 text-primary-foreground" : ""
                )}>
                  {msg.role === "assistant" ? (
                    <div className="space-y-3">
                      <div 
                        className="rounded-2xl bg-muted px-4 py-3 text-foreground"
                        dangerouslySetInnerHTML={{ 
                          __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') 
                        }}
                      />
                      
                      {/* Options */}
                      {msg.options && (
                        <div className="flex flex-wrap gap-2 pl-1">
                          {msg.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleOptionClick(opt)}
                              className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Suppliers */}
                      {msg.suppliers && (
                        <div className="space-y-3 pl-1">
                          {msg.suppliers.map((supplier) => (
                            <Card key={supplier.id} className={cn(
                              "transition-all",
                              selectedSuppliers.includes(supplier.id) && "ring-2 ring-secondary"
                            )}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    checked={selectedSuppliers.includes(supplier.id)}
                                    onCheckedChange={() => toggleSupplier(supplier.id)}
                                    className="mt-1"
                                  />
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">{supplier.avatar}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium text-foreground truncate">{supplier.name}</h4>
                                      {supplier.reviewed && (
                                        <Badge variant="secondary" className="shrink-0 text-xs">
                                          <Shield className="mr-1 h-3 w-3" />
                                          Reviewed
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      <span>{supplier.location}</span>
                                      <span className="text-border">|</span>
                                      <Star className="h-3 w-3 text-yellow-500" />
                                      <span>{supplier.rating} ({supplier.reviews})</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Box className="h-3 w-3" />
                                        MOQ: {supplier.moq}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {supplier.leadTime}
                                      </span>
                                    </div>
                                  </div>
                                  <Badge className="shrink-0 bg-green-500/10 text-green-600 border-green-500/20">
                                    {supplier.matchScore}% match
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          
                          {selectedSuppliers.length > 0 && !rfqSent && (
                            <Button onClick={handleSendRFQ} className="w-full gap-2">
                              <Send className="h-4 w-4" />
                              Send RFQ to {selectedSuppliers.length} supplier{selectedSuppliers.length > 1 ? "s" : ""}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                  <Sparkles className="h-4 w-4 text-secondary" />
                </div>
                <div className="rounded-2xl bg-muted px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask anything about sourcing..."
                className="min-h-[52px] max-h-32 w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none"
                rows={1}
              />
              <Button 
                size="icon" 
                className="absolute bottom-2 right-2 h-8 w-8 rounded-lg"
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Find suppliers, get quotes, or ask sourcing questions
          </p>
        </div>
      </div>
    </div>
  )
}
