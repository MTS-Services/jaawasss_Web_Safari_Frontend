"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  Flag,
  User,
  Clock
} from "lucide-react"

const reports = [
  { id: "1", type: "spam", subject: "Suspicious product listing", target: "LED Smart Bulb WiFi", reporter: "buyer@example.com", status: "open", reportedAt: "1 hour ago", priority: "high" },
  { id: "2", type: "scam", subject: "Potential scam supplier", target: "NewTech Industries", reporter: "john@company.com", status: "investigating", reportedAt: "3 hours ago", priority: "high" },
  { id: "3", type: "content", subject: "Inappropriate product images", target: "Product ID: 12345", reporter: "admin@review.com", status: "open", reportedAt: "1 day ago", priority: "medium" },
  { id: "4", type: "fake", subject: "Fake certification claims", target: "MetalWorks Pro", reporter: "quality@check.com", status: "resolved", reportedAt: "2 days ago", priority: "high" },
  { id: "5", type: "harassment", subject: "Abusive messages from supplier", target: "User: seller123", reporter: "buyer456@email.com", status: "resolved", reportedAt: "3 days ago", priority: "medium" },
]

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700"
}

const statusColors: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  investigating: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
  dismissed: "bg-gray-100 text-gray-700"
}

export default function AdminReportsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredReports = reports.filter(report => {
    if (statusFilter !== "all" && report.status !== statusFilter) return false
    if (priorityFilter !== "all" && report.priority !== priorityFilter) return false
    return true
  })

  const openCount = reports.filter(r => r.status === "open" || r.status === "investigating").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          Reports
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review and resolve reported content
          {openCount > 0 && (
            <Badge variant="destructive" className="ml-2">{openCount} open</Badge>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <Flag className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{report.subject}</h3>
                    <Badge className={priorityColors[report.priority]}>
                      {report.priority} priority
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {report.type}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Target: <span className="font-medium">{report.target}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {report.reporter}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {report.reportedAt}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={statusColors[report.status]} variant="secondary">
                  {report.status}
                </Badge>
                {(report.status === "open" || report.status === "investigating") && (
                  <>
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-3 w-3" />
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline">
                      <X className="mr-1 h-3 w-3" />
                      Dismiss
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Resolve
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
