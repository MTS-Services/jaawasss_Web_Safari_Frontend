"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Bell,
  Mail,
  Shield,
  Globe,
  CreditCard,
  User,
  Save
} from "lucide-react"

export default function ManufacturerSettingsPage() {
  const [notifications, setNotifications] = useState({
    newInquiry: true,
    newMessage: true,
    quoteRequest: true,
    weeklyDigest: true,
    promotions: false,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Details
              </CardTitle>
              <CardDescription>
                Manage your login credentials and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <Input defaultValue="Michael" className="mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <Input defaultValue="Chen" className="mt-2" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <Input defaultValue="michael@techvision.com" className="mt-2" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input defaultValue="+86 755 1234 5678" className="mt-2" type="tel" />
              </div>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-foreground">New Inquiry Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when buyers send inquiries</p>
                </div>
                <Switch 
                  checked={notifications.newInquiry}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newInquiry: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">New Messages</p>
                  <p className="text-sm text-muted-foreground">Get notified for new messages from buyers</p>
                </div>
                <Switch 
                  checked={notifications.newMessage}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newMessage: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">Quote Requests</p>
                  <p className="text-sm text-muted-foreground">Get notified when you receive RFQs</p>
                </div>
                <Switch 
                  checked={notifications.quoteRequest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, quoteRequest: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">Weekly Performance Digest</p>
                  <p className="text-sm text-muted-foreground">Receive weekly analytics summary</p>
                </div>
                <Switch 
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">Marketing & Promotions</p>
                  <p className="text-sm text-muted-foreground">Receive tips and promotional offers</p>
                </div>
                <Switch 
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Region
              </CardTitle>
              <CardDescription>
                Set your preferred language and timezone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Language</label>
                  <Select defaultValue="en">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">Chinese (Simplified)</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Timezone</label>
                  <Select defaultValue="asia-shanghai">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-shanghai">Asia/Shanghai (GMT+8)</SelectItem>
                      <SelectItem value="america-los-angeles">America/Los Angeles (GMT-8)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                      <SelectItem value="europe-berlin">Europe/Berlin (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Currency Display</label>
                <Select defaultValue="usd">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    <SelectItem value="cny">CNY - Chinese Yuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">Login History</p>
                  <p className="text-sm text-muted-foreground">View recent login activity</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">Connected Devices</p>
                  <p className="text-sm text-muted-foreground">Manage active sessions</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-secondary text-secondary-foreground">Premium</Badge>
                  <p className="mt-2 text-sm text-muted-foreground">$199/month</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-border p-3">
                <p className="text-sm text-muted-foreground">Next billing date</p>
                <p className="font-medium text-foreground">April 1, 2026</p>
              </div>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full">Upgrade Plan</Button>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive">
                  Cancel Subscription
                </Button>
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Primary Email</label>
                <p className="text-sm text-muted-foreground">michael@techvision.com</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Notification Email</label>
                <Input defaultValue="inquiries@techvision.com" className="mt-2" />
              </div>
              <Button variant="outline" size="sm">Add Email</Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">Deactivate Account</p>
                <p className="text-sm text-muted-foreground">Temporarily disable your account</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Deactivate
                </Button>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                <Button variant="destructive" size="sm" className="mt-2">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
