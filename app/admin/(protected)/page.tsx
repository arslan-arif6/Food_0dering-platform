import Link from "next/link";
import {
    ShoppingBag,
    Wallet,
    Users,
    Clock,
    TrendingUp,
    Award,
    XCircle,
    Plus,
    ClipboardList,
    Settings as SettingsIcon,
} from "lucide-react";

import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import Card from "@/components/admin/Card";
import StatusBadge from "@/components/admin/StatusBadge";
import RevenueTrendChart from "@/components/admin/analytics/RevenueTrendChart";
import BarList from "@/components/admin/analytics/BarList";
import type { OrderStatus } from "@/lib/database/orders";

// Karachi time explicitly — server may run in UTC (same issue we
// already fixed for the restaurant schedule engine).
function getGreeting(): string {
    const hour = Number(
        new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            hour12: false,
            timeZone: "Asia/Karachi",
        }).format(new Date())
    );

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
}

function getTodayLabel(): string {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Asia/Karachi",
    }).format(new Date());
}

export default async function AdminDashboardPage() {
    const data = await getDashboardData();

    const statCards = [
        { label: "Today's Orders", value: String(data.todayOrders), icon: ShoppingBag },
        { label: "Pending Orders", value: String(data.pendingOrders), icon: Clock },
        { label: "Today's Revenue", value: `Rs. ${data.todayRevenue.toFixed(0)}`, icon: Wallet },
        { label: "Total Customers", value: String(data.totalCustomers), icon: Users },
    ];

    const secondaryCards = [
        { label: "Avg Order Value", value: `Rs. ${data.avgOrderValue.toFixed(0)}`, icon: TrendingUp },
        { label: "Best Dish (Month)", value: data.bestDish ?? "—", icon: Award },
        { label: "This Month Revenue", value: `Rs. ${data.monthRevenue.toFixed(0)}`, icon: Wallet },
        { label: "Cancelled Today", value: String(data.cancelledToday), icon: XCircle },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="font-display text-2xl font-semibold text-walnut">
                    {getGreeting()} 👋
                </h2>
                <p className="mt-1 text-[15px] text-walnut-light">{getTodayLabel()}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="rounded-3xl bg-offwhite p-6 shadow-soft">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                            <stat.icon className="h-6 w-6" strokeWidth={1.9} />
                        </div>
                        <p className="mt-5 text-sm font-medium text-walnut-light">{stat.label}</p>
                        <p className="mt-1 font-display text-3xl font-semibold text-walnut">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {secondaryCards.map((stat) => (
                    <div key={stat.label} className="rounded-3xl bg-offwhite p-6 shadow-soft">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                            <stat.icon className="h-6 w-6" strokeWidth={1.9} />
                        </div>
                        <p className="mt-5 text-sm font-medium text-walnut-light">{stat.label}</p>
                        <p className="mt-1 font-display text-2xl font-semibold text-walnut">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <Card>
                <h3 className="mb-4 font-display text-lg font-semibold text-walnut">
                    Revenue (Last 7 Days)
                </h3>
                <RevenueTrendChart points={data.revenueTrend} />
            </Card>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="mb-4 font-display text-lg font-semibold text-walnut">
                        Best Selling Dishes (This Month)
                    </h3>
                    <BarList
                        emptyMessage="No dishes sold yet."
                        items={data.topDishes.map((dish, index) => ({
                            id: dish.dishName,
                            label:
                                index === 0
                                    ? `🥇 ${dish.dishName}`
                                    : index === 1
                                        ? `🥈 ${dish.dishName}`
                                        : index === 2
                                            ? `🥉 ${dish.dishName}`
                                            : dish.dishName,
                            value: dish.quantitySold,
                            valueLabel: `${dish.quantitySold} sold`,
                        }))}
                    />
                </Card>

                <Card>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-walnut">
                            Recent Orders
                        </h3>
                        <Link
                            href="/admin/orders"
                            className="text-sm font-semibold text-sage hover:text-sage-dark"
                        >
                            View all
                        </Link>
                    </div>

                    {data.recentOrders.length === 0 ? (
                        <p className="text-sm text-walnut-light">No orders yet.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {data.recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/admin/orders/${order.id}`}
                                    className="flex items-center justify-between rounded-xl bg-cream px-4 py-3 hover:opacity-80"
                                >
                                    <div>
                                        <p className="font-medium text-walnut">
                                            #{order.id.slice(0, 8)} · {order.customerName}
                                        </p>
                                        <p className="text-sm text-walnut-light">
                                            Rs. {order.total.toFixed(0)}
                                        </p>
                                    </div>
                                    <StatusBadge status={order.status as OrderStatus} />
                                </Link>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            <Card>
                <h3 className="mb-4 font-display text-lg font-semibold text-walnut">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Link
                        href="/admin/menu/new"
                        className="flex flex-col items-center gap-2 rounded-2xl bg-cream px-4 py-5 text-center hover:opacity-80"
                    >
                        <Plus className="h-6 w-6 text-sage-dark" />
                        <span className="text-sm font-semibold text-walnut">Add Dish</span>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="flex flex-col items-center gap-2 rounded-2xl bg-cream px-4 py-5 text-center hover:opacity-80"
                    >
                        <ClipboardList className="h-6 w-6 text-sage-dark" />
                        <span className="text-sm font-semibold text-walnut">View Orders</span>
                    </Link>

                    <Link
                        href="/admin/customers"
                        className="flex flex-col items-center gap-2 rounded-2xl bg-cream px-4 py-5 text-center hover:opacity-80"
                    >
                        <Users className="h-6 w-6 text-sage-dark" />
                        <span className="text-sm font-semibold text-walnut">Customers</span>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex flex-col items-center gap-2 rounded-2xl bg-cream px-4 py-5 text-center hover:opacity-80"
                    >
                        <SettingsIcon className="h-6 w-6 text-sage-dark" />
                        <span className="text-sm font-semibold text-walnut">Settings</span>
                    </Link>
                </div>
            </Card>
        </div>
    );
}