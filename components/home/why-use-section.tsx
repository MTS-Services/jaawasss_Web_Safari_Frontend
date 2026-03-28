import { 
  Shield, 
  Globe, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  Users,
  Wallet,
  Award,
  TrendingUp
} from "lucide-react"

const buyerBenefits = [
  {
    icon: Wallet,
    title: "Free Forever for Buyers",
    description: "Search, compare, message, and request quotes — all completely free. No hidden fees, no subscription required.",
  },
  {
    icon: Shield,
    title: "Reviewed Suppliers Only",
    description: "Every manufacturer is reviewed and approved by our team based on submitted information before appearing on the platform.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access factories from 50+ countries across all major manufacturing regions worldwide.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Chat directly with factory representatives, no middlemen or brokers involved.",
  },
  {
    icon: BarChart3,
    title: "Compare & Decide",
    description: "Side-by-side supplier comparison with detailed capabilities, certifications, and pricing.",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Streamlined RFQ process, organized inbox, and saved suppliers keep your workflow efficient.",
  },
]

const manufacturerBenefits = [
  {
    icon: TrendingUp,
    title: "Global Visibility",
    description: "Get discovered by importers and buyers from around the world looking for your products.",
  },
  {
    icon: Award,
    title: "Premium Positioning",
    description: "Present your factory with a professional profile, product catalogs, and submitted credentials.",
  },
  {
    icon: Users,
    title: "Quality Leads",
    description: "Receive inquiries from serious buyers who have already researched your capabilities.",
  },
]

export function WhyUseSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Why Buyers Use SourceNest */}
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Why Buyers Choose SourceNest
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to find and connect with the right manufacturers — at no cost
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {buyerBenefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                  <benefit.icon className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-20 border-t border-border" />

        {/* Why Manufacturers Join */}
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Why Manufacturers Join
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Expand your reach and connect with qualified buyers through a trusted platform
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {manufacturerBenefits.map((benefit) => (
              <div key={benefit.title} className="rounded-2xl border border-border bg-card p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                  <benefit.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Why Factories Pay */}
          <div className="mt-14 rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h3 className="font-serif text-2xl font-medium md:text-3xl">
              Why Do Manufacturers Pay to Join?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80 leading-relaxed">
              SourceNest is free for buyers to ensure maximum reach for manufacturers. Factories pay a subscription to fund platform development, review processes, and premium features. This model ensures only serious, committed manufacturers join — giving buyers confidence in every supplier they discover.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
