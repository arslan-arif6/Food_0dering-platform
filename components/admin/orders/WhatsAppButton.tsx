"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

import type { DatabaseOrder } from "@/lib/database/orders";
import { updateOrderStatusAction } from "@/app/actions/update-order-status";

type OrderForWhatsApp = Pick<DatabaseOrder, "id" | "customerName" | "phone" | "status" | "address" | "total">;

type Props = {
    order: OrderForWhatsApp;
};

function buildMessage(order: OrderForWhatsApp) {
    const orderId = order.id.slice(0, 8);

    switch (order.status) {
        case "new":
            return `Hello ${order.customerName},

Thank you for ordering from Home Made Food.

Your order #${orderId} has been received successfully.

Total: Rs. ${order.total}
Delivery Address: ${order.address}

We have started preparing your order.

Thank you ❤️`;

        case "delivered":
            return `Hello ${order.customerName},

Your order #${orderId} has been delivered successfully.

We hope you enjoyed your meal.

Thank you for choosing Home Made Food ❤️`;

        case "cancelled":
            return `Hello ${order.customerName},

Unfortunately your order #${orderId} has been cancelled.

We apologize for the inconvenience.`;

        default:
            return "";
    }
}

export default function WhatsAppButton({
    order,
}: Props) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    if (
        order.status !== "new" &&
        order.status !== "delivered" &&
        order.status !== "cancelled"
    ) {
        return null;
    }

    const phone = order.phone
        .replace(/\D/g, "")
        .replace(/^0/, "92");

    const message = buildMessage(order);

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // For a brand-new order: sending the WhatsApp confirmation also moves the
    // order to "Preparing", since sending the message IS the "we've started" step.
    if (order.status === "new") {
        return (
            <button
                type="button"
                disabled={isPending}
                onClick={() => {
                    window.open(url, "_blank", "noopener,noreferrer");

                    startTransition(async () => {
                        await updateOrderStatusAction(order.id, "preparing");
                        router.refresh();
                    });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
            >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
            </button>
        );
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
        </a >
    );
}