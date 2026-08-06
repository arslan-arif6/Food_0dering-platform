"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { OrderDateFilter } from "@/lib/database/orders";

const filters: {
    label: string;
    value: OrderDateFilter;
}[] = [
        {
            label: "Today",
            value: "today",
        },
        {
            label: "Yesterday",
            value: "yesterday",
        },
        {
            label: "Last 7 Days",
            value: "last7days",
        },
        {
            label: "This Month",
            value: "month",
        },
        {
            label: "All Orders",
            value: "all",
        },
    ];

export default function OrderDateFilters({
    basePath = "/admin/orders",
}: {
    basePath?: string;
}) {
    const searchParams = useSearchParams();

    const current =
        (searchParams.get("date") as OrderDateFilter) ??
        "today";

    return (
        <div className="flex flex-wrap gap-3">
            {filters.map((filter) => {
                const params = new URLSearchParams(searchParams);

                params.set("date", filter.value);

                const active = current === filter.value;

                return (
                    <Link
                        key={filter.value}
                        href={`${basePath}?${params.toString()}`}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${active
                            ? "bg-sage text-offwhite"
                            : "border border-sage text-sage hover:bg-sage hover:text-offwhite"
                            }`}
                    >
                        {filter.label}
                    </Link>
                );
            })}
        </div>
    );
}