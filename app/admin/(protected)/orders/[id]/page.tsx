import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getOrderById } from "@/lib/database/orders";
import OrderStatusForm from "@/components/admin/orders/OrderStatusForm";
import WhatsAppButton from "@/components/admin/orders/WhatsAppButton";
import AdminNotesForm from "@/components/admin/orders/AdminNotesForm";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderTimeline from "@/components/admin/orders/OrderTimeline";
import { getOrderHistory } from "@/lib/database/order-history";

export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }
    const timeline = await getOrderHistory(order.id);
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={`Order #${order.id.slice(0, 8)}`}
                description="View complete customer order."
                actions={
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-2 rounded-full border border-sage px-4 py-2 text-sm font-medium text-sage transition hover:bg-sage hover:text-offwhite"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

                {/* LEFT COLUMN */}

                <div className="space-y-6">

                    <section className="rounded-3xl bg-offwhite p-6 shadow-soft">
                        <h3 className="mb-4 text-xl font-semibold text-walnut">
                            Customer Information
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2">

                            <div>
                                <p className="text-sm text-walnut-light">
                                    Customer
                                </p>

                                <p className="font-medium text-walnut">
                                    {order.customerName}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-walnut-light">
                                    Phone
                                </p>

                                <p className="font-medium text-walnut">
                                    {order.phone}
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <p className="text-sm text-walnut-light">
                                    Address
                                </p>

                                <p className="font-medium whitespace-pre-wrap text-walnut">
                                    {order.address}
                                </p>
                            </div>

                        </div>
                    </section>

                    {order.notes.trim() !== "" && (
                        <section className="rounded-3xl bg-offwhite p-6 shadow-soft">
                            <h3 className="mb-4 text-xl font-semibold text-walnut">
                                Customer Notes
                            </h3>

                            <p className="whitespace-pre-wrap text-walnut">
                                {order.notes}
                            </p>
                        </section>
                    )}

                    <section className="rounded-3xl bg-offwhite p-6 shadow-soft">
                        <h3 className="mb-4 text-xl font-semibold text-walnut">
                            Ordered Items
                        </h3>

                        <div className="divide-y divide-cream">

                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-4"
                                >
                                    <div>
                                        <p className="font-medium text-walnut">
                                            {item.dishName}
                                        </p>

                                        <p className="text-sm text-walnut-light">
                                            {item.variantName}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-medium">
                                            {item.quantity} × Rs. {item.unitPrice.toFixed(0)}
                                        </p>

                                        <p className="font-semibold text-sage">
                                            Rs. {item.lineTotal.toFixed(0)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </section>

                </div>

                {/* RIGHT COLUMN */}

                <div className="space-y-6">

                    <section className="rounded-3xl bg-offwhite p-6 shadow-soft">
                        <h3 className="mb-4 text-xl font-semibold text-walnut">
                            Order Summary
                        </h3>

                        <OrderStatusForm
                            orderId={order.id}
                            currentStatus={order.status}
                        />

                        <div className="mt-4">
                            <WhatsAppButton order={order} />
                        </div>

                        <div className="mt-6">
                            <AdminNotesForm
                                orderId={order.id}
                                initialNotes={order.adminNotes ?? ""}
                            />
                        </div>

                        <div className="mt-6">
                            <OrderTimeline history={timeline} />
                        </div>

                        <div className="mt-6 space-y-4">

                            <div className="flex justify-between">
                                <span>Payment</span>

                                <span className="capitalize">
                                    {order.paymentMethod.replaceAll("_", " ")}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Status</span>

                                <StatusBadge status={order.status} />
                            </div>

                            <div className="flex justify-between">
                                <span>Created</span>

                                <span>
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <hr />

                            <div className="flex justify-between">
                                <span>Subtotal</span>

                                <span>
                                    Rs. {order.subtotal.toFixed(0)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Delivery</span>

                                <span>
                                    Rs. {order.deliveryFee.toFixed(0)}
                                </span>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-sage">
                                <span>Total</span>

                                <span>
                                    Rs. {order.total.toFixed(0)}
                                </span>
                            </div>

                        </div>
                    </section>

                </div>

            </div>
        </div>
    );
}