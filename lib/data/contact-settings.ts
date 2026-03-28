export interface ContactInfo {
  id: string
  type: "email" | "phone" | "address" | "custom"
  label: string
  value: string
  link?: string
  icon: "mail" | "phone" | "map-pin" | "globe" | "clock" | "message-square"
  enabled: boolean
  order: number
}

export interface InquiryType {
  id: string
  value: string
  label: string
  icon: "message-square" | "building-2" | "help-circle" | "handshake" | "briefcase" | "users"
  enabled: boolean
  order: number
}

export interface FormField {
  id: string
  name: string
  label: string
  type: "text" | "email" | "tel" | "textarea" | "select"
  placeholder: string
  required: boolean
  enabled: boolean
  order: number
}

export interface ContactPageSettings {
  heroTitle: string
  heroSubtitle: string
  sidebarTitle: string
  sidebarDescription: string
  inquiryTypesTitle: string
  successTitle: string
  successMessage: string
  submitButtonText: string
  formEnabled: boolean
}

export const defaultContactInfo: ContactInfo[] = [
  {
    id: "email-main",
    type: "email",
    label: "Email",
    value: "hello@sourcenest.com",
    link: "mailto:hello@sourcenest.com",
    icon: "mail",
    enabled: true,
    order: 1,
  },
  {
    id: "phone-main",
    type: "phone",
    label: "Phone",
    value: "+1 (555) 123-4567",
    link: "tel:+1-555-123-4567",
    icon: "phone",
    enabled: true,
    order: 2,
  },
  {
    id: "address-main",
    type: "address",
    label: "Office",
    value: "123 Trade Center Drive\nSuite 400\nNew York, NY 10001",
    icon: "map-pin",
    enabled: true,
    order: 3,
  },
]

export const defaultInquiryTypes: InquiryType[] = [
  {
    id: "general",
    value: "general",
    label: "General Inquiry",
    icon: "message-square",
    enabled: true,
    order: 1,
  },
  {
    id: "sales",
    value: "sales",
    label: "Sales Inquiry",
    icon: "building-2",
    enabled: true,
    order: 2,
  },
  {
    id: "support",
    value: "support",
    label: "Support Request",
    icon: "help-circle",
    enabled: true,
    order: 3,
  },
  {
    id: "partnership",
    value: "partnership",
    label: "Partnership Inquiry",
    icon: "handshake",
    enabled: true,
    order: 4,
  },
]

export const defaultFormFields: FormField[] = [
  {
    id: "name",
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "John Smith",
    required: true,
    enabled: true,
    order: 1,
  },
  {
    id: "email",
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "john@company.com",
    required: true,
    enabled: true,
    order: 2,
  },
  {
    id: "company",
    name: "company",
    label: "Company Name",
    type: "text",
    placeholder: "Your Company",
    required: false,
    enabled: true,
    order: 3,
  },
  {
    id: "phone",
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
    required: false,
    enabled: false,
    order: 4,
  },
  {
    id: "inquiryType",
    name: "inquiryType",
    label: "Inquiry Type",
    type: "select",
    placeholder: "Select type",
    required: true,
    enabled: true,
    order: 5,
  },
  {
    id: "message",
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "How can we help you?",
    required: true,
    enabled: true,
    order: 6,
  },
]

export const defaultPageSettings: ContactPageSettings = {
  heroTitle: "Contact Us",
  heroSubtitle: "Have a question or need assistance? We're here to help.",
  sidebarTitle: "Get in Touch",
  sidebarDescription: "Reach out to us through the form or use our direct contact information below.",
  inquiryTypesTitle: "How Can We Help?",
  successTitle: "Message Sent!",
  successMessage: "Thank you for reaching out. We'll get back to you within 24-48 hours.",
  submitButtonText: "Send Message",
  formEnabled: true,
}
