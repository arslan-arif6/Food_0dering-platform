import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getUser() {
    const cookieStore = await cookies();

    console.log("SERVER COOKIES:", cookieStore.getAll());

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                },
            },
        }
    );

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    console.log("SERVER USER:", user);
    console.log("SERVER ERROR:", error);

    return user;
}