"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotSending, setForgotSending] = useState(false);
    const [forgotSent, setForgotSent] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    async function handleForgotPassword(e: React.FormEvent) {
        e.preventDefault();
        if (!forgotEmail.trim()) return;

        setForgotSending(true);
        const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
            redirectTo: `${window.location.origin}/admin/set-password`,
        });
        setForgotSending(false);

        // Always show the same success message, whether or not the email
        // exists — avoids leaking which emails have admin accounts.
        setForgotSent(true);
    }

    if (showForgot) {
        return (
            <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                    <h2 className="mb-2 font-medium text-walnut">Reset your password</h2>
                    <p className="mb-4 text-sm text-walnut-light">
                        Enter your admin email — we&apos;ll send a link to reset your password.
                    </p>
                </div>

                {forgotSent ? (
                    <p className="rounded-xl bg-sage/10 px-4 py-3 text-sm text-sage-dark">
                        If that email has an admin account, a reset link has been sent.
                    </p>
                ) : (
                    <>
                        <div>
                            <label className="mb-2 block font-medium text-walnut">Email</label>
                            <input
                                type="email"
                                required
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                className="w-full rounded-xl border border-walnut/20 px-4 py-3 outline-none focus:border-sage"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={forgotSending}
                            className="w-full rounded-xl bg-sage px-4 py-3 font-semibold text-white transition hover:bg-sage-dark disabled:opacity-60"
                        >
                            {forgotSending ? "Sending..." : "Send Reset Link"}
                        </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={() => {
                        setShowForgot(false);
                        setForgotSent(false);
                        setForgotEmail("");
                    }}
                    className="w-full text-center text-sm text-walnut-light underline"
                >
                    Back to sign in
                </button>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="mb-2 block font-medium text-walnut">Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-walnut/20 px-4 py-3 outline-none focus:border-sage"
                />
            </div>

            <div>
                <label className="mb-2 block font-medium text-walnut">Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-walnut/20 px-4 py-3 outline-none focus:border-sage"
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-sage px-4 py-3 font-semibold text-white transition hover:bg-sage-dark disabled:opacity-60"
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="w-full text-center text-sm text-walnut-light underline"
            >
                Forgot password?
            </button>
        </form>
    );
}