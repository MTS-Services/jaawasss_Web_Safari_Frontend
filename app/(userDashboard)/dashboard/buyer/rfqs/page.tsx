"use client"

import { RfqList, type RfqListConfig } from "@/components/rfqs/rfq-list"

const config: RfqListConfig = {
  role: "buyer",
  roleId: "buyer@demo.com", // Dummy auth user
  basePath: "/dashboard/buyer/rfqs",
  listTitle: "My RFQs",
  listSubtitle: "Track and manage your requests for quote",
  createLabel: "Submit RFQ",
}

export default function BuyerRfqsPage() {
  return (
    <div className="py-6">
      <RfqList config={config} />
    </div>
  )
}
