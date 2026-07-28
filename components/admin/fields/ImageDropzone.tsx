"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/validations/dish";

type ImageDropzoneProps = {
    value: File | null | undefined;
    onChange: (file: File | undefined) => void;
    error?: string;
    disabled?: boolean;
    existingImageUrl?: string;
};

// Fully working image dropzone: click to browse, drag & drop, preview,
// remove, replace, inline validation messages, and a disabled state
// while the form is submitting.
//
// When `existingImageUrl` is provided (Edit Dish) and no new file has
// been chosen yet, that existing image is shown with a Replace action.
// There is no "remove entirely" action for the existing image — the
// feature doesn't support leaving a dish with no image, only replacing
// it — so Remove only appears once a new file has actually been
// selected, and clicking it reverts back to showing the existing image
// (or the empty state, in Add Dish where there's no existing image).
export default function ImageDropzone({
    value,
    onChange,
    error,
    disabled = false,
    existingImageUrl,
}: ImageDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [newFilePreviewUrl, setNewFilePreviewUrl] = useState<string | null>(
        null
    );

    useEffect(() => {
        if (!value) {
            setNewFilePreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(value);
        setNewFilePreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [value]);

    function handleFiles(fileList: FileList | null) {
        if (disabled || !fileList || fileList.length === 0) return;
        onChange(fileList[0]);
    }

    function handleDrop(e: DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        handleFiles(e.dataTransfer.files);
    }

    function handleRemove() {
        if (disabled) return;
        onChange(undefined);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    const displayUrl = newFilePreviewUrl ?? existingImageUrl ?? null;
    const showingNewFile = Boolean(newFilePreviewUrl);

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={(e) => handleFiles(e.target.files)}
                disabled={disabled}
                className="sr-only"
                id="dish-image-input"
                aria-label="Dish image"
                aria-invalid={error ? "true" : undefined}
            />

            {displayUrl ? (
                <div className="relative overflow-hidden rounded-2xl border border-walnut/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={displayUrl}
                        alt="Dish preview"
                        className="h-56 w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-walnut/50 p-3 backdrop-blur-sm">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={disabled}
                            className="rounded-full bg-offwhite px-4 py-2 text-sm font-semibold text-walnut transition hover:bg-cream disabled:opacity-60"
                        >
                            Replace
                        </button>
                        {showingNewFile && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={disabled}
                                aria-label="Remove selected image"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-offwhite text-walnut transition hover:bg-cream disabled:opacity-60"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <label
                    htmlFor="dish-image-input"
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (!disabled) setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${disabled
                        ? "cursor-not-allowed border-walnut/10 bg-cream/20 opacity-60"
                        : `cursor-pointer ${isDragging
                            ? "border-sage bg-sage/10"
                            : "border-walnut/20 bg-cream/40 hover:bg-cream/60"
                        }`
                        } ${error ? "border-red-400" : ""}`}
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage/15 text-sage-dark">
                        <ImagePlus className="h-7 w-7" strokeWidth={1.75} />
                    </div>

                    <div>
                        <p className="font-medium text-walnut">
                            Drag and drop an image here
                        </p>
                        <p className="mt-1 text-sm text-walnut-light">
                            or click to browse — JPG, PNG, or WEBP, up to 5MB
                        </p>
                    </div>

                    <span className="mt-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-walnut">
                        Choose File
                    </span>
                </label>
            )}

            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
}