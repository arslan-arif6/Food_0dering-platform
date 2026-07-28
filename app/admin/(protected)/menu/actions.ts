"use server";

import { revalidatePath } from "next/cache";

import { deleteDish } from "@/lib/database/dishes";
import {
    deleteDishImage,
    extractStoragePathFromPublicUrl,
} from "@/lib/storage/dish-images";

export async function deleteDishAction(
    dishId: string,
    imageUrl: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteDish(dishId);

        if (imageUrl) {
            const path = extractStoragePathFromPublicUrl(imageUrl);

            if (path) {
                await deleteDishImage(path);
            }
        }

        revalidatePath("/");
        revalidatePath("/menu");
        revalidatePath("/admin/menu");

        return { success: true };
    } catch (error) {
        console.error("deleteDishAction:", error);

        return {
            success: false,
            error: "Failed to delete dish.",
        };
    }
}