"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { OrderStatus } from "@/lib/database/orders";

type Props = {
    counts: {
        all: number;
        new: number;
        preparing: number;
        ready: number;
        delivered: number;
        cancelled: number;
    };
};

const filters: {
    value: string;
    label: string;
}[] = [
        {
            value: "all",
            label: "All",
        },
        {
            value: "new",
            label: "New",
        },
        {
            value: "preparing",
            label: "Preparing",
        },
        {
            value: "ready",
            label: "Ready",
        },
        {
            value: "delivered",
            label: "Delivered",
        },
        {
            value: "cancelled",
            label: "Cancelled",
        },
    ];

export default function OrderStatusFilters({
    counts,
}: Props) {
    const searchParams = useSearchParams();

    const currentStatus =
        searchParams.get("status") ?? "all";

    const search =
        searchParams.get("search") ?? "";

    function getCount(status: string) {
        switch (status as OrderStatus | "all") {
            case "new":
                return counts.new;

            case "preparing":
                return counts.preparing;

            case "ready":
                return counts.ready;

            case "delivered":
                return counts.delivered;

            case "cancelled":
                return counts.cancelled;

            default:
                return counts.all;
        }
    }

    return (
        <div className="flex flex-wrap gap-3">
            {filters.map((filter) => {
                const params = new URLSearchParams();

                if (search) {
                    params.set("search", search);
                }

                if (filter.value !== "all") {
                    params.set("status", filter.value);
                }

                const active =
                    currentStatus === filter.value;

                return (
                    <Link
                        key={filter.value}
                        href={`/admin/orders?${params.toString()}`}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${active
                            ? "border-sage bg-sage text-offwhite"
                            : "border-cream bg-offwhite text-walnut hover:border-sage"
                            }`}
                    >
                        <span>{filter.label}</span>

                        <span
                            className={`rounded-full px-2 py-0.5 text-xs ${active
                                ? "bg-offwhite/20"
                                : "bg-cream"
                                }`}
                        >
                            {getCount(filter.value)}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}