"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical,
  Eye,
  Calendar,
  FileText,
  Tag,
  Save,
  ExternalLink,
  Clock,
  User
} from "lucide-react"

interface InsightArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  publishedAt: string | null
  status: "draft" | "published" | "archived"
  featured: boolean
  views: number
  createdAt: string
  updatedAt: string
}

const categories = [
  "Industry News",
  "Sourcing Tips",
  "Market Analysis",
  "Success Stories",
  "How-to Guides",
  "Trade Shows",
  "Supplier Spotlights",
  "Compliance & Regulations"
]

const initialArticles: InsightArticle[] = [
  {
    id: "1",
    title: "Top 10 Tips for Finding Reliable Manufacturers",
    slug: "top-10-tips-finding-reliable-manufacturers",
    excerpt: "Learn the essential strategies for identifying and vetting trustworthy manufacturing partners.",
    content: "Finding reliable manufacturers is crucial for business success...",
    category: "Sourcing Tips",
    tags: ["sourcing", "manufacturers", "review"],
    author: "Editorial Team",
    publishedAt: "2024-01-15",
    status: "published",
    featured: true,
    views: 2450,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Understanding MOQ: A Buyer's Guide",
    slug: "understanding-moq-buyers-guide",
    excerpt: "Everything you need to know about Minimum Order Quantities and how to negotiate them.",
    content: "Minimum Order Quantity (MOQ) is a critical factor...",
    category: "How-to Guides",
    tags: ["MOQ", "negotiation", "buying"],
    author: "Editorial Team",
    publishedAt: "2024-01-20",
    status: "published",
    featured: false,
    views: 1820,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-20"
  },
  {
    id: "3",
    title: "2024 Manufacturing Trends in Asia",
    slug: "2024-manufacturing-trends-asia",
    excerpt: "An in-depth analysis of the latest manufacturing trends across Asian markets.",
    content: "The manufacturing landscape in Asia continues to evolve...",
    category: "Market Analysis",
    tags: ["trends", "asia", "market"],
    author: "Research Team",
    publishedAt: null,
    status: "draft",
    featured: false,
    views: 0,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05"
  },
  {
    id: "4",
    title: "How TechMart Found Their Perfect Supplier",
    slug: "techmart-success-story",
    excerpt: "A case study of how TechMart used SourceNest to find their ideal manufacturing partner.",
    content: "When TechMart first started looking for a supplier...",
    category: "Success Stories",
    tags: ["case study", "success", "electronics"],
    author: "Marketing Team",
    publishedAt: "2024-01-25",
    status: "published",
    featured: true,
    views: 3200,
    createdAt: "2024-01-22",
    updatedAt: "2024-01-25"
  }
]

export default function AdminInsightsPage() {
  const [articles, setArticles] = useState<InsightArticle[]>(initialArticles)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingArticle, setEditingArticle] = useState<InsightArticle | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const [editForm, setEditForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false
  })

  const filteredArticles = articles.filter(article => {
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter !== "all" && article.status !== statusFilter) {
      return false
    }
    if (categoryFilter !== "all" && article.category !== categoryFilter) {
      return false
    }
    return true
  })

  const openNewArticle = () => {
    setEditingArticle(null)
    setEditForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      tags: "",
      author: "Editorial Team",
      status: "draft",
      featured: false
    })
    setShowEditDialog(true)
  }

  const openEditArticle = (article: InsightArticle) => {
    setEditingArticle(article)
    setEditForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags.join(", "),
      author: article.author,
      status: article.status,
      featured: article.featured
    })
    setShowEditDialog(true)
  }

  const saveArticle = () => {
    const now = new Date().toISOString().split('T')[0]
    
    if (editingArticle) {
      // Update existing
      setArticles(prev => prev.map(a => 
        a.id === editingArticle.id 
          ? {
              ...a,
              ...editForm,
              tags: editForm.tags.split(",").map(t => t.trim()).filter(Boolean),
              publishedAt: editForm.status === "published" && !a.publishedAt ? now : a.publishedAt,
              updatedAt: now
            }
          : a
      ))
    } else {
      // Create new
      const newArticle: InsightArticle = {
        id: `article-${Date.now()}`,
        title: editForm.title,
        slug: editForm.slug || editForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        excerpt: editForm.excerpt,
        content: editForm.content,
        category: editForm.category,
        tags: editForm.tags.split(",").map(t => t.trim()).filter(Boolean),
        author: editForm.author,
        publishedAt: editForm.status === "published" ? now : null,
        status: editForm.status,
        featured: editForm.featured,
        views: 0,
        createdAt: now,
        updatedAt: now
      }
      setArticles(prev => [newArticle, ...prev])
    }
    setShowEditDialog(false)
  }

  const deleteArticle = () => {
    if (deletingId) {
      setArticles(prev => prev.filter(a => a.id !== deletingId))
      setShowDeleteConfirm(false)
      setDeletingId(null)
    }
  }

  const toggleFeatured = (id: string) => {
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, featured: !a.featured } : a
    ))
  }

  const publishArticle = (id: string) => {
    const now = new Date().toISOString().split('T')[0]
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, status: "published", publishedAt: now, updatedAt: now } : a
    ))
  }

  const unpublishArticle = (id: string) => {
    const now = new Date().toISOString().split('T')[0]
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, status: "draft", updatedAt: now } : a
    ))
  }

  const statusColors = {
    draft: "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
    archived: "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Insights Management</h1>
          <p className="text-muted-foreground">Manage articles, guides, and resources</p>
        </div>
        <Button onClick={openNewArticle}>
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-sm text-muted-foreground">Total Articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-600">
              {articles.filter(a => a.status === "published").length}
            </div>
            <p className="text-sm text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {articles.filter(a => a.status === "draft").length}
            </div>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {articles.reduce((acc, a) => acc + a.views, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>
            {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div 
                key={article.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-foreground truncate">
                      {article.title}
                    </h3>
                    <Badge className={statusColors[article.status]}>
                      {article.status}
                    </Badge>
                    {article.featured && (
                      <Badge variant="outline" className="border-primary text-primary">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {article.excerpt}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.publishedAt || article.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditArticle(article)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditArticle(article)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleFeatured(article.id)}>
                        <Tag className="mr-2 h-4 w-4" />
                        {article.featured ? "Remove Featured" : "Set Featured"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {article.status === "draft" ? (
                        <DropdownMenuItem onClick={() => publishArticle(article.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      ) : article.status === "published" ? (
                        <DropdownMenuItem onClick={() => unpublishArticle(article.id)}>
                          <Clock className="mr-2 h-4 w-4" />
                          Unpublish
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          setDeletingId(article.id)
                          setShowDeleteConfirm(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredArticles.length === 0 && (
              <div className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold text-foreground">No articles found</h3>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first article to get started"
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "Edit Article" : "Create New Article"}
            </DialogTitle>
            <DialogDescription>
              {editingArticle ? "Update article content and settings" : "Create a new insight article"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Title</Label>
                <Input 
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="mt-2"
                  placeholder="Article title"
                />
              </div>
              <div>
                <Label>URL Slug</Label>
                <Input 
                  value={editForm.slug}
                  onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                  className="mt-2"
                  placeholder="article-url-slug"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select 
                  value={editForm.category}
                  onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Excerpt</Label>
              <Textarea 
                value={editForm.excerpt}
                onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                className="mt-2"
                rows={2}
                placeholder="Brief summary of the article"
              />
            </div>

            <div>
              <Label>Content</Label>
              <Textarea 
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                className="mt-2"
                rows={10}
                placeholder="Full article content (supports Markdown)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tags (comma separated)</Label>
                <Input 
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  className="mt-2"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div>
                <Label>Author</Label>
                <Input 
                  value={editForm.author}
                  onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                  className="mt-2"
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select 
                  value={editForm.status}
                  onValueChange={(value: "draft" | "published" | "archived") => 
                    setEditForm({ ...editForm, status: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={editForm.featured}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, featured: checked })}
                  />
                  <Label>Featured Article</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveArticle}>
              <Save className="mr-2 h-4 w-4" />
              {editingArticle ? "Save Changes" : "Create Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the article.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteArticle}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
