"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { suppliers, getSupplierBySlug } from "@/lib/data/suppliers"
import { 
  ArrowLeft,
  Factory,
  CheckCircle,
  Send,
  Star
} from "lucide-react"

function NewMessageForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supplierSlug = searchParams.get('supplier')
  const supplier = supplierSlug ? getSupplierBySlug(supplierSlug) : null

  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState(supplier)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSupplierSearch, setShowSupplierSearch] = useState(!supplier)

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.industry.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the message via API
    router.push('/messages')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/messages" 
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Messages
        </Link>
        <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
          New Message
        </h1>
        <p className="mt-2 text-muted-foreground">
          Start a conversation with a supplier
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier Selection */}
        <div className="rounded-xl border border-border bg-card p-6">
          <label className="text-sm font-medium text-foreground">
            Supplier
          </label>
          
          {selectedSupplier ? (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Factory className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{selectedSupplier.name}</span>
                    {selectedSupplier.verified && (
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{selectedSupplier.location.city}, {selectedSupplier.location.country}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {selectedSupplier.rating}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedSupplier(null)
                  setShowSupplierSearch(true)
                }}
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="mt-3">
              <Input
                type="text"
                placeholder="Search suppliers by name or industry..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSupplierSearch(true)
                }}
                onFocus={() => setShowSupplierSearch(true)}
              />
              
              {showSupplierSearch && searchQuery && (
                <div className="mt-2 rounded-lg border border-border bg-card shadow-lg">
                  {filteredSuppliers.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No suppliers found
                    </div>
                  ) : (
                    filteredSuppliers.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedSupplier(s)
                          setShowSupplierSearch(false)
                          setSearchQuery("")
                        }}
                        className="flex w-full items-center gap-3 border-b border-border p-3 text-left last:border-b-0 hover:bg-muted/50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Factory className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{s.name}</span>
                            {s.verified && (
                              <CheckCircle className="h-3 w-3 text-secondary" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {s.industry} • {s.location.country}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                          {s.rating}
                        </Badge>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subject */}
        <div className="rounded-xl border border-border bg-card p-6">
          <label htmlFor="subject" className="text-sm font-medium text-foreground">
            Subject
          </label>
          <Input
            id="subject"
            type="text"
            placeholder="e.g., Inquiry about TWS Earbuds pricing"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-3"
            required
          />
        </div>

        {/* Message */}
        <div className="rounded-xl border border-border bg-card p-6">
          <label htmlFor="message" className="text-sm font-medium text-foreground">
            Message
          </label>
          <Textarea
            id="message"
            placeholder="Write your message to the supplier..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-3 min-h-[200px]"
            required
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Include details about the products you are interested in, quantities, and any specific requirements.
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/messages">Cancel</Link>
          </Button>
          <Button 
            type="submit" 
            className="gap-2"
            disabled={!selectedSupplier || !subject || !message}
          >
            <Send className="h-4 w-4" />
            Send Message
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function NewMessagePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }>
          <NewMessageForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
