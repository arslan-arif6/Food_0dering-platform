import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { AdminShellProvider } from "@/components/admin/AdminShellProvider";
import RealtimeOrdersListener from "@/components/admin/RealtimeOrdersListener";
import { getAdminAuthState } from "@/lib/supabase/admin-auth";

export default async function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    const auth = await getAdminAuthState();

    if (auth.status === "unauthenticated") {
        redirect("/admin/login");
    }

    if (auth.status === "not_admin" || auth.status === "inactive") {
        redirect("/admin/access-denied");
    }

    if (auth.status !== "authorized") {
        redirect("/admin/login");
    }

    if (auth.mfaRequired) {
        redirect("/admin/mfa");
    }

    return (
        <AdminShellProvider>
            <RealtimeOrdersListener />
            <div className="flex min-h-screen bg-cream">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Header
                        userEmail={auth.admin.email}
                        userRole={auth.admin.role}
                    />

                    <main className="flex-1 p-5 sm:p-8">{children}</main>
                </div>
            </div>
        </AdminShellProvider>
    );
}
