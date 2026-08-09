export default function AdminLoading() {
    return (
        <div
            className="min-h-[60vh] animate-pulse"
            role="status"
            aria-label="Loading admin page"
        >
            <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                    <div className="h-8 w-40 rounded-lg bg-[#e8dcc8]" />
                    <div className="mt-3 h-4 w-64 rounded-md bg-[#eee7dc]" />
                </div>

                <div className="hidden h-10 w-28 rounded-lg bg-[#eee7dc] sm:block" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <div className="h-32 rounded-2xl bg-[#eee7dc]" />
                <div className="h-32 rounded-2xl bg-[#eee7dc]" />
                <div className="h-32 rounded-2xl bg-[#eee7dc]" />
            </div>

            <div className="mt-6 rounded-2xl bg-[#eee7dc] p-5">
                <div className="h-5 w-36 rounded-md bg-[#e8dcc8]" />

                <div className="mt-6 space-y-4">
                    <div className="h-12 rounded-xl bg-[#f4efe7]" />
                    <div className="h-12 rounded-xl bg-[#f4efe7]" />
                    <div className="h-12 rounded-xl bg-[#f4efe7]" />
                    <div className="h-12 rounded-xl bg-[#f4efe7]" />
                </div>
            </div>
        </div>
    );
}