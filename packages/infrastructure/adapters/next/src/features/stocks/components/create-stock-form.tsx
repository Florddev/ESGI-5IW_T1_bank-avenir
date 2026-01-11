'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Textarea } from '@workspace/ui-react/components/textarea';

// Simplified schema - only fields currently supported by the API
const createStockFormSchema = z.object({
    symbol: z
        .string()
        .min(1, 'Le symbole est requis')
        .max(10, 'Le symbole ne peut pas dépasser 10 caractères')
        .regex(/^[A-Z]+$/, 'Le symbole doit contenir uniquement des lettres majuscules'),
    companyName: z
        .string()
        .min(2, 'Le nom de la société doit contenir au moins 2 caractères')
        .max(100, 'Le nom de la société ne peut pas dépasser 100 caractères'),
    description: z
        .string()
        .optional(),
    initialPrice: z
        .number()
        .positive('Le prix initial doit être positif')
        .optional(),
});

type CreateStockFormData = z.infer<typeof createStockFormSchema>;

interface CreateStockFormProps {
    onSubmit: (data: { symbol: string; companyName: string }) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
    error: string | null;
}

export function CreateStockForm({ onSubmit, onCancel, isLoading, error }: CreateStockFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateStockFormData>({
        resolver: zodResolver(createStockFormSchema),
        defaultValues: {
            symbol: '',
            companyName: '',
            description: '',
            initialPrice: undefined,
        },
    });

    const handleFormSubmit = async (data: CreateStockFormData) => {
        // Only submit fields currently supported by the API
        await onSubmit({
            symbol: data.symbol,
            companyName: data.companyName,
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="symbol">Symbole</Label>
                    <Input
                        id="symbol"
                        {...register('symbol')}
                        placeholder="Ex: AAPL"
                    />
                    {errors.symbol && (
                        <p className="text-sm text-destructive mt-1">{errors.symbol.message}</p>
                    )}
                    {!errors.symbol && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Code boursier unique (3-5 caractères)
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="initialPrice">Prix initial (€)</Label>
                    <Input
                        id="initialPrice"
                        type="number"
                        step="0.01"
                        {...register('initialPrice', { valueAsNumber: true })}
                        placeholder="Ex: 150.00"
                    />
                    {errors.initialPrice && (
                        <p className="text-sm text-destructive mt-1">{errors.initialPrice.message}</p>
                    )}
                </div>
            </div>

            <div>
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                    id="companyName"
                    {...register('companyName')}
                    placeholder="Ex: Apple Inc."
                />
                {errors.companyName && (
                    <p className="text-sm text-destructive mt-1">{errors.companyName.message}</p>
                )}
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Description de l'entreprise et de son secteur d'activité..."
                    rows={4}
                />
                {errors.description && (
                    <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Création...' : 'Créer l\'action'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Annuler
                </Button>
            </div>
        </form>
    );
}
