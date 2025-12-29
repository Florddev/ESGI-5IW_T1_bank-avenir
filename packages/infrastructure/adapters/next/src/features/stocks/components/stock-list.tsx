'use client';

import type { StockDto } from '@workspace/application/dtos';
import { Button } from '@workspace/ui-react/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';

interface StockListProps {
    stocks: StockDto[];
    onBuy?: (stockId: string) => void;
}

export function StockList({ stocks, onBuy }: StockListProps) {
    if (stocks.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucune action disponible
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stocks.map((stock) => (
                <Card key={stock.id}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>{stock.symbol}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                                stock.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {stock.status}
                            </span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {stock.currentPrice && (
                                <div className="flex justify-between">
                                    <span className="text-sm">Prix:</span>
                                    <span className="text-sm font-medium">{stock.currentPrice.toFixed(2)} €</span>
                                </div>
                            )}
                            {onBuy && stock.status === 'AVAILABLE' && (
                                <Button 
                                    onClick={() => onBuy(stock.id)} 
                                    className="w-full mt-2"
                                    size="sm"
                                >
                                    Acheter
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
