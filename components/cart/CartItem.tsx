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
        <div className="flex gap-3 rounded-3xl bg-white p-3 shadow-soft sm:gap-5 sm:p-5">

            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28">

                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                />

            </div>

            <div className="flex flex-1 flex-col">

                <h3 className="line-clamp-2 font-display text-lg font-semibold leading-tight text-walnut sm:text-xl">
                    {item.name}
                </h3>

                <p className="text-sm text-walnut-light">
                    {item.variantName}
                </p>

                <p className="mt-2 font-semibold text-sage-dark">
                    Rs. {item.price}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:mt-5">

                    <div className="flex items-center gap-2 rounded-full bg-cream/70 p-1">

                        <button
                            type="button"
                            onClick={() =>
                                decreaseQuantity(
                                    item.id,
                                    item.variantId
                                )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-offwhite text-walnut shadow-sm hover:bg-cream sm:h-11 sm:w-11"
                        >
                            <Minus className="h-4 w-4" />
                        </button>

                        <span className="min-w-6 text-center font-semibold">
                            {item.quantity}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                increaseQuantity(
                                    item.id,
                                    item.variantId
                                )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-offwhite text-walnut shadow-sm hover:bg-cream sm:h-11 sm:w-11"
                        >
                            <Plus className="h-4 w-4" />
                        </button>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            removeItem(
                                item.id,
                                item.variantId
                            )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 hover:text-red-700"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>

                </div>

            </div>

        </div>
    );
}
