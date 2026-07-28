import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

export default function CheckoutPage() {
    return (
        <>
            <Navbar />

            <main className="bg-cream py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-12">
                        <h1 className="font-display text-5xl font-bold text-walnut">
                            Checkout
                        </h1>

                        <p className="mt-3 text-lg text-walnut-light">
                            Complete your order details below.
                        </p>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1.5fr_0.8fr]">
                        <CheckoutForm />

                        <CheckoutSummary />
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}