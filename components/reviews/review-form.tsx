"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Star, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface ReviewFormProps {
  supplierId: string
  supplierName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (review: ReviewFormData) => void
}

export interface ReviewFormData {
  rating: number
  title: string
  content: string
  productCategory: string
  orderValue: string
}

const orderValueRanges = [
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+"
]

const productCategories = [
  "Electronics",
  "Machinery",
  "Textiles",
  "Furniture",
  "Cosmetics",
  "Auto Parts",
  "Packaging",
  "Raw Materials",
  "Other"
]

export function ReviewForm({ 
  supplierId, 
  supplierName, 
  open, 
  onOpenChange,
  onSubmit 
}: ReviewFormProps) {
  const { user, isAuthenticated } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [orderValue, setOrderValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0 || !content.trim()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (onSubmit) {
      onSubmit({
        rating,
        title,
        content,
        productCategory,
        orderValue
      })
    }
    
    setSubmitted(true)
    setIsSubmitting(false)
    
    // Reset and close after delay
    setTimeout(() => {
      setRating(0)
      setTitle("")
      setContent("")
      setProductCategory("")
      setOrderValue("")
      setSubmitted(false)
      onOpenChange(false)
    }, 2000)
  }

  const isBuyer = user?.role === "buyer"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {supplierName}
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="py-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-semibold text-foreground">Sign in Required</h3>
            <p className="mt-2 text-muted-foreground">
              Please sign in to leave a review for this supplier.
            </p>
            <Button className="mt-4" asChild>
              <a href="/auth/signin">Sign In</a>
            </Button>
          </div>
        ) : !isBuyer ? (
          <div className="py-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-semibold text-foreground">Buyer Account Required</h3>
            <p className="mt-2 text-muted-foreground">
              Only buyers can leave reviews for suppliers.
            </p>
          </div>
        ) : submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Star className="h-6 w-6 text-green-600 fill-green-600" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">Review Submitted!</h3>
            <p className="mt-2 text-muted-foreground">
              Thank you for your feedback. Your review will be published after moderation.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {/* Star Rating */}
              <div>
                <Label className="text-base">Overall Rating *</Label>
                <div className="mt-2 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30 hover:text-amber-200"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating === 5 ? "Excellent" : 
                       rating === 4 ? "Very Good" : 
                       rating === 3 ? "Good" : 
                       rating === 2 ? "Fair" : "Poor"}
                    </span>
                  )}
                </div>
              </div>

              {/* Review Title */}
              <div>
                <Label htmlFor="review-title">Review Title (Optional)</Label>
                <Input
                  id="review-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="mt-2"
                  maxLength={100}
                />
              </div>

              {/* Review Content */}
              <div>
                <Label htmlFor="review-content">Your Review *</Label>
                <Textarea
                  id="review-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share details about your experience with this supplier..."
                  className="mt-2"
                  rows={4}
                  maxLength={1000}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {content.length}/1000 characters
                </p>
              </div>

              {/* Order Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Product Category</Label>
                  <Select value={productCategory} onValueChange={setProductCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Order Value</Label>
                  <Select value={orderValue} onValueChange={setOrderValue}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderValueRanges.map((range) => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={rating === 0 || !content.trim() || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
