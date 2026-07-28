import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";

export type DatabaseCategory = {
    id: string;
    name: string;
    slug: string;
};

export async function getCategories(): Promise<DatabaseCategory[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

    if (error) {
        console.error(error);
        return [];
    }

    return data as DatabaseCategory[];
}

export async function getCategoryById(
    id: string
): Promise<DatabaseCategory | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        console.error(error);
        return null;
    }

    return data as DatabaseCategory;
}

export async function createCategory(
    name: string
): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from("categories")
        .insert({
            name: name.trim(),
            slug: slugify(name),
        });

    if (error) {
        throw error;
    }
}

export async function updateCategory(
    id: string,
    name: string
): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from("categories")
        .update({
            name: name.trim(),
            slug: slugify(name),
        })
        .eq("id", id);

    if (error) {
        throw error;
    }
}

export async function categoryInUse(id: string): Promise<boolean> {
    const supabase = await createSupabaseServerClient();

    const { count, error } = await supabase
        .from("dish_categories")
        .select("*", {
            count: "exact",
            head: true,
        })
        .eq("category_id", id);

    if (error) {
        throw error;
    }

    return (count ?? 0) > 0;
}

export async function deleteCategory(id: string): Promise<void> {
    const supabase = await createSupabaseServerClient();

    const inUse = await categoryInUse(id);

    if (inUse) {
        throw new Error(
            "Cannot delete category because dishes are assigned to it."
        );
    }

    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
}
