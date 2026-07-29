import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type RestaurantSettings = Tables<"restaurant_settings">;

export async function getRestaurantSettings(): Promise<RestaurantSettings | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("restaurant_settings")
        .select("*")
        .eq("id", 1)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}

export async function updateRestaurantSettings(
    updates: Partial<Tables<"restaurant_settings">>
): Promise<{ success: true } | { success: false; error: string }> {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from("restaurant_settings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", 1);

    if (error) {
        console.error(error);
        return {
            success: false,
            error: "Failed to save settings. Please try again.",
        };
    }

    return { success: true };
}