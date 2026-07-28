import Link from "next/link";
import { Plus } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import CategoryCard from "@/components/admin/categories/CategoryCard";
import { getCategories } from "@/lib/database/categories";

export default async function AdminCategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Categories"
                description="Manage the categories shown on your menu."
                actions={
                    <Link
                        href="/admin/categories/new"
                        className="flex items-center gap-2 rounded-full bg-sage px-5 py-3 font-semibold text-offwhite transition hover:bg-sage-dark"
                    >
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Link>
                }
            />

            {categories.length === 0 ? (
                <div className="rounded-3xl bg-offwhite p-14 text-center text-walnut-light shadow-soft">
                    No categories found.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}