import type { LucideIcon } from "lucide-react";
import {
    LayoutDashboard,
    ShoppingBag,
    UtensilsCrossed,
    Tags,
    Users,
    BarChart3,
    Settings,
} from "lucide-react";

export type AdminNavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
};

// Single source of truth for admin nav — used by both Sidebar (links/icons)
// and Header (page title lookup) so the two never drift out of sync.
export const adminNavItems: AdminNavItem[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];