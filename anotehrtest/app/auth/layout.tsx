import Link from "next/link"
import { Factory, CheckCircle2, Globe2, Shield, TrendingUp } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
            <Factory className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-medium text-primary-foreground">SourceNest</span>
        </Link>
        
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-3xl font-medium text-primary-foreground">
              Connect with reviewed manufacturers worldwide
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Join thousands of businesses finding reliable manufacturing partners through our curated network.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-primary-foreground">50,000+</div>
              <div className="text-sm text-primary-foreground/70">Reviewed Manufacturers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">120+</div>
              <div className="text-sm text-primary-foreground/70">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">500+</div>
              <div className="text-sm text-primary-foreground/70">Product Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-foreground">98%</div>
              <div className="text-sm text-primary-foreground/70">Client Satisfaction</div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              <span>All suppliers reviewed and audited</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <Globe2 className="h-5 w-5 text-primary-foreground" />
              <span>Global network across 120+ countries</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <Shield className="h-5 w-5 text-primary-foreground" />
              <span>Secure messaging and transactions</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
              <span>Real-time RFQ matching</span>
            </div>
          </div>

          </div>

        <div className="text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} SourceNest. All rights reserved.
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Mobile Logo */}
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Factory className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-medium text-foreground">SourceNest</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
