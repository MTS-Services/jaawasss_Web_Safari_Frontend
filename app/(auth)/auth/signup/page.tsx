"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n"
import { REGISTER_SUCCESS_STORAGE_KEY } from "@/lib/register-success-storage"
import { countries } from "@/lib/data/countries"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Loader2, Users, Factory, Check, AlertCircle, Upload, FileText, X, Camera, Globe, Building2, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { decodeGoogleIdTokenPayload, getGoogleIdToken } from "@/lib/google-identity"

export default function SignUpPage() {
  const router = useRouter()
  const { signup, loginWithGoogle } = useAuth()
  const { t } = useTranslation()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"role" | "details">("role")
  const [formData, setFormData] = useState({
    role: ("buyer" as "buyer" | "manufacturer"),
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    country: "",
    password: "",
    agreeTerms: false,
    // Manufacturer verification fields
    city: "",
    businessLicense: null as File | null,
    website: "",
    factoryPhotos: [] as File[],
    additionalNotes: "",
  })
  
  const businessLicenseRef = useRef<HTMLInputElement>(null)
  const factoryPhotosRef = useRef<HTMLInputElement>(null)
  
  const handleBusinessLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, businessLicense: file })
    }
  }
  
  const handleFactoryPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const currentPhotos = formData.factoryPhotos
    const newPhotos = [...currentPhotos, ...files].slice(0, 5) // Max 5 photos
    setFormData({ ...formData, factoryPhotos: newPhotos })
  }
  
  const removeFactoryPhoto = (index: number) => {
    const newPhotos = formData.factoryPhotos.filter((_, i) => i !== index)
    setFormData({ ...formData, factoryPhotos: newPhotos })
  }

  const handleRoleSelect = (role: "buyer" | "manufacturer") => {
    setFormData({ ...formData, role })
    setStep("details")
  }

  // Respect ?role=manufacturer (client-side only) without causing SSR hydration mismatch.
  useEffect(() => {
    if (typeof window === "undefined") return
    const roleParam = new URLSearchParams(window.location.search).get("role") as
      | "buyer"
      | "manufacturer"
      | null
    if (roleParam) {
      setFormData((prev) => ({ ...prev, role: roleParam }))
      setStep("details")
    }
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const deviceName = typeof window !== "undefined" ? navigator.userAgent : "web"

      const result = await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        role: formData.role as UserRole,
        country: formData.country,
        city: formData.city,
        businessLicense: formData.businessLicense,
        website: formData.website,
        factoryPhotos: formData.factoryPhotos,
        additionalNotes: formData.additionalNotes,
        agreeTerms: formData.agreeTerms,
        deviceName,
      })
      
      if (result.success) {
        // If the registration returned an active session (not pending review)
        // and the selected role is buyer, redirect straight to the dashboard.
        if (!result.pendingReview && formData.role === "buyer") {
          router.push(result.redirectTo)
          return
        }

        const payload = result.pendingReview
          ? {
              message: result.message,
              manufactureStatus: result.manufactureStatus ?? null,
              isLoggedIn: false as const,
            }
          : {
              message:
                result.message ||
                (t?.auth?.reviewPlans || "Your account has been created. Review plans next, or go straight to your dashboard."),
              manufactureStatus: null as string | null,
              isLoggedIn: true as const,
              dashboardPath: result.redirectTo,
            }

        sessionStorage.setItem(REGISTER_SUCCESS_STORAGE_KEY, JSON.stringify(payload))
        router.push("/auth/register-success")
      } else {
        setError(result.message || (t?.auth?.registrationFailed || "Registration failed. Please try again."))
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
      const result = await loginWithGoogle(credential, "buyer")
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
        const params = new URLSearchParams({
          setup_token: result.setupToken,
          role: result.role,
        })
        router.push(`/auth/social-complete?${params.toString()}`)
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

  if (step === "role") {
    return (
      <div className="lg:flex lg:min-h-[calc(100vh-6rem)] lg:flex-col lg:justify-center">
        <div className="text-center lg:text-left">
          <h1 className="font-serif text-3xl font-medium text-foreground">
            {t?.auth?.createNewAccount || "Create your account"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t?.auth?.joinOurPlatform || "Join our platform to start selling or find suppliers"}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleRoleSelect("buyer")}
            className="group w-full rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-secondary hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 group-hover:bg-secondary/20">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{t?.auth?.buyerRole || "I'm a Buyer"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t?.auth?.buyerRoleDesc || "Search suppliers, compare factories, request quotes — completely free"}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    {t?.auth?.free || "Free forever"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    {t?.auth?.directMessaging || "Direct messaging"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    {t?.auth?.unlimitedRFQs || "Unlimited RFQs"}
                  </li>
                </ul>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("manufacturer")}
            className="group w-full rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-secondary hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 group-hover:bg-secondary/20">
                <Factory className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{t?.auth?.manufacturerRole || "I'm a Manufacturer"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t?.auth?.manufacturerRoleDesc || "Showcase your factory and reach buyers worldwide"}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    {t?.auth?.globalVisibility || "Global visibility"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    {t?.auth?.reviewedBadge || "Reviewed badge"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    {t?.auth?.noCommissionFees || "No commission fees"}
                  </li>
                </ul>
              </div>
            </div>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t?.auth?.hasAccount || "Already have an account?"}{" "}
          <Link href="/auth/signin" className="font-medium text-secondary hover:underline">
            {t?.auth?.signIn || "Sign in"}
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center lg:text-left">
        <button
          onClick={() => setStep("role")}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground"
        >
          ← {t?.auth?.backToRoleSelection || "Back to role selection"}
        </button>
        <h1 className="font-serif text-3xl font-medium text-foreground">
          {t?.auth?.createNewAccount || "Create your account"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {formData.role === "buyer"
            ? (t?.auth?.startSourcing || "Start sourcing from reviewed suppliers worldwide")
            : (t?.auth?.completeRegistration || "Complete registration, then choose a plan to get started")}
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t?.auth?.firstName || "First name"} <span className="text-destructive">*</span></Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t?.auth?.lastName || "Last name"} <span className="text-destructive">*</span></Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t?.auth?.email || "Work email"} <span className="text-destructive">*</span></Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">{t?.auth?.company || "Company name"} <span className="text-destructive">*</span></Label>
            <Input
              id="company"
              placeholder="Your company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">{t?.auth?.country || "Country"} <span className="text-destructive">*</span></Label>
            <Select 
              value={formData.country} 
              onValueChange={(value) => setFormData({ ...formData, country: value })}
              required
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-75">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t?.auth?.password || "Password"} <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                className="pr-10"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{t?.auth?.passwordMinLength || "Must be at least 8 characters"}</p>
          </div>

          {/* Manufacturer Review Section */}
          {formData.role === "manufacturer" && (
            <>
              <Separator className="my-6" />
              
              <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground">{t?.auth?.reviewDocsRequired || "Review Documents Required"}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t?.auth?.reviewDocsDescription || "To ensure quality and trust on our platform, we require basic review documents. Your account will be reviewed by our team before activation."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business License Upload */}
              <div className="space-y-2">
                <Label htmlFor="businessLicense" className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-secondary" />
                  {t?.auth?.businessLicense || "Business License"} <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  {t?.auth?.uploadBizLicense || "Upload your official company registration document (PDF, JPG, PNG - max 10MB)"}
                </p>
                <input
                  ref={businessLicenseRef}
                  type="file"
                  id="businessLicense"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleBusinessLicenseChange}
                  className="hidden"
                  disabled={isLoading}
                />
                {formData.businessLicense ? (
                  <div className="flex items-center justify-between rounded-lg border border-secondary/30 bg-secondary/5 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                        <FileText className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{formData.businessLicense.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(formData.businessLicense.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData({ ...formData, businessLicense: null })}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-20 border-dashed"
                    onClick={() => businessLicenseRef.current?.click()}
                    disabled={isLoading}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload business license</span>
                    </div>
                  </Button>
                )}
              </div>

              {/* City Field */}
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-secondary" />
                  {t?.auth?.city || "City"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="e.g., Shenzhen, Shanghai, Ho Chi Minh"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  {t?.auth?.cityDescription || "Combined with country above, this forms your company address"}
                </p>
              </div>

              {/* Company Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-secondary" />
                  {t?.auth?.website || "Company Website"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.yourcompany.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              {/* Factory Photos */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Camera className="h-4 w-4 text-secondary" />
                  {t?.auth?.factoryPhotos || "Factory Photos"} <span className="text-destructive">*</span> <span className="text-muted-foreground text-xs">(max 5)</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  {t?.auth?.uploadFactoryDesc || "Upload photos of your production line or factory building to support your application"}
                </p>
                <input
                  ref={factoryPhotosRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFactoryPhotosChange}
                  className="hidden"
                  disabled={isLoading || formData.factoryPhotos.length >= 5}
                  required={formData.factoryPhotos.length === 0}
                />
                
                {formData.factoryPhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {formData.factoryPhotos.map((photo, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border bg-muted/30 p-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Camera className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate">{photo.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 shrink-0"
                          onClick={() => removeFactoryPhoto(index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {formData.factoryPhotos.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => factoryPhotosRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {t?.auth?.addFactoryPhotos || `Add Factory Photos (${formData.factoryPhotos.length}/5)`}
                  </Button>
                )}
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-1">
                  {t?.auth?.additionalNotes || "Additional Notes"} <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Tell us more about your company, products, or any certifications you have..."
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <Separator className="my-2" />
            </>
          )}

          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, agreeTerms: checked as boolean })
              }
              disabled={isLoading}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-snug">
              {t?.auth?.agreeToTerms || "I agree to the"}
              {" "}
              <Link href="/terms" className="text-secondary hover:underline">
                {t?.auth?.termsOfService || "Terms of Service"}
              </Link>
              {" and "}
              <Link href="/privacy" className="text-secondary hover:underline">
                {t?.auth?.privacyPolicy || "Privacy Policy"}
              </Link>
            </Label>
          </div>
        </div>

        {(() => {
          const manufacturerFieldsValid = formData.role === "manufacturer" 
            ? (formData.businessLicense && formData.city.trim() !== "")
            : true
          const isSubmitDisabled = isLoading || !formData.agreeTerms || !manufacturerFieldsValid
          
          return (
            <>
              <Button 
                type="submit" 
                className={cn("w-full", formData.role === "manufacturer" && "bg-secondary text-secondary-foreground hover:bg-secondary/90")} 
                disabled={isSubmitDisabled}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t?.auth?.creatingAccount || "Creating account..."}
                  </>
                ) : formData.role === "buyer" ? (
                  t?.auth?.createFreeAccount || "Create free account"
                ) : (
                  t?.auth?.submitForReview || "Submit for Review"
                )}
              </Button>

              {formData.role === "manufacturer" && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-center text-xs text-amber-800">
                    <strong>Important:</strong> Your manufacturer account will be pending admin approval after registration.
                    Our team will review your documents and notify you once approved.
                    This typically takes 1-2 business days.
                  </p>
                </div>
              )}
            </>
          )
        })()}

        
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t?.auth?.alreadyHaveAccount || "Already have an account?"}{" "}
        <Link href="/auth/signin" className="font-medium text-secondary hover:underline">
          {t?.auth?.signIn || "Sign in"}
        </Link>
      </p>
    </div>
  )
}
