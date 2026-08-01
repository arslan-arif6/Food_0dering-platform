import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AdminAccessDeniedPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-cream px-5">
            <div className="w-full max-w-md rounded-3xl bg-offwhite p-8 text-center shadow-soft">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <ShieldAlert className="h-7 w-7" />
                </div>

                <h1 className="mt-5 font-display text-3xl font-semibold text-walnut">
                    Access unavailable
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-walnut-light">
                    This account is not active for the admin panel. Please ask
                    the owner to restore access if this is a mistake.
                </p>

                <Link
                    href="/admin/login"
                    className="mt-6 inline-flex rounded-full bg-sage px-6 py-3 text-sm font-semibold text-offwhite transition hover:bg-sage-dark"
                >
                    Back to login
                </Link>
            </div>
        </main>
    );
}

