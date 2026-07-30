"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useState, useTransition } from "react";

import type { DatabaseCategory } from "@/lib/database/categories";
import { deleteCategoryAction } from "@/app/admin/(protected)/categories/actions";
import { toast } from "sonner";
type Props = {
    category: DatabaseCategory;
};

export default function CategoryCard({ category }: Props) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteCategoryAction(category.id);

            if (!result.success) {
                toast.error(result.formError ?? "Failed to delete category.");
                return;
            }

            setOpen(false);
        });
    }

    return (
        <>
            <div className="flex items-center justify-between rounded-3xl bg-offwhite p-5 shadow-soft">
                <div>
                    <h3 className="font-display text-lg font-semibold text-walnut">
                        {category.name}
                    </h3>

                    <p className="mt-1 text-sm text-walnut-light">
                        {category.slug}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-walnut transition hover:bg-cream-dark"
                    >
                        <Pencil className="h-4 w-4" />
                    </Link>

                    <button
                        onClick={() => setOpen(true)}
                        disabled={isPending}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <ConfirmDialog
                open={open}
                title="Delete Category?"
                description={`Delete "${category.name}"?`}
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={() => setOpen(false)}
                onConfirm={handleDelete}
            />
        </>
    );
}