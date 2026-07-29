"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { getRestaurantAvailability, settingsToScheduleConfig } from "@/lib/restaurant";
import type { RestaurantSettings } from "@/lib/database/settings";

type CheckoutSummaryProps = {
    settings: RestaurantSettings | null;
};

export default function CheckoutSummary({ settings }: CheckoutSummaryProps) {
    const { cart, totalPrice } = useCart();

    const availability = getRestaurantAvailability(
        new Date(),
        settingsToScheduleConfig(settings)
    );

    const deliveryFee =
        settings?.free_delivery_threshold != null &&
            totalPrice >= settings.free_delivery_threshold
            ? 0
            : settings?.delivery_fee ?? 0;

    const total = totalPrice + deliveryFee;

    const unavailableIds = useMemo(() => {
        if (!availability.currentMeal) {
            return new Set<string>();
        }

        return new Set(
            cart
                .filter(
                    (item) =>
                        item.variantName.toLowerCase() !==
                        availability.currentMeal!.toLowerCase()
                )
                .map((item) => `${item.id}-${item.variantId}`)
        );
    }, [cart, availability.currentMeal]);

    return (
        <div className="sticky top-28 rounded-3xl bg-white p-8 shadow-soft">
            <h2 className="font-display text-3xl font-semibold text-walnut">
                Order Summary
            </h2>

            <div className="mt-8 space-y-4">
                {cart.map((item) => {
                    const unavailable = unavailableIds.has(`${item.id}-${item.variantId}`);

                    return (
                        <div
                            key={`${item.id}-${item.variantId}`}
                            className={`flex items-center justify-between border-b pb-3 ${unavailable ? "opacity-60" : ""}`}
                        >
                            <div>
                                <p className="font-semibold text-walnut">{item.name}</p>

                                <p className="text-sm text-walnut-light">
                                    {item.variantName} × {item.quantity}
                                </p>

                                {unavailable && (
                                    <p className="mt-1 text-xs font-semibold text-red-600">
                                        Unavailable for current meal
                                    </p>
                                )}
                            </div>

                            <p className="font-semibold text-sage-dark">
                                Rs. {item.price * item.quantity}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 space-y-3 border-t pt-5">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs. {totalPrice}</span>
                </div>

                <div className="flex justify-between">
                    <span>Delivery</span>
                    {deliveryFee === 0 ? (
                        <span className="font-semibold text-green-600">FREE</span>
                    ) : (
                        <span className="font-semibold text-walnut">Rs. {deliveryFee}</span>
                    )}
                </div>

                <div className="flex justify-between border-t pt-4 text-xl font-bold">
                    <span>Total</span>
                    <span className="text-sage-dark">Rs. {total}</span>
                </div>
            </div>

            <div className="mt-8 rounded-2xl bg-cream p-4 text-center text-sm text-walnut-light">
                Complete your delivery details on the left, then click
                <strong> Place Order</strong> to confirm your order.
            </div>

            <Link
                href="/cart"
                className="mt-6 block text-center text-sm text-sage-dark hover:underline"
            >
                ← Back to Cart
            </Link>
        </div>
    );
}