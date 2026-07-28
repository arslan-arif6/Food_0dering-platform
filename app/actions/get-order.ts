"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getOrder(id: string) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                *
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}