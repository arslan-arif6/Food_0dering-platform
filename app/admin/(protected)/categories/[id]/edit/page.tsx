import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCategoryById, updateCategory } from "@/lib/database/categories";
import PageHeader from "@/components/admin/PageHeader";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import type { CategoryActionResult } from "@/app/admin/(protected)/categories/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: Props) {
    const { id } = await params;
    const category = await getCategoryById(id);

    if (!category) {
        notFound();
    }

    async function boundUpdateAction(name: string): Promise<CategoryActionResult> {
        "use server";

        const value = name.trim();

        if (!value) {
            return { success: false, fieldError: "Category name is required." };
        }

        try {
            await updateCategory(id, value);

            revalidatePath("/admin/categories");
            revalidatePath("/");
            revalidatePath("/menu");
        } catch (error) {
            console.error(error);
            return { success: false, formError: "Unable to update category." };
        }

        redirect("/admin/categories");
    }

    return (
        <div className="flex flex-col gap-6">
            <Link
                href="/admin/categories"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-walnut-light transition-colors hover:text-walnut"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
            </Link>

            <PageHeader
                title="Edit Category"
                description={`Update the "${category.name}" category.`}
            />

            <CategoryForm action={boundUpdateAction} initialName={category.name} />
        </div>
    );
}