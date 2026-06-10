"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  FileText,
  Users,
  Globe,
  BarChart3,
  Package
} from "lucide-react"

const metrics = [
  { label: "Profile Views", value: "2,847", change: "+12.5%", trend: "up", icon: Eye },
  { label: "Inquiries Received", value: "156", change: "+8.3%", trend: "up", icon: FileText },
  { label: "Messages", value: "423", change: "+15.2%", trend: "up", icon: MessageSquare },
  { label: "Quote Requests", value: "89", change: "-2.1%", trend: "down", icon: Package },
]

const topProducts = [
  { name: "TWS Wireless Earbuds Pro", views: 1234, inquiries: 45 },
  { name: "Smart Fitness Tracker V3", views: 987, inquiries: 38 },
  { name: "Bluetooth Speaker 20W", views: 756, inquiries: 29 },
  { name: "USB-C Fast Charger 65W", views: 654, inquiries: 24 },
  { name: "Wireless Mouse Ergonomic", views: 543, inquiries: 18 },
]

const topCountries = [
  { country: "United States", flag: "US", percentage: 35 },
  { country: "Germany", flag: "DE", percentage: 18 },
  { country: "United Kingdom", flag: "GB", percentage: 15 },
  { country: "Australia", flag: "AU", percentage: 12 },
  { country: "Canada", flag: "CA", percentage: 10 },
  { country: "Other", flag: "OT", percentage: 10 },
]

export default function ManufacturerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Track your performance and buyer engagement
          </p>
        </div>
        <Select defaultValue="30">
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <metric.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <Badge 
                  variant={metric.trend === "up" ? "secondary" : "outline"}
                  className="gap-1"
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">
                  Chart visualization would appear here
                </p>
                <p className="text-sm text-muted-foreground">
                  Showing inquiries, messages, and views over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.views.toLocaleString()} views • {product.inquiries} inquiries
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Buyer Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountries.map((item) => (
                <div key={item.country} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.country}</span>
                    <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div 
                      className="h-full rounded-full bg-secondary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">2,847</p>
                <p className="text-sm text-muted-foreground">Profile Views</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">423</p>
                <p className="text-sm text-muted-foreground">Messages Started</p>
                <p className="text-xs text-secondary">14.9% conversion</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">89</p>
                <p className="text-sm text-muted-foreground">Quotes Sent</p>
                <p className="text-xs text-secondary">21.0% conversion</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">34</p>
                <p className="text-sm text-muted-foreground">Orders Received</p>
                <p className="text-xs text-secondary">38.2% conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
