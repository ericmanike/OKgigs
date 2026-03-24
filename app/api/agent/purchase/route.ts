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
import SystemLog from "@/models/SystemLog";
import { handleDakazina, handleSpendless } from "@/components/providers/apiProviders";


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

        // Get agent  
        const agent = await User.findById(agentId);
        if (!agent) {
            return NextResponse.json({ message: "No Shop found" }, { status: 404 });
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

        
        // Determine active provider
        const providerDoc = await Setting.findOne({ key: "provider" }).select("value");
        const provider = providerDoc?.value || "dakazina";

        const DAKAZI_API_KEY = process.env.DAKAZI_API_KEY;
        const network = bundle.network;
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

        // Create initial order record
        const order = await Order.create({
            user: session.user.id,
            agent: agentId as mongoose.Types.ObjectId,
            transaction_id: reference,
            network: network,
            bundleName: bundle.name,
            price: customPrice,
            originalPrice: basePrice,
            phoneNumber: phoneNumber,
            status: 'placed',
        });

        await SystemLog.create({
            level: 'info',
            category: 'agent',
            message: `Agent ${agent.name} store purchase initiated`,
            meta: {
                agentId,
                orderId: order._id,
                bundleName: bundle.name,
                phoneNumber,
                customPrice,
                profit
            },
            user: session.user.id
        });

        let orderResponse;

        try {
            if (provider === "dakazina") {
                if (!DAKAZI_API_KEY) {
                    await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
                    return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
                }

                // Dakazina network ID mapping
                let networkId;
                const networkUpper = network.toUpperCase();
                if (networkUpper === "MTN") networkId = 3;
                else if (networkUpper === "TELECEL") networkId = 2;
                else if (networkUpper.startsWith("AT") || networkUpper === "AIRTELTIGO") networkId = 4;
                else {
                    await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
                    return NextResponse.json({ message: "Invalid network configuration" }, { status: 400 });
                }

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
                            shared_bundle: Number(bundle.name.replace(/[^0-9]/g, '')),
                            incoming_api_ref: reference
                        })
                    }
                );

                const raw = await placeOrder.text();
                let Orderres;
                try {
                    Orderres = JSON.parse(raw);
                    console.log('Dakazina order response:', Orderres);
                    orderResponse = Orderres;
                } catch (error) {
                    console.error("Failed to parse Dakazina response:", error);
                    await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
                    return NextResponse.json({ message: "Error creating order" }, { status: 500 });
                }

                if (!placeOrder.ok) {
                    await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
                    return NextResponse.json({ message: Orderres.message || "Order failed with provider" }, { status: 500 });
                }

                if (Orderres.transaction_code) {
                    order.transaction_id = Orderres.transaction_code;
                    order.status = 'pending';
                    await order.save();
                }

            } else if (provider === "spendless") {
                const apiKey = process.env.SPENDLESS_API_KEY?.trim();

                if (!apiKey) {
                    await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
                    return NextResponse.json({ message: "Spendless API key not configured" }, { status: 500 });
                }

                // Spendless network key mapping
                let networkKey;
                if (network.toUpperCase() === "MTN") networkKey = "YELLO";
                else if (network.toUpperCase() === "TELECEL") networkKey = "TELECEL";
                else if (network.startsWith("AT")) networkKey = "AT_PREMIUM";
                else {
                    await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
                    return NextResponse.json({ message: "Invalid network configuration" }, { status: 400 });
                }

                const spendlessResponse = await fetch("https://spendless.top/api/purchase", {
                    method: "POST",
                    headers: {
                        "X-API-Key": apiKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        networkKey: networkKey,
                        recipient: phoneNumber.trim(),
                        capacity: Number(bundle.name.replace(/[^0-9]/g, '')),
                    }),
                });

                const data = await spendlessResponse.json();
                orderResponse = data;
                console.log("Spendless order response:", orderResponse);

                if (data.status === "success") {
                    order.transaction_id = data.data.transactionReference;
                    order.status = "placed";
                    await order.save();
                } else {
                    await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
                    return NextResponse.json({ message: data.message || "Order failed with Spendless" }, { status: 500 });
                }

            } else if (provider === "datamart") {
                // Datamart provider placeholder
                await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
                return NextResponse.json({ message: "Datamart provider not yet implemented" }, { status: 501 });
            } else {
                await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
                return NextResponse.json({ message: "Unknown provider configured" }, { status: 500 });
            }

            // Credit Profit to Agent's Store
            await AgentStore.findOneAndUpdate(
                { user: agentId },
                { $inc: { totalProfit: profit, totalSalesCount: 1 } }
            );

            return NextResponse.json({
                message: "Order placed successfully",
                order,
                orderResponse,
                newBalance: updatedAgent.walletBalance
            }, { status: 201 });

        } catch (err) {
            // Refund wallet on unexpected error
            await User.findByIdAndUpdate(agentId, { $inc: { walletBalance: customPrice } });
            throw err;
        }

    } catch (error: any) {
        console.error("Agent wallet purchase error:", error);
        return NextResponse.json({ message: error.message || "Error processing purchase" }, { status: 500 });
    }
}
