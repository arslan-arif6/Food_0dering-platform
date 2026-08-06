"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    id: string;
    error?: string;
};

// Reusable labeled text input for admin forms. Forwards its ref so
// React Hook Form's register() can attach directly to the input.
const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ label, id, error, className = "", type, ...rest }, ref) => {
        const [visible, setVisible] = useState(false);
        const isPassword = type === "password";
        const resolvedType = isPassword ? (visible ? "text" : "password") : type;

        return (
            <div>
                <label
                    htmlFor={id}
                    className="mb-2 block text-sm font-medium text-walnut"
                >
                    {label}
                </label>
                <div className="relative">
                    <input
                        id={id}
                        ref={ref}
                        type={resolvedType}
                        aria-invalid={error ? "true" : undefined}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className={`w-full rounded-xl border bg-offwhite px-4 py-3 text-[15px] text-walnut outline-none transition focus:border-sage ${error ? "border-red-400" : "border-walnut/15"
                            } ${isPassword ? "pr-11" : ""} ${className}`}
                        {...rest}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setVisible((v) => !v)}
                            tabIndex={-1}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-walnut-light hover:text-walnut"
                        >
                            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    )}
                </div>
                {error && (
                    <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

TextField.displayName = "TextField";

export default TextField;