import { getCustomers } from "@/lib/database/customers";
import PageHeader from "@/components/admin/PageHeader";
import CustomerDirectory from "@/components/admin/customers/CustomerDirectory";

export default async function AdminCustomersPage() {
    const customers = await getCustomers();

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Customers"
                description="Everyone who has placed an order, grouped by phone number."
            />

            <CustomerDirectory customers={customers} />
        </div>
    );
}