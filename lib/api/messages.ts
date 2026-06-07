import { apiClient } from "./client"
import { formatDistanceToNow } from "date-fns"

// Types based on the ChatView component
export interface ChatParticipant {
  id: string
  name: string
  avatar?: string
  role: "buyer" | "manufacturer" | "admin"
  company?: string
  country?: string
}

export interface ChatMessage {
  id: string
  senderId: string
  text: string
  timestamp: string
  isRead: boolean
  attachments?: string[]
}

export interface ChatConversation {
  id: string
  participants: ChatParticipant[]
  lastMessage?: ChatMessage
  unreadCount: number
  updatedAt: string
}

/**
 * Raw API Response Types
 */
interface ApiUser {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  company_name?: string
  country?: string
}

interface ApiConversation {
  id: number
  name: string | null
  created_by: number
  created_at: string
  updated_at: string
  is_unread: boolean
  last_message_sent_at: string | null
  creator: ApiUser
  participants: ApiUser[]
}

/**
 * Normalizes an API user to the frontend ChatParticipant type
 */
function normalizeParticipant(user: ApiUser): ChatParticipant {
  return {
    id: user.id.toString(),
    name: `${user.first_name} ${user.last_name}`.trim(),
    role: user.role as any,
    company: user.company_name,
    country: user.country
  }
}

/**
 * Normalizes an API conversation to the frontend ChatConversation type
 */
function normalizeConversation(conv: ApiConversation): ChatConversation {
  const lastActivity = conv.last_message_sent_at || conv.updated_at
  let formattedTime = "Recently"
  
  try {
    if (lastActivity) {
      formattedTime = formatDistanceToNow(new Date(lastActivity.replace(' ', 'T')), { addSuffix: true })
    }
  } catch (e) {
    console.error("Date formatting error:", e)
  }

  return {
    id: conv.id.toString(),
    participants: (conv.participants || []).map(normalizeParticipant),
    unreadCount: conv.is_unread ? 1 : 0,
    updatedAt: formattedTime,
    lastMessage: undefined 
  }
}

/**
 * Fetch all conversations for the current user
 */
export async function getConversations(params?: Record<string, any>): Promise<ChatConversation[]> {
  try {
    const response = await apiClient.get("/conversations", { 
      params: {
        per_page: 50,
        ...params
      }
    })
    
    const rawData = response.data?.data
    
    if (Array.isArray(rawData)) {
      return rawData.map(normalizeConversation)
    }
    
    return []
  } catch (error) {
    console.error("Failed to fetch conversations:", error)
    return []
  }
}

/**
 * Create a new conversation
 */
export async function createConversation(participantIds: number[], name?: string): Promise<ChatConversation | null> {
  try {
    const response = await apiClient.post("/conversations", {
      participant_ids: participantIds,
      name
    })
    const data = response.data?.data
    return data ? normalizeConversation(data) : null
  } catch (error) {
    console.error("Failed to create conversation:", error)
    return null
  }
}

/**
 * Fetch messages for a specific conversation
 */
export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}/messages`)
    const rawMessages = response.data?.data || []
    
    if (Array.isArray(rawMessages)) {
      return rawMessages
        .slice()
        .sort((a: any, b: any) => {
          const aTime = a?.created_at ? new Date(a.created_at).getTime() : 0
          const bTime = b?.created_at ? new Date(b.created_at).getTime() : 0
          return aTime - bTime
        })
        .map((m: any) => ({
        id: m.id.toString(),
        senderId: m.sender_id.toString(),
        text: m.body || m.content || m.message || "",
        timestamp: m.created_at ? formatDistanceToNow(new Date(m.created_at), { addSuffix: true }) : "",
        isRead: !!m.read_at,
        attachments: m.attachments
      }))
    }
    
    return []
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return []
  }
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(conversationId: string, text: string, files?: File[]): Promise<ChatMessage | null> {
  try {
    const formData = new FormData()
    formData.append("body", text)
    
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
    }

    const response = await apiClient.post(`/conversations/${conversationId}/messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    
    const m = response.data?.data
    if (m) {
      return {
        id: m.id.toString(),
        senderId: m.sender_id.toString(),
        text: m.body || m.content || m.message || "",
        timestamp: "Just now",
        isRead: true,
        attachments: m.attachments
      }
    }
    return null
  } catch (error) {
    console.error("Failed to send message:", error)
    return null
  }
}

/**
 * Mark a conversation as read
 */
export async function markAsRead(conversationId: string): Promise<boolean> {
  try {
    await apiClient.post(`/conversations/${conversationId}/read`)
    return true
  } catch (error) {
    console.error("Failed to mark as read:", error)
    return false
  }
}
