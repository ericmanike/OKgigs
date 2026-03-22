import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';
import AgentStore from '@/models/AgentStore';

// GET all withdrawals or filter by status
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const withdrawals = await Withdrawal.find()
            .populate('agent', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json(withdrawals);
    } catch (error) {
        console.error("Admin Withdrawals GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
    }
}

// PATCH to update withdrawal status (approve/reject)
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, status } = await req.json();
        if (!id || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        await dbConnect();
        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
        }

        if (withdrawal.status !== 'pending') {
            return NextResponse.json({ error: 'Withdrawal already processed' }, { status: 400 });
        }

        if (status === 'rejected') {
            // Refund the amount to the agent's store profit
            await AgentStore.findOneAndUpdate(
                { user: withdrawal.agent },
                { $inc: { totalProfit: withdrawal.amount } }
            );
        }

        withdrawal.status = status;
        await withdrawal.save();

        return NextResponse.json({ message: `Withdrawal ${status} successfully` });
    } catch (error) {
        console.error("Admin Withdrawals PATCH Error:", error);
        return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
    }
}
