"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const SHOW_DELAY_MS = 120;

export default function NavigationLoader() {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setIsLoading(false);

        if (showTimerRef.current) {
            clearTimeout(showTimerRef.current);
            showTimerRef.current = null;
        }
    }, [pathname]);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const target = event.target;

            if (!(target instanceof Element)) return;

            const link = target.closest("a[href]");

            if (!(link instanceof HTMLAnchorElement)) return;

            if (
                link.target === "_blank" ||
                link.hasAttribute("download") ||
                link.getAttribute("rel")?.includes("external")
            ) {
                return;
            }

            const url = new URL(link.href, window.location.href);

            if (url.origin !== window.location.origin) return;

            if (url.pathname === window.location.pathname) return;

            if (showTimerRef.current) {
                clearTimeout(showTimerRef.current);
            }

            showTimerRef.current = setTimeout(() => {
                setIsLoading(true);
                showTimerRef.current = null;
            }, SHOW_DELAY_MS);
        };

        document.addEventListener("click", handleClick, true);

        return () => {
            document.removeEventListener("click", handleClick, true);

            if (showTimerRef.current) {
                clearTimeout(showTimerRef.current);
                showTimerRef.current = null;
            }
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Loading page"
            className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
        >
            <div className="absolute inset-0 bg-[#faf8f3]/20 backdrop-blur-[1px]" />

            <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-[#e8dcc8]/70 bg-white/95 shadow-[0_12px_40px_rgba(62,49,40,0.13)]">
                {/* Rotating orbit */}
                <div
                    className="absolute inset-[13px] animate-spin rounded-full border-[1.5px] border-[#7a9e7e]/20 border-t-[#7a9e7e]"
                    style={{ animationDuration: "1.1s" }}
                    aria-hidden="true"
                />

                {/* Orbiting dot */}
                <div
                    className="absolute inset-[13px] animate-spin"
                    style={{ animationDuration: "1.1s" }}
                    aria-hidden="true"
                >
                    <span className="absolute -top-[3px] left-1/2 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#7a9e7e] shadow-[0_0_8px_rgba(122,158,126,0.45)]" />
                </div>

                {/* Center mark */}
                <div
                    className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#e8dcc8]"
                    aria-hidden="true"
                >
                    <div className="h-2.5 w-2.5 rounded-full bg-[#7a9e7e] shadow-[0_0_10px_rgba(122,158,126,0.35)]" />
                </div>
            </div>
        </div>
    );
}