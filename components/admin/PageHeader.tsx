import type { ReactNode } from "react";

type PageHeaderProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
};

// Reusable page header used across every admin page — title/description
// on the left, optional action(s) (e.g. an "Add" button) on the right.
export default function PageHeader({
    title,
    description,
    actions,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h2 className="font-display text-2xl font-semibold text-walnut">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-[15px] text-walnut-light">{description}</p>
                )}
            </div>

            {actions && (
                <div className="flex shrink-0 items-center gap-3">{actions}</div>
            )}
        </div>
    );
}