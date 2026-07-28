import { Users } from "lucide-react";
import ComingSoon from "@/components/admin/ComingSoon";

export default function AdminCustomersPage() {
    return (
        <ComingSoon
            icon={Users}
            title="Customer Directory"
            description="Browse registered customers, their saved delivery addresses, and order history."
        />
    );
}