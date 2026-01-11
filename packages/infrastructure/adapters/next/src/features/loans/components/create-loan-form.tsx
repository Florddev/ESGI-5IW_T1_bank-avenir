'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui-react/components/select';
import { createLoanSchema, type CreateLoanFormData } from '@workspace/adapter-common/validators';
import { useLoanCalculation } from '../hooks';

interface CreateLoanFormProps {
    onSubmit: (data: CreateLoanFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    clients?: Array<{ id: string; firstName: string; lastName: string }>;
}

export function CreateLoanForm({ onSubmit, onCancel, isLoading, clients = [] }: CreateLoanFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm<CreateLoanFormData>({
        resolver: zodResolver(createLoanSchema),
        defaultValues: {
            userId: '',
            accountId: '',
            principal: 0,
            annualInterestRate: 3.5,
            insuranceRate: 0.36,
            durationMonths: 120,
        },
    });

    const principal = watch('principal');
    const annualInterestRate = watch('annualInterestRate');
    const insuranceRate = watch('insuranceRate');
    const durationMonths = watch('durationMonths');

    const calculation = useLoanCalculation({
        principal,
        annualInterestRate,
        insuranceRate,
        durationMonths,
    });

    return (
        <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Octroyer un nouveau crédit</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="userId">Client</Label>
                        <Controller
                            name="userId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.firstName} {client.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.userId && (
                            <p className="text-sm text-destructive mt-1">{errors.userId.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="accountId">Compte</Label>
                        <Input
                            id="accountId"
                            {...register('accountId')}
                            placeholder="ID du compte"
                            disabled={isLoading}
                        />
                        {errors.accountId && (
                            <p className="text-sm text-destructive mt-1">{errors.accountId.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="principal">Montant du crédit (€)</Label>
                    <Input
                        id="principal"
                        type="number"
                        step="0.01"
                        {...register('principal', { valueAsNumber: true })}
                        placeholder="Ex: 10000"
                        disabled={isLoading}
                    />
                    {errors.principal && (
                        <p className="text-sm text-destructive mt-1">{errors.principal.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="annualInterestRate">Taux annuel (%)</Label>
                        <Input
                            id="annualInterestRate"
                            type="number"
                            step="0.01"
                            {...register('annualInterestRate', { valueAsNumber: true })}
                            placeholder="Ex: 3.5"
                            disabled={isLoading}
                        />
                        {errors.annualInterestRate && (
                            <p className="text-sm text-destructive mt-1">{errors.annualInterestRate.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="insuranceRate">Taux assurance (%)</Label>
                        <Input
                            id="insuranceRate"
                            type="number"
                            step="0.01"
                            {...register('insuranceRate', { valueAsNumber: true })}
                            placeholder="Ex: 0.36"
                            disabled={isLoading}
                        />
                        {errors.insuranceRate && (
                            <p className="text-sm text-destructive mt-1">{errors.insuranceRate.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="durationMonths">Durée (mois)</Label>
                        <Input
                            id="durationMonths"
                            type="number"
                            {...register('durationMonths', { valueAsNumber: true })}
                            placeholder="Ex: 120"
                            disabled={isLoading}
                        />
                        {errors.durationMonths && (
                            <p className="text-sm text-destructive mt-1">{errors.durationMonths.message}</p>
                        )}
                    </div>
                </div>

                {calculation && (
                    <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Calcul estimatif</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Mensualité</p>
                                <p className="font-semibold">{calculation.monthlyPayment.toFixed(2)} €</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Coût total</p>
                                <p className="font-semibold">{calculation.totalCost.toFixed(2)} €</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Coût crédit</p>
                                <p className="font-semibold">{calculation.totalInterest.toFixed(2)} €</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Création...' : 'Octroyer le crédit'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Annuler
                    </Button>
                </div>
            </form>
        </div>
    );
}
