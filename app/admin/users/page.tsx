"use client"

import { useState } from "react"
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
} from "@/components/ui/dialog"
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
} from "lucide-react"

type UserStatus = "active" | "pending" | "suspended" | "deactivated"
type UserRole = "buyer" | "manufacturer" | "admin"

interface UserItem {
  id: string
  name: string
  email: string
  role: UserRole
  company: string
  status: UserStatus
  country: string
  joinedAt: string
}

const initialUsers: UserItem[] = [
  { id: "1", name: "John Smith", email: "john@abcimports.com", role: "buyer", company: "ABC Imports LLC", status: "active", country: "United States", joinedAt: "Jan 15, 2026" },
  { id: "2", name: "Michael Chen", email: "michael@techvision.com", role: "manufacturer", company: "TechVision Electronics", status: "active", country: "China", joinedAt: "Dec 8, 2025" },
  { id: "3", name: "Emma Wilson", email: "emma@eurotraders.de", role: "buyer", company: "European Traders GmbH", status: "active", country: "Germany", joinedAt: "Feb 1, 2026" },
  { id: "4", name: "Sarah Johnson", email: "sarah@ecothread.com", role: "manufacturer", company: "EcoThread Textiles", status: "pending", country: "China", joinedAt: "Mar 5, 2026" },
  { id: "5", name: "David Lee", email: "david@pacificretail.com", role: "buyer", company: "Pacific Retail Group", status: "suspended", country: "United States", joinedAt: "Nov 20, 2025" },
  { id: "6", name: "Admin User", email: "admin@sourcenest.com", role: "admin", company: "SourceNest", status: "active", country: "United States", joinedAt: "Jan 1, 2025" },
  { id: "7", name: "Raj Patel", email: "raj@indiaexports.in", role: "manufacturer", company: "India Exports Ltd", status: "active", country: "India", joinedAt: "Feb 20, 2026" },
  { id: "8", name: "Maria Garcia", email: "maria@latinimports.mx", role: "buyer", company: "Latin Imports SA", status: "active", country: "Mexico", joinedAt: "Mar 1, 2026" },
  { id: "9", name: "Kim Nguyen", email: "kim@vietfactory.vn", role: "manufacturer", company: "VietFactory Co", status: "deactivated", country: "Vietnam", joinedAt: "Oct 15, 2025" },
]

const statusConfig: Record<UserStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  suspended: { label: "Suspended", color: "bg-red-100 text-red-700" },
  deactivated: { label: "Deactivated", color: "bg-slate-100 text-slate-700" },
}

const roleConfig: Record<UserRole, { label: string; icon: typeof User; color: string }> = {
  buyer: { label: "Buyer", icon: User, color: "bg-blue-100 text-blue-700" },
  manufacturer: { label: "Manufacturer", icon: Factory, color: "bg-purple-100 text-purple-700" },
  admin: { label: "Admin", icon: Shield, color: "bg-red-100 text-red-700" },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null)

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

  const updateUserStatus = (id: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u))
  }

  const bulkUpdateStatus = (status: UserStatus) => {
    setUsers(prev => prev.map(u => 
      selectedUsers.includes(u.id) ? { ...u, status } : u
    ))
    setSelectedUsers([])
  }

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const openUserDetails = (user: UserItem) => {
    setCurrentUser(user)
    setShowUserDialog(true)
  }

  const buyerCount = users.filter(u => u.role === "buyer").length
  const manufacturerCount = users.filter(u => u.role === "manufacturer").length

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
            <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("suspended")}>
              <Ban className="mr-1 h-3 w-3" />
              Suspend
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("deactivated")}>
              Deactivate
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setSelectedUsers([])}>
            Clear
          </Button>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
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
                    <Badge className={statusConfig[user.status].color}>
                      {statusConfig[user.status].label}
                    </Badge>
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
                        {user.status !== "suspended" && (
                          <DropdownMenuItem onClick={() => updateUserStatus(user.id, "suspended")}>
                            <Ban className="mr-2 h-4 w-4 text-red-600" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        {user.status !== "deactivated" && (
                          <DropdownMenuItem onClick={() => updateUserStatus(user.id, "deactivated")}>
                            Deactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteUser(user.id)}
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
      </div>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
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
                <div>
                  <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Role:</span>
                  <Badge className={roleConfig[currentUser.role].color + " mt-1"}>
                    {roleConfig[currentUser.role].label}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={statusConfig[currentUser.status].color + " mt-1"}>
                    {statusConfig[currentUser.status].label}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Company:</span>
                  <p className="font-medium">{currentUser.company}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Country:</span>
                  <p className="font-medium">{currentUser.country}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Joined:</span>
                  <p className="font-medium">{currentUser.joinedAt}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>Close</Button>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Contact User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
