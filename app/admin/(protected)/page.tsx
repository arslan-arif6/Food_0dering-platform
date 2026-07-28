import {
    ShoppingBag,
    Wallet,
    Users,
    Clock,
    type LucideIcon,
} from "lucide-react";

type StatCard = {
    label: string;
    value: string;
    icon: LucideIcon;
};

// Placeholder values only — not wired to the database yet.
const stats: StatCard[] = [
    { label: "Orders", value: "—", icon: ShoppingBag },
    { label: "Revenue", value: "—", icon: Wallet },
    { label: "Customers", value: "—", icon: Users },
    { label: "Pending Orders", value: "—", icon: Clock },
];

export default function AdminDashboardPage() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-3xl bg-offwhite p-6 shadow-soft"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                        <stat.icon className="h-6 w-6" strokeWidth={1.9} />
                    </div>

                    <p className="mt-5 text-sm font-medium text-walnut-light">
                        {stat.label}
                    </p>
                    <p className="mt-1 font-display text-3xl font-semibold text-walnut">
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    );
}