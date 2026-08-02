import Link from "next/link";
import { CheckCircle2, Receipt, Home } from "lucide-react";

type PageProps = {
    searchParams: Promise<{
        id?: string;
    }>;
};

export default async function OrderSuccessPage({
    searchParams,
}: PageProps) {
    const { id } = await searchParams;

    return (
        <main className="min-h-screen bg-cream">
            <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20">
                <CheckCircle2 className="h-20 w-20 text-sage sm:h-24 sm:w-24" />

                <h1 className="mt-7 font-display text-4xl font-bold leading-tight text-walnut sm:mt-8 sm:text-5xl">
                    Order Placed Successfully
                </h1>

                <p className="mt-4 max-w-xl text-[15px] leading-7 text-walnut-light sm:text-lg">
                    Thank you for your order. We have received it and our kitchen has
                    started processing it.
                </p>

                {id && (
                    <div className="mt-8 w-full rounded-3xl bg-offwhite p-5 shadow-soft sm:mt-10 sm:p-8">
                        <div className="flex items-center justify-center gap-3">
                            <Receipt className="h-6 w-6 text-sage" />

                            <span className="text-lg font-semibold text-walnut">
                                Order ID
                            </span>
                        </div>

                        <p className="mt-4 break-all font-mono text-sm text-walnut-light">
                            {id}
                        </p>
                    </div>
                )}

                <div className="mt-10 grid w-full gap-3 sm:mt-12 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
                    <Link
                        href="/"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sage px-6 py-3 font-semibold text-offwhite transition hover:bg-sage-dark"
                    >
                        <Home className="h-5 w-5" />
                        Back to Home
                    </Link>

                    {id && (
                        <Link
                            href={`/track-order?id=${id}`}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-sage px-6 py-3 font-semibold text-sage transition hover:bg-sage hover:text-offwhite"
                        >
                            Track Order
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}
