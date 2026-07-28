"use server";

import { revalidatePath } from "next/cache";

import {
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/lib/database/categories";

export type CategoryActionResult =
    | { success: true }
    | {
        success: false;
        fieldError?: string;
        formError?: string;
    };

export async function createCategoryAction(
    name: string
): Promise<CategoryActionResult> {
    const value = name.trim();

    if (!value) {
        return {
            success: false,
            fieldError: "Category name is required.",
        };
    }

    try {
        await createCategory(value);

        revalidatePath("/admin/categories");
        revalidatePath("/");
        revalidatePath("/menu");

        return { success: true };
    } catch (error) {
        console.error("Create Category Error:", error);

        return {
            success: false,
            formError:
                error instanceof Error ? error.message : "Unable to create category.",
        };
    }
}

export async function updateCategoryAction(
    id: string,
    name: string
): Promise<CategoryActionResult> {
    const value = name.trim();

    if (!value) {
        return {
            success: false,
            fieldError: "Category name is required.",
        };
    }

    try {
        await updateCategory(id, value);

        revalidatePath("/admin/categories");
        revalidatePath("/");
        revalidatePath("/menu");

        return { success: true };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            formError: "Unable to update category.",
        };
    }
}

export async function deleteCategoryAction(
    id: string
): Promise<CategoryActionResult> {
    try {
        await deleteCategory(id);

        revalidatePath("/admin/categories");
        revalidatePath("/");
        revalidatePath("/menu");

        return { success: true };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            formError:
                error instanceof Error
                    ? error.message
                    : "Unable to delete category.",
        };
    }
}