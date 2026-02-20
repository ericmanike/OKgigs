import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Setting from "@/models/Setting";

export async function GET() {
  try {
    await dbConnect();
    const doc = await Setting.findOne({ key: "ordersClosed" }).select("value");
    const ordersClosed = Boolean(doc?.value);
    return NextResponse.json({ ordersClosed });
  } catch (error) {
    console.error("orders-closed GET error:", error);
    return NextResponse.json({ ordersClosed: false }, { status: 200 });
  }
}

