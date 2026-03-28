"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { countries as allCountries } from "@/lib/data/countries"
import { industries } from "@/lib/data/industries"
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

const certificationTypes = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "CE Marking",
  "FDA",
  "GMP",
  "BSCI",
  "SEDEX",
  "SA8000",
  "REACH",
  "RoHS",
  "UL",
  "FCC",
  "IATF 16949"
]

const businessTypes = [
  "Manufacturer",
  "Trading Company",
  "Manufacturer & Trading",
  "OEM Manufacturer",
  "ODM Manufacturer",
  "Contract Manufacturer"
]

const capabilities = [
  "Private Label",
  "OEM Service",
  "ODM Service",
  "Custom Packaging",
  "Drop Shipping",
  "Quality Inspection",
  "Product Development",
  "Custom Design"
]

export default function AdminCreateManufacturerPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [createdCredentials, setCreatedCredentials] = useState({ email: "", password: "" })
  const [isSaving, setIsSaving] = useState(false)
  
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
    website: ""
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
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([])
  const [exportMarkets, setExportMarkets] = useState<string[]>([])
  
  // Products
  const [mainProducts, setMainProducts] = useState<string[]>([])
  const [newProduct, setNewProduct] = useState("")
  
  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setAccountForm({ ...accountForm, password })
  }

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
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
    setExportMarkets(prev => 
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

  const copyCredentials = () => {
    const text = `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`
    navigator.clipboard.writeText(text)
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!accountForm.email || !accountForm.password || !companyForm.companyName || !locationForm.country) {
      alert("Please fill in all required fields: Email, Password, Company Name, and Country")
      return
    }

    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Store credentials for display
    setCreatedCredentials({
      email: accountForm.email,
      password: accountForm.password
    })
    
    setIsSaving(false)
    setShowSuccessDialog(true)
  }

  const resetForm = () => {
    setAccountForm({ email: "", password: "", firstName: "", lastName: "", sendCredentials: true })
    setCompanyForm({ companyName: "", businessType: "", yearEstablished: "", employeeCount: "", annualRevenue: "", description: "", website: "" })
    setLocationForm({ country: "", city: "", address: "", postalCode: "", phone: "" })
    setSelectedIndustries([])
    setSelectedCapabilities([])
    setSelectedCertifications([])
    setExportMarkets([])
    setMainProducts([])
    setShowSuccessDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Manufacturer Account</h1>
          <p className="text-muted-foreground">
            Add a new manufacturer to the platform and send them login credentials
          </p>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="location" className="gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Factory className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business">
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
                  {industries.map(industry => (
                    <Badge
                      key={industry.id}
                      variant={selectedIndustries.includes(industry.name) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleIndustry(industry.name)}
                    >
                      {industry.name}
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
                      variant={exportMarkets.includes(market) ? "default" : "outline"}
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
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Main Products</CardTitle>
              <CardDescription>
                Add the main products this manufacturer produces
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  placeholder="Enter product name"
                  onKeyDown={(e) => e.key === "Enter" && addProduct()}
                />
                <Button onClick={addProduct}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>

              {mainProducts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {mainProducts.map(product => (
                    <Badge 
                      key={product} 
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {product}
                      <button 
                        onClick={() => removeProduct(product)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No products added yet. Add products to help buyers find this manufacturer.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-card rounded-lg">
        <div className="text-sm text-muted-foreground">
          <span className="text-destructive">*</span> Required fields: Email, Password, Company Name, Country
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
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

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Manufacturer Created Successfully
            </DialogTitle>
            <DialogDescription>
              The manufacturer account has been created
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-mono text-sm">{createdCredentials.email}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Password</Label>
                <p className="font-mono text-sm">{createdCredentials.password}</p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={copyCredentials}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Credentials
            </Button>

            {accountForm.sendCredentials && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
                <Send className="h-4 w-4" />
                Login credentials will be sent to {createdCredentials.email}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm()
              router.push("/admin/suppliers")
            }}>
              View Suppliers
            </Button>
            <Button onClick={resetForm}>
              Create Another
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
