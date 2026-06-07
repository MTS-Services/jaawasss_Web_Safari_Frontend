"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search,
  User,
  Factory,
  MoreVertical,
  Mail,
  Ban,
  CheckCircle,
  Trash2,
  Eye,
  Shield
  ,Loader2
} from "lucide-react"

type UserStatus = "active" | "pending" | "suspended" | "deactivated" | "deleted"
type UserRole = "buyer" | "manufacturer" | "admin"

interface UserItem {
  id: string
  name: string
  email: string
  role: UserRole
  company: string | null
  status: UserStatus
  country?: string
  joinedAt?: string
}

type AdminUserDetail = UserItem & {
  first_name?: string
  last_name?: string
  status_label?: string
  statuses?: Record<string, string>
  agreed_to_terms?: boolean
  two_factor_enabled?: boolean
  deactivated_at?: string | null
  deactivated_reason?: string | null
  created_at?: string
  updated_at?: string
  preferred_language?: string
  timezone?: string
  quote_notification?: number
  message_notification?: number
  supplier_update?: number
  weekly_digest?: number
  marketing_promotion?: number
  preferred_currency?: { code: string; symbol: string } | null
  login_history?: any[]
  company?: any
}

import { apiClient } from "@/lib/api/client"
import { normalizeUserRole } from "@/lib/roles/dashboard-route"
import { useToast } from "@/hooks/use-toast"
import { getApiErrorMessage } from "@/lib/api/errors"
import { createConversation, getConversations } from "@/lib/api/messages"
import { useAuth } from "@/lib/auth-context"

// Start with an empty list; the component will load data from the API.
const initialUsers: UserItem[] = []

const statusConfig: Record<UserStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  suspended: { label: "Suspended", color: "bg-red-100 text-red-700" },
  deactivated: { label: "Deactivated", color: "bg-slate-100 text-slate-700" },
  deleted: { label: "Deleted", color: "bg-rose-100 text-rose-700" },
}

function getStatusInfo(status?: string | UserStatus) {
  const key = String(status ?? "active").toLowerCase() as UserStatus
  const info = statusConfig[key]
  if (info) return info

  const label = typeof status === "string" && status.trim()
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown"

  return { label, color: "bg-slate-100 text-slate-700" }
}

const roleConfig: Record<UserRole, { label: string; icon: typeof User; color: string }> = {
  buyer: { label: "Buyer", icon: User, color: "bg-blue-100 text-blue-700" },
  manufacturer: { label: "Manufacturer", icon: Factory, color: "bg-purple-100 text-purple-700" },
  admin: { label: "Admin", icon: Shield, color: "bg-red-100 text-red-700" },
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user: currentAuthUser } = useAuth()
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(5)
  const [reloadKey, setReloadKey] = useState<number>(0)
  const [meta, setMeta] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminUserDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState<boolean>(false)
  // Action dialogs state
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [deactivateTarget, setDeactivateTarget] = useState<string | null>(null)
  const [deactivateReason, setDeactivateReason] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState("")
  const [bulkDeactivateOpen, setBulkDeactivateOpen] = useState(false)
  const [bulkDeactivateReason, setBulkDeactivateReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [contactingUserId, setContactingUserId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchUsers() {
      setIsLoading(true)
      try {
        const params: Record<string, any> = { per_page: perPage, page }
        if (searchQuery) params.search = searchQuery
        if (roleFilter !== "all") params.role = roleFilter
        if (statusFilter !== "all") params.status = statusFilter

        const res = await apiClient.get("/admin/users", { params })
        const payload = res.data

        if (!mounted) return

        const mapped: UserItem[] = (payload.data ?? []).map((u: any) => ({
          id: String(u.id),
          name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim(),
          email: u.email ?? "",
          role: normalizeUserRole(String(u.role ?? "buyer")),
          company: u.company?.company_name ?? null,
          status: (String(u.status ?? "active")).toLowerCase() as UserStatus,
          country: u.company?.country ?? undefined,
          joinedAt: u.created_at ?? undefined,
        }))

        setUsers(mapped)
        setMeta(payload.meta ?? null)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch users", err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchUsers()

    return () => {
      mounted = false
    }
  }, [searchQuery, roleFilter, statusFilter, page, perPage, reloadKey])

  const filteredUsers = users.filter(user => {
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (roleFilter !== "all" && user.role !== roleFilter) return false
    if (statusFilter !== "all" && user.status !== statusFilter) return false
    return true
  })

  const allSelected = filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const updateUserStatus = async (id: string, status: UserStatus, reason?: string) => {
    const actionText = status === 'active' ? 'Activating' : status === 'deactivated' ? 'Deactivating' : 'Updating'
    toast({ title: `${actionText} user...` })

    try {
      if (status === 'active') {
        await apiClient.patch(`/admin/users/${id}/active`)
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u))
        toast({ title: 'User activated.' })
        setReloadKey(k => k + 1)
        return
      }

      if (status === 'deactivated') {
        await apiClient.patch(`/admin/users/${id}/deactivate`, { reason: reason ?? undefined })
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'deactivated' } : u))
        toast({ title: 'User deactivated.' })
        setReloadKey(k => k + 1)
        return
      }

      if (status === 'suspended') {
        // No API provided for suspend — perform local update only
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'suspended' } : u))
        toast({ title: 'User suspended (local update).' })
        return
      }

      // Fallback: local update
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u))
      toast({ title: 'User status updated (local).' })
    } catch (err) {
      toast({ title: 'Action failed', description: getApiErrorMessage(err), variant: 'destructive' })
    }
  }

  const bulkUpdateStatus = async (status: UserStatus) => {
    if (selectedUsers.length === 0) return

    if (status === 'active') {
      toast({ title: 'Activating users...' })
      try {
        await Promise.all(selectedUsers.map((id) => apiClient.patch(`/admin/users/${id}/active`)))
        setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u))
        setSelectedUsers([])
        toast({ title: 'Users activated.' })
        setReloadKey(k => k + 1)
        return
      } catch (err) {
        toast({ title: 'Bulk activation failed', description: getApiErrorMessage(err), variant: 'destructive' })
        return
      }
    }

    if (status === 'deactivated') {
      // Open bulk deactivate dialog to collect reason
      setBulkDeactivateOpen(true)
      return
    }

    // For other statuses, do local update only
    setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status } : u))
    setSelectedUsers([])
    toast({ title: 'Status updated (local).' })
  }

  const deleteUser = async (id: string, reason?: string) => {
    toast({ title: 'Deleting user...' })
    try {
      await apiClient.delete(`/admin/users/${id}`, { data: { reason: reason ?? undefined } })
      setUsers(prev => prev.filter(u => u.id !== id))
      toast({ title: 'User deleted.' })
      setReloadKey(k => k + 1)
    } catch (err) {
      toast({ title: 'Delete failed', description: getApiErrorMessage(err), variant: 'destructive' })
    }
  }

  const performBulkDeactivate = async () => {
    if (selectedUsers.length === 0) return
    setActionLoading(true)
    toast({ title: 'Deactivating users...' })
    try {
      await Promise.all(selectedUsers.map((id) => apiClient.patch(`/admin/users/${id}/deactivate`, { reason: bulkDeactivateReason ?? undefined })))
      setUsers(prev => prev.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'deactivated' } : u))
      setSelectedUsers([])
      toast({ title: 'Users deactivated.' })
      setReloadKey(k => k + 1)
      setBulkDeactivateOpen(false)
      setBulkDeactivateReason("")
    } catch (err) {
      toast({ title: 'Bulk deactivate failed', description: getApiErrorMessage(err), variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  const fetchUserDetail = async (userId: string) => {
    setDetailLoading(true)
    try {
      const res = await apiClient.get(`/admin/users/${userId}`)
      const u = res.data?.data
      if (!u) {
        toast({ title: "User not found", description: "The user details could not be retrieved.", variant: "destructive" })
        return
      }

      const mapped: AdminUserDetail = {
        id: String(u.id),
        first_name: u.first_name ?? undefined,
        last_name: u.last_name ?? undefined,
        name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim(),
        email: u.email ?? "",
        role: normalizeUserRole(String(u.role ?? "buyer")),
        company: u.company ?? null,
        status: (String(u.status ?? "active")).toLowerCase() as UserStatus,
        status_label: u.status_label ?? undefined,
        statuses: u.statuses ?? undefined,
        agreed_to_terms: u.agreed_to_terms ?? false,
        two_factor_enabled: u.two_factor_enabled ?? false,
        deactivated_at: u.deactivated_at ?? null,
        deactivated_reason: u.deactivated_reason ?? null,
        created_at: u.created_at ?? undefined,
        updated_at: u.updated_at ?? undefined,
        preferred_language: u.preferred_language ?? undefined,
        timezone: u.timezone ?? undefined,
        quote_notification: u.quote_notification ?? 0,
        message_notification: u.message_notification ?? 0,
        supplier_update: u.supplier_update ?? 0,
        weekly_digest: u.weekly_digest ?? 0,
        marketing_promotion: u.marketing_promotion ?? 0,
        preferred_currency: u.preferred_currency ?? null,
        login_history: u.login_history ?? [],
      }

      setCurrentUser(mapped)
    } catch (err) {
      toast({ title: "Failed to load user details", description: getApiErrorMessage(err) || String(err), variant: "destructive" })
    } finally {
      setDetailLoading(false)
    }
  }

  const openUserDetails = (user: UserItem) => {
    // show dialog immediately with lightweight data while fetching full details
    setCurrentUser(user as AdminUserDetail)
    setShowUserDialog(true)
    fetchUserDetail(user.id)
  }

  const buyerCount = users.filter(u => u.role === "buyer").length
  const manufacturerCount = users.filter(u => u.role === "manufacturer").length

  const contactUser = async () => {
    if (!currentUser?.id || !currentAuthUser?.id) return

    setContactingUserId(currentUser.id)
    try {
      const adminId = parseInt(currentAuthUser.id)
      const userId = parseInt(currentUser.id)
      
      // Check if a conversation already exists with this user
      const existingConversations = await getConversations()
      const existingConversation = existingConversations.find(conv => 
        conv.participants.some(p => p.id === currentUser.id.toString())
      )
      
      if (existingConversation) {
        // Conversation already exists, navigate to it
        setShowUserDialog(false)
        toast({ title: "Conversation found", description: "Opening existing conversation..." })
        router.push(`/messages?conversation=${existingConversation.id}`)
      } else {
        // Create a new conversation
        const conversation = await createConversation([adminId, userId])
        
        if (conversation) {
          setShowUserDialog(false)
          toast({ title: "Conversation started", description: "Redirecting to messages..." })
          router.push(`/messages?conversation=${conversation.id}`)
        } else {
          toast({ title: "Failed to start conversation", description: "Could not create conversation with this user", variant: "destructive" })
        }
      }
    } catch (err) {
      const errorMsg = getApiErrorMessage(err)
      // Handle the "conversation already exists" error gracefully
      if (errorMsg?.includes("already exists")) {
        toast({ title: "Conversation exists", description: "This conversation already exists. Opening it...", variant: "default" })
        // Fetch conversations again and find the one that was just checked
        const existingConversations = await getConversations()
        const existingConversation = existingConversations.find(conv => 
          conv.participants.some(p => p.id === currentUser?.id?.toString())
        )
        if (existingConversation) {
          setShowUserDialog(false)
          router.push(`/messages?conversation=${existingConversation.id}`)
        }
      } else {
        toast({ title: "Error", description: errorMsg || "Failed to contact user", variant: "destructive" })
      }
    } finally {
      setContactingUserId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Users</h1>
        <p className="mt-1 text-muted-foreground">
          Manage all platform users
          <span className="ml-3">
            <Badge variant="outline" className="mr-2">{buyerCount} Buyers</Badge>
            <Badge variant="outline">{manufacturerCount} Manufacturers</Badge>
          </span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="buyer">Buyers</SelectItem>
              <SelectItem value="manufacturer">Manufacturers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="deactivated">Deactivated</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
              <SelectItem value="scheduled_deletion">Scheduled Deletion</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 / page</SelectItem>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="25">25 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
          <span className="text-sm font-medium">{selectedUsers.length} selected</span>
            <div className="flex gap-2">
            <Button size="sm" onClick={() => bulkUpdateStatus("active")}>
              <CheckCircle className="mr-1 h-3 w-3" />
              Activate
            </Button>
            {/* <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("suspended")}> 
              <Ban className="mr-1 h-3 w-3" />
              Suspend
            </Button> */}
            <Button size="sm" variant="outline" onClick={() => { setBulkDeactivateReason(""); setBulkDeactivateOpen(true); }}>
              Deactivate
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setSelectedUsers([])}>
            Clear
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading users...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Mobile: card list */}
          <div className="block sm:hidden space-y-3">
        {filteredUsers.map((user) => {
          const RoleIcon = roleConfig[user.role].icon
          const s = getStatusInfo(user.status)
          return (
            <div key={user.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => toggleSelect(user.id)}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="ml-3">
                      <Badge className={roleConfig[user.role].color}>{roleConfig[user.role].label}</Badge>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="truncate">{user.company}</div>
                    <div className="ml-4">{user.joinedAt}</div>
                    <div className="ml-4">
                      <Badge className={s.color}>{s.label}</Badge>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openUserDetails(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status !== "active" && (
                          <DropdownMenuItem onClick={() => updateUserStatus(user.id, "active")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        {/* {user.status !== "suspended" && (
                          <DropdownMenuItem onClick={() => updateUserStatus(user.id, "suspended")}>
                            <Ban className="mr-2 h-4 w-4 text-red-600" />
                            Suspend
                          </DropdownMenuItem>
                        )} */}
                        {user.status !== "deactivated" && (
                          <DropdownMenuItem onClick={() => { setDeactivateTarget(user.id); setDeactivateReason(""); setDeactivateOpen(true); }}>
                            Deactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { setDeleteTarget(user.id); setDeleteReason(""); setDeleteOpen(true); }}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No users found</p>
          </div>
        )}

        {/* Mobile Pagination */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {meta?.from ?? (users.length ? 1 : 0)} - {meta?.to ?? users.length} of {meta?.total ?? users.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!!meta ? meta.current_page <= 1 : page <= 1}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">Page {meta?.current_page ?? page} / {meta?.last_page ?? 1}</div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((p) => p + 1)}
                disabled={!!meta ? meta.current_page >= meta.last_page : users.length < perPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden sm:table-cell">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden md:table-cell">Company</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden lg:table-cell">Country</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden lg:table-cell">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const RoleIcon = roleConfig[user.role].icon
              return (
                <tr key={user.id} className="border-t border-border hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)} 
                      onCheckedChange={() => toggleSelect(user.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <RoleIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge className={roleConfig[user.role].color}>
                      {roleConfig[user.role].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                    {user.company}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                    {user.country}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                    {user.joinedAt}
                  </td>
                  <td className="px-4 py-3">
                    {
                      (() => {
                        const s = getStatusInfo(user.status)
                        return (
                          <Badge className={s.color}>{s.label}</Badge>
                        )
                      })()
                    }
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openUserDetails(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status !== "active" && (
                          <DropdownMenuItem onClick={() => updateUserStatus(user.id, "active")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        {/* {user.status !== "suspended" && (
                          <DropdownMenuItem onClick={() => updateUserStatus(user.id, "suspended")}>
                            <Ban className="mr-2 h-4 w-4 text-red-600" />
                            Suspend
                          </DropdownMenuItem>
                        )} */}
                        {user.status !== "deactivated" && (
                          <DropdownMenuItem onClick={() => { setDeactivateTarget(user.id); setDeactivateReason(""); setDeactivateOpen(true); }}>
                            Deactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => { setDeleteTarget(user.id); setDeleteReason(""); setDeleteOpen(true); }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No users found</p>
          </div>
        )}
        {/* Pagination */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {meta?.from ?? (users.length ? 1 : 0)} - {meta?.to ?? users.length} of {meta?.total ?? users.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!!meta ? meta.current_page <= 1 : page <= 1}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">Page {meta?.current_page ?? page} / {meta?.last_page ?? 1}</div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((p) => p + 1)}
                disabled={!!meta ? meta.current_page >= meta.last_page : users.length < perPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>
          {detailLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">Loading user details...</div>
          )}

          {!detailLoading && currentUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  {currentUser.role === "admin" ? (
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  ) : currentUser.role === "manufacturer" ? (
                    <Factory className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">ID: {currentUser.id}</p>
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <Badge className={roleConfig[currentUser.role].color}>{roleConfig[currentUser.role].label}</Badge>
                  </div>
                  <div>
                    <Badge className={getStatusInfo(currentUser.status).color}>{currentUser.status_label ?? getStatusInfo(currentUser.status).label}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Company:</span>
                  <p className="font-medium">{typeof currentUser.company === 'string' ? currentUser.company : (currentUser.company?.company_name ?? "-")}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Timezone:</span>
                  <p className="font-medium">{currentUser.timezone ?? "-"}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Preferred language:</span>
                  <p className="font-medium">{currentUser.preferred_language ?? "-"}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Preferred currency:</span>
                  <p className="font-medium">{currentUser.preferred_currency ? `${currentUser.preferred_currency.code} - ${currentUser.preferred_currency.symbol}` : "-"}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Created at:</span>
                  <p className="font-medium">{currentUser.created_at ?? currentUser.joinedAt ?? "-"}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Last updated:</span>
                  <p className="font-medium">{currentUser.updated_at ?? "-"}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Agreed to terms:</span>
                  <p className="font-medium">{currentUser.agreed_to_terms ? "Yes" : "No"}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Two factor enabled:</span>
                  <p className="font-medium">{currentUser.two_factor_enabled ? "Yes" : "No"}</p>
                </div>

                {currentUser.deactivated_at && (
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">Deactivated at:</span>
                    <p className="font-medium">{currentUser.deactivated_at}</p>
                    {currentUser.deactivated_reason && (
                      <p className="text-sm text-muted-foreground">Reason: {currentUser.deactivated_reason}</p>
                    )}
                  </div>
                )}

                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Notifications:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="outline">Quotes: {currentUser.quote_notification ?? 0}</Badge>
                    <Badge variant="outline">Messages: {currentUser.message_notification ?? 0}</Badge>
                    <Badge variant="outline">Supplier updates: {currentUser.supplier_update ?? 0}</Badge>
                    <Badge variant="outline">Weekly digest: {currentUser.weekly_digest ?? 0}</Badge>
                    <Badge variant="outline">Marketing: {currentUser.marketing_promotion ?? 0}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>Close</Button>
            <Button onClick={contactUser} disabled={contactingUserId !== null}>
              {contactingUserId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Contacting...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Deactivate single user dialog */}
      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>Provide a reason for deactivating this user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Reason</Label>
            <Textarea value={deactivateReason} onChange={(e) => setDeactivateReason((e.target as HTMLTextAreaElement).value)} placeholder="Reason for deactivation" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button onClick={async () => {
              if (!deactivateTarget) return
              setActionLoading(true)
              await updateUserStatus(deactivateTarget, 'deactivated', deactivateReason)
              setActionLoading(false)
              setDeactivateOpen(false)
              setDeactivateTarget(null)
              setDeactivateReason("")
            }} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete single user dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>Deleting a user is permanent. Provide a reason (optional).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Reason</Label>
            <Textarea value={deleteReason} onChange={(e) => setDeleteReason((e.target as HTMLTextAreaElement).value)} placeholder="Reason for deletion (optional)" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button variant="destructive" onClick={async () => {
              if (!deleteTarget) return
              setActionLoading(true)
              await deleteUser(deleteTarget, deleteReason)
              setActionLoading(false)
              setDeleteOpen(false)
              setDeleteTarget(null)
              setDeleteReason("")
            }} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk deactivate dialog */}
      <Dialog open={bulkDeactivateOpen} onOpenChange={setBulkDeactivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Selected Users</DialogTitle>
            <DialogDescription>Provide a reason to deactivate the selected users.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Reason</Label>
            <Textarea value={bulkDeactivateReason} onChange={(e) => setBulkDeactivateReason((e.target as HTMLTextAreaElement).value)} placeholder="Reason for bulk deactivation" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeactivateOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button onClick={async () => { await performBulkDeactivate(); }} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
