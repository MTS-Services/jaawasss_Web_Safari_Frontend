"use client"

import { use } from "react"
import { RfqDetail } from "@/components/rfqs/rfq-detail"

export default function ManufacturerInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  
  return (
    <div className="py-6">
      <RfqDetail
        rfqId={resolvedParams.id}
        config={{
          basePath: "/dashboard/manufacturer/inquiries",
          role: "manufacturer",
        }}
      />
    </div>
  )
}
