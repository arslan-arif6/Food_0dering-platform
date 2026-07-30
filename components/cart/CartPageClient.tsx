"use client";

import Link from "next/link";

import { ArrowLeft, ShoppingBag } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartProvider";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import type { RestaurantSettings } from "@/lib/database/settings";

type Props = {
    settings: RestaurantSettings | null;
};

export default function CartPageClient({ settings }: Props) {
    const {
        cart,
        totalPrice,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        itemCount,
    } = useCart();

    const deliveryFee =
        settings?.free_delivery_threshold != null &&
            totalPrice >= settings.free_delivery_threshold
            ? 0
            : settings?.delivery_fee ?? 0;

    if (cart.length === 0) {
        return (
            <>
                <Navbar />

                <main className="mx-auto flex min-h-[75vh] max-w-7xl flex-col items-center justify-center px-5 py-20 text-center">

                    <div className="rounded-full bg-sage/10 p-8">

                        <ShoppingBag
                            className="h-20 w-20 text-sage"
                            strokeWidth={1.5}
                        />

                    </div>

                    <h1 className="mt-8 font-display text-4xl font-semibold text-walnut">
                        Your Cart is Empty
                    </h1>

                    <p className="mt-4 max-w-md leading-7 text-walnut-light">
                        Looks like you haven't added any delicious homemade meals yet.
                        Explore our menu and start building your order.
                    </p>

                    <Link
                        href="/menu"
                        className="mt-10 rounded-full bg-sage px-8 py-4 font-semibold text-offwhite transition-all duration-300 hover:-translate-y-1 hover:bg-sage-dark"
                    >
                        Browse Menu
                    </Link>

                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="mx-auto max-w-7xl px-5 py-12">

                <Link
                    href="/menu"
                    className="mb-6 flex w-fit items-center gap-2 text-sm font-semibold text-walnut-light transition hover:text-walnut"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                </Link>

                <div className="mb-10">

                    <h1 className="font-display text-4xl font-semibold text-walnut">
                        Your Cart
                    </h1>

                    <p className="mt-2 text-walnut-light">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
                    </p>

                </div>

                <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">

                    <div className="space-y-6">

                        {cart.map((item) => (
                            <CartItem
                                key={`${item.id}-${item.variantId}`}
                                item={item}
                                increaseQuantity={increaseQuantity}
                                decreaseQuantity={decreaseQuantity}
                                removeItem={removeItem}
                            />
                        ))}

                    </div>

                    <OrderSummary
                        subtotal={totalPrice}
                        deliveryFee={deliveryFee}
                        estimatedDeliveryTime={settings?.estimated_delivery_time ?? "30-45 mins"}
                    />

                </div>

            </main>

            <Footer />
        </>
    );
}