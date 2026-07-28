"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

// Generic confirmation dialog — not wired to any delete action yet.
// Intended to be reused for Delete Dish, Delete Category, Delete Order,
// Delete Customer, etc. by passing the relevant copy and handlers.
export default function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    useEffect(() => {
        if (!open) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onCancel();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div
            role="presentation"
            onClick={onCancel}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-walnut/40 p-5 backdrop-blur-sm"
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-3xl bg-offwhite p-6 shadow-soft-lg"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertTriangle className="h-6 w-6" strokeWidth={1.9} />
                </div>

                <h3
                    id="confirm-dialog-title"
                    className="mt-5 font-display text-lg font-semibold text-walnut"
                >
                    {title}
                </h3>

                <p
                    id="confirm-dialog-description"
                    className="mt-2 text-[15px] leading-relaxed text-walnut-light"
                >
                    {description}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-full px-5 py-2.5 font-semibold text-walnut transition hover:bg-cream"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-full bg-red-600 px-5 py-2.5 font-semibold text-offwhite transition hover:bg-red-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}