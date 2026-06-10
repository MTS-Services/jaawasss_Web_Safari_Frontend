"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Plus, 
  Pencil, 
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  MessageSquare,
  Building2,
  HelpCircle,
  Handshake,
  Briefcase,
  Users,
  Globe,
  Clock,
  FileText,
  Settings2,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import {
  type ContactInfo,
  type InquiryType,
  type FormField,
  type ContactPageSettings,
  defaultContactInfo,
  defaultInquiryTypes,
  defaultFormFields,
  defaultPageSettings,
} from "@/lib/data/contact-settings"

const iconOptions = {
  contact: [
    { value: "mail", label: "Mail", icon: Mail },
    { value: "phone", label: "Phone", icon: Phone },
    { value: "map-pin", label: "Location", icon: MapPin },
    { value: "globe", label: "Website", icon: Globe },
    { value: "clock", label: "Hours", icon: Clock },
    { value: "message-square", label: "Message", icon: MessageSquare },
  ],
  inquiry: [
    { value: "message-square", label: "General", icon: MessageSquare },
    { value: "building-2", label: "Sales", icon: Building2 },
    { value: "help-circle", label: "Support", icon: HelpCircle },
    { value: "handshake", label: "Partnership", icon: Handshake },
    { value: "briefcase", label: "Business", icon: Briefcase },
    { value: "users", label: "Team", icon: Users },
  ],
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "mail": Mail,
    "phone": Phone,
    "map-pin": MapPin,
    "globe": Globe,
    "clock": Clock,
    "message-square": MessageSquare,
    "building-2": Building2,
    "help-circle": HelpCircle,
    "handshake": Handshake,
    "briefcase": Briefcase,
    "users": Users,
  }
  return iconMap[iconName] || MessageSquare
}

export default function AdminContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>(defaultContactInfo)
  const [inquiryTypes, setInquiryTypes] = useState<InquiryType[]>(defaultInquiryTypes)
  const [formFields, setFormFields] = useState<FormField[]>(defaultFormFields)
  const [pageSettings, setPageSettings] = useState<ContactPageSettings>(defaultPageSettings)
  
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null)
  const [editingInquiry, setEditingInquiry] = useState<InquiryType | null>(null)
  const [editingField, setEditingField] = useState<FormField | null>(null)
  
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false)
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false)
  
  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState("")

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSavedMessage("Settings saved successfully!")
    setTimeout(() => setSavedMessage(""), 3000)
  }

  const toggleContactEnabled = (id: string) => {
    setContactInfo(contactInfo.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ))
  }

  const toggleInquiryEnabled = (id: string) => {
    setInquiryTypes(inquiryTypes.map(i => 
      i.id === id ? { ...i, enabled: !i.enabled } : i
    ))
  }

  const toggleFieldEnabled = (id: string) => {
    setFormFields(formFields.map(f => 
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ))
  }

  const moveItem = <T extends { id: string; order: number }>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    id: string,
    direction: "up" | "down"
  ) => {
    const sorted = [...items].sort((a, b) => a.order - b.order)
    const index = sorted.findIndex(item => item.id === id)
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sorted.length - 1)
    ) return

    const swapIndex = direction === "up" ? index - 1 : index + 1
    const temp = sorted[index].order
    sorted[index].order = sorted[swapIndex].order
    sorted[swapIndex].order = temp
    setItems([...sorted])
  }

  const saveContact = () => {
    if (!editingContact) return
    if (editingContact.id.startsWith("new-")) {
      const newId = `contact-${Date.now()}`
      setContactInfo([...contactInfo, { ...editingContact, id: newId }])
    } else {
      setContactInfo(contactInfo.map(c => c.id === editingContact.id ? editingContact : c))
    }
    setEditingContact(null)
    setContactDialogOpen(false)
  }

  const deleteContact = (id: string) => {
    setContactInfo(contactInfo.filter(c => c.id !== id))
  }

  const saveInquiry = () => {
    if (!editingInquiry) return
    if (editingInquiry.id.startsWith("new-")) {
      const newId = `inquiry-${Date.now()}`
      setInquiryTypes([...inquiryTypes, { ...editingInquiry, id: newId, value: editingInquiry.label.toLowerCase().replace(/\s+/g, "-") }])
    } else {
      setInquiryTypes(inquiryTypes.map(i => i.id === editingInquiry.id ? editingInquiry : i))
    }
    setEditingInquiry(null)
    setInquiryDialogOpen(false)
  }

  const deleteInquiry = (id: string) => {
    setInquiryTypes(inquiryTypes.filter(i => i.id !== id))
  }

  const saveField = () => {
    if (!editingField) return
    if (editingField.id.startsWith("new-")) {
      const newId = `field-${Date.now()}`
      setFormFields([...formFields, { ...editingField, id: newId, name: editingField.label.toLowerCase().replace(/\s+/g, "") }])
    } else {
      setFormFields(formFields.map(f => f.id === editingField.id ? editingField : f))
    }
    setEditingField(null)
    setFieldDialogOpen(false)
  }

  const deleteField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Page Settings</h1>
          <p className="text-muted-foreground">Manage contact information, form fields, and page content</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMessage && (
            <Badge variant="secondary" className="bg-secondary/20 text-secondary">
              {savedMessage}
            </Badge>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="contact-info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contact-info" className="gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Contact Info</span>
          </TabsTrigger>
          <TabsTrigger value="inquiry-types" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Inquiry Types</span>
          </TabsTrigger>
          <TabsTrigger value="form-fields" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Form Fields</span>
          </TabsTrigger>
          <TabsTrigger value="page-settings" className="gap-2">
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Page Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Contact Information Tab */}
        <TabsContent value="contact-info" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Email, phone, address, and other contact details</CardDescription>
              </div>
              <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setEditingContact({
                      id: `new-${Date.now()}`,
                      type: "custom",
                      label: "",
                      value: "",
                      link: "",
                      icon: "mail",
                      enabled: true,
                      order: contactInfo.length + 1,
                    })}
                  >
                    <Plus className="h-4 w-4" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingContact?.id.startsWith("new-") ? "Add" : "Edit"} Contact Information</DialogTitle>
                    <DialogDescription>Configure the contact detail that will appear on the page</DialogDescription>
                  </DialogHeader>
                  {editingContact && (
                    <div className="space-y-4 py-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input 
                            value={editingContact.label}
                            onChange={(e) => setEditingContact({ ...editingContact, label: e.target.value })}
                            placeholder="e.g., Email, Phone, Office"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select 
                            value={editingContact.icon}
                            onValueChange={(value: ContactInfo["icon"]) => setEditingContact({ ...editingContact, icon: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.contact.map((opt) => (
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
                      <div className="space-y-2">
                        <Label>Value / Content</Label>
                        <Textarea 
                          value={editingContact.value}
                          onChange={(e) => setEditingContact({ ...editingContact, value: e.target.value })}
                          placeholder="Enter the contact information (use line breaks for addresses)"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Link (optional)</Label>
                        <Input 
                          value={editingContact.link || ""}
                          onChange={(e) => setEditingContact({ ...editingContact, link: e.target.value })}
                          placeholder="e.g., mailto:hello@example.com or tel:+1234567890"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use mailto: for emails, tel: for phone numbers
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Enabled</Label>
                        <Switch 
                          checked={editingContact.enabled}
                          onCheckedChange={(checked) => setEditingContact({ ...editingContact, enabled: checked })}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setContactDialogOpen(false)}>Cancel</Button>
                    <Button onClick={saveContact}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead className="hidden md:table-cell">Value</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...contactInfo].sort((a, b) => a.order - b.order).map((contact) => {
                    const IconComponent = getIconComponent(contact.icon)
                    return (
                      <TableRow key={contact.id} className={!contact.enabled ? "opacity-50" : ""}>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => moveItem(contactInfo, setContactInfo, contact.id, "up")}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => moveItem(contactInfo, setContactInfo, contact.id, "down")}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                              <IconComponent className="h-4 w-4 text-secondary" />
                            </div>
                            <span className="font-medium">{contact.label}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-muted-foreground line-clamp-1">{contact.value.replace(/\n/g, ", ")}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleContactEnabled(contact.id)}
                            className="gap-2"
                          >
                            {contact.enabled ? (
                              <>
                                <Eye className="h-4 w-4 text-secondary" />
                                <span className="text-secondary">Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Hidden</span>
                              </>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setEditingContact(contact)
                                setContactDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteContact(contact.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inquiry Types Tab */}
        <TabsContent value="inquiry-types" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Inquiry Types / Categories</CardTitle>
                <CardDescription>Types of inquiries visitors can select in the contact form</CardDescription>
              </div>
              <Dialog open={inquiryDialogOpen} onOpenChange={setInquiryDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setEditingInquiry({
                      id: `new-${Date.now()}`,
                      value: "",
                      label: "",
                      icon: "message-square",
                      enabled: true,
                      order: inquiryTypes.length + 1,
                    })}
                  >
                    <Plus className="h-4 w-4" />
                    Add Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingInquiry?.id.startsWith("new-") ? "Add" : "Edit"} Inquiry Type</DialogTitle>
                    <DialogDescription>Configure the inquiry category</DialogDescription>
                  </DialogHeader>
                  {editingInquiry && (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input 
                          value={editingInquiry.label}
                          onChange={(e) => setEditingInquiry({ ...editingInquiry, label: e.target.value })}
                          placeholder="e.g., General Inquiry, Sales, Support"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select 
                          value={editingInquiry.icon}
                          onValueChange={(value: InquiryType["icon"]) => setEditingInquiry({ ...editingInquiry, icon: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.inquiry.map((opt) => (
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
                      <div className="flex items-center justify-between">
                        <Label>Enabled</Label>
                        <Switch 
                          checked={editingInquiry.enabled}
                          onCheckedChange={(checked) => setEditingInquiry({ ...editingInquiry, enabled: checked })}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setInquiryDialogOpen(false)}>Cancel</Button>
                    <Button onClick={saveInquiry}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...inquiryTypes].sort((a, b) => a.order - b.order).map((inquiry) => {
                    const IconComponent = getIconComponent(inquiry.icon)
                    return (
                      <TableRow key={inquiry.id} className={!inquiry.enabled ? "opacity-50" : ""}>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => moveItem(inquiryTypes, setInquiryTypes, inquiry.id, "up")}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => moveItem(inquiryTypes, setInquiryTypes, inquiry.id, "down")}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-4 w-4 text-secondary" />
                            <span className="font-medium">{inquiry.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleInquiryEnabled(inquiry.id)}
                            className="gap-2"
                          >
                            {inquiry.enabled ? (
                              <>
                                <Eye className="h-4 w-4 text-secondary" />
                                <span className="text-secondary">Active</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Inactive</span>
                              </>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setEditingInquiry(inquiry)
                                setInquiryDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteInquiry(inquiry.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Fields Tab */}
        <TabsContent value="form-fields" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Contact Form Fields</CardTitle>
                <CardDescription>Configure which fields appear in the contact form</CardDescription>
              </div>
              <Dialog open={fieldDialogOpen} onOpenChange={setFieldDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setEditingField({
                      id: `new-${Date.now()}`,
                      name: "",
                      label: "",
                      type: "text",
                      placeholder: "",
                      required: false,
                      enabled: true,
                      order: formFields.length + 1,
                    })}
                  >
                    <Plus className="h-4 w-4" />
                    Add Field
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingField?.id.startsWith("new-") ? "Add" : "Edit"} Form Field</DialogTitle>
                    <DialogDescription>Configure the form field properties</DialogDescription>
                  </DialogHeader>
                  {editingField && (
                    <div className="space-y-4 py-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input 
                            value={editingField.label}
                            onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                            placeholder="e.g., Full Name, Email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Field Type</Label>
                          <Select 
                            value={editingField.type}
                            onValueChange={(value: FormField["type"]) => setEditingField({ ...editingField, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="tel">Phone</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Dropdown (Inquiry Type)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Placeholder</Label>
                        <Input 
                          value={editingField.placeholder}
                          onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                          placeholder="Placeholder text for the field"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Required</Label>
                        <Switch 
                          checked={editingField.required}
                          onCheckedChange={(checked) => setEditingField({ ...editingField, required: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Enabled</Label>
                        <Switch 
                          checked={editingField.enabled}
                          onCheckedChange={(checked) => setEditingField({ ...editingField, enabled: checked })}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setFieldDialogOpen(false)}>Cancel</Button>
                    <Button onClick={saveField}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead>Field Label</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Required</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...formFields].sort((a, b) => a.order - b.order).map((field) => (
                    <TableRow key={field.id} className={!field.enabled ? "opacity-50" : ""}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => moveItem(formFields, setFormFields, field.id, "up")}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => moveItem(formFields, setFormFields, field.id, "down")}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{field.label}</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="capitalize">{field.type}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {field.required ? (
                          <Badge variant="secondary">Required</Badge>
                        ) : (
                          <span className="text-muted-foreground">Optional</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFieldEnabled(field.id)}
                          className="gap-2"
                        >
                          {field.enabled ? (
                            <>
                              <Eye className="h-4 w-4 text-secondary" />
                              <span className="text-secondary">Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Hidden</span>
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingField(field)
                              setFieldDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteField(field.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Settings Tab */}
        <TabsContent value="page-settings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Title and subtitle at the top of the page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input 
                    value={pageSettings.heroTitle}
                    onChange={(e) => setPageSettings({ ...pageSettings, heroTitle: e.target.value })}
                    placeholder="Contact Us"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea 
                    value={pageSettings.heroSubtitle}
                    onChange={(e) => setPageSettings({ ...pageSettings, heroSubtitle: e.target.value })}
                    placeholder="Page description"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sidebar Content</CardTitle>
                <CardDescription>Text displayed next to the contact form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Sidebar Title</Label>
                  <Input 
                    value={pageSettings.sidebarTitle}
                    onChange={(e) => setPageSettings({ ...pageSettings, sidebarTitle: e.target.value })}
                    placeholder="Get in Touch"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sidebar Description</Label>
                  <Textarea 
                    value={pageSettings.sidebarDescription}
                    onChange={(e) => setPageSettings({ ...pageSettings, sidebarDescription: e.target.value })}
                    placeholder="Description text"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Inquiry Types Section Title</Label>
                  <Input 
                    value={pageSettings.inquiryTypesTitle}
                    onChange={(e) => setPageSettings({ ...pageSettings, inquiryTypesTitle: e.target.value })}
                    placeholder="How Can We Help?"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Message</CardTitle>
                <CardDescription>Shown after form submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Success Title</Label>
                  <Input 
                    value={pageSettings.successTitle}
                    onChange={(e) => setPageSettings({ ...pageSettings, successTitle: e.target.value })}
                    placeholder="Message Sent!"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Success Message</Label>
                  <Textarea 
                    value={pageSettings.successMessage}
                    onChange={(e) => setPageSettings({ ...pageSettings, successMessage: e.target.value })}
                    placeholder="Thank you for reaching out..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
                <CardDescription>General form configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Submit Button Text</Label>
                  <Input 
                    value={pageSettings.submitButtonText}
                    onChange={(e) => setPageSettings({ ...pageSettings, submitButtonText: e.target.value })}
                    placeholder="Send Message"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label>Contact Form Enabled</Label>
                    <p className="text-sm text-muted-foreground">Show or hide the entire contact form</p>
                  </div>
                  <Switch 
                    checked={pageSettings.formEnabled}
                    onCheckedChange={(checked) => setPageSettings({ ...pageSettings, formEnabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
