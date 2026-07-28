// Guest order tracking helper — no accounts, no auth. Stores recent
// order ids in this browser's localStorage so the customer doesn't
// have to copy/paste an Order ID to check status after leaving the
// success page. Stored as an array (not just the latest id) per the
// plan to eventually show an "Order History" list without changing
// the storage format.
const STORAGE_KEY = "kitchenhub_recent_orders";
const MAX_RECENT_ORDERS = 5;

function readRecentOrderIds(): string[] {
    if (typeof window === "undefined") return [];

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((item): item is string => typeof item === "string");
    } catch {
        return [];
    }
}

// Called right after a successful order placement. Most-recent-first,
// deduplicated, capped at MAX_RECENT_ORDERS.
export function saveRecentOrderId(orderId: string): void {
    if (typeof window === "undefined") return;

    try {
        const existing = readRecentOrderIds().filter((id) => id !== orderId);
        const updated = [orderId, ...existing].slice(0, MAX_RECENT_ORDERS);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // localStorage can throw (private browsing, storage full, etc).
        // Tracking is a convenience feature — never worth failing
        // checkout over, so this is intentionally swallowed.
    }
}

export function getMostRecentOrderId(): string | null {
    const ids = readRecentOrderIds();
    return ids.length > 0 ? ids[0] : null;
}

// Not used yet, but kept here (not re-derived elsewhere) for a future
// guest "Order History" list — same storage format, no migration
// needed later.
export function getRecentOrderIds(): string[] {
    return readRecentOrderIds();
}