"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

type UnavailableItem = {
    id: string;
    variantId: string;
    name: string;
};

type Props = {
    items: UnavailableItem[];

    onRemoveItem: (
        id: string,
        variantId: string
    ) => void;

    onRemoveAll: () => void;
};

export default function UnavailableItemsBanner({
    items,
    onRemoveItem,
    onRemoveAll,
}: Props) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
                <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-red-600" />

                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-700">
                        Some dishes are unavailable
                    </h3>

                    <p className="mt-1 text-sm text-red-600">
                        These dishes are not available for the current meal.
                        Remove them to continue checkout.
                    </p>

                    <div className="mt-5 space-y-3">
                        {items.map((item) => (
                            <div
                                key={`${item.id}-${item.variantId}`}
                                className="flex items-center justify-between rounded-xl border border-red-200 bg-white p-3"
                            >
                                <span className="font-medium text-walnut">
                                    {item.name}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemoveItem(
                                            item.id,
                                            item.variantId
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onRemoveAll}
                        className="mt-5 w-full rounded-xl bg-red-700 py-3 font-semibold text-white transition hover:bg-red-800"
                    >
                        Remove All Unavailable Items
                    </button>
                </div>
            </div>
        </div>
    );
}