"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

type LogoutButtonProps = {
    className?: string;
    label?: string;
};

// Reusable sign-out action. Renders as an icon-only button by default
// (matching the admin header), or pass `label` to show text alongside
// the icon for use elsewhere (e.g. a settings page).
export default function LogoutButton({
    className,
    label,
}: LogoutButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSignOut() {
        setLoading(true);

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        router.push("/admin/login");
        router.refresh();
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={loading}
            aria-label="Sign out"
            className={
                className ??
                "flex h-10 w-10 items-center justify-center rounded-full text-walnut-light transition hover:bg-cream hover:text-walnut disabled:opacity-60"
            }
        >
            <LogOut className="h-5 w-5" strokeWidth={1.9} />
            {label && <span className="ml-2 text-sm font-medium">{label}</span>}
        </button>
    );
}