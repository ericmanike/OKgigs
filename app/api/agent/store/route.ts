import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import AgentStore from '@/models/AgentStore';
import StoreBundle from '@/models/StoreBundle';
import Bundle from '@/models/Bundle';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== 'agent' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        let store = await AgentStore.findOne({ user: session.user.id }).lean();
        if (!store) {
            // Return empty layout
            return NextResponse.json(null);
        }

        // Fetch custom profits from StoreBundle
        const customBundles = await StoreBundle.find({ agent: session.user.id });
        const bundleProfits: Record<string, number> = {};
        customBundles.forEach(cb => {
            bundleProfits[cb.bundle.toString()] = cb.customPrice - cb.basePrice;
        });

        return NextResponse.json({ ...store, bundleProfits });
    } catch (error: any) {
        console.error("Store GET Error:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== 'agent' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const data = await req.json();
        const { storeName, slug, description, bundleProfits } = data;

        if (!storeName || !slug) {
            return NextResponse.json({ error: 'Store Name and Slug are required' }, { status: 400 });
        }

        // Check if slug is taken by another user
        const existingSlug = await AgentStore.findOne({ slug, user: { $ne: session.user.id } });
        if (existingSlug) {
            return NextResponse.json({ error: 'This URL slug is already taken by another store.' }, { status: 400 });
        }

        let store = await AgentStore.findOne({ user: session.user.id });

        if (store) {
            store.storeName = storeName;
            store.slug = slug;
            store.description = description || '';
            await store.save();
        } else {
            store = await AgentStore.create({
                user: session.user.id,
                storeName,
                slug,
                description: description || '',
            });
        }

        // Sync with StoreBundle model
        if (bundleProfits) {
            const bundleIds = Object.keys(bundleProfits);
            const bundleDocs = await Bundle.find({ _id: { $in: bundleIds } });
            
            const storeBundlePromises = bundleIds.map(async (bundleId) => {
                const profit = bundleProfits[bundleId];
                const bundleDoc = bundleDocs.find(b => b._id.toString() === bundleId);
                if (bundleDoc) {
                    return StoreBundle.findOneAndUpdate(
                        { agent: session.user.id, bundle: bundleId },
                        {
                            agent: session.user.id,
                            bundle: bundleId,
                            basePrice: bundleDoc.price,
                            customPrice: bundleDoc.price + profit,
                            isActive: true
                        },
                        { upsert: true, new: true }
                    );
                }
            });
            
            await Promise.all(storeBundlePromises);
        }

        return NextResponse.json(store);
    } catch (error: any) {
        console.error("Store POST Error:", error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'This URL slug is already in use.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to save store settings' }, { status: 500 });
    }
}
