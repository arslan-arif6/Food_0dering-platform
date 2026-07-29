type BarListItem = {
    id: string;
    label: string;
    value: number;
    valueLabel: string;
};

type Props = {
    items: BarListItem[];
    emptyMessage: string;
};

export default function BarList({ items, emptyMessage }: Props) {
    if (items.length === 0) {
        return <p className="text-sm text-walnut-light">{emptyMessage}</p>;
    }

    const max = Math.max(...items.map((item) => item.value), 1);

    return (
        <div className="flex flex-col gap-4">
            {items.map((item) => (
                <div key={item.id} className="min-w-0">
                    <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                        <span className="min-w-0 truncate font-medium text-walnut">
                            {item.label}
                        </span>
                        <span className="shrink-0 text-walnut-light">{item.valueLabel}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-cream">
                        <div
                            className="h-full rounded-full bg-sage"
                            style={{ width: `${(item.value / max) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}