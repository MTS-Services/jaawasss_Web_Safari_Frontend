"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useSubscription, PlanId } from "@/lib/subscription-context"
import { toast } from "sonner"
import { 
  Check, 
  CreditCard, 
  Download, 
  Calendar,
  AlertCircle,
  Zap,
  Package,
  Eye,
  MessageSquare,
  Crown,
  Loader2
} from "lucide-react"

const invoices = [
  { id: "INV-001", date: "Mar 1, 2026", amount: 299, status: "Paid" },
  { id: "INV-002", date: "Feb 1, 2026", amount: 299, status: "Paid" },
  { id: "INV-003", date: "Jan 1, 2026", amount: 299, status: "Paid" },
  { id: "INV-004", date: "Dec 1, 2025", amount: 299, status: "Paid" },
]

export default function SubscriptionPage() {
  const { 
    subscription, 
    plan, 
    usage, 
    isLoading,
    getAllPlans,
    getCurrentPlanId,
    getLimitPercentage,
    upgradePlan,
    downgradePlan,
    cancelSubscription
  } = useSubscription()

  const [upgrading, setUpgrading] = useState<PlanId | null>(null)
  const [canceling, setCanceling] = useState(false)

  const allPlans = getAllPlans().filter(p => p.id !== "free") // Exclude free plan for manufacturers
  const currentPlanId = getCurrentPlanId()

  const handlePlanChange = async (planId: PlanId) => {
    setUpgrading(planId)
    try {
      const currentPlan = allPlans.find(p => p.id === currentPlanId)
      const targetPlan = allPlans.find(p => p.id === planId)
      
      if (!currentPlan || !targetPlan) return
      
      const isUpgrade = (targetPlan.monthlyPrice || 0) > (currentPlan.monthlyPrice || 0)
      
      if (isUpgrade) {
        await upgradePlan(planId)
        toast.success(`Successfully upgraded to ${targetPlan.name} plan!`)
      } else {
        await downgradePlan(planId)
        toast.success(`Plan changed to ${targetPlan.name}. Changes will take effect at the end of your billing period.`)
      }
    } catch {
      toast.error("Failed to change plan. Please try again.")
    } finally {
      setUpgrading(null)
    }
  }

  const handleCancelSubscription = async () => {
    setCanceling(true)
    try {
      await cancelSubscription()
      toast.success("Your subscription will be canceled at the end of the current billing period.")
    } catch {
      toast.error("Failed to cancel subscription. Please try again.")
    } finally {
      setCanceling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const productLimit = plan?.limits.products ?? 0
  const inquiryLimit = plan?.limits.inquiriesPerMonth ?? 0
  const messageLimit = plan?.limits.messagesPerMonth ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Subscription & Billing</h1>
        <p className="text-muted-foreground">Manage your subscription plan and billing details</p>
      </div>

      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-secondary" />
                Current Plan: {plan?.name || "No Plan"}
              </CardTitle>
              <CardDescription>
                {subscription?.cancelAtPeriodEnd 
                  ? "Your subscription will end on " + subscription.currentPeriodEnd
                  : "Your subscription renews on " + (subscription?.currentPeriodEnd || "N/A")
                }
              </CardDescription>
            </div>
            <Badge className={
              subscription?.status === "active" ? "bg-secondary text-secondary-foreground" :
              subscription?.status === "past_due" ? "bg-amber-500 text-white" :
              "bg-destructive text-destructive-foreground"
            }>
              {subscription?.cancelAtPeriodEnd ? "Canceling" : 
               subscription?.status === "active" ? "Active" : 
               subscription?.status || "No Subscription"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                Products Used
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold">{usage.productsUsed}</span>
                <span className="text-sm text-muted-foreground">
                  / {productLimit === -1 ? "∞" : productLimit}
                </span>
              </div>
              <Progress value={productLimit === -1 ? 0 : getLimitPercentage("products")} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                Inquiries This Month
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold">{usage.inquiriesThisMonth}</span>
                <span className="text-sm text-muted-foreground">
                  / {inquiryLimit === -1 ? "∞" : inquiryLimit}
                </span>
              </div>
              <Progress value={inquiryLimit === -1 ? 0 : getLimitPercentage("inquiriesPerMonth")} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                Messages This Month
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold">{usage.messagesThisMonth}</span>
                <span className="text-sm text-muted-foreground">
                  / {messageLimit === -1 ? "∞" : messageLimit}
                </span>
              </div>
              <Progress value={messageLimit === -1 ? 0 : getLimitPercentage("messagesPerMonth")} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Plans</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {allPlans.map((planOption) => {
            const isCurrentPlan = planOption.id === currentPlanId
            const currentPlanPrice = plan?.monthlyPrice || 0
            const isUpgrade = (planOption.monthlyPrice || 0) > currentPlanPrice
            const isDowngrade = (planOption.monthlyPrice || 0) < currentPlanPrice
            
            return (
              <Card 
                key={planOption.id} 
                className={isCurrentPlan ? "border-secondary ring-1 ring-secondary" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{planOption.name}</CardTitle>
                    {planOption.id === "growth" && !isCurrentPlan && (
                      <Badge className="bg-secondary text-secondary-foreground">Popular</Badge>
                    )}
                    {isCurrentPlan && (
                      <Badge variant="outline">Current</Badge>
                    )}
                  </div>
                  <CardDescription>{planOption.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    {planOption.monthlyPrice !== null ? (
                      <>
                        <span className="text-3xl font-bold">${planOption.monthlyPrice}</span>
                        <span className="text-muted-foreground">/month</span>
                      </>
                    ) : (
                      <span className="text-xl font-semibold">Contact Sales</span>
                    )}
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                      {planOption.limits.products === -1 ? "Unlimited" : `Up to ${planOption.limits.products}`} products
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                      {planOption.limits.inquiriesPerMonth === -1 ? "Unlimited" : `${planOption.limits.inquiriesPerMonth}`} inquiries/month
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                      {planOption.limits.messagesPerMonth === -1 ? "Unlimited" : `${planOption.limits.messagesPerMonth}`} messages/month
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                      {planOption.limits.teamMembers === -1 ? "Unlimited" : planOption.limits.teamMembers} team member{planOption.limits.teamMembers !== 1 ? "s" : ""}
                    </li>
                    {planOption.features.advancedAnalytics && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        Advanced analytics
                      </li>
                    )}
                    {planOption.features.prioritySearchVisibility && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        Priority search visibility
                      </li>
                    )}
                    {planOption.features.featuredSupplierBadge && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        Featured supplier badge
                      </li>
                    )}
                    {planOption.features.dedicatedAccountManager && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        Dedicated account manager
                      </li>
                    )}
                    {planOption.features.apiAccess && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        API access
                      </li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : planOption.monthlyPrice === null ? (
                    <Button variant="outline" className="w-full">
                      Contact Sales
                    </Button>
                  ) : isUpgrade ? (
                    <Button 
                      className="w-full" 
                      onClick={() => handlePlanChange(planOption.id)}
                      disabled={upgrading !== null}
                    >
                      {upgrading === planOption.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="mr-2 h-4 w-4" />
                      )}
                      Upgrade
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handlePlanChange(planOption.id)}
                      disabled={upgrading !== null}
                    >
                      {upgrading === planOption.id && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Downgrade
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-16 items-center justify-center rounded-lg border bg-muted">
                <span className="text-xs font-semibold">VISA</span>
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2027</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">${invoice.amount}</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {subscription && !subscription.cancelAtPeriodEnd && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Cancel Subscription
            </CardTitle>
            <CardDescription>
              Cancel your subscription. You will retain access until the end of your current billing period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              disabled={canceling}
            >
              {canceling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
