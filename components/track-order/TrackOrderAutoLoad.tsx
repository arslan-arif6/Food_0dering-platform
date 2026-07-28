"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getMostRecentOrderId } from "@/lib/utils/order-tracking";

type TrackOrderAutoLoadProps = {
    hasId: boolean;
};

// Renders nothing — runs once on mount. If the page was opened
// without ?id= in the URL, checks this browser's localStorage for a
// recently placed order and redirects to the same page with that id
// attached, so the server component's existing lookup picks it up.
// The customer never has to type or paste anything. If there's no
// stored id (or the page already has one), this does nothing and the
// existing empty-state / order view renders as normal.
export default function TrackOrderAutoLoad({ hasId }: TrackOrderAutoLoadProps) {
    const router = useRouter();

    useEffect(() => {
        if (hasId) return;

        const recentId = getMostRecentOrderId();
        if (recentId) {
            router.replace(`/track-order?id=${recentId}`);
        }
    }, [hasId, router]);

    return null;
}