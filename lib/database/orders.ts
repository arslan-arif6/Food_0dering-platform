import { revalidatePath } from "next/cache";
import { addOrderHistory } from "@/lib/database/order-history";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type OrderStatus =
    | "new"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";

export type PaymentMethod =
    | "cash_on_delivery"
    | "jazzcash"
    | "easypaisa";

export type DatabaseOrderItem = {
    id: string;
    orderId: string;
    dishId: string | null;
    dishVariantId: string | null;
    dishName: string;
    variantName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
};

export type DatabaseOrder = {
    id: string;
    customerId: string;
    customerName: string;
    phone: string;
    address: string;

    notes: string;
    adminNotes: string;

    paymentMethod: PaymentMethod;
    status: OrderStatus;

    subtotal: number;
    deliveryFee: number;
    total: number;

    createdAt: string;
    updatedAt: string;

    items: DatabaseOrderItem[];
};

type OrderRow = Tables<"orders"> & {
    admin_notes: string | null;
    order_items: Tables<"order_items">[];
};

const ORDER_SELECT = `
    *,
    order_items(*)
`;

function mapOrder(row: OrderRow): DatabaseOrder {
    return {
        id: row.id,
        customerId: row.customer_id,
        customerName: row.customer_name,
        phone: row.phone,
        address: row.address,

        notes: row.notes ?? "",
        adminNotes: row.admin_notes ?? "",

        paymentMethod: row.payment_method as PaymentMethod,
        status: row.status as OrderStatus,

        subtotal: Number(row.subtotal),
        deliveryFee: Number(row.delivery_fee),
        total: Number(row.total),

        createdAt: row.created_at,
        updatedAt: row.updated_at,

        items: (row.order_items ?? []).map((item) => ({
            id: item.id,
            orderId: item.order_id,
            dishId: item.dish_id,
            dishVariantId: item.dish_variant_id,
            dishName: item.dish_name,
            variantName: item.variant_name,
            unitPrice: Number(item.unit_price),
            quantity: item.quantity,
            lineTotal: Number(item.line_total),
        })),
    };
}
export type OrderDateFilter =
    | "today"
    | "yesterday"
    | "last7days"
    | "month"
    | "all";
export async function getOrders(
    date: OrderDateFilter = "today"
): Promise<DatabaseOrder[]> {
    const supabase = await createSupabaseServerClient();

    let query = supabase
        .from("orders")
        .select(ORDER_SELECT)
        .order("created_at", { ascending: false });

    const now = new Date();

    if (date === "today") {
        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        query = query.gte("created_at", start.toISOString());
    }

    if (date === "yesterday") {
        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 1
        );

        const end = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        query = query
            .gte("created_at", start.toISOString())
            .lt("created_at", end.toISOString());
    }

    if (date === "last7days") {
        const start = new Date();

        start.setDate(start.getDate() - 7);

        query = query.gte(
            "created_at",
            start.toISOString()
        );
    }

    if (date === "month") {
        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        query = query.gte(
            "created_at",
            start.toISOString()
        );
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw new Error("Unable to load orders.");
    }

    return (data as OrderRow[]).map(mapOrder);
}

export async function getOrderCounts() {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("orders")
        .select("status");

    if (error) {
        console.error(error);
        throw new Error("Unable to load orders.");
    }

    return {
        new: data.filter((o) => o.status === "new").length,
        preparing: data.filter((o) => o.status === "preparing").length,
        ready: data.filter((o) => o.status === "ready").length,
        delivered: data.filter((o) => o.status === "delivered").length,
        cancelled: data.filter((o) => o.status === "cancelled").length,
    };
}

export async function getOrderById(
    id: string
): Promise<DatabaseOrder | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("orders")
        .select(ORDER_SELECT)
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return mapOrder(data as OrderRow);
}

export async function updateOrderStatus(
    id: string,
    status: OrderStatus
): Promise<void> {
    const supabase = await createSupabaseServerClient();

    // Get current status first
    const { data: currentOrder, error: fetchError } = await supabase
        .from("orders")
        .select("status")
        .eq("id", id)
        .single();

    if (fetchError) {
        console.error(fetchError);
        throw new Error("Unable to load order.");
    }

    // Do nothing if status didn't actually change
    if (currentOrder.status === status) {
        return;
    }

    const { error } = await supabase
        .from("orders")
        .update({
            status,
        })
        .eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Unable to update order.");
    }

    await addOrderHistory(id, status);

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
}

export async function updateAdminNotes(
    orderId: string,
    notes: string
): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from("orders")
        .update({
            admin_notes: notes,
        })
        .eq("id", orderId);

    if (error) {
        console.error(error);
        throw new Error("Unable to save admin notes.");
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
}