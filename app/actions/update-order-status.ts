"use server";

import type { OrderStatus } from "@/lib/database/orders";
import { updateOrderStatus } from "@/lib/database/orders";
import { requireAdmin } from "@/lib/supabase/admin-auth";

export async function updateOrderStatusAction(
    orderId: string,
    status: OrderStatus
) {
    await requireAdmin();
    await updateOrderStatus(orderId, status);
}