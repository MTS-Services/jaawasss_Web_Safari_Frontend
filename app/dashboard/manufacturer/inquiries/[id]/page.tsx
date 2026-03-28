"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
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
  ArrowLeft,
  Building2,
  Package,
  Calendar,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Send,
  Clock,
  CheckCircle,
  DollarSign
} from "lucide-react"

const inquiriesData: Record<string, {
  id: string
  buyer: string
  buyerCompany: string
  email: string
  phone: string
  country: string
  product: string
  quantity: string
  targetPrice: string
  deliveryDate: string
  message: string
  date: string
  status: string
}> = {
  "1": {
    id: "1",
    buyer: "John Smith",
    buyerCompany: "Global Retail Inc.",
    email: "john.smith@globalretail.com",
    phone: "+1 555-0123",
    country: "United States",
    product: "TWS Wireless Earbuds Pro",
    quantity: "5,000 units",
    targetPrice: "$15.00 - $18.00 per unit",
    deliveryDate: "Within 45 days",
    message: "We are interested in your TWS Wireless Earbuds Pro for our retail chain. We need Bluetooth 5.3, active noise cancellation, and custom packaging with our branding. Please provide a detailed quotation including shipping to Los Angeles port.",
    date: "2 hours ago",
    status: "New"
  },
  "2": {
    id: "2",
    buyer: "Emma Johnson",
    buyerCompany: "Fashion Forward Ltd.",
    email: "emma@fashionforward.co.uk",
    phone: "+44 20 7946 0958",
    country: "United Kingdom",
    product: "Smart LED Bulbs",
    quantity: "10,000 units",
    targetPrice: "$4.50 - $5.50 per unit",
    deliveryDate: "Within 60 days",
    message: "Looking for smart LED bulbs with WiFi connectivity and app control. Must be compatible with both Alexa and Google Home. Need CE certification for UK/EU market.",
    date: "5 hours ago",
    status: "New"
  },
  "3": {
    id: "3",
    buyer: "Michael Chen",
    buyerCompany: "TechMart USA",
    email: "m.chen@techmart.com",
    phone: "+1 415-555-0199",
    country: "United States",
    product: "10000mAh Power Banks",
    quantity: "3,000 units",
    targetPrice: "$9.00 - $11.00 per unit",
    deliveryDate: "Within 30 days",
    message: "Need power banks with fast charging support (PD 20W). Must include USB-C and USB-A ports. Looking for samples first before placing bulk order.",
    date: "1 day ago",
    status: "Quoted"
  },
  "4": {
    id: "4",
    buyer: "Hans Mueller",
    buyerCompany: "EuroTrade GmbH",
    email: "h.mueller@eurotrade.de",
    phone: "+49 30 12345678",
    country: "Germany",
    product: "TWS Wireless Earbuds",
    quantity: "8,000 units",
    targetPrice: "$12.00 - $15.00 per unit",
    deliveryDate: "Within 60 days",
    message: "We are a distributor looking for high-quality wireless earbuds. Need CE, RoHS certification. Interested in establishing long-term partnership.",
    date: "2 days ago",
    status: "Quoted"
  }
}

export default function InquiryDetailPage() {
  const params = useParams()
  const id = params.id as string
  const inquiry = inquiriesData[id] || inquiriesData["1"]
  
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)
  const [reply, setReply] = useState("")
  const [quoteData, setQuoteData] = useState({
    unitPrice: "",
    moq: "",
    leadTime: "",
    validUntil: "",
    notes: ""
  })

  const statusColors: Record<string, string> = {
    "New": "bg-blue-100 text-blue-700",
    "Quoted": "bg-emerald-100 text-emerald-700",
    "Negotiating": "bg-amber-100 text-amber-700",
    "Closed": "bg-slate-100 text-slate-700"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/manufacturer/inquiries">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-medium text-foreground">
                Inquiry #{inquiry.id}
              </h1>
              <Badge className={statusColors[inquiry.status] || ""}>{inquiry.status}</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              Received {inquiry.date}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Message Buyer
          </Button>
          <Button className="gap-2" onClick={() => setShowQuoteDialog(true)}>
            <FileText className="h-4 w-4" />
            Send Quote
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Request */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{inquiry.product}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{inquiry.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Price</p>
                  <p className="font-medium">{inquiry.targetPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Timeline</p>
                  <p className="font-medium">{inquiry.deliveryDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Buyer Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{inquiry.message}</p>
            </CardContent>
          </Card>

          {/* Reply Section */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Reply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Type your reply to the buyer..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  Send Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Buyer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Buyer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{inquiry.buyerCompany}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p className="font-medium">{inquiry.buyer}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{inquiry.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{inquiry.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{inquiry.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Inquiry received</p>
                    <p className="text-xs text-muted-foreground">{inquiry.date}</p>
                  </div>
                </div>
                {inquiry.status === "Quoted" && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Quote sent</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Quotation</DialogTitle>
            <DialogDescription>
              Provide pricing details for {inquiry.product}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Unit Price (USD)</Label>
                <Input 
                  placeholder="e.g. $15.00"
                  value={quoteData.unitPrice}
                  onChange={(e) => setQuoteData({ ...quoteData, unitPrice: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Minimum Order Qty</Label>
                <Input 
                  placeholder="e.g. 1,000 units"
                  value={quoteData.moq}
                  onChange={(e) => setQuoteData({ ...quoteData, moq: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Lead Time</Label>
                <Input 
                  placeholder="e.g. 30 days"
                  value={quoteData.leadTime}
                  onChange={(e) => setQuoteData({ ...quoteData, leadTime: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Quote Valid Until</Label>
                <Input 
                  type="date"
                  value={quoteData.validUntil}
                  onChange={(e) => setQuoteData({ ...quoteData, validUntil: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Additional Notes</Label>
              <Textarea 
                placeholder="Include any terms, shipping details, or special conditions..."
                value={quoteData.notes}
                onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowQuoteDialog(false)
              // Would send quote here
            }}>
              Send Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
