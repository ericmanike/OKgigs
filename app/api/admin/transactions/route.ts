import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const role = session?.user?.role;
        if (!session || (role !== 'admin' && role !== 'moderator')) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        
        // Fetch latest 500 transactions to prevent massive payload issues
        const transactions = await Transaction.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(500);

        return NextResponse.json(transactions);
    } catch (error) {
        console.error("Admin transactions error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
