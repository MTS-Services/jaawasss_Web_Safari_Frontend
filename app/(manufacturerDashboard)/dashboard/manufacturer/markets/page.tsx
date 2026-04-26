"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { 
  Globe, 
  Plus, 
  Search, 
  TrendingUp,
  Users,
  Package,
  MapPin,
  Check,
  X
} from "lucide-react"
import { countries, getAllRegions, getCountriesByRegion, exportMarketRegions } from "@/lib/data/countries"

const currentMarkets = [
  { region: "North America", countries: ["United States", "Canada", "Mexico"], inquiries: 234, orders: 45 },
  { region: "Western Europe", countries: ["Germany", "France", "United Kingdom", "Netherlands"], inquiries: 189, orders: 32 },
  { region: "Middle East", countries: ["United Arab Emirates", "Saudi Arabia", "Qatar"], inquiries: 156, orders: 28 },
  { region: "Southeast Asia", countries: ["Singapore", "Malaysia", "Thailand"], inquiries: 98, orders: 15 },
]

const suggestedMarkets = [
  { region: "East Asia", reason: "High demand for your product category", potential: "High" },
  { region: "South America", reason: "Growing market with few competitors", potential: "Medium" },
  { region: "Eastern Europe", reason: "Emerging market opportunities", potential: "Medium" },
]

export default function ExportMarketsPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showManageDialog, setShowManageDialog] = useState(false)
  const [managingMarket, setManagingMarket] = useState<typeof currentMarkets[0] | null>(null)
  const [newMarketRegion, setNewMarketRegion] = useState("")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    "United States", "Canada", "Mexico", "Germany", "France", "United Kingdom", 
    "Netherlands", "United Arab Emirates", "Saudi Arabia", "Qatar", "Singapore", 
    "Malaysia", "Thailand"
  ])

  const regions = getAllRegions()
  
  const filteredCountries = selectedRegion 
    ? getCountriesByRegion(selectedRegion).filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : countries.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )

  const toggleCountry = (countryName: string) => {
    setSelectedCountries(prev => 
      prev.includes(countryName) 
        ? prev.filter(c => c !== countryName)
        : [...prev, countryName]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Export Markets</h1>
          <p className="text-muted-foreground">Define your target export regions and countries</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Market
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="md:pt-3">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-secondary/20 p-3">
                <Globe className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{selectedCountries.length}</p>
                <p className="text-sm text-muted-foreground">Active Markets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="md:pt-3">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/20 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">677</p>
                <p className="text-sm text-muted-foreground">Total Inquiries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="md:pt-3">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/20 p-3">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">120</p>
                <p className="text-sm text-muted-foreground">Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="md:pt-3">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-500/20 p-3">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">+23%</p>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Markets */}
      <Card>
        <CardHeader>
          <CardTitle>Active Export Regions</CardTitle>
          <CardDescription>Markets where you are currently receiving inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentMarkets.map((market) => (
              <div key={market.region} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border border-border">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="rounded-lg bg-secondary/20 p-2 shrink-0">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{market.region}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {market.countries.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
                  <div className="flex justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <div className="text-left sm:text-right">
                      <p className="font-medium">{market.inquiries}</p>
                      <p className="text-xs text-muted-foreground">Inquiries</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-medium">{market.orders}</p>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setManagingMarket(market)
                      setShowManageDialog(true)
                    }}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Markets */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Markets</CardTitle>
          <CardDescription>Recommended regions based on your product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {suggestedMarkets.map((market) => (
              <div key={market.region} className="p-4 rounded-lg border border-dashed border-border hover:border-secondary transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{market.region}</p>
                  <Badge variant={market.potential === "High" ? "default" : "secondary"}>
                    {market.potential} Potential
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{market.reason}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setNewMarketRegion(market.region)
                    setShowAddDialog(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Market
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Country Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Target Countries</CardTitle>
          <CardDescription>Choose specific countries where you can export your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search countries..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedRegion === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedRegion(null)}
              >
                All
              </Button>
              {regions.map((region) => (
                <Button 
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-96 overflow-y-auto p-1">
            {filteredCountries.map((country) => (
              <div 
                key={country.code}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedCountries.includes(country.name) 
                    ? "border-secondary bg-secondary/10" 
                    : "border-border hover:bg-muted"
                }`}
                onClick={() => toggleCountry(country.name)}
              >
                <Checkbox 
                  checked={selectedCountries.includes(country.name)}
                  onCheckedChange={() => toggleCountry(country.name)}
                />
                <span className="text-sm">{country.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedCountries.length} countries selected
            </p>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Market Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Export Market</DialogTitle>
            <DialogDescription>
              Select a region to add to your export markets
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Region</Label>
              <Select 
                value={newMarketRegion}
                onValueChange={setNewMarketRegion}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {exportMarketRegions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select Countries</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Choose specific countries within this region
              </p>
              <div className="mt-3 max-h-48 overflow-y-auto space-y-2 rounded-lg border border-border p-3">
                {newMarketRegion && getCountriesByRegion(newMarketRegion).map((country) => (
                  <div 
                    key={country.code}
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() => toggleCountry(country.name)}
                  >
                    <Checkbox 
                      checked={selectedCountries.includes(country.name)}
                      onCheckedChange={() => toggleCountry(country.name)}
                    />
                    <span className="text-sm">{country.name}</span>
                  </div>
                ))}
                {!newMarketRegion && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Select a region first
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false)
              setNewMarketRegion("")
            }}>Cancel</Button>
            <Button onClick={() => {
              setShowAddDialog(false)
              setNewMarketRegion("")
            }}>Add Market</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Market Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage {managingMarket?.region}</DialogTitle>
            <DialogDescription>
              View and manage countries in this export market
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{managingMarket?.inquiries}</p>
                <p className="text-sm text-muted-foreground">Total Inquiries</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold">{managingMarket?.orders}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
            <div>
              <Label>Countries in this market</Label>
              <div className="mt-2 space-y-2">
                {managingMarket?.countries.map((country) => (
                  <div 
                    key={country}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <span>{country}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedCountries(prev => prev.filter(c => c !== country))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManageDialog(false)}>Close</Button>
            <Button variant="destructive">Remove Market</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
