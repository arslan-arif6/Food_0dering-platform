import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OrderDateFilter } from "@/lib/database/orders";
import {
    getDateRangeFilter,
    getPreviousDateRangeFilter,
} from "@/lib/utils/date-range";

export type AnalyticsOverview = {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    cancelledOrders: number;
    revenueChangePercent: number | null;
    ordersChangePercent: number | null;
};

export type DailyRevenuePoint = {
    date: string;
    revenue: number;
};

export type TopDish = {
    dishName: string;
    quantitySold: number;
    revenue: number;
};

export type PaymentBreakdown = {
    method: string;
    orders: number;
    revenue: number;
};

export type MealBreakdown = {
    meal: string;
    revenue: number;
    quantitySold: number;
};

export type AnalyticsData = {
    overview: AnalyticsOverview;
    dailyRevenue: DailyRevenuePoint[];
    topDishes: TopDish[];
    paymentBreakdown: PaymentBreakdown[];
    mealBreakdown: MealBreakdown[];
};

type AnalyticsOrderRow = {
    id: string;
    status: string;
    payment_method: string;
    total: string;
    created_at: string;
    order_items:
    | {
        dish_id: string | null;
        dish_name: string;
        quantity: number;
        line_total: string;
        dishes: {
            dish_categories: {
                categories: { slug: string } | null;
            }[];
        } | null;
    }[]
    | null;
};

const MEAL_SLUGS = new Set(["breakfast", "lunch", "dinner"]);

// For "today"/"yesterday" a single day has nothing to compare against,
// so we bucket by hour instead of by day for those two filters.
function timeKey(iso: string, hourly: boolean): string {
    const d = new Date(iso);

    if (hourly) {
        return `${String(d.getHours()).padStart(2, "0")}:00`;
    }

    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
}

function emptyAnalytics(): AnalyticsData {
    return {
        overview: {
            totalRevenue: 0,
            totalOrders: 0,
            avgOrderValue: 0,
            cancelledOrders: 0,
            revenueChangePercent: null,
            ordersChangePercent: null,
        },
        dailyRevenue: [],
        topDishes: [],
        paymentBreakdown: [],
        mealBreakdown: [],
    };
}

function percentChange(current: number, previous: number): number | null {
    if (previous > 0) return ((current - previous) / previous) * 100;
    if (current > 0) return 100;
    return null;
}

export async function getAnalytics(
    date: OrderDateFilter = "today"
): Promise<AnalyticsData> {
    const supabase = await createSupabaseServerClient();
    const range = getDateRangeFilter(date);
    const hourly = date === "today" || date === "yesterday";

    let query = supabase
        .from("orders")
        .select(
            `
            id,
            status,
            payment_method,
            total,
            created_at,
            order_items (
                dish_id,
                dish_name,
                quantity,
                line_total,
                dishes (
                    dish_categories (
                        categories ( slug )
                    )
                )
            )
        `
        )
        .order("created_at", { ascending: true });

    if (range.start) query = query.gte("created_at", range.start);
    if (range.end) query = query.lt("created_at", range.end);

    const { data, error } = await query;

    if (error) {
        console.error(error);
        return emptyAnalytics();
    }

    const rows = data as unknown as AnalyticsOrderRow[];

    let totalRevenue = 0;
    let cancelledOrders = 0;
    let countedOrders = 0;

    const timeMap = new Map<string, number>();
    const dishMap = new Map<string, TopDish>();
    const paymentMap = new Map<string, PaymentBreakdown>();
    const mealMap = new Map<string, MealBreakdown>();

    for (const row of rows) {
        if (row.status === "cancelled") {
            cancelledOrders += 1;
            continue;
        }

        const total = Number(row.total);
        totalRevenue += total;
        countedOrders += 1;

        const key = timeKey(row.created_at, hourly);
        timeMap.set(key, (timeMap.get(key) ?? 0) + total);

        const paymentEntry = paymentMap.get(row.payment_method) ?? {
            method: row.payment_method,
            orders: 0,
            revenue: 0,
        };
        paymentEntry.orders += 1;
        paymentEntry.revenue += total;
        paymentMap.set(row.payment_method, paymentEntry);

        for (const item of row.order_items ?? []) {
            const lineTotal = Number(item.line_total);

            const dishEntry = dishMap.get(item.dish_name) ?? {
                dishName: item.dish_name,
                quantitySold: 0,
                revenue: 0,
            };
            dishEntry.quantitySold += item.quantity;
            dishEntry.revenue += lineTotal;
            dishMap.set(item.dish_name, dishEntry);

            const slugs =
                item.dishes?.dish_categories
                    ?.map((entry) => entry.categories?.slug)
                    .filter((slug): slug is string => Boolean(slug)) ?? [];

            const meal = slugs.find((slug) => MEAL_SLUGS.has(slug)) ?? "uncategorized";

            const mealEntry = mealMap.get(meal) ?? {
                meal,
                revenue: 0,
                quantitySold: 0,
            };
            mealEntry.revenue += lineTotal;
            mealEntry.quantitySold += item.quantity;
            mealMap.set(meal, mealEntry);
        }
    }

    // Previous-period comparison (revenue/orders % change)
    let revenueChangePercent: number | null = null;
    let ordersChangePercent: number | null = null;

    const previousRange = getPreviousDateRangeFilter(date);

    if (previousRange) {
        let prevQuery = supabase.from("orders").select("status, total");

        if (previousRange.start)
            prevQuery = prevQuery.gte("created_at", previousRange.start);
        if (previousRange.end)
            prevQuery = prevQuery.lt("created_at", previousRange.end);

        const { data: prevData, error: prevError } = await prevQuery;

        if (!prevError && prevData) {
            let prevRevenue = 0;
            let prevOrders = 0;

            for (const row of prevData as { status: string; total: string }[]) {
                if (row.status === "cancelled") continue;
                prevRevenue += Number(row.total);
                prevOrders += 1;
            }

            revenueChangePercent = percentChange(totalRevenue, prevRevenue);
            ordersChangePercent = percentChange(countedOrders, prevOrders);
        }
    }

    return {
        overview: {
            totalRevenue,
            totalOrders: countedOrders,
            avgOrderValue: countedOrders > 0 ? totalRevenue / countedOrders : 0,
            cancelledOrders,
            revenueChangePercent,
            ordersChangePercent,
        },
        dailyRevenue: Array.from(timeMap.entries())
            .map(([date, revenue]) => ({ date, revenue }))
            .sort((a, b) => (a.date < b.date ? -1 : 1)),
        topDishes: Array.from(dishMap.values())
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, 5),
        paymentBreakdown: Array.from(paymentMap.values()).sort(
            (a, b) => b.revenue - a.revenue
        ),
        mealBreakdown: Array.from(mealMap.values()).sort(
            (a, b) => b.revenue - a.revenue
        ),
    };
}