"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    useForm,
    useFieldArray,
    Controller,
    type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import Card from "@/components/admin/Card";
import FormSection from "@/components/admin/FormSection";
import FormActions from "@/components/admin/FormActions";
import TextField from "@/components/admin/fields/TextField";
import TextAreaField from "@/components/admin/fields/TextAreaField";
import SwitchField from "@/components/admin/fields/SwitchField";
import ImageDropzone from "@/components/admin/fields/ImageDropzone";
import {
    dishFormSchema,
    editDishFormSchema,
    MAX_VARIANTS,
    type DishFormInput,
    type DishFormSubmitValues,
} from "@/lib/validations/dish";
import type { CreateDishResult } from "@/app/admin/(protected)/menu/new/actions";
import type { DatabaseCategory } from "@/lib/database/categories";

type DishFormInitialValues = {
    name: string;
    description?: string;
    categoryIds: string[];
    variants: { name: string; price: string }[];
    available: boolean;
    soldOut: boolean;
    featured: boolean;
};

type DishFormProps = {
    categories: DatabaseCategory[];
    action: (values: DishFormSubmitValues) => Promise<CreateDishResult>;
    initialValues?: DishFormInitialValues;
    existingImageUrl?: string;
};

// `action` is injected by the parent route rather than imported directly,
// so this component stays reusable across routes (Add Dish and Edit
// Dish) instead of being coupled to a specific Server Action.
//
// When `initialValues` is provided, the form runs in "edit" mode: the
// image becomes optional (keep the existing one if no new file is
// chosen) and fields are pre-filled. Otherwise this behaves exactly as
// the original Add Dish form did.
export default function DishForm({
    categories,
    action,
    initialValues,
    existingImageUrl,
}: DishFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [formError, setFormError] = useState<string | null>(null);

    const isEditing = Boolean(initialValues);

    // dishFormSchema (create) and editDishFormSchema (edit) differ only
    // in how the `image` field is validated/typed — everything else is
    // identical. Both take DishFormInput as input and both produce a
    // value assignable to DishFormSubmitValues (create always yields a
    // real File, which is assignable into the optional `image?: File`
    // slot; edit yields `File | undefined` directly).
    //
    // Rather than hand-reconstructing zod's internal generic signature
    // to force both schemas into one static type (which is what broke
    // under zod v4 — its generics changed), each branch below is
    // resolved against its own real, concrete schema, so TypeScript
    // checks each one correctly on its own terms. Only the two
    // resulting resolvers are unified into the single signature
    // DishForm's useForm call needs, with one narrow, well-understood
    // cast at that boundary.
    const resolver = (isEditing
        ? zodResolver(editDishFormSchema)
        : zodResolver(dishFormSchema)) as unknown as Resolver<
            DishFormInput,
            unknown,
            DishFormSubmitValues
        >;

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = useForm<DishFormInput, unknown, DishFormSubmitValues>({
        resolver,
        defaultValues: initialValues
            ? { ...initialValues, image: undefined }
            : {
                name: "",
                description: "",
                categoryIds: [],
                variants: [{ name: "", price: "" }],
                available: true,
                soldOut: false,
                featured: false,
                image: undefined,
            },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    const selectedCategoryIds = watch("categoryIds");
    const available = watch("available");
    const soldOut = watch("soldOut");
    const featured = watch("featured");

    const atMaxVariants = fields.length >= MAX_VARIANTS;

    function toggleCategory(id: string) {
        const current = selectedCategoryIds ?? [];
        if (current.includes(id)) {
            setValue(
                "categoryIds",
                current.filter((item) => item !== id),
                { shouldValidate: true }
            );
        } else {
            setValue("categoryIds", [...current, id], { shouldValidate: true });
        }
    }

    function handleAddVariant() {
        if (atMaxVariants) return;
        append({ name: "", price: "" });
    }

    function onSubmit(values: DishFormSubmitValues) {
        setFormError(null);

        startTransition(async () => {
            const result = await action(values);
            // On success, the action redirects server-side and this line is
            // never reached — a returned result always means the save
            // failed validation or hit a server error.
            if (!result.success) {
                if (result.fieldErrors) {
                    for (const [field, message] of Object.entries(
                        result.fieldErrors
                    )) {
                        if (message) {
                            setError(field as keyof DishFormInput, { message });
                        }
                    }
                }
                if (result.formError) {
                    setFormError(result.formError);
                }
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
            {formError && (
                <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                    {formError}
                </div>
            )}

            <Card>
                <FormSection
                    title="General Information"
                    description="The dish name and description shown to customers."
                >
                    <TextField
                        id="dish-name"
                        label="Dish Name"
                        placeholder="e.g. Ammi's Chicken Biryani"
                        error={errors.name?.message}
                        disabled={isPending}
                        {...register("name")}
                    />
                    <TextAreaField
                        id="dish-description"
                        label="Description"
                        rows={4}
                        placeholder="A short, appetizing description of the dish."
                        error={errors.description?.message}
                        disabled={isPending}
                        {...register("description")}
                    />
                </FormSection>
            </Card>

            <Card>
                <FormSection
                    title="Categories"
                    description="Select every category this dish should appear under."
                >
                    {categories.length === 0 ? (
                        <p className="text-sm text-walnut-light">No categories found.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const active = (selectedCategoryIds ?? []).includes(
                                    category.id
                                );
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        aria-pressed={active}
                                        disabled={isPending}
                                        onClick={() => toggleCategory(category.id)}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${active
                                            ? "bg-sage text-offwhite shadow-soft"
                                            : "bg-cream text-walnut hover:bg-cream-dark"
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {errors.categoryIds?.message && (
                        <p className="text-sm text-red-600">
                            {errors.categoryIds.message}
                        </p>
                    )}
                </FormSection>
            </Card>

            <Card>
                <FormSection
                    title="Variants"
                    description="Add one or more size/price options for this dish."
                >
                    <div className="flex flex-col gap-4">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="flex flex-col gap-4 rounded-2xl border border-walnut/10 p-4 sm:flex-row sm:items-end"
                            >
                                <div className="flex-1">
                                    <TextField
                                        id={`variant-name-${index}`}
                                        label="Variant Name"
                                        placeholder="e.g. Half / Full"
                                        error={errors.variants?.[index]?.name?.message}
                                        disabled={isPending}
                                        {...register(`variants.${index}.name` as const)}
                                    />
                                </div>
                                <div className="sm:w-40">
                                    <TextField
                                        id={`variant-price-${index}`}
                                        label="Price (Rs.)"
                                        type="number"
                                        step="0.01"
                                        placeholder="0"
                                        error={errors.variants?.[index]?.price?.message}
                                        disabled={isPending}
                                        {...register(`variants.${index}.price` as const)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1 || isPending}
                                    aria-label="Remove variant"
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream text-walnut transition hover:bg-cream-dark disabled:opacity-40"
                                >
                                    <Trash2 className="h-4 w-4" strokeWidth={1.9} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddVariant}
                        disabled={isPending || atMaxVariants}
                        className="flex items-center gap-2 self-start rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-walnut transition hover:bg-cream-dark disabled:opacity-60"
                    >
                        <Plus className="h-4 w-4" />
                        Add Variant
                    </button>

                    {atMaxVariants && (
                        <p className="text-sm text-walnut-light">
                            Maximum of 4 variants allowed.
                        </p>
                    )}
                </FormSection>
            </Card>

            <Card>
                <FormSection
                    title="Visibility"
                    description="Control how this dish appears on the public menu."
                >
                    <SwitchField
                        id="dish-available"
                        label="Available"
                        description="Show this dish as orderable on the public menu."
                        checked={available}
                        onChange={(checked) => setValue("available", checked)}
                    />
                    <SwitchField
                        id="dish-sold-out"
                        label="Sold Out"
                        description="Temporarily hide from ordering while still showing on the menu (e.g. ran out mid-day). Dish stays visible to customers, marked as sold out."
                        checked={soldOut}
                        onChange={(checked) => setValue("soldOut", checked)}
                    />
                    <SwitchField
                        id="dish-featured"
                        label="Featured"
                        description="Highlight this dish in the Featured Dishes section."
                        checked={featured}
                        onChange={(checked) => setValue("featured", checked)}
                    />
                </FormSection>
            </Card>

            <Card>
                <FormSection title="Image" description="Upload a photo of the dish.">
                    <Controller
                        control={control}
                        name="image"
                        render={({ field }) => (
                            <ImageDropzone
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.image?.message}
                                disabled={isPending}
                                existingImageUrl={existingImageUrl}
                            />
                        )}
                    />
                </FormSection>
            </Card>

            <FormActions
                cancelLabel="Cancel"
                saveLabel={isEditing ? "Save Changes" : "Save Dish"}
                loading={isPending}
                onCancel={() => router.push("/admin/menu")}
            />
        </form>
    );
}