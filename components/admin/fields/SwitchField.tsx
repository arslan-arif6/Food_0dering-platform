type SwitchFieldProps = {
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

// Reusable toggle switch with label/description — for any admin form
// needing an on/off setting (Available, Featured, and future flags
// like an Order's "notify customer" or a Category's "active" state).
// Toggling here is local UI state only; nothing is persisted.
export default function SwitchField({
    id,
    label,
    description,
    checked,
    onChange,
}: SwitchFieldProps) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-walnut/10 px-4 py-3.5">
            <div>
                <label htmlFor={id} className="text-sm font-medium text-walnut">
                    {label}
                </label>
                {description && (
                    <p className="mt-0.5 text-xs text-walnut-light">{description}</p>
                )}
            </div>

            <button
                type="button"
                id={id}
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/40 focus-visible:ring-offset-2 ${checked
                    ? "bg-sage shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)]"
                    : "bg-walnut/15"
                    }`}
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-offwhite shadow-md transition-transform duration-200 ease-out ${checked ? "translate-x-6 scale-105" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}