"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type OrderInsertPayload = Tables<"orders">;

const SEEN_ORDERS_KEY = "kitchenhub_seen_order_notifications";
const MAX_SEEN_ORDERS = 100;

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

/**
 * Keeps a small browser-side history of already-notified order IDs.
 *
 * This prevents duplicate alerts if:
 * - React remounts the listener
 * - the admin navigates around the dashboard
 * - Supabase delivers the same INSERT more than once
 */
function hasAlreadyNotified(orderId: string): boolean {
    if (typeof window === "undefined") return false;

    try {
        const raw = window.sessionStorage.getItem(SEEN_ORDERS_KEY);

        if (!raw) return false;

        const parsed: unknown = JSON.parse(raw);

        if (!Array.isArray(parsed)) return false;

        return parsed.includes(orderId);
    } catch {
        return false;
    }
}

function markOrderAsNotified(orderId: string) {
    if (typeof window === "undefined") return;

    try {
        const raw = window.sessionStorage.getItem(SEEN_ORDERS_KEY);

        let existing: string[] = [];

        if (raw) {
            const parsed: unknown = JSON.parse(raw);

            if (Array.isArray(parsed)) {
                existing = parsed.filter(
                    (value): value is string => typeof value === "string"
                );
            }
        }

        const updated = [
            ...existing.filter((id) => id !== orderId),
            orderId,
        ].slice(-MAX_SEEN_ORDERS);

        window.sessionStorage.setItem(
            SEEN_ORDERS_KEY,
            JSON.stringify(updated)
        );
    } catch {
        // Notification state is only a convenience.
        // Never let storage errors affect order handling.
    }
}

/**
 * Small 3-note chime generated with Web Audio API.
 *
 * No audio file or additional package is required.
 * Browsers only allow this after the page has received a user gesture,
 * so the component unlocks the AudioContext on the admin's first click/key press.
 */
function playNewOrderSound(audioContext: AudioContext | null) {
    if (!audioContext) return;

    try {
        if (audioContext.state === "suspended") {
            void audioContext.resume();
        }

        const now = audioContext.currentTime;

        const notes = [
            { frequency: 660, start: 0 },
            { frequency: 880, start: 0.11 },
            { frequency: 1046, start: 0.22 },
        ];

        notes.forEach(({ frequency, start }) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(
                frequency,
                now + start
            );

            gain.gain.setValueAtTime(0, now + start);
            gain.gain.linearRampToValueAtTime(
                0.085,
                now + start + 0.015
            );
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                now + start + 0.24
            );

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.start(now + start);
            oscillator.stop(now + start + 0.25);
        });
    } catch {
        // Sound must never interfere with realtime order handling.
    }
}

function showBrowserNotification(
    order: OrderInsertPayload,
    onClick: () => void
) {
    if (typeof window === "undefined") return;

    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted") return;

    const orderId = order.id.slice(0, 8);

    const notification = new Notification("🍽️ New Order Received", {
        body: `#${orderId} · ${order.customer_name} · Rs. ${Number(
            order.total
        ).toFixed(0)}`,
        tag: `kitchenhub-order-${order.id}`,
        requireInteraction: true,
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
        onClick();
    };
}

export default function RealtimeOrdersListener() {
    const router = useRouter();

    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        /**
         * Unlock browser audio after the admin interacts with the page.
         * This is required by browser autoplay policies.
         */
        function unlockAudio() {
            try {
                if (!audioContextRef.current) {
                    const AudioContextClass =
                        window.AudioContext ||
                        (
                            window as typeof window & {
                                webkitAudioContext?: typeof AudioContext;
                            }
                        ).webkitAudioContext;

                    if (!AudioContextClass) return;

                    audioContextRef.current = new AudioContextClass();
                }

                if (audioContextRef.current.state === "suspended") {
                    void audioContextRef.current.resume();
                }
            } catch {
                // Audio is optional. Never break the admin dashboard.
            }
        }

        /**
         * Ask for notification permission only after a real user gesture.
         *
         * We do NOT request permission automatically on page load.
         */
        async function requestNotificationPermission() {
            if (!("Notification" in window)) return;

            if (Notification.permission !== "default") return;

            try {
                await Notification.requestPermission();
            } catch {
                // Permission denial/error should not affect the dashboard.
            }
        }

        function handleUserInteraction() {
            unlockAudio();
            void requestNotificationPermission();
        }

        window.addEventListener("pointerdown", handleUserInteraction, {
            once: true,
            passive: true,
        });

        window.addEventListener("keydown", handleUserInteraction, {
            once: true,
            passive: true,
        });

        const channel = supabase
            .channel("admin-orders-realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "orders",
                },
                (payload) => {
                    if (payload.eventType !== "INSERT") {
                        router.refresh();
                        return;
                    }

                    const order = payload.new as OrderInsertPayload;

                    /**
                     * Critical duplicate protection:
                     * one order ID can only trigger the alert once
                     * in this browser session.
                     */
                    if (hasAlreadyNotified(order.id)) {
                        router.refresh();
                        return;
                    }

                    markOrderAsNotified(order.id);

                    const orderId = order.id.slice(0, 8);

                    // Sound alert
                    playNewOrderSound(audioContextRef.current);

                    // Browser notification
                    showBrowserNotification(order, () => {
                        router.push(`/admin/orders/${order.id}`);
                    });

                    // Existing in-dashboard notification
                    toast(
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-walnut">
                                New order received
                            </span>

                            <span className="text-sm text-walnut-light">
                                #{orderId} from {order.customer_name} · Rs.{" "}
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
                                onClick: () =>
                                    openWhatsAppOrderMessage(order),
                            },
                        }
                    );

                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            window.removeEventListener(
                "pointerdown",
                handleUserInteraction
            );

            window.removeEventListener(
                "keydown",
                handleUserInteraction
            );

            void supabase.removeChannel(channel);

            if (audioContextRef.current) {
                void audioContextRef.current.close();
                audioContextRef.current = null;
            }
        };
    }, [router]);

    return null;
}