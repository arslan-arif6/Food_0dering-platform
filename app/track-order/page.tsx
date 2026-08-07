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

            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
                <h1 className="font-display text-4xl font-bold leading-tight text-walnut sm:text-5xl">
                    Track Your Order
                </h1>

                <p className="mt-4 text-[15px] leading-7 text-walnut-light sm:text-lg">
                    Enter your Order ID to check the latest status.
                </p>

                <form
                    action="/track-order"
                    method="get"
                    className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
                >
                    <input
                        name="id"
                        defaultValue={id ?? ""}
                        placeholder="Enter Order ID"
                        className="min-h-14 flex-1 rounded-2xl border border-sage/30 bg-white px-5 py-4 outline-none transition focus:border-sage"
                    />

                    <button
                        type="submit"
                        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-sage px-6 py-4 font-semibold text-offwhite transition hover:bg-sage-dark"
                    >
                        <Search className="h-5 w-5" />
                        Track
                    </button>
                </form>

                <RecentOrdersList currentId={id} />

                {!id && (
                    <div className="mt-8 rounded-3xl bg-offwhite p-5 text-center shadow-soft sm:mt-10 sm:p-10">
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
                    <div className="mt-8 rounded-3xl bg-offwhite p-5 text-center shadow-soft sm:mt-10 sm:p-10">
                        <h2 className="font-display text-2xl font-semibold text-walnut">
                            Order Not Found
                        </h2>

                        <p className="mt-3 text-walnut-light">
                            We couldn&apos;t find an order with that ID.
                        </p>
                    </div>
                )}

                {order && (
                    <div className="mt-10 space-y-8">

                        <div className="rounded-3xl bg-offwhite p-5 shadow-soft sm:p-8">
                            <h2 className="font-display text-2xl font-semibold text-walnut">
                                Order Information
                            </h2>

                            <div className="mt-6 grid gap-5 md:grid-cols-2 md:gap-6">

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

                        <div className="rounded-3xl bg-offwhite p-5 shadow-soft sm:p-8">

                            <h2 className="font-display text-2xl font-semibold text-walnut">
                                Ordered Items
                            </h2>

                            <div className="mt-6 space-y-4">

                                {order.order_items.map((item: {
                                    id: string;
                                    dish_name: string;
                                    variant_name: string;
                                    quantity: number;
                                    line_total: number;
                                }) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between gap-3 rounded-2xl border border-cream p-4"
                                    >
                                        <div className="min-w-0">
                                            <h3 className="font-medium text-walnut">
                                                {item.dish_name}
                                            </h3>

                                            <p className="text-sm text-walnut-light">
                                                {item.variant_name}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-right">
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
