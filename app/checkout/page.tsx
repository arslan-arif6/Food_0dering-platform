import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { getRestaurantSettings } from "@/lib/database/settings";

export default async function CheckoutPage() {
    const settings = await getRestaurantSettings();

    return (
        <>
            <Navbar name={settings?.restaurant_name} logoUrl={settings?.logo_url} />

            <main className="bg-cream px-4 py-8 sm:py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 sm:mb-12">
                        <h1 className="font-display text-4xl font-bold text-walnut sm:text-5xl">
                            Checkout
                        </h1>

                        <p className="mt-3 text-[15px] leading-6 text-walnut-light sm:text-lg">
                            Complete your order details below.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr] lg:gap-10 lg:items-start">
                        {/* Summary first on mobile so user sees totals before filling the form */}
                        <div className="order-first lg:order-last">
                            <CheckoutSummary settings={settings} />
                        </div>

                        <div className="order-last lg:order-first">
                            <CheckoutForm settings={settings} />
                        </div>
                    </div>
                </div>
            </main>

            <Footer
                name={settings?.restaurant_name}
                description={settings?.description}
                facebookUrl={settings?.facebook_url}
                instagramUrl={settings?.instagram_url}
                googleMapsUrl={settings?.google_maps_url}
            />
        </>
    );
}
