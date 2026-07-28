export const MEALS = [
    "breakfast",
    "lunch",
    "dinner",
] as const;

export type MealType = (typeof MEALS)[number];

export type MealSchedule = {
    meal: MealType;

    /**
     * 24-hour format
     * Example: "05:00"
     */
    opensAt: string;

    /**
     * 24-hour format
     * Example: "10:00"
     */
    closesAt: string;
};

export type Countdown = {
    hours: number;
    minutes: number;
    totalMinutes: number;
};

export type RestaurantAvailability = {
    isOpen: boolean;
    isGracePeriod: boolean;

    currentMeal: MealType | null;
    nextMeal: MealType | null;

    opensAt: string | null;
    closesAt: string | null;

    countdown: Countdown | null;

    schedule: MealSchedule[];

    message: string;
};
export type MealWindow = {
    meal: MealType;

    /**
     * Minutes from midnight.
     */
    openMinutes: number;

    /**
     * Official closing time.
     */
    closeMinutes: number;

    /**
     * Closing time including grace period.
     */
    graceCloseMinutes: number;
};
