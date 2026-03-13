import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata = {
  title: "Quick Actions | MegaGigs Dashboard",
};

export default async function QuickActionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Quick Actions</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Buy data or manage your account</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* MTN */}
        <Link href="/buy?network=MTN" className="group">
          <Card className="overflow-hidden border-zinc-200/80 shadow-sm hover:shadow-lg hover:border-amber-300/60 transition-all duration-200 group-hover:-translate-y-0.5">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-lg shadow-sm">
                M
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900">MTN</p>
                <p className="text-xs text-zinc-500">Buy Data</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Telecel */}
        <Link href="/buy?network=Telecel" className="group">
          <Card className="overflow-hidden border-zinc-200/80 shadow-sm hover:shadow-lg hover:border-red-300/60 transition-all duration-200 group-hover:-translate-y-0.5">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                T
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900">Telecel</p>
                <p className="text-xs text-zinc-500">Buy Data</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* AirtelTigo */}
        <Link href="/buy?network=AirtelTigo" className="group">
          <Card className="overflow-hidden border-zinc-200/80 shadow-sm hover:shadow-lg hover:border-blue-300/60 transition-all duration-200 group-hover:-translate-y-0.5">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                A
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900">AirtelTigo</p>
                <p className="text-xs text-zinc-500">Buy Data</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* AFA Registration */}
        <Link href="/afa-registration" className="group">
          <Card className="overflow-hidden border-zinc-200/80 shadow-sm hover:shadow-lg hover:border-amber-300/60 transition-all duration-200 group-hover:-translate-y-0.5">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-lg shadow-sm">
                A
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900">AFA</p>
                <p className="text-xs text-zinc-500">Registration</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
