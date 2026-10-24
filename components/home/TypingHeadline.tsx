"use client";

import { useEffect, useState } from "react";

// Desi dishes that rotate in the headline. Edit freely.
const DISHES = [
  "biryani",
  "Alo gobi",
  "palak",
  "karahi",
  "daal chawal",
  "aloo paratha",
];

export default function TypingHeadline() {
  const [text, setText] = useState("");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let i = 0;
    let n = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (reduce) {
        setText(DISHES[0]);
        return;
      }

      const word = DISHES[i];

      if (!deleting) {
        n += 1;
        setText(word.slice(0, n));
        if (n === word.length) {
          deleting = true;
          timer = setTimeout(tick, 1700);
          return;
        }
        timer = setTimeout(tick, 95);
        return;
      }

      n -= 1;
      setText(word.slice(0, n));
      if (n === 0) {
        deleting = false;
        i = (i + 1) % DISHES.length;
        timer = setTimeout(tick, 350);
        return;
      }
      timer = setTimeout(tick, 50);
    };

    timer = setTimeout(tick, reduce ? 0 : 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <h1 className="max-w-4xl font-display text-[2.5rem] font-medium leading-[1.06] tracking-[-0.045em] text-walnut sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
      <span className="sr-only">Fresh homemade food, delivered daily</span>
      <span aria-hidden="true">
        Fresh homemade
        <br />
        <span className="font-fraunces text-[1.08em] font-light italic tracking-[-0.03em]">
          {text}
        </span>
        <span className="relative inline-block h-[0.85em] w-0 align-[-0.04em]">
          <span className="absolute left-0.5 top-0 h-full w-[3px] animate-cursor bg-walnut" />
        </span>
        ,
        <br />
        delivered daily
      </span>
    </h1>
  );
}
