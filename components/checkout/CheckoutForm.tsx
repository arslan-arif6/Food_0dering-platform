"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRestaurantAvailability, settingsToScheduleConfig } from "@/lib/restaurant";
import type { RestaurantSettings } from "@/lib/database/settings";

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

type CheckoutFormProps = {
    settings: RestaurantSettings | null;
};

export default function CheckoutForm({ settings }: CheckoutFormProps) {
    const {
        cart,
        totalPrice,
        clearCart,
        removeMultipleItems,
    } = useCart();

    const scheduleConfig = settingsToScheduleConfig(settings);

    const paymentOptions = [
        { value: "COD" as const, label: "Cash on Delivery", enabled: settings?.payment_cod ?? true },
        { value: "JazzCash" as const, label: "JazzCash", enabled: settings?.payment_jazzcash ?? false },
        { value: "EasyPaisa" as const, label: "Easypaisa", enabled: settings?.payment_easypaisa ?? false },
    ].filter((option) => option.enabled);

    const defaultPaymentMethod = paymentOptions[0]?.value ?? "COD";
    const serviceAreas = settings?.service_areas ?? [];

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
            paymentMethod: defaultPaymentMethod,
            notes: "",
        },
    });

    const payment = watch("paymentMethod");

    const router = useRouter();

    const [checkoutError, setCheckoutError] = useState("");

    const availability = getRestaurantAvailability(new Date(), scheduleConfig);

    const minimumOrder = settings?.minimum_order ?? 0;
    const belowMinimum = minimumOrder > 0 && totalPrice < minimumOrder;

    const deliveryFee =
        settings?.free_delivery_threshold != null &&
            totalPrice >= settings.free_delivery_threshold
            ? 0
            : settings?.delivery_fee ?? 0;

    const unavailableItems = useMemo(() => {
        if (!availability.currentMeal) {
            return [];
        }
        const currentMeal = availability.currentMeal;

        return cart.filter((item) => !item.categories.includes(currentMeal));
    }, [cart, availability.currentMeal]);

    if (!availability.isOpen) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                <h2 className="font-display text-3xl font-semibold text-red-700">
                    Restaurant Closed
                </h2>

                <p className="mt-4 text-red-600">{availability.message}</p>
            </div>
        );
    }

    async function onSubmit(data: CheckoutFormData) {
        setCheckoutError("");

        const latestAvailability = getRestaurantAvailability(new Date(), scheduleConfig);

        if (!latestAvailability.isOpen) {
            setCheckoutError(latestAvailability.message);
            toast.error(latestAvailability.message);
            return;
        }

        if (unavailableItems.length > 0) {
            toast.error("Remove unavailable dishes before placing your order.");
            return;
        }

        if (belowMinimum) {
            toast.error(`Minimum order is Rs. ${minimumOrder}.`);
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
                deliveryFee,
                total: totalPrice + deliveryFee,

                items: cart.map((item) => ({
                    dishId: item.id,
                    variantId: item.variantId,
                    dishName: item.name,
                    variantName: item.variantName,
                    unitPrice: item.price,
                    quantity: item.quantity,
                })),
            });

            saveRecentOrderId(result.orderId, data.phone);

            clearCart();

            router.push(`/order-success?id=${result.orderId}`);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unable to place order.";

            setCheckoutError(message);
            toast.error(message);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-8">
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

            <section className="rounded-3xl bg-white p-5 shadow-soft sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-walnut sm:text-3xl">
                    Customer Information
                </h2>

                <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <User className="h-5 w-5 text-sage" />
                            Full Name
                        </label>

                        <input
                            {...register("fullName")}
                            placeholder="Muhammad Ali"
                            className="min-h-12 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-sage"
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
                            className="min-h-12 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-sage"
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

            <section className="rounded-3xl bg-white p-5 shadow-soft sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-walnut sm:text-3xl">
                    Delivery Information
                </h2>

                <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
                    <div>
                        <label className="mb-2 flex items-center gap-2 font-medium">
                            <MapPin className="h-5 w-5 text-sage" />
                            Delivery Area
                        </label>

                        <select
                            {...register("area")}
                            className="min-h-12 w-full rounded-xl border px-4 py-3 outline-none focus:border-sage"
                        >
                            <option value="">Select Area</option>
                            {serviceAreas.length === 0 ? (
                                <option value="" disabled>
                                    No delivery areas configured
                                </option>
                            ) : (
                                serviceAreas.map((area) => (
                                    <option key={area} value={area}>
                                        {area}
                                    </option>
                                ))
                            )}
                        </select>

                        {errors.area && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.area.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Complete Address</label>

                        <textarea
                            {...register("address")}
                            rows={4}
                            placeholder="House Number, Street, Landmark..."
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-sage"
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

            <section className="rounded-3xl bg-white p-5 shadow-soft sm:p-8">
                <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-walnut sm:text-3xl">
                    <CreditCard className="h-7 w-7 text-sage" />
                    Payment Method
                </h2>

                <div className="mt-6 space-y-3">
                    {paymentOptions.map((option) => (
                        <label
                            key={option.value}
                            className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${payment === option.value
                                ? "border-sage bg-sage/10"
                                : "border-gray-200"
                                }`}
                        >
                            <input
                                {...register("paymentMethod")}
                                type="radio"
                                value={option.value}
                            />

                            <span className="font-medium">{option.label}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Additional Notes */}

            <section className="rounded-3xl bg-white p-5 shadow-soft sm:p-8">
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

            <section className="rounded-3xl bg-sage p-5 text-offwhite shadow-soft-lg sm:p-8">
                <h2 className="font-display text-2xl font-semibold">
                    Delivery Information
                </h2>

                <div className="mt-5 space-y-4 text-sm sm:mt-6">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5" />
                        <span>Estimated delivery: {settings?.estimated_delivery_time ?? "30-45 mins"}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5" />
                        <span>
                            {deliveryFee === 0
                                ? "Free delivery on this order"
                                : `Delivery fee: Rs. ${deliveryFee}`}
                        </span>
                    </div>

                    {settings?.phone && (
                        <div>
                            📞 Need help? Call us
                            <br />
                            <strong>{settings.phone}</strong>
                        </div>
                    )}
                </div>
            </section>

            {belowMinimum && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm">
                        Minimum order is Rs. {minimumOrder}. Add more items to continue.
                    </p>
                </div>
            )}

            {checkoutError && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                        <p className="font-semibold">Unable to place order</p>

                        <p className="text-sm">{checkoutError}</p>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting || unavailableItems.length > 0 || belowMinimum}
                className="min-h-14 w-full rounded-2xl bg-sage py-4 text-base font-semibold text-white transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
            >
                {isSubmitting
                    ? "Placing Order..."
                    : unavailableItems.length > 0
                        ? "Remove Unavailable Items"
                        : belowMinimum
                            ? "Below Minimum Order"
                            : "Place Order"}
            </button>
        </form>
    );
}