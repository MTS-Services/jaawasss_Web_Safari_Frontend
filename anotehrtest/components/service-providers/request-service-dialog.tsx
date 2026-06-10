"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useServiceRequests } from "@/lib/service-requests-context"
import type { ServiceProvider } from "@/lib/data/service-providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, Paperclip, Send, X } from "lucide-react"

interface RequestServiceDialogProps {
  provider: ServiceProvider
  trigger: React.ReactNode
}

export function RequestServiceDialog({ provider, trigger }: RequestServiceDialogProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { createRequest } = useServiceRequests()

  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  const [form, setForm] = useState({
    serviceNeeded: provider.servicesOffered[0] ?? "",
    countryRegion: "",
    description: "",
    deadline: "",
    budget: "",
    notes: "",
  })

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list) return
    const names = Array.from(list).map((f) => f.name)
    setFiles((prev) => [...prev, ...names])
    e.target.value = ""
  }

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f !== name))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }

    createRequest({
      providerId: provider.id,
      providerName: provider.name,
      providerSlug: provider.slug,
      categoryName: provider.categoryName,
      serviceNeeded: form.serviceNeeded,
      countryRegion: form.countryRegion,
      description: form.description,
      deadline: form.deadline,
      budget: form.budget,
      fileNames: files,
      notes: form.notes,
      buyerName: user ? `${user.firstName} ${user.lastName}` : "Guest Buyer",
      buyerCompany: user?.company ?? "",
      buyerEmail: user?.email ?? "",
    })

    setSubmitted(true)
  }

  const resetAndClose = (next: boolean) => {
    setOpen(next)
    if (!next) {
      // reset after close animation
      setTimeout(() => {
        setSubmitted(false)
        setFiles([])
        setForm({
          serviceNeeded: provider.servicesOffered[0] ?? "",
          countryRegion: "",
          description: "",
          deadline: "",
          budget: "",
          notes: "",
        })
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-medium text-foreground">Request sent</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {provider.name} has received your request and will reply through your messages. You can track it in
              your dashboard.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={() => resetAndClose(false)}>
                Close
              </Button>
              <Button onClick={() => router.push("/dashboard/buyer/service-requests")}>View my requests</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Request a service</DialogTitle>
              <DialogDescription>
                Send your project details to {provider.name}. They&apos;ll respond directly to discuss scope and pricing.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="serviceNeeded">Service needed</Label>
                <Select value={form.serviceNeeded} onValueChange={(v) => handleChange("serviceNeeded", v)}>
                  <SelectTrigger id="serviceNeeded" className="mt-1.5">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {provider.servicesOffered.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other / custom request">Other / custom request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="countryRegion">Country / region (if relevant)</Label>
                <Input
                  id="countryRegion"
                  className="mt-1.5"
                  placeholder="e.g., Vietnam, EU, Remote"
                  value={form.countryRegion}
                  onChange={(e) => handleChange("countryRegion", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description of the request</Label>
                <Textarea
                  id="description"
                  required
                  className="mt-1.5 min-h-24"
                  placeholder="Describe what you need help with..."
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    className="mt-1.5"
                    value={form.deadline}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget (optional)</Label>
                  <Input
                    id="budget"
                    className="mt-1.5"
                    placeholder="e.g., $300 - $500"
                    value={form.budget}
                    onChange={(e) => handleChange("budget", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Attachments (optional)</Label>
                <label
                  htmlFor="service-files"
                  className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-secondary hover:text-foreground"
                >
                  <Paperclip className="h-4 w-4" />
                  Upload files (specs, photos, POs)
                  <input id="service-files" type="file" multiple className="sr-only" onChange={handleFileAdd} />
                </label>
                {files.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {files.map((name) => (
                      <li
                        key={name}
                        className="flex items-center justify-between rounded-md bg-muted px-3 py-1.5 text-xs text-foreground"
                      >
                        <span className="truncate">{name}</span>
                        <button type="button" onClick={() => removeFile(name)} aria-label={`Remove ${name}`}>
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Additional notes (optional)</Label>
                <Textarea
                  id="notes"
                  className="mt-1.5"
                  placeholder="Anything else the provider should know..."
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => resetAndClose(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" />
                Send request
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
