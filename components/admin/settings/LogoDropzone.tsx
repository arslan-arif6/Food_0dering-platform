"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

type LogoDropzoneProps = {
    value: File | null | undefined;
    onChange: (file: File | undefined) => void;
    error?: string;
    disabled?: boolean;
    existingLogoUrl?: string | null;
};

// Deliberately separate from ImageDropzone (dish images) — different
// UX (small preview + replace button, not a full drop area) and that
// component hardcodes dish-specific ids/copy we don't want to touch.
export default function LogoDropzone({
    value,
    onChange,
    error,
    disabled = false,
    existingLogoUrl,
}: LogoDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!value) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(value);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [value]);

    function handleFiles(fileList: FileList | null) {
        if (disabled || !fileList || fileList.length === 0) return;
        onChange(fileList[0]);
    }

    const displayUrl = previewUrl ?? existingLogoUrl ?? null;

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFiles(e.target.files)}
                disabled={disabled}
                className="sr-only"
                id="restaurant-logo-input"
                aria-label="Restaurant logo"
                aria-invalid={error ? "true" : undefined}
            />

            <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-walnut/10 bg-cream">
                    {displayUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={displayUrl}
                            alt="Restaurant logo"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ImagePlus
                            className="h-7 w-7 text-walnut-light"
                            strokeWidth={1.75}
                        />
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                    className="rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-walnut transition hover:opacity-80 disabled:opacity-60"
                >
                    {displayUrl ? "Replace Logo" : "Upload Logo"}
                </button>
            </div>

            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}