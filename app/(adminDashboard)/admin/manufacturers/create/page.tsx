"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { countries as allCountries } from "@/lib/data/countries"
import { apiClient } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"
import { getApiErrorMessage } from "@/lib/api/errors"
import { 
  Factory,
  Mail,
  Lock,
  Building2,
  MapPin,
  Globe,
  Phone,
  User,
  Eye,
  EyeOff,
  Send,
  Save,
  CheckCircle,
  AlertCircle,
  Copy,
  Plus,
  X,
  Award,
  Package,
  Users
} from "lucide-react"

export default function AdminCreateManufacturerPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { toast } = useToast()

  // Dynamic data from API with fallback defaults
  const [certificationTypes, setCertificationTypes] = useState<string[]>([
    "ISO 9001", "ISO 14001", "ISO 45001", "CE Marking", "FDA", "GMP", "BSCI", "SEDEX", "SA8000", "REACH", "RoHS", "UL", "FCC", "IATF 16949"
  ])
  const [businessTypes, setBusinessTypes] = useState<string[]>([
    "Manufacturer", "Trading Company", "Manufacturer & Trading", "OEM Manufacturer", "ODM Manufacturer", "Contract Manufacturer"
  ])
  const [capabilities, setCapabilities] = useState<string[]>([
    "Private Label", "OEM Service", "ODM Service", "Custom Packaging", "Drop Shipping", "Quality Inspection", "Product Development", "Custom Design"
  ])
  const [exportMarkets, setExportMarkets] = useState<string[]>([])
  const [categories, setCategories] = useState<Array<{id: number; name: string}>>([])
  
  // Account Info
  const [accountForm, setAccountForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    sendCredentials: true
  })
  
  // Company Info
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    businessType: "",
    yearEstablished: "",
    employeeCount: "",
    annualRevenue: "",
    description: "",
    website: "",
    businessLicense: ""
  })
  
  // Location
  const [locationForm, setLocationForm] = useState({
    country: "",
    city: "",
    address: "",
    postalCode: "",
    phone: ""
  })
  
  // Business Details
  const [selectedIndustries, setSelectedIndustries] = useState<number[]>([])
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([])
  const [selectedExportMarkets, setSelectedExportMarkets] = useState<string[]>([])
  
  // Products
  const [mainProducts, setMainProducts] = useState<string[]>([])
  const [newProduct, setNewProduct] = useState("")

  // Fetch dynamic data from API
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setIsLoadingData(true)
        
        // Fetch categories (Industries)
        try {
          const catRes = await apiClient.get("/admin/categories")
          if (catRes.data?.data) {
            setCategories(catRes.data.data.map((cat: any) => ({ id: cat.id, name: cat.name })))
          }
        } catch (err) {
          console.log("Categories endpoint not available, using defaults")
        }

        // Fetch certifications
        try {
          const certRes = await apiClient.get("/api/certifications")
          if (certRes.data?.data) {
            setCertificationTypes(certRes.data.data)
          }
        } catch (err) {
          console.log("Certifications endpoint not available, using defaults")
        }

        // Fetch business types
        try {
          const bizRes = await apiClient.get("/api/business-types")
          if (bizRes.data?.data) {
            setBusinessTypes(bizRes.data.data)
          }
        } catch (err) {
          console.log("Business types endpoint not available, using defaults")
        }

        // Fetch capabilities
        try {
          const capRes = await apiClient.get("/api/capabilities")
          if (capRes.data?.data) {
            setCapabilities(capRes.data.data)
          }
        } catch (err) {
          console.log("Capabilities endpoint not available, using defaults")
        }

        // Fetch export markets
        try {
          const mkRes = await apiClient.get("/api/export-markets")
          if (mkRes.data?.data) {
            setExportMarkets(mkRes.data.data)
          }
        } catch (err) {
          console.log("Export markets endpoint not available, using defaults")
        }

        setIsLoadingData(false)
      } catch (err) {
        console.error("Error fetching dynamic data:", err)
        setIsLoadingData(false)
      }
    }

    fetchDynamicData()
  }, [])
  
  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setAccountForm({ ...accountForm, password })
  }

  const toggleIndustry = (industryId: number) => {
    setSelectedIndustries(prev => 
      prev.includes(industryId) 
        ? prev.filter(i => i !== industryId)
        : [...prev, industryId]
    )
  }

  const toggleCapability = (capability: string) => {
    setSelectedCapabilities(prev => 
      prev.includes(capability) 
        ? prev.filter(c => c !== capability)
        : [...prev, capability]
    )
  }

  const toggleCertification = (cert: string) => {
    setSelectedCertifications(prev => 
      prev.includes(cert) 
        ? prev.filter(c => c !== cert)
        : [...prev, cert]
    )
  }

  const toggleExportMarket = (market: string) => {
    setSelectedExportMarkets(prev => 
      prev.includes(market) 
        ? prev.filter(m => m !== market)
        : [...prev, market]
    )
  }

  const addProduct = () => {
    if (newProduct.trim() && !mainProducts.includes(newProduct.trim())) {
      setMainProducts(prev => [...prev, newProduct.trim()])
      setNewProduct("")
    }
  }

  const removeProduct = (product: string) => {
    setMainProducts(prev => prev.filter(p => p !== product))
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!accountForm.email || !accountForm.password || !companyForm.companyName || !locationForm.country) {
      toast({ title: "Missing required fields", description: "Please provide Email, Password, Company Name and Country", variant: "destructive" })
      return
    }

    setIsSaving(true)

    // selectedIndustries already contains numeric IDs from /admin/categories
    const industries_id = selectedIndustries

    const payload: Record<string, any> = {
      email: accountForm.email,
      password: accountForm.password,
      send_email: !!accountForm.sendCredentials,

      country: locationForm.country,
      industries_id: industries_id,
      capabilities: selectedCapabilities,
      certifications: selectedCertifications,
      export_markets: selectedExportMarkets,
    }

    // Add optional fields if provided
    if (accountForm.firstName) payload.first_name = accountForm.firstName
    if (accountForm.lastName) payload.last_name = accountForm.lastName

    if (companyForm.companyName) payload.company_name = companyForm.companyName
    if (companyForm.businessType) payload.company_type = companyForm.businessType
    if (companyForm.yearEstablished) payload.company_established = companyForm.yearEstablished
    if (companyForm.employeeCount) payload.company_size = companyForm.employeeCount
    if (companyForm.annualRevenue) payload.revenue = companyForm.annualRevenue
    if (companyForm.businessLicense) payload.bussiness_license = companyForm.businessLicense
    if (companyForm.website) payload.company_website = companyForm.website
    if (companyForm.description) payload.notes = companyForm.description

    if (locationForm.city) payload.city = locationForm.city
    if (locationForm.address) payload.street_address = locationForm.address
    if (locationForm.phone) payload.phone = locationForm.phone
    if (locationForm.postalCode) payload.zip_code = locationForm.postalCode

    try {
      // Try /admin/manufacturer/create endpoint first, fallback to /admin/manufacturers
      const endpoints = ["/admin/manufacturer/create", "/admin/manufacturers"]
      let res: any = null
      for (const ep of endpoints) {
        try {
          res = await apiClient.post(ep, payload)
          if (res && (res.status === 200 || res.status === 201 || res.data)) break
        } catch (err: any) {
          // 404 -> try next endpoint
          if (err?.response?.status === 404) continue
          throw err
        }
      }

      if (!res) throw new Error("Create failed: no response from server")

      setIsSaving(false)

      // Show success alert with credentials
      await Swal.fire({
        icon: "success",
        title: "Manufacturer Created Successfully!",
        html: `
          <div style="text-align: left; margin-top: 20px;">
            <p><strong>Email:</strong></p>
            <p style="font-family: monospace; background-color: #f0f0f0; padding: 8px; border-radius: 4px; word-break: break-all;">${accountForm.email}</p>
            <p style="margin-top: 15px;"><strong>Password:</strong></p>
            <p style="font-family: monospace; background-color: #f0f0f0; padding: 8px; border-radius: 4px;">${accountForm.password}</p>
            ${accountForm.sendCredentials ? `<p style="margin-top: 15px; color: #10b981;"><strong>✓</strong> Credentials will be sent to ${accountForm.email}</p>` : ""}
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "View Manufacturers",
        cancelButtonText: "Create Another",
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#6b7280",
      }).then((result: any) => {
        if (result.isConfirmed) {
          resetForm()
          router.push("/admin/manufacturers")
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          resetForm()
        }
      })

    } catch (err) {
      setIsSaving(false)
      const errorMsg = getApiErrorMessage(err) || String(err)
      
      Swal.fire({
        icon: "error",
        title: "Failed to Create Manufacturer",
        text: errorMsg,
        confirmButtonColor: "#ef4444"
      })
    }
  }

  const resetForm = () => {
    setAccountForm({ email: "", password: "", firstName: "", lastName: "", sendCredentials: true })
    setCompanyForm({ companyName: "", businessType: "", yearEstablished: "", employeeCount: "", annualRevenue: "", description: "", website: "", businessLicense: "" })
    setLocationForm({ country: "", city: "", address: "", postalCode: "", phone: "" })
    setSelectedIndustries([])
    setSelectedCapabilities([])
    setSelectedCertifications([])
    setExportMarkets([])
    setMainProducts([])
    setCurrentStep(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Manufacturer Account</h1>
          <p className="text-muted-foreground">
            Step {currentStep} of 4 - Add a new manufacturer to the platform
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex-1">
            <div className={`h-2 rounded-full ${currentStep >= step ? "bg-primary" : "bg-muted"}`} />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {step === 1 && "Account"}
              {step === 2 && "Company"}
              {step === 3 && "Location"}
              {step === 4 && "Business"}
            </p>
          </div>
        ))}
      </div>

      {/* Step 1: Account Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Set up login credentials for the manufacturer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input 
                  value={accountForm.firstName}
                  onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
                  className="mt-2"
                  placeholder="Contact first name"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input 
                  value={accountForm.lastName}
                  onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
                  className="mt-2"
                  placeholder="Contact last name"
                />
              </div>
            </div>

            <div>
              <Label>Email Address *</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                  className="pl-9"
                  placeholder="manufacturer@company.com"
                />
              </div>
            </div>

            <div>
              <Label>Password *</Label>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={accountForm.password}
                    onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                    className="pl-9 pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button type="button" variant="outline" onClick={generatePassword}>
                  Generate
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
              <Switch 
                checked={accountForm.sendCredentials}
                onCheckedChange={(checked) => setAccountForm({ ...accountForm, sendCredentials: checked })}
              />
              <div>
                <Label>Send login credentials via email</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically email the login details to the manufacturer
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)} 
                disabled
                className="w-32"
              >
                Previous
              </Button>
              <Button 
                className="w-32" 
                onClick={() => {
                  if (!accountForm.email || !accountForm.password) {
                    toast({ title: "Missing fields", description: "Email and Password are required", variant: "destructive" })
                    return
                  }
                  setCurrentStep(2)
                }}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Company Information */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Basic details about the manufacturing company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Company Name *</Label>
              <Input 
                value={companyForm.companyName}
                onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                className="mt-2"
                placeholder="e.g., ABC Manufacturing Co., Ltd."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Business Type</Label>
                <Select 
                  value={companyForm.businessType}
                  onValueChange={(value) => setCompanyForm({ ...companyForm, businessType: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Year Established</Label>
                <Input 
                  type="number"
                  value={companyForm.yearEstablished}
                  onChange={(e) => setCompanyForm({ ...companyForm, yearEstablished: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., 2005"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Number of Employees</Label>
                <Select 
                  value={companyForm.employeeCount}
                  onValueChange={(value) => setCompanyForm({ ...companyForm, employeeCount: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-100">51-100</SelectItem>
                    <SelectItem value="101-500">101-500</SelectItem>
                    <SelectItem value="501-1000">501-1000</SelectItem>
                    <SelectItem value="1000+">1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Annual Revenue (USD)</Label>
                <Select 
                  value={companyForm.annualRevenue}
                  onValueChange={(value) => setCompanyForm({ ...companyForm, annualRevenue: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="< $1M">Less than $1M</SelectItem>
                    <SelectItem value="$1M - $5M">$1M - $5M</SelectItem>
                    <SelectItem value="$5M - $10M">$5M - $10M</SelectItem>
                    <SelectItem value="$10M - $50M">$10M - $50M</SelectItem>
                    <SelectItem value="$50M - $100M">$50M - $100M</SelectItem>
                    <SelectItem value="> $100M">More than $100M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Company Description</Label>
              <Textarea 
                value={companyForm.description}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                className="mt-2"
                rows={4}
                placeholder="Brief description of the company and its capabilities..."
              />
            </div>

            <div>
              <Label>Website</Label>
              <div className="relative mt-2">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="pl-9"
                  placeholder="https://www.company.com"
                />
              </div>
            </div>

            <div>
              <Label>Business / License No.</Label>
              <Input
                value={companyForm.businessLicense}
                onChange={(e) => setCompanyForm({ ...companyForm, businessLicense: e.target.value })}
                className="mt-2"
                placeholder="e.g., BL-2024-987654"
              />
            </div>

            <div className="flex gap-3 pt-4 justify-between">
              <Button 
                variant="outline"
                className="w-32"
                onClick={() => setCurrentStep(1)}
              >
                Previous
              </Button>
              <Button 
                className="w-32"
                onClick={() => {
                  if (!companyForm.companyName) {
                    toast({ title: "Missing fields", description: "Company Name is required", variant: "destructive" })
                    return
                  }
                  setCurrentStep(3)
                }}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Location Details */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
            <CardDescription>
              Company address and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Country *</Label>
                <Select 
                  value={locationForm.country}
                  onValueChange={(value) => setLocationForm({ ...locationForm, country: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCountries.map(country => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>City</Label>
                <Input 
                  value={locationForm.city}
                  onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., Shenzhen"
                />
              </div>
            </div>

            <div>
              <Label>Street Address</Label>
              <Input 
                value={locationForm.address}
                onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                className="mt-2"
                placeholder="Full street address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Postal Code</Label>
                <Input 
                  value={locationForm.postalCode}
                  onChange={(e) => setLocationForm({ ...locationForm, postalCode: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., 518000"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    value={locationForm.phone}
                    onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })}
                    className="pl-9"
                    placeholder="+86 755 1234 5678"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 justify-between">
              <Button 
                variant="outline"
                className="w-32"
                onClick={() => setCurrentStep(2)}
              >
                Previous
              </Button>
              <Button 
                className="w-32"
                onClick={() => {
                  if (!locationForm.country) {
                    toast({ title: "Missing fields", description: "Country is required", variant: "destructive" })
                    return
                  }
                  setCurrentStep(4)
                }}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Business Details */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {/* Industries */}
          <Card>
            <CardHeader>
              <CardTitle>Industries</CardTitle>
              <CardDescription>
                Select the industries this manufacturer operates in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category.id}
                    variant={selectedIndustries.includes(category.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleIndustry(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>Capabilities</CardTitle>
              <CardDescription>
                Services and capabilities offered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {capabilities.map(cap => (
                  <div 
                    key={cap}
                    className="flex items-center gap-2"
                  >
                    <Checkbox 
                      checked={selectedCapabilities.includes(cap)}
                      onCheckedChange={() => toggleCapability(cap)}
                    />
                    <span className="text-sm">{cap}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>
                Quality and compliance certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {certificationTypes.map(cert => (
                  <Badge
                    key={cert}
                    variant={selectedCertifications.includes(cert) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCertification(cert)}
                  >
                    <Award className="mr-1 h-3 w-3" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Markets */}
          <Card>
            <CardHeader>
              <CardTitle>Export Markets</CardTitle>
              <CardDescription>
                Regions where the manufacturer exports to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["North America", "South America", "Western Europe", "Eastern Europe", "Middle East", "Africa", "Southeast Asia", "East Asia", "South Asia", "Oceania"].map(market => (
                  <Badge
                    key={market}
                    variant={selectedExportMarkets.includes(market) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleExportMarket(market)}
                  >
                    <Globe className="mr-1 h-3 w-3" />
                    {market}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between">
            <Button 
              variant="outline"
              className="w-32"
              onClick={() => setCurrentStep(3)}
            >
              Previous
            </Button>
            <Button 
              className="w-32" 
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Manufacturer
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
