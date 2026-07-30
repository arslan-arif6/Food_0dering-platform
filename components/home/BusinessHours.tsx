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
    <section className="px-5 py-20 sm:px-8 lg:py-28">
      <BusinessHoursAutoRefresh />

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

          <p className="mt-2 text-center text-walnut-light">Open every day</p>

          <div className="mt-10 space-y-5">
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-sage" />
                      <span className="font-medium text-walnut">
                        {row.label}
                      </span>
                    </div>

                    <span className="font-semibold text-sage-dark">
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