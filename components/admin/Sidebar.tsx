"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { adminNavItems } from "@/lib/admin/nav-items";
import { useAdminShell } from "@/components/admin/AdminShellProvider";
import { siteConfig } from "@/lib/config/site";

function isActive(pathname: string, href: string) {
    if (href === "/admin") {
        return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
    const pathname = usePathname();
    const { mobileNavOpen, closeMobileNav } = useAdminShell();

    return (
        <>
            {mobileNavOpen && (
                <div
                    aria-hidden
                    onClick={closeMobileNav}
                    className="fixed inset-0 z-40 bg-walnut/40 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-walnut/10 bg-offwhite transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between border-b border-walnut/10 p-6">
                    <div>
                        <h2 className="font-display text-2xl font-semibold text-walnut">
                            {siteConfig.name}
                        </h2>
                        <p className="mt-1 text-sm text-walnut-light">
                            {siteConfig.adminPanelLabel}
                        </p>
                    </div>

                    <button
                        aria-label="Close menu"
                        onClick={closeMobileNav}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-walnut transition hover:bg-cream lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                    {adminNavItems.map((item) => {
                        const active = isActive(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileNav}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${active
                                    ? "bg-sage text-offwhite shadow-soft"
                                    : "text-walnut-light hover:bg-cream hover:text-walnut"
                                    }`}
                            >
                                <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.9} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}