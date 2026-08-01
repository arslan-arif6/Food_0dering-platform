"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, ShieldCheck, ShieldPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";
import TextField from "@/components/admin/fields/TextField";

type MfaFactor = {
    id: string;
    friendly_name?: string | null;
    factor_type?: string;
    status?: string;
};

type Enrollment = {
    id: string;
    qrCode: string;
    secret: string;
};

type Props = {
    mode?: "settings" | "gate";
};

export default function MfaPanel({ mode = "settings" }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [verifiedFactors, setVerifiedFactors] = useState<MfaFactor[]>([]);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [code, setCode] = useState("");
    const [pending, startTransition] = useTransition();

    const hasFactor = verifiedFactors.length > 0;
    const qrSrc = enrollment?.qrCode
        ? `data:image/svg+xml;utf-8,${encodeURIComponent(enrollment.qrCode)}`
        : "";

    async function loadFactors() {
        const { data, error } = await supabase.auth.mfa.listFactors();

        if (error) {
            toast.error("Couldn't load 2-step verification status");
            setLoading(false);
            return;
        }

        setVerifiedFactors((data.totp ?? []) as MfaFactor[]);
        setLoading(false);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadFactors();
    }, []);

    function startEnrollment() {
        startTransition(async () => {
            const { data, error } = await supabase.auth.mfa.enroll({
                factorType: "totp",
                friendlyName: "Home Made Food Admin",
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            setEnrollment({
                id: data.id,
                qrCode: data.totp.qr_code,
                secret: data.totp.secret,
            });
            setCode("");
        });
    }

    function verifyFactor(factorId: string) {
        const token = code.trim();
        if (token.length !== 6) {
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

            const { error: verifyError } = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challenge.id,
                code: token,
            });

            if (verifyError) {
                toast.error("Invalid verification code");
                return;
            }

            toast.success(
                mode === "gate"
                    ? "2-step verification complete"
                    : "2-step verification enabled"
            );
            setEnrollment(null);
            setCode("");
            await loadFactors();
            router.refresh();

            if (mode === "gate") {
                router.replace("/admin");
            }
        });
    }

    function removeFactor(factorId: string) {
        startTransition(async () => {
            const { error } = await supabase.auth.mfa.unenroll({ factorId });

            if (error) {
                toast.error(error.message);
                return;
            }

            toast.success("2-step verification removed");
            await loadFactors();
            router.refresh();
        });
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-walnut-light">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading security status...
            </div>
        );
    }

    if (mode === "gate" && hasFactor && !enrollment) {
        const factor = verifiedFactors[0];
        return (
            <div className="flex flex-col gap-5">
                <div className="rounded-2xl bg-cream p-4">
                    <p className="text-sm font-semibold text-walnut">
                        Enter your 6-digit authenticator code
                    </p>
                    <p className="mt-1 text-sm text-walnut-light">
                        Open your authenticator app and enter the current code.
                    </p>
                </div>

                <TextField
                    id="mfaCode"
                    label="Verification code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />

                <button
                    type="button"
                    onClick={() => verifyFactor(factor.id)}
                    disabled={pending}
                    className="flex w-fit items-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-offwhite transition hover:bg-sage-dark disabled:opacity-60"
                >
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                    Verify and continue
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream p-4">
                <div>
                    <p className="text-sm font-semibold text-walnut">
                        {hasFactor ? "2-step verification is enabled" : "2-step verification is required"}
                    </p>
                    <p className="mt-1 text-sm text-walnut-light">
                        Use Google Authenticator, Microsoft Authenticator, Authy, or 1Password.
                    </p>
                </div>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${hasFactor
                        ? "bg-sage/15 text-sage-dark"
                        : "bg-red-50 text-red-600"
                        }`}
                >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {hasFactor ? "Enabled" : "Not enabled"}
                </span>
            </div>

            {!hasFactor && !enrollment && (
                <button
                    type="button"
                    onClick={startEnrollment}
                    disabled={pending}
                    className="flex w-fit items-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-offwhite transition hover:bg-sage-dark disabled:opacity-60"
                >
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldPlus className="h-4 w-4" />}
                    Set up 2-step verification
                </button>
            )}

            {enrollment && (
                <div className="grid gap-5 rounded-2xl border border-walnut/10 p-4 lg:grid-cols-[220px_1fr]">
                    <div className="rounded-2xl bg-white p-3">
                        {qrSrc && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={qrSrc}
                                alt="Authenticator QR code"
                                className="h-auto w-full"
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-sm font-semibold text-walnut">
                                Scan this QR code
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-walnut-light">
                                After scanning, enter the 6-digit code from your
                                authenticator app to finish setup.
                            </p>
                        </div>

                        <div className="rounded-xl bg-cream px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-walnut-light">
                                Manual setup key
                            </p>
                            <p className="mt-1 break-all font-mono text-sm text-walnut">
                                {enrollment.secret}
                            </p>
                        </div>

                        <TextField
                            id="setupMfaCode"
                            label="Verification code"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        />

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => verifyFactor(enrollment.id)}
                                disabled={pending}
                                className="flex items-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-offwhite transition hover:bg-sage-dark disabled:opacity-60"
                            >
                                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                                Enable 2FA
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEnrollment(null);
                                    setCode("");
                                }}
                                disabled={pending}
                                className="rounded-full px-5 py-2.5 text-sm font-semibold text-walnut transition hover:bg-cream disabled:opacity-60"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode === "settings" && hasFactor && (
                <div className="flex flex-col gap-3">
                    {verifiedFactors.map((factor) => (
                        <div
                            key={factor.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-walnut/10 bg-cream px-4 py-3"
                        >
                            <div>
                                <p className="text-sm font-semibold text-walnut">
                                    {factor.friendly_name || "Authenticator app"}
                                </p>
                                <p className="text-xs text-walnut-light">
                                    Active authenticator factor
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFactor(factor.id)}
                                disabled={pending}
                                className="flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
