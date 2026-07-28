import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCategories } from "@/lib/database/categories";
import { getDishForEdit } from "@/lib/database/dishes";
import PageHeader from "@/components/admin/PageHeader";
import DishForm from "@/components/admin/menu/DishForm";
import { updateDishAction } from "./actions";
import type { DishFormSubmitValues } from "@/lib/validations/dish";
import type { CreateDishResult } from "@/app/admin/(protected)/menu/new/actions";

type EditDishPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditDishPage({ params }: EditDishPageProps) {
    const { id } = await params;

    const [categories, dish] = await Promise.all([
        getCategories(),
        getDishForEdit(id),
    ]);

    if (!dish) {
        notFound();
    }

    // `dish` is narrowed to non-null right above, but that narrowing
    // does not carry into a nested function/closure — TypeScript can't
    // guarantee the captured variable is still non-null by the time the
    // closure runs, so it resets narrowing at the function boundary.
    // Assigning to a fresh const here "locks in" the already-narrowed
    // type at the point of assignment, so `currentDish` stays non-null
    // inside boundUpdateAction below without needing a `!` assertion.
    const currentDish = dish;

    // Inline Server Action: binds the dish id and its current image URL
    // (needed for the "delete old image on replace" logic) so DishForm's
    // single-argument `action` prop signature can stay identical between
    // Create and Edit.
    async function boundUpdateAction(
        values: DishFormSubmitValues
    ): Promise<CreateDishResult> {
        "use server";
        return updateDishAction(id, currentDish.image, values);
    }

    return (
        <div className="flex flex-col gap-6">
            <Link
                href="/admin/menu"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-walnut-light transition-colors hover:text-walnut"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Menu
            </Link>

            <PageHeader
                title="Edit Dish"
                description={`Update details for "${currentDish.name}".`}
            />

            <DishForm
                categories={categories}
                action={boundUpdateAction}
                initialValues={{
                    name: currentDish.name,
                    description: currentDish.description,
                    categoryIds: currentDish.categoryIds,
                    variants: currentDish.variants.map((variant) => ({
                        name: variant.name,
                        price: String(variant.price),
                    })),
                    available: currentDish.available,
                    featured: currentDish.featured,
                }}
                existingImageUrl={currentDish.image || undefined}
            />
        </div>
    );
}