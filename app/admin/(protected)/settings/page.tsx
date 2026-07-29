import { Settings as SettingsIcon } from "lucide-react";

import { getRestaurantSettings } from "@/lib/database/settings";
import { getUser } from "@/lib/supabase/getUser";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import SettingsForm from "@/components/admin/settings/SettingsForm";

export default async function AdminSettingsPage() {
    const [settings, user] = await Promise.all([
        getRestaurantSettings(),
        getUser(),
    ]);

    if (!settings) {
        return (
            <EmptyState
                icon={SettingsIcon}
                title="Settings unavailable"
                description="Couldn't load restaurant settings. Make sure the restaurant_settings table has been created and seeded (Step 1)."
            />
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Settings"
                description="Configure business hours, delivery, payments, and contact details."
            />

            <SettingsForm settings={settings} adminEmail={user?.email ?? ""} />
        </div>
    );
}