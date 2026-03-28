"use client"

import { useState, useRef } from "react"
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
import { useAuth, UserRole } from "@/lib/auth-context"
import { countries } from "@/lib/data/countries"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Loader2, Users, Factory, Check, AlertCircle, Upload, FileText, X, Camera, Globe, Building2, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function SignUpPage() {
  const router = useRouter()
  const defaultRole =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("role") as "buyer" | "manufacturer" | null)
      : null
  const { signup } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"role" | "details">(defaultRole ? "details" : "role")
  const [formData, setFormData] = useState({
    role: defaultRole || ("buyer" as "buyer" | "manufacturer"),
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
        router.push(result.redirectTo)
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "role") {
    return (
      <div>
        <div className="text-center lg:text-left">
          <h1 className="font-serif text-3xl font-medium text-foreground">
            Join SourceNest
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose how you want to use the platform
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
                <h3 className="font-semibold text-foreground">I&apos;m a Buyer</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search suppliers, compare factories, request quotes — completely free
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    Free forever
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    Direct messaging
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    Unlimited RFQs
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
                <h3 className="font-semibold text-foreground">I&apos;m a Manufacturer</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Showcase your factory and reach buyers worldwide
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    Global visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    Reviewed badge
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" />
                    No commission fees
                  </li>
                </ul>
              </div>
            </div>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-secondary hover:underline">
            Sign in
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
          ← Back to role selection
        </button>
        <h1 className="font-serif text-3xl font-medium text-foreground">
          Create your {formData.role === "buyer" ? "buyer" : "manufacturer"} account
        </h1>
        <p className="mt-2 text-muted-foreground">
          {formData.role === "buyer"
            ? "Start sourcing from reviewed suppliers worldwide"
            : "Complete registration, then choose a plan to get started"}
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
              <Label htmlFor="firstName">First name</Label>
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
              <Label htmlFor="lastName">Last name</Label>
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
            <Label htmlFor="email">Work email</Label>
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
            <Label htmlFor="company">Company name</Label>
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
            <Label htmlFor="country">Country</Label>
            <Select 
              value={formData.country} 
              onValueChange={(value) => setFormData({ ...formData, country: value })}
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
            <Label htmlFor="password">Password</Label>
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
            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          </div>

          {/* Manufacturer Review Section */}
          {formData.role === "manufacturer" && (
            <>
              <Separator className="my-6" />
              
              <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground">Review Documents Required</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      To ensure quality and trust on our platform, we require basic review documents. 
                      Your account will be reviewed by our team before activation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Business License Upload */}
              <div className="space-y-2">
                <Label htmlFor="businessLicense" className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-secondary" />
                  Business License <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Upload your official company registration document (PDF, JPG, PNG - max 10MB)
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
                  City <span className="text-destructive">*</span>
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
                  Combined with country above, this forms your company address
                </p>
              </div>

              {/* Company Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-secondary" />
                  Company Website <span className="text-muted-foreground text-xs">(optional)</span>
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
                  Factory Photos <span className="text-muted-foreground text-xs">(optional, max 5)</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Upload photos of your production line or factory building to support your application
                </p>
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
                    Add Factory Photos ({formData.factoryPhotos.length}/5)
                  </Button>
                )}
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-1">
                  Additional Notes <span className="text-muted-foreground text-xs">(optional)</span>
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
                    Creating account...
                  </>
                ) : formData.role === "buyer" ? (
                  "Create free account"
                ) : (
                  "Submit for Review"
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
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-medium text-secondary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
