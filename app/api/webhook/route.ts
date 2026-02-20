import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const data = await request.json();

    const { transaction_id, status } = data;
    console.log('Received webhook data:', data);

    if (!transaction_id || !status) {
      return NextResponse.json({ error: "Missing transaction_id or status" }, { status: 400 });
    }

    await Order.findOneAndUpdate(
      { transaction_id },
      { status: status.toLowerCase() }
    );

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}