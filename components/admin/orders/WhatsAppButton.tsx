"use client";

import { MessageCircle } from "lucide-react";

import type {
    DatabaseOrder,
    OrderStatus,
} from "@/lib/database/orders";

type Props = {
    order: Pick<
        DatabaseOrder,
        "id" | "customerName" | "phone" | "status"
    >;
};

function buildMessage(order: Props["order"]) {
    const orderId = order.id.slice(0, 8);

    switch (order.status) {
        case "new":
            return `Hello ${order.customerName},

Thank you for ordering from Home Made Food.

Your order #${orderId} has been received successfully.

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

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
        </a>
    );
}