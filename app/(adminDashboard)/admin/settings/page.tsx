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
import { LanguageSelector } from "@/components/settings/language-selector"
import { useTranslation } from "@/lib/i18n"

export default function AdminSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">{t.settings.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {t.settings.adminSubtitle}
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          {t.common.save}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t.settings.generalSettings}
            </CardTitle>
            <CardDescription>
              {t.settings.generalSettingsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">{t.settings.platformName}</label>
              <Input defaultValue="SourceNest" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t.settings.supportEmail}</label>
              <Input defaultValue="support@sourcenest.com" className="mt-2" type="email" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t.settings.contactPhone}</label>
              <Input defaultValue="+1 (800) 555-0123" className="mt-2" type="tel" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t.settings.securitySettings}
            </CardTitle>
            <CardDescription>
              {t.settings.securitySettingsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t.settings.requireEmailVerification}</p>
                <p className="text-sm text-muted-foreground">{t.settings.requireEmailVerificationDesc}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t.settings.manualSupplierApproval}</p>
                <p className="text-sm text-muted-foreground">{t.settings.manualSupplierApprovalDesc}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t.settings.rateLimiting}</p>
                <p className="text-sm text-muted-foreground">{t.settings.rateLimitingDesc}</p>
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
              {t.settings.adminNotifications}
            </CardTitle>
            <CardDescription>
              {t.settings.adminNotificationsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t.settings.newSupplierRegistrations}</p>
                <p className="text-sm text-muted-foreground">{t.settings.newSupplierRegistrationsDesc}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t.settings.reportedContent}</p>
                <p className="text-sm text-muted-foreground">{t.settings.reportedContentDesc}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t.settings.dailySummary}</p>
                <p className="text-sm text-muted-foreground">{t.settings.dailySummaryDesc}</p>
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
              {t.settings.emailSettings}
            </CardTitle>
            <CardDescription>
              {t.settings.emailSettingsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">{t.settings.fromName}</label>
              <Input defaultValue="SourceNest Team" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t.settings.fromEmail}</label>
              <Input defaultValue="noreply@sourcenest.com" className="mt-2" type="email" />
            </div>
            <Button variant="outline">{t.settings.testEmailDelivery}</Button>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t.settings.localization}
            </CardTitle>
            <CardDescription>
              {t.settings.localizationDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">{t.settings.defaultLanguage}</label>
              <LanguageSelector />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t.settings.defaultCurrency}</label>
              <Input defaultValue="USD" className="mt-2" disabled />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t.settings.defaultTimezone}</label>
              <Input defaultValue="UTC" className="mt-2" disabled />
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {t.settings.database}
            </CardTitle>
            <CardDescription>
              {t.settings.databaseDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">{t.settings.lastBackup}</p>
              <p className="font-medium text-foreground">March 15, 2026 at 3:00 AM UTC</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">{t.settings.createBackup}</Button>
              <Button variant="outline">{t.settings.exportData}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
