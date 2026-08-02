"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Pencil, Trash2, MoreVertical, X } from "lucide-react";

import type { DatabaseDish } from "@/lib/database/dishes";
import StatusBadge from "@/components/admin/menu/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { deleteDishAction } from "@/app/admin/(protected)/menu/actions";
import { toast } from "sonner";

type DishManagementCardProps = {
    dish: DatabaseDish;
    categoryLookup: Record<string, string>;
};

export default function DishManagementCard({
    dish,
    categoryLookup,
}: DishManagementCardProps) {
    const [open, setOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (sheetOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [sheetOpen]);

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteDishAction(dish.id, dish.image);

            if (!result.success) {
                toast.error(result.error ?? "Failed to delete dish.");
                return;
            }

            setOpen(false);
            setSheetOpen(false);
        });
    }

    return (
        <>
            {/* ---------- COMPACT CARD (Mobile, below md) ---------- */}
            <div className="flex items-center gap-4 rounded-[1.35rem] bg-offwhite p-3 shadow-soft md:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    className="aspect-square h-20 w-20 shrink-0 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1 py-1">
                    <h3 className="truncate font-display text-[15px] font-semibold text-walnut">
                        {dish.name}
                    </h3>
                    
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        <StatusBadge
                            active={dish.available}
                            activeLabel="Available"
                            inactiveLabel="Unavailable"
                        />
                        {dish.soldOut && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                                Sold Out
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    aria-label="Manage dish"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-walnut transition hover:bg-cream-dark"
                >
                    <MoreVertical className="h-5 w-5" />
                </button>
            </div>

            {/* ---------- BOTTOM SHEET (Mobile, below md) ---------- */}
            {isMounted && sheetOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-50 bg-walnut/45 md:hidden"
                        onClick={() => setSheetOpen(false)}
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Manage ${dish.name}`}
                        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-offwhite p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:hidden"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-xl font-semibold leading-snug text-walnut">
                                {dish.name}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSheetOpen(false)}
                                aria-label="Close"
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream/60 text-walnut-light"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <StatusBadge
                                active={dish.available}
                                activeLabel="Available"
                                inactiveLabel="Unavailable"
                            />
                            {dish.soldOut && (
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                    Sold Out
                                </span>
                            )}
                            <StatusBadge
                                active={dish.featured}
                                activeLabel="Featured"
                                inactiveLabel="Standard"
                            />
                        </div>

                        <div className="mt-5">
                            <h4 className="mb-2 text-sm font-semibold text-walnut">Categories</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {dish.categories.length === 0 ? (
                                    <span className="text-sm text-walnut-light">No category</span>
                                ) : (
                                    dish.categories.map((slug) => (
                                        <span
                                            key={slug}
                                            className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-walnut"
                                        >
                                            {categoryLookup[slug] ?? slug}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="mt-5">
                            <h4 className="mb-2 text-sm font-semibold text-walnut">Variants</h4>
                            <div className="flex flex-col gap-2">
                                {dish.variants.length === 0 ? (
                                    <span className="text-sm text-walnut-light">No variants set</span>
                                ) : (
                                    dish.variants.map((variant) => (
                                        <div
                                            key={variant.id}
                                            className="flex items-center justify-between rounded-xl border border-walnut/10 px-4 py-3"
                                        >
                                            <span className="font-medium text-walnut">{variant.name}</span>
                                            <span className="font-semibold text-sage-dark">Rs. {variant.price}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <Link
                                href={`/admin/menu/${dish.id}/edit`}
                                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-sage px-5 py-3 font-semibold text-offwhite transition hover:bg-sage-dark"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit Dish
                            </Link>

                            <button
                                type="button"
                                onClick={() => {
                                    setSheetOpen(false);
                                    setOpen(true);
                                }}
                                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Dish
                            </button>
                        </div>
                    </div>
                </>,
                document.body
            )}

            {/* ---------- FULL CARD (Desktop, md and up) ---------- */}
            <div className="hidden items-center gap-5 rounded-3xl bg-offwhite p-5 shadow-soft md:flex">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    className="h-24 w-32 shrink-0 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-walnut">
                            {dish.name}
                        </h3>

                        <StatusBadge
                            active={dish.available}
                            activeLabel="Available"
                            inactiveLabel="Unavailable"
                        />

                        {dish.soldOut && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                Sold Out
                            </span>
                        )}

                        <StatusBadge
                            active={dish.featured}
                            activeLabel="Featured"
                            inactiveLabel="Standard"
                        />
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {dish.categories.length === 0 ? (
                            <span className="text-sm text-walnut-light">
                                No category
                            </span>
                        ) : (
                            dish.categories.map((slug) => (
                                <span
                                    key={slug}
                                    className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-walnut"
                                >
                                    {categoryLookup[slug] ?? slug}
                                </span>
                            ))
                        )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {dish.variants.length === 0 ? (
                            <span className="text-sm text-walnut-light">
                                No variants set
                            </span>
                        ) : (
                            dish.variants.map((variant) => (
                                <span
                                    key={variant.id}
                                    className="rounded-lg border border-walnut/10 px-3 py-1.5 text-sm text-walnut"
                                >
                                    {variant.name}{" "}
                                    <span className="font-semibold text-sage-dark">
                                        Rs. {variant.price}
                                    </span>
                                </span>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                    <Link
                        href={`/admin/menu/${dish.id}/edit`}
                        aria-label="Edit dish"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-walnut transition hover:bg-cream-dark"
                    >
                        <Pencil className="h-4 w-4" strokeWidth={1.9} />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        disabled={isPending}
                        aria-label="Delete dish"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" strokeWidth={1.9} />
                    </button>
                </div>
            </div>

            <ConfirmDialog
                open={open}
                title="Delete Dish"
                description={`Are you sure you want to delete "${dish.name}"? This action cannot be undone.`}
                confirmText={isPending ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                onCancel={() => {
                    if (!isPending) {
                        setOpen(false);
                    }
                }}
                onConfirm={handleDelete}
            />
        </>
    );
}