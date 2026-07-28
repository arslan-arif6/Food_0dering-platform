import { z } from "zod";

export const checkoutSchema = z.object({
    fullName: z
        .string()
        .min(3, "Please enter your full name."),

    phone: z
        .string()
        .regex(
            /^03[0-9]{9}$/,
            "Please enter a valid Pakistani phone number."
        ),

    area: z
        .string()
        .min(1, "Please select your delivery area."),

    address: z
        .string()
        .min(10, "Please enter your complete address."),

    paymentMethod: z.enum([
        "COD",
        "JazzCash",
        "EasyPaisa",
    ]),

    notes: z.string().optional(),
});

export type CheckoutFormData =
    z.infer<typeof checkoutSchema>;