
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

  const body = await req.json();
  const { phoneNumber, network, capacity } = body;

  // Validate required fields
  if (!phoneNumber || !network || !capacity) {
    return NextResponse.json({
      message: 'Missing required fields'
    });
  }

  try {
    const response = await fetch('https://api.datamartgh.shop/api/developer/purchase',
      {
        method: 'POST',
        headers: {
          'x-api-key': process.env.DATAMART_API_KEY as string,
          'content-type': 'application/json',

        },

        body: JSON.stringify({
          phoneNumber,
          network,
          capacity,
          gateway: 'wallet'
        })

      }
    );
    const data = await response.json()

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('DataMart API Error:', error.response?.data || error.message);

    return NextResponse.json({
      message: 'Failed to purchase data bundle',
      details: error.response?.data || error.message
    });
  }
}
