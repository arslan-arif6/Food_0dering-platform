import type { DatabaseDish, DatabaseDishVariant } from "./dishes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDish(databaseDish: any): DatabaseDish {
    const variants: DatabaseDishVariant[] = [];

    for (const variant of databaseDish.dish_variants ?? []) {
        if (!variants.find((v) => v.id === variant.id)) {
            variants.push({
                id: variant.id,
                name: variant.name,
                price: Number(variant.price),
            });
        }
    }

    const categories: string[] = [];

    for (const item of databaseDish.dish_categories ?? []) {
        const slug = item.categories?.slug;

        if (slug && !categories.includes(slug)) {
            categories.push(slug);
        }
    }

    return {
        id: databaseDish.id,
        name: databaseDish.name,
        description: databaseDish.description,
        image: databaseDish.image,
        featured: databaseDish.featured,
        available: databaseDish.available,
        soldOut: databaseDish.sold_out ?? false,
        tag: databaseDish.tag ?? undefined,
        categories,
        variants,
    };
}