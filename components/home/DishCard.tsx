"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import type { Dish } from "@/lib/data";

export default function DishCard({ dish }: { dish: Dish }) {
  const { addItem } = useCart();

  const [added, setAdded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(
    dish.variants[0]?.id ?? null
  );

  const selectedVariant = useMemo(
    () =>
      dish.variants.find(
        (variant) => variant.id === selectedVariantId
      ) ?? dish.variants[0],
    [dish.variants, selectedVariantId]
  );

  const handleAdd = () => {
    addItem({
      id: dish.id,

      name: dish.name,

      image: dish.image,

      variantId: selectedVariant.id,

      variantName: selectedVariant.name,

      price: selectedVariant.price,

      quantity: 1,
      categories: dish.categories,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1600);
  };

  return (
    <div className="group relative rounded-3xl bg-offwhite p-4 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:rotate-[0.5deg] hover:shadow-soft-lg">
      <span
        aria-hidden
        className="absolute -top-2 left-8 h-5 w-14 -rotate-3 rounded-sm bg-sage/40 shadow-tape"
      />

      <div className="stitch-border relative h-48 w-full overflow-hidden rounded-2xl">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
        />

        {dish.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-offwhite/90 px-3 py-1 text-xs font-semibold text-sage-dark shadow-soft">
            {dish.tag}
          </span>
        )}
        {dish.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-offwhite px-4 py-2 text-sm font-semibold text-walnut">
              Sold Out
            </span>
          </div>
        )}
      </div>


      <div className="px-2 pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-snug text-walnut">
            {dish.name}
          </h3>

          <span className="whitespace-nowrap font-display text-lg font-semibold text-sage-dark">
            Rs. {selectedVariant.price}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-walnut-light">
          {dish.description}
        </p>

        {/* Portion Selection */}

        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-walnut">
            Choose Portion
          </p>

          <div className="space-y-2">
            {dish.variants.map((variant) => (
              <label
                key={variant.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${selectedVariantId === variant.id
                  ? "border-sage bg-sage/10"
                  : "border-walnut/10 hover:border-sage/40"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`variant-${dish.id}`}
                    checked={selectedVariantId === variant.id}
                    onChange={() => setSelectedVariantId(variant.id)}
                    className="accent-green-600"
                  />

                  <span className="font-medium text-walnut">
                    {variant.name}
                  </span>
                </div>

                <span className="font-semibold text-sage-dark">
                  Rs. {variant.price}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={dish.soldOut}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold transition-all duration-300 ${dish.soldOut
            ? "cursor-not-allowed bg-walnut/15 text-walnut-light"
            : added
              ? "bg-sage-dark text-offwhite"
              : "bg-sage text-offwhite hover:bg-sage-dark"
            }`}
        >
          {dish.soldOut ? (
            "Sold Out"
          ) : added ? (
            <>
              <Check className="h-4 w-4" />
              Added to Cart
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}