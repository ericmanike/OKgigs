import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Result Checkers | MegaGigs Dashboard",
};

export default async function ResultCheckersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Result Checkers</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Buy WAEC - WASSCE, and BECE result checker vouchers.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* WAEC Checker Card */}
        <Card className="overflow-hidden  transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <div className="bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                Available
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-zinc-900">WAEC Result Checker</h3>
            <p className="text-sm text-zinc-500 mt-1 mb-4 h-10">
              Valid for WASSCE results.
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Price</span>
                <p className="text-lg font-black text-zinc-900">{formatCurrency(25)}</p>
              </div>
              <Link 
                href="#"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Buy Now
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* BECE Checker Card */}
        <Card className="overflow-hidden transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <div className="bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                Available
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-zinc-900">BECE Result Checker</h3>
            <p className="text-sm text-zinc-500 mt-1 mb-4 h-10">
              Valid for BECE (School and Private) results.
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Price</span>
                <p className="text-lg font-black text-zinc-900">{formatCurrency(20)}</p>
              </div>
              <Link 
                href="#"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Buy Now
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-5 mt-6">
        <h4 className="text-sm font-bold text-zinc-900 mb-2">How it works</h4>
        <ul className="text-sm text-zinc-600 space-y-2 list-disc list-inside">
          <li>Select the type of result checker you need (WAEC or BECE).</li>
          <li>Click on <strong>Buy Now</strong> and complete the payment using your preferred method.</li>
          <li>Your <strong>PIN</strong> and <strong>Serial Number</strong> will be displayed instantly and sent to your email/phone.</li>
          <li className="text-red-500"> <a href="https://ghana.waecdirect.org/" target="_blank" rel="noopener noreferrer">Check Your Result Here</a></li>
        </ul>
      </div>

    </div>
  );
}
