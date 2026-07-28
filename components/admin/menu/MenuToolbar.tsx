import { Search } from "lucide-react";
import type { DatabaseCategory } from "@/lib/database/categories";

type MenuToolbarProps = {
    categories: DatabaseCategory[];
};

// Search input and category filter are presentational only for now —
// not wired to any filtering logic yet.
export default function MenuToolbar({ categories }: MenuToolbarProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut-light" />
                <input
                    type="text"
                    placeholder="Search dishes..."
                    aria-label="Search dishes"
                    className="w-full rounded-xl border border-walnut/15 bg-offwhite py-3 pl-11 pr-4 text-[15px] text-walnut outline-none transition focus:border-sage"
                />
            </div>

            <select
                aria-label="Filter by category"
                defaultValue=""
                className="rounded-xl border border-walnut/15 bg-offwhite px-4 py-3 text-[15px] text-walnut outline-none transition focus:border-sage sm:w-56"
            >
                <option value="">All Categories</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
}