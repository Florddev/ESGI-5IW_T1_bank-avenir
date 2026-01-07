'use client';

import { useState } from 'react';
import type { StockDto } from '@workspace/application/dtos';
import { Button } from '@workspace/ui-react/components/button';
import { PlaceOrderDialog } from './place-order-dialog';
import { usePlaceOrder } from '../hooks';

interface StockListProps {
    stocks: StockDto[];
    isLoading: boolean;
    mode: 'buy' | 'sell';
}

export function StockList({ stocks, isLoading, mode }: StockListProps) {
    const [selectedStock, setSelectedStock] = useState<StockDto | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { placeOrder } = usePlaceOrder();

    const handleOpenDialog = (stock: StockDto) => {
        setSelectedStock(stock);
        setDialogOpen(true);
    };

    const handlePlaceOrder = async (quantity: number, pricePerShare: number) => {
        if (!selectedStock) return;

        await placeOrder(
            selectedStock.id,
            mode === 'buy' ? 'BUY' : 'SELL',
            quantity,
            pricePerShare
        );
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded" />
                ))}
            </div>
        );
    }

    if (stocks.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>Aucune action disponible</p>
            </div>
        );
    }

    return (
        <>
            <div className="p-6">
                <div className="divide-y">
                    {stocks.map((stock) => (
                        <div key={stock.id} className="py-4 flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h4 className="font-semibold text-lg">{stock.symbol}</h4>
                                        <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        stock.status === 'AVAILABLE'
                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                    }`}>
                                        {stock.status === 'AVAILABLE' ? 'Disponible' : 'Indisponible'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-2xl font-bold">
                                        {stock.currentPrice ? `${stock.currentPrice.toFixed(2)} €` : 'N/A'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Prix actuel</p>
                                </div>
                                {stock.status === 'AVAILABLE' && (
                                    <Button
                                        onClick={() => handleOpenDialog(stock)}
                                        variant={mode === 'buy' ? 'default' : 'outline'}
                                    >
                                        {mode === 'buy' ? 'Acheter' : 'Vendre'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <PlaceOrderDialog
                stock={selectedStock}
                orderType={mode === 'buy' ? 'BUY' : 'SELL'}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handlePlaceOrder}
            />
        </>
    );
}
