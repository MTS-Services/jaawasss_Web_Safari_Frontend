"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import {
  requestRestoreDeleteAccount,
  verifyRestoreDeleteAccount,
} from "@/lib/api/account"
import { getApiErrorMessage } from "@/lib/api/errors"

export default function RestoreAccountPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [step, setStep] = useState<"credentials" | "otp">("credentials")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const res = await requestRestoreDeleteAccount(email.trim(), password)
      if (res.success) {
        setStep("otp")
      } else {
        setError(res.message || "Could not start restore process.")
      }
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const res = await verifyRestoreDeleteAccount(email.trim(), otp.trim())
      if (res.success) {
        router.push("/auth/signin?restored=1")
      } else {
        setError(res.message || "Invalid or expired code.")
      }
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Link
        href="/auth/signin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t?.auth?.canceledDeletion || "Back to sign in"}
      </Link>

      <div className="mt-6 text-center lg:text-left">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 lg:mx-0">
          <ShieldCheck className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-medium text-foreground">
          {t?.auth?.restoreTitle || "Restore your account"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {step === "credentials"
            ? t?.auth?.restoreSubtitleStep1 || "If you requested account deletion, sign in here to cancel it. We will email you a verification code."
            : t?.auth?.restoreSubtitleStep2 || "Enter the verification code sent to your email."}
        </p>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      {step === "credentials" ? (
        <form onSubmit={handleRequest} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t?.common?.email || "Email"}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t?.common?.password || "Password"}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t?.auth?.restoreSendingCode || "Sending code…"}
              </>
            ) : (
              t?.auth?.restoreContinue || "Continue"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">{t?.auth?.restoreVerificationCode || "Verification code"}</Label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder={t?.auth?.restoreEnterCode || "Enter code from email"}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t?.auth?.restoreVerifying || "Verifying…"}
              </>
            ) : (
              t?.auth?.restoreVerifyButton || "Verify and restore account"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={isLoading}
            onClick={() => {
              setStep("credentials")
              setOtp("")
              setError("")
            }}
          >
            {t?.auth?.restoreDifferentEmail || "Use different email"}
          </Button>
        </form>
      )}
    </div>
  )
}
