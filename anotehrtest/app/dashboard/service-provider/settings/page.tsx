"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { serviceProviders } from "@/lib/data/service-providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"

export default function ServiceProviderSettingsPage() {
  const { user } = useAuth()
  const providerId = user?.id ?? "sp-1"
  const provider = serviceProviders.find((p) => p.id === providerId) ?? serviceProviders[0]

  const [contactEmail, setContactEmail] = useState(user?.email ?? "provider@demo.com")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [notifyRequests, setNotifyRequests] = useState(true)
  const [notifyMessages, setNotifyMessages] = useState(true)
  const [notifyMarketing, setNotifyMarketing] = useState(false)
  const [visible, setVisible] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your contact details, notifications, and visibility.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground">Contact details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="email">Contact email</Label>
            <Input id="email" type="email" className="mt-1.5" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" className="mt-1.5" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground">Notifications</h2>
        <div className="mt-4 space-y-4">
          <SettingToggle
            label="New service requests"
            description="Get notified when a buyer sends you a new request."
            checked={notifyRequests}
            onChange={setNotifyRequests}
          />
          <SettingToggle
            label="New messages"
            description="Get notified when a buyer replies to a conversation."
            checked={notifyMessages}
            onChange={setNotifyMessages}
          />
          <SettingToggle
            label="Product updates & tips"
            description="Occasional emails about new features and best practices."
            checked={notifyMarketing}
            onChange={setNotifyMarketing}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground">Profile visibility</h2>
        <div className="mt-4">
          <SettingToggle
            label="Listed in the marketplace"
            description="When off, your profile is hidden from buyers and search results."
            checked={visible}
            onChange={setVisible}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-secondary">
            <Check className="h-4 w-4" />
            Saved
          </span>
        )}
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  )
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
