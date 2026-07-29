import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/database/categories";
import { getRestaurantAvailability, settingsToScheduleConfig } from "@/lib/restaurant";
import { getRestaurantSettings } from "@/lib/database/settings";

export default async function Categories() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getRestaurantSettings(),
  ]);

  const availability = getRestaurantAvailability(
    new Date(),
    settingsToScheduleConfig(settings)
  );

  const homepageCategories = categories.filter((category) =>
    ["breakfast", "lunch", "dinner"].includes(category.slug)
  );

  return (
    <section id="categories" className="bg-cream/40 px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
            Popular Categories
          </p>

          <h2 className="mt-3 font-display text-3xl font-semibold text-walnut sm:text-4xl">
            Whatever time it is, there's a plate for it
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homepageCategories.map((category) => {
            const isAvailable =
              availability.isOpen &&
              availability.currentMeal === category.slug;

            const Card = (
              <>
                <div className="relative h-56 w-full">
                  <Image
                    src={`/images/categories/${category.slug}.jpg`}
                    alt={category.name}
                    fill
                    className={`object-cover transition-transform duration-500 ${isAvailable
                      ? "group-hover:scale-110"
                      : "grayscale opacity-60"
                      }`}
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-walnut/80 via-walnut/10 to-transparent" />

                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                      <span className="rounded-full bg-offwhite px-4 py-2 text-sm font-semibold text-walnut">
                        Opens Later
                      </span>
                    </div>
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-xl font-semibold text-offwhite">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-offwhite/85">
                    Fresh homemade {category.name.toLowerCase()} prepared daily.
                  </p>
                </div>
              </>
            );

            if (isAvailable) {
              return (
                <Link
                  key={category.id}
                  href={`/menu?category=${category.slug}`}
                  className="group relative overflow-hidden rounded-3xl shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg"
                >
                  {Card}
                </Link>
              );
            }

            return (
              <div
                key={category.id}
                className="group relative cursor-not-allowed overflow-hidden rounded-3xl shadow-soft"
              >
                {Card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}