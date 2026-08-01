"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type OrderInsertPayload = Tables<"orders">;

function formatPhoneForWhatsApp(phone: string) {
    return phone.replace(/\D/g, "").replace(/^0/, "92");
}

function buildNewOrderMessage(order: OrderInsertPayload) {
    const orderId = order.id.slice(0, 8);

    return `Hello ${order.customer_name},

Thank you for ordering from Home Made Food.

Your order #${orderId} has been received successfully.

We have started preparing your order.

Thank you`;
}

function openWhatsAppOrderMessage(order: OrderInsertPayload) {
    const phone = formatPhoneForWhatsApp(order.phone);
    const message = buildNewOrderMessage(order);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
}

export default function RealtimeOrdersListener() {
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel("admin-orders")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        const order = payload.new as OrderInsertPayload;
                        const orderId = order.id.slice(0, 8);

                        toast(
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-walnut">
                                    New WhatsApp order notification
                                </span>
                                <span className="text-sm text-walnut-light">
                                    #{orderId} from {order.customer_name} - Rs.{" "}
                                    {Number(order.total).toFixed(0)}
                                </span>
                            </div>,
                            {
                                duration: 10000,
                                action: {
                                    label: (
                                        <span className="inline-flex items-center gap-1">
                                            <MessageCircle className="h-4 w-4" />
                                            WhatsApp
                                        </span>
                                    ),
                                    onClick: () => openWhatsAppOrderMessage(order),
                                },
                            }
                        );
                    }

                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router]);

    return null;
}
