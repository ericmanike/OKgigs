import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Withdrawal from '@/models/Withdrawal';
import AgentStore from '@/models/AgentStore';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== 'agent' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { amount, phoneNumber, momoName } = await req.json();

        if (!amount || !phoneNumber || !momoName) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Check if agent has enough profit
        const store = await AgentStore.findOne({ user: session.user.id });
        if (!store || store.totalProfit < amount) {
            return NextResponse.json({ error: 'Insufficient profit balance' }, { status: 400 });
        }

        // Create withdrawal request
        const withdrawal = await Withdrawal.create({
            agent: session.user.id,
            amount,
            phoneNumber,
            momoName,
            status: 'pending'
        });

        // Deduct from agent store profit immediately to prevent double withdrawal
        // If the request is rejected, the admin should refund it manually or we can automate it
        store.totalProfit -= amount;
        await store.save();

        return NextResponse.json({ 
            message: 'Withdrawal request submitted successfully',
            withdrawal 
        });

    } catch (error: any) {
        console.error("Withdrawal POST Error:", error);
        return NextResponse.json({ error: 'Failed to submit withdrawal request' }, { status: 500 });
    }
}
