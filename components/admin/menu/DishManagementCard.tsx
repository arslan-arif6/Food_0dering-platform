"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

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
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteDishAction(dish.id, dish.image);

            if (!result.success) {
                toast.error(result.error ?? "Failed to delete dish.");
                return;
            }

            setOpen(false);
        });
    }

    return (
        <>
            <div className="flex flex-col gap-5 rounded-3xl bg-offwhite p-5 shadow-soft sm:flex-row sm:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    className="h-28 w-full rounded-2xl object-cover sm:h-24 sm:w-32 sm:shrink-0"
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

                <div className="flex shrink-0 items-center gap-2 sm:flex-col">
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