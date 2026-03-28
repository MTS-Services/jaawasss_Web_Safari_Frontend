"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate sending reset email
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
          <CheckCircle className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-medium text-foreground">
          Check your email
        </h1>
        <p className="mt-2 text-muted-foreground">
          We&apos;ve sent a password reset link to
        </p>
        <p className="mt-1 font-medium text-foreground">{email}</p>
        
        <div className="mt-8 space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsSubmitted(false)}
            className="w-full"
          >
            Try another email address
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/auth/signin" className="font-medium text-secondary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <Link 
        href="/auth/signin" 
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>

      <div className="mt-6 text-center lg:text-left">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 lg:mx-0">
          <Mail className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-medium text-foreground">
          Forgot your password?
        </h1>
        <p className="mt-2 text-muted-foreground">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/auth/signin" className="font-medium text-secondary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
