"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  HelpCircle, 
  Plus, 
  Pencil, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  GripVertical,
  FolderPlus,
  MessageSquareText,
  Save
} from "lucide-react"
import { toast } from "sonner"

interface FAQ {
  id: string
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  title: string
  faqs: FAQ[]
}

// Initial data based on the current FAQ page
const initialFaqCategories: FAQCategory[] = [
  {
    id: "cat-1",
    title: "General",
    faqs: [
      {
        id: "faq-1",
        question: "What is SourceNest?",
        answer: "SourceNest is a premium global B2B sourcing platform that connects buyers, importers, and sourcing professionals with reviewed manufacturers and factories worldwide. It's a digital marketplace where you can search for suppliers, compare their capabilities, view products, and communicate directly with factories.",
      },
      {
        id: "faq-2",
        question: "Who is SourceNest for?",
        answer: "SourceNest serves two main audiences: Buyers (importers, distributors, retailers, brands, and sourcing professionals looking for manufacturing partners) and Manufacturers (factories and manufacturers seeking to reach global buyers and expand their export business).",
      },
      {
        id: "faq-3",
        question: "How is SourceNest different from other B2B platforms?",
        answer: "Unlike open marketplaces where anyone can list, SourceNest requires every manufacturer to go through our review and approval process based on submitted information. This means buyers know that suppliers have been screened, and manufacturers benefit from being in a quality-focused marketplace.",
      },
    ],
  },
  {
    id: "cat-2",
    title: "For Buyers",
    faqs: [
      {
        id: "faq-4",
        question: "Is SourceNest free for buyers?",
        answer: "Yes, absolutely. SourceNest is completely free for buyers. You can create an account, search suppliers, compare factories, send messages, request quotes, and manage your sourcing activity at no cost. There are no hidden fees or premium tiers for buyers.",
      },
      {
        id: "faq-5",
        question: "Do I need an account to use SourceNest?",
        answer: "You can browse suppliers and products without an account, but you'll need to create a free buyer account to send messages, request quotes, save suppliers, compare factories, and access other interactive features.",
      },
      {
        id: "faq-6",
        question: "How do I message a supplier?",
        answer: "Once you're logged in, you can click 'Message Supplier' on any supplier profile or product page. Your message goes directly to the factory's inbox on SourceNest, and they'll receive a notification.",
      },
    ],
  },
  {
    id: "cat-3",
    title: "For Manufacturers",
    faqs: [
      {
        id: "faq-7",
        question: "Why do manufacturers need to pay to join?",
        answer: "Manufacturers pay a subscription fee to maintain platform quality and fund review processes. This ensures only serious, committed manufacturers join the platform. Because buyers use SourceNest for free, manufacturers get access to a large pool of serious sourcing professionals.",
      },
      {
        id: "faq-8",
        question: "What subscription plans are available?",
        answer: "We offer three plans: Starter ($149/month or $1,490/year) for small manufacturers, Growth ($299/month or $2,990/year) for established manufacturers, and Enterprise (custom pricing) for large manufacturers with specific requirements.",
      },
    ],
  },
  {
    id: "cat-4",
    title: "Review & Trust",
    faqs: [
      {
        id: "faq-9",
        question: "How does the review process work?",
        answer: "When a manufacturer signs up and completes payment, their profile goes through a multi-step review based on submitted information. We review business documents, check submitted certifications, assess factory details, and review all profile content.",
      },
      {
        id: "faq-10",
        question: "What documents are required for the review process?",
        answer: "We typically review submitted business registration certificates, export/import licenses (if applicable), industry certifications (ISO, CE, FDA, etc.), and tax registration documents.",
      },
    ],
  },
  {
    id: "cat-5",
    title: "Billing & Payments",
    faqs: [
      {
        id: "faq-11",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For Enterprise plans, we also offer bank transfer options.",
      },
      {
        id: "faq-12",
        question: "What is your refund policy?",
        answer: "We offer a 30-day money-back guarantee for new subscribers. If you're not satisfied with the platform within the first 30 days, contact us for a full refund.",
      },
    ],
  },
]

export default function AdminFaqPage() {
  const [categories, setCategories] = useState<FAQCategory[]>(initialFaqCategories)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  
  // Category dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null)
  const [categoryTitle, setCategoryTitle] = useState("")
  
  // FAQ dialog state
  const [faqDialogOpen, setFaqDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [faqQuestion, setFaqQuestion] = useState("")
  const [faqAnswer, setFaqAnswer] = useState("")
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: "category" | "faq"; id: string; categoryId?: string } | null>(null)

  // Calculate totals
  const totalCategories = categories.length
  const totalFaqs = categories.reduce((sum, cat) => sum + cat.faqs.length, 0)

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Category CRUD
  const openCategoryDialog = (category?: FAQCategory) => {
    if (category) {
      setEditingCategory(category)
      setCategoryTitle(category.title)
    } else {
      setEditingCategory(null)
      setCategoryTitle("")
    }
    setCategoryDialogOpen(true)
  }

  const saveCategory = () => {
    if (!categoryTitle.trim()) {
      toast.error("Please enter a category title")
      return
    }

    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, title: categoryTitle.trim() }
          : cat
      ))
      toast.success("Category updated successfully")
    } else {
      // Add new category
      const newCategory: FAQCategory = {
        id: `cat-${Date.now()}`,
        title: categoryTitle.trim(),
        faqs: []
      }
      setCategories(prev => [...prev, newCategory])
      toast.success("Category added successfully")
    }
    setCategoryDialogOpen(false)
    setCategoryTitle("")
    setEditingCategory(null)
  }

  // FAQ CRUD
  const openFaqDialog = (categoryId: string, faq?: FAQ) => {
    setSelectedCategoryId(categoryId)
    if (faq) {
      setEditingFaq(faq)
      setFaqQuestion(faq.question)
      setFaqAnswer(faq.answer)
    } else {
      setEditingFaq(null)
      setFaqQuestion("")
      setFaqAnswer("")
    }
    setFaqDialogOpen(true)
  }

  const saveFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      toast.error("Please fill in both question and answer")
      return
    }

    if (editingFaq) {
      // Update existing FAQ
      setCategories(prev => prev.map(cat => {
        if (cat.id === selectedCategoryId) {
          return {
            ...cat,
            faqs: cat.faqs.map(f => 
              f.id === editingFaq.id 
                ? { ...f, question: faqQuestion.trim(), answer: faqAnswer.trim() }
                : f
            )
          }
        }
        return cat
      }))
      toast.success("FAQ updated successfully")
    } else {
      // Add new FAQ
      const newFaq: FAQ = {
        id: `faq-${Date.now()}`,
        question: faqQuestion.trim(),
        answer: faqAnswer.trim()
      }
      setCategories(prev => prev.map(cat => {
        if (cat.id === selectedCategoryId) {
          return { ...cat, faqs: [...cat.faqs, newFaq] }
        }
        return cat
      }))
      toast.success("FAQ added successfully")
    }
    setFaqDialogOpen(false)
    setFaqQuestion("")
    setFaqAnswer("")
    setEditingFaq(null)
  }

  // Delete handlers
  const openDeleteDialog = (type: "category" | "faq", id: string, categoryId?: string) => {
    setItemToDelete({ type, id, categoryId })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return

    if (itemToDelete.type === "category") {
      setCategories(prev => prev.filter(cat => cat.id !== itemToDelete.id))
      toast.success("Category deleted successfully")
    } else if (itemToDelete.type === "faq" && itemToDelete.categoryId) {
      setCategories(prev => prev.map(cat => {
        if (cat.id === itemToDelete.categoryId) {
          return {
            ...cat,
            faqs: cat.faqs.filter(f => f.id !== itemToDelete.id)
          }
        }
        return cat
      }))
      toast.success("FAQ deleted successfully")
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  // Reorder categories
  const moveCategoryUp = (index: number) => {
    if (index === 0) return
    const newCategories = [...categories]
    ;[newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]]
    setCategories(newCategories)
  }

  const moveCategoryDown = (index: number) => {
    if (index === categories.length - 1) return
    const newCategories = [...categories]
    ;[newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]]
    setCategories(newCategories)
  }

  // Reorder FAQs
  const moveFaqUp = (categoryId: string, faqIndex: number) => {
    if (faqIndex === 0) return
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const newFaqs = [...cat.faqs]
        ;[newFaqs[faqIndex - 1], newFaqs[faqIndex]] = [newFaqs[faqIndex], newFaqs[faqIndex - 1]]
        return { ...cat, faqs: newFaqs }
      }
      return cat
    }))
  }

  const moveFaqDown = (categoryId: string, faqIndex: number) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        if (faqIndex === cat.faqs.length - 1) return cat
        const newFaqs = [...cat.faqs]
        ;[newFaqs[faqIndex], newFaqs[faqIndex + 1]] = [newFaqs[faqIndex + 1], newFaqs[faqIndex]]
        return { ...cat, faqs: newFaqs }
      }
      return cat
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">FAQ Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage frequently asked questions displayed on the FAQ page
          </p>
        </div>
        <Button onClick={() => openCategoryDialog()} className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFaqs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Questions/Category</CardTitle>
            <MessageSquareText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCategories > 0 ? (totalFaqs / totalCategories).toFixed(1) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Categories</CardTitle>
          <CardDescription>
            Organize your FAQs by category. Drag to reorder or use the arrow buttons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="py-12 text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No FAQ categories yet</p>
              <Button onClick={() => openCategoryDialog()} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category, categoryIndex) => (
                <div key={category.id} className="rounded-lg border border-border">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 bg-muted/50 p-4">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex-1 flex items-center gap-2 text-left"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedCategories.includes(category.id) ? "rotate-180" : ""
                        }`}
                      />
                      <span className="font-medium text-foreground">{category.title}</span>
                      <Badge variant="secondary" className="ml-2">
                        {category.faqs.length} {category.faqs.length === 1 ? "question" : "questions"}
                      </Badge>
                    </button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveCategoryUp(categoryIndex)}
                        disabled={categoryIndex === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveCategoryDown(categoryIndex)}
                        disabled={categoryIndex === categories.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openCategoryDialog(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog("category", category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Category Content (FAQs) */}
                  {expandedCategories.includes(category.id) && (
                    <div className="border-t border-border p-4">
                      {category.faqs.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-sm text-muted-foreground">No questions in this category</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3 gap-2"
                            onClick={() => openFaqDialog(category.id)}
                          >
                            <Plus className="h-4 w-4" />
                            Add Question
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {category.faqs.map((faq, faqIndex) => (
                            <div 
                              key={faq.id} 
                              className="flex items-start gap-3 rounded-lg border border-border bg-background p-4"
                            >
                              <GripVertical className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground cursor-move" />
                              
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground">{faq.question}</p>
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => moveFaqUp(category.id, faqIndex)}
                                  disabled={faqIndex === 0}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => moveFaqDown(category.id, faqIndex)}
                                  disabled={faqIndex === category.faqs.length - 1}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => openFaqDialog(category.id, faq)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => openDeleteDialog("faq", faq.id, category.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 gap-2"
                            onClick={() => openFaqDialog(category.id)}
                          >
                            <Plus className="h-4 w-4" />
                            Add Question
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? "Update the category name" 
                : "Create a new FAQ category to organize your questions"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-title">Category Title</Label>
              <Input
                id="category-title"
                value={categoryTitle}
                onChange={(e) => setCategoryTitle(e.target.value)}
                placeholder="e.g., General, For Buyers, Billing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCategory} className="gap-2">
              <Save className="h-4 w-4" />
              {editingCategory ? "Save Changes" : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit Question" : "Add Question"}</DialogTitle>
            <DialogDescription>
              {editingFaq 
                ? "Update the question and answer" 
                : "Add a new FAQ to this category"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="faq-question">Question</Label>
              <Input
                id="faq-question"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
                placeholder="e.g., How do I reset my password?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-answer">Answer</Label>
              <Textarea
                id="faq-answer"
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                placeholder="Provide a clear and helpful answer..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveFaq} className="gap-2">
              <Save className="h-4 w-4" />
              {editingFaq ? "Save Changes" : "Add Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === "category" 
                ? "This will delete the category and all questions within it. This action cannot be undone."
                : "This will permanently delete this question. This action cannot be undone."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
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
