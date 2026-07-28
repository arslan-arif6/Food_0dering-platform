import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCategories } from "@/lib/database/categories";
import PageHeader from "@/components/admin/PageHeader";
import DishForm from "@/components/admin/menu/DishForm";
import { createDishAction } from "./actions";

export default async function AddDishPage() {
    const categories = await getCategories();

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
                title="Add Dish"
                description="Create a new dish for your menu."
            />

            <DishForm categories={categories} action={createDishAction} />
        </div>
    );
}