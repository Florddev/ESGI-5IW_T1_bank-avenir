'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Textarea } from '@workspace/ui-react/components/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';
import { createConversationSchema, type CreateConversationFormData } from '@workspace/adapter-common/validators';

interface CreateConversationFormProps {
    onSubmit: (data: CreateConversationFormData) => Promise<void>;
    isLoading?: boolean;
}

export function CreateConversationForm({ onSubmit, isLoading }: CreateConversationFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateConversationFormData>({
        resolver: zodResolver(createConversationSchema),
        defaultValues: {
            subject: '',
            message: '',
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Nouveau message</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="subject">Sujet</Label>
                        <Input
                            id="subject"
                            {...register('subject')}
                            placeholder="Objet"
                            disabled={isLoading}
                        />
                        {errors.subject && (
                            <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            {...register('message')}
                            placeholder="Votre message..."
                            rows={4}
                            disabled={isLoading}
                        />
                        {errors.message && (
                            <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Envoi...' : 'Envoyer'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
