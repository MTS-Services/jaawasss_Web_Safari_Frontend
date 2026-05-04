"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { apiClient } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"
import { getApiErrorMessage } from "@/lib/api/errors"
import { fetchCurrencies, type Currency } from "@/lib/api/currencies"

export default function BuyerSettingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast()

  const [notifications, setNotifications] = useState({
    newQuotes: true,
    newMessages: true,
    supplierUpdates: true,
    weeklyDigest: false,
    promotions: false,
  })

  const [profile, setProfile] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    phone: "",
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current_password: "", password: "", password_confirmation: "" })
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<string>("")



  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoadingProfile(true)
      try {
        const res = await apiClient.get("/buyer/profile")
        const data = res?.data?.data ?? res?.data
        if (!cancelled && data) {
          // Merge server response into profile state
          setProfile((p: any) => ({
            ...p,
            first_name: data.first_name || p.first_name,
            last_name: data.last_name || p.last_name,
            email: data.email || p.email,
            company_name: data.company?.company_name || p.company_name,
            phone: data.company?.phone || p.phone,
          }))
          // Set selected currency from profile
          if (data.preferred_currency?.code) {
            setSelectedCurrency(data.preferred_currency.code)
          }
        }
      } catch (err) {
        toast({ title: "Failed to load profile", description: getApiErrorMessage(err) || String(err), variant: "destructive" })
      } finally {
        if (!cancelled) setIsLoadingProfile(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [toast])

  useEffect(() => {
    let cancelled = false
    const loadCurrencies = async () => {
      setIsLoadingCurrencies(true)
      try {
        const data = await fetchCurrencies()
        if (!cancelled) {
          setCurrencies(data)
          // Set default to first currency or USD if available
          if (data.length > 0) {
            const usdCurrency = data.find(c => c.code === "USD")
            if (!selectedCurrency && usdCurrency) {
              setSelectedCurrency(usdCurrency.code)
            } else if (!selectedCurrency) {
              setSelectedCurrency(data[0].code)
            }
          }
        }
      } catch (err) {
        console.error("Error loading currencies:", err)
      } finally {
        if (!cancelled) setIsLoadingCurrencies(false)
      }
    }

    void loadCurrencies()
    return () => { cancelled = true }
  }, [])

  const saveProfile = useCallback(async () => {
    setIsSaving(true)
    try {
      const payload = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        company_name: profile.company_name,
        phone: profile.phone,
      }

      await apiClient.put("/buyer/profile/update", payload)
      toast({ title: "Profile updated", description: "Your profile has been updated.", variant: "default" })

      // Update local stored user if present
      try {
        const raw = localStorage.getItem("sourcenest_user")
        if (raw) {
          const stored = JSON.parse(raw)
          stored.firstName = payload.first_name || stored.firstName
          stored.lastName = payload.last_name || stored.lastName
          stored.email = payload.email || stored.email
          localStorage.setItem("sourcenest_user", JSON.stringify(stored))
        }
      } catch {
        // ignore
      }
    } catch (err) {
      toast({ title: "Save failed", description: getApiErrorMessage(err) || String(err), variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }, [profile, toast])

  const changePassword = useCallback(async () => {
    if (!pwdForm.current_password || !pwdForm.password) {
      toast({ title: "Missing fields", description: "Provide current and new password", variant: "destructive" })
      return
    }

    if (pwdForm.password !== pwdForm.password_confirmation) {
      toast({ title: "Mismatch", description: "Password confirmation does not match", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      await apiClient.put("/buyer/profile/change-password", {
        current_password: pwdForm.current_password,
        password: pwdForm.password,
        password_confirmation: pwdForm.password_confirmation,
      })
      toast({ title: "Password changed", description: "Your password has been updated.", variant: "default" })
      setPwdForm({ current_password: "", password: "", password_confirmation: "" })
      setShowPasswordForm(false)
    } catch (err) {
      toast({ title: "Password change failed", description: getApiErrorMessage(err) || String(err), variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }, [pwdForm, toast])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">{t.settings.title}</h1>
          <p className="mt-1 text-muted-foreground">{t.settings.subtitle}</p>
        </div>
        <Button className="gap-2" onClick={() => void saveProfile()} disabled={isSaving}>
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : t.common.save}
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
              <CardDescription>{t.settings.accountDetailsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">{t.settings.firstName}</label>
                  <Input
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{t.settings.lastName}</label>
                  <Input
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t.settings.emailAddress}</label>
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-2"
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t.settings.companyName}</label>
                <Input
                  value={profile.company_name}
                  onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t.settings.phoneNumber}</label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="mt-2"
                  type="tel"
                />
              </div>

              <div className="mt-2">
                <Button variant="outline" onClick={() => setShowPasswordForm((s) => !s)}>
                  {t.settings.changePassword}
                </Button>
              </div>

              {showPasswordForm && (
                <div className="mt-4 space-y-3">
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <Input
                    type="password"
                    value={pwdForm.current_password}
                    onChange={(e) => setPwdForm({ ...pwdForm, current_password: e.target.value })}
                    className="mt-2"
                  />
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <Input
                    type="password"
                    value={pwdForm.password}
                    onChange={(e) => setPwdForm({ ...pwdForm, password: e.target.value })}
                    className="mt-2"
                  />
                  <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                  <Input
                    type="password"
                    value={pwdForm.password_confirmation}
                    onChange={(e) => setPwdForm({ ...pwdForm, password_confirmation: e.target.value })}
                    className="mt-2"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => void changePassword()}>{t.common.save}</Button>
                    <Button variant="ghost" onClick={() => setShowPasswordForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}
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
                  <label className="text-sm font-medium text-foreground">{t.settings.currencyDisplay || "Currency Display"}</label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency} disabled={isLoadingCurrencies}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href="/dashboard/buyer/settings/login-history">{t.common.view}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <AccountDangerZone />
        </div>
      </div>
    </div>
  )
}
