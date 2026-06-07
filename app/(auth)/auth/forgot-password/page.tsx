"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Mail, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { forgotPassword, resetPassword } from "@/lib/api/auth"
import { getApiErrorMessage } from "@/lib/api/errors"

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [step, setStep] = useState<"request" | "reset" | "done">("request")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await forgotPassword(email.trim())

      if (response.success) {
        setOtp("")
        setPassword("")
        setPasswordConfirmation("")
        setStep("reset")
        return
      }

      setError(response.message || "Could not send reset code.")
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== passwordConfirmation) {
      setError(t?.auth?.passwordMismatch || "Password confirmation does not match.")
      return
    }

    if (!email.trim()) {
      setError(t?.auth?.emailMissing || "Email is missing. Please request a reset code again.")
      setStep("request")
      return
    }

    setIsLoading(true)

    try {
      const response = await resetPassword({
        otp: otp.trim(),
        email: email.trim(),
        password,
        passwordConfirmation,
      })

      if (response.success) {
        setSuccessMessage(response.message || "Your password has been reset successfully.")
        setStep("done")
        return
      }

      setError(response.message || "Could not reset password.")
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "done") {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
          <CheckCircle className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-medium text-foreground">
          {t?.auth?.resetPasswordComplete || "Password reset complete"}
        </h1>
        <p className="mt-2 text-muted-foreground">{successMessage}</p>

        <div className="mt-8 space-y-4">
          <Link href="/auth/signin">
            <Button className="w-full">{t?.auth?.canceledDeletion || "Back to sign in"}</Button>
          </Link>
        </div>
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
        {t?.auth?.canceledDeletion || "Back to sign in"}
      </Link>

      <div className="mt-6 text-center lg:text-left">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 lg:mx-0">
          <Mail className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-medium text-foreground">
          {step === "request" ? t?.auth?.forgotTitle || "Forgot your password?" : t?.auth?.resetTitle || "Reset your password"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {step === "request"
            ? t?.auth?.forgotSubtitle || "No worries, we'll send you reset instructions."
            : t?.auth?.resetSubtitle || "Enter the OTP and your new password to complete reset."}
        </p>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      {step === "request" ? (
        <form onSubmit={handleRequestResetCode} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t?.common?.email || "Email address"}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t?.auth?.forgotTitle || "you@company.com"}
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
                {t?.auth?.forgotSending || "Sending..."}
              </>
            ) : (
              t?.auth?.forgotSendCode || "Send reset code"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
          {/* Keep email hidden in UI but include it in reset payload */}
          <input type="hidden" name="email" value={email} readOnly />

          <div className="space-y-2">
            <Label htmlFor="otp">{t?.auth?.resetOtpLabel || "OTP code"}</Label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder={t?.auth?.resetOtpPlaceholder || "Enter OTP"}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">{t?.auth?.resetNewPassword || "New password"}</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t?.auth?.resetConfirmPassword || "Confirm password"}</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswordConfirmation ? "text" : "password"}
                autoComplete="new-password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {showPasswordConfirmation ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t?.auth?.resetResetting || "Resetting..."}
              </>
            ) : (
              t?.auth?.resetButton || "Reset password"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={isLoading}
            onClick={() => {
              setStep("request")
              setOtp("")
              setPassword("")
              setPasswordConfirmation("")
              setError("")
            }}
          >
            {t?.auth?.resetDifferentEmail || "Use another email"}
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t?.auth?.rememberPassword || "Remember your password?"}{" "}
        <Link href="/auth/signin" className="font-medium text-secondary hover:underline">
          {t?.auth?.canceledDeletion || "Back to sign in"}
        </Link>
      </p>
    </div>
  )
}
