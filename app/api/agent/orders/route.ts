import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const isAgent = session.user.role === "agent" || session.user.role === "admin";
        if (!isAgent) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        const orders = await Order.find({ agent: session.user.id })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        const serialized = orders.map((o: any) => ({
            _id: String(o._id),
            transaction_id: o.transaction_id,
            bundleName: o.bundleName,
            network: o.network,
            price: o.price,
            originalPrice: o.originalPrice,
            phoneNumber: o.phoneNumber,
            status: o.status,
            createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : String(o.createdAt),
        }));

        return NextResponse.json(serialized);
    } catch (error) {
        console.error("Error fetching agent orders:", error);
        return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
    }
}
