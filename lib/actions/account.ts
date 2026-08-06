"use server";

import { createClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getUser } from "@/lib/supabase/getUser";

export type AccountActionResult =
    | { success: true }
    | { success: false; error: string };

export async function changeOwnPasswordAction(
    currentPassword: string,
    newPassword: string
): Promise<AccountActionResult> {
    const user = await getUser();
    if (!user || !user.email) {
        return { success: false, error: "Not authenticated" };
    }

    if (newPassword.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
    }

    // Throwaway client, never persists a session — runs entirely on the
    // server, so it can't touch the browser's real logged-in session.
    const verifyClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { error: verifyError } = await verifyClient.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    });

    if (verifyError) {
        return { success: false, error: "Current password is incorrect" };
    }

    const serviceClient = createServiceRoleClient();
    const { error } = await serviceClient.auth.admin.updateUserById(user.id, {
        password: newPassword,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}