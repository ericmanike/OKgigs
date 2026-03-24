import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const dakaziApiKey = process.env.DAKAZI_API_KEY;
    const spendlessApiKey = process.env.SPENDLESS_API_KEY?.trim();

    if (!dakaziApiKey) {
      console.log("Dakazi API key not found");
      return NextResponse.json({ message: "Dakazi API key not found" }, { status: 500 });
    }

    // Fetch Dakazi balance, packages, and Spendless balance in parallel
    const [res1, res2, spendlessRes] = await Promise.all([
      fetch("https://reseller.dakazinabusinessconsult.com/api/v1/check-console-balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${dakaziApiKey}`,
        },
      }),
      fetch("https://reseller.dakazinabusinessconsult.com/api/v1/fetch-data-packages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${dakaziApiKey}`,
        },
      }),
      // Spendless balance (skip if no key)
      spendlessApiKey
        ? fetch("https://spendless.top/api/balance", {
            method: "GET",
            headers: { "X-API-Key": spendlessApiKey },
          })
        : Promise.resolve(null),
    ]);

    const data1 = await res1.json();
    const data2 = await res2.json();

    let spendlessBalance = null;
    if (spendlessRes && spendlessRes.ok) {
      spendlessBalance = await spendlessRes.json();
    }

    const mtndata = data2.filter((item: any) => item.network === "MTN");
    const teleceldata = data2.filter((item: any) => item.network === "TELECEL");
    const airteltigodata = data2.filter((item: any) => item.network.startsWith("AT"));

     console.log({
        AccountBalance: data1,
        spendlessBalance,
       
      })

    return NextResponse.json(
      {
        AccountBalance: data1,
        spendlessBalance,
        mtnpackages: mtndata,
        telecelpackages: teleceldata,
        airteltigopackages: airteltigodata,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error: error }, { status: 500 });
  }
}
