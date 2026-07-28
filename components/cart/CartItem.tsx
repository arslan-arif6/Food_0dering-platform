"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "./CartProvider";

type Props = {
    item: CartItemType;

    increaseQuantity: (
        id: string,
        variantId: string
    ) => void;

    decreaseQuantity: (
        id: string,
        variantId: string
    ) => void;

    removeItem: (
        id: string,
        variantId: string
    ) => void;
};

export default function CartItem({
    item,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
}: Props) {
    return (
        <div className="flex gap-5 rounded-3xl bg-white p-5 shadow-soft">

            <div className="relative h-24 w-24 overflow-hidden rounded-2xl">

                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                />

            </div>

            <div className="flex flex-1 flex-col">

                <h3 className="font-display text-xl font-semibold text-walnut">
                    {item.name}
                </h3>

                <p className="text-sm text-walnut-light">
                    {item.variantName}
                </p>

                <p className="mt-2 font-semibold text-sage-dark">
                    Rs. {item.price}
                </p>

                <div className="mt-5 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                decreaseQuantity(
                                    item.id,
                                    item.variantId
                                )
                            }
                            className="rounded-lg border border-walnut/10 p-2 hover:bg-cream"
                        >
                            <Minus className="h-4 w-4" />
                        </button>

                        <span className="min-w-6 text-center font-semibold">
                            {item.quantity}
                        </span>

                        <button
                            onClick={() =>
                                increaseQuantity(
                                    item.id,
                                    item.variantId
                                )
                            }
                            className="rounded-lg border border-walnut/10 p-2 hover:bg-cream"
                        >
                            <Plus className="h-4 w-4" />
                        </button>

                    </div>

                    <button
                        onClick={() =>
                            removeItem(
                                item.id,
                                item.variantId
                            )
                        }
                        className="text-red-500 transition hover:text-red-700"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>

                </div>

            </div>

        </div>
    );
}