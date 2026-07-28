"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type CartItem = {
    dishId: string;
    variantId: string;
    dishName: string;
    variantName: string;
    unitPrice: number;
    quantity: number;
};

type PlaceOrderInput = {
    customerName: string;
    phone: string;
    address: string;

    paymentMethod:
    | "cash_on_delivery"
    | "jazzcash"
    | "easypaisa";

    subtotal: number;
    deliveryFee: number;
    total: number;

    items: CartItem[];
};

export async function placeOrder(input: PlaceOrderInput) {
    const supabase = await createSupabaseServerClient();

    // --------------------------------------------------
    // Create customer
    // --------------------------------------------------

    const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({
            name: input.customerName,
            phone: input.phone,
            address: input.address,
        })
        .select()
        .single();

    if (customerError) {
        console.error(customerError);
        throw new Error("Unable to create customer.");
    }

    // --------------------------------------------------
    // Create order
    // --------------------------------------------------

    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            customer_id: customer.id,

            customer_name: input.customerName,
            phone: input.phone,
            address: input.address,

            payment_method: input.paymentMethod,

            subtotal: input.subtotal,
            delivery_fee: input.deliveryFee,
            total: input.total,

            status: "new",
        })
        .select()
        .single();

    if (orderError) {
        console.error(orderError);
        throw new Error("Unable to create order.");
    }

    // --------------------------------------------------
    // Create order items
    // --------------------------------------------------

    const orderItems = input.items.map((item) => ({
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
        throw new Error("Unable to create order items.");
    }

    revalidatePath("/admin/orders");

    return {
        success: true,
        orderId: order.id,
    };
}