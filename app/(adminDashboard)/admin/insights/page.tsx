"use client"

import React, { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api/client"
import { getApiErrorMessage } from "@/lib/api/errors"
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
  Image,
  Save,
  ExternalLink,
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
  featuredImage?: string | null
  featuredImageName?: string | null
  views: number
  createdAt: string
  updatedAt: string
}

const initialCategories = [
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
  const [articles, setArticles] = useState<InsightArticle[]>([]) // Start empty, fetch from server on mount
  const [articlesLoading, setArticlesLoading] = useState(false)
  const [articlesError, setArticlesError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([]) // Start empty, fetch from server on mount
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false)
  const [categoryForm, setCategoryForm] = useState({ name: "", index: -1 })
  const [rawCategories, setRawCategories] = useState<Array<Record<string, any>>>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [featuredImageError, setFeaturedImageError] = useState<string | null>(null)
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5MB
  const [featuredFile, setFeaturedFile] = React.useState<File | null>(null)
  const [isSubmittingArticle, setIsSubmittingArticle] = React.useState(false)
  const { toast } = useToast()

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  function handleFeaturedFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setFeaturedImageError('Please upload a valid image file.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setFeaturedImageError(`Image is too large. Max ${formatBytes(MAX_IMAGE_BYTES)}.`)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setEditForm(prev => ({ ...prev, featuredImage: String(reader.result), featuredImageName: file.name }))
      setFeaturedFile(file)
      setFeaturedImageError(null)
    }
    reader.readAsDataURL(file)
  }

  function removeFeaturedImage() {
    setEditForm(prev => ({ ...prev, featuredImage: null, featuredImageName: undefined }))
    setFeaturedImageError(null)
    setFeaturedFile(null)
  }
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingArticle, setEditingArticle] = useState<InsightArticle | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [previewArticle, setPreviewArticle] = useState<InsightArticle | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  
  const [editForm, setEditForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    featuredImage: null as string | null,
    featuredImageName: undefined as string | undefined
  })
  const [slugEdited, setSlugEdited] = useState(false)
  const [excerptEdited, setExcerptEdited] = useState(false)

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
      status: "published",
      featured: false,
      featuredImage: null,
      featuredImageName: undefined
    })
    setSlugEdited(false)
    setExcerptEdited(false)
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
      featured: article.featured,
      featuredImage: (article as any).featuredImage ?? null,
      featuredImageName: (article as any).featuredImageName ?? undefined
    })
    // if the slug equals generated slug from title we can allow auto-updates until user edits
    setSlugEdited(Boolean(article.slug && article.slug !== generateSlug(article.title)))
    setExcerptEdited(Boolean(article.excerpt && article.excerpt.trim().length > 0))
    setShowEditDialog(true)
  }

  const saveArticle = () => {
    const now = new Date().toISOString().split('T')[0]
    
    if (editingArticle) {
      // Update existing (PUT to backend)
      ;(async () => {
        setIsSubmittingArticle(true)
        const form = new FormData()
        form.append('title', editForm.title)
        form.append('slug', editForm.slug)
        form.append('excerpt', editForm.excerpt)
        form.append('content', editForm.content)
        form.append('author', editForm.author)
        form.append('is_featured', editForm.featured ? '1' : '0')
        form.append('status', editForm.status)

        // find category id if available
        const cat = rawCategories.find(c => String(c.name) === String(editForm.category))
        if (cat && cat.id) {
          form.append('article_category_id', String(cat.id))
        }

        if (featuredFile) {
          form.append('article_image', featuredFile)
        }

        const tags = editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        tags.forEach((t) => form.append('tags[]', t))

        try {
          const res = await apiClient.put(`/admin/articles/${editingArticle.id}`, form)
          const updated = res.data?.data ?? null
          toast({ title: 'Article updated', description: res.data?.message || 'Article saved successfully.' })

          // Update in-memory list with returned data
          setArticles(prev => prev.map(a => 
            a.id === editingArticle.id 
              ? {
                  id: String(updated?.id ?? editingArticle.id),
                  title: updated?.title ?? editForm.title,
                  slug: updated?.slug ?? editForm.slug,
                  excerpt: updated?.excerpt ?? editForm.excerpt,
                  content: updated?.content ?? editForm.content,
                  category: editForm.category,
                  tags: tags,
                  author: updated?.author ?? editForm.author,
                  publishedAt: updated?.published_at ?? (editForm.status === 'published' ? now : null),
                  status: editForm.status,
                  featured: editForm.featured,
                  featuredImage: updated?.image_url ?? editForm.featuredImage ?? null,
                  featuredImageName: updated?.image_url ? updated.image_url.split('/').pop() : editForm.featuredImageName ?? null,
                  views: updated?.views ?? a.views,
                  createdAt: a.createdAt,
                  updatedAt: updated?.updated_at ?? now,
                }
              : a
          ))
          setShowEditDialog(false)
          setFeaturedFile(null)
          setFeaturedImageError(null)
        } catch (err: unknown) {
          toast({ title: 'Failed to save', description: getApiErrorMessage(err, 'Failed to save article.') })
        } finally {
          setIsSubmittingArticle(false)
        }
      })()
    } else {
      // Create new (POST to backend)
      ;(async () => {
        setIsSubmittingArticle(true)
        const form = new FormData()
        form.append('title', editForm.title)
        form.append('slug', editForm.slug)
        form.append('excerpt', editForm.excerpt)
        form.append('content', editForm.content)
        form.append('author', editForm.author)
        form.append('is_featured', editForm.featured ? '1' : '0')
        form.append('status', editForm.status)

        // find category id if available
        const cat = rawCategories.find(c => String(c.name) === String(editForm.category))
        if (cat && cat.id) {
          form.append('article_category_id', String(cat.id))
        }

        if (featuredFile) {
          form.append('article_image', featuredFile)
        }

        const tags = editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        tags.forEach((t) => form.append('tags[]', t))

        try {
          const res = await apiClient.post('/admin/articles/create', form)
          const created = res.data?.data ?? null
          toast({ title: 'Article created', description: res.data?.message || 'Article created successfully.' })

          // Add to in-memory list using returned data when available
          const newArticle: InsightArticle = {
            id: created?.id ? String(created.id) : `article-${Date.now()}`,
            title: created?.title ?? editForm.title,
            slug: created?.slug ?? editForm.slug,
            excerpt: created?.excerpt ?? editForm.excerpt,
            content: created?.content ?? editForm.content,
            category: editForm.category,
            tags: tags,
            author: created?.author ?? editForm.author,
            publishedAt: editForm.status === 'published' ? now : null,
            status: editForm.status,
            featured: editForm.featured,
            featuredImage: created?.article_image ?? editForm.featuredImage ?? null,
            featuredImageName: created?.article_image_name ?? editForm.featuredImageName ?? null,
            views: 0,
            createdAt: created?.created_at ?? now,
            updatedAt: created?.updated_at ?? now,
          }
          setArticles(prev => [newArticle, ...prev])
          setShowEditDialog(false)
        } catch (err: unknown) {
          toast({ title: 'Failed to create', description: getApiErrorMessage(err, 'Failed to create article.' ) })
        } finally {
          setIsSubmittingArticle(false)
        }
      })()
    }
  }

  async function fetchCategories() {
    setCategoriesLoading(true)
    setCategoriesError(null)
    try {
      const res = await apiClient.get("/admin/article/categories")
      const payload = res.data
      const list = Array.isArray(payload?.data) ? payload.data : []
      setRawCategories(list)
      setCategories(list.map((c: any) => String(c.name)))
    } catch (err: unknown) {
      setCategoriesError(getApiErrorMessage(err, "Failed to load categories."))
    } finally {
      setCategoriesLoading(false)
    }
  }

  async function fetchArticles() {
    setArticlesLoading(true)
    setArticlesError(null)
    try {
      const res = await apiClient.get("/admin/articles")
      const payload = res.data
      const list = Array.isArray(payload?.data) ? payload.data : []
      
      const normalized = list.map((article: any) => ({
        id: String(article.id),
        title: String(article.title || ''),
        slug: String(article.slug || ''),
        excerpt: String(article.excerpt || ''),
        content: String(article.content || ''),
        category: article.category?.name ? String(article.category.name) : '',
        tags: Array.isArray(article.tags) ? article.tags.map((t: any) => String(t)) : [],
        author: String(article.author || ''),
        publishedAt: article.published_at ? String(article.published_at) : null,
        status: ['draft', 'published', 'archived'].includes(article.status) ? article.status : 'draft',
        featured: Boolean(article.is_featured),
        views: Number(article.views) || 0,
        createdAt: String(article.created_at || ''),
        updatedAt: String(article.updated_at || ''),
        featuredImage: article.image_url ? String(article.image_url) : null,
        featuredImageName: article.image_url ? article.image_url.split('/').pop() : null,
      }))
      
      setArticles(normalized)
    } catch (err: unknown) {
      setArticlesError(getApiErrorMessage(err, "Failed to load articles."))
    } finally {
      setArticlesLoading(false)
    }
  }

  async function fetchAndPreviewArticle(articleId: string) {
    setPreviewLoading(true)
    try {
      const res = await apiClient.get(`/admin/articles/${articleId}`)
      const article = res.data?.data
      
      const normalized: InsightArticle = {
        id: String(article.id),
        title: String(article.title || ''),
        slug: String(article.slug || ''),
        excerpt: String(article.excerpt || ''),
        content: String(article.content || ''),
        category: article.category?.name ? String(article.category.name) : '',
        tags: Array.isArray(article.tags) ? article.tags.map((t: any) => String(t)) : [],
        author: String(article.author || ''),
        publishedAt: article.published_at ? String(article.published_at) : null,
        status: ['draft', 'published', 'archived'].includes(article.status) ? article.status : 'draft',
        featured: Boolean(article.is_featured),
        views: Number(article.views) || 0,
        createdAt: String(article.created_at || ''),
        updatedAt: String(article.updated_at || ''),
        featuredImage: article.image_url ? String(article.image_url) : null,
        featuredImageName: article.image_url ? article.image_url.split('/').pop() : null,
      }
      
      setPreviewArticle(normalized)
      setShowPreviewDialog(true)
    } catch (err: unknown) {
      toast({ variant: "destructive", title: "Error", description: getApiErrorMessage(err, "Failed to load article preview.") })
    } finally {
      setPreviewLoading(false)
    }
  }

  async function addCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    try {
      const slug = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 100)
      await apiClient.post("/admin/article/categories", { name: trimmed, slug })
      await fetchCategories()
    } catch (err: unknown) {
      setCategoriesError(getApiErrorMessage(err, "Failed to add category."))
    }
  }

  async function updateCategory(index: number, name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    const entry = rawCategories[index]
    if (!entry || !entry.id) {
      setCategoriesError("Category not found for update.")
      return
    }
    try {
      const slug = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 100)
      await apiClient.put(`/admin/article/categories/${entry.id}`, { name: trimmed, slug })
      await fetchCategories()
    } catch (err: unknown) {
      setCategoriesError(getApiErrorMessage(err, "Failed to update category."))
    }
  }

  async function removeCategory(index: number) {
    const entry = rawCategories[index]
    if (!entry || !entry.id) {
      setCategoriesError("Category not found for delete.")
      return
    }
    try {
      await apiClient.delete(`/admin/article/categories/${entry.id}`)
      await fetchCategories()
    } catch (err: unknown) {
      setCategoriesError(getApiErrorMessage(err, "Failed to delete category."))
    }
  }

  React.useEffect(() => {
    if (showCategoriesDialog) {
      fetchCategories()
    }
  }, [showCategoriesDialog])

  // Fetch categories and articles on mount so they populate from server
  React.useEffect(() => {
    fetchCategories()
    fetchArticles()
  }, [])

  // --- Auto-generate helpers for slug and excerpt ---
  function generateSlug(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 100)
  }

  function generateExcerptFromContent(content: string) {
    const text = String(content || '').replace(/!\[[^\]]*\]\([^\)]+\)/g, '') // remove images
      .replace(/\[[^\]]+\]\([^\)]+\)/g, '') // remove links
      .replace(/[#>*`~\-]{1,}/g, '') // remove some markdown chars
      .replace(/\s+/g, ' ').trim()
    if (!text) return ''
    return text.length <= 200 ? text : text.slice(0, 197).trim() + '...'
  }

  // keep slug in sync with title while user hasn't manually edited slug
  React.useEffect(() => {
    if (!slugEdited) {
      setEditForm(prev => ({ ...prev, slug: generateSlug(prev.title) }))
    }
  }, [editForm.title, slugEdited])

  // keep excerpt in sync with content while user hasn't manually edited excerpt
  React.useEffect(() => {
    if (!excerptEdited) {
      setEditForm(prev => ({ ...prev, excerpt: generateExcerptFromContent(prev.content) }))
    }
  }, [editForm.content, excerptEdited])

  function openCategoriesDialog() {
    // Clear previous values so UI shows loading state instead of stale list
    setCategories([])
    setRawCategories([])
    setCategoryForm({ name: "", index: -1 })
    setCategoriesError(null)
    setShowCategoriesDialog(true)
  }

  const deleteArticle = () => {
    if (deletingId) {
      setArticles(prev => prev.filter(a => a.id !== deletingId))
      setShowDeleteConfirm(false)
      setDeletingId(null)
    }
  }

  const publishArticle = (id: string) => {
    const now = new Date().toISOString().split('T')[0]
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, status: "published", publishedAt: now, updatedAt: now } : a
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
              <SelectTrigger className="w-37.5">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => openCategoriesDialog()}>
              Manage Categories
            </Button>
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
                      <DropdownMenuItem onClick={() => fetchAndPreviewArticle(article.id)}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      
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
                  onChange={(e) => {
                    setSlugEdited(true)
                    setEditForm({ ...editForm, slug: e.target.value })
                  }}
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
                  onChange={(e) => {
                    setExcerptEdited(true)
                    setEditForm({ ...editForm, excerpt: e.target.value })
                  }}
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

            <div>
              <Label>Featured Image</Label>
              <div className="mt-2">
                <div
                  className="group relative flex items-center gap-4 rounded border border-dashed border-border p-3 hover:border-primary transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const file = e.dataTransfer?.files && e.dataTransfer.files[0]
                    if (file) handleFeaturedFile(file)
                  }}
                >
                  <input
                    ref={(el) => { fileInputRef.current = el }}
                    id="featured-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0]
                      if (file) handleFeaturedFile(file)
                    }}
                  />

                  {editForm.featuredImage ? (
                    <img src={editForm.featuredImage} alt="preview" className="h-24 w-36 object-cover rounded" />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Image className="h-8 w-8 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">Drop an image here, or</div>
                    </div>
                  )}

                  <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" onClick={() => fileInputRef.current?.click()}>Choose file</Button>
                    {editForm.featuredImage && (
                      <Button size="sm" variant="outline" onClick={() => removeFeaturedImage()}>
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                {featuredImageError && (
                  <div className="mt-2 text-sm text-destructive">{featuredImageError}</div>
                )}
                {editForm.featuredImage && (
                  <div className="mt-2 text-xs text-muted-foreground">{editForm.featuredImageName ?? "Uploaded image"}</div>
                )}
              </div>
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
            <Button onClick={saveArticle} disabled={isSubmittingArticle}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmittingArticle ? (editingArticle ? "Saving..." : "Creating...") : (editingArticle ? "Save Changes" : "Create Article")}
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

      {/* Categories Management Dialog */}
      <Dialog open={showCategoriesDialog} onOpenChange={setShowCategoriesDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Article Categories</DialogTitle>
            <DialogDescription>Add, edit, or remove categories used for insights.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New category name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
              <Button
                onClick={() => {
                  const name = categoryForm.name.trim()
                  if (!name) return
                  if (categoryForm.index >= 0) {
                    updateCategory(categoryForm.index, name)
                  } else {
                    addCategory(name)
                  }
                  setCategoryForm({ name: "", index: -1 })
                }}
              >
                {categoryForm.index >= 0 ? "Save" : "Add"}
              </Button>
            </div>

            <div className="space-y-2">
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-gray-300 animate-spin" />
                  <div className="ml-3 text-sm text-muted-foreground">Loading categories...</div>
                </div>
              ) : categoriesError ? (
                <div className="py-6 text-sm text-destructive">{categoriesError}</div>
              ) : categories.length === 0 ? (
                <div className="py-6 text-sm text-muted-foreground">No categories found.</div>
              ) : (
                categories.map((cat, i) => (
                  <div key={cat} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div>{cat}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCategoryForm({ name: cat, index: i })}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCategory(i)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoriesDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Article Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Article Preview</DialogTitle>
          </DialogHeader>
          
          {previewLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-gray-300 animate-spin" />
              <div className="ml-3 text-sm text-muted-foreground">Loading article...</div>
            </div>
          ) : previewArticle ? (
            <div className="space-y-6">
              {/* Featured Image */}
              {previewArticle.featuredImage && (
                <div className="w-full">
                  <img 
                    src={previewArticle.featuredImage} 
                    alt={previewArticle.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{previewArticle.title}</h2>
                <p className="text-muted-foreground">{previewArticle.excerpt}</p>
              </div>

              {/* Meta Information */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y">
                <div>
                  <p className="text-xs text-muted-foreground">Author</p>
                  <p className="text-sm font-medium">{previewArticle.author}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">{previewArticle.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline" className="capitalize">{previewArticle.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="text-sm font-medium">{previewArticle.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Published</p>
                  <p className="text-sm font-medium">{previewArticle.publishedAt || "Not published"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {previewArticle.tags.length > 0 ? (
                      previewArticle.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Content</h3>
                <div className="bg-muted p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                  {previewArticle.content}
                </div>
              </div>

              {/* Featured Badge */}
              {previewArticle.featured && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800 font-medium">⭐ This is a featured article</p>
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>Close</Button>
            {previewArticle && (
              <Button onClick={() => {
                openEditArticle(previewArticle)
                setShowPreviewDialog(false)
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
