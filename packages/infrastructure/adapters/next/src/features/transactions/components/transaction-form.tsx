'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransactionOperations } from '../hooks/useTransactionOperations';
import { depositSchema, withdrawSchema, transferSchema, type DepositFormData, type WithdrawFormData, type TransferFormData } from '@workspace/adapters-common/validators/transaction.validator';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui-react/components/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui-react/components/tabs';

interface TransactionFormProps {
    accountId: string;
    onSuccess?: () => void;
}

export function TransactionForm({ accountId, onSuccess }: TransactionFormProps) {
    const { deposit, withdraw, transfer, isLoading, error } = useTransactionOperations();

    const depositForm = useForm<DepositFormData>({
        resolver: zodResolver(depositSchema),
        defaultValues: {
            accountId,
            amount: 0,
        },
    });

    const withdrawForm = useForm<WithdrawFormData>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            accountId,
            amount: 0,
        },
    });

    const transferForm = useForm<TransferFormData>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            fromAccountId: accountId,
            toAccountId: '',
            amount: 0,
            description: '',
        },
    });

    const onDeposit = async (data: DepositFormData) => {
        try {
            await deposit(data);
            depositForm.reset({ accountId, amount: 0 });
            onSuccess?.();
        } catch (err) {}
    };

    const onWithdraw = async (data: WithdrawFormData) => {
        try {
            await withdraw(data);
            withdrawForm.reset({ accountId, amount: 0 });
            onSuccess?.();
        } catch (err) {}
    };

    const onTransfer = async (data: TransferFormData) => {
        try {
            await transfer(data);
            transferForm.reset({ fromAccountId: accountId, toAccountId: '', amount: 0, description: '' });
            onSuccess?.();
        } catch (err) {}
    };

    return (
        <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="deposit">Dépôt</TabsTrigger>
                <TabsTrigger value="withdraw">Retrait</TabsTrigger>
                <TabsTrigger value="transfer">Transfert</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit">
                <Form {...depositForm}>
                    <form onSubmit={depositForm.handleSubmit(onDeposit)} className="space-y-4">
                        <FormField
                            control={depositForm.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Montant (€)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            disabled={isLoading}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <div className="text-sm text-destructive">{error}</div>}
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? 'Dépôt en cours...' : 'Déposer'}
                        </Button>
                    </form>
                </Form>
            </TabsContent>

            <TabsContent value="withdraw">
                <Form {...withdrawForm}>
                    <form onSubmit={withdrawForm.handleSubmit(onWithdraw)} className="space-y-4">
                        <FormField
                            control={withdrawForm.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Montant (€)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            disabled={isLoading}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <div className="text-sm text-destructive">{error}</div>}
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? 'Retrait en cours...' : 'Retirer'}
                        </Button>
                    </form>
                </Form>
            </TabsContent>

            <TabsContent value="transfer">
                <Form {...transferForm}>
                    <form onSubmit={transferForm.handleSubmit(onTransfer)} className="space-y-4">
                        <FormField
                            control={transferForm.control}
                            name="toAccountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Compte destinataire</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            disabled={isLoading}
                                            placeholder="ID du compte"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={transferForm.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Montant (€)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            disabled={isLoading}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={transferForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (optionnel)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <div className="text-sm text-destructive">{error}</div>}
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? 'Transfert en cours...' : 'Transférer'}
                        </Button>
                    </form>
                </Form>
            </TabsContent>
        </Tabs>
    );
}
