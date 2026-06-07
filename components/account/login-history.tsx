"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type LoginEntry = {
  id: number
  ip_address: string
  user_agent: string
  device_name: string | null
  logged_in_at: string
}

export default function AccountLoginHistory({ backHref }: { backHref: string }) {
  const [items, setItems] = useState<LoginEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await apiClient.get(`/account/login-history?page=${page}`)
        if (cancelled) return
        const payload = res.data
        setItems(Array.isArray(payload.data) ? payload.data : [])
        setMeta(payload.meta ?? null)
      } catch (err) {
        setItems([])
        setMeta(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [page])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Login History</h1>
          <p className="mt-1 text-sm text-muted-foreground">Recent sign-ins for this account</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href={backHref}>Back to Settings</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Logins</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Device / Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                        No login history found
                      </TableCell>
                    </TableRow>
                  )}
                  {items.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell className="whitespace-nowrap">{it.logged_in_at}</TableCell>
                      <TableCell className="whitespace-nowrap">{it.ip_address}</TableCell>
                      <TableCell className="max-w-0 truncate">{it.device_name ?? it.user_agent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {meta && (
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.links || !meta.links.find((l: any) => l.active && l.page > 1)}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {meta.current_page}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
