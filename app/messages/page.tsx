"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ChatView, ChatConversation, ChatMessage, ChatParticipant } from "@/components/chat/chat-view"
import { useAuth } from "@/lib/auth-context"
import { getConversations, getMessages, sendMessage, markAsRead } from "@/lib/api/messages"
import { getEcho } from "@/lib/echo"
import { Loader2 } from "lucide-react"

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth()
  const [selectedConvId, setSelectedConvId] = useState<string | undefined>()
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMessagesLoading, setIsMessagesLoading] = useState(false)

  const buildIncomingMessage = (data: any): ChatMessage | null => {
    const msg = data?.message
    if (!msg?.id) return null
    return {
      id: msg.id.toString(),
      senderId: msg.sender_id?.toString() || "",
      text: msg.body || msg.content || msg.message || "",
      timestamp: "Just now",
      isRead: false,
    }
  }

  // Fetch conversations
  useEffect(() => {
    async function loadConversations() {
      if (!isAuthenticated) return
      
      setIsLoading(true)
      try {
        const data = await getConversations()
        setConversations(data)
        if (data.length > 0 && !selectedConvId) {
          setSelectedConvId(data[0].id)
        }
      } catch (error) {
        console.error("Failed to load conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConversations()
  }, [isAuthenticated, selectedConvId])

  // Fetch messages
  useEffect(() => {
    async function loadMessages() {
      if (!selectedConvId) return
      
      setIsMessagesLoading(true)
      try {
        const data = await getMessages(selectedConvId)
        setMessages(data)
      } catch (error) {
        console.error("Failed to load messages:", error)
      } finally {
        setIsMessagesLoading(false)
      }
    }

    loadMessages()
  }, [selectedConvId])

  // Fallback sync: keeps messages live if websocket events are missed.
  useEffect(() => {
    if (!selectedConvId) return

    const interval = setInterval(async () => {
      try {
        const latest = await getMessages(selectedConvId)
        setMessages((prev) => {
          if (prev.length === 0) return latest
          const existingIds = new Set(prev.map((m) => m.id))
          const unseen = latest.filter((m) => !existingIds.has(m.id))
          return unseen.length ? [...prev, ...unseen] : prev
        })
      } catch {
        // Silent retry on next tick
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedConvId])

  // Real-time listener for new messages in selected conversation
  useEffect(() => {
    if (!selectedConvId) return
    const echo = getEcho()
    if (!echo) return

    const channel = echo.private(`chat.room.${selectedConvId}`)
    channel.listen(".message.sent", (data: any) => {
      const newMsg = buildIncomingMessage(data)
      if (!newMsg) return

      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev
        return [...prev, newMsg]
      })
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConvId ? { ...c, lastMessage: newMsg, updatedAt: "Just now" } : c
        )
      )
    })

    return () => {
      echo.leave(`chat.room.${selectedConvId}`)
    }
  }, [selectedConvId])

  const currentUser: ChatParticipant = {
    id: user?.id?.toString() || "user-1",
    name: user?.name || "User",
    role: (user?.role as any) || "buyer",
    company: user?.company,
    avatar: user?.avatar
  }

  const handleSendMessage = async (text: string) => {
    if (!selectedConvId) return

    const sentMsg = await sendMessage(selectedConvId, text)
    if (sentMsg) {
      setMessages(prev => [...prev, sentMsg])
      setConversations(prev => prev.map(c => 
        c.id === selectedConvId 
          ? { ...c, lastMessage: sentMsg, updatedAt: "Just now" } 
          : c
      ))
    }
  }

  const handleSelectConversation = async (conv: ChatConversation) => {
    setSelectedConvId(conv.id)
    
    if (conv.unreadCount > 0) {
      const success = await markAsRead(conv.id)
      if (success) {
        setConversations(prev => prev.map(c => 
          c.id === conv.id ? { ...c, unreadCount: 0 } : c
        ))
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
              Message Center
            </h1>
            <p className="mt-1 text-muted-foreground">
              Communicate directly with your business partners
            </p>
          </div>

          <div className="h-[calc(100vh-16rem)] min-h-[500px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-border bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : (
              <ChatView
                conversations={conversations}
                messages={messages}
                currentUser={currentUser}
                onSelectConversation={handleSelectConversation}
                onSendMessage={handleSendMessage}
                selectedConversationId={selectedConvId}
                isLoading={isMessagesLoading}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
