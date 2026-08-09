export default function AdminLoading() {
    return (
        <div
            className="min-h-[60vh]"
            role="status"
            aria-label="Loading admin page"
        >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                    <div className="h-8 w-40 animate-pulse rounded-lg bg-[#e8dcc8]" />
                    <div className="mt-3 h-4 w-64 animate-pulse rounded-md bg-[#eee7dc]" />
                </div>

                <div className="hidden h-10 w-28 animate-pulse rounded-lg bg-[#eee7dc] sm:block" />
            </div>

            {/* Cards */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <div className="h-32 animate-pulse rounded-2xl bg-[#eee7dc]" />
                <div
                    className="h-32 animate-pulse rounded-2xl bg-[#eee7dc]"
                    style={{ animationDelay: "100ms" }}
                />
                <div
                    className="h-32 animate-pulse rounded-2xl bg-[#eee7dc]"
                    style={{ animationDelay: "200ms" }}
                />
            </div>

            {/* Content */}
            <div className="mt-6 rounded-2xl bg-[#eee7dc] p-5">
                <div className="h-5 w-36 animate-pulse rounded-md bg-[#e8dcc8]" />

                <div className="mt-6 space-y-4">
                    <div className="h-12 animate-pulse rounded-xl bg-[#f4efe7]" />

                    <div
                        className="h-12 animate-pulse rounded-xl bg-[#f4efe7]"
                        style={{ animationDelay: "100ms" }}
                    />

                    <div
                        className="h-12 animate-pulse rounded-xl bg-[#f4efe7]"
                        style={{ animationDelay: "200ms" }}
                    />

                    <div
                        className="h-12 animate-pulse rounded-xl bg-[#f4efe7]"
                        style={{ animationDelay: "300ms" }}
                    />
                </div>
            </div>

            {/* Small loading indicator */}
            <div className="mt-7 flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7a9e7e]" />
                <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7a9e7e]"
                    style={{ animationDelay: "150ms" }}
                />
                <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7a9e7e]"
                    style={{ animationDelay: "300ms" }}
                />
            </div>
        </div>
    );
}