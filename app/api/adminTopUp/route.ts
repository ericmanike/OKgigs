import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is admin
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { userId, amount } = await req.json();

        if (!userId || !amount) {
            return NextResponse.json({ message: "User ID and amount are required" }, { status: 400 });
        }

        if (amount <= 0) {
            return NextResponse.json({ message: "Amount must be greater than 0" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Atomically update user's wallet balance
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { walletBalance: amount } },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "Failed to update user balance" }, { status: 500 });
        }

        const reference = `admin_topup_${Date.now()}_${updatedUser._id}`;
        
        await Transaction.create({
            user: updatedUser._id,
            transactionType: 'credit',
            type: 'topup',
            amount: amount,
            reference: reference,
            description: `Admin wallet top-up of GH₵${amount}`,
            status: 'success'
        });

        console.log(`Admin ${session.user.email} added ${amount} to ${updatedUser.email}'s wallet. New balance: ${updatedUser.walletBalance}`);

        return NextResponse.json({
            message: "Balance topped up successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                walletBalance: updatedUser.walletBalance
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Admin top up error:", error);
        return NextResponse.json({ message: "Error topping up user balance" }, { status: 500 });
    }
}
