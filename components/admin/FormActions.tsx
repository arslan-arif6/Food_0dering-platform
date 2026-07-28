import { Loader2 } from "lucide-react";

type FormActionsProps = {
    cancelLabel?: string;
    saveLabel?: string;
    onCancel: () => void;
    loading?: boolean;
};

export default function FormActions({
    cancelLabel = "Cancel",
    saveLabel = "Save",
    onCancel,
    loading = false,
}: FormActionsProps) {
    return (
        <div className="flex justify-end gap-3 border-t border-walnut/10 pt-6">
            <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-full px-6 py-3 font-semibold text-walnut transition hover:bg-cream disabled:opacity-60"
            >
                {cancelLabel}
            </button>
            <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-sage px-6 py-3 font-semibold text-offwhite transition hover:bg-sage-dark disabled:opacity-60"
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Saving..." : saveLabel}
            </button>
        </div>
    );
}