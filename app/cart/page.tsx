"use client";

import Link from "next/link";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";

export default function CartPage() {
    const {
        cart,
        totalPrice,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        itemCount,
    } = useCart();

    if (cart.length === 0) {
        return (
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
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-5 py-12">

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
                    deliveryFee={0}
                />

            </div>

        </main>
    );
}