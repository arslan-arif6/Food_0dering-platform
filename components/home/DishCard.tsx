"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Check, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import type { Dish } from "@/lib/data";

export default function DishCard({ dish }: { dish: Dish }) {
  const { addItem } = useCart();

  const [added, setAdded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
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

  const hasMultipleVariants = dish.variants.length > 1;

  const lowestPrice = useMemo(
    () => Math.min(...dish.variants.map((v) => v.price)),
    [dish.variants]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock background scroll while the mobile bottom sheet is open.
  // We toggle a CSS class (body.scroll-locked { overflow:hidden }) instead of
  // setting body.style.overflow directly. Combined with `scrollbar-gutter:stable`
  // on body in globals.css, this means the scrollbar gutter is always reserved
  // and toggling the class causes zero layout shift.
  useEffect(() => {
    if (sheetOpen) {
      document.body.classList.add("scroll-locked");
    } else {
      document.body.classList.remove("scroll-locked");
    }
    return () => {
      document.body.classList.remove("scroll-locked");
    };
  }, [sheetOpen]);

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
    setSheetOpen(false);

    setTimeout(() => {
      setAdded(false);
    }, 1600);
  };

  const handleQuickAdd = () => {
    if (hasMultipleVariants) {
      setSheetOpen(true);
      return;
    }
    handleAdd();
  };

  return (
    <>
      {/* ── COMPACT CARD: visible below md ── */}
      <div className="rounded-[1.35rem] bg-offwhite p-2.5 shadow-soft md:hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl min-[390px]:aspect-square">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="50vw"
          />

          {dish.tag && (
            <span className="absolute left-2 top-2 rounded-full bg-offwhite/90 px-2 py-0.5 text-[11px] font-semibold text-sage-dark shadow-soft">
              {dish.tag}
            </span>
          )}

          {dish.soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="rounded-full bg-offwhite px-3 py-1.5 text-xs font-semibold text-walnut">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="px-1 pb-1 pt-2.5">
          <h3 className="line-clamp-2 min-h-[2.35rem] font-display text-[15px] font-semibold leading-tight text-walnut min-[390px]:text-sm">
            {dish.name}
          </h3>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="min-w-0 text-sm font-semibold leading-tight text-sage-dark">
              {hasMultipleVariants ? `From Rs. ${lowestPrice}` : `Rs. ${lowestPrice}`}
            </span>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={dish.soldOut}
              aria-label={`Add ${dish.name} to cart`}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:bg-walnut/15 ${
                added ? "bg-sage-dark" : "bg-sage active:bg-sage-dark"
              }`}
            >
              {added ? (
                <Check className="h-4 w-4 text-offwhite" />
              ) : (
                <Plus className="h-4 w-4 text-offwhite" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SHEET: portals to document.body, mobile only ── */}
      {isMounted && sheetOpen &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-50 bg-walnut/45 md:hidden"
              onClick={() => setSheetOpen(false)}
            />

            {/* Sheet panel */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Choose portion for ${dish.name}`}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto overscroll-contain rounded-t-[2rem] bg-offwhite p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-soft-lg md:hidden"
            >
              {/* Drag handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-walnut/15" />

              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold leading-snug text-walnut">
                  {dish.name}
                </h3>

                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream/60 text-walnut-light transition-colors hover:bg-cream"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mb-3 mt-4 text-sm font-semibold text-walnut">
                Choose portion
              </p>

              <div className="space-y-2">
                {dish.variants.map((variant) => (
                  <label
                    key={variant.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      selectedVariantId === variant.id
                        ? "border-sage bg-sage/10"
                        : "border-walnut/10 hover:border-sage/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`variant-sheet-${dish.id}`}
                        checked={selectedVariantId === variant.id}
                        onChange={() => setSelectedVariantId(variant.id)}
                        className="accent-sage-dark"
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

              <button
                onClick={handleAdd}
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-sage px-5 py-3 font-semibold text-offwhite transition-all duration-300 hover:bg-sage-dark"
              >
                <Plus className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </>,
          document.body
        )}

      {/* ── FULL CARD: visible from md upward, unchanged ── */}
      <div className="group relative hidden rounded-3xl bg-offwhite p-4 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:rotate-[0.5deg] hover:shadow-soft-lg md:block">
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
            sizes="(min-width:1024px) 33vw, 50vw"
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
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                    selectedVariantId === variant.id
                      ? "border-sage bg-sage/10"
                      : "border-walnut/10 hover:border-sage/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`variant-desktop-${dish.id}`}
                      checked={selectedVariantId === variant.id}
                      onChange={() => setSelectedVariantId(variant.id)}
                      className="accent-sage-dark"
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
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold transition-all duration-300 ${
              dish.soldOut
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
    </>
  );
}