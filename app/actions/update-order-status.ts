"use server";

import type { OrderStatus } from "@/lib/database/orders";
import { updateOrderStatus } from "@/lib/database/orders";

export async function updateOrderStatusAction(
    orderId: string,
    status: OrderStatus
) {
    await updateOrderStatus(orderId, status);
}