import { createSupabaseServerClient } from "@/lib/supabase/server";

const BUCKET = "restaurant-assets";

const EXTENSION_BY_MIME: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

function buildFileName(mimeType: string) {
    const extension = EXTENSION_BY_MIME[mimeType] ?? "jpg";
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return `logo-${unique}.${extension}`;
}

export type UploadLogoResult =
    | { success: true; path: string; url: string }
    | { success: false; error: string };

export async function uploadRestaurantLogo(
    file: File
): Promise<UploadLogoResult> {
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
        console.error("uploadRestaurantLogo error:", error);
        return {
            success: false,
            error:
                "Failed to upload the logo. Please check your connection and try again.",
        };
    }

    const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.path);

    return { success: true, path: data.path, url: publicUrlData.publicUrl };
}

export function extractStoragePathFromPublicUrl(url: string): string | null {
    const marker = `/${BUCKET}/`;
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.slice(index + marker.length);
}

export async function deleteRestaurantLogo(path: string): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.storage.from(BUCKET).remove([path]);

    if (error) {
        console.error("deleteRestaurantLogo error:", error);
    }
}