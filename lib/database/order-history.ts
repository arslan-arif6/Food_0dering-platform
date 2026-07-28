import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OrderHistoryItem = {
    id: string;
    orderId: string;
    status: string;
    createdAt: string;
};

export async function addOrderHistory(
    orderId: string,
    status: string
): Promise<void> {
    const supabase = await createSupabaseServerClient();

    // Check whether this status already exists
    const { data: existing, error: fetchError } = await supabase
        .from("order_status_history")
        .select("id")
        .eq("order_id", orderId)
        .eq("status", status)
        .maybeSingle();

    if (fetchError) {
        console.error(fetchError);
        throw new Error("Unable to check order history.");
    }

    // Don't insert duplicate status
    if (existing) {
        return;
    }

    const { error } = await supabase
        .from("order_status_history")
        .insert({
            order_id: orderId,
            status,
        });

    if (error) {
        console.error(error);
        throw new Error("Unable to create order history.");
    }
}

export async function getOrderHistory(
    orderId: string
): Promise<OrderHistoryItem[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("order_status_history")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", {
            ascending: true,
        });

    if (error) {
        console.error(error);
        throw new Error("Unable to load order history.");
    }

    return (data ?? []).map((item) => ({
        id: item.id,
        orderId: item.order_id,
        status: item.status,
        createdAt: item.created_at,
    }));
}