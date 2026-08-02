import { Search } from "lucide-react";

import {
    getOrders,
    OrderStatus,
    OrderDateFilter,
} from "@/lib/database/orders";

import PageHeader from "@/components/admin/PageHeader";
import OrderRow from "@/components/admin/orders/OrderRow";
import RefreshOrdersButton from "@/components/admin/orders/RefreshOrdersButton";
import SearchOrdersInput from "@/components/admin/orders/SearchOrdersInput";
import OrderStatusFilters from "@/components/admin/orders/OrderStatusFilters";
import OrderDateFilters from "@/components/admin/orders/OrderDateFilters";


type Props = {
    searchParams?: Promise<{
        search?: string;
        status?: string;
        date?: string;
    }>;
};

export default async function OrdersPage({
    searchParams,
}: Props) {
    const params = await searchParams;

    const search = params?.search?.trim().toLowerCase() ?? "";

    const status =
        (params?.status as OrderStatus | undefined) ?? "all";
    const date =
        (params?.date as OrderDateFilter | undefined) ??
        "today";

    const orders = await getOrders(date);
    const counts = {
        all: orders.length,
        new: orders.filter((o) => o.status === "new").length,
        preparing: orders.filter((o) => o.status === "preparing").length,
        ready: orders.filter((o) => o.status === "ready").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            search === "" ||
            order.customerName.toLowerCase().includes(search) ||
            order.phone.toLowerCase().includes(search) ||
            order.id.toLowerCase().includes(search);

        const matchesStatus =
            status === "all" || order.status === status;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Orders"
                description="Manage customer orders."
                actions={<RefreshOrdersButton />}
            />
            <OrderDateFilters />

            <OrderStatusFilters counts={counts} />

            <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-walnut-light" />

                <SearchOrdersInput
                    orders={orders.map((order) => ({
                        id: order.id,
                        customerName: order.customerName,
                        phone: order.phone,
                    }))}
                    defaultValue={search}
                    status={status}
                />
            </div>

            <div className="overflow-hidden rounded-3xl bg-offwhite shadow-soft">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="hidden bg-cream md:table-header-group">
                            <tr>
                                <th className="px-4 py-4 text-left">
                                    Order
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Customer
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Phone
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Items
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Total
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Payment
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Status
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Created
                                </th>

                                <th className="px-4 py-4"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="py-16 text-center text-walnut-light"
                                    >
                                        No matching orders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <OrderRow
                                        key={order.id}
                                        order={order}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}