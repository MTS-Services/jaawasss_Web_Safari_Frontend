"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search,
  CreditCard,
  TrendingUp,
  DollarSign,
  Users,
  Factory,
  MoreVertical,
  Eye
} from "lucide-react"

interface Subscription {
  id: string
  company: string
  plan: "starter" | "professional" | "enterprise"
  status: "active" | "cancelled" | "expired" | "pending"
  amount: number
  billingCycle: "monthly" | "yearly"
  nextBilling: string
  startDate: string
}

const subscriptions: Subscription[] = [
  { id: "1", company: "TechVision Electronics", plan: "enterprise", status: "active", amount: 499, billingCycle: "monthly", nextBilling: "Apr 15, 2026", startDate: "Jan 15, 2025" },
  { id: "2", company: "EcoThread Textiles", plan: "professional", status: "active", amount: 199, billingCycle: "monthly", nextBilling: "Apr 10, 2026", startDate: "Feb 10, 2025" },
  { id: "3", company: "GlobalFab Machinery", plan: "enterprise", status: "active", amount: 4990, billingCycle: "yearly", nextBilling: "Dec 1, 2026", startDate: "Dec 1, 2025" },
  { id: "4", company: "India Exports Ltd", plan: "starter", status: "active", amount: 79, billingCycle: "monthly", nextBilling: "Apr 20, 2026", startDate: "Feb 20, 2026" },
  { id: "5", company: "NewTech Industries", plan: "professional", status: "pending", amount: 199, billingCycle: "monthly", nextBilling: "-", startDate: "Mar 13, 2026" },
  { id: "6", company: "QuickPack Solutions", plan: "starter", status: "cancelled", amount: 79, billingCycle: "monthly", nextBilling: "-", startDate: "Jan 1, 2026" },
  { id: "7", company: "Suspended Corp", plan: "professional", status: "expired", amount: 199, billingCycle: "monthly", nextBilling: "-", startDate: "Aug 15, 2025" },
]

const planConfig: Record<string, { label: string; color: string }> = {
  starter: { label: "Starter", color: "bg-slate-100 text-slate-700" },
  professional: { label: "Professional", color: "bg-blue-100 text-blue-700" },
  enterprise: { label: "Enterprise", color: "bg-amber-100 text-amber-700" },
}

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-700" },
  expired: { label: "Expired", color: "bg-red-100 text-red-700" },
}

export default function AdminSubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [planFilter, setPlanFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredSubs = subscriptions.filter(sub => {
    if (searchQuery && !sub.company.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (planFilter !== "all" && sub.plan !== planFilter) return false
    if (statusFilter !== "all" && sub.status !== statusFilter) return false
    return true
  })

  const activeSubs = subscriptions.filter(s => s.status === "active").length
  const monthlyRevenue = subscriptions
    .filter(s => s.status === "active")
    .reduce((sum, s) => sum + (s.billingCycle === "monthly" ? s.amount : s.amount / 12), 0)
  const annualRevenue = monthlyRevenue * 12

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Subscriptions</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor and manage manufacturer subscriptions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeSubs}</p>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <DollarSign className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">${annualRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Annual Revenue (Est.)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <CreditCard className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{subscriptions.filter(s => s.plan === "enterprise").length}</p>
                <p className="text-sm text-muted-foreground">Enterprise Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Company</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Plan</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden md:table-cell">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden lg:table-cell">Billing</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden lg:table-cell">Next Billing</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubs.map((sub) => (
              <tr key={sub.id} className="border-t border-border hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Factory className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{sub.company}</p>
                      <p className="text-xs text-muted-foreground">Since {sub.startDate}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={planConfig[sub.plan].color}>
                    {planConfig[sub.plan].label}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="font-medium text-foreground">${sub.amount}</span>
                  <span className="text-xs text-muted-foreground">/{sub.billingCycle === "monthly" ? "mo" : "yr"}</span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell capitalize">
                  {sub.billingCycle}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                  {sub.nextBilling}
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusConfig[sub.status].color}>
                    {statusConfig[sub.status].label}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSubs.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No subscriptions found</p>
          </div>
        )}
      </div>
    </div>
  )
}
