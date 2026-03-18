import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Setting from "@/models/Setting";



export async function POST(req: Request) {
  try {
    
    // Session is optional — guests can place orders too
    const session = await getServerSession(authOptions);

    // const ip = session.user.id;
    // console.log(  'order rate limit identifier:', ip)
    // const { success } = await orderRateLimit.limit(ip);

    // if (!success) {
    //   return NextResponse.json({ message: "Too many order attempts. Please try again later." }, { status: 429 });
    // }

    const { network, bundleName, price, phoneNumber, reference, agentId, agentProfit } = await req.json();

    console.log('Received data:', { network, bundleName, price, phoneNumber, reference, agentId, agentProfit });

    if (!network || !bundleName || !price || !phoneNumber || !reference) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const ordersClosedDoc = await Setting.findOne({ key: "ordersClosed" }).select("value");
    if (Boolean(ordersClosedDoc?.value) && session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Orders are currently closed" }, { status: 403 });
    }

    // prevent replay attack
    const existingOrder = await Order.findOne({ transaction_id: reference });
    if (existingOrder) {
      return NextResponse.json({ message: "Duplicate transaction reference" }, { status: 409 });
    }


    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    const DAKAZI_API_KEY = process.env.DAKAZI_API_KEY

    if (!PAYSTACK_SECRET_KEY || !DAKAZI_API_KEY) {
      //console.log('Paystack secret key not found')
      return NextResponse.json({ message: "unexpected error occurred" }, { status: 500 });
    }

    let networkId;
    if (network === "MTN") {
      networkId = 3;
    } else if (network === "TELECEL") {
      networkId = 2;
    } else if (network.startsWith("AT")) {
      networkId = 4;
    } else {
      return NextResponse.json({ message: "Invalid network" }, { status: 400 });
    }

    console.log('Network ID:', networkId);
    if (!networkId) {
      return NextResponse.json({ message: "Invalid network" }, { status: 400 });
    }



    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    })

    const paystackData = await verifyResponse.json()

    //  console.log('Payment verification response:', paystackData)
    if (!paystackData.data) {
      console.log('Payment verification failed no data')
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }

    const { amount } = paystackData.data


    const tax = 0.02 * price
    let total = price + tax
    console.log('Total before rounding:', total)
    total = Math.round(total * 100) / 100
    console.log('Total after rounding:', total)


    console.log('Expected price:')
    console.log('Payment amount:', amount / 100)

    if (amount / 100 !== Number(total)) {
      console.log('Payment amount does not match')
      return NextResponse.json({ message: "Payment amount does not match" }, { status: 400 });
    }

    if (paystackData.data.status !== 'success') {
      console.log('Payment verification failed')
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }


    const ref = reference.trim()
    const order = await Order.create({
      ...(session?.user?.id ? { user: session.user.id } : {}),
      transaction_id: "paid_" + ref,
      network: network,
      bundleName: bundleName,
      price: price,
      phoneNumber: phoneNumber,
      status: 'pending',
    });


    //place order
    const placeOrder = await fetch(
      "https://reseller.dakazinabusinessconsult.com/api/v1/buy-data-package",
      {
        method: "POST",
        headers: {

          "Content-Type": "application/json",
          "x-api-key": `${DAKAZI_API_KEY}`,
        },
        body: JSON.stringify({
          recipient_msisdn: phoneNumber.trim(),
          network_id: networkId,
          shared_bundle: Number(bundleName),
          incoming_api_ref: reference
        })
      }
    );


      const raw = await placeOrder.text();
    

     let Orderres;
    try {
    
      Orderres = JSON.parse(raw);
      console.log(Orderres);

    } catch (error) {
      console.error("Order creation error:", error);
      return NextResponse.json({ message: "Error creating order" }, { status: 500 });
    }

    if (!placeOrder.ok) {

      NextResponse.json({ error: ' could not place an order' })

    }

    if (Orderres.transaction_code) {
      console.log('New order created with id ', Orderres.transaction_code)
      order.transaction_id = Orderres.transaction_code
      order.status = 'pending'
      await order.save()

      if (agentId) {
        try {
          const AgentStore = (await import('@/models/AgentStore')).default;
          await AgentStore.findOneAndUpdate(
            { user: agentId },
            { $inc: { totalSalesCount: 1, totalProfit: Number(agentProfit) || 0 } }
          );
        } catch (err) {
          console.error("Failed to update agent store stats:", err);
        }
      }
    }

    console.log('New order created successfully throught the API:', order);


    console.log(' purchase order response:', Orderres)




    console.log('📦 New order created:', order);
    return NextResponse.json({ message: "Order created successfully", order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ message: "Error creating order" }, { status: 500 });
  }
}
