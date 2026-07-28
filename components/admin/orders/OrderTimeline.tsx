import type { OrderHistoryItem } from "@/lib/database/order-history";

type Props = {
    history: OrderHistoryItem[];
};

const STATUS_LABELS: Record<string, string> = {
    new: "New Order",
    preparing: "Preparing",
    ready: "Ready for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

function formatTimelineDate(date: string) {
    const eventDate = new Date(date);
    const today = new Date();

    const isToday =
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear();

    if (isToday) {
        return `Today, ${eventDate.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        })}`;
    }

    return eventDate.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
    }) +
        ", " +
        eventDate.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
}

export default function OrderTimeline({
    history,
}: Props) {
    return (
        <section className="rounded-3xl bg-offwhite p-6 shadow-soft">
            <h3 className="mb-6 text-xl font-semibold text-walnut">
                Order Timeline
            </h3>

            {history.length === 0 ? (
                <p className="text-walnut-light">
                    No timeline available yet.
                </p>
            ) : (
                <div className="space-y-6">
                    {history.map((event, index) => (
                        <div
                            key={event.id}
                            className="relative flex gap-4"
                        >
                            {index !== history.length - 1 && (
                                <div className="absolute left-[11px] top-6 h-full w-0.5 bg-cream" />
                            )}

                            <div className="relative z-10 mt-1 h-6 w-6 rounded-full bg-sage ring-4 ring-offwhite" />

                            <div className="flex-1">
                                <p className="font-semibold text-walnut">
                                    {STATUS_LABELS[event.status] ?? event.status}
                                </p>

                                <p className="mt-1 text-sm text-walnut-light">
                                    {formatTimelineDate(event.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}