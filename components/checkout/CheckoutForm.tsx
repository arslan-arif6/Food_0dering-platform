"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRestaurantAvailability } from "@/lib/restaurant";

import {
    checkoutSchema,
    type CheckoutFormData,
} from "@/lib/validations/checkout";

import { placeOrder } from "@/app/actions/place-order";
import { saveRecentOrderId } from "@/lib/utils/order-tracking";

import UnavailableItemsBanner from "./UnavailableItemsBanner";

import {
    User,
    Phone,
    MapPin,
    CreditCard,
    Clock,
    Truck,
    AlertCircle,
} from "lucide-react";

import { toast } from "sonner";
import { useMemo, useState } from "react";

export default function CheckoutForm() {
    const {
        cart,
        totalPrice,
        clearCart,
        removeMultipleItems,
    } = useCart();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            area: "",
            address: "",
            paymentMethod: "COD",
            notes: "",
        },
    });

    const payment = watch("paymentMethod");

    const router = useRouter();

    const [checkoutError, setCheckoutError] = useState("");

    const availability = getRestaurantAvailability();
    console.log("Availability:", availability);

    const unavailableItems = useMemo(() => {
        if (!availability.currentMeal) {
            return [];
        }
        const currentMeal = availability.currentMeal;

        return cart.filter(
            (item) =>
                !item.categories.includes(currentMeal)
        );
    }, [cart, availability.currentMeal]);

    if (!availability.isOpen) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                <h2 className="font-display text-3xl font-semibold text-red-700">
                    Restaurant Closed
                </h2>

                <p className="mt-4 text-red-600">
                    {availability.message}
                </p>
            </div>
        );
    }

    async function onSubmit(data: CheckoutFormData) {
        setCheckoutError("");

        const latestAvailability = getRestaurantAvailability();

        if (!latestAvailability.isOpen) {
            setCheckoutError(latestAvailability.message);
            toast.error(latestAvailability.message);
            return;
        }

        if (unavailableItems.length > 0) {
            toast.error(
                "Remove unavailable dishes before placing your order."
            );
            return;
        }

        const paymentMethod =
            data.paymentMethod === "COD"
                ? "cash_on_delivery"
                : data.paymentMethod === "JazzCash"
                    ? "jazzcash"
                    : "easypaisa";

        try {
            const result = await placeOrder({
                customerName: data.fullName,
                phone: data.phone,

                address: `${data.area}\n${data.address}`,

                notes: data.notes ?? "",

                paymentMethod,

                subtotal: totalPrice,
                deliveryFee: 0,
                total: totalPrice,

                items: cart.map((item) => ({
                    dishId: item.id,
                    variantId: item.variantId,
                    dishName: item.name,
                    variantName: item.variantName,
                    unitPrice: item.price,
                    quantity: item.quantity,
                })),
            });

            saveRecentOrderId(result.orderId);

            clearCart();

            router.push(`/order-success?id=${result.orderId}`);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to place order.";

            setCheckoutError(message);

            toast.error(message);
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
        >
            {unavailableItems.length > 0 && (
                <UnavailableItemsBanner
                    items={unavailableItems}
                    onRemoveItem={(id, variantId) =>
                        removeMultipleItems([{ id, variantId }])
                    }
                    onRemoveAll={() =>
                        removeMultipleItems(
                            unavailableItems.map((item) => ({
                                id: item.id,
                                variantId: item.variantId,
                            }))
                        )
                    }
                />
            )}

            {/* Customer Information */}

            <section className="rounded-3xl bg-white p-8 shadow-soft">
                <h2 className="font-display text-3xl font-semibold text-walnut">
                    Customer Information
                </h2>

                <div className="mt-8 space-y-6">
                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <User className="h-5 w-5 text-sage" />
                            Full Name
                        </label>

                        <input
                            {...register("fullName")}
                            placeholder="Muhammad Ali"
                            className="w-full rounded-xl border p-3 outline-none transition focus:border-sage"
                        />

                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <Phone className="h-5 w-5 text-sage" />
                            Phone Number
                        </label>

                        <input
                            {...register("phone")}
                            placeholder="03XXXXXXXXX"
                            className="w-full rounded-xl border p-3 outline-none transition focus:border-sage"
                        />

                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Delivery Information */}

            <section className="rounded-3xl bg-white p-8 shadow-soft">
                <h2 className="font-display text-3xl font-semibold text-walnut">
                    Delivery Information
                </h2>

                <div className="mt-8 space-y-6">
                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <MapPin className="h-5 w-5 text-sage" />
                            Delivery Area
                        </label>

                        <select
                            {...register("area")}
                            className="w-full rounded-xl border p-3 outline-none focus:border-sage"
                        >
                            <option value="">Select Area</option>
                            <option value="University Chowk">University Chowk</option>
                            <option value="Commercial Area">Commercial Area</option>
                            <option value="Riaz Colony">Riaz Colony</option>
                            <option value="Faisal Colony">Faisal Colony</option>
                            <option value="One Unit">One Unit</option>
                        </select>

                        {errors.area && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.area.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Complete Address
                        </label>

                        <textarea
                            {...register("address")}
                            rows={4}
                            placeholder="House Number, Street, Landmark..."
                            className="w-full rounded-xl border p-3 outline-none focus:border-sage"
                        />

                        {errors.address && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.address.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Payment */}

            <section className="rounded-3xl bg-white p-8 shadow-soft">
                <h2 className="flex items-center gap-2 font-display text-3xl font-semibold text-walnut">
                    <CreditCard className="h-7 w-7 text-sage" />
                    Payment Method
                </h2>

                <div className="mt-6 space-y-3">
                    {["COD", "JazzCash", "EasyPaisa"].map((method) => (
                        <label
                            key={method}
                            className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${payment === method
                                ? "border-sage bg-sage/10"
                                : "border-gray-200"
                                }`}
                        >
                            <input
                                {...register("paymentMethod")}
                                type="radio"
                                value={method}
                            />

                            <span className="font-medium">
                                {method === "COD"
                                    ? "Cash on Delivery"
                                    : method}
                            </span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Additional Notes */}

            <section className="rounded-3xl bg-white p-8 shadow-soft">
                <h2 className="font-display text-2xl font-semibold text-walnut">
                    Additional Notes
                </h2>

                <textarea
                    {...register("notes")}
                    rows={4}
                    placeholder="Less spicy, call before delivery..."
                    className="mt-5 w-full rounded-xl border p-3 outline-none focus:border-sage"
                />
            </section>

            {/* Delivery Information */}

            <section className="rounded-3xl bg-sage p-8 text-offwhite shadow-soft-lg">
                <h2 className="font-display text-2xl font-semibold">
                    Delivery Information
                </h2>

                <div className="mt-6 space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5" />
                        <span>Food preparation: 20–30 minutes</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5" />
                        <span>Delivery: 30–45 minutes</span>
                    </div>

                    <div>✅ Free delivery in all service areas</div>

                    <div>
                        📞 Need help? Call us
                        <br />
                        <strong>+92 303 7847383</strong>
                    </div>
                </div>
            </section>

            {checkoutError && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                        <p className="font-semibold">
                            Unable to place order
                        </p>

                        <p className="text-sm">
                            {checkoutError}
                        </p>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={
                    isSubmitting ||
                    unavailableItems.length > 0
                }
                className="w-full rounded-2xl bg-sage py-4 text-lg font-semibold text-white transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting
                    ? "Placing Order..."
                    : unavailableItems.length > 0
                        ? "Remove Unavailable Items"
                        : "Place Order"}
            </button>
        </form>
    );
}