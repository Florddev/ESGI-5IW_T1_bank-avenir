import { NextRequest, NextResponse } from 'next/server';
import { MatchOrdersUseCase, CalculateEquilibriumPriceUseCase } from '@workspace/application/use-cases';
import { getServerContainer } from '@/lib/di';
import '@/lib/di';

export async function POST(request: NextRequest) {
    try {
        const { stockId } = await request.json();

        if (!stockId) {
            return NextResponse.json(
                { error: 'Stock ID is required' },
                { status: 400 }
            );
        }

        const container = getServerContainer();
        const matchOrdersUseCase = container.resolve(MatchOrdersUseCase);
        const calculateEquilibriumPriceUseCase = container.resolve(CalculateEquilibriumPriceUseCase);

        const matches = await matchOrdersUseCase.execute(stockId);
        
        const equilibriumData = await calculateEquilibriumPriceUseCase.execute(stockId);

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

        const container = getServerContainer();
        const calculateEquilibriumPriceUseCase = container.resolve(CalculateEquilibriumPriceUseCase);

        const equilibriumData = await calculateEquilibriumPriceUseCase.execute(stockId);

        return NextResponse.json(equilibriumData);
    } catch (error) {
        console.error('Error calculating equilibrium price:', error);
        return NextResponse.json(
            { error: 'Failed to calculate equilibrium price' },
            { status: 500 }
        );
    }
}
