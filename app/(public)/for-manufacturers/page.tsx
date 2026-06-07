import { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ManufacturerPageContent } from "@/components/home/manufacturer-page-content"

export const metadata: Metadata = {
  title: "For Manufacturers - Reach Global Buyers",
  description: "Showcase your factory, upload products, receive inquiries, and connect with buyers worldwide through SourceNest's premium B2B platform.",
}

export default function ForManufacturersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ManufacturerPageContent />
      <Footer />
    </div>
  )
}
