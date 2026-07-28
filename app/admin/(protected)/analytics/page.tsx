import { BarChart3 } from "lucide-react";
import ComingSoon from "@/components/admin/ComingSoon";

export default function AdminAnalyticsPage() {
    return (
        <ComingSoon
            icon={BarChart3}
            title="Analytics"
            description="Track revenue, order volume, and popular dishes once real order data starts coming in."
        />
    );
}