import '@/lib/di';
import { NextRequest, NextResponse } from 'next/server';
import { StocksController } from '@workspace/adapter-next/controllers';

export async function POST(request: NextRequest) {
    try {
        const { stockId } = await request.json();

        if (!stockId) {
            return NextResponse.json(
                { error: 'Stock ID is required' },
                { status: 400 }
            );
        }

        const controller = new StocksController();
        const matches = await controller.matchOrders(stockId);
        const equilibriumData = await controller.calculateEquilibriumPrice(stockId);

        return NextResponse.json({
            success: true,
            matches: matches.map(match => ({
                buyOrderId: match.buyOrder.id,
                sellOrderId: match.sellOrder.id,
                quantity: match.quantity,
                executionPrice: match.price,
            })),
            equilibrium: equilibriumData,
            matchCount: matches.length,
        });
    } catch (error) {
        console.error('Error matching orders:', error);
        return NextResponse.json(
            { error: 'Failed to match orders' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const stockId = searchParams.get('stockId');

        if (!stockId) {
            return NextResponse.json(
                { error: 'Stock ID is required' },
                { status: 400 }
            );
        }

        const controller = new StocksController();
        const equilibriumData = await controller.calculateEquilibriumPrice(stockId);

        return NextResponse.json(equilibriumData);
    } catch (error) {
        console.error('Error calculating equilibrium price:', error);
        return NextResponse.json(
            { error: 'Failed to calculate equilibrium price' },
            { status: 500 }
        );
    }
}
