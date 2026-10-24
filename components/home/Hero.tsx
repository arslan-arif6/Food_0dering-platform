import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { restaurantInfo } from "@/lib/data";
import TypingHeadline from "./TypingHeadline";

type HeroProps = {
  name?: string | null;
  description?: string | null;
};

export default function Hero({}: HeroProps) {
  const info = restaurantInfo;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden bg-offwhite px-4 sm:px-8">
      <div className="hero-glow" aria-hidden="true" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8 py-16 text-center sm:gap-10">
        <TypingHeadline />

        <Link
          href="/menu"
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sage px-8 py-3.5 text-sm font-medium text-offwhite transition-all hover:-translate-y-0.5 hover:bg-sage-dark sm:px-10 sm:text-base"
        >
          View menu
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-1.5 pb-5 text-sm text-walnut-light">
        <span>{info.city}</span>
        <span className="scroll-line" aria-hidden="true" />
      </div>
    </section>
  );
}
