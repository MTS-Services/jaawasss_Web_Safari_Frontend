"use client"

import { Suspense, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertCircle,
  Building2,
  Camera,
  FileText,
  Globe,
  Loader2,
  Upload,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { countries } from "@/lib/data/countries"

type SocialRole = "buyer" | "manufacturer"

export default function SocialCompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="font-serif text-3xl font-medium text-foreground">Complete your profile</h1>
          <p className="mt-2 text-muted-foreground">Loading profile setup...</p>
        </div>
      }
    >
      <SocialCompleteProfileContent />
    </Suspense>
  )
}

function SocialCompleteProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { completeGoogleProfile } = useAuth()

  const setupToken = searchParams.get("setup_token")?.trim() || ""
  const role: SocialRole = searchParams.get("role") === "manufacturer" ? "manufacturer" : "buyer"

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    companyName: "",
    agreeTerms: false,
    city: "",
    country: "",
    website: "",
    notes: "",
    businessLicense: null as File | null,
    factoryPhotos: [] as File[],
  })

  const businessLicenseRef = useRef<HTMLInputElement>(null)
  const factoryPhotosRef = useRef<HTMLInputElement>(null)

  const handleBusinessLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, businessLicense: file }))
  }

  const handleFactoryPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({
      ...prev,
      factoryPhotos: [...prev.factoryPhotos, ...files].slice(0, 5),
    }))
  }

  const removeFactoryPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      factoryPhotos: prev.factoryPhotos.filter((_, i) => i !== index),
    }))
  }

  const validate = (): string | null => {
    if (!setupToken) {
      return "Missing setup token. Please restart Google sign-in."
    }

    if (!formData.companyName.trim()) {
      return "Company name is required."
    }

    if (!formData.agreeTerms) {
      return "You must agree to the Terms of Service and Privacy Policy."
    }

    if (role === "manufacturer") {
      if (!formData.businessLicense) {
        return "Business license is required for manufacturer accounts."
      }

      if (!formData.city.trim()) {
        return "City is required for manufacturer accounts."
      }

      if (!formData.country.trim()) {
        return "Country is required for manufacturer accounts."
      }

      if (!formData.website.trim()) {
        return "Company website is required for manufacturer accounts."
      }
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const result = await completeGoogleProfile({
        setupToken,
        role,
        companyName: formData.companyName.trim(),
        agreedToTerms: formData.agreeTerms,
        city: role === "manufacturer" ? formData.city.trim() : undefined,
        country: role === "manufacturer" ? formData.country : undefined,
        companyWebsite: role === "manufacturer" ? formData.website.trim() : undefined,
        notes: formData.notes.trim() || undefined,
        businessLicense: role === "manufacturer" ? formData.businessLicense : undefined,
        factoryImages: formData.factoryPhotos,
      })

      if (result.success) {
        router.push(result.redirectTo)
        return
      }

      setError(result.message || "Could not complete your profile. Please try again.")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not complete your profile."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!setupToken) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-medium text-foreground">Complete your profile</h1>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Invalid setup link. Please sign in with Google again.
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/auth/signin" className="font-medium text-secondary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium text-foreground">Complete your profile</h1>
      <p className="mt-2 text-muted-foreground">
        {role === "buyer"
          ? "Finish your buyer profile to continue."
          : "Finish your manufacturer verification details to continue."}
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
            required
            disabled={isLoading}
            placeholder="Your company"
          />
        </div>

        {role === "manufacturer" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
                disabled={isLoading}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-1">
                <Building2 className="h-4 w-4 text-secondary" />
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                required
                disabled={isLoading}
                placeholder="e.g. Dhaka"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-secondary" />
                Company website
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                required
                disabled={isLoading}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessLicense" className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-secondary" />
                Business license
              </Label>
              <input
                ref={businessLicenseRef}
                id="businessLicense"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleBusinessLicenseChange}
                className="hidden"
                disabled={isLoading}
              />

              {formData.businessLicense ? (
                <div className="flex items-center justify-between rounded-lg border border-secondary/30 bg-secondary/5 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{formData.businessLicense.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(formData.businessLicense.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, businessLicense: null }))}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => businessLicenseRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload business license
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Camera className="h-4 w-4 text-secondary" />
                Factory photos (optional)
              </Label>
              <input
                ref={factoryPhotosRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFactoryPhotosChange}
                className="hidden"
                disabled={isLoading || formData.factoryPhotos.length >= 5}
              />

              {formData.factoryPhotos.length > 0 && (
                <div className="space-y-2">
                  {formData.factoryPhotos.map((photo, index) => (
                    <div key={`${photo.name}-${index}`} className="flex items-center justify-between rounded-lg border p-2">
                      <span className="truncate text-sm">{photo.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
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
                  onClick={() => factoryPhotosRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Add factory photos ({formData.factoryPhotos.length}/5)
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                disabled={isLoading}
                rows={3}
                placeholder="Anything we should know about your company"
              />
            </div>
          </>
        )}

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={formData.agreeTerms}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))
            }
            disabled={isLoading}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm font-normal leading-snug">
            I agree to the{" "}
            <Link href="/terms" className="text-secondary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-secondary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing profile...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </div>
  )
}
