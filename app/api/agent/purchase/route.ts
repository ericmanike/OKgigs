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

        
         const DAKAZI_API_KEY = process.env.DAKAZI_API_KEY!;
    const SPENDLESS_API_KEY = process.env.SPENDLESS_API_KEY!;

    if (!DAKAZI_API_KEY || !SPENDLESS_API_KEY) {
        console.log("API keys not found")
      return NextResponse.json({ message: "unexpected error occurred" }, { status: 500 });
    }

      
        const network = bundle.network;
        const reference = `agent_${Date.now()}_${session.user.id}`;


        

        // Atomic update: Deduct from agent's wallet
        const updatedAgent = await User.findOneAndUpdate(
            { _id: agentId, walletBalance: { $gte: customPrice } },
            { $inc: { walletBalance: -customPrice } },
            { new: true }
        );

        if (!updatedAgent) {
            console.log("Agent not found")
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
            status: 'processing',
        });


         const  profitUser = AgentStore.findOneAndUpdate(
            {user:agentId},
            {$inc:{totalProfit:profit}},
            {new:true}
         )
 
         if (!profitUser) {
            console.log("Profit user not found")
            return NextResponse.json({ message: "Transaction failed: Insufficient agent balance" }, { status: 400 });
        }


        if (!DAKAZI_API_KEY || SPENDLESS_API_KEY){
          return NextResponse.json({ message: "unexpected error occurred" }, { status: 500 });
        }

        
        const data = {
          network,
          bundleName: bundle.name,
          price: customPrice,
          phoneNumber,
          reference,
        }


        const providerDoc = await Setting.findOne({ key: "provider" });
        const provider = providerDoc?.value || "dakazina";


        let response;

        if (provider === "dakazina") {
          response = await handleDakazina(order, data, DAKAZI_API_KEY);
        } else if (provider === "spendless") {
          response = await handleSpendless(order, data, SPENDLESS_API_KEY);
        }
        
            
            return NextResponse.json(
              { message: "Order created successfully", response },
              { status: 201 }
            );
        
    } catch (error: any) {
        console.error("Agent wallet purchase error:", error);
        return NextResponse.json({ message: error.message || "Error processing purchase" }, { status: 500 });
    }
}
