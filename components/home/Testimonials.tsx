import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="bg-walnut px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sage-light">
            Customer Reviews
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-offwhite sm:text-4xl">
            Loved like it's made at home
          </h2>
        </div>

        {/* Marquee viewport: overflow hidden + edge fade so cards don't cut off abruptly */}
        <div className="relative mt-12 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-walnut to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-walnut to-transparent sm:w-20" />

          <div className="flex w-max gap-5 animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
            {/* First set — real content, accessible to screen readers */}
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}

            {/* Duplicate set — purely visual, for a seamless loop. Hidden from assistive tech. */}
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={`${testimonial.id}-dup`}
                testimonial={testimonial}
                ariaHidden
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  ariaHidden = false,
}: {
  testimonial: (typeof testimonials)[number];
  ariaHidden?: boolean;
}) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="w-[260px] shrink-0 rounded-3xl bg-offwhite/5 p-6 shadow-soft ring-1 ring-offwhite/10 transition-all duration-300 hover:-translate-y-1.5 hover:bg-offwhite/10 sm:w-[300px] sm:p-7 lg:w-[340px] lg:p-8"
    >
      <Quote className="h-6 w-6 text-sage-light sm:h-7 sm:w-7" strokeWidth={1.5} />
      <p className="mt-4 text-sm leading-relaxed text-offwhite/90 sm:text-[15px]">
        "{testimonial.quote}"
      </p>
      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="font-display font-semibold text-offwhite">
            {testimonial.name}
          </p>
          <p className="text-sm text-offwhite/60">{testimonial.location}</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < testimonial.rating
                ? "fill-sage-light text-sage-light"
                : "text-offwhite/20"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}