import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import { redirect } from "next/navigation";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  await dbConnect();
  const recentOrders = await Order.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const balanceDoc = await User.findById(session.user.id).select("walletBalance").lean();
  const balance = balanceDoc?.walletBalance ?? 0;

  const userName = session?.user?.name?.split(" ")[0] ?? "User";
  const recentOrdersSerialized = recentOrders.map((o) => ({
    _id: String(o._id),
    transaction_id: o.transaction_id,
    bundleName: o.bundleName,
    network: o.network,
    price: o.price,
    status: o.status,
    createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : String(o.createdAt),
  }));

  return (
    <DashboardContent
      userName={userName}
      balance={balance}
      recentOrders={recentOrdersSerialized}
      isAdmin={session?.user?.role === "admin"}
    />
  );
}
