import {
    DollarSign,
    ShoppingBag,
    TrendingUp,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

import { getAnalytics } from "@/lib/database/analytics";
import type { OrderDateFilter } from "@/lib/database/orders";

import PageHeader from "@/components/admin/PageHeader";
import Card from "@/components/admin/Card";
import OrderDateFilters from "@/components/admin/orders/OrderDateFilters";
import RevenueTrendChart from "@/components/admin/analytics/RevenueTrendChart";
import BarList from "@/components/admin/analytics/BarList";

type Props = {
    searchParams?: Promise<{ date?: string }>;
};

const MEAL_LABELS: Record<string, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    uncategorized: "Uncategorized",
};

const PAYMENT_LABELS: Record<string, string> = {
    cash_on_delivery: "Cash on Delivery",
    jazzcash: "JazzCash",
    easypaisa: "Easypaisa",
};

const COMPARISON_LABELS: Record<OrderDateFilter, string> = {
    today: "vs yesterday",
    yesterday: "vs day before",
    last7days: "vs previous 7 days",
    month: "vs last month",
    all: "",
};

function ChangeBadge({
    value,
    label,
}: {
    value: number | null;
    label: string;
}) {
    if (value === null) return null;

    const isPositive = value >= 0;
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

    return (
        <span
            className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"
                }`}
        >
            <Icon className="h-3 w-3" />
            {Math.abs(value).toFixed(0)}% {label}
        </span>
    );
}

export default async function AnalyticsPage({ searchParams }: Props) {
    const params = await searchParams;
    const date = (params?.date as OrderDateFilter | undefined) ?? "today";

    const analytics = await getAnalytics(date);
    const comparisonLabel = COMPARISON_LABELS[date];

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Analytics"
                description="Revenue, order volume, and popular dishes for the selected period."
            />

            <OrderDateFilters basePath="/admin/analytics" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-walnut-light">Total Revenue</p>
                        <p className="text-xl font-semibold text-walnut">
                            Rs. {analytics.overview.totalRevenue.toFixed(0)}
                        </p>
                        <ChangeBadge
                            value={analytics.overview.revenueChangePercent}
                            label={comparisonLabel}
                        />
                    </div>
                </Card>

                <Card className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                        <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-walnut-light">Total Orders</p>
                        <p className="text-xl font-semibold text-walnut">
                            {analytics.overview.totalOrders}
                        </p>
                        <ChangeBadge
                            value={analytics.overview.ordersChangePercent}
                            label={comparisonLabel}
                        />
                    </div>
                </Card>

                <Card className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-walnut-light">Avg Order Value</p>
                        <p className="text-xl font-semibold text-walnut">
                            Rs. {analytics.overview.avgOrderValue.toFixed(0)}
                        </p>
                    </div>
                </Card>

                <Card className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                        <XCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-walnut-light">Cancelled Orders</p>
                        <p className="text-xl font-semibold text-walnut">
                            {analytics.overview.cancelledOrders}
                        </p>
                    </div>
                </Card>
            </div>

            <Card>
                <h3 className="mb-4 font-display text-lg font-semibold text-walnut">
                    Revenue Trend
                </h3>
                <RevenueTrendChart points={analytics.dailyRevenue} />
            </Card>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card>
                    <h3 className="mb-4 font-display text-lg font-semibold text-walnut">
                        Top Dishes
                    </h3>
                    <BarList
                        emptyMessage="No dishes sold in this period yet."
                        items={analytics.topDishes.map((dish, index) => ({
                            id: dish.dishName,
                            label: index === 0 ? `🏆 ${dish.dishName}` : dish.dishName,
                            value: dish.quantitySold,
                            valueLabel: `${dish.quantitySold} sold · Rs. ${dish.revenue.toFixed(
                                0
                            )}`,
                        }))}
                    />
                </Card>

                <Card>
                    <h3 className="mb-4 font-display text-lg font-semibold text-walnut">
                        Meal Session Performance
                    </h3>
                    <BarList
                        emptyMessage="No sales in this period yet."
                        items={analytics.mealBreakdown.map((meal) => ({
                            id: meal.meal,
                            label: MEAL_LABELS[meal.meal] ?? meal.meal,
                            value: meal.revenue,
                            valueLabel: `Rs. ${meal.revenue.toFixed(0)}`,
                        }))}
                    />
                </Card>

                <Card className="lg:col-span-2">
                    <h3 className="mb-4 font-display text-lg font-semibold text-walnut">
                        Payment Methods
                    </h3>
                    <BarList
                        emptyMessage="No payments in this period yet."
                        items={analytics.paymentBreakdown.map((payment) => ({
                            id: payment.method,
                            label: PAYMENT_LABELS[payment.method] ?? payment.method,
                            value: payment.revenue,
                            valueLabel: `${payment.orders} orders · Rs. ${payment.revenue.toFixed(
                                0
                            )}`,
                        }))}
                    />
                </Card>
            </div>
        </div>
    );
}