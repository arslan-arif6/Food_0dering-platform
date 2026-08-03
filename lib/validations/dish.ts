import { z } from "zod";

export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_VARIANTS = 4;

// Duck-types a File-like value instead of using `instanceof File`.
// `File` is a browser/WHATWG global that is not guaranteed to exist on
// every server runtime (Node < 20 does not expose it globally). This
// module is shared between client components and Server Actions, so
// it gets evaluated in the server bundle too — referencing the bare
// `File` identifier there (as `z.instanceof(File)` would) throws a
// ReferenceError the moment the module loads, before any validation
// even runs. Checking the value's shape instead avoids touching the
// `File` global entirely, so this is safe on any runtime.
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

// Single ordered check for an image value, used via superRefine instead
// of chained .refine() calls. Chained refines all run independently
// even after an earlier one fails, so a chain like
// .refine(isFileLike).refine(file => file.size <= MAX) would still call
// `.size` on `undefined` when no file is selected, crashing at runtime.
// superRefine lets us check in order and stop at the first problem.
function checkImage(file: unknown, ctx: z.RefinementCtx) {
    if (!isFileLike(file)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a dish image",
        });
        return;
    }

    if (file.size === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a dish image",
        });
        return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Image must be 5MB or smaller",
        });
        return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Only JPG, PNG, and WEBP images are allowed",
        });
    }
}

// Edit-mode image check: undefined means "keep the existing image" and
// is not an error. Anything else goes through the same checks as create.
function checkOptionalImage(file: unknown, ctx: z.RefinementCtx) {
    // Treat any "nothing selected" representation as keep-existing-image,
    // not just a strict `undefined` — this is what was blocking Edit Dish
    // saves whenever no new file was picked.
    if (file === undefined || file === null || file === "") {
        return;
    }
    checkImage(file, ctx);
}

// Ordered price parsing: empty/whitespace -> "Price is required",
// non-numeric -> "Invalid number", only a successfully parsed number
// reaches the positive-number check. z.NEVER halts the transform
// pipeline immediately so only one error message is ever produced.
const variantPriceSchema = z
    .string()
    .transform((val) => val.trim())
    .transform((val, ctx) => {
        if (val.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Price is required",
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
    .pipe(z.number().positive("Price must be greater than 0"));

// Canonical shape after validation — price is a number and image is a
// required File. Used server-side to re-validate the Add Dish payload
// (defense in depth, in case client-side validation is bypassed), and
// as the source of DishFormValues. UNCHANGED — Add Dish behavior and
// messages are identical to before.
const dishFieldsSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Dish name is required")
        .max(120, "Dish name is too long"),
    description: z
        .string()
        .trim()
        .max(2000, "Description is too long")
        .optional(),
    categoryIds: z
        .array(z.string().uuid())
        .min(1, "Select at least one category"),
    variants: z
        .array(
            z.object({
                name: z.string().trim().min(1, "Variant name is required"),
                price: z.number().positive("Price must be greater than 0"),
            })
        )
        .min(1, "Add at least one variant")
        .max(MAX_VARIANTS, "Maximum of 4 variants allowed."),
    available: z.boolean(),
    soldOut: z.boolean(),
    featured: z.boolean(),
    image: z.custom<File>().superRefine(checkImage),
});

export type DishFormValues = z.infer<typeof dishFieldsSchema>;

// Client-only schema for Add Dish — UNCHANGED. Same shape, but `price`
// comes in as a string from the <input> element and is transformed to
// a number (see variantPriceSchema above). `image` starts as undefined
// (no file selected yet on first render); checkImage handles the
// undefined case without crashing and reports "Please select a dish
// image". The trailing .transform() asserts the output as `File` (not
// `File | undefined`) so the resolver's output type matches
// DishFormValues.image — safe because if checkImage added any issue,
// Zod marks the whole parse as failed and this transformed value is
// never used regardless of what it returns.
export const dishFormSchema = z.object({
    ...dishFieldsSchema.shape,
    variants: z
        .array(
            z.object({
                name: z.string().trim().min(1, "Variant name is required"),
                price: variantPriceSchema,
            })
        )
        .min(1, "Add at least one variant")
        .max(MAX_VARIANTS, "Maximum of 4 variants allowed."),
    image: z
        .custom<File | undefined>()
        .superRefine(checkImage)
        .transform((val) => val as File),
});

export type DishFormInput = z.input<typeof dishFormSchema>;

// Server-side validation for Add Dish — UNCHANGED.
export function parseDishFields(values: unknown) {
    return dishFieldsSchema.safeParse(values);
}

// --- Edit Dish additions below. Nothing above this line changed. ---

// Client-only schema for Edit Dish: identical to dishFormSchema except
// image is optional (keep existing image if no new file is chosen).
export const editDishFormSchema = z.object({
    ...dishFormSchema.shape,
    image: z.custom<File>().optional().superRefine(checkOptionalImage),
});

// Canonical (server-side) schema for Edit Dish: identical to
// dishFieldsSchema except image is optional.
export const editDishFieldsSchema = z.object({
    ...dishFieldsSchema.shape,
    image: z.custom<File>().optional().superRefine(checkOptionalImage),
});

// Shared submit-value shape for both Create and Edit actions/forms —
// same fields as DishFormValues, but image is optional so one `action`
// prop type on DishForm can serve both flows.
export type DishFormSubmitValues = Omit<DishFormValues, "image"> & {
    image?: File;
};

export function parseEditDishFields(values: unknown) {
    return editDishFieldsSchema.safeParse(values);
}