"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { 
  Settings,
  Shield,
  Bell,
  Mail,
  Globe,
  Database,
  Save
} from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Platform configuration and preferences
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic platform configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Platform Name</label>
              <Input defaultValue="SourceNest" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Support Email</label>
              <Input defaultValue="support@sourcenest.com" className="mt-2" type="email" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Contact Phone</label>
              <Input defaultValue="+1 (800) 555-0123" className="mt-2" type="tel" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Platform security configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Require Email Verification</p>
                <p className="text-sm text-muted-foreground">Users must verify email before access</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Manual Supplier Approval</p>
                <p className="text-sm text-muted-foreground">Require admin approval for new suppliers</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Rate Limiting</p>
                <p className="text-sm text-muted-foreground">Limit API requests per user</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Admin notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">New Supplier Registrations</p>
                <p className="text-sm text-muted-foreground">Get notified for new supplier signups</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Reported Content</p>
                <p className="text-sm text-muted-foreground">Get notified for flagged content</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Daily Summary</p>
                <p className="text-sm text-muted-foreground">Receive daily platform summary</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
            <CardDescription>
              Email delivery configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">From Name</label>
              <Input defaultValue="SourceNest Team" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">From Email</label>
              <Input defaultValue="noreply@sourcenest.com" className="mt-2" type="email" />
            </div>
            <Button variant="outline">Test Email Delivery</Button>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Localization
            </CardTitle>
            <CardDescription>
              Regional and language settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Default Language</label>
              <Input defaultValue="English (US)" className="mt-2" disabled />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Default Currency</label>
              <Input defaultValue="USD" className="mt-2" disabled />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Default Timezone</label>
              <Input defaultValue="UTC" className="mt-2" disabled />
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
            <CardDescription>
              Database maintenance and backups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Last Backup</p>
              <p className="font-medium text-foreground">March 15, 2026 at 3:00 AM UTC</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Create Backup</Button>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
