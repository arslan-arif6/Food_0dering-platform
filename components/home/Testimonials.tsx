import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="bg-walnut px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sage-light">
            Customer Reviews
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-offwhite sm:text-4xl">
            Loved like it's made at home
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-3xl bg-offwhite/5 p-8 shadow-soft ring-1 ring-offwhite/10 transition-all duration-300 hover:-translate-y-1.5 hover:bg-offwhite/10"
            >
              <Quote className="h-8 w-8 text-sage-light" strokeWidth={1.5} />
              <p className="mt-5 text-[15px] leading-relaxed text-offwhite/90">
                "{testimonial.quote}"
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-offwhite">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-offwhite/60">
                    {testimonial.location}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-sage-light text-sage-light"
                          : "text-offwhite/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}