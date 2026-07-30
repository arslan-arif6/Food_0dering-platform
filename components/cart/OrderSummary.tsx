"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, UtensilsCrossed } from "lucide-react";

type Props = {
    subtotal: number;
    deliveryFee: number;
    estimatedDeliveryTime?: string;
};

export default function OrderSummary({
    subtotal,
    deliveryFee,
    estimatedDeliveryTime = "30-45 mins",
}: Props) {
    const total = subtotal + deliveryFee;
    const isCartEmpty = subtotal <= 0;

    return (
        <aside className="sticky top-24 rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-2xl font-semibold text-walnut">
                Order Summary
            </h2>

            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-walnut-light">Subtotal</span>

                    <span className="font-semibold text-walnut">
                        Rs. {subtotal}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-walnut-light">Delivery</span>

                    <span className="font-semibold text-sage-dark">
                        {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
                    </span>
                </div>

                <div className="border-t border-walnut/10 pt-4">
                    <div className="flex items-center justify-between">
                        <span className="font-display text-xl font-semibold text-walnut">
                            Total
                        </span>

                        <span className="font-display text-2xl font-bold text-sage-dark">
                            Rs. {total}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 rounded-2xl bg-cream p-4 text-sm text-walnut-light">
                {deliveryFee === 0 && <p>✅ Free Delivery</p>}

                <p className="mt-2">
                    🚚 Estimated delivery: <strong>{estimatedDeliveryTime}</strong>
                </p>

                <p className="mt-2">
                    🍲 Freshly cooked after your order is confirmed.
                </p>
            </div>

            {isCartEmpty ? (
                <button
                    disabled
                    className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-gray-300 py-4 font-semibold text-gray-600"
                >
                    <ShoppingBag className="h-5 w-5" />
                    Cart is Empty
                </button>
            ) : (
                <>
                    <Link
                        href="/checkout"
                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-sage py-4 font-semibold text-offwhite transition-all duration-300 hover:-translate-y-1 hover:bg-sage-dark"
                    >
                        Proceed to Checkout
                        <ArrowRight className="h-5 w-5" />
                    </Link>

                    <Link
                        href="/menu"
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-sage py-4 font-semibold text-sage transition-all duration-300 hover:bg-sage hover:text-offwhite"
                    >
                        <UtensilsCrossed className="h-5 w-5" />
                        Add More Dishes
                    </Link>
                </>
            )}
        </aside>
    );
}