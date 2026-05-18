import { Metadata } from 'next';
import dbConnect from '@/lib/mongoose';
import AgentStore from '@/models/AgentStore';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const slug = (await params).slug;
    
    try {
        await dbConnect();
        const store = await AgentStore.findOne({ slug, isActive: true }).select('storeName description');
        
        if (!store) {
            return {
                title: 'Store Not Found',
                description: 'This store could not be found or is inactive.'
            };
        }

        return {
            title: store.storeName,
            description: store.description || `Welcome to ${store.storeName}! Grab the best bundles here.`,
            openGraph: {
                title: store.storeName,
                description: store.description || `Welcome to ${store.storeName}! Grab the best bundles here.`,
            }
        };
    } catch (error) {
        console.error('Error fetching store metadata:', error);
        return {
            title: 'Store',
            description: 'Agent Store'
        };
    }
}

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
