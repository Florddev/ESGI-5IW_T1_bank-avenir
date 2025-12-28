import { NextRequest, NextResponse } from 'next/server';
import { initializeDI } from '@/lib/di';
import { logoutHandler } from '@workspace/adapter-next/api/handlers';

export async function POST(request: NextRequest): Promise<NextResponse> {
    initializeDI();
    return logoutHandler(request);
}
