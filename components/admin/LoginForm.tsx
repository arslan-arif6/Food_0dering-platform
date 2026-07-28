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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError("");

        console.log("Attempting login...");

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        const session = await supabase.auth.getSession();
        console.log("SESSION:", session.data.session);

        console.log("DOCUMENT COOKIE:", document.cookie);

        console.log("LOGIN RESULT:", { data, error });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        console.log("Login successful. Redirecting...");

        router.push("/admin");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="mb-2 block font-medium text-walnut">
                    Email
                </label>

                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-walnut/20 px-4 py-3 outline-none focus:border-sage"
                />
            </div>

            <div>
                <label className="mb-2 block font-medium text-walnut">
                    Password
                </label>

                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-walnut/20 px-4 py-3 outline-none focus:border-sage"
                />
            </div>

            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}

            <button
                disabled={loading}
                className="w-full rounded-xl bg-sage py-3 font-semibold text-offwhite transition hover:bg-sage-dark disabled:opacity-60"
            >
                {loading ? "Signing In..." : "Sign In"}
            </button>
        </form>
    );
}