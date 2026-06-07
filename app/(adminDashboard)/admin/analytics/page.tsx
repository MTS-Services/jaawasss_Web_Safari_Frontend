"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Factory,
  Package,
  FileText,
  MessageSquare,
  DollarSign,
  Globe,
  BarChart3
} from "lucide-react"

const metrics = [
  { label: "Total Revenue", value: "$1.2M", change: "+18.5%", trend: "up", icon: DollarSign },
  { label: "Active Users", value: "12,847", change: "+12.5%", trend: "up", icon: Users },
  { label: "Active Suppliers", value: "1,234", change: "+8.3%", trend: "up", icon: Factory },
  { label: "Products Listed", value: "45,678", change: "+15.2%", trend: "up", icon: Package },
  { label: "RFQs This Month", value: "3,456", change: "-2.1%", trend: "down", icon: FileText },
  { label: "Messages Sent", value: "28,943", change: "+22.4%", trend: "up", icon: MessageSquare },
]

const topCountries = [
  { country: "United States", users: "4,234", percentage: 33 },
  { country: "Germany", users: "1,892", percentage: 15 },
  { country: "United Kingdom", users: "1,543", percentage: 12 },
  { country: "Australia", users: "1,234", percentage: 10 },
  { country: "Canada", users: "987", percentage: 8 },
  { country: "Other", users: "2,957", percentage: 22 },
]

const topIndustries = [
  { industry: "Consumer Electronics", suppliers: 234, products: 12456 },
  { industry: "Textiles & Apparel", suppliers: 189, products: 8934 },
  { industry: "Machinery & Equipment", suppliers: 156, products: 5678 },
  { industry: "Home & Garden", suppliers: 134, products: 7823 },
  { industry: "Food & Agriculture", suppliers: 98, products: 3456 },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Platform performance and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        {/* Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Growth
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
                  Showing users, suppliers, and RFQs over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              User Distribution by Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountries.map((item) => (
                <div key={item.country} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.country}</span>
                    <span className="text-sm text-muted-foreground">{item.users} users ({item.percentage}%)</span>
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

        {/* Top Industries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5" />
              Top Industries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topIndustries.map((item, index) => (
                <div key={item.industry} className="flex items-center gap-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.industry}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.suppliers} suppliers • {item.products.toLocaleString()} products
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
