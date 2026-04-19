import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const response = await fetch('https://api.datamartgh.shop/api/developer/data-packages?network=YELLO', {
            method: 'GET',
            headers: {
                'x-api-key': process.env.DATA_MART_API_KEY as string,
                'content-type': 'application/json',
            },
        });
        const data = await response.json();
        console.log(data);
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        console.error('DataMart API Error:', error.response?.data || error.message);
        return NextResponse.json({
            message: 'Failed to fetch packages',
            details: error.response?.data || error.message
        });
    }
}

