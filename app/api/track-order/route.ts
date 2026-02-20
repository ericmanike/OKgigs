import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const transactionId = req.nextUrl.searchParams.get("transaction_id")?.trim();
    if (!transactionId) {
      return NextResponse.json(
        { found: false, error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const order = await Order.findOne({ transaction_id: transactionId })
      .select("transaction_id bundleName network price status createdAt phoneNumber")
      .lean();

    if (!order) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    const maskPhone = (phone: string) => {
      if (!phone || phone.length < 4) return "****";
      return "*".repeat(phone.length - 4) + phone.slice(-4);
    };

    return NextResponse.json({
      found: true,
      order: {
        transaction_id: order.transaction_id,
        bundleName: order.bundleName,
        network: order.network,
        price: order.price,
        status: order.status,
        createdAt: order.createdAt,
        phoneNumber: maskPhone(order.phoneNumber || ""),
      },
    });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { found: false, error: "Unable to look up order" },
      { status: 500 }
    );
  }
}
