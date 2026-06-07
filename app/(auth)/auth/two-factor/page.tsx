"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, KeyRound, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitTwoFactorChallenge } from "@/lib/api/auth"
import { getApiErrorMessage } from "@/lib/api/errors"
import { useAuth } from "@/lib/auth-context"
import { getDashboardPathByRole, type UserRole } from "@/lib/roles/dashboard-route"
import type { User as ApiUser } from "@/lib/types"

type VerificationMethod = "app" | "recovery"

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") {
    return null
  }

  return value as Record<string, unknown>
}

function isApiUser(value: unknown): value is ApiUser {
  const source = asObject(value)
  if (!source) {
    return false
  }

  return (
    typeof source.id === "number" &&
    typeof source.first_name === "string" &&
    typeof source.last_name === "string" &&
    typeof source.email === "string" &&
    typeof source.role === "string" &&
    typeof source.agreed_to_terms === "boolean" &&
    typeof source.created_at === "string" &&
    (typeof source.updated_at === "string" || source.updated_at === null)
  )
}

function extractChallengeSession(
  payload: unknown
): { accessToken: string; user: ApiUser } | null {
  const source = asObject(payload)
  if (!source) {
    return null
  }

  const accessTokenCandidate = source.access_token ?? source.token
  const userCandidate = source.user

  if (typeof accessTokenCandidate !== "string" || !accessTokenCandidate.trim()) {
    return null
  }

  if (!isApiUser(userCandidate)) {
    return null
  }

  return { accessToken: accessTokenCandidate.trim(), user: userCandidate }
}

function normalizeRole(role: string | null): UserRole {
  if (role === "manufacturer" || role === "admin") {
    return role
  }
  return "buyer"
}

export default function TwoFactorChallengePage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="font-serif text-3xl font-medium text-foreground">Two-factor authentication</h1>
          <p className="mt-2 text-muted-foreground">Preparing secure verification...</p>
        </div>
      }
    >
      <TwoFactorChallengeContent />
    </Suspense>
  )
}

function TwoFactorChallengeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken, setUser } = useAuth()

  const challengeToken =
    searchParams.get("token")?.trim() || searchParams.get("two_factor_token")?.trim() || ""
  const role = normalizeRole(searchParams.get("role"))

  const [method, setMethod] = useState<VerificationMethod>("app")
  const [verificationCode, setVerificationCode] = useState("")
  const [recoveryCode, setRecoveryCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const code = verificationCode.trim()
    const backupCode = recoveryCode.trim()

    if (method === "app" && !code) {
      setError("Please enter the 6-digit code from your authenticator app.")
      return
    }

    if (method === "recovery" && !backupCode) {
      setError("Please enter one of your recovery codes.")
      return
    }

    setIsLoading(true)

    try {
      const response = await submitTwoFactorChallenge({
        twoFactorToken: challengeToken,
        ...(method === "app" ? { code } : { recoveryCode: backupCode }),
      })

      const session = extractChallengeSession(response.data)
      if (response.success && session) {
        const userRole =
          typeof session.user.role === "string" && session.user.role.trim()
            ? session.user.role
            : role

        setToken(session.accessToken)
        setUser(session.user)
        router.push(getDashboardPathByRole(userRole))
        return
      }

      setError(response.message || "Invalid verification code. Please try again.")
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  if (!challengeToken) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-medium text-foreground">Two-factor authentication</h1>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Invalid or expired challenge token. Please sign in again.
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href={`/auth/signin?role=${role}`} className="font-medium text-secondary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-secondary">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-sm font-medium">Security verification required</span>
      </div>

      <h1 className="mt-3 font-serif text-3xl font-medium text-foreground">Two-factor authentication</h1>
      <p className="mt-2 text-muted-foreground">
        Enter your authenticator app code to finish signing in.
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-6 inline-flex rounded-lg border border-border p-1">
        <button
          type="button"
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            method === "app"
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => {
            setMethod("app")
            setError("")
          }}
          disabled={isLoading}
        >
          Authenticator code
        </button>
        <button
          type="button"
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            method === "recovery"
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => {
            setMethod("recovery")
            setError("")
          }}
          disabled={isLoading}
        >
          Recovery code
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {method === "app" ? (
          <div className="space-y-2">
            <Label htmlFor="verification-code" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-secondary" />
              6-digit verification code
            </Label>
            <Input
              id="verification-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={isLoading}
              placeholder="123456"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="recovery-code">Recovery code</Label>
            <Input
              id="recovery-code"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value.trim())}
              disabled={isLoading}
              placeholder="XXXXXX-XXXXXX-XXXXXX"
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify and continue"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href={`/auth/signin?role=${role}`} className="font-medium text-secondary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
