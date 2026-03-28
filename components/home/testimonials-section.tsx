import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "SourceNest transformed how we find suppliers. The review process gives us confidence, and the direct communication saves weeks of back-and-forth.",
    author: "Sarah Chen",
    role: "Procurement Director",
    company: "Nordic Home Goods",
    type: "buyer",
  },
  {
    quote: "Since joining SourceNest, we've received quality inquiries from serious buyers in markets we never thought we could reach. The ROI has been incredible.",
    author: "Rajesh Patel",
    role: "Export Manager",
    company: "GreenThread Textiles",
    type: "manufacturer",
  },
  {
    quote: "The comparison feature is a game-changer. Being able to evaluate multiple suppliers side-by-side with reviewed information speeds up our sourcing decisions.",
    author: "Michael Torres",
    role: "Supply Chain Manager",
    company: "Urban Retail Co",
    type: "buyer",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Trusted by Buyers & Manufacturers Worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our users say about their experience with SourceNest
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-2xl bg-card p-8 shadow-sm">
              <Quote className="h-10 w-10 text-secondary/30" />
              <p className="mt-4 text-foreground leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-border pt-6">
                <div className="font-semibold text-foreground">{testimonial.author}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </div>
                <div className="mt-2">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    testimonial.type === "buyer" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {testimonial.type === "buyer" ? "Buyer" : "Manufacturer"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
