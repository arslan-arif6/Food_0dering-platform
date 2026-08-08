"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getUser } from "@/lib/supabase/getUser";

export type AdminRow = {
    id: string;
    user_id: string;
    email: string;
    full_name: string | null;
    role: string;
    is_active: boolean;
    created_at: string;
};

export type AdminActionResult =
    | { success: true }
    | { success: false; error: string };

async function requireOwner() {
    const user = await getUser();
    if (!user) return { user: null, error: "Not authenticated" as string | null };

    const supabase = await createSupabaseServerClient();
    const { data: adminRow } = await supabase
        .from("admins")
        .select("role, is_active")
        .or(`user_id.eq.${user.id},email.eq.${user.email ?? ""}`)
        .single();

    if (!adminRow || !adminRow.is_active || adminRow.role !== "owner") {
        return { user: null, error: "Only the owner can manage admin accounts" };
    }

    return { user, error: null as string | null };
}

export async function getAdmins(): Promise<{ data: AdminRow[] | null; error: string | null }> {
    const { error: authError } = await requireOwner();

    if (authError) {
        return { data: null, error: authError };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("admins")
        .select("id, user_id, email, full_name, role, is_active, created_at")
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);
        return { data: null, error: error.message };
    }

    return { data, error: null };
}

export async function createAdminAction(
    email: string,
    password: string,
    fullName: string
): Promise<AdminActionResult> {
    const { error: authError } = await requireOwner();
    if (authError) return { success: false, error: authError };

    if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
    }

    const serviceClient = createServiceRoleClient();

    // Owner sets the credentials directly and hands them to the new admin
    // out of band (WhatsApp/in person) — no invite email round-trip.
    const { data, error } = await serviceClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (error || !data.user) {
        console.error(error);
        return { success: false, error: error?.message ?? "Couldn't create admin account" };
    }

    const { error: insertError } = await serviceClient.from("admins").insert({
        user_id: data.user.id,
        email,
        full_name: fullName || null,
        role: "admin",
        is_active: true,
    });

    if (insertError) {
        console.error(insertError);
        // Roll back the auth user so we don't leave an orphaned account
        // with no matching admins row.
        await serviceClient.auth.admin.deleteUser(data.user.id);
        return { success: false, error: "Couldn't create admin record. Please try again." };
    }

    revalidatePath("/admin/settings");
    return { success: true };
}

export async function revokeAdminAction(
    adminId: string,
    targetUserId: string
): Promise<AdminActionResult> {
    const { user, error: authError } = await requireOwner();
    if (authError || !user) return { success: false, error: authError ?? "Not authenticated" };

    if (user.id === targetUserId) {
        return { success: false, error: "You can't remove your own access" };
    }

    const serviceClient = createServiceRoleClient();
    const { error } = await serviceClient
        .from("admins")
        .update({ is_active: false })
        .eq("id", adminId);

    if (error) {
        console.error(error);
        return { success: false, error: "Couldn't remove access. Please try again." };
    }

    revalidatePath("/admin/settings");
    return { success: true };
}

export async function reactivateAdminAction(adminId: string): Promise<AdminActionResult> {
    const { error: authError } = await requireOwner();
    if (authError) return { success: false, error: authError };

    const serviceClient = createServiceRoleClient();
    const { error } = await serviceClient
        .from("admins")
        .update({ is_active: true })
        .eq("id", adminId);

    if (error) {
        console.error(error);
        return { success: false, error: "Couldn't restore access. Please try again." };
    }

    revalidatePath("/admin/settings");
    return { success: true };
}