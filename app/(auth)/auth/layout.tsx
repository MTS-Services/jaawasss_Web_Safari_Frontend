"use client"

import Link from "next/link"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "@/lib/i18n"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const isRegisterPage = pathname?.startsWith("/auth/signup")
  const isSignInPage = pathname?.startsWith("/auth/signin")
  const isConstrainedAuthPage = isRegisterPage || isSignInPage

  useEffect(() => {
    if (!isConstrainedAuthPage) return

    const html = document.documentElement
    const body = document.body

    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevHtmlHeight = html.style.height
    const prevBodyHeight = body.style.height

    html.style.overflow = "hidden"
    body.style.overflow = "hidden"
    html.style.height = "100%"
    body.style.height = "100%"

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      html.style.height = prevHtmlHeight
      body.style.height = prevBodyHeight
    }
  }, [isConstrainedAuthPage])

  return (
    <div className={`flex min-h-screen ${isConstrainedAuthPage ? "h-screen overflow-hidden" : ""}`}>
      {/* Left Side - Clean Brand Panel */}
      <div
        className={`hidden w-1/2 bg-primary lg:flex lg:flex-col lg:p-20 ${
          isRegisterPage ? "lg:fixed lg:inset-y-0 lg:left-0" : ""
        }`}
      >
        <div className="flex flex-col h-full max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logoFooter.png"
                alt="SourceNest"
                width={150}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex-1 flex items-center">
            <div className="w-full bg-[#402b22]/60 border border-[#4a372f] rounded-2xl p-8 shadow-xl">
              <h2 className="font-serif text-4xl lg:text-5xl font-semibold leading-tight text-[#F7EDE0]">Your Global Sourcing Workspace</h2>

              <div className="mt-4 h-0.5 w-20 bg-[#C9A84E]/60 rounded" />

              <p className="mt-5 text-base leading-relaxed text-[#F7EDE0]/90 max-w-prose">
                Access your SourceNest dashboard and manage your sourcing activity in one organized place — from reviewed manufacturer profiles to RFQs, quotations, messages, and business opportunities.
              </p>

              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#C9A84E]" />
                  <span className="text-sm leading-snug text-[#F7EDE0]">Explore reviewed manufacturers with clearer company information</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#C9A84E]" />
                  <span className="text-sm leading-snug text-[#F7EDE0]">Send structured RFQs and keep requests organized</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#C9A84E]" />
                  <span className="text-sm leading-snug text-[#F7EDE0]">Review quotations and compare supplier details more easily</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#C9A84E]" />
                  <span className="text-sm leading-snug text-[#F7EDE0]">Communicate professionally with buyers and manufacturers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#C9A84E]" />
                  <span className="text-sm leading-snug text-[#F7EDE0]">Manage products, profiles, inquiries, and sourcing activity from one dashboard</span>
                </li>
              </ul>

              <p className="mt-6 text-sm text-[#F7EDE0]/80">
                SourceNest is designed to make global sourcing clearer, more structured, and more professional for both buyers and manufacturers.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 text-sm text-[#F7EDE0]/70 border-t border-[#2C211B]">
            &copy; {new Date().getFullYear()} SourceNest. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div
        className={`flex w-full flex-col ${
          isRegisterPage
            ? "h-screen overflow-y-auto hide-scrollbar lg:ml-[50%] lg:w-1/2"
            : isSignInPage
              ? "h-screen overflow-y-auto hide-scrollbar lg:w-1/2"
            : "lg:w-1/2"
        }`}
      >
        {/* Mobile Logo */}
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logoFooter.png"
              alt="SourceNest"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Form Container */}
        <div
          className={`flex justify-center p-6 lg:p-12 ${
            isRegisterPage ? "items-start lg:py-8" : "flex-1 items-center"
          }`}
        >
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
