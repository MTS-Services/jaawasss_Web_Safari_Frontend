"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { countries } from "@/lib/data/countries"
import { industries } from "@/lib/data/industries"
import { 
  Factory,
  Save,
  Upload,
  Plus,
  X,
  Globe,
  Award,
  MapPin,
  CheckCircle,
  Clock,
  Briefcase,
  Users,
  Building2,
  Languages,
  CreditCard,
  Camera
} from "lucide-react"

export default function ManufacturerProfilePage() {
  const [certifications, setCertifications] = useState([
    "ISO 9001:2015", "ISO 14001", "CE Certified", "RoHS Compliant"
  ])
  const [exportMarkets, setExportMarkets] = useState([
    "North America", "Western Europe", "Australia", "Southeast Asia"
  ])
  const [languages, setLanguages] = useState([
    "English", "Mandarin", "Cantonese"
  ])
  const [paymentTerms, setPaymentTerms] = useState([
    "T/T", "L/C", "PayPal", "Western Union"
  ])
  const [businessTypes, setBusinessTypes] = useState({
    manufacturer: true,
    tradingCompany: false,
    oem: true,
    odm: true
  })
  const [newCert, setNewCert] = useState("")
  const [newMarket, setNewMarket] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newPaymentTerm, setNewPaymentTerm] = useState("")
  const [oem, setOem] = useState(true)
  const [odm, setOdm] = useState(true)
  const [privateLabelEnabled, setPrivateLabelEnabled] = useState(true)
  const [customization, setCustomization] = useState(true)

  const [formData, setFormData] = useState({
    companyName: "TechVision Electronics Co., Ltd.",
    shortDescription: "Leading manufacturer of consumer electronics and audio products",
    fullDescription: "TechVision Electronics Co., Ltd. is a leading manufacturer of consumer electronics, specializing in audio products, wearables, and smart devices. With over 15 years of industry experience, we combine cutting-edge technology with rigorous quality control to deliver products that exceed expectations. Our state-of-the-art facility spans 50,000 square meters and employs over 500 skilled professionals.",
    yearEstablished: "2008",
    employeeCount: "500",
    country: "CN",
    city: "Shenzhen",
    address: "Building A, Tech Industrial Park, Nanshan District",
    industry: "electronics-electrical",
    mainProducts: "TWS Earbuds, Bluetooth Speakers, Smart Watches, Fitness Trackers, Wireless Chargers, USB Accessories",
    minimumOrder: "5000",
    factorySize: "50000",
    productionLines: "12",
    annualOutput: "5000000",
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Company Profile</h1>
          <p className="mt-1 text-muted-foreground">
            Manage how your company appears to potential buyers
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Preview Profile</Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input 
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Short Description</Label>
                <Input 
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Full Description</Label>
                <Textarea 
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="mt-2 min-h-[120px]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Year Established</Label>
                  <Input 
                    type="number"
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Employee Count</Label>
                  <Select 
                    value={formData.employeeCount}
                    onValueChange={(value) => setFormData({ ...formData, employeeCount: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">1-50</SelectItem>
                      <SelectItem value="200">51-200</SelectItem>
                      <SelectItem value="500">201-500</SelectItem>
                      <SelectItem value="1000">501-1000</SelectItem>
                      <SelectItem value="5000">1000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Select 
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
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
                <div>
                  <Label>City</Label>
                  <Input 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Input 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Products & Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Products & Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Industry</Label>
                <Select 
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.slug} value={industry.slug}>
                        {industry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Main Products</Label>
                <Textarea 
                  value={formData.mainProducts}
                  onChange={(e) => setFormData({ ...formData, mainProducts: e.target.value })}
                  className="mt-2"
                  placeholder="List your main products, separated by commas"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Minimum Order Value (USD)</Label>
                  <Input 
                    type="number"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Annual Output (Units)</Label>
                  <Input 
                    type="number"
                    value={formData.annualOutput}
                    onChange={(e) => setFormData({ ...formData, annualOutput: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Business Type */}
              <div className="pt-4 border-t border-border">
                <Label className="text-base">Business Type</Label>
                <p className="text-sm text-muted-foreground mt-1">Select all that apply to your company</p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Manufacturer</p>
                      <p className="text-sm text-muted-foreground">Direct factory production</p>
                    </div>
                    <Switch 
                      checked={businessTypes.manufacturer} 
                      onCheckedChange={(checked) => setBusinessTypes({...businessTypes, manufacturer: checked})} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Trading Company</p>
                      <p className="text-sm text-muted-foreground">Source from multiple factories</p>
                    </div>
                    <Switch 
                      checked={businessTypes.tradingCompany} 
                      onCheckedChange={(checked) => setBusinessTypes({...businessTypes, tradingCompany: checked})} 
                    />
                  </div>
                </div>
              </div>

              {/* Manufacturing Capabilities */}
              <div className="pt-4 border-t border-border">
                <Label className="text-base">Manufacturing Capabilities</Label>
                <p className="text-sm text-muted-foreground mt-1">Services you offer to buyers</p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">OEM Services</p>
                      <p className="text-sm text-muted-foreground">Original Equipment Manufacturing</p>
                    </div>
                    <Switch checked={oem} onCheckedChange={setOem} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">ODM Services</p>
                      <p className="text-sm text-muted-foreground">Original Design Manufacturing</p>
                    </div>
                    <Switch checked={odm} onCheckedChange={setOdm} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Private Label</p>
                      <p className="text-sm text-muted-foreground">White-label manufacturing services</p>
                    </div>
                    <Switch checked={privateLabelEnabled} onCheckedChange={setPrivateLabelEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Customization</p>
                      <p className="text-sm text-muted-foreground">Custom modifications and specifications</p>
                    </div>
                    <Switch checked={customization} onCheckedChange={setCustomization} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Factory Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Factory Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Factory Size (sqm)</Label>
                  <Input 
                    type="number"
                    value={formData.factorySize}
                    onChange={(e) => setFormData({ ...formData, factorySize: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Production Lines</Label>
                  <Input 
                    type="number"
                    value={formData.productionLines}
                    onChange={(e) => setFormData({ ...formData, productionLines: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label>Factory Photos</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-video rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer hover:border-secondary transition-colors">
                      <div className="text-center">
                        <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                        <p className="mt-1 text-xs text-muted-foreground">Upload</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="gap-1 pr-1">
                    {cert}
                    <button 
                      onClick={() => setCertifications(certifications.filter(c => c !== cert))}
                      className="ml-1 rounded-full p-0.5 hover:bg-background/50"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add certification..."
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    if (newCert.trim()) {
                      setCertifications([...certifications, newCert.trim()])
                      setNewCert("")
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                You can upload certification documents in the Certifications section
              </p>
            </CardContent>
          </Card>

          {/* Export Markets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Export Markets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {exportMarkets.map((market) => (
                  <Badge key={market} variant="outline" className="gap-1 pr-1">
                    {market}
                    <button 
                      onClick={() => setExportMarkets(exportMarkets.filter(m => m !== market))}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add export market..."
                  value={newMarket}
                  onChange={(e) => setNewMarket(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    if (newMarket.trim()) {
                      setExportMarkets([...exportMarkets, newMarket.trim()])
                      setNewMarket("")
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Languages Spoken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {languages.map((lang) => (
                  <Badge key={lang} variant="secondary" className="gap-1 pr-1">
                    {lang}
                    <button 
                      onClick={() => setLanguages(languages.filter(l => l !== lang))}
                      className="ml-1 rounded-full p-0.5 hover:bg-background/50"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add language..."
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    if (newLanguage.trim()) {
                      setLanguages([...languages, newLanguage.trim()])
                      setNewLanguage("")
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Languages your team can communicate in
              </p>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Terms Accepted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {paymentTerms.map((term) => (
                  <Badge key={term} variant="outline" className="gap-1 pr-1">
                    {term}
                    <button 
                      onClick={() => setPaymentTerms(paymentTerms.filter(t => t !== term))}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add payment term..."
                  value={newPaymentTerm}
                  onChange={(e) => setNewPaymentTerm(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    if (newPaymentTerm.trim()) {
                      setPaymentTerms([...paymentTerms, newPaymentTerm.trim()])
                      setNewPaymentTerm("")
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Common options: T/T, L/C, D/P, D/A, PayPal, Western Union
              </p>
            </CardContent>
          </Card>

          {/* Factory Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Factory Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Upload photos of your factory, production lines, and facilities to build trust with buyers
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-video rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer hover:border-secondary transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                      <p className="mt-1 text-xs text-muted-foreground">Upload</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Recommended: High-quality photos showing production areas, equipment, and quality control processes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-muted">
                  <Factory className="h-16 w-16 text-muted-foreground" />
                </div>
                <Button variant="outline" className="mt-4 gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  Recommended: 400x400px, PNG or JPG
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Review Status */}
          <Card>
            <CardHeader>
              <CardTitle>Review Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg bg-secondary/10 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <CheckCircle className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Premium Reviewed</p>
                  <p className="text-sm text-muted-foreground">Valid until Dec 2026</p>
                </div>
              </div>
              <Button variant="link" className="mt-3 h-auto p-0 text-secondary">
                Learn about review levels
              </Button>
            </CardContent>
          </Card>

          {/* Approval Status */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg bg-emerald-100 p-4">
                <CheckCircle className="h-5 w-5 text-emerald-700" />
                <div>
                  <p className="font-medium text-emerald-700">Approved</p>
                  <p className="text-sm text-emerald-600">Your profile is live</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Completeness */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Completeness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                  <span className="text-sm font-medium text-foreground">85%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[85%] rounded-full bg-secondary" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete your profile to attract more buyers
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-muted-foreground">Basic information</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-muted-foreground">Company logo</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-muted-foreground">Certifications</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  <span className="text-muted-foreground">Factory photos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  <span className="text-muted-foreground">Video introduction</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profile Views (30d)</span>
                <span className="font-medium text-foreground">2,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Inquiries (30d)</span>
                <span className="font-medium text-foreground">28</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Response Rate</span>
                <span className="font-medium text-foreground">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                <span className="font-medium text-foreground">2 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
