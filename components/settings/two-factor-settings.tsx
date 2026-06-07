"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { getApiErrorMessage } from "@/lib/api/errors"
import {
  confirmTwoFactor,
  disableTwoFactor,
  enableTwoFactor,
  getTwoFactorQrCode,
  getTwoFactorRecoveryCodes,
  regenerateTwoFactorRecoveryCodes,
} from "@/lib/api/two-factor"
import { Eye, EyeOff, Loader2 } from "lucide-react"

type ActionState = "enable" | "verify" | "disable" | "load-codes" | "regenerate" | null

type SetupStep = "password" | "verify"

const DEFAULT_SETUP_MESSAGE =
  "Scan this QR code with your authenticator app and enter the 6-digit code."

const DEFAULT_RECOVERY_MESSAGE =
  "Keep these backup codes in a safe place. Each code can be used once."

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") {
    return null
  }
  return value as Record<string, unknown>
}

function tryParseJson(value: string): unknown | null {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function isQrLikeValue(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) {
    return false
  }

  const lower = trimmed.toLowerCase()

  return (
    trimmed.includes("<svg") ||
    lower.startsWith("data:image/") ||
    lower.startsWith("http://") ||
    lower.startsWith("https://")
  )
}

function extractMessage(payload: unknown): string | null {
  const source = asObject(payload)
  if (!source) {
    return null
  }

  if (typeof source.message === "string" && source.message.trim()) {
    return source.message.trim()
  }

  const nested = asObject(source.data)
  if (!nested) {
    return null
  }

  if (typeof nested.message === "string" && nested.message.trim()) {
    return nested.message.trim()
  }

  return null
}

function extractRecoveryCodes(payload: unknown): string[] {
  const source = asObject(payload)
  if (!source) {
    return []
  }

  const direct = source.recovery_codes ?? source.recoveryCodes ?? source.codes
  if (Array.isArray(direct)) {
    return direct.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
  }

  const nested = asObject(source.data)
  if (!nested) {
    return []
  }

  const nestedCodes = nested.recovery_codes ?? nested.recoveryCodes ?? nested.codes
  if (!Array.isArray(nestedCodes)) {
    return []
  }

  return nestedCodes.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
}

function extractQrCodeValue(payload: unknown): string | null {
  if (typeof payload === "string") {
    const trimmed = payload.trim()
    if (!trimmed) {
      return null
    }

    if (isQrLikeValue(trimmed)) {
      return trimmed
    }

    const parsed = tryParseJson(trimmed)
    return parsed ? extractQrCodeValue(parsed) : null
  }

  const source = asObject(payload)
  if (!source) {
    return null
  }

  const direct =
    source.svg ??
    source.qr_code_svg ??
    source.qr_code ??
    source.qrCode ??
    source.image ??
    source.qr ??
    source.qrcode ??
    source.qr_svg ??
    source.qrCodeSvg
  if (typeof direct === "string" && direct.trim()) {
    const value = direct.trim()
    if (isQrLikeValue(value)) {
      return value
    }

    const parsed = tryParseJson(value)
    if (parsed) {
      return extractQrCodeValue(parsed)
    }
  }

  if (typeof source.data === "string" && source.data.trim()) {
    const nestedString = source.data.trim()
    if (isQrLikeValue(nestedString)) {
      return nestedString
    }

    const parsedData = tryParseJson(nestedString)
    if (parsedData) {
      return extractQrCodeValue(parsedData)
    }
  }

  const nested = asObject(source.data)
  if (!nested) {
    return null
  }

  const nestedValue =
    nested.svg ??
    nested.qr_code_svg ??
    nested.qr_code ??
    nested.qrCode ??
    nested.image ??
    nested.qr ??
    nested.qrcode ??
    nested.qr_svg ??
    nested.qrCodeSvg
  if (typeof nestedValue === "string" && nestedValue.trim()) {
    const value = nestedValue.trim()
    if (isQrLikeValue(value)) {
      return value
    }

    const parsed = tryParseJson(value)
    if (parsed) {
      return extractQrCodeValue(parsed)
    }
  }

  return null
}

function extractManualKey(payload: unknown): string | null {
  if (typeof payload === "string") {
    const trimmed = payload.trim()
    if (!trimmed) {
      return null
    }

    if (trimmed.startsWith("otpauth://")) {
      return trimmed
    }

    const parsed = tryParseJson(trimmed)
    return parsed ? extractManualKey(parsed) : null
  }

  const source = asObject(payload)
  if (!source) {
    return null
  }

  const direct =
    source.secret ??
    source.manual_key ??
    source.manualKey ??
    source.otpauth ??
    source.otpauth_url ??
    source.otpAuthUrl
  if (typeof direct === "string" && direct.trim()) {
    return direct.trim()
  }

  if (typeof source.data === "string" && source.data.trim()) {
    const parsedData = tryParseJson(source.data.trim())
    if (parsedData) {
      const parsedKey = extractManualKey(parsedData)
      if (parsedKey) {
        return parsedKey
      }
    }
  }

  const nested = asObject(source.data)
  if (!nested) {
    return null
  }

  const nestedValue =
    nested.secret ??
    nested.manual_key ??
    nested.manualKey ??
    nested.otpauth ??
    nested.otpauth_url ??
    nested.otpAuthUrl
  if (typeof nestedValue === "string" && nestedValue.trim()) {
    return nestedValue.trim()
  }

  return null
}

function normalizeQrPayload(payload: unknown): unknown {
  if (typeof payload !== "string") {
    return payload
  }

  const parsed = tryParseJson(payload)
  return parsed ?? payload
}

function isSvgMarkup(value: string | null): boolean {
  return !!value && value.trim().includes("<svg")
}

export function TwoFactorSettings() {
  const { toast } = useToast()

  const [isEnabled, setIsEnabled] = useState(false)
  const [isCheckingState, setIsCheckingState] = useState(true)
  const [actionState, setActionState] = useState<ActionState>(null)

  const [setupOpen, setSetupOpen] = useState(false)
  const [setupStep, setSetupStep] = useState<SetupStep>("password")
  const [setupPassword, setSetupPassword] = useState("")
  const [showSetupPassword, setShowSetupPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null)
  const [manualKey, setManualKey] = useState<string | null>(null)
  const [setupStatusMessage, setSetupStatusMessage] = useState(DEFAULT_SETUP_MESSAGE)

  const [disableOpen, setDisableOpen] = useState(false)
  const [disablePassword, setDisablePassword] = useState("")

  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [recoveryStatusMessage, setRecoveryStatusMessage] = useState(DEFAULT_RECOVERY_MESSAGE)

  const [regenerateOpen, setRegenerateOpen] = useState(false)
  const [regeneratePassword, setRegeneratePassword] = useState("")

  const isBusy = actionState !== null

  const formattedRecoveryCodes = useMemo(() => recoveryCodes.filter(Boolean), [recoveryCodes])

  const resetSetupDialog = () => {
    setSetupStep("password")
    setSetupPassword("")
    setShowSetupPassword(false)
    setVerificationCode("")
    setQrCodeValue(null)
    setManualKey(null)
    setSetupStatusMessage(DEFAULT_SETUP_MESSAGE)
  }

  const loadTwoFactorState = async () => {
    setIsCheckingState(true)
    try {
      const response = await getTwoFactorRecoveryCodes()
      setRecoveryCodes(extractRecoveryCodes(response))
      setIsEnabled(true)
    } catch {
      setRecoveryCodes([])
      setIsEnabled(false)
    } finally {
      setIsCheckingState(false)
    }
  }

  useEffect(() => {
    void loadTwoFactorState()
  }, [])

  const handleSwitchChange = (checked: boolean) => {
    if (isCheckingState || isBusy) {
      return
    }

    if (checked) {
      setSetupOpen(true)
      return
    }

    setDisableOpen(true)
  }

  const handleBeginSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!setupPassword.trim()) {
      toast({
        title: "Password required",
        description: "Please enter your password to enable two-factor authentication.",
        variant: "destructive",
      })
      return
    }

    setActionState("enable")
    try {
      const enableResponse = await enableTwoFactor(setupPassword.trim())
      const normalizedEnableResponse = normalizeQrPayload(enableResponse)
      const enableResponseObject = asObject(normalizedEnableResponse)
      if (enableResponseObject?.success === false) {
        const serverMessage = enableResponseObject.message
        throw new Error(
          typeof serverMessage === "string" && serverMessage.trim()
            ? serverMessage
            : "Could not start two-factor setup."
        )
      }

      let qrValue = extractQrCodeValue(normalizedEnableResponse)
      let key = extractManualKey(normalizedEnableResponse)
      let setupMessage = extractMessage(normalizedEnableResponse)

      if (!qrValue && !key) {
        const qrResponse = await getTwoFactorQrCode()
        const normalizedQrResponse = normalizeQrPayload(qrResponse)
        const qrResponseObject = asObject(normalizedQrResponse)
        if (qrResponseObject?.success === false) {
          const serverMessage = qrResponseObject.message
          throw new Error(
            typeof serverMessage === "string" && serverMessage.trim()
              ? serverMessage
              : "Could not fetch the QR code."
          )
        }

        qrValue = extractQrCodeValue(normalizedQrResponse)
        key = extractManualKey(normalizedQrResponse)

        if (!setupMessage) {
          setupMessage = extractMessage(normalizedQrResponse)
        }
      }

      if (!qrValue && !key) {
        throw new Error("The server did not return a QR code or manual key. Please try again.")
      }

      setQrCodeValue(qrValue)
      setManualKey(key)
      setSetupStatusMessage(setupMessage || DEFAULT_SETUP_MESSAGE)
      setSetupStep("verify")
    } catch (err) {
      toast({
        title: "Could not start 2FA setup",
        description: getApiErrorMessage(err),
        variant: "destructive",
      })
    } finally {
      setActionState(null)
    }
  }

  const handleConfirmSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = verificationCode.trim()

    if (!code) {
      toast({
        title: "Code required",
        description: "Enter the verification code from your authenticator app.",
        variant: "destructive",
      })
      return
    }

    setActionState("verify")
    try {
      const confirmResponse = await confirmTwoFactor(code)
      const confirmMessage = extractMessage(confirmResponse)
      let codes = extractRecoveryCodes(confirmResponse)

      if (codes.length === 0) {
        const recoveryResponse = await getTwoFactorRecoveryCodes()
        codes = extractRecoveryCodes(recoveryResponse)
      }

      setRecoveryCodes(codes)
      setRecoveryStatusMessage(confirmMessage || DEFAULT_RECOVERY_MESSAGE)
      setIsEnabled(true)
      setSetupOpen(false)
      resetSetupDialog()
      setRecoveryOpen(true)

      toast({
        title: "Two-factor enabled",
        description: confirmMessage || "Save your recovery codes in a secure place.",
      })
    } catch (err) {
      toast({
        title: "Could not verify code",
        description: getApiErrorMessage(err),
        variant: "destructive",
      })
    } finally {
      setActionState(null)
    }
  }

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!disablePassword.trim()) {
      toast({
        title: "Password required",
        description: "Please enter your password to disable two-factor authentication.",
        variant: "destructive",
      })
      return
    }

    setActionState("disable")
    try {
      await disableTwoFactor(disablePassword.trim())
      setIsEnabled(false)
      setRecoveryCodes([])
      setDisableOpen(false)
      setDisablePassword("")

      toast({
        title: "Two-factor disabled",
        description: "Your account now uses password-only sign-in.",
      })
    } catch (err) {
      toast({
        title: "Could not disable two-factor",
        description: getApiErrorMessage(err),
        variant: "destructive",
      })
    } finally {
      setActionState(null)
    }
  }

  const handleViewRecoveryCodes = async () => {
    setActionState("load-codes")
    try {
      const response = await getTwoFactorRecoveryCodes()
      const codes = extractRecoveryCodes(response)
      setRecoveryCodes(codes)
      setRecoveryStatusMessage(DEFAULT_RECOVERY_MESSAGE)
      setRecoveryOpen(true)
    } catch (err) {
      toast({
        title: "Could not load recovery codes",
        description: getApiErrorMessage(err),
        variant: "destructive",
      })
    } finally {
      setActionState(null)
    }
  }

  const handleRegenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regeneratePassword.trim()) {
      toast({
        title: "Password required",
        description: "Please enter your password to regenerate recovery codes.",
        variant: "destructive",
      })
      return
    }

    setActionState("regenerate")
    try {
      const response = await regenerateTwoFactorRecoveryCodes(regeneratePassword.trim())
      let codes = extractRecoveryCodes(response)

      if (codes.length === 0) {
        const latest = await getTwoFactorRecoveryCodes()
        codes = extractRecoveryCodes(latest)
      }

      setRecoveryCodes(codes)
      setRecoveryStatusMessage(DEFAULT_RECOVERY_MESSAGE)
      setRegenerateOpen(false)
      setRegeneratePassword("")
      setRecoveryOpen(true)

      toast({
        title: "Recovery codes regenerated",
        description: "Your old recovery codes are no longer valid.",
      })
    } catch (err) {
      toast({
        title: "Could not regenerate codes",
        description: getApiErrorMessage(err),
        variant: "destructive",
      })
    } finally {
      setActionState(null)
    }
  }

  const handleCopyRecoveryCodes = async () => {
    if (formattedRecoveryCodes.length === 0) {
      return
    }

    try {
      await navigator.clipboard.writeText(formattedRecoveryCodes.join("\n"))
      toast({
        title: "Copied",
        description: "Recovery codes copied to clipboard.",
      })
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy the recovery codes manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="font-medium text-foreground">Two-Factor Authentication</p>
          <p className="text-sm text-muted-foreground">
            {isEnabled
              ? "Enabled. Use your authenticator app during sign-in."
              : "Add an extra layer of security to your account."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isCheckingState && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <Switch
            checked={isEnabled}
            onCheckedChange={handleSwitchChange}
            disabled={isCheckingState || isBusy}
          />
        </div>
      </div>

      {isEnabled && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewRecoveryCodes}
            disabled={isBusy}
          >
            {actionState === "load-codes" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            View recovery codes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRegenerateOpen(true)}
            disabled={isBusy}
          >
            Regenerate codes
          </Button>
        </div>
      )}

      <Dialog
        open={setupOpen}
        onOpenChange={(open) => {
          setSetupOpen(open)
          if (!open) {
            resetSetupDialog()
          }
        }}
      >
        <DialogContent>
          {setupStep === "password" ? (
            <form onSubmit={handleBeginSetup}>
              <DialogHeader>
                <DialogTitle>Enable two-factor authentication</DialogTitle>
                <DialogDescription>
                  Enter your account password to begin two-factor setup.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="two-factor-enable-password">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="two-factor-enable-password"
                    type={showSetupPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="pr-10"
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    disabled={isBusy}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSetupPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showSetupPassword ? "Hide password" : "Show password"}
                    disabled={isBusy}
                  >
                    {showSetupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isBusy}>
                  {actionState === "enable" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    "Start setup"
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <form onSubmit={handleConfirmSetup}>
              <DialogHeader>
                <DialogTitle>Scan and verify</DialogTitle>
                <DialogDescription>{setupStatusMessage}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {qrCodeValue && isSvgMarkup(qrCodeValue) && (
                  <div
                    className="mx-auto max-w-55 rounded-lg border border-border bg-white p-3 [&>svg]:h-auto [&>svg]:w-full"
                    dangerouslySetInnerHTML={{ __html: qrCodeValue }}
                  />
                )}

                {qrCodeValue && !isSvgMarkup(qrCodeValue) && (
                  <img
                    src={qrCodeValue}
                    alt="Two-factor QR code"
                    className="mx-auto w-55 rounded-lg border border-border bg-white p-3"
                  />
                )}

                {manualKey && (
                  <p className="rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
                    Manual key: <span className="font-medium text-foreground">{manualKey}</span>
                  </p>
                )}

                <div>
                  <Label htmlFor="two-factor-verification-code">Verification code</Label>
                  <Input
                    id="two-factor-verification-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="mt-2"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    disabled={isBusy}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isBusy}>
                  {actionState === "verify" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Confirm and enable"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={disableOpen} onOpenChange={setDisableOpen}>
        <DialogContent>
          <form onSubmit={handleDisable}>
            <DialogHeader>
              <DialogTitle>Disable two-factor authentication</DialogTitle>
              <DialogDescription>
                Enter your password to remove two-factor protection.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="two-factor-disable-password">Password</Label>
              <Input
                id="two-factor-disable-password"
                type="password"
                autoComplete="current-password"
                className="mt-2"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                disabled={isBusy}
              />
            </div>
            <DialogFooter>
              <Button type="submit" variant="destructive" disabled={isBusy}>
                {actionState === "disable" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Disabling...
                  </>
                ) : (
                  "Disable"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={recoveryOpen} onOpenChange={setRecoveryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recovery codes</DialogTitle>
            <DialogDescription>{recoveryStatusMessage}</DialogDescription>
          </DialogHeader>

          <div className="max-h-64 overflow-y-auto rounded-lg border border-border bg-muted/40 p-3">
            {formattedRecoveryCodes.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {formattedRecoveryCodes.map((code) => (
                  <div
                    key={code}
                    className="rounded bg-background px-3 py-2 font-mono text-xs text-foreground"
                  >
                    {code}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recovery codes available yet.</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyRecoveryCodes}
              disabled={formattedRecoveryCodes.length === 0}
            >
              Copy codes
            </Button>
            <Button type="button" onClick={() => setRecoveryOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={regenerateOpen} onOpenChange={setRegenerateOpen}>
        <DialogContent>
          <form onSubmit={handleRegenerateCodes}>
            <DialogHeader>
              <DialogTitle>Regenerate recovery codes</DialogTitle>
              <DialogDescription>
                Your current recovery codes will stop working immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="two-factor-regenerate-password">Password</Label>
              <Input
                id="two-factor-regenerate-password"
                type="password"
                autoComplete="current-password"
                className="mt-2"
                value={regeneratePassword}
                onChange={(e) => setRegeneratePassword(e.target.value)}
                disabled={isBusy}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isBusy}>
                {actionState === "regenerate" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "Regenerate"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
