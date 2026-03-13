import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Crown, CheckCircle, Gem, Zap, Gift, Headphones } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import BecomeAgent from "@/components/ui/becomeAgent";

export const metadata = {
  title: "Premium Upgrade | MegaGigs Dashboard",
};

export default async function UpgradePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const benefits = [
    {
      icon: Zap,
      title: "Special Pricing",
      desc: "Get access to lower rates on all data bundles regardless of volume.",
      color: "bg-blue-500",
    },
    {
      icon: Gift,
      title: "Priority Access",
      desc: "Be the first to know about and use new network bundles and offers.",
      color: "bg-purple-500",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Dedicated account manager to resolve your issues in minutes.",
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
          <Gem size={14} className="text-amber-600" />
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Premium Access</span>
        </div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Level Up Your Experience</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          Join our inner circle of agents and enjoy exclusive rates, faster delivery, and dedicated support.
        </p>
      </div>

      {/* Main CTA Card */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Crown className="text-amber-400" size={32} />
              <span className="text-2xl font-black tracking-tight">Upgrade to Premium</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-zinc-300 text-sm">
                <CheckCircle size={16} className="text-amber-400 shrink-0" /> Lifetime access to agent rates
              </li>
              <li className="flex items-center gap-2 text-zinc-300 text-sm">
                <CheckCircle size={16} className="text-amber-400 shrink-0" /> No monthly subscription
              </li>
              <li className="flex items-center gap-2 text-zinc-300 text-sm">
                <CheckCircle size={16} className="text-amber-400 shrink-0" /> You get a personalized store dashboard
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="text-center">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">One-time payment</p>
              <p className="text-4xl font-black text-white">{formatCurrency(30)}</p>
            </div>
            <div className="w-full min-w-[200px]">
              <BecomeAgent />
            </div>
          </div>
        </div>
      </div>

      {/* Benefit Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {benefits.map((benefit, i) => (
          <Card key={i} className="border-zinc-100">
            <CardContent className="p-6 space-y-4">
              <div className={`w-12 h-12 rounded-2xl ${benefit.color} flex items-center justify-center text-white`}>
                <benefit.icon size={24} />
              </div>
              <h3 className="font-bold text-zinc-900">{benefit.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{benefit.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
