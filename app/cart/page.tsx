import { getRestaurantSettings } from "@/lib/database/settings";
import CartPageClient from "@/components/cart/CartPageClient";

export default async function CartPage() {
    const settings = await getRestaurantSettings();

    return <CartPageClient settings={settings} />;
}