import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req:NextRequest){
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        await dbConnect();

        const {email , amount, reference} = await req.json();

        const user = await User.findOne({email});
        if(!user){
            console.log("User not found", user)
            return NextResponse.json({message:"Unauthorized access"} , {status:400})
        }

        
     const updatedUser:any = await User.findOneAndUpdate(
            { _id: user._id, walletBalance: { $gte: amount } },
            { $inc: { walletBalance: amount } },
            { new: true, session: mongoSession }
        );


        console.log("Updated user", updatedUser)
        if (!updatedUser) {
            console.log('Insufficient balance during update. Refunding wallet.');
            return NextResponse.json({ message: "Insufficient wallet balance. Transaction cancelled." }, { status: 400 });
        }
  
        if (reference) {
            await Transaction.create([{
                user: user._id,
                transactionType: 'credit',
                type: 'topup',
                amount: amount,
                reference: reference,
                description: `Wallet top-up of GH₵${amount}`,
                status: 'success'
            }], { session: mongoSession });
        }

        await mongoSession.commitTransaction();

        console.log("User wallet balance updated", updatedUser.walletBalance)

    } catch (error) {
        if( mongoSession.inTransaction()){
            await mongoSession.abortTransaction();
        }
        console.log(error)
    } finally {
        await mongoSession.endSession();
    }

    return NextResponse.json({message:"Wallet top-up successful"} , {status:200})
}
