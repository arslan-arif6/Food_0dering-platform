import Image from "next/image";
import Link from "next/link";
import { restaurantInfo } from "@/lib/data";

type HeroProps = {
  name?: string | null;
  description?: string | null;
};

export default function Hero({ name, description }: HeroProps) {
  const info = restaurantInfo;
  const displayName = name || info.name;
  const displayDescription = description || info.description;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-offwhite to-offwhite px-4 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-24">
      <div className="pointer-events-none absolute -left-24 top-10 hidden h-72 w-72 rounded-full bg-sage/15 blur-3xl sm:block" />
      <div className="pointer-events-none absolute -right-16 bottom-0 hidden h-80 w-80 rounded-full bg-cream-dark/50 blur-3xl sm:block" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative z-10 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-cream px-3.5 py-1.5 text-xs font-semibold text-walnut shadow-soft sm:text-sm">
            Cooked fresh, every day
          </span>

          <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.06] tracking-tight text-walnut sm:mt-6 sm:text-5xl lg:text-[3.75rem] lg:leading-[1.04]">
            {info.tagline}
          </h1>

          <p className="mt-5 text-[15px] leading-7 text-walnut-light sm:mt-6 sm:text-lg sm:leading-relaxed">
            {displayDescription}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="#featured-dishes"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-sage px-5 py-3 text-sm font-semibold text-offwhite shadow-soft-lg transition-all hover:-translate-y-0.5 hover:bg-sage-dark sm:px-8 sm:py-3.5 sm:text-base"
            >
              Order Now
            </Link>
            <Link
              href="/menu"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-walnut/15 bg-offwhite/60 px-5 py-3 text-sm font-semibold text-walnut transition-all hover:-translate-y-0.5 hover:border-walnut/30 hover:bg-cream/60 sm:border-2 sm:px-8 sm:py-3.5 sm:text-base"
            >
              View Menu
            </Link>
          </div>

          <div className="mt-8 inline-grid w-full max-w-[18rem] grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-3xl bg-cream/70 p-4 shadow-soft sm:mt-10 sm:flex sm:w-auto sm:max-w-none sm:bg-transparent sm:p-0 sm:shadow-none">
            <div>
              <p className="font-display text-2xl font-semibold text-walnut">
                500+
              </p>
              <p className="mt-0.5 text-sm text-walnut-light">Happy families</p>
            </div>
            <div className="h-10 w-px bg-walnut/15 sm:mx-2" />
            <div>
              <p className="font-display text-2xl font-semibold text-walnut">
                30 min
              </p>
              <p className="mt-0.5 text-sm text-walnut-light">Avg. delivery</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[min(100%,24rem)] animate-float sm:max-w-md lg:max-w-[420px]">
            <div className="absolute inset-6 -z-10 rounded-[2rem] bg-sage/20 blur-2xl" />
            <div className="overflow-hidden rounded-[1.75rem] border-4 border-offwhite shadow-soft-lg sm:rounded-[2.5rem] sm:border-8">
              <Image
                src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
                alt={`${displayName} signature homemade meal`}
                width={520}
                height={620}
                className="aspect-[4/3] h-auto w-full object-cover sm:aspect-auto sm:h-[520px] sm:w-[420px]"
                priority
              />
            </div>
            <div
              aria-hidden
              className="absolute -left-2 bottom-5 flex h-20 w-20 -rotate-6 items-center justify-center rounded-2xl bg-cream shadow-soft-lg sm:-left-8 sm:bottom-10 sm:h-28 sm:w-28 sm:rounded-3xl"
            >
              <div className="flex flex-col items-center">
                <span className="font-display text-lg font-semibold text-walnut sm:text-xl">
                  4.9
                </span>
                <span className="text-[10px] text-walnut-light sm:text-xs">
                  *****
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

