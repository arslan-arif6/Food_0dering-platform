import type { MealSchedule } from "./types";


export const ORDER_GRACE_PERIOD_MINUTES = 10;


export const RESTAURANT_SCHEDULE: MealSchedule[] = [
    {
        meal: "breakfast",
        opensAt: "05:00",
        closesAt: "07:00",
    },
    {
        meal: "lunch",
        opensAt: "08:05",
        closesAt: "15:00",
    },
    {
        meal: "dinner",
        opensAt: "18:00",
        closesAt: "20:00",
    },
];

/**
 * Display names used throughout the UI.
 */
export const MEAL_LABELS = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
} as const;

/**
 * Returns the configured schedule for a meal.
 */
export function getMealSchedule(meal: MealSchedule["meal"]): MealSchedule {
    const schedule = RESTAURANT_SCHEDULE.find(
        (item) => item.meal === meal
    );

    if (!schedule) {
        throw new Error(`Schedule not found for meal "${meal}".`);
    }

    return schedule;
}