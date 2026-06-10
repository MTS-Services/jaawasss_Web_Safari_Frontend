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
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Why Buyers Use SourceNest */}
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-tight text-foreground">
              Why Buyers Choose SourceNest
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground">
              Everything you need to find and connect with the right manufacturers — at no cost
            </p>
          </div>

          <div className="mt-6 sm:mt-10 lg:mt-14 grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {buyerBenefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-2.5 sm:gap-3 lg:gap-4">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-secondary/10">
                  <benefit.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 sm:my-14 lg:my-20 border-t border-border" />

        {/* Why Manufacturers Join */}
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-tight text-foreground">
              Why Manufacturers Join
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground">
              Expand your reach and connect with qualified buyers through a trusted platform
            </p>
          </div>

          <div className="mt-6 sm:mt-10 lg:mt-14 grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 md:grid-cols-3">
            {manufacturerBenefits.map((benefit) => (
              <div key={benefit.title} className="rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-8 text-center">
                <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-primary">
                  <benefit.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary-foreground" />
                </div>
                <h3 className="mt-3 sm:mt-4 lg:mt-6 text-base sm:text-lg lg:text-xl font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-1.5 sm:mt-2 lg:mt-3 text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Why Factories Pay */}
          <div className="mt-6 sm:mt-10 lg:mt-14 rounded-xl sm:rounded-2xl bg-primary p-4 sm:p-6 lg:p-10 text-center text-primary-foreground">
            <h3 className="font-serif text-base sm:text-xl lg:text-2xl font-medium">
              Why Do Manufacturers Pay to Join?
            </h3>
            <p className="mx-auto mt-2 sm:mt-3 lg:mt-4 max-w-2xl text-xs sm:text-sm lg:text-base text-primary-foreground/80 leading-relaxed">
              SourceNest is free for buyers to ensure maximum reach for manufacturers. Factories pay a subscription to fund platform development, review processes, and premium features.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
