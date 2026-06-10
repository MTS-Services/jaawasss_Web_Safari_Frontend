"use client"

import { RfqList, type RfqListConfig } from "@/components/rfqs/rfq-list"

const config: RfqListConfig = {
  role: "admin",
  basePath: "/admin/rfqs",
  listTitle: "Platform RFQs",
  listSubtitle: "Monitor all buyer requests and manufacturer quotes",
}

export default function AdminRfqsPage() {
  return (
    <div className="py-6">
      <RfqList config={config} />
    </div>
  )
}
