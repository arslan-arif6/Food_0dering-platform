"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, Users, ChevronLeft, ChevronRight } from "lucide-react";

import EmptyState from "@/components/admin/EmptyState";
import type { CustomerSummary } from "@/lib/database/customers";

type Props = {
    customers: CustomerSummary[];
};

const PAGE_SIZE = 25;

export default function CustomerDirectory({ customers }: Props) {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const value = query.trim().toLowerCase();

        if (value === "") return customers;

        return customers.filter(
            (customer) =>
                customer.customerName.toLowerCase().includes(value) ||
                customer.phone.includes(value)
        );
    }, [customers, query]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);

    const paginated = filtered.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    function handleQueryChange(value: string) {
        setQuery(value);
        setPage(1); // reset to page 1 whenever the search changes
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-walnut-light" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Search by name or phone..."
                    className="w-full rounded-full border border-walnut/10 bg-offwhite py-3 pl-12 pr-28 text-[15px] text-walnut placeholder:text-walnut-light focus:border-sage focus:outline-none"
                />

                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                    {query !== "" && (
                        <button
                            type="button"
                            onClick={() => handleQueryChange("")}
                            className="rounded-full p-1 hover:bg-cream"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4 text-walnut-light" />
                        </button>
                    )}

                    <button
                        type="button"
                        className="rounded-full bg-sage px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
                    >
                        Search
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title={query ? "No matching customers" : "No customers yet"}
                    description={
                        query
                            ? "Try a different name or phone number."
                            : "Once orders start coming in, customers will show up here automatically."
                    }
                />
            ) : (
                <>
                    <div className="overflow-hidden rounded-3xl bg-offwhite shadow-soft">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-cream">
                                    <tr>
                                        <th className="px-4 py-4 text-left">Customer</th>
                                        <th className="px-4 py-4 text-left">Phone</th>
                                        <th className="px-4 py-4 text-center">Orders</th>
                                        <th className="px-4 py-4 text-left">Total Spent</th>
                                        <th className="px-4 py-4 text-left">Last Order</th>
                                        <th className="px-4 py-4"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginated.map((customer) => (
                                        <tr
                                            key={customer.phone}
                                            className="border-t border-walnut/5"
                                        >
                                            <td className="px-4 py-4 text-walnut">
                                                {customer.customerName}
                                            </td>
                                            <td className="px-4 py-4 text-walnut-light">
                                                {customer.phone}
                                            </td>
                                            <td className="px-4 py-4 text-center text-walnut">
                                                {customer.totalOrders}
                                            </td>
                                            <td className="px-4 py-4 text-walnut">
                                                Rs. {customer.totalSpent.toFixed(0)}
                                            </td>
                                            <td className="px-4 py-4 text-walnut-light">
                                                {new Date(customer.lastOrderAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <Link
                                                    href={`/admin/customers/${encodeURIComponent(customer.phone)}`}
                                                    className="font-semibold text-sage hover:text-sage-dark"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-2">
                            <p className="text-sm text-walnut-light">
                                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                                {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                                {filtered.length}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={safePage === 1}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-walnut disabled:opacity-40"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                <span className="text-sm text-walnut">
                                    Page {safePage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((p) => Math.min(totalPages, p + 1))
                                    }
                                    disabled={safePage === totalPages}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-walnut disabled:opacity-40"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}