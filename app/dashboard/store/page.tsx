import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AgentStoreSettings from "@/components/ui/AgentStoreSettings";

export const metadata = {
  title: "My Shop | MegaGigs Dashboard",
};

export default async function StorePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const isAgent = session.user.role === "agent" || session.user.role === "admin";
  if (!isAgent) redirect("/dashboard");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-zinc-900">My Shop Dashboard</h2>

      </div>
      <AgentStoreSettings />
    </div>
  );
}
 