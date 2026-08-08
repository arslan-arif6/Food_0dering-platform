const STORAGE_KEY = "kitchenhub_recent_orders";
const MAX_RECENT_ORDERS = 5;

export type RecentOrder = {
    id: string;
    phone: string;
};

function readRecentOrders(): RecentOrder[] {
    if (typeof window === "undefined") return [];

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (item): item is RecentOrder =>
                typeof item === "object" &&
                item !== null &&
                typeof item.id === "string" &&
                typeof item.phone === "string"
        );
    } catch {
        return [];
    }
}

export function saveRecentOrderId(orderId: string, phone: string): void {
    if (typeof window === "undefined") return;

    const normalizedPhone = phone.replace(/\D/g, "");
    if (!orderId || normalizedPhone.length < 10) return;

    try {
        const existing = readRecentOrders().filter((item) => item.id !== orderId);
        const updated = [{ id: orderId, phone: normalizedPhone }, ...existing].slice(0, MAX_RECENT_ORDERS);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // LocalStorage fallback/swallow
    }
}

export function getMostRecentOrder(): RecentOrder | null {
    const orders = readRecentOrders();
    return orders.length > 0 ? orders[0] : null;
}

export function getRecentOrders(): RecentOrder[] {
    return readRecentOrders();
}