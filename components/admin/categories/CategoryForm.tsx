"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/admin/Card";
import FormSection from "@/components/admin/FormSection";
import FormActions from "@/components/admin/FormActions";
import TextField from "@/components/admin/fields/TextField";

import type { CategoryActionResult } from "@/app/admin/(protected)/categories/actions";

type CategoryFormProps = {
    action: (name: string) => Promise<CategoryActionResult>;
    initialName?: string;
};

export default function CategoryForm({
    action,
    initialName = "",
}: CategoryFormProps) {
    const router = useRouter();

    const [name, setName] = useState(initialName);

    const [fieldError, setFieldError] = useState("");
    const [formError, setFormError] = useState("");

    const [isPending, startTransition] = useTransition();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setFieldError("");
        setFormError("");

        startTransition(async () => {
            const result = await action(name);

            if (result.success) {
                router.push("/admin/categories");
                router.refresh();
                return;
            }

            if (result.fieldError) {
                setFieldError(result.fieldError);
            }

            if (result.formError) {
                setFormError(result.formError);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {formError && (
                <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
                    {formError}
                </div>
            )}

            <Card>
                <FormSection
                    title="Category"
                    description="Enter the category name."
                >
                    <TextField
                        id="category-name"
                        label="Category Name"
                        placeholder="Breakfast"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={fieldError}
                        disabled={isPending}
                    />
                </FormSection>
            </Card>

            <FormActions
                loading={isPending}
                saveLabel="Save Category"
                cancelLabel="Cancel"
                onCancel={() => router.push("/admin/categories")}
            />
        </form>
    );
}