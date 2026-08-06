import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import type { User } from "@supabase/supabase-js";

export type AdminRole = "owner" | "admin";

export type CurrentAdmin = Tables<"admins"> & {
    role: AdminRole;
};

const RECOVERY_OWNER_EMAIL = "ch.arslan4367@gmail.com";

export type AdminAuthState =
    | {
        status: "unauthenticated";
        user: null;
        admin: null;
        mfaRequired: false;
    }
    | {
        status: "not_admin" | "inactive";
        user: User;
        admin: Tables<"admins"> | null;
        mfaRequired: false;
    }
    | {
        status: "authorized";
        user: User;
        admin: CurrentAdmin;
        mfaRequired: boolean;
    };

async function resolveMfaRequired(
    supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
    role: AdminRole
): Promise<boolean> {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (role === "owner") {
        // Owner must always have MFA set up and verified.
        return aal?.currentLevel !== "aal2";
    }

    // Regular admins: only enforced if they chose to enroll a factor
    // themselves (nextLevel would be aal2 in that case). If they never
    // enrolled, nextLevel stays aal1 and they're never gated.
    return aal?.nextLevel === "aal2" && aal?.currentLevel !== "aal2";
}

export async function getAdminAuthState(): Promise<AdminAuthState> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            status: "unauthenticated",
            user: null,
            admin: null,
            mfaRequired: false,
        };
    }

    const adminQuery = supabase
        .from("admins")
        .select("id, user_id, email, full_name, role, is_active, created_at")
        .limit(1);

    const { data: admin } = await adminQuery
        .or(`user_id.eq.${user.id},email.eq.${user.email ?? ""}`)
        .single();

    if (!admin && user.email === RECOVERY_OWNER_EMAIL) {
        const fallbackAdmin: CurrentAdmin = {
            id: user.id,
            user_id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name ?? "Owner",
            role: "owner",
            is_active: true,
            created_at: user.created_at,
        };

        return {
            status: "authorized",
            user,
            admin: fallbackAdmin,
            mfaRequired: await resolveMfaRequired(supabase, "owner"),
        };
    }

    if (!admin) {
        return {
            status: "not_admin",
            user,
            admin: null,
            mfaRequired: false,
        };
    }

    if (!admin.is_active) {
        return {
            status: "inactive",
            user,
            admin,
            mfaRequired: false,
        };
    }

    return {
        status: "authorized",
        user,
        admin: admin as CurrentAdmin,
        mfaRequired: await resolveMfaRequired(supabase, admin.role as AdminRole),
    };
}