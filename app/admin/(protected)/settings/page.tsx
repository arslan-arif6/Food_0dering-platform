import { Settings } from "lucide-react";
import ComingSoon from "@/components/admin/ComingSoon";

export default function AdminSettingsPage() {
    return (
        <ComingSoon
            icon={Settings}
            title="Settings"
            description="Configure business hours, delivery zones, WhatsApp contact number, and payment account details."
        />
    );
}