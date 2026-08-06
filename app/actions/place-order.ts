"use server";

import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/lib/database/orders";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
    getRestaurantAvailability,
    canOrderDish,
    settingsToScheduleConfig,
} from "@/lib/restaurant";

import { getRestaurantSettings } from "@/lib/database/settings";

const placeOrderSchema = z.object({
    customerName: z.string().min(2),
    phone: z.string().min(10),
    address: z.string().min(5),

    notes: z.string().optional().default(""),

    paymentMethod: z.enum(["cash_on_delivery", "jazzcash", "easypaisa"]),

    // These client-supplied totals are no longer trusted for the actual
    // insert — the server recalculates everything below from real
    // dish_variants prices and the real settings row. Kept in the schema
    // only so the shape still matches what the client already sends.
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

const PAYMENT_METHOD_FLAG: Record<
    PaymentMethod,
    "payment_cod" | "payment_jazzcash" | "payment_easypaisa"
> = {
    cash_on_delivery: "payment_cod",
    jazzcash: "payment_jazzcash",
    easypaisa: "payment_easypaisa",
};

export async function placeOrder(input: PlaceOrderInput) {
    const data = placeOrderSchema.parse(input);

    const settings = await getRestaurantSettings();
    const scheduleConfig = settingsToScheduleConfig(settings);
    const availability = getRestaurantAvailability(new Date(), scheduleConfig);

    if (!availability.isOpen) {
        throw new Error(availability.message);
    }

    if (settings) {
        const flag = PAYMENT_METHOD_FLAG[data.paymentMethod];
        if (!settings[flag]) {
            throw new Error(
                "This payment method is currently unavailable. Please choose another."
            );
        }
    }

    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    console.log("=== ORDER AUTH DEBUG ===");
    console.log("User ID:", user?.id ?? null);
    console.log("User email:", user?.email ?? null);
    console.log("Auth error:", authError);
    console.log("========================");

    // Re-derive every item's real price and validate availability —
    // never trust unitPrice/subtotal/total from the client.
    const verifiedItems: {
        dishId: string;
        variantId: string | null;
        dishName: string;
        variantName: string;
        unitPrice: number;
        quantity: number;
        lineTotal: number;
    }[] = [];

    for (const item of data.items) {
        if (!item.dishId) {
            throw new Error(
                "Invalid cart item. Please refresh the menu and try again."
            );
        }

        const { data: dish } = await supabase
            .from("dishes")
            .select(`
                id,
                name,
                sold_out,
                dish_categories (
                    categories (
                        slug
                    )
                ),
                dish_variants (
                    id,
                    name,
                    price
                )
            `)
            .eq("id", item.dishId)
            .single();

        if (!dish) {
            throw new Error(
                `${item.dishName} is not available now. Please order from the current menu.`
            );
        }

        if (dish.sold_out) {
            throw new Error(
                `${item.dishName} is sold out right now. Please remove it from your cart.`
            );
        }

        const categories = dish.dish_categories.map(
            (entry: any) => entry.categories.slug
        );

        if (!canOrderDish(categories, scheduleConfig)) {
            throw new Error(
                `${item.dishName} is not available during ${availability.currentMeal ?? "this"} time. Please order available dishes only.`
            );
        }

        const variant = item.variantId
            ? dish.dish_variants.find((v: any) => v.id === item.variantId)
            : dish.dish_variants[0];

        if (!variant) {
            throw new Error(
                `${item.dishName} — selected portion is no longer available. Please update your cart.`
            );
        }

        const realPrice = Number(variant.price);

        verifiedItems.push({
            dishId: dish.id,
            variantId: variant.id,
            dishName: dish.name,
            variantName: variant.name,
            unitPrice: realPrice,
            quantity: item.quantity,
            lineTotal: realPrice * item.quantity,
        });
    }

    const subtotal = verifiedItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const deliveryFee =
        settings?.free_delivery_threshold != null &&
            subtotal >= settings.free_delivery_threshold
            ? 0
            : settings?.delivery_fee ?? 0;

    const total = subtotal + deliveryFee;

    const paymentMethod: PaymentMethod = data.paymentMethod;

    // IMPORTANT:
    // Use service-role client ONLY on the server to call the protected
    // atomic RPC. Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
    const serviceSupabase = createServiceRoleClient();

    const orderItems = verifiedItems.map((item) => ({
        dish_id: item.dishId,
        dish_variant_id: item.variantId,
        dish_name: item.dishName,
        variant_name: item.variantName,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        line_total: item.lineTotal,
    }));

    const { data: orderId, error: orderError } =
        await serviceSupabase.rpc("place_order_atomic", {
            p_customer_name: data.customerName,
            p_phone: data.phone,
            p_address: data.address,
            p_notes: data.notes,
            p_payment_method: paymentMethod,
            p_subtotal: subtotal,
            p_delivery_fee: deliveryFee,
            p_total: total,
            p_items: orderItems,
        });

    if (orderError || !orderId) {
        console.error("========== ORDER ERROR ==========");
        console.error(orderError);
        console.error("===============================");

        throw new Error("Unable to create order. Please try again.");
    }

    return {
        success: true,
        orderId,
    };
}