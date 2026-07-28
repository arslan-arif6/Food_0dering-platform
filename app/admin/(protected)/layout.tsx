import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { AdminShellProvider } from "@/components/admin/AdminShellProvider";
import RealtimeOrdersListener from "@/components/admin/RealtimeOrdersListener";
import { getUser } from "@/lib/supabase/getUser";

export default async function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect("/admin/login");
    }

    return (
        <AdminShellProvider>
            <RealtimeOrdersListener />
            <div className="flex min-h-screen bg-cream">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Header userEmail={user.email ?? "Admin"} />

                    <main className="flex-1 p-5 sm:p-8">{children}</main>
                </div>
            </div>
        </AdminShellProvider>
    );
}