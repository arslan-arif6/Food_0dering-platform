"use client";

import { createContext, useCallback, useContext, useState } from "react";

type AdminShellContextValue = {
    mobileNavOpen: boolean;
    openMobileNav: () => void;
    closeMobileNav: () => void;
    toggleMobileNav: () => void;
};

const AdminShellContext = createContext<AdminShellContextValue | undefined>(
    undefined
);

// Shares mobile sidebar open/closed state between Header (toggle button)
// and Sidebar (the panel + its own close button), since they're siblings
// under the admin layout and can't pass props directly to each other.
export function AdminShellProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
    const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
    const toggleMobileNav = useCallback(() => setMobileNavOpen((v) => !v), []);

    return (
        <AdminShellContext.Provider
            value={{ mobileNavOpen, openMobileNav, closeMobileNav, toggleMobileNav }}
        >
            {children}
        </AdminShellContext.Provider>
    );
}

export function useAdminShell() {
    const context = useContext(AdminShellContext);
    if (!context) {
        throw new Error("useAdminShell must be used within an AdminShellProvider");
    }
    return context;
}