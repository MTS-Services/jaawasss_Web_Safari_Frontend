"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Building2, 
  Handshake, 
  HelpCircle,
  Globe,
  Clock,
  Briefcase,
  Users
} from "lucide-react"
import {
  defaultContactInfo,
  defaultInquiryTypes,
  defaultFormFields,
  defaultPageSettings,
  type ContactInfo,
  type InquiryType,
  type FormField,
} from "@/lib/data/contact-settings"

// Icon mapping for dynamic rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "mail": Mail,
  "phone": Phone,
  "map-pin": MapPin,
  "globe": Globe,
  "clock": Clock,
  "message-square": MessageSquare,
  "building-2": Building2,
  "help-circle": HelpCircle,
  "handshake": Handshake,
  "briefcase": Briefcase,
  "users": Users,
}

export default function ContactPage() {
  // In production, these would come from an API/database
  const contactInfo = defaultContactInfo.filter(c => c.enabled).sort((a, b) => a.order - b.order)
  const inquiryTypes = defaultInquiryTypes.filter(i => i.enabled).sort((a, b) => a.order - b.order)
  const formFields = defaultFormFields.filter(f => f.enabled).sort((a, b) => a.order - b.order)
  const pageSettings = defaultPageSettings

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    formFields.forEach(field => {
      initial[field.name] = ""
    })
    return initial
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const resetForm = () => {
    setSubmitted(false)
    const initial: Record<string, string> = {}
    formFields.forEach(field => {
      initial[field.name] = ""
    })
    setFormData(initial)
  }

  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case "textarea":
        return (
          <div key={field.id} className="space-y-2 col-span-full">
            <Label htmlFor={field.name}>
              {field.label} {field.required && "*"}
            </Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              rows={6}
              value={formData[field.name] || ""}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              required={field.required}
            />
          </div>
        )
      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && "*"}
            </Label>
            <Select
              value={formData[field.name] || ""}
              onValueChange={(value) => setFormData({ ...formData, [field.name]: value })}
              required={field.required}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {inquiryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && "*"}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              required={field.required}
            />
          </div>
        )
    }
  }

  // Group fields for layout: first 2 fields side by side, then next 2, then textarea full width
  const renderFormFields = () => {
    const textFields = formFields.filter(f => f.type !== "textarea")
    const textareaFields = formFields.filter(f => f.type === "textarea")
    
    const rows: FormField[][] = []
    for (let i = 0; i < textFields.length; i += 2) {
      rows.push(textFields.slice(i, i + 2))
    }

    return (
      <>
        {rows.map((row, index) => (
          <div key={index} className={`grid gap-6 ${row.length === 2 ? 'sm:grid-cols-2' : ''}`}>
            {row.map(field => renderFormField(field))}
          </div>
        ))}
        {textareaFields.map(field => renderFormField(field))}
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-medium tracking-tight text-primary-foreground sm:text-5xl">
                {pageSettings.heroTitle}
              </h1>
              <p className="mt-4 text-lg text-primary-foreground/80">
                {pageSettings.heroSubtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <h2 className="font-serif text-2xl font-medium text-foreground">{pageSettings.sidebarTitle}</h2>
                <p className="mt-4 text-muted-foreground">
                  {pageSettings.sidebarDescription}
                </p>

                <div className="mt-8 space-y-6">
                  {contactInfo.map((contact) => {
                    const IconComponent = iconMap[contact.icon] || MessageSquare
                    return (
                      <div key={contact.id} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                          <IconComponent className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{contact.label}</div>
                          {contact.link ? (
                            <a href={contact.link} className="text-muted-foreground hover:text-secondary whitespace-pre-line">
                              {contact.value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground whitespace-pre-line">
                              {contact.value}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Inquiry Types */}
                {inquiryTypes.length > 0 && (
                  <div className="mt-12">
                    <h3 className="font-semibold text-foreground">{pageSettings.inquiryTypesTitle}</h3>
                    <div className="mt-4 space-y-3">
                      {inquiryTypes.map((type) => {
                        const IconComponent = iconMap[type.icon] || MessageSquare
                        return (
                          <div key={type.value} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <IconComponent className="h-4 w-4 text-secondary" />
                            <span>{type.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-border bg-card p-8">
                  {!pageSettings.formEnabled ? (
                    <div className="text-center py-12">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">
                        Contact Form Unavailable
                      </h3>
                      <p className="mt-4 text-muted-foreground">
                        Please use the contact information on the left to get in touch with us.
                      </p>
                    </div>
                  ) : submitted ? (
                    <div className="text-center py-12">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                        <MessageSquare className="h-8 w-8 text-secondary" />
                      </div>
                      <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">
                        {pageSettings.successTitle}
                      </h3>
                      <p className="mt-4 text-muted-foreground">
                        {pageSettings.successMessage}
                      </p>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="mt-6"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {renderFormFields()}
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : pageSettings.submitButtonText}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
