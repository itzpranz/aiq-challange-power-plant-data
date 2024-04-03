import { getPowerPlantData } from '@/lib/service';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {    
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || "10");
    const state = request.nextUrl.searchParams.get('state') || "All";

    const data = getPowerPlantData(state, limit);

    return NextResponse.json(data, {
        status: 200
    });
}