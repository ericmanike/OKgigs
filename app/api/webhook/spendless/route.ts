import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import SystemLog from "@/models/SystemLog";
import { NextResponse } from "next/server";

/**
 * Spendless webhook handler
 *
 * Expected payload:
 * {
 *   "event": "order.delivered",
 *   "timestamp": "2025-12-25T10:30:00+00:00",
 *   "data": {
 *     "reference": "API_ABC123",
 *     "status": "delivered",
 *     "recipient": "0241234567",
 *     "volume_mb": 1000,
 *     "amount": 1.50,
 *     "provider_reference": "PROV_XYZ"
 *   }
 * }
 */
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    console.log("Spendless webhook received:", JSON.stringify(body));

    // Log that the webhook was called
    await SystemLog.create({
      level: 'info',
      category: 'webhook',
      message: 'Spendless webhook called',
      meta: { body },
    });

    const { event, data } = body;

    if (!event || !data?.reference || !data?.status) {
      console.error("Spendless webhook: missing required fields", { event, data });
      await SystemLog.create({
        level: 'warn',
        category: 'webhook',
        message: 'Spendless webhook: missing required fields',
        meta: { event, data },
      });
      return NextResponse.json(
        { error: "Missing required fields (event, data.reference, data.status)" },
        { status: 400 }
      );
    }

    // Map Spendless statuses to our internal statuses
    const statusMap: Record<string, string> = {
      delivered: "delivered",
      failed: "failed",
      reversed: "reversed",
      processing: "processing",
      placed: "placed",
    };

    const mappedStatus = statusMap[data.status.toLowerCase()];
    if (!mappedStatus) {
      console.warn("Spendless webhook: unknown status", data.status);
      await SystemLog.create({
        level: 'warn',
        category: 'webhook',
        message: `Spendless webhook: unknown status "${data.status}"`,
        meta: { event, data },
      });
      return NextResponse.json(
        { error: `Unknown status: ${data.status}` },
        { status: 400 }
      );
    }

    // Find the order by the Spendless transaction reference
    const order = await Order.findOneAndUpdate(
      { transaction_id: data.reference },
      { status: mappedStatus },
      { new: true } 
    );

    if (!order) {
      console.warn("Spendless webhook: no order found for reference", data.reference);
      await SystemLog.create({
        level: 'warn',
        category: 'webhook',
        message: `Spendless webhook: order not found for reference ${data.reference}`,
        meta: { event, data },
      });
      return NextResponse.json(
        { error: "Order not found for reference: " + data.reference },
        { status: 404 }
      );
    }

    console.log(
      `Spendless webhook: order ${order.transaction_id} updated to "${mappedStatus}"`,
      { event, recipient: data.recipient, provider_reference: data.provider_reference }
    );

    await SystemLog.create({
      level: 'info',
      category: 'webhook',
      message: `Spendless webhook: order ${order.transaction_id} updated to "${mappedStatus}"`,
      meta: {
        orderId: order._id,
        transactionId: order.transaction_id,
        event,
        status: mappedStatus,
        recipient: data.recipient,
        providerRef: data.provider_reference,
      },
    });

    return NextResponse.json({ received: true, orderId: order._id, status: mappedStatus });
  } catch (error: any) {
    console.error("Spendless webhook error:", error);
    try {
      await SystemLog.create({
        level: 'error',
        category: 'webhook',
        message: `Spendless webhook error: ${error.message || 'Unknown error'}`,
        meta: { stack: error.stack },
      });
    } catch (_) { /* don't throw in error handler */ }
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
