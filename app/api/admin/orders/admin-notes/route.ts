import { NextResponse } from "next/server";

import { updateAdminNotes } from "@/lib/database/orders";

export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const orderId = body.orderId as string;
        const adminNotes = body.adminNotes as string;

        if (!orderId) {
            return NextResponse.json(
                {
                    error: "Order ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        await updateAdminNotes(
            orderId,
            adminNotes ?? ""
        );

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Unable to save admin notes.",
            },
            {
                status: 500,
            }
        );
    }
}