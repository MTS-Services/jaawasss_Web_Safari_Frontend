"use client"

import { useCallback, useEffect, useState } from "react"
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
import {
  createAdminFaq,
  createAdminFaqCategory,
  deleteAdminFaq,
  deleteAdminFaqCategory,
  getAdminFaqCategories,
  moveAdminFaqCategoryPosition,
  moveAdminFaqPosition,
  updateAdminFaq,
  updateAdminFaqCategory,
} from "@/lib/api/admin-faqs"
import Swal from "sweetalert2"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableItem(props: { id: string; children: (props: any) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: "relative" as const,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {props.children({ attributes, listeners })}
    </div>
  )
}

interface FAQ {
  id: string
  question: string
  answer: string
  sort: number
}

interface FAQCategory {
  id: string
  name: string
  slug: string
  sort: number
  faqs: FAQ[]
}

interface DeleteTarget {
  type: "category" | "faq"
  id: string
  categoryId?: string
}

function createSlug(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

  if (normalized.length > 0) {
    return normalized
  }

  return `category-${Date.now()}`
}

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

export default function AdminFaqPage() {
  const [categories, setCategories] = useState<FAQCategory[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  
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
  const [itemToDelete, setItemToDelete] = useState<DeleteTarget | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const loadCategories = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoading(true)
    }

    const response = await getAdminFaqCategories()
    if (response.success) {
      const normalizedCategories: FAQCategory[] = response.data
        .map((category, index) => ({ ...category, tempOrder: index }))
        .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0) || a.tempOrder - b.tempOrder)
        .map((category, categoryIndex) => ({
          id: String(category.id),
          name: (category.name || "").trim().length > 0 ? category.name : "None",
          slug: category.slug,
          sort: Number.isFinite(category.sort) ? category.sort : categoryIndex,
          faqs: (category.faqs || [])
            .map((faq, faqIndex) => ({ ...faq, tempOrder: faqIndex }))
            .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0) || a.tempOrder - b.tempOrder)
            .map((faq, faqIndex) => ({
              id: String(faq.id),
              question: (faq.question || "").trim().length > 0 ? faq.question : "None",
              answer: (faq.answer || "").trim().length > 0 ? faq.answer : "None",
              sort: Number.isFinite(faq.sort) ? faq.sort : faqIndex,
            })),
        }))

      setCategories(normalizedCategories)
    } else {
      showErrorAlert(response.message || "Failed to fetch FAQ categories")
      if (!silent) {
        setCategories([])
      }
    }

    if (!silent) {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

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
      setCategoryTitle(category.name)
    } else {
      setEditingCategory(null)
      setCategoryTitle("")
    }
    setCategoryDialogOpen(true)
  }

  const saveCategory = async () => {
    if (isSaving) {
      return
    }

    if (!categoryTitle.trim()) {
      showErrorAlert("Please enter a category title")
      return
    }

    const trimmedTitle = categoryTitle.trim()

    setIsSaving(true)
    try {
      const response = editingCategory 
        ? await updateAdminFaqCategory(editingCategory.id, {
            name: trimmedTitle,
            slug: editingCategory.slug,
            sort: Number.isFinite(editingCategory.sort)
              ? editingCategory.sort
              : Math.max(0, categories.findIndex((cat) => cat.id === editingCategory.id)),
          })
        : await createAdminFaqCategory({
            name: trimmedTitle,
            slug: createSlug(trimmedTitle),
          })

      if (!response.success) {
        showErrorAlert(response.message || "Failed to save category")
        return
      }

      await loadCategories(true)
      showSuccessAlert(response.message || (editingCategory ? "Category updated successfully" : "Category added successfully"))
      setCategoryDialogOpen(false)
      setCategoryTitle("")
      setEditingCategory(null)
    } finally {
      setIsSaving(false)
    }
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

  const saveFaq = async () => {
    if (isSaving) {
      return
    }

    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      showErrorAlert("Please fill in both question and answer")
      return
    }

    if (!selectedCategoryId) {
      showErrorAlert("Please select a category")
      return
    }

    const trimmedQuestion = faqQuestion.trim()
    const trimmedAnswer = faqAnswer.trim()

    setIsSaving(true)
    try {
      const response = editingFaq
        ? await updateAdminFaq(editingFaq.id, {
            question: trimmedQuestion,
            answer: trimmedAnswer,
            faqCategoryId: selectedCategoryId,
          })
        : await createAdminFaq({
            question: trimmedQuestion,
            answer: trimmedAnswer,
            faqCategoryId: selectedCategoryId,
          })

      if (!response.success) {
        showErrorAlert(response.message || "Failed to save FAQ")
        return
      }

      await loadCategories(true)
      showSuccessAlert(response.message || (editingFaq ? "FAQ updated successfully" : "FAQ added successfully"))
      setFaqDialogOpen(false)
      setFaqQuestion("")
      setFaqAnswer("")
      setEditingFaq(null)
      setExpandedCategories((prev) => (prev.includes(selectedCategoryId) ? prev : [...prev, selectedCategoryId]))
    } finally {
      setIsSaving(false)
    }
  }

  // Delete handlers
  const openDeleteDialog = (type: "category" | "faq", id: string, categoryId?: string) => {
    setItemToDelete({ type, id, categoryId })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete || isDeleting) {
      return
    }

    setIsDeleting(true)
    try {
      const response = itemToDelete.type === "category"
        ? await deleteAdminFaqCategory(itemToDelete.id)
        : await deleteAdminFaq(itemToDelete.id)

      if (!response.success) {
        showErrorAlert(response.message || "Failed to delete item")
        return
      }

      await loadCategories(true)
      showSuccessAlert(response.message || (itemToDelete.type === "category" ? "Category deleted successfully" : "FAQ deleted successfully"))
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  // Reorder categories
  const moveCategoryUp = async (categoryId: string) => {
    if (isReordering) return

    const index = categories.findIndex((c) => String(c.id) === String(categoryId))
    if (index <= 0) return

    const category = categories[index]
    const newIndex = index - 1
    const targetCategory = categories[newIndex]
    const currentPosition = category.sort
    const newPosition = targetCategory?.sort

    setCategories((prev) => arrayMove(prev, index, newIndex))
    setIsReordering(true)
    try {
      if (!Number.isFinite(currentPosition) || !Number.isFinite(newPosition)) {
        showErrorAlert("Invalid category positions for reordering")
        await loadCategories(true)
        return
      }

      const response = await moveAdminFaqCategoryPosition(category.id, currentPosition, newPosition)
      if (!response.success) {
        showErrorAlert(response.message || "Failed to reorder category")
      }
      await loadCategories(true)
    } finally {
      setIsReordering(false)
    }
  }


  const moveCategoryDown = async (categoryId: string) => {
    if (isReordering) return

    const index = categories.findIndex((c) => String(c.id) === String(categoryId))
    if (index === -1 || index === categories.length - 1) return

    const category = categories[index]
    const newIndex = index + 1
    const targetCategory = categories[newIndex]
    const currentPosition = category.sort
    const newPosition = targetCategory?.sort

    setCategories((prev) => arrayMove(prev, index, newIndex))
    setIsReordering(true)
    try {
      if (!Number.isFinite(currentPosition) || !Number.isFinite(newPosition)) {
        showErrorAlert("Invalid category positions for reordering")
        await loadCategories(true)
        return
      }

      const response = await moveAdminFaqCategoryPosition(category.id, currentPosition, newPosition)
      if (!response.success) {
        showErrorAlert(response.message || "Failed to reorder category")
      }
      await loadCategories(true)
    } finally {
      setIsReordering(false)
    }
  }

  // Reorder FAQs
  const moveFaqUp = async (categoryId: string, faqId: string) => {
    if (isReordering) return

    const category = categories.find((cat) => cat.id === categoryId)
    if (!category) return

    const faqIndex = category.faqs.findIndex((f) => String(f.id) === String(faqId))
    if (faqIndex <= 0) return

    const faq = category.faqs[faqIndex]
    const newIndex = faqIndex - 1

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          return { ...c, faqs: arrayMove(c.faqs, faqIndex, newIndex) }
        }
        return c
      })
    )

    setIsReordering(true)
    try {
      const response = await moveAdminFaqPosition(faq.id, faqIndex + 1, newIndex + 1, categoryId)
      if (!response.success) {
        showErrorAlert(response.message || "Failed to reorder FAQ")
        await loadCategories(true)
      }
    } finally {
      setIsReordering(false)
    }
  }

  const moveFaqDown = async (categoryId: string, faqId: string) => {
    if (isReordering) return

    const category = categories.find((cat) => cat.id === categoryId)
    if (!category) return

    const faqIndex = category.faqs.findIndex((f) => String(f.id) === String(faqId))
    if (faqIndex === -1 || faqIndex === category.faqs.length - 1) return

    const faq = category.faqs[faqIndex]
    const newIndex = faqIndex + 1

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId) {
          return { ...c, faqs: arrayMove(c.faqs, faqIndex, newIndex) }
        }
        return c
      })
    )

    setIsReordering(true)
    try {
      const response = await moveAdminFaqPosition(faq.id, faqIndex + 1, newIndex + 1, categoryId)
      if (!response.success) {
        showErrorAlert(response.message || "Failed to reorder FAQ")
        await loadCategories(true)
      }
    } finally {
      setIsReordering(false)
    }
  }

  const handleDragEndCategory = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = categories.findIndex((c) => c.id === active.id)
    const newIndex = categories.findIndex((c) => c.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const activeCategory = categories[oldIndex]
      const targetCategory = categories[newIndex]
      const currentPosition = activeCategory?.sort
      const newPosition = targetCategory?.sort

      setCategories((items) => arrayMove(items, oldIndex, newIndex))
      setIsReordering(true)
      try {
        if (!Number.isFinite(currentPosition) || !Number.isFinite(newPosition)) {
          showErrorAlert("Invalid category positions for reordering")
          await loadCategories(true)
          return
        }

        const response = await moveAdminFaqCategoryPosition(String(active.id), currentPosition, newPosition)
        if (!response.success) {
          showErrorAlert(response.message || "Failed to reorder category")
        }
        await loadCategories(true)
      } finally {
        setIsReordering(false)
      }
    }
  }

  const handleDragEndFaq = async (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    const oldIndex = category.faqs.findIndex((f) => f.id === active.id)
    const newIndex = category.faqs.findIndex((f) => f.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id === categoryId) {
            return {
              ...c,
              faqs: arrayMove(c.faqs, oldIndex, newIndex),
            }
          }
          return c
        })
      )

      setIsReordering(true)
      try {
        // Use 1-based positions (index + 1) as many backends treat 'position' as 1-indexed
        const response = await moveAdminFaqPosition(String(active.id), oldIndex + 1, newIndex + 1, categoryId)
        if (!response.success) {
          showErrorAlert(response.message || "Failed to reorder FAQ")
          await loadCategories(true)
        }
      } finally {
        setIsReordering(false)
      }
    }
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
        <Button
          onClick={() => openCategoryDialog()}
          className="gap-2"
          disabled={isLoading || isSaving || isReordering || isDeleting}
        >
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
          {isLoading ? (
            <div className="py-12 text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Loading FAQ categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No FAQ categories yet</p>
              <Button
                onClick={() => openCategoryDialog()}
                className="mt-4 gap-2"
                disabled={isSaving || isReordering || isDeleting}
              >
                <Plus className="h-4 w-4" />
                Add Your First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndCategory}>
                <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  {categories.map((category, categoryIndex) => (
                    <SortableItem key={category.id} id={category.id}>
                      {({ attributes, listeners }) => (
                        <div className="rounded-lg border border-border">
                          {/* Category Header */}
                          <div className="flex items-center gap-3 bg-muted/50 p-4">
                            <div {...attributes} {...listeners} className="cursor-move">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <button onClick={() => toggleCategory(category.id)} className="flex-1 flex items-center gap-2 text-left">
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform ${
                                  expandedCategories.includes(category.id) ? "rotate-180" : ""
                                }`}
                              />
                              <span className="font-medium text-foreground">{category.name}</span>
                              <Badge variant="secondary" className="ml-2">
                                {category.faqs.length} {category.faqs.length === 1 ? "question" : "questions"}
                              </Badge>
                            </button>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => moveCategoryUp(category.id)}
                                disabled={categoryIndex === 0 || isReordering || isSaving || isDeleting}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => moveCategoryDown(category.id)}
                                disabled={categoryIndex === categories.length - 1 || isReordering || isSaving || isDeleting}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openCategoryDialog(category)}
                                disabled={isSaving || isReordering || isDeleting}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => openDeleteDialog("category", category.id)}
                                disabled={isSaving || isReordering || isDeleting}
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
                                    disabled={isSaving || isReordering || isDeleting}
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add Question
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={(e) => handleDragEndFaq(e, category.id)}
                                  >
                                    <SortableContext items={category.faqs.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                                      {category.faqs.map((faq, faqIndex) => (
                                        <SortableItem key={faq.id} id={faq.id}>
                                          {({ attributes, listeners }) => (
                                            <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                                              <div {...attributes} {...listeners} className="cursor-move mt-1">
                                                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                                              </div>

                                              <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground">{faq.question}</p>
                                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                                              </div>

                                              <div className="flex items-center gap-1 shrink-0">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8"
                                                  onClick={() => moveFaqUp(category.id, faq.id)}
                                                  disabled={faqIndex === 0 || isReordering || isSaving || isDeleting}
                                                >
                                                  <ChevronUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8"
                                                  onClick={() => moveFaqDown(category.id, faq.id)}
                                                  disabled={faqIndex === category.faqs.length - 1 || isReordering || isSaving || isDeleting}
                                                >
                                                  <ChevronDown className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8"
                                                  onClick={() => openFaqDialog(category.id, faq)}
                                                  disabled={isSaving || isReordering || isDeleting}
                                                >
                                                  <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                                  onClick={() => openDeleteDialog("faq", faq.id, category.id)}
                                                  disabled={isSaving || isReordering || isDeleting}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          )}
                                        </SortableItem>
                                      ))}
                                    </SortableContext>
                                  </DndContext>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 gap-2"
                                    onClick={() => openFaqDialog(category.id)}
                                    disabled={isSaving || isReordering || isDeleting}
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add Question
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
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
            <Button onClick={() => void saveCategory()} className="gap-2" disabled={isSaving}>
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
            <Button onClick={() => void saveFaq()} className="gap-2" disabled={isSaving}>
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
              onClick={() => void confirmDelete()}
              disabled={isDeleting}
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
