import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Categories from "@/components/home/Categories";
import FeaturedDishes from "@/components/home/FeaturedDishes";
import Testimonials from "@/components/home/Testimonials";
import BusinessHours from "@/components/home/BusinessHours";
import Contact from "@/components/home/Contact";
import { getRestaurantSettings } from "@/lib/database/settings";

export default async function Home() {
  const settings = await getRestaurantSettings();

  return (
    <main>
      <Navbar name={settings?.restaurant_name} logoUrl={settings?.logo_url} />
      <Hero name={settings?.restaurant_name} description={settings?.description} />
      <WhyChooseUs />
      <Categories />
      <FeaturedDishes />
      <Testimonials />
      <BusinessHours />
      <Contact
        name={settings?.restaurant_name}
        phone={settings?.phone}
        whatsapp={settings?.whatsapp}
        email={settings?.email}
        address={settings?.address}
      />
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