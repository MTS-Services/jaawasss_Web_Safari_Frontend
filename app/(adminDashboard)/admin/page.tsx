"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Users,
  Factory,
  Package,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  MapPin,
  Mail,
  Calendar,
  X,
  FileQuestion
} from "lucide-react"

const stats = [
  { label: "Total Users", value: "12,847", change: "+12.5%", trend: "up", icon: Users },
  { label: "Active Suppliers", value: "1,234", change: "+8.3%", trend: "up", icon: Factory },
  { label: "Products Listed", value: "45,678", change: "+15.2%", trend: "up", icon: Package },
  { label: "RFQs This Month", value: "3,456", change: "-2.1%", trend: "down", icon: FileText },
]

interface PendingApproval {
  id: string
  type: string
  name: string
  description: string
  country: string
  industry: string
  email: string
  submittedAt: string
  submittedDate: string
  status: "pending" | "under_review" | "approved" | "rejected"
}

const initialPendingApprovals: PendingApproval[] = [
  {
    id: "1",
    type: "supplier",
    name: "NewTech Industries",
    description: "Leading electronics manufacturer specializing in consumer electronics, smart devices, and IoT components with 15 years of export experience.",
    country: "Vietnam",
    industry: "Consumer Electronics",
    email: "contact@newtech.vn",
    submittedAt: "2 hours ago",
    submittedDate: "March 16, 2026",
    status: "pending"
  },
  {
    id: "2",
    type: "supplier",
    name: "GreenLeaf Organics",
    description: "Certified organic food and agricultural products supplier, offering USDA and EU organic certified products for global markets.",
    country: "Thailand",
    industry: "Food & Agriculture",
    email: "hello@greenleaf.th",
    submittedAt: "5 hours ago",
    submittedDate: "March 16, 2026",
    status: "pending"
  },
  {
    id: "3",
    type: "supplier",
    name: "MetalWorks Pro",
    description: "Industrial machinery and metal fabrication specialist with ISO 9001 certification and capacity for large-scale production.",
    country: "China",
    industry: "Machinery & Equipment",
    email: "sales@metalworks.cn",
    submittedAt: "1 day ago",
    submittedDate: "March 15, 2026",
    status: "pending"
  },
]

const recentReports = [
  {
    id: "1",
    type: "spam",
    subject: "Suspicious product listing",
    reporter: "buyer@example.com",
    reportedAt: "1 hour ago"
  },
  {
    id: "2",
    type: "scam",
    subject: "Potential scam supplier",
    reporter: "john@company.com",
    reportedAt: "3 hours ago"
  },
  {
    id: "3",
    type: "content",
    subject: "Inappropriate product images",
    reporter: "admin@review.com",
    reportedAt: "1 day ago"
  },
]

const recentActivity = [
  { action: "New supplier registered", detail: "TechVision Electronics from Shenzhen", time: "10 min ago" },
  { action: "Product approved", detail: "TWS Earbuds Pro - 50 units", time: "25 min ago" },
  { action: "Supplier reviewed", detail: "EcoThread Textiles - Premium level", time: "1 hour ago" },
  { action: "User upgraded", detail: "ABC Imports upgraded to Premium", time: "2 hours ago" },
  { action: "RFQ resolved", detail: "Order completed for GlobalFab Machinery", time: "3 hours ago" },
]

export default function AdminDashboardPage() {
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(initialPendingApprovals)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [currentItem, setCurrentItem] = useState<PendingApproval | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const openReview = (item: PendingApproval) => {
    setCurrentItem(item)
    setShowReviewDialog(true)
  }

  const approveItem = (id: string) => {
    setPendingApprovals(prev => prev.map(item => 
      item.id === id ? { ...item, status: "approved" as const } : item
    ).filter(item => item.status === "pending" || item.status === "under_review"))
  }

  const rejectItem = () => {
    if (currentItem) {
      setPendingApprovals(prev => prev.filter(item => item.id !== currentItem.id))
      setShowRejectDialog(false)
      setCurrentItem(null)
      setRejectReason("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of platform activity and pending tasks
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="px-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <Badge 
                  variant={stat.trend === "up" ? "secondary" : "outline"}
                  className="gap-1"
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/suppliers">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
                  <p className="mt-3 text-muted-foreground">All approvals completed</p>
                </div>
              ) : (
                pendingApprovals.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden">
                    {/* Card Header */}
                    <div className="flex items-center gap-4 border-b border-border bg-muted/30 px-5 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Factory className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.industry}</p>
                      </div>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 shrink-0">
                        Pending
                      </Badge>
                    </div>
                    
                    {/* Card Body */}
                    <div className="px-5 py-4 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.submittedAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Footer */}
                    <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/20 px-5 py-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openReview(item)}
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Review
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => approveItem(item.id)}
                      >
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Recent Reports
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/reports">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{report.subject}</p>
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Reported by: {report.reporter}
                    </p>
                    <p className="text-xs text-muted-foreground">{report.reportedAt}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Investigate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">{activity.action}</span>
                    <span className="text-muted-foreground"> - {activity.detail}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Business Application</DialogTitle>
            <DialogDescription>
              Review the business details and take action
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Factory className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{currentItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentItem.industry}</p>
                </div>
              </div>
              
              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <p className="text-sm text-foreground">{currentItem.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Country</p>
                    <p className="font-medium text-foreground">{currentItem.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="font-medium text-foreground">{currentItem.submittedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{currentItem.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowReviewDialog(false)
                setShowRejectDialog(true)
              }}
              className="text-destructive hover:text-destructive"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
            >
              <FileQuestion className="mr-2 h-4 w-4" />
              Request Info
            </Button>
            <Button onClick={() => {
              if (currentItem) {
                approveItem(currentItem.id)
                setShowReviewDialog(false)
              }
            }}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this business application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rejection Reason</Label>
              <Textarea
                placeholder="Please explain why this application is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={rejectItem}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
