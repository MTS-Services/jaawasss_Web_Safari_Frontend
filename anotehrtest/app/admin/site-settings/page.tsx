"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Settings,
  Save,
  Plus,
  X,
  GripVertical,
  ExternalLink,
  FileText,
  Share2,
  Info,
  HelpCircle,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  Music2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  ChevronRight,
  Pencil,
  Users,
  Factory,
  CreditCard,
  Shield,
  BookOpen
} from "lucide-react"
import {
  defaultSocialLinks,
  defaultLegalPages,
  defaultAboutPage,
  type SocialMediaLink,
  type LegalPage,
  type AboutPageData
} from "@/lib/data/site-settings"
import {
  defaultHelpCenterData,
  type HelpCenterData,
  type HelpCategory,
  type HelpArticle,
  type PopularArticle
} from "@/lib/data/help-center"

const iconOptions = [
  { value: "Linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "Twitter", label: "X (Twitter)", icon: Twitter },
  { value: "Facebook", label: "Facebook", icon: Facebook },
  { value: "Youtube", label: "YouTube", icon: Youtube },
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "Music2", label: "TikTok", icon: Music2 },
]

const categoryIconOptions = [
  { value: "Users", label: "Users", icon: Users },
  { value: "Factory", label: "Factory", icon: Factory },
  { value: "CreditCard", label: "Credit Card", icon: CreditCard },
  { value: "Shield", label: "Shield", icon: Shield },
  { value: "Settings", label: "Settings", icon: Settings },
  { value: "HelpCircle", label: "Help Circle", icon: HelpCircle },
  { value: "BookOpen", label: "Book", icon: BookOpen },
]

const getIconComponent = (iconName: string) => {
  const option = iconOptions.find(o => o.value === iconName)
  return option?.icon || Share2
}

const getCategoryIconComponent = (iconName: string) => {
  const option = categoryIconOptions.find(o => o.value === iconName)
  return option?.icon || HelpCircle
}

export default function SiteSettingsPage() {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(defaultSocialLinks)
  const [legalPages, setLegalPages] = useState<LegalPage[]>(defaultLegalPages)
  const [aboutPage, setAboutPage] = useState<AboutPageData>(defaultAboutPage)
  const [helpCenter, setHelpCenter] = useState<HelpCenterData>(defaultHelpCenterData)
  const [selectedLegalPage, setSelectedLegalPage] = useState<string>("privacy")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(helpCenter.categories[0]?.id || null)
  const [selectedArticle, setSelectedArticle] = useState<{ categoryId: string; articleId: string } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newSocialPlatform, setNewSocialPlatform] = useState("")
  const [newSocialUrl, setNewSocialUrl] = useState("")
  const [newSocialIcon, setNewSocialIcon] = useState("Linkedin")
  
  // New category/article dialog state
  const [newCategoryDialog, setNewCategoryDialog] = useState(false)
  const [newArticleDialog, setNewArticleDialog] = useState(false)
  const [newCategoryData, setNewCategoryData] = useState({ title: "", description: "", icon: "Users" })
  const [newArticleData, setNewArticleData] = useState({ title: "", content: "" })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  // Social Links functions
  const toggleSocialLink = (id: string) => {
    setSocialLinks(links =>
      links.map(link =>
        link.id === id ? { ...link, enabled: !link.enabled } : link
      )
    )
  }

  const updateSocialUrl = (id: string, url: string) => {
    setSocialLinks(links =>
      links.map(link =>
        link.id === id ? { ...link, url } : link
      )
    )
  }

  const moveSocialLink = (id: string, direction: "up" | "down") => {
    const index = socialLinks.findIndex(l => l.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === socialLinks.length - 1)) {
      return
    }
    const newLinks = [...socialLinks]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newLinks[index], newLinks[swapIndex]] = [newLinks[swapIndex], newLinks[index]]
    newLinks.forEach((link, i) => link.order = i + 1)
    setSocialLinks(newLinks)
  }

  const addSocialLink = () => {
    if (!newSocialPlatform.trim() || !newSocialUrl.trim()) return
    const newLink: SocialMediaLink = {
      id: `custom-${Date.now()}`,
      platform: newSocialPlatform,
      icon: newSocialIcon,
      url: newSocialUrl,
      enabled: true,
      order: socialLinks.length + 1
    }
    setSocialLinks([...socialLinks, newLink])
    setNewSocialPlatform("")
    setNewSocialUrl("")
  }

  const deleteSocialLink = (id: string) => {
    setSocialLinks(links => links.filter(l => l.id !== id))
  }

  // Legal Pages functions
  const updateLegalSection = (pageId: string, sectionId: string, field: "title" | "content", value: string) => {
    setLegalPages(pages =>
      pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.map(section =>
                section.id === sectionId ? { ...section, [field]: value } : section
              )
            }
          : page
      )
    )
  }

  const addLegalSection = (pageId: string) => {
    setLegalPages(pages =>
      pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              sections: [
                ...page.sections,
                {
                  id: `section-${Date.now()}`,
                  title: `${page.sections.length + 1}. New Section`,
                  content: "Enter section content here...",
                  order: page.sections.length + 1
                }
              ]
            }
          : page
      )
    )
  }

  const deleteLegalSection = (pageId: string, sectionId: string) => {
    setLegalPages(pages =>
      pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.filter(s => s.id !== sectionId)
            }
          : page
      )
    )
  }

  const toggleLegalPage = (pageId: string) => {
    setLegalPages(pages =>
      pages.map(page =>
        page.id === pageId ? { ...page, enabled: !page.enabled } : page
      )
    )
  }

  const updateLegalPageMeta = (pageId: string, field: "title" | "lastUpdated", value: string) => {
    setLegalPages(pages =>
      pages.map(page =>
        page.id === pageId ? { ...page, [field]: value } : page
      )
    )
  }

  // Help Center functions
  const updateHelpSettings = (field: string, value: string) => {
    const [section, key] = field.split('.')
    if (section === 'hero') {
      setHelpCenter({
        ...helpCenter,
        settings: {
          ...helpCenter.settings,
          hero: { ...helpCenter.settings.hero, [key]: value }
        }
      })
    } else if (section === 'contactSupport') {
      setHelpCenter({
        ...helpCenter,
        settings: {
          ...helpCenter.settings,
          contactSupport: { ...helpCenter.settings.contactSupport, [key]: value }
        }
      })
    }
  }

  const toggleCategory = (categoryId: string) => {
    setHelpCenter({
      ...helpCenter,
      categories: helpCenter.categories.map(cat =>
        cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
      )
    })
  }

  const updateCategory = (categoryId: string, field: keyof HelpCategory, value: string) => {
    setHelpCenter({
      ...helpCenter,
      categories: helpCenter.categories.map(cat =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      )
    })
  }

  const moveCategory = (categoryId: string, direction: "up" | "down") => {
    const categories = [...helpCenter.categories].sort((a, b) => a.order - b.order)
    const index = categories.findIndex(c => c.id === categoryId)
    if ((direction === "up" && index === 0) || (direction === "down" && index === categories.length - 1)) {
      return
    }
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[categories[index], categories[swapIndex]] = [categories[swapIndex], categories[index]]
    categories.forEach((cat, i) => cat.order = i + 1)
    setHelpCenter({ ...helpCenter, categories })
  }

  const deleteCategory = (categoryId: string) => {
    setHelpCenter({
      ...helpCenter,
      categories: helpCenter.categories.filter(c => c.id !== categoryId),
      popularArticles: helpCenter.popularArticles.filter(a => a.categoryId !== categoryId)
    })
    if (selectedCategory === categoryId) {
      setSelectedCategory(helpCenter.categories.find(c => c.id !== categoryId)?.id || null)
    }
  }

  const addCategory = () => {
    if (!newCategoryData.title.trim()) return
    const slug = newCategoryData.title.toLowerCase().replace(/\s+/g, '-')
    const newCategory: HelpCategory = {
      id: `cat-${Date.now()}`,
      slug,
      icon: newCategoryData.icon,
      title: newCategoryData.title,
      description: newCategoryData.description,
      enabled: true,
      order: helpCenter.categories.length + 1,
      articles: []
    }
    setHelpCenter({
      ...helpCenter,
      categories: [...helpCenter.categories, newCategory]
    })
    setNewCategoryData({ title: "", description: "", icon: "Users" })
    setNewCategoryDialog(false)
    setSelectedCategory(newCategory.id)
  }

  const toggleArticle = (categoryId: string, articleId: string) => {
    setHelpCenter({
      ...helpCenter,
      categories: helpCenter.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              articles: cat.articles.map(art =>
                art.id === articleId ? { ...art, enabled: !art.enabled } : art
              )
            }
          : cat
      )
    })
  }

  const updateArticle = (categoryId: string, articleId: string, field: keyof HelpArticle, value: string | string[]) => {
    setHelpCenter({
      ...helpCenter,
      categories: helpCenter.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              articles: cat.articles.map(art =>
                art.id === articleId ? { ...art, [field]: value } : art
              )
            }
          : cat
      )
    })
  }

  const moveArticle = (categoryId: string, articleId: string, direction: "up" | "down") => {
    const category = helpCenter.categories.find(c => c.id === categoryId)
    if (!category) return
    
    const articles = [...category.articles].sort((a, b) => a.order - b.order)
    const index = articles.findIndex(a => a.id === articleId)
    if ((direction === "up" && index === 0) || (direction === "down" && index === articles.length - 1)) {
      return
    }
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[articles[index], articles[swapIndex]] = [articles[swapIndex], articles[index]]
    articles.forEach((art, i) => art.order = i + 1)
    
    setHelpCenter({
      ...helpCenter,
      categories: helpCenter.categories.map(cat =>
        cat.id === categoryId ? { ...cat, articles } : cat
      )
    })
  }

  const deleteArticle = (categoryId: string, articleId: string) => {
    setHelpCenter({
      ...helpCenter,
      categories: helpCenter.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, articles: cat.articles.filter(a => a.id !== articleId) }
          : cat
      ),
      popularArticles: helpCenter.popularArticles.filter(a => !(a.categoryId === categoryId && a.articleSlug === helpCenter.categories.find(c => c.id === categoryId)?.articles.find(ar => ar.id === articleId)?.slug))
    })
    if (selectedArticle?.articleId === articleId) {
      setSelectedArticle(null)
    }
  }

  const addArticle = (categoryId: string) => {
    if (!newArticleData.title.trim()) return
    const category = helpCenter.categories.find(c => c.id === categoryId)
    if (!category) return
    
    const slug = newArticleData.title.toLowerCase().replace(/\s+/g, '-')
    const newArticle: HelpArticle = {
      id: `art-${Date.now()}`,
      slug,
      title: newArticleData.title,
      content: newArticleData.content || "Enter article content here...",
      steps: [],
      enabled: true,
      order: category.articles.length + 1
    }
    
    setHelpCenter({
      ...helpCenter,
      categories: helpCenter.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, articles: [...cat.articles, newArticle] }
          : cat
      )
    })
    setNewArticleData({ title: "", content: "" })
    setNewArticleDialog(false)
  }

  const addArticleStep = (categoryId: string, articleId: string) => {
    const category = helpCenter.categories.find(c => c.id === categoryId)
    const article = category?.articles.find(a => a.id === articleId)
    if (!article) return
    
    updateArticle(categoryId, articleId, 'steps', [...(article.steps || []), ""])
  }

  const updateArticleStep = (categoryId: string, articleId: string, stepIndex: number, value: string) => {
    const category = helpCenter.categories.find(c => c.id === categoryId)
    const article = category?.articles.find(a => a.id === articleId)
    if (!article?.steps) return
    
    const newSteps = [...article.steps]
    newSteps[stepIndex] = value
    updateArticle(categoryId, articleId, 'steps', newSteps)
  }

  const deleteArticleStep = (categoryId: string, articleId: string, stepIndex: number) => {
    const category = helpCenter.categories.find(c => c.id === categoryId)
    const article = category?.articles.find(a => a.id === articleId)
    if (!article?.steps) return
    
    const newSteps = article.steps.filter((_, i) => i !== stepIndex)
    updateArticle(categoryId, articleId, 'steps', newSteps)
  }

  const togglePopularArticle = (articleId: string) => {
    setHelpCenter({
      ...helpCenter,
      popularArticles: helpCenter.popularArticles.map(art =>
        art.id === articleId ? { ...art, enabled: !art.enabled } : art
      )
    })
  }

  const addToPopularArticles = (categoryId: string, article: HelpArticle) => {
    const category = helpCenter.categories.find(c => c.id === categoryId)
    if (!category) return
    
    // Check if already in popular
    const exists = helpCenter.popularArticles.some(
      pa => pa.categoryId === categoryId && pa.articleSlug === article.slug
    )
    if (exists) return
    
    const newPopular: PopularArticle = {
      id: `pop-${Date.now()}`,
      title: article.title,
      categoryId,
      categorySlug: category.slug,
      articleSlug: article.slug,
      enabled: true,
      order: helpCenter.popularArticles.length + 1
    }
    
    setHelpCenter({
      ...helpCenter,
      popularArticles: [...helpCenter.popularArticles, newPopular]
    })
  }

  const removeFromPopularArticles = (popularId: string) => {
    setHelpCenter({
      ...helpCenter,
      popularArticles: helpCenter.popularArticles.filter(a => a.id !== popularId)
    })
  }

  const movePopularArticle = (popularId: string, direction: "up" | "down") => {
    const articles = [...helpCenter.popularArticles].sort((a, b) => a.order - b.order)
    const index = articles.findIndex(a => a.id === popularId)
    if ((direction === "up" && index === 0) || (direction === "down" && index === articles.length - 1)) {
      return
    }
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[articles[index], articles[swapIndex]] = [articles[swapIndex], articles[index]]
    articles.forEach((art, i) => art.order = i + 1)
    setHelpCenter({ ...helpCenter, popularArticles: articles })
  }

  const currentLegalPage = legalPages.find(p => p.id === selectedLegalPage)
  const currentCategory = helpCenter.categories.find(c => c.id === selectedCategory)
  const currentArticle = selectedArticle 
    ? helpCenter.categories.find(c => c.id === selectedArticle.categoryId)?.articles.find(a => a.id === selectedArticle.articleId)
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage content pages, Help Center, legal documents, and social media links
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs defaultValue="help" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="help" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Help Center
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="legal" className="gap-2">
            <FileText className="h-4 w-4" />
            Legal Pages
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <Info className="h-4 w-4" />
            About Us
          </TabsTrigger>
        </TabsList>

        {/* Help Center Tab */}
        <TabsContent value="help" className="space-y-6">
          {/* Help Center Settings Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Help Center Settings
                  </CardTitle>
                  <CardDescription>
                    Configure hero section, search, and contact support settings
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/help"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    Preview <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hero Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Hero Section</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={helpCenter.settings.hero.title}
                      onChange={(e) => updateHelpSettings('hero.title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={helpCenter.settings.hero.subtitle}
                      onChange={(e) => updateHelpSettings('hero.subtitle', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Search Placeholder</Label>
                    <Input
                      value={helpCenter.settings.hero.searchPlaceholder}
                      onChange={(e) => updateHelpSettings('hero.searchPlaceholder', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Support Section */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Contact Support Section</h3>
                  <Switch
                    checked={helpCenter.settings.contactSupport.enabled}
                    onCheckedChange={(checked) => setHelpCenter({
                      ...helpCenter,
                      settings: {
                        ...helpCenter.settings,
                        contactSupport: { ...helpCenter.settings.contactSupport, enabled: checked }
                      }
                    })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={helpCenter.settings.contactSupport.title}
                      onChange={(e) => updateHelpSettings('contactSupport.title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={helpCenter.settings.contactSupport.subtitle}
                      onChange={(e) => updateHelpSettings('contactSupport.subtitle', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Contact Button Text</Label>
                    <Input
                      value={helpCenter.settings.contactSupport.contactButtonText}
                      onChange={(e) => updateHelpSettings('contactSupport.contactButtonText', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>FAQ Button Text</Label>
                    <Input
                      value={helpCenter.settings.contactSupport.faqButtonText}
                      onChange={(e) => updateHelpSettings('contactSupport.faqButtonText', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories & Articles Management */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Categories List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Categories</CardTitle>
                  <Dialog open={newCategoryDialog} onOpenChange={setNewCategoryDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Plus className="h-3 w-3" />
                        Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>
                          Create a new help center category
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Category Title</Label>
                          <Input
                            value={newCategoryData.title}
                            onChange={(e) => setNewCategoryData({ ...newCategoryData, title: e.target.value })}
                            placeholder="e.g., For Buyers"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={newCategoryData.description}
                            onChange={(e) => setNewCategoryData({ ...newCategoryData, description: e.target.value })}
                            placeholder="Short description..."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Icon</Label>
                          <Select value={newCategoryData.icon} onValueChange={(v) => setNewCategoryData({ ...newCategoryData, icon: v })}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryIconOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <opt.icon className="h-4 w-4" />
                                    {opt.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewCategoryDialog(false)}>Cancel</Button>
                        <Button onClick={addCategory}>Add Category</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 p-2">
                  {helpCenter.categories.sort((a, b) => a.order - b.order).map((category) => {
                    const IconComp = getCategoryIconComponent(category.icon)
                    return (
                      <div
                        key={category.id}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                          selectedCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setSelectedArticle(null)
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <IconComp className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate">{category.title}</span>
                          <Badge variant="secondary" className={`text-xs ${selectedCategory === category.id ? 'bg-primary-foreground/20' : ''}`}>
                            {category.articles.length}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {category.enabled ? (
                            <Eye className="h-3 w-3 opacity-60" />
                          ) : (
                            <EyeOff className="h-3 w-3 opacity-40" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Category Details & Articles */}
            <Card className="lg:col-span-2">
              {currentCategory ? (
                <>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{currentCategory.title}</CardTitle>
                        <CardDescription>{currentCategory.articles.length} articles</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveCategory(currentCategory.id, "up")}
                          disabled={helpCenter.categories.findIndex(c => c.id === currentCategory.id) === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveCategory(currentCategory.id, "down")}
                          disabled={helpCenter.categories.findIndex(c => c.id === currentCategory.id) === helpCenter.categories.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={currentCategory.enabled}
                          onCheckedChange={() => toggleCategory(currentCategory.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteCategory(currentCategory.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Category Settings */}
                    <div className="grid gap-4 sm:grid-cols-3 pb-4 border-b">
                      <div>
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={currentCategory.title}
                          onChange={(e) => updateCategory(currentCategory.id, 'title', e.target.value)}
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={currentCategory.description}
                          onChange={(e) => updateCategory(currentCategory.id, 'description', e.target.value)}
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Icon</Label>
                        <Select value={currentCategory.icon} onValueChange={(v) => updateCategory(currentCategory.id, 'icon', v)}>
                          <SelectTrigger className="mt-1 h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryIconOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center gap-2">
                                  <opt.icon className="h-4 w-4" />
                                  {opt.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Articles List */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium">Articles</Label>
                        <Dialog open={newArticleDialog} onOpenChange={setNewArticleDialog}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Plus className="h-3 w-3" />
                              Add Article
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Article</DialogTitle>
                              <DialogDescription>
                                Create a new article in {currentCategory.title}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label>Article Title</Label>
                                <Input
                                  value={newArticleData.title}
                                  onChange={(e) => setNewArticleData({ ...newArticleData, title: e.target.value })}
                                  placeholder="e.g., How to search for suppliers"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Initial Content (optional)</Label>
                                <Textarea
                                  value={newArticleData.content}
                                  onChange={(e) => setNewArticleData({ ...newArticleData, content: e.target.value })}
                                  placeholder="Article introduction..."
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setNewArticleDialog(false)}>Cancel</Button>
                              <Button onClick={() => addArticle(currentCategory.id)}>Add Article</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">
                        Click on an article to edit its content, or use the pencil icon.
                      </p>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {currentCategory.articles.sort((a, b) => a.order - b.order).map((article) => (
                          <div
                            key={article.id}
                            className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                              selectedArticle?.articleId === article.id
                                ? "border-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            } ${!article.enabled ? "opacity-50" : ""}`}
                            onClick={() => setSelectedArticle({ categoryId: currentCategory.id, articleId: article.id })}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{article.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {article.steps?.length || 0} steps | {article.content.length > 50 ? article.content.substring(0, 50) + '...' : article.content}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedArticle({ categoryId: currentCategory.id, articleId: article.id })
                                }}
                                title="Edit article content"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              {!helpCenter.popularArticles.some(pa => pa.categoryId === currentCategory.id && pa.articleSlug === article.slug) && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs h-7"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    addToPopularArticles(currentCategory.id, article)
                                  }}
                                >
                                  + Popular
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveArticle(currentCategory.id, article.id, "up")
                                }}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveArticle(currentCategory.id, article.id, "down")
                                }}
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                              <Switch
                                checked={article.enabled}
                                onCheckedChange={() => toggleArticle(currentCategory.id, article.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteArticle(currentCategory.id, article.id)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {currentCategory.articles.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-6">
                            No articles yet. Add your first article.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-[400px]">
                  <p className="text-muted-foreground">Select a category to manage</p>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Article Editor */}
          {selectedArticle && currentArticle ? (
            <Card className="border-primary">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit Article Content
                    </CardTitle>
                    <CardDescription>
                      {helpCenter.categories.find(c => c.id === selectedArticle.categoryId)?.title} / {currentArticle.title}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/help/${helpCenter.categories.find(c => c.id === selectedArticle.categoryId)?.slug}/${currentArticle.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      Preview <ExternalLink className="h-3 w-3" />
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedArticle(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Article Title</Label>
                    <Input
                      value={currentArticle.title}
                      onChange={(e) => updateArticle(selectedArticle.categoryId, selectedArticle.articleId, 'title', e.target.value)}
                      className="mt-1"
                      placeholder="e.g., How to create a buyer account"
                    />
                    <p className="text-xs text-muted-foreground mt-1">The main heading shown on the article page</p>
                  </div>
                  <div>
                    <Label>URL Slug</Label>
                    <Input
                      value={currentArticle.slug}
                      onChange={(e) => updateArticle(selectedArticle.categoryId, selectedArticle.articleId, 'slug', e.target.value)}
                      className="mt-1"
                      placeholder="e.g., create-account"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Used in the article URL (no spaces)</p>
                  </div>
                </div>

                <div>
                  <Label>Article Introduction / Description</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    This text appears at the top of the article, before the step-by-step guide.
                  </p>
                  <Textarea
                    value={currentArticle.content}
                    onChange={(e) => updateArticle(selectedArticle.categoryId, selectedArticle.articleId, 'content', e.target.value)}
                    className="mt-1"
                    rows={5}
                    placeholder="Write an introduction or overview of this topic. Explain what the user will learn and why it's important..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Label>Step-by-Step Guide</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add numbered steps that guide users through the process
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => addArticleStep(selectedArticle.categoryId, selectedArticle.articleId)}
                    >
                      <Plus className="h-3 w-3" />
                      Add Step
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {currentArticle.steps?.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground mt-2">
                          {index + 1}
                        </span>
                        <Textarea
                          value={step}
                          onChange={(e) => updateArticleStep(selectedArticle.categoryId, selectedArticle.articleId, index, e.target.value)}
                          placeholder={`Step ${index + 1}: Describe what the user should do...`}
                          className="flex-1 min-h-[60px]"
                          rows={2}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive flex-shrink-0 mt-1"
                          onClick={() => deleteArticleStep(selectedArticle.categoryId, selectedArticle.articleId, index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!currentArticle.steps || currentArticle.steps.length === 0) && (
                      <div className="text-center py-6 border rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">
                          No steps added yet. Click "Add Step" to create a step-by-step guide.
                        </p>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="gap-1 mt-3"
                          onClick={() => addArticleStep(selectedArticle.categoryId, selectedArticle.articleId)}
                        >
                          <Plus className="h-3 w-3" />
                          Add First Step
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Pencil className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-center">
                  Select an article from the list above to edit its content
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  You can edit the title, introduction, and step-by-step instructions
                </p>
              </CardContent>
            </Card>
          )}

          {/* Popular Articles Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Popular Articles</CardTitle>
              <CardDescription>
                These articles appear in the "Popular Articles" section on the Help Center page. Reorder them to change their display position.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {helpCenter.popularArticles.sort((a, b) => a.order - b.order).map((article, index) => {
                  const category = helpCenter.categories.find(c => c.id === article.categoryId)
                  const sortedArticles = [...helpCenter.popularArticles].sort((a, b) => a.order - b.order)
                  const isFirst = index === 0
                  const isLast = index === sortedArticles.length - 1
                  return (
                    <div
                      key={article.id}
                      className={`flex items-center justify-between rounded-lg border p-3 ${
                        article.enabled ? "" : "opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => movePopularArticle(article.id, "up")}
                            disabled={isFirst}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => movePopularArticle(article.id, "down")}
                            disabled={isLast}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0 text-xs">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{article.title}</p>
                          <p className="text-xs text-muted-foreground">{category?.title || article.categorySlug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={() => {
                            const cat = helpCenter.categories.find(c => c.id === article.categoryId)
                            const art = cat?.articles.find(a => a.slug === article.articleSlug)
                            if (cat && art) {
                              setSelectedArticle({ categoryId: cat.id, articleId: art.id })
                              setSelectedCategory(cat.id)
                            }
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                        <a
                          href={`/help/${article.categorySlug}/${article.articleSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                        <Switch
                          checked={article.enabled}
                          onCheckedChange={() => togglePopularArticle(article.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removeFromPopularArticles(article.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
                {helpCenter.popularArticles.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No popular articles selected. Click "+ Popular" on any article above to add it here.
                  </p>
                )}
              </div>
              {helpCenter.popularArticles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-4">
                  Tip: Use the up/down arrows to reorder articles. The order here matches how they appear on the Help Center page.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Manage the social media links that appear in the website footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {socialLinks.sort((a, b) => a.order - b.order).map((link) => {
                  const IconComponent = getIconComponent(link.icon)
                  return (
                    <div
                      key={link.id}
                      className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                        link.enabled ? "bg-card" : "bg-muted/50 opacity-60"
                      }`}
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{link.platform}</span>
                          {link.enabled ? (
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Hidden</Badge>
                          )}
                        </div>
                        <Input
                          value={link.url}
                          onChange={(e) => updateSocialUrl(link.id, e.target.value)}
                          className="mt-2 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => moveSocialLink(link.id, "up")}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => moveSocialLink(link.id, "down")}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Switch checked={link.enabled} onCheckedChange={() => toggleSocialLink(link.id)} />
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteSocialLink(link.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="rounded-lg border border-dashed p-4">
                <h4 className="font-medium text-foreground mb-3">Add New Social Platform</h4>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <Label className="text-xs">Platform Name</Label>
                    <Input value={newSocialPlatform} onChange={(e) => setNewSocialPlatform(e.target.value)} placeholder="e.g., Pinterest" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Icon</Label>
                    <Select value={newSocialIcon} onValueChange={setNewSocialIcon}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {iconOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2"><option.icon className="h-4 w-4" />{option.label}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs">URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={newSocialUrl} onChange={(e) => setNewSocialUrl(e.target.value)} placeholder="https://..." />
                      <Button onClick={addSocialLink}><Plus className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-primary p-6">
                <p className="text-sm text-primary-foreground/60 mb-3">Footer Preview:</p>
                <div className="flex gap-4">
                  {socialLinks.filter(l => l.enabled).sort((a, b) => a.order - b.order).map(link => {
                    const IconComponent = getIconComponent(link.icon)
                    return (
                      <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground">
                        <IconComponent className="h-5 w-5" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Pages Tab */}
        <TabsContent value="legal" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle className="text-base">Legal Pages</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 p-2">
                  {legalPages.map(page => (
                    <button
                      key={page.id}
                      onClick={() => setSelectedLegalPage(page.id)}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedLegalPage === page.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-2"><FileText className="h-4 w-4" />{page.title}</span>
                      <div className="flex items-center gap-1">
                        {page.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 opacity-50" />}
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentLegalPage?.title}</CardTitle>
                    <CardDescription>Edit the content sections of this page</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href={`/${currentLegalPage?.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                      Preview <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="page-enabled" className="text-sm">Page Enabled</Label>
                      <Switch id="page-enabled" checked={currentLegalPage?.enabled} onCheckedChange={() => currentLegalPage && toggleLegalPage(currentLegalPage.id)} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Page Title</Label>
                    <Input value={currentLegalPage?.title || ""} onChange={(e) => currentLegalPage && updateLegalPageMeta(currentLegalPage.id, "title", e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Last Updated</Label>
                    <Input value={currentLegalPage?.lastUpdated || ""} onChange={(e) => currentLegalPage && updateLegalPageMeta(currentLegalPage.id, "lastUpdated", e.target.value)} className="mt-1" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base">Content Sections</Label>
                    <Button variant="outline" size="sm" onClick={() => currentLegalPage && addLegalSection(currentLegalPage.id)} className="gap-2">
                      <Plus className="h-4 w-4" />Add Section
                    </Button>
                  </div>
                  
                  <Accordion type="multiple" className="space-y-2">
                    {currentLegalPage?.sections.sort((a, b) => a.order - b.order).map((section, index) => (
                      <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium">{index + 1}</span>
                            <span className="text-left">{section.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div>
                            <Label>Section Title</Label>
                            <Input value={section.title} onChange={(e) => currentLegalPage && updateLegalSection(currentLegalPage.id, section.id, "title", e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label>Content</Label>
                            <Textarea value={section.content} onChange={(e) => currentLegalPage && updateLegalSection(currentLegalPage.id, section.id, "content", e.target.value)} rows={4} className="mt-1" />
                          </div>
                          <div className="flex justify-end">
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => currentLegalPage && deleteLegalSection(currentLegalPage.id, section.id)}>
                              <Trash2 className="h-4 w-4 mr-1" />Delete Section
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* About Us Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />About Us Page</CardTitle>
                  <CardDescription>Customize the content of your About Us page</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <a href="/about" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                    Preview <ExternalLink className="h-3 w-3" />
                  </a>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="about-enabled" className="text-sm">Page Enabled</Label>
                    <Switch id="about-enabled" checked={aboutPage.enabled} onCheckedChange={(checked) => setAboutPage({ ...aboutPage, enabled: checked })} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Hero Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Hero Section</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Title</Label>
                    <Input value={aboutPage.hero.title} onChange={(e) => setAboutPage({ ...aboutPage, hero: { ...aboutPage.hero, title: e.target.value } })} className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Subtitle</Label>
                    <Textarea value={aboutPage.hero.subtitle} onChange={(e) => setAboutPage({ ...aboutPage, hero: { ...aboutPage.hero, subtitle: e.target.value } })} className="mt-1" rows={2} />
                  </div>
                </div>
              </div>

              {/* Story Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Our Story</h3>
                <div>
                  <Label>Section Title</Label>
                  <Input value={aboutPage.story.title} onChange={(e) => setAboutPage({ ...aboutPage, story: { ...aboutPage.story, title: e.target.value } })} className="mt-1" />
                </div>
                <div>
                  <Label>Story Paragraphs</Label>
                  {aboutPage.story.paragraphs.map((paragraph, index) => (
                    <div key={index} className="mt-2 flex gap-2">
                      <Textarea value={paragraph} onChange={(e) => { const newParagraphs = [...aboutPage.story.paragraphs]; newParagraphs[index] = e.target.value; setAboutPage({ ...aboutPage, story: { ...aboutPage.story, paragraphs: newParagraphs } }) }} rows={3} className="flex-1" />
                      <Button variant="ghost" size="icon" onClick={() => { const newParagraphs = aboutPage.story.paragraphs.filter((_, i) => i !== index); setAboutPage({ ...aboutPage, story: { ...aboutPage.story, paragraphs: newParagraphs } }) }}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={() => setAboutPage({ ...aboutPage, story: { ...aboutPage.story, paragraphs: [...aboutPage.story.paragraphs, ""] } })}><Plus className="h-4 w-4" />Add Paragraph</Button>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Statistics</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {aboutPage.stats.map((stat, index) => (
                    <div key={index} className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Stat #{index + 1}</Label>
                        <Switch checked={stat.enabled} onCheckedChange={(checked) => { const newStats = [...aboutPage.stats]; newStats[index] = { ...stat, enabled: checked }; setAboutPage({ ...aboutPage, stats: newStats }) }} />
                      </div>
                      <Input value={stat.value} onChange={(e) => { const newStats = [...aboutPage.stats]; newStats[index] = { ...stat, value: e.target.value }; setAboutPage({ ...aboutPage, stats: newStats }) }} placeholder="Value (e.g., 50+)" />
                      <Input value={stat.label} onChange={(e) => { const newStats = [...aboutPage.stats]; newStats[index] = { ...stat, label: e.target.value }; setAboutPage({ ...aboutPage, stats: newStats }) }} placeholder="Label (e.g., Countries)" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mission & Vision */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Mission</h3>
                  <div><Label>Title</Label><Input value={aboutPage.mission.title} onChange={(e) => setAboutPage({ ...aboutPage, mission: { ...aboutPage.mission, title: e.target.value } })} className="mt-1" /></div>
                  <div><Label>Description</Label><Textarea value={aboutPage.mission.description} onChange={(e) => setAboutPage({ ...aboutPage, mission: { ...aboutPage.mission, description: e.target.value } })} className="mt-1" rows={3} /></div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Vision</h3>
                  <div><Label>Title</Label><Input value={aboutPage.vision.title} onChange={(e) => setAboutPage({ ...aboutPage, vision: { ...aboutPage.vision, title: e.target.value } })} className="mt-1" /></div>
                  <div><Label>Description</Label><Textarea value={aboutPage.vision.description} onChange={(e) => setAboutPage({ ...aboutPage, vision: { ...aboutPage.vision, description: e.target.value } })} className="mt-1" rows={3} /></div>
                </div>
              </div>

              {/* Values */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Company Values</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {aboutPage.values.map((value, index) => (
                    <div key={value.id} className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{value.title}</Label>
                        <Switch checked={value.enabled} onCheckedChange={(checked) => { const newValues = [...aboutPage.values]; newValues[index] = { ...value, enabled: checked }; setAboutPage({ ...aboutPage, values: newValues }) }} />
                      </div>
                      <Input value={value.title} onChange={(e) => { const newValues = [...aboutPage.values]; newValues[index] = { ...value, title: e.target.value }; setAboutPage({ ...aboutPage, values: newValues }) }} placeholder="Value Title" />
                      <Textarea value={value.description} onChange={(e) => { const newValues = [...aboutPage.values]; newValues[index] = { ...value, description: e.target.value }; setAboutPage({ ...aboutPage, values: newValues }) }} placeholder="Description" rows={2} />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Call to Action</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2"><Label>Title</Label><Input value={aboutPage.cta.title} onChange={(e) => setAboutPage({ ...aboutPage, cta: { ...aboutPage.cta, title: e.target.value } })} className="mt-1" /></div>
                  <div className="sm:col-span-2"><Label>Subtitle</Label><Input value={aboutPage.cta.subtitle} onChange={(e) => setAboutPage({ ...aboutPage, cta: { ...aboutPage.cta, subtitle: e.target.value } })} className="mt-1" /></div>
                  <div><Label>Buyer Button Text</Label><Input value={aboutPage.cta.buyerButtonText} onChange={(e) => setAboutPage({ ...aboutPage, cta: { ...aboutPage.cta, buyerButtonText: e.target.value } })} className="mt-1" /></div>
                  <div><Label>Manufacturer Button Text</Label><Input value={aboutPage.cta.manufacturerButtonText} onChange={(e) => setAboutPage({ ...aboutPage, cta: { ...aboutPage.cta, manufacturerButtonText: e.target.value } })} className="mt-1" /></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
