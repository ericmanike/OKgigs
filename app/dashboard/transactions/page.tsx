import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import {
  CreditCard,
  Wifi,
  ArrowDownToLine,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";

export const metadata = {
  title: "Transactions | MegaGigs Dashboard",
};

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  await dbConnect();

  const transactionsRaw = await Transaction.find({ user: session.user.id }).lean();

  const getUnifiedStatus = (rawStatus: string) => {
    switch (rawStatus) {
      case 'delivered':
      case 'success':
        return 'success';
      case 'failed':
      case 'reversed':
        return 'failed';
      default:
        return 'pending';
    }
  };

  const transactions = transactionsRaw.map((t: any) => ({
    _id: String(t._id),
    transactionType: t.transactionType || (t.type === 'purchase' ? 'debit' : 'credit'),
    type: t.type,
    title: t.description || (t.type === 'purchase' ? 'Bundle Purchase' : 'Wallet Top-up'),
    description: t.reference,
    amount: t.amount,
    status: getUnifiedStatus(t.status),
    date: new Date(t.createdAt),
  })).sort((a, b) => b.date.getTime() - a.date.getTime());

  const totalDebit = transactions
    .filter((tx) => tx.transactionType === "debit" && tx.status === "success")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalCredit = transactions
    .filter((tx) => tx.transactionType === "credit" && tx.status === "success")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Transactions</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Your bundle purchases and wallet topups</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="overflow-hidden border-zinc-200/80 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-center">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Total Credit</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">+{formatCurrency(totalCredit)}</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-zinc-200/80 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-center">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Total Debit</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">-{formatCurrency(totalDebit)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-zinc-200/80">
        <CardContent className="p-0 divide-y divide-zinc-100">
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft size={24} className="text-zinc-400" />
              </div>
              <p className="text-zinc-600 font-medium">No transactions yet</p>
              <p className="text-sm text-zinc-500 mt-1">Your activity will appear here</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 hover:bg-zinc-50/80 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={clsx(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                      tx.type === "purchase" && "bg-blue-100 text-blue-700",
                      tx.type === "topup" && "bg-emerald-100 text-emerald-700"
                    )}
                  >
                    {tx.type === "topup" ? <ArrowDownToLine size={20} /> : <Wifi size={20} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-900 truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-zinc-500">
                        {tx.date.toLocaleDateString()}
                      </span>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="text-xs text-zinc-500 font-mono">{tx.description}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end gap-1 sm:gap-1.5">
                  <p className={clsx("font-bold", tx.transactionType === "credit" ? "text-emerald-600" : "text-red-600")}>
                    {tx.transactionType === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </p>
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                      tx.status === "success" && "bg-green-500 text-white",
                      tx.status === "pending" && "bg-amber-100 text-amber-700 border border-amber-200",
                      tx.status === "failed" && "bg-red-50 text-red-700 border border-red-200"
                    )}
                  >
                    {tx.status === "success" && <CheckCircle2 size={12} className="shrink-0 text-green-200" />}
                    {tx.status === "pending" && <Clock size={12} className="shrink-0" />}
                    {tx.status === "failed" && <XCircle size={12} className="shrink-0" />}
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
