import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Bundle from '@/models/Bundle';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subject, title, message, type } = await req.json();

        if (!subject || !title || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        const typeColors: any = {
            promotion: { bg: '#dcfce7', text: '#166534', label: 'Promotion' },
            notice: { bg: '#fef9c3', text: '#854d0e', label: 'Notice' },
            reminder: { bg: '#dbeafe', text: '#1e40af', label: 'Reminder' }
        };

        const config = typeColors[type] || typeColors.notice;

        // Fetch all users with valid emails
        const users = await User.find({}, 'email name');
        const validUsers = users.filter(u => u.email && u.email.includes('@'));

        if (validUsers.length === 0) {
            return NextResponse.json({ message: 'No users to broadcast to' });
        }

        let promoHtml = '';
        if (type === 'promotion') {
            const promoBundles = await Bundle.find({ audience: 'promo', isActive: true });
            if (promoBundles.length > 0) {
                promoHtml = `
                    <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
                        <h3 style="margin-top: 0; color: #0f172a; font-size: 16px;">🔥 Current Promo Offers</h3>
                        <ul style="padding-left: 20px; margin-bottom: 0; color: #334155; font-size: 14px; line-height: 1.6;">
                            ${promoBundles.map(b => `<li><strong>${b.network} ${b.name}</strong> - GHS ${b.price}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        }

        const BATCH_SIZE = 100; // Resend allows up to 100 emails per batch
        let successful = 0;
        let failed = 0;

        for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
            const batchUsers = validUsers.slice(i, i + BATCH_SIZE);
            const emailsPayload = batchUsers.map(user => ({
                from: process.env.RESEND_FROM_EMAIL || 'info@nyamekyeloans.com',
                to: [user.email],
                subject: `${subject} - MegaGigs`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">MegaGigs</h1>
                        </div>
                        <div style="padding: 32px; background-color: #ffffff;">
                            <div style="display: inline-block; padding: 4px 12px; background-color: ${config.bg}; color: ${config.text}; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-bottom: 16px; text-transform: uppercase;">
                                ${config.label}
                            </div>
                            <h2 style="color: #111827; margin-top: 0; margin-bottom: 16px; font-size: 20px;">${title}</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${user.name},</p>
                            <div style="color: #374151; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
                                ${message}
                            </div>
                            ${promoHtml}
                            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
                                <a href="${process.env.NEXTAUTH_URL}" style="display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                                    Visit Website
                                </a>
                            </div>
                        </div>
                        <div style="background-color: #f9fafb; padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
                            &copy; ${new Date().getFullYear()} MegaGigs. All rights reserved.<br>
                            You're receiving this because you're a registered user on MegaGigs.
                        </div>
                    </div>
                `,
            }));

            const { data, error } = await resend.batch.send(emailsPayload);

            if (error) {
                console.error('Batch send error:', error);
                failed += batchUsers.length;
            } else {
                console.log(`Batch sent successfully. Data:`, data);
                successful += batchUsers.length;
            }
        }

        return NextResponse.json({
            message: 'Broadcast completed successfully',
            successful,
            failed
        });

    } catch (error: any) {
        console.error('Broadcast Error:', error);
        return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
    }
}
