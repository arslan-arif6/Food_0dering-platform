"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import {
    parseDishFields,
    type DishFormValues,
    type DishFormSubmitValues,
} from "@/lib/validations/dish";
import { createDish } from "@/lib/database/dishes";
import { uploadDishImage, deleteDishImage } from "@/lib/storage/dish-images";

export type CreateDishResult =
    | { success: true }
    | {
        success: false;
        fieldErrors?: Partial<Record<keyof DishFormValues, string>>;
        formError?: string;
    };

// Parameter type widened from DishFormValues to DishFormSubmitValues so
// DishForm's single `action` prop type can serve both Create and Edit.
// Behavior is unchanged: parseDishFields still uses the unmodified,
// image-required dishFieldsSchema, so a missing image still produces
// the same "Please select a dish image" error as before.
export async function createDishAction(
    values: DishFormSubmitValues
): Promise<CreateDishResult> {
    try {
        await requireAdmin();
    } catch {
        return { success: false, formError: "Not authorized." };
    }
    const parsed = parseDishFields(values);

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

    const uploadResult = await uploadDishImage(parsed.data.image);

    if (!uploadResult.success) {
        return { success: false, formError: uploadResult.error };
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { image, ...rest } = parsed.data;
        await createDish({ ...rest, imageUrl: uploadResult.url });
    } catch (error) {
        console.error("createDishAction error:", error);
        await deleteDishImage(uploadResult.path);
        return {
            success: false,
            formError:
                "Something went wrong while saving the dish. Please try again.",
        };
    }

    revalidatePath("/");
    revalidatePath("/menu");
    revalidatePath("/admin/menu");
    redirect("/admin/menu");
}