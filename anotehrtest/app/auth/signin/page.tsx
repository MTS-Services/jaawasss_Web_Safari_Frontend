"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth, UserRole } from "@/lib/auth-context"
import { Eye, EyeOff, Loader2, Users, Factory, Shield, AlertCircle, Briefcase } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("role") || "buyer"
  const { login } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<UserRole>(defaultTab as UserRole)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const result = await login(formData.email, formData.password, activeTab)
      
      if (result.success) {
        router.push(result.redirectTo)
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getDemoCredentials = (role: UserRole) => {
    switch (role) {
      case "buyer":
        return { email: "buyer@demo.com", password: "buyer123" }
      case "manufacturer":
        return { email: "manufacturer@demo.com", password: "manufacturer123" }
      case "service-provider":
        return { email: "provider@demo.com", password: "provider123" }
      case "admin":
        return { email: "admin@demo.com", password: "admin123" }
      default:
        return { email: "buyer@demo.com", password: "buyer123" }
    }
  }

  const fillDemoCredentials = () => {
    const creds = getDemoCredentials(activeTab)
    setFormData({ ...formData, email: creds.email, password: creds.password })
  }

  return (
    <div>
      <div className="text-center lg:text-left">
        <h1 className="font-serif text-3xl font-medium text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {/* Role Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserRole)} className="mt-6">
        <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4">
          <TabsTrigger value="buyer" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Buyer</span>
          </TabsTrigger>
          <TabsTrigger value="manufacturer" className="gap-2">
            <Factory className="h-4 w-4" />
            <span className="hidden sm:inline">Maker</span>
          </TabsTrigger>
          <TabsTrigger value="service-provider" className="gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Provider</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buyer" className="mt-4">
          <p className="text-sm text-muted-foreground">
            Access your buyer dashboard to manage RFQs, messages, and saved suppliers.
          </p>
        </TabsContent>
        <TabsContent value="manufacturer" className="mt-4">
          <p className="text-sm text-muted-foreground">
            Access your manufacturer dashboard to manage products, inquiries, and company profile.
          </p>
        </TabsContent>
        <TabsContent value="service-provider" className="mt-4">
          <p className="text-sm text-muted-foreground">
            Access your service provider dashboard to manage your listing, services, and client requests.
          </p>
        </TabsContent>
        <TabsContent value="admin" className="mt-4">
          <p className="text-sm text-muted-foreground">
            Access the admin panel to manage users, suppliers, and platform settings.
          </p>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-secondary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={formData.remember}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, remember: checked as boolean })
                }
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-secondary hover:underline"
            >
              Use demo credentials
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            `Sign in as ${
              activeTab === "service-provider"
                ? "Service Provider"
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
            }`
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-4 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" disabled={isLoading}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" type="button" disabled={isLoading}>
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            LinkedIn
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-medium text-secondary hover:underline">
          Create account
        </Link>
      </p>

      {/* Demo Credentials Info */}
      <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-xs font-medium text-foreground">Demo Credentials:</p>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <p><strong>Buyer:</strong> buyer@demo.com / buyer123</p>
                <p><strong>Manufacturer:</strong> manufacturer@demo.com / manufacturer123</p>
                <p><strong>Service Provider:</strong> provider@demo.com / provider123</p>
                <p><strong>Admin:</strong> admin@demo.com / admin123</p>
        </div>
      </div>
    </div>
  )
}
