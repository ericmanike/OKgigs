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

        const withdrawalAmount = Number(amount);
        if (isNaN(withdrawalAmount) || withdrawalAmount < 25) {
            return NextResponse.json({ error: 'Minimum withdrawal amount is GH₵ 25.00' }, { status: 400 });
        }

        // Check if agent has enough profit
        const store = await AgentStore.findOne({ user: session.user.id });
        if (!store || store.totalProfit < withdrawalAmount) {
            return NextResponse.json({ error: 'Insufficient profit balance' }, { status: 400 });
        }

        // Create withdrawal request
        const withdrawal = await Withdrawal.create({
            agent: session.user.id,
            amount: withdrawalAmount,
            phoneNumber,
            momoName,
            status: 'pending'
        });

        // Profit will be deducted when admin approves


        return NextResponse.json({ 
            message: 'Withdrawal request submitted successfully',
            withdrawal 
        });

    } catch (error: any) {
        console.error("Withdrawal POST Error:", error);
        return NextResponse.json({ error: 'Failed to submit withdrawal request' }, { status: 500 });
    }
}
