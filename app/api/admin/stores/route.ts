import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import AgentStore from "@/models/AgentStore";
import User from "@/models/User"; // Ensure User model is loaded for populate

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        // Load User model to ensure it's registered for population
        if (!User) {
            console.log("User model not found, importing...");
        }

        const stores = await AgentStore.find()
            .populate('user', 'name email image')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(stores);
    } catch (error: any) {
        console.error("Error fetching agent stores:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
