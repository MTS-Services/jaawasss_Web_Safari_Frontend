"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n"
import type { UserRole } from "@/lib/roles/dashboard-route"
import { Eye, EyeOff, Loader2, Users, Factory, Shield, AlertCircle } from "lucide-react"
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast"
import { decodeGoogleIdTokenPayload, getGoogleIdToken } from "@/lib/google-identity"
import { SocialCompleteProfileModal } from "@/components/auth/social-complete-profile-modal"

function RestoredAccountNotifier() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { t } = useTranslation()
  const notified = useRef(false)

  useEffect(() => {
    if (notified.current) return
    if (searchParams.get("restored") !== "1") return
    notified.current = true
    toast({
      title: t?.auth?.accountRestored || "Account restored",
      description: t?.auth?.accountRestoredMessage || "You can sign in with your usual credentials.",
    })
    router.replace("/auth/signin", { scroll: false })
  }, [searchParams, toast, router, t])

  return null
}

export default function SignInPage() {
  const router = useRouter()
  const { login, loginWithGoogle } = useAuth()
  const { t } = useTranslation()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  // Start with a stable default on both server and client to avoid hydration mismatch.
  const [activeTab, setActiveTab] = useState<UserRole>("buyer")

  // After mount, read the `role` query param (if present) and update the tab.
  useEffect(() => {
    try {
      const role = new URLSearchParams(window.location.search).get("role") as UserRole | null
      if (role === "buyer" || role === "manufacturer" || role === "admin") {
        setActiveTab(role)
      }
    } catch {
      // ignore
    }
  }, [])
  const [socialSetupState, setSocialSetupState] = useState<{
    setupToken: string
    role: "buyer" | "manufacturer"
  } | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login(formData.email, formData.password, activeTab)

      if (result.success) {
        router.push(result.redirectTo)
      } else if (result.requiresTwoFactor) {
        const params = new URLSearchParams({
          token: result.twoFactorToken,
          role: result.role,
        })

        if (formData.remember) {
          params.set("remember", "1")
        }

        router.push(`/auth/two-factor?${params.toString()}`)
      } else {
        setError(result.message || (t?.auth?.invalidEmailOrPassword || "Invalid email or password. Please try again."))
      }
    } catch {
      setError(t?.auth?.errorOccurred || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = async () => {
    setIsLoading(true)
    setError("")

    try {
      const credential = await getGoogleIdToken()
      if (process.env.NODE_ENV !== "production") {
        const payload = decodeGoogleIdTokenPayload(credential)
        if (payload) {
          // eslint-disable-next-line no-console
          console.log("[google-id-token payload]", {
            iss: payload.iss,
            aud: payload.aud,
            azp: payload.azp,
            email: payload.email,
            exp: payload.exp,
          })
        }
      }

      // Use the currently selected tab as the role (buyer or manufacturer)
      const role = activeTab
      const result = await loginWithGoogle(credential, role)
      if (result.success) {
        router.push(result.redirectTo)
        return
      }

      if ("requiresTwoFactor" in result && result.requiresTwoFactor) {
        const params = new URLSearchParams({
          token: result.twoFactorToken,
          role: result.role,
        })
        router.push(`/auth/two-factor?${params.toString()}`)
        return
      }

      if ("needsProfileCompletion" in result && result.needsProfileCompletion) {
        setSocialSetupState({
          setupToken: result.setupToken,
          role: result.role,
        })
        return
      }

      setError(result.message || (t?.auth?.googleLoginFailed || "Google login failed. Please try again."))
    } catch (err) {
      const message = err instanceof Error ? err.message : (t?.auth?.googleLoginFailed || "Google login failed. Please try again.")
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Suspense fallback={null}>
        <RestoredAccountNotifier />
      </Suspense>
      <div>
        <div className="text-center lg:text-left">
          <h1 className="font-serif text-3xl font-medium text-foreground">{t?.auth?.welcomeBack || "Welcome back"}</h1>
          <p className="mt-2 text-muted-foreground">{t?.auth?.signInToYourAccount || "Sign in to your account to continue"}</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserRole)} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="buyer" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t?.auth?.buyer || "Buyer"}</span>
            </TabsTrigger>
            <TabsTrigger value="manufacturer" className="gap-2">
              <Factory className="h-4 w-4" />
              <span className="hidden sm:inline">{t?.auth?.manufacturer || "Manufacturer"}</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t?.auth?.admin || "Admin"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buyer" className="mt-4">
            <p className="text-sm text-muted-foreground">
              {t?.auth?.buyerDescription || "Access your buyer dashboard to manage RFQs, messages, and saved suppliers."}
            </p>
          </TabsContent>
          <TabsContent value="manufacturer" className="mt-4">
            <p className="text-sm text-muted-foreground">
              {t?.auth?.manufacturerDescription || "Access your manufacturer dashboard to manage products, inquiries, and company profile."}
            </p>
          </TabsContent>
          <TabsContent value="admin" className="mt-4">
            <p className="text-sm text-muted-foreground">
              {t?.auth?.adminDescription || "Access the admin panel to manage users, suppliers, and platform settings."}
            </p>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t?.auth?.email || "Email address"}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password">{t?.auth?.password || "Password"}</Label>
                <Link href="/auth/forgot-password" className="text-sm text-secondary hover:underline">
                  {t?.auth?.forgotPassword || "Forgot password?"}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={formData.remember}
                onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm font-normal">{t?.auth?.rememberMe || "Remember me"}</Label>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t?.auth?.signingIn || "Signing in..."}
              </>
            ) : (
              `${t?.auth?.signInAs || "Sign in as"} ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
            )}
          </Button>

          {activeTab !== "admin" && (
            <>
              <div className="relative mt-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{t?.auth?.orContinueWith || "Or"}</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogle}
                aria-label="Continue with Google"
                className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 mt-3"
                disabled={isLoading}
              >
                <FcGoogle className="w-4 h-4" />
                {t?.auth?.continueWithGoogle || "Continue with Google"}
              </Button>
            </>
          )}
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t?.auth?.noAccount || "Don't have an account?"}{" "}
          <Link href="/auth/signup" className="font-medium text-secondary hover:underline">
            {t?.auth?.createAccount || "Create account"}
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {t?.auth?.canceledDeletion || "Canceled a deletion request?"}{" "}
          <Link href="/auth/restore-account" className="font-medium text-secondary hover:underline">
            {t?.auth?.restoreAccount || "Restore account"}
          </Link>
        </p>
      </div>

      <SocialCompleteProfileModal
        open={!!socialSetupState}
        setupToken={socialSetupState?.setupToken || ""}
        role={socialSetupState?.role || "buyer"}
        onOpenChange={(open) => {
          if (!open) {
            setSocialSetupState(null)
          }
        }}
        onCompleted={(redirectTo) => {
          setSocialSetupState(null)
          router.push(redirectTo)
        }}
      />
    </>
  )
}
