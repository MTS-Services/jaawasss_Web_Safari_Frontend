"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Factory, Loader2 } from "lucide-react"
import {
  REGISTER_SUCCESS_STORAGE_KEY,
  clearRegisterSuccessPayload,
  type RegisterSuccessPayload,
} from "@/lib/register-success-storage"

export default function RegisterSuccessPage() {
  const router = useRouter()
  const [payload, setPayload] = useState<RegisterSuccessPayload | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(REGISTER_SUCCESS_STORAGE_KEY)
      if (!raw) {
        router.replace("/auth/signin")
        setReady(true)
        return
      }
      const parsed = JSON.parse(raw) as RegisterSuccessPayload
      if (!parsed?.message) {
        router.replace("/auth/signin")
        setReady(true)
        return
      }
      setPayload(parsed)
    } catch {
      router.replace("/auth/signin")
    } finally {
      setReady(true)
    }
  }, [router])

  const goToPricing = () => {
    clearRegisterSuccessPayload()
    router.push("/pricing")
  }

  if (!ready || !payload) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  const isPendingManufacturer =
    payload.manufactureStatus === "pending" ||
    payload.manufactureStatus === "pending_approval"

  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15">
        {isPendingManufacturer ? (
          <Factory className="h-8 w-8 text-secondary" />
        ) : (
          <CheckCircle2 className="h-8 w-8 text-secondary" />
        )}
      </div>
      <h1 className="mt-6 font-serif text-3xl font-medium text-foreground">
        {isPendingManufacturer ? "Application received" : "Welcome to SourceNest"}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-left text-base leading-relaxed text-muted-foreground sm:text-center">
        {payload.message}
      </p>
      {isPendingManufacturer && (
        <p className="mx-auto mt-4 max-w-lg rounded-lg border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-left text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          After approval you can sign in and manage your subscription. Choose a plan now so you know
          what&apos;s available when you&apos;re activated.
        </p>
      )}
      <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button type="button" className="w-full sm:w-auto sm:min-w-[200px]" onClick={goToPricing}>
          Continue to pricing
        </Button>
        {payload.isLoggedIn && (
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link
              href={payload.dashboardPath || "/dashboard/buyer"}
              onClick={() => clearRegisterSuccessPayload()}
            >
              Go to dashboard
            </Link>
          </Button>
        )}
        <Button asChild variant="ghost" className="w-full sm:w-auto">
          <Link href="/" onClick={() => clearRegisterSuccessPayload()}>
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}
