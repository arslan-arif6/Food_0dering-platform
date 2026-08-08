"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { DatabaseDish } from "@/lib/database/dishes";
import type { DatabaseCategory } from "@/lib/database/categories";
import DishManagementCard from "@/components/admin/menu/DishManagementCard";

type Props = {
    dishes: DatabaseDish[];
    categories: DatabaseCategory[];
    categoryLookup: Record<string, string>;
};

// Search + category filter, client-side. All dishes are already
// fetched server-side (small admin dataset) — filtering here avoids a
// DB round-trip per keystroke, same pattern as the Customers search.
export default function MenuList({ dishes, categories, categoryLookup }: Props) {
    const [search, setSearch] = useState("");
    const [categorySlug, setCategorySlug] = useState("");

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return dishes.filter((dish) => {
            const matchesSearch =
                query === "" || dish.name.toLowerCase().includes(query);

            const matchesCategory =
                categorySlug === "" || dish.categories.includes(categorySlug);

            return matchesSearch && matchesCategory;
        });
    }, [dishes, search, categorySlug]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut-light" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search dishes..."
                        aria-label="Search dishes"
                        className="w-full rounded-xl border border-walnut/15 bg-offwhite py-3 pl-11 pr-4 text-[15px] text-walnut outline-none transition focus:border-sage"
                    />
                </div>

                <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    aria-label="Filter by category"
                    className="rounded-xl border border-walnut/15 bg-offwhite px-4 py-3 text-[15px] text-walnut outline-none transition focus:border-sage sm:w-56"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-3xl bg-offwhite p-14 text-center text-walnut-light shadow-soft">
                    No dishes match your search.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map((dish) => (
                        <DishManagementCard
                            key={dish.id}
                            dish={dish}
                            categoryLookup={categoryLookup}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}