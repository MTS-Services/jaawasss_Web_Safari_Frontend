"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  FolderPlus,
  Save,
  FileText,
  Star,
  Settings as SettingsIcon,
  Loader2
} from "lucide-react"
import Swal from "sweetalert2"
import {
  getAdminHelpCategories,
  createAdminHelpCategory,
  updateAdminHelpCategory,
  deleteAdminHelpCategory,
  getAdminHelpArticles,
  createAdminHelpArticle,
  updateAdminHelpArticle,
  deleteAdminHelpArticle,
  type HelpCenterCategory,
  type HelpCenterArticle
} from "@/lib/api/admin-help-center"

function showSuccessAlert(message: string) {
  void Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonText: "OK",
    confirmButtonColor: "#3d2e1f",
  })
}

function showErrorAlert(message: string) {
  void Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    confirmButtonText: "OK",
    confirmButtonColor: "#3d2e1f",
  })
}

export default function AdminHelpCenterPage() {
  const [categories, setCategories] = useState<HelpCenterCategory[]>([])
  const [articlesData, setArticlesData] = useState<Record<number, HelpCenterArticle[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadingArticles, setLoadingArticles] = useState<Record<number, boolean>>({})
  
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])

  // Category Dialog State
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<HelpCenterCategory | null>(null)
  const [catName, setCatName] = useState("")
  const [catSlug, setCatSlug] = useState("")
  const [catDescription, setCatDescription] = useState("")

  // Article Dialog State
  const [articleDialogOpen, setArticleDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<HelpCenterArticle | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [artTitle, setArtTitle] = useState("")
  const [artDescription, setArtDescription] = useState("")
  const [artSteps, setArtSteps] = useState<{content: string}[]>([{content: ""}])

  const loadCategories = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    const res = await getAdminHelpCategories(1, 100) // fetch up to 100 for now
    if (res.success) {
      setCategories(res.data || [])
    } else {
      if (!silent) showErrorAlert(res.message || "Failed to load categories")
    }
    if (!silent) setIsLoading(false)
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const fetchArticlesForCategory = async (categoryId: number) => {
    setLoadingArticles(prev => ({...prev, [categoryId]: true}))
    const res = await getAdminHelpArticles(categoryId, 1, 100)
    if (res.success) {
      setArticlesData(prev => ({...prev, [categoryId]: res.data || []}))
    }
    setLoadingArticles(prev => ({...prev, [categoryId]: false}))
  }

  const toggleCategory = async (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(prev => prev.filter(id => id !== categoryId))
    } else {
      setExpandedCategories(prev => [...prev, categoryId])
      if (!articlesData[categoryId]) {
        await fetchArticlesForCategory(categoryId)
      }
    }
  }

  // === Category CRUD ===
  const openCategoryDialog = (cat?: HelpCenterCategory) => {
    if (cat) {
      setEditingCategory(cat)
      setCatName(cat.name)
      setCatSlug(cat.slug)
      setCatDescription(cat.description || "")
    } else {
      setEditingCategory(null)
      setCatName("")
      setCatSlug("")
      setCatDescription("")
    }
    setCategoryDialogOpen(true)
  }

  const saveCategory = async () => {
    if (!catName || !catSlug) {
      showErrorAlert("Name and Slug are required")
      return
    }
    setIsSaving(true)
    const data = { name: catName, slug: catSlug, description: catDescription }
    
    let res;
    if (editingCategory) {
      res = await updateAdminHelpCategory(editingCategory.id, data)
    } else {
      res = await createAdminHelpCategory(data)
    }

    if (res.success) {
      showSuccessAlert(res.message || "Category saved successfully")
      setCategoryDialogOpen(false)
      await loadCategories(true)
    } else {
      showErrorAlert(res.message || "Failed to save category")
    }
    setIsSaving(false)
  }

  const deleteCategory = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    })
    
    if (result.isConfirmed) {
      setIsSaving(true)
      const res = await deleteAdminHelpCategory(id)
      if (res.success) {
        showSuccessAlert(res.message || "Category deleted")
        await loadCategories(true)
      } else {
        showErrorAlert(res.message || "Failed to delete category")
      }
      setIsSaving(false)
    }
  }

  // === Article CRUD ===
  const openArticleDialog = (categoryId: number, art?: HelpCenterArticle) => {
    setSelectedCategoryId(categoryId)
    if (art) {
      setEditingArticle(art)
      setArtTitle(art.title)
      setArtDescription(art.description || "")
      setArtSteps(art.steps && art.steps.length > 0 ? art.steps.map(s => ({content: s.content})) : [{content: ""}])
    } else {
      setEditingArticle(null)
      setArtTitle("")
      setArtDescription("")
      setArtSteps([{content: ""}])
    }
    setArticleDialogOpen(true)
  }

  const handleAddStep = () => setArtSteps([...artSteps, {content: ""}])
  const handleRemoveStep = (idx: number) => {
    const newSteps = [...artSteps]
    newSteps.splice(idx, 1)
    setArtSteps(newSteps)
  }
  const handleStepChange = (idx: number, val: string) => {
    const newSteps = [...artSteps]
    newSteps[idx].content = val
    setArtSteps(newSteps)
  }

  const saveArticle = async () => {
    if (!artTitle || !selectedCategoryId) {
      showErrorAlert("Title is required")
      return
    }
    const cleanSteps = artSteps.filter(s => s.content.trim() !== "")
    
    setIsSaving(true)
    const data = { 
      help_center_category_id: selectedCategoryId, 
      title: artTitle, 
      description: artDescription,
      steps: cleanSteps
    }
    
    let res;
    if (editingArticle) {
      res = await updateAdminHelpArticle(editingArticle.id, data)
    } else {
      res = await createAdminHelpArticle(data)
    }

    if (res.success) {
      showSuccessAlert(res.message || "Article saved successfully")
      setArticleDialogOpen(false)
      await fetchArticlesForCategory(selectedCategoryId)
      if (!expandedCategories.includes(selectedCategoryId)) {
        setExpandedCategories([...expandedCategories, selectedCategoryId])
      }
    } else {
      showErrorAlert(res.message || "Failed to save article")
    }
    setIsSaving(false)
  }

  const deleteArticle = async (categoryId: number, articleId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    })
    
    if (result.isConfirmed) {
      setIsSaving(true)
      const res = await deleteAdminHelpArticle(articleId)
      if (res.success) {
        showSuccessAlert(res.message || "Article deleted")
        await fetchArticlesForCategory(categoryId)
      } else {
        showErrorAlert(res.message || "Failed to delete article")
      }
      setIsSaving(false)
    }
  }


  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50 animate-pulse" />
          <p className="mt-4 text-muted-foreground">Loading Help Center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Help Center Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the content, articles, and settings for the public Help Center page.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/help', '_blank')}>
            View Public Page
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="content" className="gap-2"><FolderPlus className="h-4 w-4"/> Categories & Articles</TabsTrigger>
        </TabsList>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage help categories and their articles</CardDescription>
              </div>
              <Button size="sm" onClick={() => openCategoryDialog()} disabled={isSaving}>
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No categories found.</div>
              ) : (
                categories.map(category => {
                  const isExpanded = expandedCategories.includes(category.id);
                  const articles = articlesData[category.id] || [];
                  const loadingArts = loadingArticles[category.id];

                  return (
                    <div key={category.id} className="rounded-lg border border-border overflow-hidden">
                      <div className="flex items-center gap-3 bg-muted/30 p-4">
                        <button onClick={() => toggleCategory(category.id)} className="flex-1 flex items-center gap-2 text-left">
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          <span className="font-medium">{category.name}</span>
                          <span className="text-xs text-muted-foreground hidden sm:inline-block">({category.slug})</span>
                          {!category.status && <Badge variant="secondary">Disabled</Badge>}
                        </button>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openCategoryDialog(category)} disabled={isSaving}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteCategory(category.id)} disabled={isSaving}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="border-t border-border p-4 bg-background">
                          {loadingArts ? (
                            <div className="py-4 text-center flex justify-center">
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                          ) : articles.length === 0 ? (
                            <div className="py-4 text-center">
                              <p className="text-sm text-muted-foreground">No articles in this category</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {articles.map(article => (
                                <div key={article.id} className="flex items-center justify-between rounded-md border border-border p-3">
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{article.title}</span>
                                      <span className="text-xs text-muted-foreground line-clamp-1">{article.description}</span>
                                    </div>
                                    {!article.status && <Badge variant="secondary" className="text-xs">Disabled</Badge>}
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openArticleDialog(category.id, article)} disabled={isSaving}>
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteArticle(category.id, article.id)} disabled={isSaving}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="mt-4 pt-4 border-t border-border">
                            <Button variant="outline" size="sm" onClick={() => openArticleDialog(category.id)} disabled={isSaving}>
                              <Plus className="mr-2 h-4 w-4" /> Add Article to {category.name}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>Create or modify a help center category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={catName} onChange={e => {
                setCatName(e.target.value)
                if (!editingCategory) {
                  setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
                }
              }} placeholder="e.g. For Buyers" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={catSlug} onChange={e => setCatSlug(e.target.value)} placeholder="e.g. for-buyers" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={catDescription} onChange={e => setCatDescription(e.target.value)} placeholder="Category description..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveCategory} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Article Dialog */}
      <Dialog open={articleDialogOpen} onOpenChange={setArticleDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? "Edit Article" : "Add Article"}</DialogTitle>
            <DialogDescription>Create or modify a help center article.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={artTitle} onChange={e => setArtTitle(e.target.value)} placeholder="Article title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={artDescription} onChange={e => setArtDescription(e.target.value)} placeholder="Short description..." />
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label>Article Steps / Content</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddStep}>
                  <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>
              </div>
              {artSteps.map((step, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="pt-2 text-sm text-muted-foreground font-medium w-6">{idx + 1}.</div>
                  <Textarea 
                    className="flex-1 min-h-[80px]" 
                    value={step.content} 
                    onChange={e => handleStepChange(idx, e.target.value)} 
                    placeholder="Step content..." 
                  />
                  <Button type="button" variant="ghost" size="icon" className="text-destructive mt-1" onClick={() => handleRemoveStep(idx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArticleDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveArticle} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
