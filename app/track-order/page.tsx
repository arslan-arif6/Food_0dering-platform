import Link from "next/link";
import { Search } from "lucide-react";

import { getOrder } from "@/app/actions/get-order";
import TrackOrderAutoLoad from "@/components/track-order/TrackOrderAutoLoad";
import OrderStatusPoller from "@/components/track-order/OrderStatusPoller";
import RecentOrdersList from "@/components/track-order/RecentOrdersList";

type PageProps = {
    searchParams: Promise<{
        id?: string;
    }>;
};

export default async function TrackOrderPage({
    searchParams,
}: PageProps) {
    const { id } = await searchParams;

    const order = id ? await getOrder(id) : null;

    return (
        <main className="min-h-screen bg-cream">
            <TrackOrderAutoLoad hasId={Boolean(id)} />
            {order && <OrderStatusPoller />}

            <div className="mx-auto max-w-4xl px-6 py-20">
                <h1 className="font-display text-5xl font-bold text-walnut">
                    Track Your Order
                </h1>

                <p className="mt-4 text-lg text-walnut-light">
                    Enter your Order ID to check the latest status.
                </p>

                <form
                    action="/track-order"
                    method="get"
                    className="mt-10 flex flex-col gap-4 sm:flex-row"
                >
                    <input
                        name="id"
                        defaultValue={id ?? ""}
                        placeholder="Enter Order ID"
                        className="flex-1 rounded-2xl border border-sage/30 bg-white px-5 py-4 outline-none transition focus:border-sage"
                    />

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sage px-6 py-4 font-semibold text-offwhite transition hover:bg-sage-dark"
                    >
                        <Search className="h-5 w-5" />
                        Track
                    </button>
                </form>

                <RecentOrdersList currentId={id} />

                {!id && (
                    <div className="mt-10 rounded-3xl bg-offwhite p-10 text-center shadow-soft">
                        <p className="text-walnut-light">
                            No recent orders found. You can also search using an
                            Order ID above.
                        </p>

                        <Link
                            href="/menu"
                            className="mt-6 inline-flex items-center justify-center rounded-full bg-sage px-6 py-3 font-semibold text-offwhite transition hover:bg-sage-dark"
                        >
                            Back to Menu
                        </Link>
                    </div>
                )}

                {id && !order && (
                    <div className="mt-10 rounded-3xl bg-offwhite p-10 text-center shadow-soft">
                        <h2 className="font-display text-2xl font-semibold text-walnut">
                            Order Not Found
                        </h2>

                        <p className="mt-3 text-walnut-light">
                            We couldn't find an order with that ID.
                        </p>
                    </div>
                )}

                {order && (
                    <div className="mt-10 space-y-8">

                        <div className="rounded-3xl bg-offwhite p-8 shadow-soft">
                            <h2 className="font-display text-2xl font-semibold text-walnut">
                                Order Information
                            </h2>

                            <div className="mt-6 grid gap-6 md:grid-cols-2">

                                <div>
                                    <p className="text-sm text-walnut-light">
                                        Customer
                                    </p>

                                    <p className="font-medium">
                                        {order.customer_name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-walnut-light">
                                        Phone
                                    </p>

                                    <p>{order.phone}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-walnut-light">
                                        Address
                                    </p>

                                    <p>{order.address}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-walnut-light">
                                        Payment
                                    </p>

                                    <p>
                                        {order.payment_method.replaceAll("_", " ")}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-walnut-light">
                                        Status
                                    </p>

                                    <span className="inline-block rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white capitalize">
                                        {order.status}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-sm text-walnut-light">
                                        Total
                                    </p>

                                    <p className="font-semibold">
                                        Rs. {Number(order.total).toFixed(0)}
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="rounded-3xl bg-offwhite p-8 shadow-soft">

                            <h2 className="font-display text-2xl font-semibold text-walnut">
                                Ordered Items
                            </h2>

                            <div className="mt-6 space-y-4">

                                {order.order_items.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-2xl border border-cream p-4"
                                    >
                                        <div>
                                            <h3 className="font-medium text-walnut">
                                                {item.dish_name}
                                            </h3>

                                            <p className="text-sm text-walnut-light">
                                                {item.variant_name}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p>
                                                Qty: {item.quantity}
                                            </p>

                                            <p className="font-semibold">
                                                Rs. {Number(item.line_total).toFixed(0)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                            </div>

                        </div>
                    </div>
                )}

                <div className="mt-12">
                    <Link
                        href="/"
                        className="font-semibold text-sage hover:underline"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}