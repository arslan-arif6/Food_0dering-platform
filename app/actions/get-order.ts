"use server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function getOrder(id: string) {
    if (!id || typeof id !== "string") {
        return null;
    }

    const supabase = createServiceRoleClient();

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