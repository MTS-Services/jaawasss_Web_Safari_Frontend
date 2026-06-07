"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Display */}
        <div className="space-y-4">
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            404
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Illustration */}
        <div className="py-8">
          <div className="w-32 h-32 mx-auto bg-slate-200 rounded-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-slate-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <Button
            asChild
            variant="outline"
            className="flex-1"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1"
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-muted-foreground mb-4">
            You might find what you're looking for:
          </p>
          <div className="space-y-2">
            <Link
              href="/"
              className="block text-sm text-blue-600 hover:text-blue-700 font-medium transition"
            >
              → Home Page
            </Link>
            <Link
              href="/search"
              className="block text-sm text-blue-600 hover:text-blue-700 font-medium transition"
            >
              → Search Products
            </Link>
            <Link
              href="/contact"
              className="block text-sm text-blue-600 hover:text-blue-700 font-medium transition"
            >
              → Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
