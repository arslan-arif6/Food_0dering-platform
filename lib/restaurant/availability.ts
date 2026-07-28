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

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
}

function buildMealWindow(schedule: MealSchedule): MealWindow {
    const openMinutes = timeToMinutes(schedule.opensAt);
    const closeMinutes = timeToMinutes(schedule.closesAt);

    return {
        meal: schedule.meal,
        openMinutes,
        closeMinutes,
        graceCloseMinutes: closeMinutes + ORDER_GRACE_PERIOD_MINUTES,
    };
}

const MEAL_WINDOWS = RESTAURANT_SCHEDULE.map(buildMealWindow);

function getCurrentMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
}
function getPakistanTime(date: Date): Date {
    return new Date(
        date.toLocaleString("en-US", {
            timeZone: "Asia/Karachi",
        })
    );
}

function formatDuration(totalMinutes: number): Countdown {
    return {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
        totalMinutes,
    };
}

function buildCountdownMessage(
    mealName: string,
    countdown: Countdown
): string {
    if (countdown.hours === 0) {
        return `${mealName} opens in ${countdown.minutes} minute${countdown.minutes === 1 ? "" : "s"
            }.`;
    }

    return `${mealName} opens in ${countdown.hours} hour${countdown.hours === 1 ? "" : "s"
        } ${countdown.minutes} minute${countdown.minutes === 1 ? "" : "s"
        }.`;
}

export function getRestaurantAvailability(
    date: Date = new Date()
): RestaurantAvailability {
    const pakistanNow = getPakistanTime(date);

    const now = getCurrentMinutes(pakistanNow);

    for (const window of MEAL_WINDOWS) {
        if (now >= window.openMinutes && now <= window.graceCloseMinutes) {
            const schedule = RESTAURANT_SCHEDULE.find(
                (meal) => meal.meal === window.meal
            )!;

            const isGracePeriod = now > window.closeMinutes;

            return {
                isOpen: true,
                isGracePeriod,

                currentMeal: window.meal,
                nextMeal: null,

                opensAt: schedule.opensAt,
                closesAt: schedule.closesAt,

                countdown: null,

                schedule: RESTAURANT_SCHEDULE,

                message: isGracePeriod
                    ? `${MEAL_LABELS[window.meal]} orders are in the grace period.`
                    : `${MEAL_LABELS[window.meal]} is now available.`,
            };
        }
    }

    let nextWindow = MEAL_WINDOWS.find((window) => now < window.openMinutes);

    let minutesUntilOpening: number;

    if (nextWindow) {
        minutesUntilOpening = nextWindow.openMinutes - now;
    } else {
        nextWindow = MEAL_WINDOWS[0];
        minutesUntilOpening = 24 * 60 - now + nextWindow.openMinutes;
    }

    const schedule = RESTAURANT_SCHEDULE.find(
        (meal) => meal.meal === nextWindow.meal
    )!;

    const countdown = formatDuration(minutesUntilOpening);

    return {
        isOpen: false,
        isGracePeriod: false,

        currentMeal: null,
        nextMeal: nextWindow.meal,

        opensAt: schedule.opensAt,
        closesAt: null,

        countdown,

        schedule: RESTAURANT_SCHEDULE,

        message: buildCountdownMessage(
            MEAL_LABELS[nextWindow.meal],
            countdown
        ),
    };
}
export function formatTime12Hour(time: string): string {
    const [hours, minutes] = time.split(":").map(Number);

    const period = hours >= 12 ? "PM" : "AM";

    const hour12 = hours % 12 || 12;

    return `${hour12}:${minutes
        .toString()
        .padStart(2, "0")} ${period}`;
}
export function canOrderDish(
    dishCategories: string[]
): boolean {
    const availability = getRestaurantAvailability();

    if (!availability.isOpen || !availability.currentMeal) {
        return false;
    }

    return dishCategories.includes(
        availability.currentMeal
    );
}