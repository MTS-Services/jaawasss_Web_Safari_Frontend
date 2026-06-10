"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  serviceProviders,
  serviceCategories,
  availabilityOptions,
  serviceLanguages,
} from "@/lib/data/service-providers"
import { countries as allCountries } from "@/lib/data/countries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check } from "lucide-react"

export default function ServiceProviderProfileEditPage() {
  const { user } = useAuth()
  const providerId = user?.id ?? "sp-1"
  const provider = serviceProviders.find((p) => p.id === providerId) ?? serviceProviders[0]

  const [form, setForm] = useState({
    name: provider.name,
    categorySlug: provider.categorySlug,
    shortDescription: provider.shortDescription,
    description: provider.description,
    city: provider.location.city,
    countryCode: provider.location.countryCode,
    availability: provider.availability,
    deliveryTime: provider.deliveryTime,
    startingPrice: provider.startingPrice ?? "",
    experienceYears: String(provider.experienceYears),
  })
  const [languages, setLanguages] = useState<string[]>(provider.languages)

  const update = (field: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]))
  }

  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground">Edit Profile</h1>
        <p className="mt-1 text-muted-foreground">This information appears on your public provider profile.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">Basic information</h2>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name">Provider / company name</Label>
              <Input id="name" className="mt-1.5" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="category">Service category</Label>
              <Select value={form.categorySlug} onValueChange={(v) => update("categorySlug", v)}>
                <SelectTrigger id="category" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="short">Short description</Label>
              <Input
                id="short"
                className="mt-1.5"
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="desc">Full description</Label>
              <Textarea
                id="desc"
                className="mt-1.5 min-h-32"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">Location & availability</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">City / region</Label>
              <Input id="city" className="mt-1.5" value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={form.countryCode} onValueChange={(v) => update("countryCode", v)}>
                <SelectTrigger id="country" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {allCountries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="availability">Service availability</Label>
              <Select value={form.availability} onValueChange={(v) => update("availability", v)}>
                <SelectTrigger id="availability" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label} — {o.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">Languages</h2>
          <p className="mt-1 text-sm text-muted-foreground">Select the languages you can work in.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {serviceLanguages.map((lang) => {
              const active = languages.includes(lang)
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={
                    active
                      ? "flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                      : "flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:border-secondary"
                  }
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  {lang}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">Pricing & delivery</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="price">Starting price</Label>
              <Input
                id="price"
                className="mt-1.5"
                placeholder="e.g., $450 or leave blank"
                value={form.startingPrice}
                onChange={(e) => update("startingPrice", e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">Leave blank for &quot;Price upon request&quot;.</p>
            </div>
            <div>
              <Label htmlFor="delivery">Delivery time</Label>
              <Input
                id="delivery"
                className="mt-1.5"
                value={form.deliveryTime}
                onChange={(e) => update("deliveryTime", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="exp">Years of experience</Label>
              <Input
                id="exp"
                type="number"
                className="mt-1.5"
                value={form.experienceYears}
                onChange={(e) => update("experienceYears", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline">{languages.length} languages selected</Badge>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-secondary">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
            <Button type="submit">Save changes</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
