"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  DollarSign,
  Sparkles,
  Award,
  Truck,
  CreditCard,
  Star,
  Building2,
  FileText,
  Download,
  Eye,
  MessageSquare,
  Image as ImageIcon,
  File,
  ExternalLink,
  ThumbsUp,
  BarChart3
} from "lucide-react"

// RFQ Data - This would normally come from an API
const rfqsData: Record<string, {
  id: string
  product: string
  quantity: string
  targetPrice: string
  deliveryDate: string
  specs: {
    material?: string
    packaging?: string
    certifications?: string[]
    privateLabel?: boolean
    additionalSpecs?: string
  }
  status: string
  date: string
  source: string
  offers: Array<{
    id: string
    supplier: string
    supplierRating: number
    supplierCountry: string
    supplierVerified: boolean
    unitPrice: string
    moq: string
    leadTime: string
    shippingTerms: string
    paymentTerms: string
    packagingDetails: string
    certifications: string[]
    sampleCost: string
    sampleLeadTime: string
    validUntil: string
    notes: string
    images: { name: string; url: string }[]
    files: { name: string; type: string; url: string }[]
    submittedAt: string
  }>
}> = {
  "RFQ-001": {
    id: "RFQ-001",
    product: "TWS Wireless Earbuds Pro",
    quantity: "5,000 units",
    targetPrice: "$12.00 - $15.00 per unit",
    deliveryDate: "Within 30 days",
    specs: {
      material: "ABS Plastic + Metal",
      packaging: "Retail box with accessories",
      certifications: ["FCC", "CE"],
      privateLabel: true,
      additionalSpecs: "Bluetooth 5.3, ANC, 6-hour battery life"
    },
    status: "Quoted",
    date: "Mar 12, 2026",
    source: "AI Sourcing",
    offers: [
      {
        id: "offer-1",
        supplier: "TechVision Electronics",
        supplierRating: 4.8,
        supplierCountry: "China",
        supplierVerified: true,
        unitPrice: "$14.50",
        moq: "1,000 units",
        leadTime: "25 days",
        shippingTerms: "FOB",
        paymentTerms: "30% Deposit, 70% Before Shipment",
        packagingDetails: "Premium retail box with magnetic closure, includes USB-C cable, ear tips (S/M/L), user manual. Custom branding available.",
        certifications: ["ISO 9001", "FCC", "CE", "RoHS"],
        sampleCost: "$45 (includes shipping)",
        sampleLeadTime: "5 days",
        validUntil: "2026-04-15",
        notes: "We offer volume discounts: 5,000+ units at $13.80, 10,000+ units at $13.20. Free samples for orders over 3,000 units.",
        images: [
          { name: "Product Front", url: "/placeholder.svg?height=200&width=200" },
          { name: "Product Side", url: "/placeholder.svg?height=200&width=200" },
          { name: "Packaging", url: "/placeholder.svg?height=200&width=200" }
        ],
        files: [
          { name: "Product Specification Sheet.pdf", type: "PDF", url: "#" },
          { name: "FCC Certificate.pdf", type: "PDF", url: "#" },
          { name: "Price List 2026.xlsx", type: "Excel", url: "#" }
        ],
        submittedAt: "Mar 13, 2026"
      },
      {
        id: "offer-2",
        supplier: "AudioMax Technology",
        supplierRating: 4.5,
        supplierCountry: "China",
        supplierVerified: true,
        unitPrice: "$13.20",
        moq: "2,000 units",
        leadTime: "30 days",
        shippingTerms: "FOB",
        paymentTerms: "50% Deposit, 50% Before Shipment",
        packagingDetails: "Standard retail box with sleeve, includes cable and ear tips. White label ready.",
        certifications: ["ISO 9001", "CE", "FCC"],
        sampleCost: "$60 (refundable with order)",
        sampleLeadTime: "7 days",
        validUntil: "2026-04-10",
        notes: "We specialize in TWS earbuds with 5 years experience. Can customize sound profile.",
        images: [
          { name: "Product View", url: "/placeholder.svg?height=200&width=200" },
          { name: "Case Open", url: "/placeholder.svg?height=200&width=200" }
        ],
        files: [
          { name: "Company Profile.pdf", type: "PDF", url: "#" },
          { name: "CE Certificate.pdf", type: "PDF", url: "#" }
        ],
        submittedAt: "Mar 14, 2026"
      },
      {
        id: "offer-3",
        supplier: "SoundWave Manufacturing",
        supplierRating: 4.2,
        supplierCountry: "Vietnam",
        supplierVerified: false,
        unitPrice: "$12.80",
        moq: "3,000 units",
        leadTime: "35 days",
        shippingTerms: "CIF",
        paymentTerms: "30% Deposit, 70% Before Shipment",
        packagingDetails: "Eco-friendly packaging option available. Standard or custom box.",
        certifications: ["CE", "FCC"],
        sampleCost: "$35",
        sampleLeadTime: "10 days",
        validUntil: "2026-04-20",
        notes: "New to export but competitive pricing. Factory audit available.",
        images: [
          { name: "Sample Product", url: "/placeholder.svg?height=200&width=200" }
        ],
        files: [
          { name: "Quotation.pdf", type: "PDF", url: "#" }
        ],
        submittedAt: "Mar 15, 2026"
      }
    ]
  },
  "RFQ-002": {
    id: "RFQ-002",
    product: "Organic Cotton Jersey Fabric",
    quantity: "2,000 meters",
    targetPrice: "$8.00 - $12.00 per meter",
    deliveryDate: "Within 45 days",
    specs: {
      material: "100% Organic Cotton",
      packaging: "Rolled on cardboard tubes",
      certifications: ["GOTS", "Oeko-Tex"],
      privateLabel: false,
      additionalSpecs: "180 GSM, various colors needed"
    },
    status: "Pending",
    date: "Mar 10, 2026",
    source: "Direct",
    offers: []
  }
}

export default function BuyerRFQDetailPage() {
  const params = useParams()
  const id = params.id as string
  const rfq = rfqsData[id] || rfqsData["RFQ-001"]
  
  const [selectedOffer, setSelectedOffer] = useState<typeof rfq.offers[0] | null>(null)
  const [showOfferDialog, setShowOfferDialog] = useState(false)

  const viewOfferDetails = (offer: typeof rfq.offers[0]) => {
    setSelectedOffer(offer)
    setShowOfferDialog(true)
  }

  const statusColors: Record<string, string> = {
    "Quoted": "bg-emerald-100 text-emerald-700",
    "Pending": "bg-amber-100 text-amber-700",
    "In Review": "bg-blue-100 text-blue-700",
    "Expired": "bg-gray-100 text-gray-700"
  }

  // Sort offers by price for comparison
  const sortedOffers = [...rfq.offers].sort((a, b) => {
    const priceA = parseFloat(a.unitPrice.replace(/[^0-9.]/g, ''))
    const priceB = parseFloat(b.unitPrice.replace(/[^0-9.]/g, ''))
    return priceA - priceB
  })

  const lowestPrice = sortedOffers[0]?.unitPrice
  const bestRated = [...rfq.offers].sort((a, b) => b.supplierRating - a.supplierRating)[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/buyer/rfqs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-medium text-foreground">
                {rfq.id}
              </h1>
              <Badge className={statusColors[rfq.status] || ""}>{rfq.status}</Badge>
              {rfq.source === "AI Sourcing" && (
                <Badge variant="outline" className="gap-1 border-secondary/30 text-secondary">
                  <Sparkles className="h-3 w-3" />
                  AI Sourced
                </Badge>
              )}
            </div>
            <p className="mt-1 text-muted-foreground">
              Submitted on {rfq.date}
            </p>
          </div>
        </div>
      </div>

      {/* Request Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Your Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Product</p>
              <p className="font-semibold text-foreground">{rfq.product}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="font-semibold text-foreground">{rfq.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target Price</p>
              <p className="font-semibold text-foreground">{rfq.targetPrice}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivery</p>
              <p className="font-semibold text-foreground">{rfq.deliveryDate}</p>
            </div>
          </div>
          {rfq.specs.certifications && rfq.specs.certifications.length > 0 && (
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
              {rfq.specs.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="gap-1">
                  <Award className="h-3 w-3" />
                  {cert}
                </Badge>
              ))}
              {rfq.specs.privateLabel && (
                <Badge variant="secondary">Private Label</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offers Section */}
      {rfq.offers.length > 0 ? (
        <Tabs defaultValue="comparison" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-foreground">
              Supplier Offers ({rfq.offers.length})
            </h2>
            <TabsList>
              <TabsTrigger value="comparison" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Compare
              </TabsTrigger>
              <TabsTrigger value="cards" className="gap-2">
                <FileText className="h-4 w-4" />
                Details
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Comparison Table View */}
          <TabsContent value="comparison">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="min-w-[180px]">Supplier</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>MOQ</TableHead>
                        <TableHead>Lead Time</TableHead>
                        <TableHead>Shipping</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Certifications</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Attachments</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOffers.map((offer) => (
                        <TableRow key={offer.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground">{offer.supplier}</p>
                                  {offer.supplierVerified && (
                                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-secondary text-secondary">
                                      <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {offer.supplierCountry}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-foreground">{offer.unitPrice}</span>
                              {offer.unitPrice === lowestPrice && (
                                <Badge className="text-[10px] px-1 py-0 h-4 bg-emerald-100 text-emerald-700">Lowest</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">{offer.moq}</TableCell>
                          <TableCell className="text-foreground">{offer.leadTime}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{offer.shippingTerms}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate" title={offer.paymentTerms}>
                            {offer.paymentTerms}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {offer.certifications.slice(0, 2).map((cert) => (
                                <Badge key={cert} variant="outline" className="text-[10px] px-1 py-0">
                                  {cert}
                                </Badge>
                              ))}
                              {offer.certifications.length > 2 && (
                                <Badge variant="outline" className="text-[10px] px-1 py-0">
                                  +{offer.certifications.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-medium">{offer.supplierRating}</span>
                              {offer.id === bestRated?.id && (
                                <Badge className="text-[10px] px-1 py-0 h-4 bg-amber-100 text-amber-700 ml-1">Top</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="flex items-center gap-1 text-xs">
                                <ImageIcon className="h-3 w-3" />
                                {offer.images.length}
                              </span>
                              <span className="flex items-center gap-1 text-xs">
                                <File className="h-3 w-3" />
                                {offer.files.length}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2"
                                onClick={() => viewOfferDetails(offer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                                <Link href="/dashboard/buyer/messages">
                                  <MessageSquare className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Card Details View */}
          <TabsContent value="cards">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rfq.offers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {offer.supplier}
                          {offer.supplierVerified && (
                            <CheckCircle className="h-4 w-4 text-secondary" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {offer.supplierCountry}
                          <span className="mx-1">•</span>
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {offer.supplierRating}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{offer.unitPrice}</p>
                        <p className="text-xs text-muted-foreground">per unit</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Key Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">MOQ</p>
                          <p className="font-medium">{offer.moq}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Lead Time</p>
                          <p className="font-medium">{offer.leadTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Shipping</p>
                          <p className="font-medium">{offer.shippingTerms}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Payment</p>
                          <p className="font-medium text-xs">{offer.paymentTerms.split(',')[0]}</p>
                        </div>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="flex flex-wrap gap-1">
                      {offer.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>

                    {/* Attachments Preview */}
                    {(offer.images.length > 0 || offer.files.length > 0) && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground border-t pt-3">
                        {offer.images.length > 0 && (
                          <span className="flex items-center gap-1">
                            <ImageIcon className="h-4 w-4" />
                            {offer.images.length} images
                          </span>
                        )}
                        {offer.files.length > 0 && (
                          <span className="flex items-center gap-1">
                            <File className="h-4 w-4" />
                            {offer.files.length} files
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 gap-2" 
                        size="sm"
                        onClick={() => viewOfferDetails(offer)}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <Link href="/dashboard/buyer/messages">
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-semibold text-foreground">Waiting for Offers</h3>
            <p className="mt-2 text-muted-foreground">
              Your request has been sent to suppliers. You will be notified when offers arrive.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Offer Detail Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOffer && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      {selectedOffer.supplier}
                      {selectedOffer.supplierVerified && (
                        <Badge variant="outline" className="gap-1 border-secondary text-secondary">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3" />
                      {selectedOffer.supplierCountry}
                      <span className="mx-1">•</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {selectedOffer.supplierRating} rating
                      <span className="mx-1">•</span>
                      Submitted {selectedOffer.submittedAt}
                    </DialogDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-foreground">{selectedOffer.unitPrice}</p>
                    <p className="text-sm text-muted-foreground">per unit</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Pricing & Terms Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Unit Price
                    </p>
                    <p className="font-semibold text-foreground mt-1">{selectedOffer.unitPrice}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      MOQ
                    </p>
                    <p className="font-semibold text-foreground mt-1">{selectedOffer.moq}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Lead Time
                    </p>
                    <p className="font-semibold text-foreground mt-1">{selectedOffer.leadTime}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Valid Until
                    </p>
                    <p className="font-semibold text-foreground mt-1">{selectedOffer.validUntil}</p>
                  </div>
                </div>

                <Separator />

                {/* Shipping & Payment */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Shipping Terms
                    </h4>
                    <Badge variant="outline" className="text-sm">{selectedOffer.shippingTerms}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Terms
                    </h4>
                    <p className="text-sm text-foreground">{selectedOffer.paymentTerms}</p>
                  </div>
                </div>

                <Separator />

                {/* Packaging Details */}
                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Packaging Details
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">{selectedOffer.packagingDetails}</p>
                </div>

                <Separator />

                {/* Certifications */}
                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffer.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Sample Options */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Sample Cost</h4>
                    <p className="text-sm text-foreground">{selectedOffer.sampleCost}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Sample Lead Time</h4>
                    <p className="text-sm text-foreground">{selectedOffer.sampleLeadTime}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedOffer.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Supplier Notes</h4>
                      <div className="p-3 rounded-lg bg-muted/50 text-sm text-foreground leading-relaxed">
                        {selectedOffer.notes}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Product Images */}
                {selectedOffer.images.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Product Images
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedOffer.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="w-24 h-24 rounded-lg border border-border overflow-hidden bg-muted">
                            <img 
                              src={img.url} 
                              alt={img.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1 text-center truncate w-24">{img.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedOffer.files.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <File className="h-4 w-4" />
                      Documents
                    </h4>
                    <div className="space-y-2">
                      {selectedOffer.files.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <File className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{file.name}</p>
                              <Badge variant="outline" className="text-[10px] mt-1">{file.type}</Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Accept Offer
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <Link href="/dashboard/buyer/messages">
                      <MessageSquare className="h-4 w-4" />
                      Message Supplier
                    </Link>
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Profile
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
