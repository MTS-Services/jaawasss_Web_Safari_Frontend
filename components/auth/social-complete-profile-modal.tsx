"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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

type SocialCompleteProfileModalProps = {
  open: boolean
  setupToken: string
  role: SocialRole
  onOpenChange: (open: boolean) => void
  onCompleted: (redirectTo: string) => void
}

export function SocialCompleteProfileModal({
  open,
  setupToken,
  role,
  onOpenChange,
  onCompleted,
}: SocialCompleteProfileModalProps) {
  const { completeGoogleProfile } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [pendingReviewModalOpen, setPendingReviewModalOpen] = useState(false)
  const [pendingReviewMessage, setPendingReviewMessage] = useState("")
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

  useEffect(() => {
    if (!open) return

    setIsLoading(false)
    setError("")
    setPendingReviewModalOpen(false)
    setPendingReviewMessage("")
    setFormData({
      companyName: "",
      agreeTerms: false,
      city: "",
      country: "",
      website: "",
      notes: "",
      businessLicense: null,
      factoryPhotos: [],
    })
  }, [open, role, setupToken])

  const handleOpenChange = (nextOpen: boolean) => {
    if (isLoading) return
    onOpenChange(nextOpen)
  }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        onOpenChange(false)
        onCompleted(result.redirectTo)
        return
      }

      if (result.pendingReview) {
        setPendingReviewMessage(
          result.message ||
            "Thank you for registering. Your account is currently pending review."
        )
        onOpenChange(false)
        setPendingReviewModalOpen(true)
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

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-h-[90vh] overflow-hidden p-0 sm:max-w-2xl"
          showCloseButton={!isLoading}
        >
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="font-serif text-2xl">Complete your profile</DialogTitle>
            <DialogDescription>
              {role === "buyer"
                ? "Finish your buyer profile to continue."
                : "Finish your manufacturer review details to continue."}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[calc(90vh-6rem)] overflow-y-auto px-6 pb-6">
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="socialCompanyName">Company name</Label>
                <Input
                  id="socialCompanyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                  }
                  required
                  disabled={isLoading}
                  placeholder="Your company"
                />
              </div>

              {role === "manufacturer" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="socialCountry">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, country: value }))
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger id="socialCountry">
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
                    <Label htmlFor="socialCity" className="flex items-center gap-1">
                      <Building2 className="h-4 w-4 text-secondary" />
                      City
                    </Label>
                    <Input
                      id="socialCity"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, city: e.target.value }))
                      }
                      required
                      disabled={isLoading}
                      placeholder="e.g. Dhaka"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socialWebsite" className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-secondary" />
                      Company website
                    </Label>
                    <Input
                      id="socialWebsite"
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, website: e.target.value }))
                      }
                      required
                      disabled={isLoading}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socialBusinessLicense" className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-secondary" />
                      Business license
                    </Label>
                    <input
                      ref={businessLicenseRef}
                      id="socialBusinessLicense"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleBusinessLicenseChange}
                      className="hidden"
                      disabled={isLoading}
                    />

                    {formData.businessLicense ? (
                      <div className="flex items-center justify-between rounded-lg border border-secondary/30 bg-secondary/5 p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate" title={decodeURIComponent(formData.businessLicense.name)}>
                            {decodeURIComponent(formData.businessLicense.name)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(formData.businessLicense.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, businessLicense: null }))
                          }
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
                          <div
                            key={`${photo.name}-${index}`}
                            className="flex items-center justify-between rounded-lg border p-2"
                          >
                            <span className="truncate text-sm" title={decodeURIComponent(photo.name)}>
                              {decodeURIComponent(photo.name)}
                            </span>
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
                    <Label htmlFor="socialNotes">Additional notes (optional)</Label>
                    <Textarea
                      id="socialNotes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      disabled={isLoading}
                      rows={3}
                      placeholder="Anything we should know about your company"
                    />
                  </div>
                </>
              )}

              <div className="flex items-start gap-2">
                <Checkbox
                  id="socialTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, agreeTerms: checked === true }))
                  }
                  disabled={isLoading}
                  className="mt-0.5"
                />
                <Label htmlFor="socialTerms" className="text-sm font-normal leading-snug">
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
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingReviewModalOpen} onOpenChange={setPendingReviewModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration submitted</AlertDialogTitle>
            <AlertDialogDescription>{pendingReviewMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Okay</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
