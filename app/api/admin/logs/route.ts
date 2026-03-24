import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import SystemLog from "@/models/SystemLog";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const url = req.nextUrl;
        const level = url.searchParams.get("level");
        const category = url.searchParams.get("category");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500);

        const filter: any = {};
        if (level) filter.level = level;
        if (category) filter.category = category;

        const logs = await SystemLog.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        const serialized = logs.map((log: any) => ({
            _id: String(log._id),
            level: log.level,
            category: log.category,
            message: log.message,
            meta: log.meta,
            user: log.user ? String(log.user) : null,
            ip: log.ip,
            createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : String(log.createdAt),
        }));

        return NextResponse.json(serialized);
    } catch (error) {
        console.error("Error fetching system logs:", error);
        return NextResponse.json({ message: "Error fetching logs" }, { status: 500 });
    }
}
