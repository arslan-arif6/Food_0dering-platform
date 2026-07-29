type Props = {
    points: { date: string; revenue: number }[];
};

export default function RevenueTrendChart({ points }: Props) {
    if (points.length === 0) {
        return (
            <p className="text-sm text-walnut-light">
                No revenue in this period yet.
            </p>
        );
    }

    const max = Math.max(...points.map((point) => point.revenue), 1);

    return (
        <div className="flex h-48 items-end gap-1.5 overflow-x-auto">
            {points.map((point) => (
                <div
                    key={point.date}
                    className="flex h-full min-w-[28px] flex-1 flex-col items-center justify-end gap-2"
                    title={`${point.date}: Rs. ${point.revenue.toFixed(0)}`}
                >
                    <div
                        className="w-full rounded-t-md bg-sage"
                        style={{
                            height: `${Math.max((point.revenue / max) * 100, 3)}%`,
                        }}
                    />
                    <span className="text-[10px] text-walnut-light">
                        {point.date.slice(5)}
                    </span>
                </div>
            ))}
        </div>
    );
}