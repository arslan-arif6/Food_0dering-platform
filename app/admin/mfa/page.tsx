import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import MfaPanel from "@/components/admin/account/MfaPanel";
import { getAdminAuthState } from "@/lib/supabase/admin-auth";

export default async function AdminMfaPage() {
    const auth = await getAdminAuthState();

    if (auth.status === "unauthenticated") {
        redirect("/admin/login");
    }

    if (auth.status === "not_admin" || auth.status === "inactive") {
        redirect("/admin/access-denied");
    }

    if (!auth.mfaRequired) {
        redirect("/admin");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-10">
            <div className="w-full max-w-xl rounded-3xl bg-offwhite p-8 shadow-soft">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="font-display text-3xl font-semibold text-walnut">
                            Secure your admin account
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-walnut-light">
                            Admin access requires a second verification step.
                            This protects your restaurant dashboard even if a
                            password is guessed or leaked.
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <MfaPanel mode="gate" />
                </div>
            </div>
        </main>
    );
}

