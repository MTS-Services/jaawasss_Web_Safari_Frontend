"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Globe,
  Shield,
  User,
  Save
} from "lucide-react"

export default function BuyerSettingsPage() {
  const [notifications, setNotifications] = useState({
    newQuotes: true,
    newMessages: true,
    supplierUpdates: true,
    weeklyDigest: false,
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
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <Input defaultValue="John" className="mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <Input defaultValue="Smith" className="mt-2" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <Input defaultValue="john@abcimports.com" className="mt-2" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Company Name</label>
                <Input defaultValue="ABC Imports LLC" className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input defaultValue="+1 (555) 123-4567" className="mt-2" type="tel" />
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
                  <p className="font-medium text-foreground">New Quote Responses</p>
                  <p className="text-sm text-muted-foreground">Get notified when suppliers respond to your RFQs</p>
                </div>
                <Switch 
                  checked={notifications.newQuotes}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newQuotes: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">New Messages</p>
                  <p className="text-sm text-muted-foreground">Get notified for new messages from suppliers</p>
                </div>
                <Switch 
                  checked={notifications.newMessages}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newMessages: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">Supplier Updates</p>
                  <p className="text-sm text-muted-foreground">Get notified when saved suppliers add new products</p>
                </div>
                <Switch 
                  checked={notifications.supplierUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, supplierUpdates: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Receive a weekly summary of new suppliers in your interest areas</p>
                </div>
                <Switch 
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">Marketing & Promotions</p>
                  <p className="text-sm text-muted-foreground">Receive tips and special offers</p>
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
                  <Select defaultValue="america-los-angeles">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-los-angeles">America/Los Angeles (GMT-8)</SelectItem>
                      <SelectItem value="america-new-york">America/New York (GMT-5)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                      <SelectItem value="asia-shanghai">Asia/Shanghai (GMT+8)</SelectItem>
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                <Button variant="outline" size="sm" className="mt-2">Enable</Button>
              </div>
              <div className="border-t border-border pt-4">
                <p className="font-medium text-foreground">Login History</p>
                <p className="text-sm text-muted-foreground">View recent login activity</p>
                <Button variant="outline" size="sm" className="mt-2">View</Button>
              </div>
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
