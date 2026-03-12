import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle2, XCircle, Clock, Wifi } from "lucide-react";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

export default async function HistoryPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    await dbConnect();

    // Fetch orders for the current user
    const orders = await Order.find({ user: session.user.id })
        .sort({ createdAt: -1 })
        .limit(50); // Limit to last 50 transactions

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6 md:pt-29 pt-24 z-0">
            <h1 className="text-2xl font-bold">Transaction History</h1>

            <div className="space-y-4">
                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-slate-700">
                            <p>No transaction history found.</p>
                        </CardContent>
                    </Card>
                ) : (
                    orders.map((order) => (
                        <Card key={order._id.toString()} className="hover:border-slate-300 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                    ${order.network === 'MTN' ? 'bg-yellow-500 text-brown-500' :
                                            order.network === 'Telecel' ? 'bg-red-500 text-white' :
                                                'bg-blue-600 text-white'}`}>
                                        <Wifi size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-zinc-900">{order.network} {order.bundleName}</h3>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-slate-950/70">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="text-xs text-slate-950/50">
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-950">{order.phoneNumber}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold text-zinc-900">{formatCurrency(order.price)}</p>
                                    <div className="flex items-center justify-end mt-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                                            ${order.status === 'delivered'
                                                ? 'bg-green-500 text-white'
                                                : order.status === 'pending'
                                                ? 'bg-red-100 text-red-700 border border-red-200'
                                                : order.status === 'failed'
                                                ? 'bg-red-50 text-red-700'
                                                : 'bg-zinc-200 text-zinc-500'}`}>
                                            {order.status === 'delivered' && <CheckCircle2 size={13} className="shrink-0 text-green-200" />}
                                            {order.status === 'pending' && <Clock size={13} className="shrink-0" />}
                                            {order.status === 'failed' && <XCircle size={13} className="shrink-0" />}
                                            {order.status === 'reversed' && <XCircle size={13} className="shrink-0" />}
                                            <span className="capitalize">
                                                {order.status === 'delivered' ? 'Delivered' : order.status === 'pending' ? 'Processing' : order.status}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
