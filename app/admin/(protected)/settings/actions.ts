"use server";

import { revalidatePath } from "next/cache";

import { settingsFormSchema } from "@/lib/validations/settings";
import { updateRestaurantSettings } from "@/lib/database/settings";
import {
    uploadRestaurantLogo,
    deleteRestaurantLogo,
    extractStoragePathFromPublicUrl,
} from "@/lib/storage/restaurant-assets";

export type UpdateSettingsResult =
    | { success: true }
    | { success: false; error: string; fieldErrors?: Record<string, string> };

// Called directly from SettingsForm (a client component) — not bound
// to a <form action>, so it takes whatever arguments the caller needs.
export async function updateSettingsAction(
    formData: FormData,
    currentLogoUrl: string | null
): Promise<UpdateSettingsResult> {
    const raw = Object.fromEntries(formData.entries());
    const logoValue = formData.get("logo");

    const parsed = settingsFormSchema.safeParse({
        ...raw,
        isActive: raw.isActive === "true",
        paymentCod: raw.paymentCod === "true",
        paymentJazzcash: raw.paymentJazzcash === "true",
        paymentEasypaisa: raw.paymentEasypaisa === "true",
        logo:
            logoValue instanceof File && logoValue.size > 0
                ? logoValue
                : undefined,
    });

    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            const key = String(issue.path[0]);
            if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        return { success: false, error: "Please fix the errors below.", fieldErrors };
    }

    const values = parsed.data;
    let logoUrl: string | undefined;

    if (values.logo) {
        const uploadResult = await uploadRestaurantLogo(values.logo);

        if (!uploadResult.success) {
            return { success: false, error: uploadResult.error };
        }

        logoUrl = uploadResult.url;

        if (currentLogoUrl) {
            const oldPath = extractStoragePathFromPublicUrl(currentLogoUrl);
            if (oldPath) await deleteRestaurantLogo(oldPath);
        }
    }

    const serviceAreas = values.serviceAreas
        .split(",")
        .map((area) => area.trim())
        .filter((area) => area.length > 0);

    const result = await updateRestaurantSettings({
        restaurant_name: values.restaurantName,
        description: values.description ?? "",
        phone: values.phone,
        whatsapp: values.whatsapp,
        email: values.email,
        address: values.address,
        is_active: values.isActive,
        ...(logoUrl ? { logo_url: logoUrl } : {}),

        delivery_fee: values.deliveryFee,
        minimum_order: values.minimumOrder,
        estimated_delivery_time: values.estimatedDeliveryTime,
        free_delivery_threshold: values.freeDeliveryThreshold,
        service_areas: serviceAreas,

        payment_cod: values.paymentCod,
        payment_jazzcash: values.paymentJazzcash,
        payment_easypaisa: values.paymentEasypaisa,

        breakfast_start: values.breakfastStart,
        breakfast_end: values.breakfastEnd,
        lunch_start: values.lunchStart,
        lunch_end: values.lunchEnd,
        dinner_start: values.dinnerStart,
        dinner_end: values.dinnerEnd,
        grace_period_minutes: values.gracePeriodMinutes,

        facebook_url: values.facebookUrl || null,
        instagram_url: values.instagramUrl || null,
        google_maps_url: values.googleMapsUrl || null,
    });

    if (!result.success) {
        return { success: false, error: result.error };
    }

    revalidatePath("/admin/settings");
    return { success: true };
}