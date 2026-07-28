"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

type SearchOrder = {
    id: string;
    customerName: string;
    phone: string;
};

type OrdersSearchProps = {
    orders: SearchOrder[];
};

export default function OrdersSearch({
    orders,
}: OrdersSearchProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") ?? "";

    const [query, setQuery] = useState(initialSearch);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const suggestions = useMemo(() => {
        const value = query.trim().toLowerCase();

        if (value === "") return [];

        return orders
            .filter((order) => {
                return (
                    order.customerName
                        .toLowerCase()
                        .includes(value) ||
                    order.phone
                        .toLowerCase()
                        .includes(value) ||
                    order.id
                        .toLowerCase()
                        .includes(value)
                );
            })
            .slice(0, 8);
    }, [query, orders]);

    function performSearch(value: string) {
        const trimmed = value.trim();

        if (trimmed === "") {
            router.push("/admin/orders");
            return;
        }

        router.push(
            `/admin/orders?search=${encodeURIComponent(trimmed)}`
        );
    }

    function clearSearch() {
        setQuery("");
        setShowSuggestions(false);
        setSelectedIndex(-1);
        router.push("/admin/orders");
    }

    function selectSuggestion(order: SearchOrder) {
        setQuery(order.customerName);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        performSearch(order.customerName);
    }

    return (
        <div
            ref={wrapperRef}
            className="relative"
        >
            <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-walnut-light" />

            <input
                type="text"
                value={query}
                placeholder="Search customer, phone or order ID..."
                className="w-full rounded-2xl border border-cream bg-offwhite py-3 pl-12 pr-32 outline-none transition focus:border-sage"
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                    setSelectedIndex(-1);
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                        e.preventDefault();

                        if (!showSuggestions) {
                            setShowSuggestions(true);
                        }

                        setSelectedIndex((prev) =>
                            Math.min(prev + 1, suggestions.length - 1)
                        );

                        return;
                    }

                    if (e.key === "ArrowUp") {
                        e.preventDefault();

                        setSelectedIndex((prev) =>
                            Math.max(prev - 1, 0)
                        );

                        return;
                    }

                    if (e.key === "Escape") {
                        setShowSuggestions(false);
                        setSelectedIndex(-1);
                        return;
                    }

                    if (e.key === "Enter") {
                        e.preventDefault();

                        if (
                            selectedIndex >= 0 &&
                            suggestions[selectedIndex]
                        ) {
                            selectSuggestion(
                                suggestions[selectedIndex]
                            );
                            return;
                        }

                        if (suggestions.length === 1) {
                            selectSuggestion(suggestions[0]);
                            return;
                        }

                        performSearch(query);
                        setShowSuggestions(false);
                    }
                }}
            />

            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">

                {query !== "" && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="rounded-full p-1 transition hover:bg-cream"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => {
                        performSearch(query);
                        setShowSuggestions(false);
                    }}
                    className="rounded-xl bg-sage px-4 py-2 text-sm font-medium text-offwhite transition hover:opacity-90"
                >
                    Search
                </button>

            </div>

            {showSuggestions &&
                query.trim() !== "" &&
                suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-cream bg-offwhite shadow-xl">

                        {suggestions.map((order, index) => (
                            <button
                                key={order.id}
                                type="button"
                                onClick={() =>
                                    selectSuggestion(order)
                                }
                                className={`flex w-full flex-col border-b border-cream px-4 py-3 text-left transition last:border-0 ${selectedIndex === index
                                    ? "bg-sage text-offwhite"
                                    : "hover:bg-cream"
                                    }`}
                            >
                                <span className="font-medium">
                                    {order.customerName}
                                </span>

                                <span
                                    className={`text-sm ${selectedIndex === index
                                        ? "text-offwhite/80"
                                        : "text-walnut-light"
                                        }`}
                                >
                                    {order.phone}
                                </span>

                                <span
                                    className={`text-xs ${selectedIndex === index
                                        ? "text-offwhite/70"
                                        : "text-sage"
                                        }`}
                                >
                                    #{order.id.slice(0, 8)}
                                </span>
                            </button>
                        ))}

                    </div>
                )}
        </div>
    );
}