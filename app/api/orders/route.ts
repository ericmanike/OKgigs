import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { network, bundleName, price, phoneNumber } = await req.json();

        if (!network || !bundleName || !price || !phoneNumber) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // In a real app, you would verify wallet balance here and deduct it
        // const user = await User.findById(session.user.id);
        // if (user.walletBalance < price) { ... }

        const order = await Order.create({
            user: session.user.id,
            network,
            bundleName,
            price,
            phoneNumber,
            status: 'pending', // Pending until processed
        });

        // Simulate processing
        setTimeout(async () => {
            try {
                await Order.findByIdAndUpdate(order._id, { status: 'completed' });
            } catch (e) {
                console.error("Error updating order status", e);
            }
        }, 5000); // 5 seconds processing

        return NextResponse.json({ message: "Order created successfully", order }, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ message: "Error simulating purchase" }, { status: 500 });
    }
}
