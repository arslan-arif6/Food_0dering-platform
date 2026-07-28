import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
};

// Reusable empty state — used for "no dishes", "no orders", "no customers",
// "no categories", etc. wherever a list/table has zero results.
export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-offwhite p-14 text-center shadow-soft">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                <Icon className="h-8 w-8" strokeWidth={1.75} />
            </div>

            <h3 className="mt-6 font-display text-xl font-semibold text-walnut">
                {title}
            </h3>

            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-walnut-light">
                {description}
            </p>

            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}