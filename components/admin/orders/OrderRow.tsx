import Link from "next/link";
import { Eye } from "lucide-react";

import type { DatabaseOrder } from "@/lib/database/orders";
import StatusBadge from "@/components/admin/StatusBadge";
import WhatsAppButton from "@/components/admin/orders/WhatsAppButton";

type OrderRowProps = {
    order: DatabaseOrder;
};

export default function OrderRow({
    order,
}: OrderRowProps) {
    return (
        <tr className="border-b border-cream last:border-0">
            <td className="px-4 py-4 font-medium text-walnut">
                #{order.id.slice(0, 8)}
            </td>

            <td className="px-4 py-4">
                <div className="font-medium text-walnut">
                    {order.customerName}
                </div>
            </td>

            <td className="px-4 py-4 text-walnut-light">
                {order.phone}
            </td>

            <td className="px-4 py-4 text-center">
                {order.items.length}
            </td>

            <td className="px-4 py-4 font-medium">
                Rs. {order.total.toFixed(0)}
            </td>

            <td className="px-4 py-4 capitalize">
                {order.paymentMethod.replaceAll("_", " ")}
            </td>

            <td className="px-4 py-4">
                <StatusBadge status={order.status} />
            </td>

            <td className="px-4 py-4 whitespace-nowrap text-walnut-light">
                {new Date(order.createdAt).toLocaleString()}
            </td>

            <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                    <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-sage px-4 py-2 text-sm font-medium text-sage transition hover:bg-sage hover:text-offwhite"
                    >
                        <Eye className="h-4 w-4" />
                        View
                    </Link>

                    <WhatsAppButton
                        order={{
                            id: order.id,
                            customerName: order.customerName,
                            phone: order.phone,
                            status: order.status,
                        }}
                    />
                </div>
            </td>
        </tr>
    );
}