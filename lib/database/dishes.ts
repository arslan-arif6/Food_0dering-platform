import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapDish } from "./mappers";
import type { DishFormValues, DishFormSubmitValues } from "@/lib/validations/dish";
import type { Tables } from "@/lib/supabase/database.types";
import {
    getRestaurantAvailability,
    settingsToScheduleConfig,
    type MealType,
} from "@/lib/restaurant";
import { getRestaurantSettings } from "@/lib/database/settings";

export type DatabaseDishVariant = {
    id: string;
    name: string;
    price: number;
};

export type DatabaseDish = {
    id: string;
    name: string;
    description: string;
    image: string;
    featured: boolean;
    available: boolean;
    tag?: string;
    categories: string[];
    variants: DatabaseDishVariant[];
};

const DISH_SELECT = `
  *,
  dish_variants (*),
  dish_categories ( categories ( slug ) )
`;

async function filterAvailableMeal(
    dishes: DatabaseDish[]
): Promise<DatabaseDish[]> {
    const settings = await getRestaurantSettings();
    const availability = getRestaurantAvailability(
        new Date(),
        settingsToScheduleConfig(settings)
    );

    if (!availability.isOpen || !availability.currentMeal) {
        return [];
    }

    return dishes.filter((dish) =>
        dish.categories.includes(availability.currentMeal as MealType)
    );
}

// Public-facing query: only dishes marked available. Used by the
// customer landing page and /menu.
export async function getPublicDishes(): Promise<DatabaseDish[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("dishes")
        .select(DISH_SELECT)
        .eq("available", true)
        .order("name");

    if (error) {
        console.error(error);
        return [];
    }

    const dishes = data.map(mapDish);

    return filterAvailableMeal(dishes);
}

// Admin-facing query: every dish regardless of availability, so the
// admin can see and eventually toggle unavailable items back on.
export async function getAdminDishes(): Promise<DatabaseDish[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("dishes")
        .select(DISH_SELECT)
        .order("name");

    if (error) {
        console.error(error);
        return [];
    }

    return data.map(mapDish);
}

export async function getFeaturedDishes() {
    return getPublicDishes();
}

export async function getDishesByCategory(category: string) {
    const settings = await getRestaurantSettings();
    const availability = getRestaurantAvailability(
        new Date(),
        settingsToScheduleConfig(settings)
    );

    if (!availability.isOpen || availability.currentMeal !== category) {
        return [];
    }

    const dishes = await getPublicDishes();

    return dishes.filter((dish) => dish.categories.includes(category));
}


export async function createDish(
    values: Omit<DishFormValues, "image"> & { imageUrl: string }
): Promise<string> {
    const supabase = await createSupabaseServerClient();

    const { data: dish, error: dishError } = await supabase
        .from("dishes")
        .insert({
            name: values.name,
            description: values.description || null,
            image: values.imageUrl,
            featured: values.featured,
            available: values.available,
        })
        .select("id")
        .single();

    if (dishError || !dish) {
        throw dishError ?? new Error("Failed to create dish");
    }

    const dishId = dish.id;

    const { error: variantsError } = await supabase.from("dish_variants").insert(
        values.variants.map((variant) => ({
            dish_id: dishId,
            name: variant.name,
            price: variant.price,
        }))
    );

    if (variantsError) {
        await supabase.from("dishes").delete().eq("id", dishId);
        throw variantsError;
    }

    const { error: categoriesError } = await supabase
        .from("dish_categories")
        .insert(
            values.categoryIds.map((categoryId) => ({
                dish_id: dishId,
                category_id: categoryId,
            }))
        );

    if (categoriesError) {
        await supabase.from("dish_variants").delete().eq("dish_id", dishId);
        await supabase.from("dishes").delete().eq("id", dishId);
        throw categoriesError;
    }

    return dishId;
}

// --- Edit Dish additions below. Nothing above this line changed. ---

type DishEditQueryRow = Tables<"dishes"> & {
    dish_variants: Tables<"dish_variants">[] | null;
    dish_categories: { category_id: string }[] | null;
};

export type DishEditRecord = {
    id: string;
    name: string;
    description: string;
    image: string;
    featured: boolean;
    available: boolean;
    categoryIds: string[];
    variants: DatabaseDishVariant[];
};

// Loads a single dish by id, including its variants and the raw
// category ids it's linked to (not slugs — the edit form's category
// chips compare against category.id, since dish_categories.category_id
// is a uuid foreign key, not a slug).
export async function getDishForEdit(
    id: string
): Promise<DishEditRecord | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("dishes")
        .select(
            `
      *,
      dish_variants (*),
      dish_categories ( category_id )
    `
        )
        .eq("id", id)
        .single();

    if (error || !data) {
        console.error(error);
        return null;
    }

    const row = data as DishEditQueryRow;

    return {
        id: row.id,
        name: row.name,
        description: row.description ?? "",
        image: row.image ?? "",
        featured: row.featured ?? false,
        available: row.available,
        categoryIds: (row.dish_categories ?? []).map((entry) => entry.category_id),
        variants: (row.dish_variants ?? []).map((variant) => ({
            id: variant.id,
            name: variant.name,
            price: Number(variant.price),
        })),
    };
}

// Updates a dish and fully replaces its variants and category links.
// Like createDish, this is not wrapped in a single transaction — the
// dish row is updated first, then old variants/categories are deleted
// and new ones inserted. If a later step fails, earlier steps in this
// call are NOT automatically undone (the dish's core fields would
// already be updated) — this mirrors the same non-atomicity tradeoff
// already accepted for createDish, not a new limitation introduced
// here.
export async function updateDish(
    id: string,
    values: Omit<DishFormSubmitValues, "image"> & { imageUrl: string }
): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error: dishError } = await supabase
        .from("dishes")
        .update({
            name: values.name,
            description: values.description || null,
            image: values.imageUrl,
            featured: values.featured,
            available: values.available,
        })
        .eq("id", id);

    if (dishError) {
        throw dishError;
    }

    const { error: deleteVariantsError } = await supabase
        .from("dish_variants")
        .delete()
        .eq("dish_id", id);

    if (deleteVariantsError) {
        throw deleteVariantsError;
    }

    const { error: insertVariantsError } = await supabase
        .from("dish_variants")
        .insert(
            values.variants.map((variant) => ({
                dish_id: id,
                name: variant.name,
                price: variant.price,
            }))
        );

    if (insertVariantsError) {
        throw insertVariantsError;
    }

    const { error: deleteCategoriesError } = await supabase
        .from("dish_categories")
        .delete()
        .eq("dish_id", id);

    if (deleteCategoriesError) {
        throw deleteCategoriesError;
    }

    const { error: insertCategoriesError } = await supabase
        .from("dish_categories")
        .insert(
            values.categoryIds.map((categoryId) => ({
                dish_id: id,
                category_id: categoryId,
            }))
        );

    if (insertCategoriesError) {
        throw insertCategoriesError;
    }
}
export async function deleteDish(id: string): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error: categoryError } = await supabase
        .from("dish_categories")
        .delete()
        .eq("dish_id", id);

    if (categoryError) {
        throw categoryError;
    }

    const { error: variantError } = await supabase
        .from("dish_variants")
        .delete()
        .eq("dish_id", id);

    if (variantError) {
        throw variantError;
    }

    const { error: dishError } = await supabase
        .from("dishes")
        .delete()
        .eq("id", id);

    if (dishError) {
        throw dishError;
    }
}