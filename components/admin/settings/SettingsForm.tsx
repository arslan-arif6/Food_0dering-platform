"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import TextField from "@/components/admin/fields/TextField";
import TextAreaField from "@/components/admin/fields/TextAreaField";
import SwitchField from "@/components/admin/fields/SwitchField";
import FormSection from "@/components/admin/FormSection";
import LogoDropzone from "@/components/admin/settings/LogoDropzone";
import { updateSettingsAction } from "@/app/admin/(protected)/settings/actions";
import { supabase } from "@/lib/supabase/client";
import {
    settingsFormSchema,
    type SettingsFormInput,
    type SettingsFormValues,
} from "@/lib/validations/settings";
import type { RestaurantSettings } from "@/lib/database/settings";

type Props = {
    settings: RestaurantSettings;
    adminEmail: string;
};

const TABS = [
    { id: "restaurant", label: "🏪 Restaurant" },
    { id: "delivery", label: "🚚 Delivery" },
    { id: "payments", label: "💳 Payments" },
    { id: "hours", label: "🕒 Business Hours" },
    { id: "social", label: "🌐 Social" },
    { id: "account", label: "🔐 Account" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function buildDefaults(settings: RestaurantSettings): SettingsFormInput {
    return {
        restaurantName: settings.restaurant_name,
        description: settings.description,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        address: settings.address,
        isActive: settings.is_active,
        logo: undefined,

        deliveryFee: String(settings.delivery_fee),
        minimumOrder: String(settings.minimum_order),
        estimatedDeliveryTime: settings.estimated_delivery_time,
        freeDeliveryThreshold:
            settings.free_delivery_threshold !== null
                ? String(settings.free_delivery_threshold)
                : "",
        serviceAreas: settings.service_areas.join(", "),

        paymentCod: settings.payment_cod,
        paymentJazzcash: settings.payment_jazzcash,
        paymentEasypaisa: settings.payment_easypaisa,

        breakfastStart: settings.breakfast_start,
        breakfastEnd: settings.breakfast_end,
        lunchStart: settings.lunch_start,
        lunchEnd: settings.lunch_end,
        dinnerStart: settings.dinner_start,
        dinnerEnd: settings.dinner_end,
        gracePeriodMinutes: String(settings.grace_period_minutes),

        facebookUrl: settings.facebook_url ?? "",
        instagramUrl: settings.instagram_url ?? "",
        googleMapsUrl: settings.google_maps_url ?? "",
    };
}

export default function SettingsForm({ settings, adminEmail }: Props) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>("restaurant");
    const [submitting, setSubmitting] = useState(false);
    const [resettingPassword, setResettingPassword] = useState(false);

    // Same zod-v4 resolver typing workaround already used in DishForm.
    const resolver = zodResolver(settingsFormSchema) as unknown as Resolver<
        SettingsFormInput,
        unknown,
        SettingsFormValues
    >;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty },
    } = useForm<SettingsFormInput, unknown, SettingsFormValues>({
        resolver,
        defaultValues: buildDefaults(settings),
    });

    const logoValue = watch("logo");
    const isActive = watch("isActive");
    const paymentCod = watch("paymentCod");
    const paymentJazzcash = watch("paymentJazzcash");
    const paymentEasypaisa = watch("paymentEasypaisa");

    async function onSubmit(values: SettingsFormValues) {
        setSubmitting(true);

        const formData = new FormData();
        Object.entries(values).forEach(([key, val]) => {
            if (key === "logo") {
                if (val instanceof File) formData.set("logo", val);
                return;
            }
            if (val === null || val === undefined) return;
            formData.set(key, String(val));
        });

        const result = await updateSettingsAction(formData, settings.logo_url);
        setSubmitting(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success("Settings saved");
        reset(values as unknown as SettingsFormInput);
        router.refresh();
    }

    async function handlePasswordReset() {
        setResettingPassword(true);
        const { error } = await supabase.auth.resetPasswordForEmail(adminEmail);
        setResettingPassword(false);

        if (error) {
            toast.error("Couldn't send reset email. Please try again.");
            return;
        }

        toast.success("Password reset email sent");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 pb-24">
            <div className="flex flex-wrap gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id
                            ? "bg-sage text-offwhite"
                            : "bg-offwhite text-walnut hover:bg-cream"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="rounded-3xl bg-offwhite p-6 shadow-soft sm:p-8">
                <div className={activeTab === "restaurant" ? "flex flex-col gap-6" : "hidden"}>
                    <FormSection title="Restaurant Info">
                        <TextField
                            id="restaurantName"
                            label="Restaurant Name"
                            error={errors.restaurantName?.message}
                            {...register("restaurantName")}
                        />
                        <TextAreaField
                            id="description"
                            label="Description"
                            rows={3}
                            error={errors.description?.message}
                            {...register("description")}
                        />
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextField
                                id="phone"
                                label="Phone"
                                error={errors.phone?.message}
                                {...register("phone")}
                            />
                            <TextField
                                id="whatsapp"
                                label="WhatsApp Number"
                                error={errors.whatsapp?.message}
                                {...register("whatsapp")}
                            />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextField
                                id="email"
                                label="Email"
                                type="email"
                                error={errors.email?.message}
                                {...register("email")}
                            />
                            <TextField
                                id="address"
                                label="Address"
                                error={errors.address?.message}
                                {...register("address")}
                            />
                        </div>
                    </FormSection>

                    <FormSection title="Logo">
                        <LogoDropzone
                            value={logoValue as File | undefined}
                            onChange={(file) => setValue("logo", file, { shouldDirty: true })}
                            error={errors.logo?.message}
                            disabled={submitting}
                            existingLogoUrl={settings.logo_url}
                        />
                    </FormSection>

                    <FormSection
                        title="Restaurant Status"
                        description="Turn this off for holidays, Eid, or maintenance — orders will stop being accepted (once wired up in the integration step)."
                    >
                        <SwitchField
                            id="isActive"
                            label={isActive ? "🟢 Open for Orders" : "🔴 Closed Today"}
                            checked={isActive}
                            onChange={(checked) => setValue("isActive", checked, { shouldDirty: true })}
                        />
                    </FormSection>
                </div>

                <div className={activeTab === "delivery" ? "flex flex-col gap-6" : "hidden"}>
                    <FormSection title="Delivery">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextField
                                id="deliveryFee"
                                label="Delivery Fee (Rs.)"
                                type="number"
                                error={errors.deliveryFee?.message}
                                {...register("deliveryFee")}
                            />
                            <TextField
                                id="minimumOrder"
                                label="Minimum Order (Rs.)"
                                type="number"
                                error={errors.minimumOrder?.message}
                                {...register("minimumOrder")}
                            />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextField
                                id="estimatedDeliveryTime"
                                label="Estimated Delivery Time"
                                placeholder="e.g. 30-45 mins"
                                error={errors.estimatedDeliveryTime?.message}
                                {...register("estimatedDeliveryTime")}
                            />
                            <TextField
                                id="freeDeliveryThreshold"
                                label="Free Delivery Above (Rs.) — optional"
                                type="number"
                                error={errors.freeDeliveryThreshold?.message}
                                {...register("freeDeliveryThreshold")}
                            />
                        </div>
                        <TextAreaField
                            id="serviceAreas"
                            label="Service Areas (comma-separated)"
                            rows={2}
                            placeholder="Model Town, Satellite Town, Cantt"
                            error={errors.serviceAreas?.message}
                            {...register("serviceAreas")}
                        />
                    </FormSection>
                </div>

                <div className={activeTab === "payments" ? "flex flex-col gap-4" : "hidden"}>
                    <FormSection title="Payment Methods">
                        <SwitchField
                            id="paymentCod"
                            label="Cash on Delivery"
                            checked={paymentCod}
                            onChange={(checked) => setValue("paymentCod", checked, { shouldDirty: true })}
                        />
                        <SwitchField
                            id="paymentJazzcash"
                            label="JazzCash"
                            checked={paymentJazzcash}
                            onChange={(checked) => setValue("paymentJazzcash", checked, { shouldDirty: true })}
                        />
                        <SwitchField
                            id="paymentEasypaisa"
                            label="Easypaisa"
                            checked={paymentEasypaisa}
                            onChange={(checked) => setValue("paymentEasypaisa", checked, { shouldDirty: true })}
                        />
                    </FormSection>
                </div>

                <div className={activeTab === "hours" ? "flex flex-col gap-6" : "hidden"}>
                    <FormSection
                        title="Business Hours"
                        description="Not wired to live ordering yet — that's a separate integration step."
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextField id="breakfastStart" label="Breakfast Start" type="time" error={errors.breakfastStart?.message} {...register("breakfastStart")} />
                            <TextField id="breakfastEnd" label="Breakfast End" type="time" error={errors.breakfastEnd?.message} {...register("breakfastEnd")} />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextField id="lunchStart" label="Lunch Start" type="time" error={errors.lunchStart?.message} {...register("lunchStart")} />
                            <TextField id="lunchEnd" label="Lunch End" type="time" error={errors.lunchEnd?.message} {...register("lunchEnd")} />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextField id="dinnerStart" label="Dinner Start" type="time" error={errors.dinnerStart?.message} {...register("dinnerStart")} />
                            <TextField id="dinnerEnd" label="Dinner End" type="time" error={errors.dinnerEnd?.message} {...register("dinnerEnd")} />
                        </div>
                        <TextField
                            id="gracePeriodMinutes"
                            label="Grace Period (minutes)"
                            type="number"
                            error={errors.gracePeriodMinutes?.message}
                            {...register("gracePeriodMinutes")}
                        />
                    </FormSection>
                </div>

                <div className={activeTab === "social" ? "flex flex-col gap-6" : "hidden"}>
                    <FormSection title="Social Links">
                        <TextField id="facebookUrl" label="Facebook" placeholder="https://facebook.com/..." error={errors.facebookUrl?.message} {...register("facebookUrl")} />
                        <TextField id="instagramUrl" label="Instagram" placeholder="https://instagram.com/..." error={errors.instagramUrl?.message} {...register("instagramUrl")} />
                        <TextField id="googleMapsUrl" label="Google Maps Link" placeholder="https://maps.app.goo.gl/..." error={errors.googleMapsUrl?.message} {...register("googleMapsUrl")} />
                    </FormSection>
                </div>

                <div className={activeTab === "account" ? "flex flex-col gap-6" : "hidden"}>
                    <FormSection title="Account">
                        <TextField id="adminEmail" label="Admin Email" value={adminEmail} disabled readOnly />
                        <button
                            type="button"
                            onClick={handlePasswordReset}
                            disabled={resettingPassword}
                            className="flex w-fit items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-walnut transition hover:opacity-80 disabled:opacity-60"
                        >
                            {resettingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                            Send Password Reset Email
                        </button>
                    </FormSection>
                </div>
            </div>

            {isDirty && (
                <div className="fixed inset-x-0 bottom-0 z-20 border-t border-walnut/10 bg-offwhite/95 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-5xl items-center justify-end gap-3 px-5 py-4 sm:px-8">
                        <button
                            type="button"
                            onClick={() => reset(buildDefaults(settings))}
                            disabled={submitting}
                            className="rounded-full px-6 py-3 font-semibold text-walnut transition hover:bg-cream disabled:opacity-60"
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 rounded-full bg-sage px-6 py-3 font-semibold text-offwhite transition hover:bg-sage-dark disabled:opacity-60"
                        >
                            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}