"use client";

import {
    Search,
    X,
    ChevronDown,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    KeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Suggestion = {
    id: string;
    customerName: string;
    phone: string;
};

type Props = {
    orders: Suggestion[];
    defaultValue: string;
    status?: string;
};

export default function SearchOrdersInput({
    orders,
    defaultValue,
    status,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(defaultValue);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
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

        if (!value) return [];

        return orders
            .filter(
                (o) =>
                    o.customerName
                        .toLowerCase()
                        .includes(value) ||
                    o.phone.includes(value) ||
                    o.id.toLowerCase().includes(value)
            )
            .slice(0, 8);
    }, [orders, query]);

    useEffect(() => {
        if (query.trim() === "") {
            setOpen(false);
            setSelectedIndex(-1);
        } else {
            setOpen(true);
        }
    }, [query]);

    function performSearch(value: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (value.trim() === "") {
            params.delete("search");
        } else {
            params.set("search", value.trim());
        }

        if (status && status !== "all") {
            params.set("status", status);
        }

        router.push(`/admin/orders?${params.toString()}`);
        setOpen(false);
    }

    function clearSearch() {
        setQuery("");

        const params = new URLSearchParams(searchParams.toString());

        params.delete("search");

        if (status === "all") {
            params.delete("status");
        }

        router.push(`/admin/orders?${params.toString()}`);

        setOpen(false);
        setSelectedIndex(-1);
    }

    function handleKeyDown(
        e: KeyboardEvent<HTMLInputElement>
    ) {
        if (!open || suggestions.length === 0) {
            if (e.key === "Enter") {
                e.preventDefault();
                performSearch(query);
            }

            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();

            setSelectedIndex((prev) =>
                prev < suggestions.length - 1
                    ? prev + 1
                    : 0
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();

            setSelectedIndex((prev) =>
                prev <= 0
                    ? suggestions.length - 1
                    : prev - 1
            );
        }

        if (e.key === "Escape") {
            setOpen(false);
        }

        if (e.key === "Enter") {
            e.preventDefault();

            if (
                selectedIndex >= 0 &&
                suggestions[selectedIndex]
            ) {
                performSearch(
                    suggestions[selectedIndex].customerName
                );
            } else {
                performSearch(query);
            }
        }
    }

    return (
        <div
            ref={wrapperRef}
            className="relative"
        >
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-walnut-light" />

            <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (suggestions.length > 0) {
                        setOpen(true);
                    }
                }}
                placeholder="Search by customer, phone or order ID..."
                className="w-full rounded-2xl border border-cream bg-offwhite py-3 pl-12 pr-28 outline-none transition focus:border-sage"
            />

            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                {query !== "" && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="rounded-full p-1 hover:bg-cream"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => performSearch(query)}
                    className="rounded-full bg-sage px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
                >
                    Search
                </button>
            </div>

            {open && suggestions.length > 0 && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-cream bg-offwhite shadow-xl">
                    {suggestions.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                                performSearch(item.customerName)
                            }
                            className={`flex w-full items-center justify-between px-4 py-3 text-left transition ${selectedIndex === index
                                ? "bg-cream"
                                : "hover:bg-cream"
                                }`}
                        >
                            <div>
                                <p className="font-medium">
                                    {item.customerName}
                                </p>

                                <p className="text-sm text-walnut-light">
                                    {item.phone}
                                </p>
                            </div>

                            <ChevronDown className="h-4 w-4 rotate-[-90deg] text-walnut-light" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}