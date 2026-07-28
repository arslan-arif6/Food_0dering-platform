import { Leaf, HeartPulse, Truck, BadgePercent } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "Sourced daily from local markets, never frozen, never sitting around.",
  },
  {
    icon: HeartPulse,
    title: "Healthy Meals",
    description:
      "Balanced, home-style cooking without excess oil or artificial shortcuts.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Hot food at your door in around 30 minutes, packed to stay that way.",
  },
  {
    icon: BadgePercent,
    title: "Affordable Prices",
    description:
      "Honest, family-friendly pricing — restaurant quality without the markup.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="about"
      className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
            Why Choose Us
          </p>

          <h2 className="mt-3 font-display text-3xl font-semibold text-walnut sm:text-4xl">
            Cooked with care, not compromise
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl bg-cream/60 p-8 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:bg-cream hover:shadow-soft-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-offwhite transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <feature.icon className="h-7 w-7" strokeWidth={1.75} />
              </div>

              <h3 className="mt-6 font-display text-xl font-semibold text-walnut">
                {feature.title}
              </h3>

              <p className="mt-2 text-[15px] leading-relaxed text-walnut-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}