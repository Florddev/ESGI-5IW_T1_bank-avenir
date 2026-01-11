'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from '@workspace/ui-react/contexts';
import { useCreateAccount } from '../hooks/useCreateAccount';
import { createAccountSchema, type CreateAccountFormData } from '@workspace/adapter-common/validators';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui-react/components/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui-react/components/select';

interface CreateAccountFormProps {
    userId: string;
    onSuccess?: () => void;
}

export function CreateAccountForm({ userId, onSuccess }: CreateAccountFormProps) {
    const t = useTranslations();
    const { createAccount, isLoading, error } = useCreateAccount();
    const form = useForm<CreateAccountFormData>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            customName: '',
            type: 'CHECKING',
        },
    });

    const onSubmit = async (data: CreateAccountFormData) => {
        try {
            await createAccount({ userId, customName: data.customName, type: data.type });
            form.reset();
            onSuccess?.();
        } catch (err) {}
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="customName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('features.accounts.labels.accountName')}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    disabled={isLoading}
                                    placeholder={t('features.accounts.placeholders.myCheckingAccount')}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('features.accounts.labels.accountType')}</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={isLoading}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="CHECKING">{t('features.accounts.labels.checkingAccount')}</SelectItem>
                                    <SelectItem value="SAVINGS">{t('features.accounts.labels.savingsAccount')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? t('features.accounts.actions.creating') : t('features.accounts.actions.createAccount')}
                </Button>
            </form>
        </Form>
    );
}
