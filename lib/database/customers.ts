import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CustomerSummary = {
    phone: string;
    customerName: string;
    addresses: string[];
    totalOrders: number;
    totalSpent: number;
    lastOrderAt: string;
    firstOrderAt: string;
};

export type CustomerOrderHistoryItem = {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    itemCount: number;
};

export type CustomerDetail = CustomerSummary & {
    orders: CustomerOrderHistoryItem[];
};

type OrderAggregateRow = {
    id: string;
    phone: string;
    customer_name: string;
    address: string;
    total: string;
    status: string;
    created_at: string;
    order_items: { quantity: number }[] | null;
};

const CUSTOMER_ORDER_SELECT = `
    id,
    phone,
    customer_name,
    address,
    total,
    status,
    created_at,
    order_items ( quantity )
`;

// Groups raw order rows by phone number into per-customer aggregates.
// Phone number is the identity key since there is no customers table
// and checkout is guest-only (no login).
function buildCustomerMap(
    rows: OrderAggregateRow[]
): Map<string, CustomerDetail> {
    const map = new Map<string, CustomerDetail>();

    for (const row of rows) {
        const total = Number(row.total);
        const itemCount = (row.order_items ?? []).reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const orderEntry: CustomerOrderHistoryItem = {
            id: row.id,
            status: row.status,
            total,
            createdAt: row.created_at,
            itemCount,
        };

        const existing = map.get(row.phone);

        if (!existing) {
            map.set(row.phone, {
                phone: row.phone,
                customerName: row.customer_name,
                addresses: [row.address],
                totalOrders: 1,
                totalSpent: total,
                lastOrderAt: row.created_at,
                firstOrderAt: row.created_at,
                orders: [orderEntry],
            });
            continue;
        }

        existing.totalOrders += 1;
        existing.totalSpent += total;
        existing.orders.push(orderEntry);

        if (!existing.addresses.includes(row.address)) {
            existing.addresses.push(row.address);
        }

        // Most recent order's name wins, in case a repeat customer
        // typed their name slightly differently on a later order.
        if (row.created_at > existing.lastOrderAt) {
            existing.lastOrderAt = row.created_at;
            existing.customerName = row.customer_name;
        }

        if (row.created_at < existing.firstOrderAt) {
            existing.firstOrderAt = row.created_at;
        }
    }

    return map;
}

// Admin-facing: one row per unique phone number, sorted by most recent order.
export async function getCustomers(): Promise<CustomerSummary[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("orders")
        .select(CUSTOMER_ORDER_SELECT)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    const customerMap = buildCustomerMap(data as OrderAggregateRow[]);

    return Array.from(customerMap.values())
        .map(({ orders, ...summary }) => summary)
        .sort((a, b) => (a.lastOrderAt < b.lastOrderAt ? 1 : -1));
}

// Admin-facing: full detail + order history for one customer, looked
// up by phone number.
export async function getCustomerByPhone(
    phone: string
): Promise<CustomerDetail | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("orders")
        .select(CUSTOMER_ORDER_SELECT)
        .eq("phone", phone)
        .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
        if (error) console.error(error);
        return null;
    }

    const customerMap = buildCustomerMap(data as OrderAggregateRow[]);

    return customerMap.get(phone) ?? null;
}