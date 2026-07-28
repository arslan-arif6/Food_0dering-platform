import { forwardRef, type TextareaHTMLAttributes } from "react";

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    id: string;
    error?: string;
};

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
    ({ label, id, error, className = "", ...rest }, ref) => {
        return (
            <div>
                <label
                    htmlFor={id}
                    className="mb-2 block text-sm font-medium text-walnut"
                >
                    {label}
                </label>
                <textarea
                    id={id}
                    ref={ref}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`w-full resize-none rounded-xl border bg-offwhite px-4 py-3 text-[15px] text-walnut outline-none transition focus:border-sage ${error ? "border-red-400" : "border-walnut/15"
                        } ${className}`}
                    {...rest}
                />
                {error && (
                    <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;