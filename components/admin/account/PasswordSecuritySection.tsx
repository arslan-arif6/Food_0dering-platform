"use client";

import { useState, useTransition } from "react";
import { KeyRound, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import FormSection from "@/components/admin/FormSection";
import TextField from "@/components/admin/fields/TextField";
import { supabase } from "@/lib/supabase/client";
import { changeOwnPasswordAction } from "@/lib/actions/account";

type Props = {
    adminEmail: string;
};

export default function PasswordSecuritySection({ adminEmail }: Props) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resettingPassword, setResettingPassword] = useState(false);
    const [pending, startTransition] = useTransition();

    async function handlePasswordReset() {
        setResettingPassword(true);
        const { error } = await supabase.auth.resetPasswordForEmail(adminEmail, {
            redirectTo: `${window.location.origin}/admin/set-password`,
        });
        setResettingPassword(false);

        if (error) {
            toast.error("Couldn't send reset email. Please try again.");
            return;
        }

        toast.success("Password reset email sent");
    }

    function handlePasswordChange() {
        if (!currentPassword) {
            toast.error("Enter your current password");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword === currentPassword) {
            toast.error("New password must be different from current password");
            return;
        }

        startTransition(async () => {
            const result = await changeOwnPasswordAction(currentPassword, newPassword);

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password updated");
        });
    }

    return (
        <FormSection
            title="Security"
            description="Change your password and manage secure sign-in."
        >
            <TextField
                id="currentPassword"
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <div className="grid gap-5 lg:grid-cols-2">
                <TextField
                    id="newPassword"
                    label="New Password"
                    type="password"
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handlePasswordChange}
                    disabled={pending}
                    className="flex items-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-offwhite transition hover:bg-sage-dark disabled:opacity-60"
                >
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                    Change Password
                </button>

                <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={resettingPassword}
                    className="flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-walnut transition hover:opacity-80 disabled:opacity-60"
                >
                    {resettingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                    Send Reset Email
                </button>
            </div>
        </FormSection>
    );
}