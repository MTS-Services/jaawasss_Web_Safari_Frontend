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
import { AccountDangerZone } from "@/components/settings/account-danger-zone"
import { TwoFactorSettings } from "@/components/settings/two-factor-settings"
import { LanguageSelector } from "@/components/settings/language-selector"
import { useTranslation } from "@/lib/i18n"

export default function ManufacturerSettingsPage() {
  const { t } = useTranslation();

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
          <h1 className="font-serif text-2xl font-medium text-foreground">{t.settings.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {t.settings.subtitle}
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          {t.common.save}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t.settings.accountDetails}
              </CardTitle>
              <CardDescription>
                {t.settings.accountCredentialsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">{t.settings.firstName}</label>
                  <Input defaultValue="Michael" className="mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{t.settings.lastName}</label>
                  <Input defaultValue="Chen" className="mt-2" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t.settings.emailAddress}</label>
                <Input defaultValue="michael@techvision.com" className="mt-2" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t.settings.phoneNumber}</label>
                <Input defaultValue="+86 755 1234 5678" className="mt-2" type="tel" />
              </div>
              <Button variant="outline">{t.settings.changePassword}</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t.settings.notifications}
              </CardTitle>
              <CardDescription>
                {t.settings.notificationsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-foreground">{t.settings.newInquiryAlerts}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.newInquiryAlertsDesc}</p>
                </div>
                <Switch 
                  checked={notifications.newInquiry}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newInquiry: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">{t.settings.newMessages}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.newMessagesMfgDesc}</p>
                </div>
                <Switch 
                  checked={notifications.newMessage}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newMessage: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">{t.settings.quoteRequests}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.quoteRequestsDesc}</p>
                </div>
                <Switch 
                  checked={notifications.quoteRequest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, quoteRequest: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">{t.settings.weeklyPerformanceDigest}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.weeklyPerformanceDigestDesc}</p>
                </div>
                <Switch 
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">{t.settings.marketingPromotions}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.marketingPromotionsMfgDesc}</p>
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
                {t.settings.languageRegion}
              </CardTitle>
              <CardDescription>
                {t.settings.languageRegionDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">{t.settings.language}</label>
                  <LanguageSelector />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{t.settings.timezone}</label>
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
                <label className="text-sm font-medium text-foreground">{t.settings.currencyDisplay}</label>
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
                {t.settings.security}
              </CardTitle>
              <CardDescription>
                {t.settings.securityDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TwoFactorSettings />
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">{t.settings.loginHistory}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.loginHistoryDesc}</p>
                </div>
                <Button variant="outline" size="sm">{t.common.view}</Button>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">{t.settings.connectedDevices}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.connectedDevicesDesc}</p>
                </div>
                <Button variant="outline" size="sm">{t.common.manage}</Button>
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
                {t.settings.subscription}
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
                <p className="text-sm text-muted-foreground">{t.settings.nextBillingDate}</p>
                <p className="font-medium text-foreground">April 1, 2026</p>
              </div>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full">{t.settings.upgradePlan}</Button>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive">
                  {t.settings.cancelSubscription}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t.settings.emailSettings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">{t.settings.primaryEmail}</label>
                <p className="text-sm text-muted-foreground">michael@techvision.com</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t.settings.notificationEmail}</label>
                <Input defaultValue="inquiries@techvision.com" className="mt-2" />
              </div>
              <Button variant="outline" size="sm">{t.settings.addEmail}</Button>
            </CardContent>
          </Card>

          <AccountDangerZone />
        </div>
      </div>
    </div>
  )
}
