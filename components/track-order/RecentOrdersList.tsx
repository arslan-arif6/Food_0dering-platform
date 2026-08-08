"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getRecentOrders, type RecentOrder } from "@/lib/utils/order-tracking";

type RecentOrdersListProps = {
    currentId?: string;
};

export default function RecentOrdersList({ currentId }: RecentOrdersListProps) {
    const [orders, setOrders] = useState<RecentOrder[]>([]);

    useEffect(() => {
        setOrders(getRecentOrders());
    }, []);

    if (orders.length <= 1) return null;

    return (
        <div className="mt-6">
            <p className="text-sm font-medium text-walnut-light">
                Your recent orders
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {orders.map((order) => {
                    const isCurrent = order.id === currentId;

                    return (
                        <Link
                            key={order.id}
                            href={`/track-order?id=${encodeURIComponent(order.id)}&phone=${encodeURIComponent(order.phone)}`}
                            aria-current={isCurrent ? "true" : undefined}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${isCurrent
                                ? "bg-sage text-offwhite"
                                : "bg-offwhite text-walnut hover:bg-cream-dark"
                                }`}
                        >
                            #{order.id.slice(0, 8)}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}