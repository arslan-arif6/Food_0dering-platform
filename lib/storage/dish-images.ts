import { createSupabaseServerClient } from "@/lib/supabase/server";

const BUCKET = "dish-images";

const EXTENSION_BY_MIME: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

function buildFileName(mimeType: string) {
    const extension = EXTENSION_BY_MIME[mimeType] ?? "jpg";
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return `${unique}.${extension}`;
}

export type UploadDishImageResult =
    | { success: true; path: string; url: string }
    | { success: false; error: string };

// Uploads a dish image to the public "dish-images" bucket and returns
// its public URL.
export async function uploadDishImage(
    file: File
): Promise<UploadDishImageResult> {
    const supabase = await createSupabaseServerClient();
    const fileName = buildFileName(file.type);

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
        });

    if (error || !data) {
        console.error("uploadDishImage error:", error);
        return {
            success: false,
            error:
                "Failed to upload the image. Please check your connection and try again.",
        };
    }

    const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.path);

    return { success: true, path: data.path, url: publicUrlData.publicUrl };
}

// Best-effort cleanup used during rollback — logs but does not throw,
// since this runs after a failure and shouldn't mask the original error
// that triggered it.
export async function deleteDishImage(path: string): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.storage.from(BUCKET).remove([path]);

    if (error) {
        console.error("deleteDishImage error:", error);
    }
}

// Given a dish's stored public URL, recovers the object's path within
// the bucket so it can be passed to deleteDishImage(). Used by Edit
// Dish to remove the old image after a successful replacement. Returns
// null if the URL doesn't look like it belongs to this bucket.
export function extractStoragePathFromPublicUrl(url: string): string | null {
    const marker = `/${BUCKET}/`;
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.slice(index + marker.length);
}