import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-cream px-5">
            <div className="w-full max-w-md rounded-3xl bg-offwhite p-8 shadow-soft">
                <div className="mb-8 text-center">
                    <h1 className="font-display text-3xl font-semibold text-walnut">
                        Admin Login
                    </h1>

                    <p className="mt-2 text-walnut-light">
                        Sign in to manage Home Made Food.
                    </p>
                </div>

                <LoginForm />
            </div>
        </main>
    );
}