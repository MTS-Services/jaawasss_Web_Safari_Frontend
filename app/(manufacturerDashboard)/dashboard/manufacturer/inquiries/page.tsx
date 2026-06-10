"use client"

import { RfqList, type RfqListConfig } from "@/components/rfqs/rfq-list"

const config: RfqListConfig = {
  role: "manufacturer",
  roleId: "mfr-1", // Matches the seed data supplierId
  basePath: "/dashboard/manufacturer/inquiries",
  listTitle: "Buyer Inquiries",
  listSubtitle: "Review requests and submit your quotes",
}

export default function ManufacturerInquiriesPage() {
  return (
    <div className="py-6">
      <RfqList config={config} />
    </div>
  )
}
