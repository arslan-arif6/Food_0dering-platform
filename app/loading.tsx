export default function Loading() {
    return (
        <main
            className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#faf8f3]"
            aria-label="Loading"
            role="status"
        >
            <div className="flex flex-col items-center justify-center px-6 text-center">
                {/* Animated loader */}
                <div className="relative mb-7 flex h-[92px] w-[92px] items-center justify-center">
                    {/* Outer rotating ring */}
                    <div
                        className="absolute inset-0 animate-spin rounded-full border-[2px] border-[#e8dcc8] border-t-[#7a9e7e]"
                        style={{ animationDuration: "1.4s" }}
                        aria-hidden="true"
                    />

                    {/* Second orbit */}
                    <div
                        className="absolute inset-[11px] animate-spin rounded-full border-[1.5px] border-[#7a9e7e]/15 border-b-[#7a9e7e]/70"
                        style={{
                            animationDuration: "1s",
                            animationDirection: "reverse",
                        }}
                        aria-hidden="true"
                    />

                    {/* Orbiting dot */}
                    <div
                        className="absolute inset-[11px] animate-spin"
                        style={{ animationDuration: "1s" }}
                        aria-hidden="true"
                    >
                        <span className="absolute -top-[3px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[#7a9e7e] shadow-[0_0_12px_rgba(122,158,126,0.45)]" />
                    </div>

                    {/* Center */}
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#e8dcc8] shadow-sm">
                        <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 text-[#7a9e7e]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M4 10h16" />
                            <path d="M6 10c.5-3.2 2.9-5 6-5s5.5 1.8 6 5" />
                            <path d="M7 13h10" />
                            <path d="M8 13v2.5a4 4 0 0 0 8 0V13" />
                            <path d="M5 18h14" />
                        </svg>
                    </div>
                </div>

                <p
                    className="text-xl font-semibold tracking-tight text-[#4a3f35]"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                >
                    Home Made Food
                </p>

                {/* Animated dots */}
                <div
                    className="mt-4 flex items-center gap-1.5"
                    aria-hidden="true"
                >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7a9e7e] [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7a9e7e] [animation-delay:180ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7a9e7e] [animation-delay:360ms]" />
                </div>

                <p className="mt-3 text-sm text-[#7a6b5d]">
                    Preparing your page...
                </p>
            </div>
        </main>
    );
}