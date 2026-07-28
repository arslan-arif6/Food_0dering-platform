"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 25000;

// Renders nothing. Periodically calls router.refresh(), which re-runs
// this page's server-side data fetch (getOrder) and updates the
// already-rendered page in place — no full navigation, no full page
// reload. This is how an admin's status change (e.g. "preparing" ->
// "ready") shows up on the customer's open tracking page without them
// doing anything.
export default function OrderStatusPoller() {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, POLL_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [router]);

    return null;
}