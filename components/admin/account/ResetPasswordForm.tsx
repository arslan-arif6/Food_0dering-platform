"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";
import TextField from "@/components/admin/fields/TextField";

type Step = "loading" | "invalid" | "mfa" | "password" | "done";

export default function ResetPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("loading");
    const [factorId, setFactorId] = useState<string | null>(null);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pending, startTransition] = useTransition();

    async function checkSession() {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            setStep("invalid");
            return;
        }

        const { data } = await supabase.auth.mfa.listFactors();
        const totp = data?.totp ?? [];

        if (totp.length > 0) {
            setFactorId(totp[0].id);
            setStep("mfa");
        } else {
            setStep("password");
        }
    }

    useEffect(() => {
        // The recovery link sets the session client-side and fires this event.
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                checkSession();
            }
        });


        checkSession();

        return () => sub.subscription.unsubscribe();

    }, []);

    function verifyMfa() {
        if (!factorId || code.trim().length !== 6) {
            toast.error("Enter the 6-digit authenticator code");
            return;
        }

        startTransition(async () => {
            const { data: challenge, error: challengeError } =
                await supabase.auth.mfa.challenge({ factorId });

            if (challengeError) {
                toast.error(challengeError.message);
                return;
            }

            const { error } = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challenge.id,
                code: code.trim(),
            });

            if (error) {
                toast.error("Invalid verification code");
                return;
            }

            setStep("password");
        });
    }

    function submitNewPassword() {
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        startTransition(async () => {
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) {
                toast.error(error.message);
                return;
            }

            setStep("done");
            toast.success("Password updated");
        });
    }

    if (step === "loading") {
        return (
            <div className="flex items-center gap-2 text-sm text-walnut-light">
                <Loader2 className="h-4 w-4 animate-spin" /> Checking your link...
            </div>
        );
    }

    if (step === "invalid") {
        return (
            <div className="text-center">
                <h1 className="font-display text-2xl font-semibold text-walnut">
                    Link invalid or expired
                </h1>
                <p className="mt-2 text-sm text-walnut-light">
                    Request a new reset link from the admin login page.
                </p>
                <button
                    onClick={() => router.push("/admin/login")}
                    className="mt-6 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white"
                >
                    Back to login
                </button>
            </div>
        );
    }

    if (step === "mfa") {
        return (
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-sage-dark" />
                    <h1 className="font-display text-2xl font-semibold text-walnut">
                        Verify it&apos;s you
                    </h1>
                </div>
                <p className="text-sm text-walnut-light">
                    This account has 2-step verification enabled. Enter the code from your
                    authenticator app before resetting your password.
                </p>

                <TextField
                    id="mfaCode"
                    label="Verification code"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />

                <button
                    onClick={verifyMfa}
                    disabled={pending}
                    className="flex items-center justify-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                    {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Verify
                </button>
            </div>
        );
    }

    if (step === "password") {
        return (
            <div className="flex flex-col gap-5">
                <h1 className="font-display text-2xl font-semibold text-walnut">
                    Set a new password
                </h1>

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

                <button
                    onClick={submitNewPassword}
                    disabled={pending}
                    className="flex items-center justify-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                    {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Update Password
                </button>
            </div>
        );
    }

    // done
    return (
        <div className="text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-sage-dark" />
            <h1 className="mt-3 font-display text-2xl font-semibold text-walnut">
                Password updated
            </h1>
            <p className="mt-2 text-sm text-walnut-light">You can now sign in.</p>
            <button
                onClick={() => router.push("/admin/login")}
                className="mt-6 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white"
            >
                Go to login
            </button>
        </div>
    );
}