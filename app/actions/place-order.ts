"use server";

import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
    OrderStatus,
    PaymentMethod,
} from "@/lib/database/orders";

import {
    getRestaurantAvailability,
    canOrderDish,
} from "@/lib/restaurant";

const placeOrderSchema = z.object({
    customerName: z.string().min(2),
    phone: z.string().min(10),
    address: z.string().min(5),

    notes: z.string().optional().default(""),

    paymentMethod: z.enum([
        "cash_on_delivery",
        "jazzcash",
        "easypaisa",
    ]),

    subtotal: z.number().nonnegative(),
    deliveryFee: z.number().nonnegative(),
    total: z.number().nonnegative(),

    items: z
        .array(
            z.object({
                dishId: z.string().nullable(),
                variantId: z.string().nullable(),
                dishName: z.string(),
                variantName: z.string(),
                unitPrice: z.number(),
                quantity: z.number().int().positive(),
            })
        )
        .min(1),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

export async function placeOrder(input: PlaceOrderInput) {
    const data = placeOrderSchema.parse(input);

    const availability = getRestaurantAvailability();

    if (!availability.isOpen) {
        throw new Error(availability.message);
    }

    const supabase = await createSupabaseServerClient();
    for (const item of data.items) {
        if (!item.dishId) continue;

        const { data: dish } = await supabase
            .from("dishes")
            .select(`
            id,
            dish_categories (
                categories (
                    slug
                )
            )
        `)
            .eq("id", item.dishId)
            .single();

        if (!dish) {
            throw new Error(
                `${item.dishName} is not available now. Please order from the current meal menu.`
            );
        }

        const categories = dish.dish_categories.map(
            (entry: any) => entry.categories.slug
        );
        if (!canOrderDish(categories)) {
            throw new Error(
                `${item.dishName} is not available during ${availability.currentMeal ?? "this"} time. Please order available dishes only.`
            );
        }
    }

    const status: OrderStatus = "new";

    const paymentMethod: PaymentMethod = data.paymentMethod;

    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            customer_id: null,
            customer_name: data.customerName,
            phone: data.phone,
            address: data.address,
            notes: data.notes,

            payment_method: paymentMethod,
            status,

            subtotal: data.subtotal,
            delivery_fee: data.deliveryFee,
            total: data.total,
        })
        .select("id")
        .single();

    if (orderError || !order) {
        console.error("========== ORDER ERROR ==========");
        console.error(orderError);
        console.error("===============================");

        throw new Error(
            JSON.stringify(orderError ?? "Unable to create order.")
        );
    }

    const orderItems = data.items.map((item) => ({
        order_id: order.id,

        dish_id: item.dishId,
        dish_variant_id: item.variantId,

        dish_name: item.dishName,
        variant_name: item.variantName,

        unit_price: item.unitPrice,
        quantity: item.quantity,
        line_total: item.unitPrice * item.quantity,
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) {
        console.error(itemsError);

        await supabase
            .from("orders")
            .delete()
            .eq("id", order.id);

        throw new Error("Unable to save order items.");
    }

    return {
        success: true,
        orderId: order.id,
    };
}