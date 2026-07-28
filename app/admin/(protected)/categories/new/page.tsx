import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { createCategoryAction } from "../actions";

export default function NewCategoryPage() {
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
                title="Add Category"
                description="Create a new menu category."
            />

            <CategoryForm action={createCategoryAction} />
        </div>
    );
}