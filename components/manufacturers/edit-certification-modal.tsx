"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  updateCertificate,
  fetchCertificateTypes,
  CertificateType,
  Certificate,
  UpdateCertificatePayload,
} from "@/lib/api/manufacturer-certificates"

interface EditCertificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificate: Certificate | null
  onSuccess?: (certificate: Certificate) => void
}

export function EditCertificationModal({
  open,
  onOpenChange,
  certificate,
  onSuccess,
}: EditCertificationModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([])
  const [typesLoading, setTypesLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>("")

  const [formData, setFormData] = useState({
    certificate_type_id: "",
    issuing_body: "",
    certificate_number: "",
    issue_date: "",
    expiry_date: "",
    notes: "",
  })

  // Pre-fill form when certificate changes
  useEffect(() => {
    if (certificate) {
      setFormData({
        certificate_type_id: certificate.certificate_type_id.toString(),
        issuing_body: certificate.issuing_body ?? "",
        certificate_number: certificate.certificate_number ?? "",
        issue_date: certificate.issue_date ?? "",
        expiry_date: certificate.expiry_date ?? "",
        notes: certificate.notes ?? "",
      })
      setSelectedFile(null)
      setFileError("")
    }
  }, [certificate])

  // Fetch certificate types when modal opens
  useEffect(() => {
    if (open && certificateTypes.length === 0) {
      setTypesLoading(true)
      fetchCertificateTypes()
        .then(setCertificateTypes)
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to load certificate types",
          })
        })
        .finally(() => setTypesLoading(false))
    }
  }, [open, certificateTypes.length, toast])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileError("")

    if (!file) {
      setSelectedFile(null)
      return
    }

    if (!file.type.includes("pdf")) {
      setFileError("Only PDF files are allowed")
      event.target.value = ""
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setFileError("File size must be less than 5MB")
      event.target.value = ""
      return
    }

    setSelectedFile(file)
  }

  const handleSubmit = async () => {
    if (!certificate) return

    if (!formData.certificate_type_id) {
      toast({ variant: "destructive", title: "Error", description: "Please select a certificate type" })
      return
    }
    if (!formData.issuing_body.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter the issuing body" })
      return
    }
    if (!formData.certificate_number.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter the certificate number" })
      return
    }
    if (!formData.issue_date) {
      toast({ variant: "destructive", title: "Error", description: "Please enter the issue date" })
      return
    }
    if (!formData.expiry_date) {
      toast({ variant: "destructive", title: "Error", description: "Please enter the expiry date" })
      return
    }
    if (new Date(formData.issue_date) > new Date(formData.expiry_date)) {
      toast({ variant: "destructive", title: "Error", description: "Expiry date must be after issue date" })
      return
    }

    try {
      setIsLoading(true)

      const payload: UpdateCertificatePayload = {
        certificate_type_id: parseInt(formData.certificate_type_id),
        issuing_body: formData.issuing_body.trim(),
        certificate_number: formData.certificate_number.trim(),
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date,
        notes: formData.notes.trim() || undefined,
        certificate_pdf: selectedFile || undefined,
      }

      const updated = await updateCertificate(certificate.id, payload)

      toast({ title: "Success", description: "Certificate updated successfully" })
      onOpenChange(false)
      onSuccess?.(updated)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update certificate",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Certification</DialogTitle>
          <DialogDescription>
            Update the details of your certification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Certificate Type */}
          <div>
            <Label htmlFor="edit-cert-type">Certificate Type *</Label>
            <Select
              value={formData.certificate_type_id}
              onValueChange={(value) =>
                setFormData({ ...formData, certificate_type_id: value })
              }
              disabled={typesLoading || isLoading}
            >
              <SelectTrigger id="edit-cert-type" className="mt-2">
                <SelectValue placeholder="Select certificate type" />
              </SelectTrigger>
              <SelectContent>
                {typesLoading ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading...</div>
                ) : certificateTypes.length > 0 ? (
                  certificateTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id.toString()}
                      disabled={type.status === "inactive"}
                    >
                      {type.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No certificate types available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Issuing Body */}
          <div>
            <Label htmlFor="edit-issuing-body">Issuing Body *</Label>
            <Input
              id="edit-issuing-body"
              placeholder="e.g., SGS, TUV, Bureau Veritas"
              value={formData.issuing_body}
              onChange={(e) => setFormData({ ...formData, issuing_body: e.target.value })}
              className="mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Certificate Number */}
          <div>
            <Label htmlFor="edit-cert-number">Certificate Number *</Label>
            <Input
              id="edit-cert-number"
              placeholder="e.g., ISO-9001-2023-12345"
              value={formData.certificate_number}
              onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
              className="mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-issue-date">Issue Date *</Label>
              <Input
                id="edit-issue-date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className="mt-2"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="edit-expiry-date">Expiry Date *</Label>
              <Input
                id="edit-expiry-date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="mt-2"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="edit-cert-file">Replace Certificate PDF</Label>
            <label
              htmlFor="edit-cert-file"
              className="mt-2 block rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-secondary transition-colors cursor-pointer"
            >
              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : "Click to upload a new PDF (optional)"}
              </p>
              <p className="text-xs text-muted-foreground">PDF up to 5MB</p>
              <input
                id="edit-cert-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
            </label>
            {fileError && <p className="mt-1 text-sm text-red-500">{fileError}</p>}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              placeholder="Add any notes about this certification..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-2"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
