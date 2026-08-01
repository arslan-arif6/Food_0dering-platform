"use client";

import { useEffect, useState, useTransition } from "react";
import {
    Crown,
    Loader2,
    ShieldCheck,
    ShieldOff,
    UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import FormSection from "@/components/admin/FormSection";
import TextField from "@/components/admin/fields/TextField";
import {
    getAdmins,
    inviteAdminAction,
    reactivateAdminAction,
    revokeAdminAction,
} from "@/lib/actions/admin-management";

type AdminRow = {
    id: string;
    user_id: string;
    email: string;
    full_name: string | null;
    role: string;
    is_active: boolean;
    created_at: string;
};

type Props = {
    currentAdminEmail: string;
};

export default function AdminManagementSection({ currentAdminEmail }: Props) {
    const [admins, setAdmins] = useState<AdminRow[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteName, setInviteName] = useState("");
    const [adminToRevoke, setAdminToRevoke] = useState<AdminRow | null>(null);
    const [isPending, startTransition] = useTransition();

    async function loadAdmins() {
        try {
            const data = await getAdmins();
            setAdmins(data as AdminRow[]);
        } catch {
            toast.error("Couldn't load admin list");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadAdmins();
    }, []);

    const self = admins?.find((a) => a.email === currentAdminEmail);
    const isOwner = self?.role === "owner";

    function handleInvite() {
        if (!inviteEmail.trim()) {
            toast.error("Enter an email address");
            return;
        }

        startTransition(async () => {
            const result = await inviteAdminAction(
                inviteEmail.trim(),
                inviteName.trim()
            );

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(`Invite sent to ${inviteEmail}`);
            setInviteEmail("");
            setInviteName("");
            await loadAdmins();
        });
    }

    function handleRevoke(admin: AdminRow) {
        startTransition(async () => {
            const result = await revokeAdminAction(admin.id, admin.user_id);

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(`${admin.email}'s access removed`);
            setAdminToRevoke(null);
            await loadAdmins();
        });
    }

    function handleReactivate(admin: AdminRow) {
        startTransition(async () => {
            const result = await reactivateAdminAction(admin.id);

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            toast.success(`${admin.email}'s access restored`);
            await loadAdmins();
        });
    }

    if (loading) {
        return (
            <FormSection title="Admin Team">
                <div className="flex items-center gap-2 text-sm text-walnut-light">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading admins...
                </div>
            </FormSection>
        );
    }

    return (
        <FormSection
            title="Admin Team"
            description="Owner can invite admins, remove access, and restore access."
        >
            <div className="flex flex-col gap-3">
                {admins?.map((admin) => (
                    <div
                        key={admin.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-walnut/10 bg-cream px-4 py-4"
                    >
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate text-sm font-semibold text-walnut">
                                    {admin.full_name || admin.email}
                                </p>

                                {admin.role === "owner" ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                        <Crown className="h-3 w-3" /> Owner
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-sage/15 px-2 py-0.5 text-xs font-medium text-sage-dark">
                                        Admin
                                    </span>
                                )}

                                {admin.email === currentAdminEmail && (
                                    <span className="rounded-full bg-offwhite px-2 py-0.5 text-xs font-medium text-walnut-light">
                                        You
                                    </span>
                                )}

                                {!admin.is_active && (
                                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                                        Access removed
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 truncate text-xs text-walnut-light">
                                {admin.email}
                            </p>
                        </div>

                        {isOwner && admin.email !== currentAdminEmail && (
                            <button
                                type="button"
                                onClick={() =>
                                    admin.is_active
                                        ? setAdminToRevoke(admin)
                                        : handleReactivate(admin)
                                }
                                disabled={isPending}
                                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-60 ${admin.is_active
                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                    : "bg-sage/10 text-sage-dark hover:bg-sage/20"
                                    }`}
                            >
                                {admin.is_active ? (
                                    <>
                                        <ShieldOff className="h-3.5 w-3.5" /> Remove Access
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="h-3.5 w-3.5" /> Restore Access
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {isOwner && (
                <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-dashed border-walnut/15 p-4">
                    <p className="text-sm font-semibold text-walnut">
                        Invite New Admin
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <TextField
                            id="inviteName"
                            label="Full Name"
                            value={inviteName}
                            onChange={(e) => setInviteName(e.target.value)}
                        />
                        <TextField
                            id="inviteEmail"
                            label="Email"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleInvite}
                        disabled={isPending}
                        className="flex w-fit items-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-offwhite transition hover:bg-sage-dark disabled:opacity-60"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <UserPlus className="h-4 w-4" />
                        )}
                        Send Invite
                    </button>
                </div>
            )}

            <ConfirmDialog
                open={Boolean(adminToRevoke)}
                title="Remove admin access?"
                description={
                    adminToRevoke
                        ? `${adminToRevoke.email} will no longer be able to open the admin panel. You can restore access later.`
                        : ""
                }
                confirmText="Remove Access"
                onCancel={() => setAdminToRevoke(null)}
                onConfirm={() => {
                    if (adminToRevoke) handleRevoke(adminToRevoke);
                }}
            />
        </FormSection>
    );
}
