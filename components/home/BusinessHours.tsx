import { Clock, Coffee, UtensilsCrossed, Soup } from "lucide-react";

import { getRestaurantSettings } from "@/lib/database/settings";
import {
  getRestaurantAvailability,
  settingsToScheduleConfig,
  formatTime12Hour,
  type MealType,
  type MealSchedule,
} from "@/lib/restaurant";

import BusinessHoursAutoRefresh from "./BusinessHoursAutoRefresh";

const MEAL_ROWS: {
  meal: MealType;
  label: string;
  icon: typeof Coffee;
  servingMessage: string;
}[] = [
    { meal: "breakfast", label: "Breakfast", icon: Coffee, servingMessage: "Breakfast is being served" },
    { meal: "lunch", label: "Lunch", icon: UtensilsCrossed, servingMessage: "Lunch is being served" },
    { meal: "dinner", label: "Dinner", icon: Soup, servingMessage: "Dinner is being served" },
  ];

function getMealTimes(schedule: MealSchedule[], meal: MealType) {
  const entry = schedule.find((s) => s.meal === meal)!;
  return { open: entry.opensAt, close: entry.closesAt };
}

export default async function BusinessHours() {
  const settings = await getRestaurantSettings();
  const config = settingsToScheduleConfig(settings);
  const availability = getRestaurantAvailability(new Date(), config);

  return (
    <section className="px-4 py-14 sm:px-8 sm:py-20 lg:py-28">
      <BusinessHoursAutoRefresh />

      <div className="mx-auto max-w-5xl">
        <div className="rounded-[1.75rem] bg-cream px-4 py-8 shadow-soft sm:rounded-4xl sm:px-8 sm:py-14">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage text-offwhite">
              <Clock className="h-8 w-8" />
            </div>
          </div>

          <h2 className="mt-5 text-center font-display text-2xl font-semibold text-walnut sm:mt-6 sm:text-3xl">
            Business Hours
          </h2>

          <p className="mt-2 text-center text-walnut-light">Open every day</p>

          <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-5">
            {MEAL_ROWS.map((row) => {
              const isActive =
                availability.isOpen && availability.currentMeal === row.meal;
              const Icon = row.icon;
              const times = getMealTimes(config.schedule, row.meal);

              return (
                <div
                  key={row.meal}
                  className={`rounded-2xl p-4 shadow-soft transition ${isActive ? "bg-sage/10 ring-2 ring-sage" : "bg-offwhite"
                    }`}
                >
                  <div className="flex flex-col gap-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-sage" />
                      <span className="font-medium text-walnut">
                        {row.label}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-sage-dark sm:text-base">
                      {formatTime12Hour(times.open)} – {formatTime12Hour(times.close)}
                    </span>
                  </div>

                  {isActive && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-sage-dark">
                      <span className="h-2 w-2 rounded-full bg-sage-dark" />
                      {row.servingMessage}
                      {availability.isGracePeriod ? " (last call)" : " now"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <span
              className={`inline-flex rounded-full px-6 py-3 font-semibold ${availability.isOpen
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
                }`}
            >
              {availability.isOpen ? "🟢 Open Now" : "🔴 Currently Closed"}
            </span>

            {!availability.isOpen && (
              <p className="mt-3 text-sm text-walnut-light">
                {availability.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
