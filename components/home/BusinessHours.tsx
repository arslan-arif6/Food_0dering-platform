"use client";

import { useEffect, useState } from "react";
import { Clock, Coffee, UtensilsCrossed, Soup } from "lucide-react";
import { restaurantInfo } from "@/lib/data";

export default function BusinessHours() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpen = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();

      const breakfast =
        minutes >= 5 * 60 && minutes < 10 * 60;

      const lunch =
        minutes >= 12 * 60 && minutes < 15 * 60;

      const dinner =
        minutes >= 18 * 60 && minutes < 20 * 60;

      setIsOpen(breakfast || lunch || dinner);
    };

    checkOpen();

    const interval = setInterval(checkOpen, 60000);

    return () => clearInterval(interval);
  }, []);

  const hours = restaurantInfo.businessHours;

  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-4xl bg-cream px-8 py-14 shadow-soft">

          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage text-offwhite">
              <Clock className="h-8 w-8" />
            </div>
          </div>

          <h2 className="mt-6 text-center font-display text-3xl font-semibold text-walnut">
            Business Hours
          </h2>

          <p className="mt-2 text-center text-walnut-light">
            {hours.days}
          </p>

          <div className="mt-10 space-y-5">

            <div className="flex items-center justify-between rounded-2xl bg-offwhite p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <Coffee className="h-6 w-6 text-sage" />
                <span className="font-medium text-walnut">
                  Breakfast
                </span>
              </div>

              <span className="font-semibold text-sage-dark">
                {hours.breakfast.open} – {hours.breakfast.close}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-offwhite p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="h-6 w-6 text-sage" />
                <span className="font-medium text-walnut">
                  Lunch
                </span>
              </div>

              <span className="font-semibold text-sage-dark">
                {hours.lunch.open} – {hours.lunch.close}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-offwhite p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <Soup className="h-6 w-6 text-sage" />
                <span className="font-medium text-walnut">
                  Dinner
                </span>
              </div>

              <span className="font-semibold text-sage-dark">
                {hours.dinner.open} – {hours.dinner.close}
              </span>
            </div>

          </div>

          <div className="mt-10 text-center">
            <span
              className={`inline-flex rounded-full px-6 py-3 font-semibold ${
                isOpen
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {isOpen ? "🟢 Open Now" : "🔴 Currently Closed"}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}