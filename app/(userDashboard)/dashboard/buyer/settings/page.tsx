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

  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    phone: "",

    short_description: "",
    long_description: "",
    company_established: "",
    company_size: "",
    country: "",
    city: "",
    street_address: "",
    minimum_order_value: "",
    company_type: "",
    revenue: "",
    capabilities: [],
    certifications: [],
    export_markets: [],
    language_spoken: [],
    payments_term: [],
    factory_production: false,
    mulitple_factories: false,
    industries_id: [],
    factory_size: "",
    production_lines: "",
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current_password: "", password: "", password_confirmation: "" })

  useEffect(() => {
    // read stored user to obtain id and seed basic fields
    try {
      const raw = localStorage.getItem("sourcenest_user")
      if (raw) {
        const parsed = JSON.parse(raw)
        const id = parsed?.id ? String(parsed.id) : null
        setUserId(id)
        setProfile((p: any) => ({
          ...p,
          first_name: parsed?.firstName ?? p.first_name,
          last_name: parsed?.lastName ?? p.last_name,
          email: parsed?.email ?? p.email,
          company_name: parsed?.company ?? p.company_name,
        }))
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    const load = async () => {
      setIsLoadingProfile(true)
      try {
        const res = await apiClient.get(`/buyer/profile/${userId}`)
        const data = res?.data?.data ?? res?.data
        if (!cancelled && data) {
          // merge server response into profile state
          setProfile((p: any) => ({ ...p, ...data }))
        }
      } catch (err) {
        toast({ title: "Failed to load profile", description: getApiErrorMessage(err) || String(err), variant: "destructive" })
      } finally {
        if (!cancelled) setIsLoadingProfile(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [userId, toast])

  const saveProfile = useCallback(async () => {
    if (!userId) {
      toast({ title: "Not signed in", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const payload: Record<string, any> = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        company_name: profile.company_name,
        phone: profile.phone,

        short_description: profile.short_description,
        long_description: profile.long_description,
        company_established: profile.company_established,
        company_size: profile.company_size,
        country: profile.country,
        city: profile.city,
        street_address: profile.street_address,
        minimum_order_value: profile.minimum_order_value ? Number(profile.minimum_order_value) : undefined,
        company_type: profile.company_type,
        revenue: profile.revenue,
        capabilities: Array.isArray(profile.capabilities) ? profile.capabilities : (typeof profile.capabilities === 'string' ? profile.capabilities.split(',').map((s:any)=>s.trim()).filter(Boolean) : []),
        certifications: Array.isArray(profile.certifications) ? profile.certifications : (typeof profile.certifications === 'string' ? profile.certifications.split(',').map((s:any)=>s.trim()).filter(Boolean) : []),
        export_markets: Array.isArray(profile.export_markets) ? profile.export_markets : (typeof profile.export_markets === 'string' ? profile.export_markets.split(',').map((s:any)=>s.trim()).filter(Boolean) : []),
        language_spoken: Array.isArray(profile.language_spoken) ? profile.language_spoken : (typeof profile.language_spoken === 'string' ? profile.language_spoken.split(',').map((s:any)=>s.trim()).filter(Boolean) : []),
        payments_term: Array.isArray(profile.payments_term) ? profile.payments_term : (typeof profile.payments_term === 'string' ? profile.payments_term.split(',').map((s:any)=>s.trim()).filter(Boolean) : []),
        factory_production: !!profile.factory_production,
        mulitple_factories: !!profile.mulitple_factories,
        industries_id: profile.industries_id,
        factory_size: profile.factory_size ? Number(profile.factory_size) : undefined,
        production_lines: profile.production_lines ? Number(profile.production_lines) : undefined,
      }

      // strip undefined
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])

      await apiClient.put(`/buyer/profile/${userId}`, payload)
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
  }, [userId, profile, toast])

  const changePassword = useCallback(async () => {
    if (!userId) {
      toast({ title: "Not signed in", variant: "destructive" })
      return
    }

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
      await apiClient.put(`/buyer/profile/change/password/${userId}`, {
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
  }, [userId, pwdForm, toast])

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

          {/* Company Profile - simplified fields from backend */}
          <Card>
            <CardHeader>
              <CardTitle>{"Company Profile"}</CardTitle>
              <CardDescription>Company information visible to suppliers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Short Description</label>
                <Textarea value={profile.short_description || ""} onChange={(e) => setProfile({ ...profile, short_description: e.target.value })} className="mt-2" rows={2} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Long Description</label>
                <Textarea value={profile.long_description || ""} onChange={(e) => setProfile({ ...profile, long_description: e.target.value })} className="mt-2" rows={4} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Year Established</label>
                  <Input value={profile.company_established || ""} onChange={(e) => setProfile({ ...profile, company_established: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Company Size</label>
                  <Input value={profile.company_size || ""} onChange={(e) => setProfile({ ...profile, company_size: e.target.value })} className="mt-2" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Country</label>
                  <Input value={profile.country || ""} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">City</label>
                  <Input value={profile.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="mt-2" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Street Address</label>
                <Input value={profile.street_address || ""} onChange={(e) => setProfile({ ...profile, street_address: e.target.value })} className="mt-2" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Minimum Order Value</label>
                  <Input type="number" value={profile.minimum_order_value || ""} onChange={(e) => setProfile({ ...profile, minimum_order_value: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Company Type</label>
                  <Input value={profile.company_type || ""} onChange={(e) => setProfile({ ...profile, company_type: e.target.value })} className="mt-2" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Revenue</label>
                  <Input value={profile.revenue || ""} onChange={(e) => setProfile({ ...profile, revenue: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Factory Production</label>
                  <div className="mt-2">
                    <Switch checked={!!profile.factory_production} onCheckedChange={(v) => setProfile({ ...profile, factory_production: v })} />
                    <span className="ml-3 text-sm text-muted-foreground">Has factory production capability</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Capabilities (comma separated)</label>
                <Input value={(Array.isArray(profile.capabilities) ? profile.capabilities.join(', ') : (profile.capabilities || ''))} onChange={(e) => setProfile({ ...profile, capabilities: e.target.value })} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Certifications (comma separated)</label>
                <Input value={(Array.isArray(profile.certifications) ? profile.certifications.join(', ') : (profile.certifications || ''))} onChange={(e) => setProfile({ ...profile, certifications: e.target.value })} className="mt-2" />
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
