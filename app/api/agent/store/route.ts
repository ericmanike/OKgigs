import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import AgentStore from '@/models/AgentStore';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== 'agent' && session.user.role !== 'admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        let store = await AgentStore.findOne({ user: session.user.id });
        if (!store) {
            // Return empty layout
            return NextResponse.json(null);
        }

        return NextResponse.json(store);
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
            store.bundleProfits = bundleProfits || {};
            await store.save();
        } else {
            store = await AgentStore.create({
                user: session.user.id,
                storeName,
                slug,
                description: description || '',
                bundleProfits: bundleProfits || {}
            });
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
