"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import type { OrderStatus } from "@/lib/database/orders";
import { updateOrderStatusAction } from "@/app/actions/update-order-status";

type Props = {
    orderId: string;
    currentStatus: OrderStatus;
};

const statuses: OrderStatus[] = [
    "new",
    "preparing",
    "ready",
    "delivered",
    "cancelled",
];

export default function OrderStatusForm({
    orderId,
    currentStatus,
}: Props) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <div className="rounded-3xl bg-offwhite p-6 shadow-soft">
            <h3 className="mb-5 text-xl font-semibold text-walnut">
                Update Order Status
            </h3>

            <div className="flex flex-wrap gap-3">
                {statuses.map((status) => (
                    <button
                        key={status}
                        type="button"
                        disabled={isPending || status === currentStatus}
                        onClick={() =>
                            startTransition(async () => {
                                await updateOrderStatusAction(orderId, status);

                                // Refresh server components
                                router.refresh();
                            })
                        }
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${status === currentStatus
                            ? "bg-sage text-offwhite"
                            : "border border-sage text-sage hover:bg-sage hover:text-offwhite"
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {isPending && (
                <p className="mt-4 text-sm text-walnut-light">
                    Updating status...
                </p>
            )}
        </div>
    );
}