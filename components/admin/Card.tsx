import type { ReactNode, HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
};

// Generic container used throughout admin pages — consistent rounding,
// padding, background, and shadow. Any extra className/props pass through
// so callers can extend layout (e.g. flex, grid span) without a new variant.
export default function Card({
    children,
    className = "",
    ...rest
}: CardProps) {
    return (
        <div
            className={`rounded-3xl bg-offwhite p-6 shadow-soft ${className}`}
            {...rest}
        >
            {children}
        </div>
    );
}