import type { ReactNode } from "react";

type FormSectionProps = {
    title: string;
    description?: string;
    children: ReactNode;
};

// Reusable section wrapper inside admin forms — groups related fields
// under a heading, e.g. "General Information", "Pricing", "Visibility".
export default function FormSection({
    title,
    description,
    children,
}: FormSectionProps) {
    return (
        <section className="border-b border-walnut/10 pb-8 last:border-b-0 last:pb-0">
            <div className="mb-5">
                <h3 className="font-display text-lg font-semibold text-walnut">
                    {title}
                </h3>
                {description && (
                    <p className="mt-1 text-sm text-walnut-light">{description}</p>
                )}
            </div>

            <div className="flex flex-col gap-5">{children}</div>
        </section>
    );
}