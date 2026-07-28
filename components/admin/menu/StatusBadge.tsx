type StatusBadgeProps = {
    active: boolean;
    activeLabel: string;
    inactiveLabel: string;
};

// Shared pill badge for Available/Unavailable and Featured/Standard states.
export default function StatusBadge({
    active,
    activeLabel,
    inactiveLabel,
}: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${active
                ? "bg-sage/15 text-sage-dark"
                : "bg-walnut/10 text-walnut-light"
                }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${active ? "bg-sage-dark" : "bg-walnut-light"
                    }`}
            />
            {active ? activeLabel : inactiveLabel}
        </span>
    );
}