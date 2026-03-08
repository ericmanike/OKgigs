import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import AgentStore from '@/models/AgentStore';
import Bundle from '@/models/Bundle';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        await dbConnect();

        const slug = (await params).slug;

        const store = await AgentStore.findOne({ slug, isActive: true }).select('storeName description bundleProfits user');
        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        // Fetch all generally available bundles (or those marked for agents/users)
        const bundles = await Bundle.find({ isActive: true });
        const availableBundles = bundles.filter((b: any) => b.audience === 'agent');

        // Apply agent profit markup
        const storeBundles = availableBundles.map(bundle => {
            const profits: any = store.bundleProfits || {};
            const agentProfit = (typeof profits.get === 'function' ? profits.get(bundle._id.toString()) : profits[bundle._id.toString()]) || 0;
            return {
                _id: bundle._id,
                name: bundle.name,
                network: bundle.network,
                originalPrice: bundle.price,
                profit: agentProfit,
                price: bundle.price + agentProfit,
                audience: bundle.audience,
                storeId: store._id
            };
        });

        return NextResponse.json({
            storeName: store.storeName,
            description: store.description,
            bundles: storeBundles,
            agentId: store.user
        });
    } catch (error) {
        console.error('Fetch store bundles error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
