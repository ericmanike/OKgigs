import Order from "@/models/Order";

export async function createOrder(session: any, data: any) {
  const ref = data.reference.trim();

  return await Order.create({
    ...(session?.user?.id ? { user: session.user.id } : {}),
    transaction_id: "paid_" + ref,
    network: data.network,
    bundleName: data.bundleName,
    price: data.price,
    phoneNumber: data.phoneNumber,
    status: "placed",
  });
}