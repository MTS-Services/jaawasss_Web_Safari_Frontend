"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Upload, 
  LogOut, 
  Building2, 
  ShieldCheck, 
  Mail,
  FileQuestion,
  FileWarning
} from "lucide-react"

export default function ManufacturerAccountReviewPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">SN</span>
            </div>
            <span className="font-serif text-lg font-medium">SourceNest</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>TechGear Manufacturing Ltd.</span>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl py-8 md:py-12">
        {/* Page Title & Status Overview */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-medium tracking-tight">Review Center</h1>
            <p className="mt-2 text-muted-foreground">
              Track your account approval status and respond to admin requests.
            </p>
          </div>
          
          {/* Main Status Badge */}
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Application Status</p>
              <h2 className="text-lg font-bold text-amber-900 dark:text-amber-400">Action Required</h2>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column: Requirements & Messages */}
          <div className="space-y-6 md:col-span-2">
            
            {/* What is required section */}
            <Card className="border-l-4 border-l-amber-500 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-lg">Required Actions</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    2 Pending Tasks
                  </Badge>
                </div>
                <CardDescription>
                  Please provide the following information to proceed with your approval.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Task 1 */}
                <div className="rounded-lg border bg-card p-4 transition-all hover:bg-muted/50">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FileWarning className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">Business License</h4>
                        <Badge variant="secondary" className="text-xs">Document</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The business license you uploaded is expired. Please upload a valid, current business registration document.
                      </p>
                      <div className="pt-2">
                        <Button size="sm" className="gap-2">
                          <Upload className="h-4 w-4" />
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task 2 */}
                <div className="rounded-lg border bg-card p-4 transition-all hover:bg-muted/50">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FileQuestion className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">Facility Photos</h4>
                        <Badge variant="secondary" className="text-xs">Information</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Please provide 2-3 additional photos of your main manufacturing floor showing equipment.
                      </p>
                      <div className="pt-2">
                        <Button size="sm" variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5">
                          <Upload className="h-4 w-4" />
                          Upload Photos
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Admin Communications */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Messages from Admin</CardTitle>
                </div>
                <CardDescription>Direct communications regarding your application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Message Thread */}
                  <div className="relative pl-6 after:absolute after:bottom-0 after:left-[11px] after:top-2 after:w-px after:bg-border">
                    {/* Message 1 */}
                    <div className="relative mb-6">
                      <div className="absolute -left-6 mt-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
                        <ShieldCheck className="h-3 w-3" />
                      </div>
                      <div className="rounded-lg rounded-tl-none bg-muted/50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-sm">System Admin</span>
                          <span className="text-xs text-muted-foreground">Today, 10:45 AM</span>
                        </div>
                        <p className="text-sm text-foreground">
                          Hello TechGear team, we are currently reviewing your application. Everything looks good so far, but we noticed your business license expires next week. Could you provide an updated copy? Also, some photos of your main assembly line would be helpful.
                        </p>
                      </div>
                    </div>

                    {/* Notification Event */}
                    <div className="relative">
                      <div className="absolute -left-6 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-muted ring-4 ring-background">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 py-1 pl-2">
                        <p className="text-xs text-muted-foreground">An email notification was sent to your registered address.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Reply to Admin
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column: Progress & Info */}
          <div className="space-y-6">
            
            {/* Progress Tracker */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Review Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="h-full w-px bg-emerald-200 dark:bg-emerald-800" />
                    </div>
                    <div className="pb-6">
                      <p className="font-medium text-sm">Application Submitted</p>
                      <p className="text-xs text-muted-foreground mt-1">Oct 24, 2026</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 ring-4 ring-amber-50 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-500/10">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse" />
                      </div>
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div className="pb-6">
                      <p className="font-medium text-sm text-amber-700 dark:text-amber-400">Initial Review</p>
                      <p className="text-xs text-muted-foreground mt-1">Action Required</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-background text-muted-foreground">
                        <span className="text-xs font-medium">3</span>
                      </div>
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div className="pb-6">
                      <p className="font-medium text-sm text-muted-foreground">Final Verification</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-background text-muted-foreground">
                        <span className="text-xs font-medium">4</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">Account Approved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submitted Info Summary */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium">TechGear Mfg.</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">contact@techgear.com</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Submitted on</span>
                  <span className="font-medium">Oct 24, 2026</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}
