'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@workspace/ui-react/components/form';
import { loginSchema } from '@workspace/adapter-common';
import type { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="exemple@email.com"
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
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
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
                    {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
            </form>
        </Form>
    );
}
