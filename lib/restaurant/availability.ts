import {
    MEAL_LABELS,
    ORDER_GRACE_PERIOD_MINUTES,
    RESTAURANT_SCHEDULE,
} from "./schedule";

import type {
    Countdown,
    MealSchedule,
    MealWindow,
    RestaurantAvailability,
} from "./types";

import type { RestaurantSettings } from "@/lib/database/settings";

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function buildMealWindow(
    schedule: MealSchedule,
    gracePeriodMinutes: number
): MealWindow {
    const openMinutes = timeToMinutes(schedule.opensAt);
    const closeMinutes = timeToMinutes(schedule.closesAt);

    return {
        meal: schedule.meal,
        openMinutes,
        closeMinutes,
        graceCloseMinutes: closeMinutes + gracePeriodMinutes,
    };
}

// Config the engine runs on. Defaults to the hardcoded schedule below
// so any call site not yet updated keeps working exactly as before.
export type ScheduleConfig = {
    schedule: MealSchedule[];
    gracePeriodMinutes: number;
    isActive: boolean;
};

const DEFAULT_CONFIG: ScheduleConfig = {
    schedule: RESTAURANT_SCHEDULE,
    gracePeriodMinutes: ORDER_GRACE_PERIOD_MINUTES,
    isActive: true,
};

// Maps a restaurant_settings DB row into the engine's config shape.
// Pure function — safe to call from client or server components.
export function settingsToScheduleConfig(
    settings: RestaurantSettings | null
): ScheduleConfig {
    if (!settings) return DEFAULT_CONFIG;

    return {
        schedule: [
            { meal: "breakfast", opensAt: settings.breakfast_start, closesAt: settings.breakfast_end },
            { meal: "lunch", opensAt: settings.lunch_start, closesAt: settings.lunch_end },
            { meal: "dinner", opensAt: settings.dinner_start, closesAt: settings.dinner_end },
        ],
        gracePeriodMinutes: settings.grace_period_minutes,
        isActive: settings.is_active,
    };
}

function getCurrentMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
}

function getPakistanTime(date: Date): Date {
    return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
}

function formatDuration(totalMinutes: number): Countdown {
    return {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
        totalMinutes,
    };
}

function buildCountdownMessage(mealName: string, countdown: Countdown): string {
    if (countdown.hours === 0) {
        return `${mealName} opens in ${countdown.minutes} minute${countdown.minutes === 1 ? "" : "s"}.`;
    }

    return `${mealName} opens in ${countdown.hours} hour${countdown.hours === 1 ? "" : "s"} ${countdown.minutes} minute${countdown.minutes === 1 ? "" : "s"}.`;
}

export function getRestaurantAvailability(
    date: Date = new Date(),
    config: ScheduleConfig = DEFAULT_CONFIG
): RestaurantAvailability {
    if (!config.isActive) {
        return {
            isOpen: false,
            isGracePeriod: false,
            currentMeal: null,
            nextMeal: null,
            opensAt: null,
            closesAt: null,
            countdown: null,
            schedule: config.schedule,
            message: "We're closed for today. Please check back later.",
        };
    }

    const mealWindows = config.schedule.map((schedule) =>
        buildMealWindow(schedule, config.gracePeriodMinutes)
    );

    const pakistanNow = getPakistanTime(date);
    const now = getCurrentMinutes(pakistanNow);

    for (const window of mealWindows) {
        if (now >= window.openMinutes && now <= window.graceCloseMinutes) {
            const schedule = config.schedule.find((meal) => meal.meal === window.meal)!;
            const isGracePeriod = now > window.closeMinutes;

            return {
                isOpen: true,
                isGracePeriod,
                currentMeal: window.meal,
                nextMeal: null,
                opensAt: schedule.opensAt,
                closesAt: schedule.closesAt,
                countdown: null,
                schedule: config.schedule,
                message: isGracePeriod
                    ? `${MEAL_LABELS[window.meal]} orders are in the grace period.`
                    : `${MEAL_LABELS[window.meal]} is now available.`,
            };
        }
    }

    let nextWindow = mealWindows.find((window) => now < window.openMinutes);
    let minutesUntilOpening: number;

    if (nextWindow) {
        minutesUntilOpening = nextWindow.openMinutes - now;
    } else {
        nextWindow = mealWindows[0];
        minutesUntilOpening = 24 * 60 - now + nextWindow.openMinutes;
    }

    const schedule = config.schedule.find((meal) => meal.meal === nextWindow!.meal)!;
    const countdown = formatDuration(minutesUntilOpening);

    return {
        isOpen: false,
        isGracePeriod: false,
        currentMeal: null,
        nextMeal: nextWindow.meal,
        opensAt: schedule.opensAt,
        closesAt: null,
        countdown,
        schedule: config.schedule,
        message: buildCountdownMessage(MEAL_LABELS[nextWindow.meal], countdown),
    };
}

export function formatTime12Hour(time: string): string {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function canOrderDish(
    dishCategories: string[],
    config: ScheduleConfig = DEFAULT_CONFIG
): boolean {
    const availability = getRestaurantAvailability(new Date(), config);

    if (!availability.isOpen || !availability.currentMeal) {
        return false;
    }

    return dishCategories.includes(availability.currentMeal);
}