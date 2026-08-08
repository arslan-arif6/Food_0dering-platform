import ResetPasswordForm from "@/components/admin/account/ResetPasswordForm";

export default function SetPasswordPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-10">
            <div className="w-full max-w-md rounded-3xl bg-offwhite p-8 shadow-soft">
                <ResetPasswordForm />
            </div>
        </main>
    );
}