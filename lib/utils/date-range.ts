import type { OrderDateFilter } from "@/lib/database/orders";

export function getDateRangeFilter(
    date: OrderDateFilter
): { start?: string; end?: string } {
    const now = new Date();

    if (date === "today") {
        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        return { start: start.toISOString() };
    }

    if (date === "yesterday") {
        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1
        );
        const end = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        return { start: start.toISOString(), end: end.toISOString() };
    }

    if (date === "last7days") {
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return { start: start.toISOString() };
    }

    if (date === "month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: start.toISOString() };
    }

    return {};
}

// Mirrors getDateRangeFilter but shifted back one period, so analytics
// can show "+X% vs previous period". Returns null for "all" — there's
// no meaningful "previous" period to compare all-time data against.
export function getPreviousDateRangeFilter(
    date: OrderDateFilter
): { start?: string; end?: string } | null {
    const now = new Date();

    if (date === "today") {
        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1
        );
        const end = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        return { start: start.toISOString(), end: end.toISOString() };
    }

    if (date === "yesterday") {
        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 2
        );
        const end = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1
        );
        return { start: start.toISOString(), end: end.toISOString() };
    }

    if (date === "last7days") {
        const end = new Date();
        end.setDate(end.getDate() - 7);
        const start = new Date();
        start.setDate(start.getDate() - 14);
        return { start: start.toISOString(), end: end.toISOString() };
    }

    if (date === "month") {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: start.toISOString(), end: end.toISOString() };
    }

    return null;
}