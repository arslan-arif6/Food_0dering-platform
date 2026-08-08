"use client";

export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Critical Error</h2>
                    <p className="text-gray-500 mb-6 max-w-md">
                        Something went critically wrong.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}