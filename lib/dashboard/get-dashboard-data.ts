import { getAnalytics } from "@/lib/database/analytics";
import { getOrders, getOrderCounts } from "@/lib/database/orders";
import { getCustomers } from "@/lib/database/customers";

export type DashboardData = {
    todayRevenue: number;
    todayOrders: number;
    monthRevenue: number;
    pendingOrders: number;
    cancelledToday: number;
    avgOrderValue: number;
    bestDish: string | null;
    totalCustomers: number;
    newCustomersThisMonth: number;
    revenueTrend: { date: string; revenue: number }[];
    topDishes: { dishName: string; quantitySold: number; revenue: number }[];
    recentOrders: {
        id: string;
        customerName: string;
        total: number;
        status: string;
        createdAt: string;
    }[];
};

// Single entry point for the admin dashboard. Reuses the existing
// analytics/orders/customers modules instead of duplicating their
// queries — this is the "one call, everything in parallel" layer.
export async function getDashboardData(): Promise<DashboardData> {
    const [todayAnalytics, monthAnalytics, weekAnalytics, orderCounts, allOrders, customers] =
        await Promise.all([
            getAnalytics("today"),
            getAnalytics("month"),
            getAnalytics("last7days"),
            getOrderCounts(),
            getOrders("all"),
            getCustomers(),
        ]);

    const now = new Date();
    const newCustomersThisMonth = customers.filter((customer) => {
        const firstOrder = new Date(customer.firstOrderAt);
        return (
            firstOrder.getFullYear() === now.getFullYear() &&
            firstOrder.getMonth() === now.getMonth()
        );
    }).length;

    return {
        todayRevenue: todayAnalytics.overview.totalRevenue,
        todayOrders: todayAnalytics.overview.totalOrders,
        monthRevenue: monthAnalytics.overview.totalRevenue,
        pendingOrders: orderCounts.new + orderCounts.preparing + orderCounts.ready,
        cancelledToday: todayAnalytics.overview.cancelledOrders,
        avgOrderValue: todayAnalytics.overview.avgOrderValue,
        bestDish: monthAnalytics.topDishes[0]?.dishName ?? null,
        totalCustomers: customers.length,
        newCustomersThisMonth,
        revenueTrend: weekAnalytics.dailyRevenue,
        topDishes: monthAnalytics.topDishes,
        recentOrders: allOrders.slice(0, 5).map((order) => ({
            id: order.id,
            customerName: order.customerName,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
        })),
    };
}