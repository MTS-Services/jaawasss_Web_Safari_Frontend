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
import { AccountDangerZone } from "@/components/settings/account-danger-zone"
import { TwoFactorSettings } from "@/components/settings/two-factor-settings"
import { LanguageSelector } from "@/components/settings/language-selector"
import { useTranslation } from "@/lib/i18n"

export default function BuyerSettingsPage() {
  const { t } = useTranslation();

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
                {t.settings.accountDetailsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">{t.settings.firstName}</label>
                  <Input defaultValue="John" className="mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{t.settings.lastName}</label>
                  <Input defaultValue="Smith" className="mt-2" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t.settings.emailAddress}</label>
                <Input defaultValue="john@abcimports.com" className="mt-2" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t.settings.companyName}</label>
                <Input defaultValue="ABC Imports LLC" className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t.settings.phoneNumber}</label>
                <Input defaultValue="+1 (555) 123-4567" className="mt-2" type="tel" />
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
                  <p className="font-medium text-foreground">{t.settings.newQuoteResponses}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.newQuoteResponsesDesc}</p>
                </div>
                <Switch 
                  checked={notifications.newQuotes}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newQuotes: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">{t.settings.newMessages}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.newMessagesBuyerDesc}</p>
                </div>
                <Switch 
                  checked={notifications.newMessages}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newMessages: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">{t.settings.supplierUpdates}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.supplierUpdatesDesc}</p>
                </div>
                <Switch 
                  checked={notifications.supplierUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, supplierUpdates: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">{t.settings.weeklyDigest}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.weeklyDigestDesc}</p>
                </div>
                <Switch 
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-medium text-foreground">{t.settings.marketingPromotions}</p>
                  <p className="text-sm text-muted-foreground">{t.settings.marketingPromotionsDesc}</p>
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t.settings.security}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TwoFactorSettings />
              <div className="border-t border-border pt-4">
                <p className="font-medium text-foreground">{t.settings.loginHistory}</p>
                <p className="text-sm text-muted-foreground">{t.settings.loginHistoryDesc}</p>
                <Button variant="outline" size="sm" className="mt-2">{t.common.view}</Button>
              </div>
            </CardContent>
          </Card>

          <AccountDangerZone />
        </div>
      </div>
    </div>
  )
}
