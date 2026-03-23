import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import Setting from "@/models/Setting";
import StoreBundle from "@/models/StoreBundle";
import AgentStore from "@/models/AgentStore";
import Bundle from "@/models/Bundle";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { bundleId, phoneNumber } = await req.json();

        if (!bundleId || !phoneNumber) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // Check if orders are closed
        const ordersClosedDoc = await Setting.findOne({ key: "ordersClosed" }).select("value");
        if (Boolean(ordersClosedDoc?.value) && session.user.role !== "admin") {
            return NextResponse.json({ message: "Orders are currently closed" }, { status: 403 });
        }

        // Get StoreBundle details (custom price and base price)
        const storeBundle = await StoreBundle.findOne({ bundle: bundleId });
        console.log('StoreBundle:', storeBundle);
        if (!storeBundle) {
            return NextResponse.json({ message: "Bundle not found in this store" }, { status: 404 });
        }

         const agentId = storeBundle.agent;
        // Get the real bundle details for Dakazi
        const bundle = await Bundle.findById(bundleId);
        if (!bundle || !bundle.isActive) {
            return NextResponse.json({ message: "Original bundle is no longer active" }, { status: 404 });
        }

        const customPrice = storeBundle.customPrice;
        const basePrice = storeBundle.basePrice;
        const profit = customPrice - basePrice;

        // Get buyer (authenticated user)
        const agent = await User.findById(agentId);
        if (!agent) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check wallet balance (deduct the custom price set by agent)
        if (agent.walletBalance < customPrice) {
            console.log('Insufficient wallet balance');
            return NextResponse.json({
                message: "Insufficient wallet balance",
                balance: agent.walletBalance,
                required: customPrice
            }, { status: 400 });
        }

        const DAKAZI_API_KEY = process.env.DAKAZI_API_KEY;
        if (!DAKAZI_API_KEY) {
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
        }

        // Network ID logic
        let networkId;
        const network = bundle.network;
        if (network === "MTN") networkId = 3;
        else if (network === "Telecel") networkId = 2;
        else if (network.startsWith("AT") || network === "AirtelTigo") networkId = 4;
        else return NextResponse.json({ message: "Invalid network configuration" }, { status: 400 });

        const reference = `agent_${Date.now()}_${session.user.id}`;

        // Atomic update: Deduct from agent's wallet
        const updatedAgent = await User.findOneAndUpdate(
            { _id: agentId, walletBalance: { $gte: customPrice } },
            { $inc: { walletBalance: -customPrice } },
            { new: true }
        );

        if (!updatedAgent) {
            return NextResponse.json({ message: "Transaction failed: Insufficient agent balance" }, { status: 400 });
        }

        // Place order with Dakazi
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
                        recipient_msisdn: phoneNumber,
                        network_id: networkId,
                        shared_bundle: Number(bundle.name.replace(/[^0-9]/g, '')), // Get numeric value from bundle name
                        incoming_api_ref: reference
                    })
                }
            );

            const orderRes = await placeOrder.json();

            if (!placeOrder.ok || !orderRes.success) {
                // Refund wallet if API fails
                await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
                return NextResponse.json({ message: orderRes.message || "Order failed with provider" }, { status: 500 });
            }

            // Credit Profit to Agent's Store
            await AgentStore.findOneAndUpdate(
                { user: agentId },
                { $inc: { totalProfit: profit, totalSalesCount: 1 } }
            );
                  
            // Create order record
            const order = await Order.create({
                user: session.user.id,
                agent: agentId as mongoose.Types.ObjectId ,
                transaction_id: orderRes.transaction_code,
                network: network,
                bundleName: bundle.name,
                price: customPrice,
                originalPrice: basePrice,
                phoneNumber: phoneNumber,
                status: 'pending',
            });

            return NextResponse.json({
                message: "Order placed successfully",
                order,
                newBalance: updatedAgent.walletBalance
            }, { status: 201 });

        } catch (err) {
            // Refund wallet on catch
            await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
            throw err;
        }

    } catch (error: any) {
        console.error("Agent wallet purchase error:", error);
        return NextResponse.json({ message: error.message || "Error processing purchase" }, { status: 500 });
    }
}
