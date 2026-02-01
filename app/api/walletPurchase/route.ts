import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { network, bundleName, price, phoneNumber } = await req.json();

        console.log('Received wallet purchase data:', { network, bundleName, price, phoneNumber });

        if (!network || !bundleName || !price || !phoneNumber) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // Get user and check wallet balance
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if user has sufficient balance
        if (user.walletBalance < price) {
            return NextResponse.json({
                message: "Insufficient wallet balance",
                balance: user.walletBalance,
                required: price
            }, { status: 400 });
        }

        const DAKAZI_API_KEY = process.env.DAKAZI_API_KEY;

        if (!DAKAZI_API_KEY) {
            return NextResponse.json({ message: "Unexpected error occurred" }, { status: 500 });
        }

        // Determine network ID
        let networkId;
        if (network === "MTN") {
            networkId = 3;
        } else if (network === "Telecel") {
            networkId = 2;
        } else if (network.startsWith("AT")) {
            networkId = 4;
        } else {
            return NextResponse.json({ message: "Invalid network" }, { status: 400 });
        }

        console.log('Network ID:', networkId);

        // Generate unique reference
        const reference = `wallet_${Date.now()}_${session.user.id}`;

        // Check for duplicate transaction
        const existingOrder = await Order.findOne({ transaction_id: reference });
        if (existingOrder) {
            return NextResponse.json({ message: "Duplicate transaction reference" }, { status: 409 });
        }

        // Deduct from wallet balance
        user.walletBalance -= price;
        await user.save();

        console.log(`Deducted ${price} from wallet. New balance: ${user.walletBalance}`);

        // Place order with Dakazi
        const placeOrder = await fetch(
            "https://reseller.dakazinabusinessconsult.com/api/v1/buy-data-package",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": `${DAKAZI_API_KEY}`,
                },
                body: JSON.stringify({
                    recipient_msisdn: phoneNumber,
                    network_id: networkId,
                    shared_bundle: Number(bundleName),
                    incoming_api_ref: reference
                })
            }
        );

        const raw = await placeOrder.text();
        const orderRes = JSON.parse(raw);
        console.log('Dakazi order response:', orderRes);

        if (!placeOrder.ok) {
            // Refund wallet if order placement failed
            user.walletBalance += price;
            await user.save();
            console.log('Order placement failed. Refunded wallet.');
            return NextResponse.json({ message: "Could not place order. Wallet refunded." }, { status: 500 });
        }

        // Create order record
        const order = await Order.create({
            user: session.user.id,
            transaction_id: orderRes.transaction_code,
            network: network,
            bundleName: bundleName,
            price: price,
            phoneNumber: phoneNumber,
            status: 'pending',
        });

        console.log('📦 New wallet order created:', order);
        return NextResponse.json({
            message: "Order created successfully",
            order,
            newBalance: user.walletBalance
        }, { status: 201 });

    } catch (error) {
        console.error("Wallet purchase error:", error);
        return NextResponse.json({ message: "Error processing wallet purchase" }, { status: 500 });
    }
}
