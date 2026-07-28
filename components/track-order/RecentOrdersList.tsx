"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getRecentOrderIds } from "@/lib/utils/order-tracking";

type RecentOrdersListProps = {
    currentId?: string;
};

// Reads localStorage on mount (not during render) so the server-side
// render and the first client render both produce an empty list —
// avoids a hydration mismatch, since localStorage isn't available
// during SSR. The list then fills in right after mount.
//
// Nothing shows if there's only one (or zero) remembered order —
// that single one is already the order being viewed, so a "recent
// orders" row with just itself in it adds nothing.
export default function RecentOrdersList({ currentId }: RecentOrdersListProps) {
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
        setIds(getRecentOrderIds());
    }, []);

    if (ids.length <= 1) return null;

    return (
        <div className="mt-6">
            <p className="text-sm font-medium text-walnut-light">
                Your recent orders
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {ids.map((id) => {
                    const isCurrent = id === currentId;

                    return (
                        <Link
                            key={id}
                            href={`/track-order?id=${id}`}
                            aria-current={isCurrent ? "true" : undefined}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${isCurrent
                                ? "bg-sage text-offwhite"
                                : "bg-offwhite text-walnut hover:bg-cream-dark"
                                }`}
                        >
                            #{id.slice(0, 8)}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}