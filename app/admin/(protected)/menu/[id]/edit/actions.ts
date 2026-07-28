"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
    parseEditDishFields,
    type DishFormValues,
    type DishFormSubmitValues,
} from "@/lib/validations/dish";
import { updateDish } from "@/lib/database/dishes";
import {
    uploadDishImage,
    deleteDishImage,
    extractStoragePathFromPublicUrl,
} from "@/lib/storage/dish-images";
import type { CreateDishResult } from "@/app/admin/(protected)/menu/new/actions";

export async function updateDishAction(
    id: string,
    currentImageUrl: string,
    values: DishFormSubmitValues
): Promise<CreateDishResult> {
    const parsed = parseEditDishFields(values);

    if (!parsed.success) {
        const fieldErrors: Partial<Record<keyof DishFormValues, string>> = {};

        for (const issue of parsed.error.issues) {
            const key = issue.path[0] as keyof DishFormValues;
            if (key && !fieldErrors[key]) {
                fieldErrors[key] = issue.message;
            }
        }

        return { success: false, fieldErrors };
    }

    let imageUrl = currentImageUrl;
    let uploadedPath: string | null = null;

    // A new file was selected — upload it. If no file was selected,
    // parsed.data.image is undefined and the existing image URL is kept.
    if (parsed.data.image) {
        const uploadResult = await uploadDishImage(parsed.data.image);

        if (!uploadResult.success) {
            return { success: false, formError: uploadResult.error };
        }

        imageUrl = uploadResult.url;
        uploadedPath = uploadResult.path;
    }

    try {
        await updateDish(id, {
            name: parsed.data.name,
            description: parsed.data.description,
            categoryIds: parsed.data.categoryIds,
            variants: parsed.data.variants,
            available: parsed.data.available,
            featured: parsed.data.featured,
            imageUrl,
        });
    } catch (error) {
        console.error("updateDishAction error:", error);

        // Roll back the newly uploaded replacement image (if any) — the
        // old image is left untouched since the update never succeeded.
        if (uploadedPath) {
            await deleteDishImage(uploadedPath);
        }

        return {
            success: false,
            formError:
                "Something went wrong while updating the dish. Please try again.",
        };
    }

    // Only remove the old image after the database update has
    // succeeded, and only when a new image actually replaced it.
    if (uploadedPath && currentImageUrl) {
        const oldPath = extractStoragePathFromPublicUrl(currentImageUrl);
        if (oldPath) {
            await deleteDishImage(oldPath);
        }
    }

    revalidatePath("/");
    revalidatePath("/menu");
    revalidatePath("/admin/menu");
    redirect("/admin/menu");
}