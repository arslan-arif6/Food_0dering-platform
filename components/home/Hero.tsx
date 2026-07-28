import Image from "next/image";
import Link from "next/link";
import { restaurantInfo } from "@/lib/data";

export default function Hero() {
  const info = restaurantInfo;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-offwhite to-offwhite px-5 pb-20 pt-14 sm:px-8 lg:pb-28 lg:pt-20">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sage/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-cream-dark/60 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div className="relative z-10 max-w-xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-1.5 text-sm font-medium text-walnut shadow-soft">
            🍲 Cooked fresh, every single day
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-walnut sm:text-5xl lg:text-6xl">
            {info.tagline}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-walnut-light">
            {info.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="#featured-dishes"
              className="rounded-full bg-sage px-8 py-3.5 font-semibold text-offwhite shadow-soft-lg transition-all hover:-translate-y-0.5 hover:bg-sage-dark"
            >
              Order Now
            </Link>
            <Link
              href="/menu"
              className="rounded-full border-2 border-walnut/15 bg-transparent px-8 py-3.5 font-semibold text-walnut transition-all hover:-translate-y-0.5 hover:border-walnut/30 hover:bg-cream/60"
            >
              View Menu
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-8">
            <div>
              <p className="font-display text-2xl font-semibold text-walnut">
                500+
              </p>
              <p className="text-sm text-walnut-light">Happy families</p>
            </div>
            <div className="h-10 w-px bg-walnut/10" />
            <div>
              <p className="font-display text-2xl font-semibold text-walnut">
                30 min
              </p>
              <p className="text-sm text-walnut-light">Average delivery</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center lg:justify-end">
          <div className="relative animate-float">
            <div className="absolute inset-6 -z-10 rounded-[3rem] bg-sage/25 blur-2xl" />
            <div className="overflow-hidden rounded-[2.5rem] border-8 border-offwhite shadow-soft-lg">
              <Image
                src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
                alt={`${info.name} signature homemade meal`}
                width={520}
                height={620}
                className="h-[420px] w-[340px] object-cover sm:h-[520px] sm:w-[420px]"
                priority
              />
            </div>
            <div
              aria-hidden
              className="absolute -left-8 bottom-10 flex h-24 w-24 -rotate-6 items-center justify-center rounded-3xl bg-cream shadow-soft-lg sm:h-28 sm:w-28"
            >
              <div className="flex flex-col items-center">
                <span className="font-display text-xl font-semibold text-walnut">
                  4.9
                </span>
                <span className="text-xs text-walnut-light">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}