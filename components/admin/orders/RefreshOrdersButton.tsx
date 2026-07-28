"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

// Server components (like the Orders list page) can't hold an
// onClick handler themselves, so the actual "refresh" behavior lives
// in this small client component instead of inline in page.tsx.
// router.refresh() re-runs the page's server-side data fetch
// (getOrders) and updates the list in place — no full page reload.
export default function RefreshOrdersButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleRefresh() {
        startTransition(() => {
            router.refresh();
        });
    }

    return (
        <button
            type="button"
            onClick={handleRefresh}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full border border-sage px-4 py-2 text-sm font-medium text-sage transition hover:bg-sage hover:text-offwhite disabled:opacity-60"
        >
            <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            Refresh
        </button>
    );
}