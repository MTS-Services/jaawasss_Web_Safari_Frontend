"use client"

import { useState, useEffect } from "react"
import { ChatView, ChatConversation, ChatMessage, ChatParticipant } from "@/components/chat/chat-view"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Loader2 } from "lucide-react"
import { getConversations, getMessages, sendMessage, markAsRead } from "@/lib/api/messages"
import { getEcho } from "@/lib/echo"

export default function AdminMessagesPage() {
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

  // Fetch conversations on mount
  useEffect(() => {
    async function loadConversations() {
      if (!isAuthenticated) return
      
      setIsLoading(true)
      try {
        const data = await getConversations({ per_page: 50 })
        setConversations(data)
        if (data.length > 0 && !selectedConvId) {
          setSelectedConvId(data[0].id)
        }
      } catch (error) {
        console.error("Failed to load admin conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConversations()
  }, [isAuthenticated, selectedConvId])

  // Fetch messages when selected conversation changes
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

  // Fallback sync so admin inbox updates even if websocket misses.
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

  // Real-time listener for new messages
  useEffect(() => {
    if (!selectedConvId) return
    const echo = getEcho()
    if (!echo) return

    const channel = echo.private(`chat.room.${selectedConvId}`)
    // Listen for incoming messages
    channel.listen(".message.sent", (data: any) => {
        // Echo prefix dot '.' means "don't add namespace" if the event is literal
        // Or if it's "MessageSent" it might be namespaced. The user said "message.sent".
        const newMsg = buildIncomingMessage(data)
        if (!newMsg) return
        
        setMessages(prev => {
          // Avoid duplicates (if we sent the message ourselves and it's already in state)
          if (prev.some(m => m.id === newMsg.id)) return prev
          return [...prev, newMsg]
        })

        // Update conversation list
        setConversations(prev => prev.map(c => 
          c.id === selectedConvId 
            ? { ...c, lastMessage: newMsg, updatedAt: "Just now" } 
            : c
        ))
      })

    // Diagnostic bindings to help debug live updates
    try {
      // Log subscription success / errors
      channel.bind && channel.bind("pusher:subscription_succeeded", () => {
        // eslint-disable-next-line no-console
        console.log(`Subscribed to chat.room.${selectedConvId}`)
      })
      channel.bind && channel.bind("pusher:subscription_error", (err: any) => {
        // eslint-disable-next-line no-console
        console.error(`Pusher subscription error for chat.room.${selectedConvId}:`, err)
      })

      // Log connection state changes
      if ((echo as any).connector?.pusher?.connection) {
        ;(echo as any).connector.pusher.connection.bind("state_change", (states: any) => {
          // eslint-disable-next-line no-console
          console.log("Pusher connection state:", states)
        })
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Pusher diagnostics setup failed", e)
    }

    return () => {
      echo.leave(`chat.room.${selectedConvId}`)
    }
  }, [selectedConvId])

  const currentUser: ChatParticipant = {
    id: user?.id?.toString() || "admin-1",
    name: user?.name || "Admin",
    role: "admin",
  }

  const handleSelectConversation = async (conv: ChatConversation) => {
    setSelectedConvId(conv.id)
    
    // Mark as read on backend if it has unread messages
    if (conv.unreadCount > 0) {
      const success = await markAsRead(conv.id)
      if (success) {
        setConversations(prev => prev.map(c => 
          c.id === conv.id ? { ...c, unreadCount: 0 } : c
        ))
      }
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!selectedConvId) return

    const sentMsg = await sendMessage(selectedConvId, text)
    if (sentMsg) {
      setMessages(prev => [...prev, sentMsg])
      
      // Update last message in conversation list
      setConversations(prev => prev.map(c => 
        c.id === selectedConvId 
          ? { ...c, lastMessage: sentMsg, updatedAt: "Just now" } 
          : c
      ))
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-140px)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          <p className="text-sm text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 h-[calc(100dvh-140px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Message Center</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and moderate conversations between buyers and manufacturers
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3.5 w-3.5 text-secondary" />
            Moderation Active
          </Badge>
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            {conversations.filter(c => (c as any).flagged).length} Flagged
          </Badge>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatView
          conversations={conversations}
          messages={messages}
          currentUser={currentUser}
          onSelectConversation={handleSelectConversation}
          onSendMessage={handleSendMessage}
          selectedConversationId={selectedConvId}
          isLoading={isMessagesLoading}
        />
      </div>
    </div>
  )
}
