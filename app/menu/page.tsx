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

            <section className="bg-gradient-to-b from-cream via-offwhite to-offwhite py-20">
                <div className="mx-auto max-w-7xl px-5 text-center">
                    <h1 className="font-display text-5xl font-semibold text-walnut">
                        Our Menu
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-lg text-walnut-light">
                        Fresh homemade meals prepared every day using quality ingredients.
                        Choose your favorite dishes and enjoy delicious food delivered to
                        your doorstep.
                    </p>

                    <div className="mt-8 inline-flex items-center rounded-full bg-sage/10 px-5 py-3 text-sm font-medium text-sage-dark">
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