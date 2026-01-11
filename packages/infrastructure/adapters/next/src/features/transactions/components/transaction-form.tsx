'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from '@workspace/ui-react/contexts';
import { useTransactionOperations } from '../hooks/useTransactionOperations';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { depositSchema, withdrawSchema, transferSchema, type DepositFormData, type WithdrawFormData, type TransferFormData } from '@workspace/adapter-common/validators';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui-react/components/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui-react/components/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui-react/components/select';

interface TransactionFormProps {
    onSuccess?: () => void;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
    const t = useTranslations();
    const { deposit, withdraw, transfer, isLoading, error } = useTransactionOperations();
    const { accounts, isLoading: accountsLoading } = useAccounts();

    const depositForm = useForm<DepositFormData>({
        resolver: zodResolver(depositSchema),
        defaultValues: {
            accountId: '',
            amount: 0,
        },
    });

    const withdrawForm = useForm<WithdrawFormData>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            accountId: '',
            amount: 0,
        },
    });

    const transferForm = useForm<TransferFormData>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            fromAccountId: '',
            toAccountId: '',
            amount: 0,
            description: '',
        },
    });

    const onDeposit = async (data: DepositFormData) => {
        try {
            await deposit(data);
            depositForm.reset({ accountId: '', amount: 0 });
            onSuccess?.();
        } catch (err) {}
    };

    const onWithdraw = async (data: WithdrawFormData) => {
        try {
            await withdraw(data);
            withdrawForm.reset({ accountId: '', amount: 0 });
            onSuccess?.();
        } catch (err) {}
    };

    const onTransfer = async (data: TransferFormData) => {
        try {
            await transfer(data);
            transferForm.reset({ fromAccountId: '', toAccountId: '', amount: 0, description: '' });
            onSuccess?.();
        } catch (err) {}
    };

    return (
        <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="deposit">{t('features.transactions.labels.deposit')}</TabsTrigger>
                <TabsTrigger value="withdraw">{t('features.transactions.labels.withdraw')}</TabsTrigger>
                <TabsTrigger value="transfer">{t('features.transactions.labels.transfer')}</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit">
                <Form {...depositForm}>
                    <form onSubmit={depositForm.handleSubmit(onDeposit)} className="space-y-4">
                        <FormField
                            control={depositForm.control}
                            name="accountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('features.transactions.labels.accountToCredit')}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={accountsLoading || isLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un compte" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {accounts?.map((account) => (
                                                <SelectItem key={account.id} value={account.id}>
                                                    {account.customName} - {account.balance.toFixed(2)} €
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <Button type="submit" disabled={isLoading || accountsLoading} className="w-full">
                            {isLoading ? t('features.transactions.actions.depositInProgress') : t('features.transactions.actions.makeDeposit')}
                        </Button>
                    </form>
                </Form>
            </TabsContent>

            <TabsContent value="withdraw">
                <Form {...withdrawForm}>
                    <form onSubmit={withdrawForm.handleSubmit(onWithdraw)} className="space-y-4">
                        <FormField
                            control={withdrawForm.control}
                            name="accountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('features.transactions.labels.accountToDebit')}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={accountsLoading || isLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un compte" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {accounts?.map((account) => (
                                                <SelectItem key={account.id} value={account.id}>
                                                    {account.customName} - {account.balance.toFixed(2)} €
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <Button type="submit" disabled={isLoading || accountsLoading} className="w-full">
                            {isLoading ? t('features.transactions.actions.withdrawInProgress') : t('features.transactions.actions.makeWithdraw')}
                        </Button>
                    </form>
                </Form>
            </TabsContent>

            <TabsContent value="transfer">
                <Form {...transferForm}>
                    <form onSubmit={transferForm.handleSubmit(onTransfer)} className="space-y-4">
                        <FormField
                            control={transferForm.control}
                            name="fromAccountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Compte source</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={accountsLoading || isLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un compte" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {accounts?.map((account) => (
                                                <SelectItem key={account.id} value={account.id}>
                                                    {account.customName} - {account.balance.toFixed(2)} €
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={transferForm.control}
                            name="toAccountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Compte destinataire</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={accountsLoading || isLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un compte" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {accounts?.map((account) => (
                                                <SelectItem key={account.id} value={account.id}>
                                                    {account.customName} - {account.balance.toFixed(2)} €
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                        <Button type="submit" disabled={isLoading || accountsLoading} className="w-full">
                            {isLoading ? 'Transfert en cours...' : 'Transférer'}
                        </Button>
                    </form>
                </Form>
            </TabsContent>
        </Tabs>
    );
}
