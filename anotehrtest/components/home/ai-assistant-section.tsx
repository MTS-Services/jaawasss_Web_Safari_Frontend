"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  Send,
  Bot,
  User,
  Languages,
  FileText,
  TrendingUp,
  HelpCircle
} from "lucide-react"

const exampleQuestions = [
  "What certifications do I need to import food products?",
  "How do I verify a supplier is legitimate?",
  "What is the typical MOQ for textile manufacturers?",
  "How long does shipping from China take?",
  "What payment terms are common in B2B trade?",
  "How do I negotiate better prices with suppliers?",
]

const capabilities = [
  {
    icon: HelpCircle,
    title: "Answer Questions",
    description: "Get instant answers about sourcing, trade, and industry standards"
  },
  {
    icon: Languages,
    title: "Translate Messages",
    description: "Communicate with suppliers in any language"
  },
  {
    icon: FileText,
    title: "Draft Communications",
    description: "Generate professional emails and RFQ templates"
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Learn about pricing trends and market conditions"
  },
]

export function AiAssistantSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [chatMessages, setChatMessages] = useState<{role: "user" | "assistant", text: string}[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById("ai-assistant-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  // Rotate through example questions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % exampleQuestions.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Demo chat animation
  useEffect(() => {
    if (isVisible && chatMessages.length === 0) {
      const timer1 = setTimeout(() => {
        setChatMessages([{ role: "user", text: "What certifications do I need for food products?" }])
        setIsTyping(true)
      }, 1000)

      const timer2 = setTimeout(() => {
        setIsTyping(false)
        setChatMessages(prev => [...prev, { 
          role: "assistant", 
          text: "For food products, common certifications include FDA (USA), HACCP, ISO 22000, and BRC. The specific requirements depend on your target market and product type. Would you like me to help identify which certifications your suppliers should have?" 
        }])
      }, 3000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [isVisible, chatMessages.length])

  return (
    <section 
      id="ai-assistant-section" 
      className="relative py-20 overflow-hidden bg-muted/30"
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div 
            className={`space-y-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
              <Bot className="h-4 w-4" />
              AI Assistant
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your Personal Sourcing Expert
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Get instant answers to your sourcing questions, help drafting messages to suppliers, 
              and expert guidance on international trade - available 24/7.
            </p>

            {/* Capabilities grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {capabilities.map((cap, index) => (
                <div 
                  key={cap.title}
                  className={`flex items-start gap-3 transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <cap.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{cap.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cap.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/assistant">
                  <MessageSquare className="h-4 w-4" />
                  Chat with AI Assistant
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side - Interactive chat preview */}
          <div 
            className={`relative transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <Card className="relative overflow-hidden border-2 shadow-xl">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">TradeHub AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">Always online</p>
                </div>
                <div className="ml-auto flex h-2 w-2 rounded-full bg-green-500" />
              </div>

              {/* Chat messages */}
              <div className="h-[280px] overflow-hidden p-4 space-y-4 bg-background">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-gradient-to-br from-secondary to-primary text-white"
                    }`}>
                      {msg.role === "user" ? (
                        <User className="h-3.5 w-3.5" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-white">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-muted">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Example questions carousel */}
              <div className="border-t bg-muted/30 px-4 py-3">
                <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                <div className="relative h-8 overflow-hidden">
                  {exampleQuestions.map((q, i) => (
                    <div
                      key={q}
                      className={`absolute inset-0 flex items-center transition-all duration-500 ${
                        i === currentQuestion 
                          ? "opacity-100 translate-y-0" 
                          : "opacity-0 translate-y-4"
                      }`}
                    >
                      <span className="text-sm text-foreground truncate">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input area */}
              <div className="flex items-center gap-2 border-t bg-background px-4 py-3">
                <div className="flex-1 rounded-full border bg-muted/50 px-4 py-2">
                  <span className="text-sm text-muted-foreground">Ask anything about sourcing...</span>
                </div>
                <Button size="icon" className="h-9 w-9 rounded-full shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />
            <div className="absolute -top-4 -left-4 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
