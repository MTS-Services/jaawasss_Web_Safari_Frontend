"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus,
  Search,
  Package,
  Eye,
  Edit,
  MoreVertical,
  TrendingUp,
  Copy,
  Trash2,
  Power,
  ExternalLink
} from "lucide-react"
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
import { Label } from "@/components/ui/label"

const products = [
  { 
    id: "1", 
    name: "TWS Wireless Earbuds Pro", 
    category: "Consumer Electronics",
    price: "$12.50 - $18.00",
    moq: "1,000 pcs",
    views: 1250,
    inquiries: 45,
    status: "Active"
  },
  { 
    id: "2", 
    name: "Smart LED Bulb - WiFi Enabled", 
    category: "LED & Lighting",
    price: "$3.20 - $5.50",
    moq: "500 pcs",
    views: 890,
    inquiries: 32,
    status: "Active"
  },
  { 
    id: "3", 
    name: "10000mAh Power Bank", 
    category: "Consumer Electronics",
    price: "$8.00 - $12.00",
    moq: "500 pcs",
    views: 675,
    inquiries: 28,
    status: "Active"
  },
  { 
    id: "4", 
    name: "Smart Watch Health Pro", 
    category: "Consumer Electronics",
    price: "$22.00 - $35.00",
    moq: "200 pcs",
    views: 520,
    inquiries: 18,
    status: "Active"
  },
  { 
    id: "5", 
    name: "Wireless Charging Pad", 
    category: "Electronic Components",
    price: "$4.50 - $7.00",
    moq: "1,000 pcs",
    views: 345,
    inquiries: 12,
    status: "Draft"
  },
]

interface Product {
  id: string
  name: string
  category: string
  price: string
  moq: string
  views: number
  inquiries: number
  status: string
  description?: string
}

export default function ManufacturerProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [productsList, setProductsList] = useState<Product[]>(products)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    price: "",
    moq: "",
    description: ""
  })

  const filteredProducts = productsList.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter && statusFilter !== "all" && product.status !== statusFilter) {
      return false
    }
    return true
  })

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setEditFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      moq: product.moq,
      description: product.description || ""
    })
    setShowEditDialog(true)
  }

  const saveProductChanges = () => {
    if (editingProduct) {
      setProductsList(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...editFormData }
          : p
      ))
      setShowEditDialog(false)
      setEditingProduct(null)
    }
  }

  const duplicateProduct = (product: Product) => {
    const newProduct = {
      ...product,
      id: `${Date.now()}`,
      name: `${product.name} (Copy)`,
      views: 0,
      inquiries: 0,
      status: "Draft"
    }
    setProductsList(prev => [newProduct, ...prev])
  }

  const toggleProductStatus = (productId: string) => {
    setProductsList(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, status: p.status === "Active" ? "Draft" : "Active" }
        : p
    ))
  }

  const deleteProduct = (productId: string) => {
    setProductsList(prev => prev.filter(p => p.id !== productId))
    setDeletingProductId(null)
  }

  const openViewDialog = (product: Product) => {
    setViewingProduct(product)
    setShowViewDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Products</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/dashboard/manufacturer/products/new">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-foreground">{productsList.length}</div>
          <p className="text-sm text-muted-foreground">Total Products</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-emerald-600">{productsList.filter(p => p.status === "Active").length}</div>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-foreground">
            {productsList.reduce((acc, p) => acc + p.views, 0).toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">Total Views</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-2xl font-bold text-foreground">
            {productsList.reduce((acc, p) => acc + p.inquiries, 0)}
          </div>
          <p className="text-sm text-muted-foreground">Total Inquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table (desktop) + Cards (mobile) */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Desktop table - visible on md+ */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-sm">
                <th className="px-5 py-3 font-medium text-muted-foreground">Product</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Price Range</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">MOQ</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Views</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Inquiries</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground">{product.price}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{product.moq}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      {product.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      {product.inquiries}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge 
                      variant={product.status === "Active" ? "default" : "secondary"}
                      className={product.status === "Active" ? "bg-emerald-100 text-emerald-700" : ""}
                    >
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openViewDialog(product)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateProduct(product)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleProductStatus(product.id)}>
                            <Power className="mr-2 h-4 w-4" />
                            {product.status === "Active" ? "Set as Draft" : "Set as Active"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletingProductId(product.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards - visible below md */}
        <div className="md:hidden divide-y divide-border">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Package className="h-6 w-6 text-muted-foreground/50" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{product.category}</p>
                    </div>
                    <div className="text-sm text-foreground ml-2">{product.price}</div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <div>{product.moq}</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{product.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{product.inquiries}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <Badge 
                        variant={product.status === "Active" ? "default" : "secondary"}
                        className={product.status === "Active" ? "bg-emerald-100 text-emerald-700" : ""}
                      >
                        {product.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openViewDialog(product)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Product
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateProduct(product)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleProductStatus(product.id)}>
                            <Power className="mr-2 h-4 w-4" />
                            {product.status === "Active" ? "Set as Draft" : "Set as Active"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletingProductId(product.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-semibold text-foreground">No products found</h3>
            <p className="mt-2 text-muted-foreground">
              {searchQuery || statusFilter ? "Try adjusting your filters" : "Add your first product to get started"}
            </p>
            {!searchQuery && !statusFilter && (
              <Button className="mt-4 gap-2" asChild>
                <Link href="/dashboard/manufacturer/products/new">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={editFormData.category}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price Range</Label>
                <Input
                  id="edit-price"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  className="mt-2"
                  placeholder="$10.00 - $15.00"
                />
              </div>
              <div>
                <Label htmlFor="edit-moq">MOQ</Label>
                <Input
                  id="edit-moq"
                  value={editFormData.moq}
                  onChange={(e) => setEditFormData({ ...editFormData, moq: e.target.value })}
                  className="mt-2"
                  placeholder="500 pcs"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="mt-2"
                rows={3}
                placeholder="Brief product description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveProductChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingProductId && deleteProduct(deletingProductId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Product Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Preview</DialogTitle>
            <DialogDescription>
              How this product appears to buyers
            </DialogDescription>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted">
                  <Package className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{viewingProduct.name}</h3>
                    <Badge 
                      variant={viewingProduct.status === "Active" ? "default" : "secondary"}
                      className={viewingProduct.status === "Active" ? "bg-emerald-100 text-emerald-700" : ""}
                    >
                      {viewingProduct.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{viewingProduct.category}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price Range</p>
                  <p className="font-semibold">{viewingProduct.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Order</p>
                  <p className="font-semibold">{viewingProduct.moq}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="font-semibold">{viewingProduct.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inquiries</p>
                  <p className="font-semibold">{viewingProduct.inquiries}</p>
                </div>
              </div>

              {viewingProduct.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-foreground">{viewingProduct.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowViewDialog(false)
              if (viewingProduct) openEditDialog(viewingProduct)
            }}>
              Edit Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
