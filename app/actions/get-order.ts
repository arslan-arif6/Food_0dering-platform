"use server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function getOrder(id: string, phone: string) {
    if (!id || typeof id !== "string" || !phone || typeof phone !== "string") {
        return null;
    }

    const normalizedPhone = phone.replace(/\D/g, "");

    if (normalizedPhone.length < 10) {
        return null;
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
        .from("orders")
        .select(`
            id,
            customer_name,
            phone,
            address,
            payment_method,
            status,
            total,
            order_items (
                id,
                dish_name,
                variant_name,
                quantity,
                line_total
            )
        `)
        .eq("id", id)
        .single();

    if (error || !data) {
        console.error(error);
        return null;
    }

    const storedPhone = String(data.phone ?? "").replace(/\D/g, "");

    if (!storedPhone || storedPhone !== normalizedPhone) {
        return null;
    }

    return data;
}