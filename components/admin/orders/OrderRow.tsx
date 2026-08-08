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
        <>
            {/* ---------- MOBILE CARD (Below md) ---------- */}
            <tr className="block border-b border-cream p-5 md:hidden last:border-0">
                <td className="block">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-display text-lg font-semibold text-walnut">
                                #{order.id.slice(0, 8)}
                            </span>
                            <StatusBadge status={order.status} />
                        </div>
                        <span className="font-semibold text-sage-dark">
                            Rs. {order.total.toFixed(0)}
                        </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 rounded-xl bg-cream/30 p-4 text-[15px]">
                        <div className="flex justify-between">
                            <span className="text-walnut-light">Customer</span>
                            <span className="font-medium text-walnut">{order.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-walnut-light">Phone</span>
                            <span className="font-medium text-walnut">{order.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-walnut-light">Items</span>
                            <span className="font-medium text-walnut">{order.items.length} items</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-walnut-light">Payment</span>
                            <span className="font-medium capitalize text-walnut">{order.paymentMethod.replaceAll("_", " ")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-walnut-light">Created</span>
                            <span className="font-medium text-walnut">{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                        <Link
                            href={`/admin/orders/${order.id}`}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-sage px-4 py-2.5 font-semibold text-sage transition hover:bg-sage hover:text-offwhite"
                        >
                            <Eye className="h-4 w-4" />
                            View Order
                        </Link>
                        <WhatsAppButton
                            order={{
                                id: order.id,
                                customerName: order.customerName,
                                phone: order.phone,
                                status: order.status,
                                address: order.address,
                                total: order.total,
                            }}
                        />
                    </div>
                </td>
            </tr>

            {/* ---------- DESKTOP ROW (md and up) ---------- */}
            <tr className="hidden border-b border-cream md:table-row last:border-0">
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
                                address: order.address,
                                total: order.total,
                            }}
                        />
                    </div>
                </td>
            </tr>
        </>
    );
}