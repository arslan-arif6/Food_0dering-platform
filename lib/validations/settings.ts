import { z } from "zod";

export const ACCEPTED_LOGO_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export const MAX_LOGO_SIZE_BYTES = 3 * 1024 * 1024;

function isFileLike(value: unknown): value is File {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as { name?: unknown }).name === "string" &&
        typeof (value as { size?: unknown }).size === "number" &&
        typeof (value as { type?: unknown }).type === "string" &&
        typeof (value as { arrayBuffer?: unknown }).arrayBuffer === "function"
    );
}

// Logo is optional to change — undefined/null means "keep the existing logo".
function checkOptionalLogo(file: unknown, ctx: z.RefinementCtx) {
    if (file === undefined || file === null) return;

    if (!isFileLike(file)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a valid image file",
        });
        return;
    }

    if (file.size > MAX_LOGO_SIZE_BYTES) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Logo must be 3MB or smaller",
        });
        return;
    }

    if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Only JPG, PNG, and WEBP images are allowed",
        });
    }
}

// Same ordered string -> number parsing pattern used for dish variant
// prices in lib/validations/dish.ts.
function requiredNumberField(label: string, min = 0) {
    return z
        .string()
        .transform((val) => val.trim())
        .transform((val, ctx) => {
            if (val.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${label} is required`,
                });
                return z.NEVER;
            }

            const parsed = Number(val);

            if (Number.isNaN(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid number",
                });
                return z.NEVER;
            }

            return parsed;
        })
        .pipe(z.number().min(min, `Must be ${min} or more`));
}

const optionalNumberField = z
    .string()
    .optional()
    .transform((val) => {
        const trimmed = val?.trim() ?? "";
        if (trimmed.length === 0) return null;
        const parsed = Number(trimmed);
        return Number.isNaN(parsed) ? null : parsed;
    });

const timeSchema = z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM format");

export const settingsFormSchema = z.object({
    restaurantName: z.string().trim().min(1, "Restaurant name is required"),
    description: z.string().trim().max(500, "Description is too long").optional(),
    phone: z.string().trim().min(1, "Phone is required"),
    whatsapp: z.string().trim().min(1, "WhatsApp number is required"),
    email: z.string().trim().email("Enter a valid email"),
    address: z.string().trim().min(1, "Address is required"),
    isActive: z.boolean(),
    logo: z.custom<File | undefined>().superRefine(checkOptionalLogo),

    deliveryFee: requiredNumberField("Delivery fee"),
    minimumOrder: requiredNumberField("Minimum order"),
    estimatedDeliveryTime: z
        .string()
        .trim()
        .min(1, "Estimated delivery time is required"),
    freeDeliveryThreshold: optionalNumberField,
    serviceAreas: z.string().trim().optional().default(""),

    paymentCod: z.boolean(),
    paymentJazzcash: z.boolean(),
    paymentEasypaisa: z.boolean(),

    breakfastStart: timeSchema,
    breakfastEnd: timeSchema,
    lunchStart: timeSchema,
    lunchEnd: timeSchema,
    dinnerStart: timeSchema,
    dinnerEnd: timeSchema,
    gracePeriodMinutes: requiredNumberField("Grace period", 0),

    facebookUrl: z.string().trim().optional().default(""),
    instagramUrl: z.string().trim().optional().default(""),
    googleMapsUrl: z.string().trim().optional().default(""),
});

export type SettingsFormInput = z.input<typeof settingsFormSchema>;
export type SettingsFormValues = z.output<typeof settingsFormSchema>;