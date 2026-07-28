import type { LucideIcon } from "lucide-react";

type ComingSoonProps = {
    icon: LucideIcon;
    title: string;
    description: string;
};

// Shared placeholder card for admin pages that don't have functionality yet.
// Swap this out for real content page-by-page as each feature is built.
export default function ComingSoon({
    icon: Icon,
    title,
    description,
}: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-offwhite p-14 text-center shadow-soft">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                <Icon className="h-8 w-8" strokeWidth={1.75} />
            </div>

            <h2 className="mt-6 font-display text-2xl font-semibold text-walnut">
                {title}
            </h2>

            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-walnut-light">
                {description}
            </p>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-1.5 text-sm font-semibold text-walnut">
                Coming Soon
            </span>
        </div>
    );
}