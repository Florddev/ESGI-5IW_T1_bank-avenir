'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { StockDto } from '@workspace/application/dtos';
import { placeOrderSchema, type PlaceOrderFormData } from '@workspace/adapter-common/validators';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@workspace/ui-react/components/dialog';

interface PlaceOrderDialogProps {
    stock: StockDto | null;
    orderType: 'BUY' | 'SELL';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (quantity: number, pricePerShare: number) => Promise<void>;
    maxQuantity?: number;
}

export function PlaceOrderDialog({
    stock,
    orderType,
    open,
    onOpenChange,
    onConfirm,
    maxQuantity,
}: PlaceOrderDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError: setFormError,
    } = useForm<PlaceOrderFormData>({
        resolver: zodResolver(placeOrderSchema),
        defaultValues: {
            stockId: '',
            type: orderType,
            quantity: 0,
            price: 0,
        },
    });

    const quantity = watch('quantity');
    const price = watch('price');

    useEffect(() => {
        if (open && stock) {
            reset({
                stockId: stock.id,
                type: orderType,
                quantity: 0,
                price: stock.currentPrice || 0,
            });
            setError(null);
            setSuccess(false);
        }
    }, [open, stock, orderType, reset]);

    const onSubmit = async (data: PlaceOrderFormData) => {
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);

        if (maxQuantity && data.quantity > maxQuantity) {
            setFormError('quantity', {
                type: 'manual',
                message: `Vous ne possédez que ${maxQuantity} action(s)`,
            });
            setIsSubmitting(false);
            return;
        }

        try {
            await onConfirm(data.quantity, data.price);
            setSuccess(true);
            setTimeout(() => {
                reset();
                setSuccess(false);
                onOpenChange(false);
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalCost = quantity && price
        ? (quantity * price + 1).toFixed(2)
        : '0.00';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {orderType === 'BUY' ? 'Passer un ordre d\'achat' : 'Passer un ordre de vente'}
                    </DialogTitle>
                    <DialogDescription>
                        {stock ? `${stock.symbol} - ${stock.companyName}` : ''}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="quantity">Quantité</Label>
                        <Input
                            id="quantity"
                            type="number"
                            {...register('quantity', { valueAsNumber: true })}
                            placeholder="Nombre d'actions"
                        />
                        {errors.quantity && (
                            <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>
                        )}
                        {maxQuantity && !errors.quantity && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Maximum disponible: {maxQuantity} action(s)
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="price">Prix par action (€)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register('price', { valueAsNumber: true })}
                            placeholder="Prix souhaité"
                        />
                        {errors.price && (
                            <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
                        )}
                        {stock?.currentPrice && !errors.price && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Prix actuel du marché: {stock.currentPrice.toFixed(2)} €
                            </p>
                        )}
                    </div>

                    <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Coût des actions:</span>
                            <span>{((quantity || 0) * (price || 0)).toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Frais de transaction:</span>
                            <span>1.00 €</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                            <span>{orderType === 'BUY' ? 'Coût total:' : 'Montant reçu:'}</span>
                            <span>{totalCost} €</span>
                        </div>
                    </div>

                    {success && (
                        <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-700 dark:text-green-300 font-semibold">
                                ✅ Ordre placé avec succès !
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    )}

                    {!success && (
                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Votre ordre sera placé dans le carnet d'ordres et exécuté automatiquement
                                lorsqu'un ordre correspondant sera trouvé au prix d'équilibre.
                            </p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting || success} className="flex-1">
                            {isSubmitting ? 'Placement...' : success ? 'Ordre placé ✓' : 'Placer l\'ordre'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
