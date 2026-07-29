import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, MapPin, ShoppingBag, Wallet } from "lucide-react";

import { getCustomerByPhone } from "@/lib/database/customers";
import type { OrderStatus } from "@/lib/database/orders";
import PageHeader from "@/components/admin/PageHeader";
import Card from "@/components/admin/Card";
import StatusBadge from "@/components/admin/StatusBadge";

type Props = {
    params: Promise<{ phone: string }>;
};

export default async function CustomerDetailPage({ params }: Props) {
    const { phone: rawPhone } = await params;
    const phone = decodeURIComponent(rawPhone);

    const customer = await getCustomerByPhone(phone);

    if (!customer) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            <Link
                href="/admin/customers"
                className="flex w-fit items-center gap-2 text-sm font-semibold text-walnut-light hover:text-walnut"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Customers
            </Link>

            <PageHeader
                title={customer.customerName}
                description={`Customer since ${new Date(
                    customer.firstOrderAt
                ).toLocaleDateString()}`}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                        <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-walnut-light">Total Orders</p>
                        <p className="text-xl font-semibold text-walnut">
                            {customer.totalOrders}
                        </p>
                    </div>
                </Card>

                <Card className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-walnut-light">Total Spent</p>
                        <p className="text-xl font-semibold text-walnut">
                            Rs. {customer.totalSpent.toFixed(0)}
                        </p>
                    </div>
                </Card>

                <Card className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-walnut-light">Phone</p>
                        <p className="text-xl font-semibold text-walnut">
                            {customer.phone}
                        </p>
                    </div>
                </Card>
            </div>

            <Card>
                <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-walnut">
                    <MapPin className="h-5 w-5 text-sage-dark" />
                    Delivery Addresses Used
                </h3>

                <ul className="flex flex-col gap-2">
                    {customer.addresses.map((address) => (
                        <li
                            key={address}
                            className="rounded-xl bg-cream px-4 py-3 text-[15px] text-walnut"
                        >
                            {address}
                        </li>
                    ))}
                </ul>
            </Card>

            <div className="overflow-hidden rounded-3xl bg-offwhite shadow-soft">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-cream">
                            <tr>
                                <th className="px-4 py-4 text-left">Order</th>
                                <th className="px-4 py-4 text-center">Items</th>
                                <th className="px-4 py-4 text-left">Total</th>
                                <th className="px-4 py-4 text-left">Status</th>
                                <th className="px-4 py-4 text-left">Date</th>
                                <th className="px-4 py-4"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {customer.orders.map((order) => (
                                <tr key={order.id} className="border-t border-walnut/5">
                                    <td className="px-4 py-4 font-mono text-sm text-walnut-light">
                                        #{order.id.slice(0, 8)}
                                    </td>
                                    <td className="px-4 py-4 text-center text-walnut">
                                        {order.itemCount}
                                    </td>
                                    <td className="px-4 py-4 text-walnut">
                                        Rs. {order.total.toFixed(0)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={order.status as OrderStatus} />
                                    </td>
                                    <td className="px-4 py-4 text-walnut-light">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="font-semibold text-sage hover:text-sage-dark"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}