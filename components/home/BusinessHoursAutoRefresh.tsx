"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-fetches BusinessHours' server data every 60s so the "being
// served now" status keeps ticking over live without a page reload.
// No time/schedule math lives here — it just asks the server to
// recompute using the same lib/restaurant engine everything else uses.
export default function BusinessHoursAutoRefresh() {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 60000);

        return () => clearInterval(interval);
    }, [router]);

    return null;
}