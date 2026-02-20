import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id).select('phone');

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ phone: user.phone || null });
    } catch (error) {
        console.error("Error fetching phone:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { phone } = await req.json();

        // Normalize phone: trim whitespace, or set to null if empty
        const normalizedPhone = phone && typeof phone === 'string' ? phone.trim() : null;
        
        // Basic validation - only validate if phone is provided
        if (normalizedPhone && normalizedPhone.length > 0 && normalizedPhone.length < 9) {
            return NextResponse.json({ message: "Phone number must be at least 9 characters" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findByIdAndUpdate(
            session.user.id,
            { phone: normalizedPhone || null },
            { new: true }
        ).select('phone');

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ phone: user.phone || null, message: "Phone number updated successfully" });
    } catch (error) {
        console.error("Error updating phone:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
