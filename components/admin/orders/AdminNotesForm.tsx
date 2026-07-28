"use client";

import { useState, useTransition } from "react";

type Props = {
    orderId: string;
    initialNotes: string;
};

export default function AdminNotesForm({
    orderId,
    initialNotes,
}: Props) {
    const [notes, setNotes] = useState(initialNotes);
    const [saved, setSaved] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function saveNotes() {
        setSaved(false);

        startTransition(async () => {
            const response = await fetch(
                "/api/admin/orders/admin-notes",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orderId,
                        adminNotes: notes,
                    }),
                }
            );

            if (response.ok) {
                setSaved(true);

                setTimeout(() => {
                    setSaved(false);
                }, 2000);
            }
        });
    }

    return (
        <div className="rounded-3xl bg-offwhite p-6 shadow-soft">
            <h3 className="mb-4 text-xl font-semibold text-walnut">
                Admin Internal Notes
            </h3>

            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                placeholder="Visible only to restaurant staff..."
                className="w-full rounded-2xl border border-cream bg-white p-4 outline-none transition focus:border-sage"
            />

            <div className="mt-4 flex items-center gap-4">
                <button
                    type="button"
                    onClick={saveNotes}
                    disabled={isPending}
                    className="rounded-full bg-sage px-6 py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                >
                    {isPending ? "Saving..." : "Save Notes"}
                </button>

                {saved && (
                    <span className="text-sm font-medium text-green-600">
                        ✓ Notes saved
                    </span>
                )}
            </div>
        </div>
    );
}