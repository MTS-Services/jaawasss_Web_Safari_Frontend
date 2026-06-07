"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getAllReviewsForAdmin, Review } from "@/lib/data/reviews"
import { suppliers } from "@/lib/data/suppliers"
import {
  Search,
  Star,
  MoreVertical,
  Eye,
  EyeOff,
  Flag,
  Trash2,
  CheckCircle,
  AlertTriangle,
  MessageSquare
} from "lucide-react"

const statusConfig = {
  published: { label: "Published", color: "bg-green-100 text-green-700", icon: CheckCircle },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: AlertTriangle },
  hidden: { label: "Hidden", color: "bg-gray-100 text-gray-700", icon: EyeOff },
  flagged: { label: "Flagged", color: "bg-red-100 text-red-700", icon: Flag }
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(getAllReviewsForAdmin())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null)

  const filteredReviews = reviews.filter(review => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!review.buyerName.toLowerCase().includes(query) &&
          !review.content.toLowerCase().includes(query) &&
          !(review.buyerCompany?.toLowerCase().includes(query))) {
        return false
      }
    }
    if (statusFilter !== "all" && review.status !== statusFilter) {
      return false
    }
    if (ratingFilter !== "all" && review.rating !== parseInt(ratingFilter)) {
      return false
    }
    return true
  })

  const getSupplierName = (supplierId: string) => {
    return suppliers.find(s => s.id === supplierId)?.name || "Unknown Supplier"
  }

  const updateReviewStatus = (reviewId: string, status: Review["status"]) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, status } : r
    ))
  }

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId))
    setDeleteReviewId(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const stats = {
    total: reviews.length,
    published: reviews.filter(r => r.status === "published").length,
    pending: reviews.filter(r => r.status === "pending").length,
    flagged: reviews.filter(r => r.status === "flagged").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-medium text-foreground flex items-center gap-2">
          <Star className="h-6 w-6 text-amber-500" />
          Reviews Management
        </h1>
        <p className="mt-1 text-muted-foreground">
          Moderate and manage supplier reviews
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Flagged</p>
              <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Flag className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews by buyer name, company, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reviewer</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => {
              const StatusIcon = statusConfig[review.status].icon
              return (
                <TableRow key={review.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{review.buyerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {review.buyerCompany}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{getSupplierName(review.supplierId)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{review.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm text-muted-foreground">
                      {review.title || review.content.substring(0, 50)}...
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.date)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[review.status].color}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {statusConfig[review.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedReview(review)
                          setShowViewDialog(true)
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {review.status !== "published" && (
                          <DropdownMenuItem onClick={() => updateReviewStatus(review.id, "published")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {review.status !== "hidden" && (
                          <DropdownMenuItem onClick={() => updateReviewStatus(review.id, "hidden")}>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide
                          </DropdownMenuItem>
                        )}
                        {review.status !== "flagged" && (
                          <DropdownMenuItem onClick={() => updateReviewStatus(review.id, "flagged")}>
                            <Flag className="mr-2 h-4 w-4" />
                            Flag for Review
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => setDeleteReviewId(review.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {filteredReviews.length === 0 && (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-semibold text-foreground">No reviews found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* View Review Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Review #{selectedReview?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reviewer</p>
                  <p className="font-medium">{selectedReview.buyerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedReview.buyerCompany}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{getSupplierName(selectedReview.supplierId)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= selectedReview.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {selectedReview.title && (
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{selectedReview.title}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Review Content</p>
                <p className="mt-1 text-foreground">{selectedReview.content}</p>
              </div>

              {selectedReview.orderDetails && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium text-foreground">Order Information</p>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p>{selectedReview.orderDetails.productCategory}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Order Value</p>
                      <p>{selectedReview.orderDetails.orderValue}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Order Date</p>
                      <p>{formatDate(selectedReview.orderDetails.orderDate)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <Badge className={statusConfig[selectedReview.status].color}>
                  {statusConfig[selectedReview.status].label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Submitted: {formatDate(selectedReview.date)}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            {selectedReview?.status !== "published" && (
              <Button onClick={() => {
                if (selectedReview) {
                  updateReviewStatus(selectedReview.id, "published")
                  setShowViewDialog(false)
                }
              }}>
                Approve Review
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteReviewId} onOpenChange={() => setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The review will be permanently removed from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteReviewId && deleteReview(deleteReviewId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
