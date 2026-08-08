"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("App error:", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong!</h2>
            <p className="text-gray-500 mb-6 max-w-md">
                An unexpected error occurred. Please try again.
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
                Try Again
            </button>
        </div>
    );
}