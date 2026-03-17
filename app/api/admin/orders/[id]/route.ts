import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';

// Delete an order
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await dbConnect();

        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Update an order (e.g. mark as delivered)
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);        const role = session?.user?.role;
        if (!session || (role !== 'admin' && role !== 'moderator')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        const { status } = body as { status?: string };

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const allowedStatuses = ['pending', 'delivered', 'failed', 'reversed'];
        if (!allowedStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        await dbConnect();

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Handle retry for Dakazi failed orders (transaction_id starts with "paid_")
        if (order.transaction_id.startsWith('paid_') && status == 'pending') {
            const DAKAZI_API_KEY = process.env.DAKAZI_API_KEY;
            if (!DAKAZI_API_KEY) {
                return NextResponse.json({ error: 'Data provider API key not configured' }, { status: 500 });
            }

            const network = order.network;
            let networkId;
            const upperNetwork = network.toUpperCase();
            if (upperNetwork === "MTN") {
                networkId = 3;
            } else if (upperNetwork === "TELECEL") {
                networkId = 2;
            } else if (upperNetwork.startsWith("AT") || upperNetwork.includes("AIRTEL")) {
                networkId = 4;
            }

            if (networkId) {
                const originalRef = order.transaction_id.replace('paid_', '');
                try {
                    const placeOrder = await fetch(
                        "https://reseller.dakazinabusinessconsult.com/api/v1/buy-data-package",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": `${DAKAZI_API_KEY}`,
                            },
                            body: JSON.stringify({
                                recipient_msisdn: order.phoneNumber.trim(),
                                network_id: networkId,
                                shared_bundle: Number(order.bundleName),
                                incoming_api_ref: originalRef
                            })
                        }
                    );

                    const orderRes = await placeOrder.json().catch(() => ({}));
                    if (orderRes.transaction_code) {
                        order.transaction_id = orderRes.transaction_code;
                        order.status = 'pending';
                        await order.save();
                        await order.populate('user', 'name email');
                        return NextResponse.json(order);
                    } else {
                        return NextResponse.json({ error: orderRes.message || 'Data provider error' }, { status: 400 });
                    }
                } catch (err) {
                    console.error('Retry order error:', err);
                    return NextResponse.json({ error: 'Failed to contact data provider' }, { status: 500 });
                }
            }
        }

        // Standard update
        order.status = status as any;
        await order.save();
        await order.populate('user', 'name email');
          console.log("Admin  unsucessfull order",order);
        return NextResponse.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}