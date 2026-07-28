import Link from "next/link";
import { Plus } from "lucide-react";

import { getAdminDishes } from "@/lib/database/dishes";
import { getCategories } from "@/lib/database/categories";
import MenuToolbar from "@/components/admin/menu/MenuToolbar";
import DishManagementCard from "@/components/admin/menu/DishManagementCard";

export default async function AdminMenuPage() {
    const [dishes, categories] = await Promise.all([
        getAdminDishes(),
        getCategories(),
    ]);

    const categoryLookup = Object.fromEntries(
        categories.map((category) => [category.slug, category.name])
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="font-display text-2xl font-semibold text-walnut">
                        Menu Management
                    </h2>
                    <p className="mt-1 text-[15px] text-walnut-light">
                        Add, edit, and organize the dishes shown on your public menu.
                    </p>
                </div>

                <Link
                    href="/admin/menu/new"
                    className="flex items-center gap-2 self-start rounded-full bg-sage px-5 py-3 font-semibold text-offwhite transition hover:bg-sage-dark"
                >
                    <Plus className="h-4 w-4" />
                    Add Dish
                </Link>
            </div>

            <MenuToolbar categories={categories} />

            {dishes.length === 0 ? (
                <div className="rounded-3xl bg-offwhite p-14 text-center text-walnut-light shadow-soft">
                    No dishes found.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {dishes.map((dish) => (
                        <DishManagementCard
                            key={dish.id}
                            dish={dish}
                            categoryLookup={categoryLookup}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}