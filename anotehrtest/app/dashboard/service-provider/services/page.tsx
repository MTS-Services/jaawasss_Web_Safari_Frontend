"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { serviceProviders } from "@/lib/data/service-providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Check } from "lucide-react"

interface ServiceOffering {
  id: string
  name: string
  description: string
  price: string
  turnaround: string
}

export default function ServiceProviderServicesPage() {
  const { user } = useAuth()
  const providerId = user?.id ?? "sp-1"
  const provider = serviceProviders.find((p) => p.id === providerId) ?? serviceProviders[0]

  const initial: ServiceOffering[] = provider.servicesOffered.map((name, i) => ({
    id: `svc-${i}`,
    name,
    description: "",
    price: i === 0 && provider.startingPrice && provider.startingPrice !== "Price upon request" ? provider.startingPrice : "",
    turnaround: i === 0 ? provider.deliveryTime : "",
  }))

  const [services, setServices] = useState<ServiceOffering[]>(initial)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ServiceOffering | null>(null)
  const [form, setForm] = useState({ name: "", description: "", price: "", turnaround: "" })

  const openNew = () => {
    setEditing(null)
    setForm({ name: "", description: "", price: "", turnaround: "" })
    setOpen(true)
  }

  const openEdit = (svc: ServiceOffering) => {
    setEditing(svc)
    setForm({ name: svc.name, description: svc.description, price: svc.price, turnaround: svc.turnaround })
    setOpen(true)
  }

  const save = () => {
    if (!form.name.trim()) return
    if (editing) {
      setServices((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s)))
    } else {
      setServices((prev) => [...prev, { id: `svc-${Date.now()}`, ...form }])
    }
    setOpen(false)
  }

  const remove = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Services & Pricing</h1>
          <p className="mt-1 text-muted-foreground">Manage the services buyers can request from you.</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add service
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((svc) => (
          <div key={svc.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-foreground">{svc.name}</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(svc)}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(svc.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{svc.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {svc.price && <Badge variant="secondary">From {svc.price}</Badge>}
              {svc.turnaround && <Badge variant="outline">{svc.turnaround}</Badge>}
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No services yet. Add your first service to start receiving requests.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit service" : "Add service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="svc-name">Service name</Label>
              <Input
                id="svc-name"
                className="mt-1.5"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Packaging design"
              />
            </div>
            <div>
              <Label htmlFor="svc-desc">Description</Label>
              <Textarea
                id="svc-desc"
                className="mt-1.5"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What's included in this service?"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="svc-price">Starting price</Label>
                <Input
                  id="svc-price"
                  className="mt-1.5"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="e.g., $500"
                />
              </div>
              <div>
                <Label htmlFor="svc-turn">Turnaround</Label>
                <Input
                  id="svc-turn"
                  className="mt-1.5"
                  value={form.turnaround}
                  onChange={(e) => setForm((f) => ({ ...f, turnaround: e.target.value }))}
                  placeholder="e.g., 1-2 weeks"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="gap-2">
              <Check className="h-4 w-4" />
              {editing ? "Save changes" : "Add service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
