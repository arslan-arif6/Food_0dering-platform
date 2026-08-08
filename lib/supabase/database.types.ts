// Hand-written to match the current Supabase schema.
// Do NOT generate with `supabase gen types`.
// KitchenHub Version.

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    created_at?: string;
                };
            };

            dishes: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    image: string | null;
                    featured: boolean | null;
                    available: boolean;
                    sold_out: boolean;
                    created_at: string;
                    updated_at: string;
                };

                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    image?: string | null;
                    featured?: boolean | null;
                    available?: boolean;
                    sold_out?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };

                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    image?: string | null;
                    featured?: boolean | null;
                    available?: boolean;
                    sold_out?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };

            dish_variants: {
                Row: {
                    id: string;
                    dish_id: string;
                    name: string;
                    price: string;
                    created_at: string;
                };

                Insert: {
                    id?: string;
                    dish_id: string;
                    name: string;
                    price: number;
                    created_at?: string;
                };

                Update: {
                    id?: string;
                    dish_id?: string;
                    name?: string;
                    price?: number;
                    created_at?: string;
                };
            };

            dish_categories: {
                Row: {
                    dish_id: string;
                    category_id: string;
                };

                Insert: {
                    dish_id: string;
                    category_id: string;
                };

                Update: {
                    dish_id?: string;
                    category_id?: string;
                };
            };

            orders: {
                Row: {
                    id: string;
                    customer_id: string;
                    customer_name: string;
                    phone: string;
                    address: string;
                    notes: string | null;
                    admin_notes: string | null;
                    payment_method: string;
                    status: string;
                    subtotal: string;
                    delivery_fee: string;
                    total: string;
                    created_at: string;
                    updated_at: string;
                };

                Insert: {
                    id?: string;
                    customer_id: string;
                    customer_name: string;
                    phone: string;
                    address: string;
                    notes?: string | null;
                    admin_notes?: string | null;
                    payment_method: string;
                    status?: string;
                    subtotal: number;
                    delivery_fee?: number;
                    total: number;
                    created_at?: string;
                    updated_at?: string;
                };

                Update: {
                    id?: string;
                    customer_id?: string;
                    customer_name?: string;
                    phone?: string;
                    address?: string;
                    notes?: string | null;
                    admin_notes?: string | null;
                    payment_method?: string;
                    status?: string;
                    subtotal?: number;
                    delivery_fee?: number;
                    total?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };

            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    dish_id: string | null;
                    dish_variant_id: string | null;
                    dish_name: string;
                    variant_name: string;
                    unit_price: string;
                    quantity: number;
                    line_total: string;
                };

                Insert: {
                    id?: string;
                    order_id: string;
                    dish_id?: string | null;
                    dish_variant_id?: string | null;
                    dish_name: string;
                    variant_name: string;
                    unit_price: number;
                    quantity: number;
                    line_total: number;
                };

                Update: {
                    id?: string;
                    order_id?: string;
                    dish_id?: string | null;
                    dish_variant_id?: string | null;
                    dish_name?: string;
                    variant_name?: string;
                    unit_price?: number;
                    quantity?: number;
                    line_total?: number;
                };
            };

            admins: {
                Row: {
                    id: string;
                    user_id: string;
                    email: string;
                    full_name: string | null;
                    role: "owner" | "admin" | string;
                    is_active: boolean;
                    created_at: string;
                };

                Insert: {
                    id?: string;
                    user_id: string;
                    email: string;
                    full_name?: string | null;
                    role?: "owner" | "admin" | string;
                    is_active?: boolean;
                    created_at?: string;
                };

                Update: {
                    id?: string;
                    user_id?: string;
                    email?: string;
                    full_name?: string | null;
                    role?: "owner" | "admin" | string;
                    is_active?: boolean;
                    created_at?: string;
                };
            };

            restaurant_settings: {
                Row: {
                    id: number;
                    restaurant_name: string;
                    description: string;
                    phone: string;
                    whatsapp: string;
                    email: string;
                    address: string;
                    logo_url: string | null;
                    is_active: boolean;
                    delivery_fee: number;
                    minimum_order: number;
                    estimated_delivery_time: string;
                    free_delivery_threshold: number | null;
                    service_areas: string[];
                    payment_cod: boolean;
                    payment_jazzcash: boolean;
                    payment_easypaisa: boolean;
                    breakfast_start: string;
                    breakfast_end: string;
                    lunch_start: string;
                    lunch_end: string;
                    dinner_start: string;
                    dinner_end: string;
                    grace_period_minutes: number;
                    facebook_url: string | null;
                    instagram_url: string | null;
                    google_maps_url: string | null;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    restaurant_name?: string;
                    description?: string;
                    phone?: string;
                    whatsapp?: string;
                    email?: string;
                    address?: string;
                    logo_url?: string | null;
                    is_active?: boolean;
                    delivery_fee?: number;
                    minimum_order?: number;
                    estimated_delivery_time?: string;
                    free_delivery_threshold?: number | null;
                    service_areas?: string[];
                    payment_cod?: boolean;
                    payment_jazzcash?: boolean;
                    payment_easypaisa?: boolean;
                    breakfast_start?: string;
                    breakfast_end?: string;
                    lunch_start?: string;
                    lunch_end?: string;
                    dinner_start?: string;
                    dinner_end?: string;
                    grace_period_minutes?: number;
                    facebook_url?: string | null;
                    instagram_url?: string | null;
                    google_maps_url?: string | null;
                    updated_at?: string;
                };
                Update: {
                    id?: number;
                    restaurant_name?: string;
                    description?: string;
                    phone?: string;
                    whatsapp?: string;
                    email?: string;
                    address?: string;
                    logo_url?: string | null;
                    is_active?: boolean;
                    delivery_fee?: number;
                    minimum_order?: number;
                    estimated_delivery_time?: string;
                    free_delivery_threshold?: number | null;
                    service_areas?: string[];
                    payment_cod?: boolean;
                    payment_jazzcash?: boolean;
                    payment_easypaisa?: boolean;
                    breakfast_start?: string;
                    breakfast_end?: string;
                    lunch_start?: string;
                    lunch_end?: string;
                    dinner_start?: string;
                    dinner_end?: string;
                    grace_period_minutes?: number;
                    facebook_url?: string | null;
                    instagram_url?: string | null;
                    google_maps_url?: string | null;
                    updated_at?: string;
                };
            };
        };


        Views: Record<string, never>;

        Functions: Record<string, never>;

        Enums: Record<string, never>;

        CompositeTypes: Record<string, never>;
    };
};
export type Tables<
    T extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T]["Row"];

export type TablesInsert<
    T extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<
    T extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][T]["Update"];
