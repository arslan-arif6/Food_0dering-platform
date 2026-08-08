"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getMostRecentOrder } from "@/lib/utils/order-tracking";

type TrackOrderAutoLoadProps = {
    hasId: boolean;
};

export default function TrackOrderAutoLoad({ hasId }: TrackOrderAutoLoadProps) {
    const router = useRouter();

    useEffect(() => {
        if (hasId) return;

        const recentOrder = getMostRecentOrder();
        if (recentOrder) {
            router.replace(
                `/track-order?id=${encodeURIComponent(recentOrder.id)}&phone=${encodeURIComponent(recentOrder.phone)}`
            );
        }
    }, [hasId, router]);

    return null;
}