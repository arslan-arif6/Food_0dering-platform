import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Categories from "@/components/home/Categories";
import FeaturedDishes from "@/components/home/FeaturedDishes";
import Testimonials from "@/components/home/Testimonials";
import BusinessHours from "@/components/home/BusinessHours";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <Categories />
      <FeaturedDishes />
      <Testimonials />
      <BusinessHours />
      <Contact />
      <Footer />
    </main>
  );
}