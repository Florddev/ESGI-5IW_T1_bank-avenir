'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { useTranslations } from '@workspace/ui-react/contexts';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui-react/components/form';
import { loginSchema } from '@workspace/adapter-common';
import type { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const t = useTranslations();
    const { login, isLoading, error } = useLogin();
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        await login(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('common.labels.email')}</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder={t('common.placeholders.emailPlaceholder')}
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('entities.user.fields.password')}</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder={t('common.placeholders.passwordPlaceholder')}
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
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
                    {isLoading ? t('features.auth.actions.login.loading') : t('features.auth.actions.login.label')}
                </Button>
            </form>
        </Form>
    );
}
