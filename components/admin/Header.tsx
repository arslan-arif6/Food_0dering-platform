"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { adminNavItems } from "@/lib/admin/nav-items";
import { useAdminShell } from "@/components/admin/AdminShellProvider";
import LogoutButton from "@/components/admin/LogoutButton";

function getPageTitle(pathname: string) {
    const match = adminNavItems.find(
        (item) =>
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(`${item.href}/`))
    );

    return match?.label ?? "Admin Dashboard";
}

export default function Header({ userEmail }: { userEmail: string }) {
    const pathname = usePathname();
    const { toggleMobileNav } = useAdminShell();

    const title = getPageTitle(pathname);

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-walnut/10 bg-offwhite/90 px-5 py-5 backdrop-blur-sm sm:px-8">
            <div className="flex items-center gap-4">
                <button
                    aria-label="Open menu"
                    onClick={toggleMobileNav}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-walnut transition hover:bg-cream lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <h1 className="font-display text-2xl font-semibold text-walnut sm:text-3xl">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-walnut">{userEmail}</p>
                    <p className="text-xs text-walnut-light">Administrator</p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage font-display text-sm font-semibold text-offwhite">
                    {(userEmail?.[0] ?? "A").toUpperCase()}
                </div>

                <LogoutButton />
            </div>
        </header>
    );
}