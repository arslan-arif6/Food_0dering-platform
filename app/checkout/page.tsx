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
                        {/* Yahan settings pass karein */}
                        <CheckoutForm settings={settings} />

                        {/* Yahan bhi settings pass karein */}
                        <CheckoutSummary settings={settings} />
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