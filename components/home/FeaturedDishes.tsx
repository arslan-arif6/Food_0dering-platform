import DishCard from "@/components/home/DishCard";
import {
  getPublicDishes,
  getDishesByCategory,
} from "@/lib/database/dishes";

import { getRestaurantAvailability, settingsToScheduleConfig } from "@/lib/restaurant";
import { getRestaurantSettings } from "@/lib/database/settings";

type FeaturedDishesProps = {
  category?: string;
};

export default async function FeaturedDishes({ category }: FeaturedDishesProps) {
  const settings = await getRestaurantSettings();
  const availability = getRestaurantAvailability(
    new Date(),
    settingsToScheduleConfig(settings)
  );

  const dishes = category
    ? await getDishesByCategory(category)
    : await getPublicDishes();

  return (
    <section id="featured-dishes" className="px-4 py-16 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
            Featured Dishes
          </p>

          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-walnut sm:text-4xl">
            Straight from our kitchen to yours
          </h2>

          <p className="mt-4 text-sm leading-7 text-walnut-light sm:text-base sm:leading-8">{availability.message}</p>
        </div>

        {dishes.length === 0 ? (
          <div className="mx-auto mt-16 max-w-xl rounded-3xl border border-sage/20 bg-cream/40 p-10 text-center">
            <h3 className="font-display text-2xl text-walnut">
              {availability.isOpen
                ? "This category isn't available right now"
                : "Kitchen is currently closed"}
            </h3>

            <p className="mt-4 text-walnut-light">{availability.message}</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-6 md:gap-7 lg:grid-cols-3">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}