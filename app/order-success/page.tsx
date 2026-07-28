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
            <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
                <CheckCircle2 className="h-24 w-24 text-sage" />

                <h1 className="mt-8 font-display text-5xl font-bold text-walnut">
                    Order Placed Successfully
                </h1>

                <p className="mt-4 max-w-xl text-lg text-walnut-light">
                    Thank you for your order. We have received it and our kitchen has
                    started processing it.
                </p>

                {id && (
                    <div className="mt-10 w-full rounded-3xl bg-offwhite p-8 shadow-soft">
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

                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-sage px-6 py-3 font-semibold text-offwhite transition hover:bg-sage-dark"
                    >
                        <Home className="h-5 w-5" />
                        Back to Home
                    </Link>

                    {id && (
                        <Link
                            href={`/track-order?id=${id}`}
                            className="inline-flex items-center gap-2 rounded-full border border-sage px-6 py-3 font-semibold text-sage transition hover:bg-sage hover:text-offwhite"
                        >
                            Track Order
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}