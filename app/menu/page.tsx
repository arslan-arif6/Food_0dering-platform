import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Categories from "@/components/home/Categories";
import FeaturedDishes from "@/components/home/FeaturedDishes";

import { getRestaurantAvailability, settingsToScheduleConfig } from "@/lib/restaurant";
import { getRestaurantSettings } from "@/lib/database/settings";

type MenuPageProps = {
    searchParams: Promise<{ category?: string }>;
};

export default async function MenuPage({ searchParams }: MenuPageProps) {
    const { category } = await searchParams;

    const settings = await getRestaurantSettings();
    const availability = getRestaurantAvailability(
        new Date(),
        settingsToScheduleConfig(settings)
    );

    return (
        <main className="min-h-screen bg-offwhite">
            <Navbar name={settings?.restaurant_name} logoUrl={settings?.logo_url} />

            {/* Page header — polished: eyebrow label + larger h1 + tighter max-width, airy pill */}
            <section className="bg-gradient-to-b from-cream via-offwhite to-offwhite px-4 py-14 sm:py-20 lg:py-28">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
                        Our Menu
                    </p>

                    <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-walnut sm:text-5xl">
                        Fresh, homemade, every day
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-walnut-light sm:mt-5 sm:text-lg sm:leading-8">
                        Choose your favourite dishes — prepared fresh using quality
                        ingredients and delivered straight to your door.
                    </p>

                    <div className="mt-7 inline-flex max-w-full items-center gap-2 rounded-full bg-sage/10 px-5 py-2.5 text-sm font-semibold text-sage-dark ring-1 ring-sage/20 sm:mt-8">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-sage-dark" />
                        {availability.message}
                    </div>
                </div>
            </section>

            <Categories />

            <FeaturedDishes category={category} />

            <Footer
                name={settings?.restaurant_name}
                description={settings?.description}
                facebookUrl={settings?.facebook_url}
                instagramUrl={settings?.instagram_url}
                googleMapsUrl={settings?.google_maps_url}
            />
        </main>
    );
}
