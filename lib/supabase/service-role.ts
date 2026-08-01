import { createClient } from '@supabase/supabase-js';

// Server-only client with elevated privileges. Never import this in a
// client component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
export function createServiceRoleClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}