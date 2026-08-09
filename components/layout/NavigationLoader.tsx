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

            // Same-page anchors do not trigger a route transition.
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
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1.5px]" />

            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-black/5 bg-white/90 shadow-[0_8px_30px_rgba(62,49,40,0.14)]">
                <div
                    className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-walnut/15 border-t-walnut"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
}